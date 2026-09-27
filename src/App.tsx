import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleHelp,
  Database,
  GraduationCap,
  Heart,
  LayoutDashboard,
  Leaf,
  Menu,
  Plus,
  Search,
  Share2,
  Shield,
  Sparkles,
  TrendingUp,
  Undo2,
  X,
  Globe2,
  SlidersHorizontal,
  BarChart3,
} from "lucide-react";
import { Logo } from "./components/Logo";
import { ThemeToggle } from "./components/ThemeToggle";
import { Dialog } from "./components/Dialog";
import { DataTable, IndicatorCard } from "./components/IndicatorCard";
import { loadCatalog, loadDataset } from "./lib/data";
import { categories } from "./lib/model";
import type {
  Card,
  CatalogEntry,
  Category,
  Dataset,
  Preset,
} from "./lib/model";
import {
  decodePanel,
  initialPanel,
  panelReducer,
  serializable,
} from "./lib/panel";
import {
  formatNumber,
  formatPeriod,
  matches,
  mergeReason,
  queryData,
  rangeFor,
} from "./lib/query";
import type { QueryResult } from "./lib/query";
import { detailOptions, detailRoute } from "./lib/routing";

const Chart = lazy(() => import("./components/AtlasChart"));
const icons = {
  economia: TrendingUp,
  educacao: GraduationCap,
  saude: Heart,
  seguranca: Shield,
  "meio-ambiente": Leaf,
  internacional: Globe2,
};
const STORAGE = "brasadados_panel_v1";
function readHash() {
  return window.location.hash.slice(1) || "/";
}
function useMobile() {
  const [mobile, setMobile] = useState(
    () => matchMedia("(max-width: 767px)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(max-width: 767px)");
    const change = () => setMobile(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  return mobile;
}
function initialState(catalog: CatalogEntry[]) {
  const ids = new Set(catalog.map((c) => c.id));
  const shared = new URLSearchParams(readHash().split("?")[1]).get("s");
  if (shared) return decodePanel(shared, ids);
  try {
    const saved = decodePanel(localStorage.getItem(STORAGE) ?? "", ids);
    return {
      ...saved,
      preset: detailOptions(readHash()).preset ?? saved.preset,
    };
  } catch {
    return { ...initialPanel };
  }
}
export default function App() {
  const [catalog, setCatalog] = useState<CatalogEntry[] | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    loadCatalog()
      .then((c) => {
        if (active) setCatalog(c);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  if (!catalog)
    return (
      <div className="boot">
        <Logo />
        <p>{error || "Preparando o catálogo de dados públicos…"}</p>
        {error && (
          <button
            className="primary"
            onClick={() => {
              setError("");
              setAttempt((x) => x + 1);
            }}
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  return <AtlasApp catalog={catalog} />;
}
function AtlasApp({ catalog }: { catalog: CatalogEntry[] }) {
  const mobile = useMobile();
  const [state, dispatch] = useReducer(panelReducer, catalog, initialState);
  const [route, setRoute] = useState(readHash);
  const [data, setData] = useState<Record<string, Dataset>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [picker, setPicker] = useState<{ target?: string } | null>(null);
  const [about, setAbout] = useState(false);
  const [dragged, setDragged] = useState<string | null>(null);
  const [panelTab, setPanelTab] = useState<"charts" | "table">("charts");
  const [message, setMessage] = useState("");
  const [detailSettings, setDetailSettings] = useState<Record<string, Card>>(
    () => {
      const entry = catalog.find(
        (c) => "/indicador/" + c.slug === readHash().split("?")[0],
      );
      return entry
        ? {
            [entry.id]: {
              id: "detail-" + entry.id,
              indicatorId: entry.id,
              ...detailOptions(readHash()),
            },
          }
        : {};
    },
  );
  const [focusRequest, setFocusRequest] = useState<string | null>(null);
  const pathname = route.split("?")[0];
  const selected = pathname.startsWith("/indicador/")
    ? catalog.find((c) => c.slug === pathname.slice("/indicador/".length))
    : undefined;
  const isDetail = Boolean(selected);
  const isExplore = pathname === "/explorar" || (pathname === "/" && mobile);
  const isMissingRoute = pathname.startsWith("/indicador/") && !selected;
  const navigate = (path: string) => {
    if (readHash() !== path) window.location.hash = path;
  };

  useEffect(() => {
    const change = () => {
      const next = readHash();
      setRoute(next);
      setPicker(null);
      setAbout(false);
      const raw = new URLSearchParams(next.split("?")[1]).get("s");
      if (raw)
        dispatch({
          type: "restore",
          panel: decodePanel(raw, new Set(catalog.map((c) => c.id))),
        });
      const entry = catalog.find(
        (c) => "/indicador/" + c.slug === next.split("?")[0],
      );
      if (entry && next.includes("?")) {
        const options = detailOptions(next);
        setDetailSettings((p) => ({
          ...p,
          [entry.id]: {
            id: "detail-" + entry.id,
            indicatorId: entry.id,
            ...options,
          },
        }));
        if (options.preset)
          dispatch({ type: "preset", preset: options.preset });
      }
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, [catalog]);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(serializable(state)));
    } catch {
      /* Keep the in-memory panel usable. */
    }
  }, [state]);
  useEffect(() => {
    if (!message && (!state.notice || state.undo)) return;
    const timeout = window.setTimeout(() => {
      setMessage("");
      if (!state.undo) dispatch({ type: "dismiss" });
    }, 6000);
    return () => window.clearTimeout(timeout);
  }, [message, state.notice, state.undo]);
  const neededIds = [
    ...new Set([
      ...state.cards.map((c) => c.indicatorId),
      ...(selected ? [selected.id] : []),
    ]),
  ].join(",");
  useEffect(() => {
    let active = true;
    neededIds
      .split(",")
      .filter(Boolean)
      .forEach((id) => {
        void loadDataset(id)
          .then((d) => {
            if (active) {
              setData((p) => ({ ...p, [id]: d }));
              setErrors((p) => {
                const next = { ...p };
                delete next[id];
                return next;
              });
            }
          })
          .catch((e) => {
            if (active) setErrors((p) => ({ ...p, [id]: e.message }));
          });
      });
    return () => {
      active = false;
    };
  }, [neededIds, attempt]);
  useEffect(() => {
    const cancel = () => setDragged(null);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancel();
    };
    window.addEventListener("dragend", cancel);
    window.addEventListener("drop", cancel);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("dragend", cancel);
      window.removeEventListener("drop", cancel);
      window.removeEventListener("keydown", key);
    };
  }, []);

  const sorted = useMemo(
    () =>
      [...catalog].sort(
        (a, b) =>
          Number(b.status === "verified") - Number(a.status === "verified") ||
          a.titulo.localeCompare(b.titulo, "pt-BR"),
      ),
    [catalog],
  );
  const filtered = sorted.filter(
    (c) =>
      (category === "all" || category === c.categoria) &&
      (!verifiedOnly || c.status === "verified") &&
      matches(c, search),
  );
  const loaded = state.cards.flatMap((c) =>
    data[c.indicatorId] ? [{ card: c, data: data[c.indicatorId] }] : [],
  );
  const range = rangeFor(
    selected && data[selected.id]
      ? [data[selected.id]]
      : loaded.map((x) => x.data),
    state.preset,
  );
  const rangeLabel = range ? range[0] + "–" + range[1] : "Série completa";
  const mergeBlocked =
    loaded.length !== state.cards.length
      ? "Aguarde o carregamento dos indicadores."
      : mergeReason(
          loaded.map((x) => ({ data: x.data, scope: x.card.scope })),
          range,
        );
  const validMerged = state.merged && !mergeBlocked;
  const activeIds = new Set(state.cards.map((c) => c.indicatorId));
  const previewAdd = Boolean(
    dragged && !activeIds.has(dragged) && state.cards.length < 4,
  );
  const displayed =
    state.focusedId && !previewAdd
      ? state.cards.filter((c) => c.id === state.focusedId)
      : state.cards;
  const detailCard: Card | undefined = selected
    ? (detailSettings[selected.id] ?? {
        id: "detail-" + selected.id,
        indicatorId: selected.id,
        scope: "nacional",
      })
    : undefined;

  useEffect(() => {
    if (!focusRequest || isDetail || isExplore || !data[focusRequest]) return;
    const card = state.cards.find((c) => c.indicatorId === focusRequest);
    const element = card && document.getElementById(card.id);
    if (element) {
      element.focus({ preventScroll: true });
      element.scrollIntoView({ block: "nearest", behavior: "instant" });
      setFocusRequest(null);
    }
  }, [focusRequest, data, state.cards, isDetail, isExplore]);

  function add(id: string) {
    setMessage("");
    if (picker?.target)
      dispatch({ type: "replace", cardId: picker.target, indicatorId: id });
    else
      dispatch({
        type: "add",
        indicatorId: id,
        ...(isDetail && detailCard?.indicatorId === id
          ? { scope: detailCard.scope, display: detailCard.display }
          : {}),
      });
    setFocusRequest(id);
    setPanelTab("charts");
    setPicker(null);
    setDragged(null);
    if (!mobile || !isDetail) navigate("/comparar");
  }
  function dragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("application/x-brasa-indicator", id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "copy";
    setDragged(id);
  }
  function drop(e: React.DragEvent) {
    e.preventDefault();
    const id =
      e.dataTransfer.getData("application/x-brasa-indicator") ||
      e.dataTransfer.getData("text/plain");
    if (catalog.some((c) => c.id === id)) add(id);
    setDragged(null);
  }
  async function share() {
    const hash = isDetail
      ? detailRoute(selected!.slug, detailCard!, state.preset)
      : "/comparar?" +
        new URLSearchParams({ s: JSON.stringify(serializable(state)) });
    const url = window.location.href.split("#")[0] + "#" + hash;
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link da consulta copiado.");
    } catch {
      setMessage("Copie o endereço: " + url);
    }
  }
  function catalogSearch(autoFocus = false) {
    return (
      <label className="search-field">
        <Search size={18} />
        <input
          aria-label="Buscar indicador"
          placeholder="Buscar indicador, tema ou fonte…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus={autoFocus}
        />
        {search && (
          <button
            className="icon-button"
            onClick={() => setSearch("")}
            aria-label="Limpar busca"
          >
            <X size={16} />
          </button>
        )}
      </label>
    );
  }
  function categoryChips() {
    return (
      <div className="category-chips" aria-label="Filtrar por categoria">
        <button
          className={category === "all" ? "selected" : ""}
          onClick={() => setCategory("all")}
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={category === c.id ? "selected" : ""}
            onClick={() => setCategory(c.id)}
          >
            {c.short}
          </button>
        ))}
      </div>
    );
  }
  function catalogResults() {
    return (
      <>
        <div className="results-summary">
          <span>
            {filtered.length}{" "}
            {filtered.length === 1 ? "indicador" : "indicadores"}
          </span>
          <label className="check-label">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
            />
            Conferidos na fonte
          </label>
        </div>
        <div className="catalog-list">
          {filtered.map((entry) => {
            const Icon = icons[entry.categoria];
            const added = activeIds.has(entry.id);
            return (
              <div
                key={entry.id}
                className="catalog-item"
                draggable={!mobile && !picker}
                onDragStart={(e) => dragStart(e, entry.id)}
                onDragEnd={() => setDragged(null)}
              >
                <span className={"category-icon " + entry.categoria}>
                  <Icon size={18} />
                </span>
                <button
                  className="catalog-open"
                  onClick={() => {
                    setPicker(null);
                    navigate("/indicador/" + entry.slug);
                  }}
                >
                  <strong>{entry.titulo}</strong>
                  <span>{entry.source.split("(")[0].trim()}</span>
                  <small>
                    {entry.latest
                      ? formatNumber(entry.latest[1]) +
                        " " +
                        entry.unit +
                        " · " +
                        formatPeriod(entry.latest[0])
                      : "Sem observações"}
                    {entry.status === "review" ? " · Em revisão" : ""}
                  </small>
                </button>
                <button
                  className={"add-button " + (added ? "added" : "")}
                  aria-label={
                    (added ? "Localizar " : "Adicionar ") + entry.titulo
                  }
                  onClick={() => add(entry.id)}
                >
                  {added ? <Check size={18} /> : <Plus size={18} />}
                </button>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="empty-results">
            <Search />
            <h3>Nenhum indicador encontrado</h3>
            <p>Experimente outro termo ou remova os filtros.</p>
            <button
              className="secondary"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setVerifiedOnly(false);
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </>
    );
  }
  function periodControls() {
    return (
      <div className="period-control">
        <span>Período</span>
        <select
          aria-label="Período da consulta"
          value={state.preset}
          onChange={(e) =>
            dispatch({ type: "preset", preset: e.target.value as Preset })
          }
        >
          <option value="5">Últimos 5 anos</option>
          <option value="10">Últimos 10 anos</option>
          <option value="all">Série completa</option>
        </select>
        <small>{rangeLabel}</small>
      </div>
    );
  }
  const queries = loaded.map((x) => queryData(x.data, x.card.scope, range));
  const comparison: QueryResult = {
    title: "Comparação · cada coluna indica sua unidade",
    unit: "unidades indicadas nas colunas",
    scope: "nacional",
    reference: rangeLabel,
    columns: queries.flatMap((q, i) =>
      q.columns.map((c) => ({
        id: i + "-" + c.id,
        name:
          q.title +
          " · " +
          c.name +
          " (" +
          q.unit +
          ")" +
          (q.scope === "estados" ? " · " + q.reference : ""),
      })),
    ),
    rows: [...new Set(queries.flatMap((q) => q.rows.map((r) => r.period)))]
      .sort()
      .map((period) => ({
        period,
        values: queries.flatMap(
          (q) =>
            q.rows.find((r) => r.period === period)?.values ??
            q.columns.map(() => null),
        ),
      })),
  };

  return (
    <div className="atlas-app">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Ir para o conteúdo
      </a>
      <aside className="sidebar">
        <button
          className="brand-link"
          onClick={() => navigate("/")}
          aria-label="Brasa Dados, início"
        >
          <Logo />
        </button>
        <div className="sidebar-nav">
          <button
            className={!isExplore && !isDetail ? "selected" : ""}
            onClick={() => navigate("/comparar")}
          >
            <LayoutDashboard size={19} />
            Meu painel <span>{state.cards.length}</span>
          </button>
          <button
            className={isExplore ? "selected" : ""}
            onClick={() => navigate("/explorar")}
          >
            <Search size={19} />
            Explorar indicadores
            <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="sidebar-heading">ÁREAS DO BRASIL</div>
        <nav aria-label="Categorias">
          {categories.map((c) => {
            const Icon = icons[c.id];
            return (
              <button
                key={c.id}
                className={category === c.id ? "selected-category" : ""}
                onClick={() => {
                  setCategory(category === c.id ? "all" : c.id);
                  navigate("/explorar");
                }}
              >
                <Icon size={18} />
                {c.short}
                <span>
                  {catalog.filter((i) => i.categoria === c.id).length}
                </span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-catalog">
          <div className="sidebar-heading">
            ADICIONE AO PAINEL <span>↗</span>
          </div>
          {sorted
            .filter((c) => category === "all" || c.categoria === category)
            .slice(0, 6)
            .map((c) => (
              <div
                className="sidebar-indicator"
                key={c.id}
                draggable
                onDragStart={(e) => dragStart(e, c.id)}
                onDragEnd={() => setDragged(null)}
              >
                <button onClick={() => navigate("/indicador/" + c.slug)}>
                  {c.titulo}
                </button>
                <button
                  aria-label={"Adicionar " + c.titulo}
                  onClick={() => add(c.id)}
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          <button className="sidebar-see-all" onClick={() => setPicker({})}>
            Ver todos os indicadores
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="sidebar-bottom">
          <button onClick={() => setAbout(true)}>
            <CircleHelp size={18} />
            Sobre e metodologia
          </button>
          <div>
            <span className="live-dot" /> Dados públicos. Contexto aberto.
          </div>
        </div>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <div className="compact-brand">
            <button
              className="icon-button"
              aria-label="Abrir catálogo"
              onClick={() => setPicker({})}
            >
              <Menu size={21} />
            </button>
            <button className="brand-link" onClick={() => navigate("/")}>
              <Logo />
            </button>
          </div>
          <div className="header-search">
            <button onClick={() => setPicker({})}>
              <Search size={18} />
              <span>Buscar indicador, tema ou fonte…</span>
              <span className="search-hint">Explorar</span>
            </button>
          </div>
          <div className="topbar-right">
            <span className="public-badge">
              <span className="live-dot" />
              Fontes abertas
            </span>
            <ThemeToggle />
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          <div className="breadcrumb">
            <button onClick={() => navigate("/")}>Brasa Dados</button>
            <ChevronRight size={13} />
            <span>
              {isExplore ? "Explorar" : isDetail ? "Indicador" : "Meu painel"}
            </span>
          </div>
          {isMissingRoute ? (
            <div className="empty-state">
              <h1>Indicador não encontrado</h1>
              <button className="primary" onClick={() => navigate("/explorar")}>
                Explorar catálogo
              </button>
            </div>
          ) : isExplore ? (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">UM OLHAR SOBRE O BRASIL</span>
                  <h1>
                    Dados para entender.
                    <br className="mobile-only" /> Contexto para comparar.
                  </h1>
                  <p>
                    Explore indicadores públicos e construa sua própria leitura
                    do país.
                  </p>
                </div>
                <span className="catalog-count">
                  <Database size={18} />
                  {catalog.length} indicadores
                </span>
              </div>
              <section className="explorer">
                {catalogSearch()}
                {categoryChips()}
                {catalogResults()}
              </section>
            </>
          ) : isDetail && selected ? (
            <>
              <div className="detail-top">
                <button
                  className="text-button"
                  onClick={() => navigate("/explorar")}
                >
                  <ArrowLeft size={16} />
                  Explorar indicadores
                </button>
                <button className="secondary" onClick={() => void share()}>
                  <Share2 size={16} />
                  Compartilhar
                </button>
              </div>
              <div className="detail-controls">
                {periodControls()}
                <button className="primary" onClick={() => add(selected.id)}>
                  {activeIds.has(selected.id) ? (
                    <Check size={18} />
                  ) : (
                    <Plus size={18} />
                  )}{" "}
                  {activeIds.has(selected.id)
                    ? "No painel"
                    : "Comparar indicador"}
                </button>
              </div>
              {data[selected.id] && detailCard ? (
                <IndicatorCard
                  key={selected.id}
                  detail
                  card={detailCard}
                  data={data[selected.id]}
                  range={range}
                  onConfigure={(display, scope, reset) =>
                    setDetailSettings((p) => ({
                      ...p,
                      [selected.id]: {
                        ...detailCard,
                        display: reset
                          ? undefined
                          : (display ?? detailCard.display),
                        scope: scope ?? detailCard.scope,
                      },
                    }))
                  }
                />
              ) : (
                <LoadingCard
                  error={errors[selected.id]}
                  retry={() => setAttempt((x) => x + 1)}
                />
              )}
            </>
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">SEU ESPAÇO DE DESCOBERTA</span>
                  <h1>
                    Meu painel<span className="heading-dot">.</span>
                  </h1>
                  <p>Explore, compare e conecte os dados do Brasil.</p>
                </div>
                <div className="heading-actions">
                  <button
                    className="secondary share-button"
                    aria-label="Compartilhar comparação"
                    onClick={() => void share()}
                  >
                    <Share2 size={16} />
                    <span>Compartilhar</span>
                  </button>
                  <button
                    className="primary lime"
                    onClick={() => setPicker({})}
                  >
                    <Plus size={19} />
                    Adicionar indicador
                  </button>
                </div>
              </div>
              <div className="panel-controls">
                {periodControls()}
                <div className="segmented">
                  <button
                    aria-pressed={panelTab === "charts"}
                    onClick={() => setPanelTab("charts")}
                  >
                    <LayoutDashboard size={15} />
                    Gráficos
                  </button>
                  <button
                    aria-pressed={panelTab === "table"}
                    onClick={() => setPanelTab("table")}
                  >
                    Tabela comparativa
                  </button>
                </div>
                <span className="panel-count">
                  {state.cards.length} de 4 gráficos
                </span>
              </div>
              {state.cards.length >= 2 && (
                <div className="merge-toolbar">
                  <button
                    className="text-button"
                    aria-pressed={validMerged}
                    disabled={Boolean(mergeBlocked) && !state.merged}
                    onClick={() =>
                      dispatch({ type: "merge", value: !state.merged })
                    }
                  >
                    <Sparkles size={15} />
                    {state.merged ? "Separar gráficos" : "Mesclar séries"}
                  </button>
                  <span>
                    {mergeBlocked ||
                      "Compare tendências; a sobreposição não demonstra causalidade."}
                  </span>
                  {state.focusedId && (
                    <button
                      className="text-button"
                      onClick={() =>
                        dispatch({ type: "focus", cardId: state.focusedId! })
                      }
                    >
                      Voltar ao painel completo
                    </button>
                  )}
                </div>
              )}
              <section
                className={"workbench " + (dragged ? "is-dragging" : "")}
                aria-label="Painel de gráficos"
                onDragOver={(e) => {
                  if (
                    dragged ||
                    e.dataTransfer.types.includes(
                      "application/x-brasa-indicator",
                    )
                  )
                    e.preventDefault();
                }}
                onDrop={drop}
              >
                {state.cards.length === 0 ? (
                  <div
                    className={"empty-state " + (dragged ? "drop-active" : "")}
                  >
                    <div className="empty-illustration">
                      <div>
                        <TrendingUp size={42} />
                        <span />
                        <span />
                      </div>
                      <div>
                        <BarChart3 size={37} />
                      </div>
                      <i>
                        <Plus size={22} />
                      </i>
                    </div>
                    <span className="eyebrow">
                      O BRASIL, SOB A SUA PERSPECTIVA
                    </span>
                    <h2>
                      Uma pergunta.
                      <br />
                      Muitas possibilidades.
                    </h2>
                    <p>
                      Escolha seu primeiro indicador. Depois, adicione outros
                      <br className="desktop-only" /> para descobrir como as
                      histórias se encontram.
                    </p>
                    <button className="primary" onClick={() => setPicker({})}>
                      <Plus size={18} />
                      Adicionar primeiro indicador
                    </button>
                    <span className="drag-hint">
                      ou arraste um indicador do catálogo para cá
                    </span>
                    <div className="starter-links">
                      {sorted
                        .filter((c) => c.status === "verified")
                        .slice(0, 3)
                        .map((c) => (
                          <button key={c.id} onClick={() => add(c.id)}>
                            {c.titulo}
                            <ArrowUpRight size={14} />
                          </button>
                        ))}
                    </div>
                  </div>
                ) : panelTab === "table" && !previewAdd ? (
                  <div className="comparison-table">
                    <p>
                      Períodos distintos permanecem em linhas distintas. “Sem
                      dado” indica ausência de observação.
                    </p>
                    <DataTable query={comparison} />
                  </div>
                ) : validMerged && !previewAdd ? (
                  <div className="indicator-card">
                    <div className="card-heading">
                      <div>
                        <span className="eyebrow">COMPARAÇÃO DE SÉRIES</span>
                        <h2>Uma visão conjunta</h2>
                      </div>
                      <button
                        className="secondary"
                        onClick={() =>
                          dispatch({ type: "merge", value: false })
                        }
                      >
                        Separar gráficos
                      </button>
                    </div>
                    <Suspense
                      fallback={
                        <div className="chart-placeholder">
                          Preparando comparação…
                        </div>
                      }
                    >
                      <Chart
                        title="Comparação de indicadores"
                        items={loaded.map((x) => ({
                          query: queryData(x.data, x.card.scope, range),
                          display:
                            x.card.display ?? x.data.visualizacao.tipo_padrao,
                          source: x.data.fonte.orgao,
                        }))}
                      />
                    </Suspense>
                  </div>
                ) : (
                  <div
                    className={
                      "chart-grid " +
                      (displayed.length + (previewAdd ? 1 : 0) > 1
                        ? "multiple"
                        : "")
                    }
                  >
                    {displayed.map((card) =>
                      data[card.indicatorId] ? (
                        <IndicatorCard
                          key={card.id + card.indicatorId}
                          card={card}
                          data={data[card.indicatorId]}
                          range={range}
                          active={state.activeId === card.id}
                          focused={state.focusedId === card.id}
                          onActivate={() => {
                            if (state.activeId !== card.id)
                              dispatch({ type: "activate", cardId: card.id });
                          }}
                          onConfigure={(display, scope, reset) =>
                            dispatch({
                              type: "configure",
                              cardId: card.id,
                              display,
                              scope,
                              reset,
                            })
                          }
                          onRemove={() =>
                            dispatch({ type: "remove", cardId: card.id })
                          }
                          onFocus={
                            state.cards.length > 1
                              ? () =>
                                  dispatch({ type: "focus", cardId: card.id })
                              : undefined
                          }
                          onReplace={() => setPicker({ target: card.id })}
                        />
                      ) : (
                        <LoadingCard
                          key={card.id}
                          error={errors[card.indicatorId]}
                          retry={() => setAttempt((x) => x + 1)}
                        />
                      ),
                    )}
                    {(previewAdd ||
                      (state.cards.length === 3 && !state.focusedId)) && (
                      <button
                        className={
                          "add-placeholder " + (previewAdd ? "drop-active" : "")
                        }
                        onClick={() => setPicker({})}
                      >
                        <span>
                          <Plus size={25} />
                        </span>
                        <strong>
                          {previewAdd
                            ? "Solte para adicionar"
                            : "Uma nova perspectiva"}
                        </strong>
                        <small>
                          {previewAdd
                            ? catalog.find((c) => c.id === dragged)?.titulo
                            : "Adicione mais um indicador à comparação"}
                        </small>
                      </button>
                    )}
                  </div>
                )}
                {dragged && state.cards.length === 4 && (
                  <div className="drop-full">
                    Painel completo. Ao soltar, você poderá escolher qual
                    gráfico substituir.
                  </div>
                )}
              </section>
              {state.cards.length > 0 &&
                state.cards.length < 4 &&
                !previewAdd && (
                  <button className="add-more" onClick={() => setPicker({})}>
                    <Plus size={17} />
                    Adicionar outra perspectiva
                    <span>{state.cards.length}/4</span>
                  </button>
                )}
            </>
          )}
          <footer className="page-footer">
            <span>
              <Logo compact />
              Dados públicos. Contexto aberto.
            </span>
            <button onClick={() => setAbout(true)}>
              Fontes e metodologia
              <ArrowUpRight size={14} />
            </button>
          </footer>
        </main>
      </div>
      {mobile && (
        <nav className="mobile-nav" aria-label="Navegação principal">
          <button
            className={isExplore || isDetail ? "selected" : ""}
            onClick={() => navigate("/explorar")}
          >
            <Search size={19} />
            Explorar
          </button>
          <button
            className={!isExplore && !isDetail ? "selected" : ""}
            onClick={() => navigate("/comparar")}
          >
            <LayoutDashboard size={19} />
            Comparar <span>{state.cards.length}</span>
          </button>
          <button onClick={() => setPicker({})}>
            <Plus size={19} />
            Adicionar
          </button>
        </nav>
      )}
      {mobile && isDetail && state.cards.length > 0 && (
        <button
          className="comparison-tray"
          onClick={() => navigate("/comparar")}
        >
          <BarChart3 size={19} />
          Comparar · {state.cards.length}{" "}
          {state.cards.length === 1 ? "indicador" : "indicadores"}
          <ArrowRight size={17} />
        </button>
      )}
      {(state.notice || message) && (
        <div className="toast" role="status">
          <span>{message || state.notice}</span>
          {state.undo && !message && (
            <button onClick={() => dispatch({ type: "undo" })}>
              <Undo2 size={15} />
              Desfazer
            </button>
          )}
          <button
            aria-label="Fechar aviso"
            onClick={() => {
              setMessage("");
              dispatch({ type: "dismiss" });
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {picker && (
        <Dialog
          wide
          title={
            picker.target ? "Substituir este gráfico" : "Explorar e adicionar"
          }
          onClose={() => setPicker(null)}
        >
          {catalogSearch(true)}
          {categoryChips()}
          {catalogResults()}
        </Dialog>
      )}
      {state.pendingId && (
        <Dialog
          title="Seu painel está completo"
          onClose={() => dispatch({ type: "cancel-pending" })}
        >
          <p>
            Escolha explicitamente qual gráfico será substituído por{" "}
            <strong>
              {catalog.find((c) => c.id === state.pendingId)?.titulo}
            </strong>
            .
          </p>
          <div className="replace-list">
            {state.cards.map((c) => (
              <button
                className="secondary"
                key={c.id}
                onClick={() =>
                  dispatch({
                    type: "replace",
                    cardId: c.id,
                    indicatorId: state.pendingId!,
                  })
                }
              >
                <ArrowLeft size={16} />
                {catalog.find((i) => i.id === c.indicatorId)?.titulo}
              </button>
            ))}
          </div>
          <button
            className="text-button"
            onClick={() => dispatch({ type: "cancel-pending" })}
          >
            Manter meu painel
          </button>
        </Dialog>
      )}
      {about && (
        <Dialog
          title="Dados públicos, com contexto"
          onClose={() => setAbout(false)}
        >
          <Logo />
          <p>
            O Brasa Dados reúne indicadores para consulta, comparação e
            compreensão do Brasil. Cada gráfico apresenta sua fonte e
            limitações.
          </p>
          <h3>Como ler a situação dos dados</h3>
          <p>
            <strong>Extração conferida:</strong> valores importados de uma fonte
            identificada, com transformação e data de coleta registradas. Uma
            publicação pode ser revisada pela própria fonte.
          </p>
          <p>
            <strong>Em revisão:</strong> valores do acervo anterior que ainda
            precisam de conferência. Essa indicação acompanha o gráfico e
            permanece nos metadados.
          </p>
          <p>
            A ausência de uma observação não significa zero. A idade do dado
            deve ser interpretada conforme o calendário de divulgação da fonte.
          </p>
          <h3>Comparar com responsabilidade</h3>
          <p>
            Taxas e totais têm significados diferentes. A mesclagem não comprova
            causalidade. Consulte sempre as unidades, períodos e notas
            metodológicas.
          </p>
          <a
            href={import.meta.env.BASE_URL + "data/audit.json"}
            target="_blank"
            rel="noreferrer"
          >
            Consultar inventário de auditoria
            <ArrowUpRight size={14} />
          </a>
          <p className="muted">
            Sua seleção fica neste navegador. Nenhuma conta é necessária.
          </p>
        </Dialog>
      )}
    </div>
  );
}
function LoadingCard({ error, retry }: { error?: string; retry: () => void }) {
  return (
    <div
      className="indicator-card loading-card"
      role={error ? "alert" : "status"}
    >
      <SlidersHorizontal size={23} />
      <p>{error || "Carregando indicador…"}</p>
      {error && (
        <button className="secondary" onClick={retry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
