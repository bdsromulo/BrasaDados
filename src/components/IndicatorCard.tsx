import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  BarChart3,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCcw,
  Table2,
  TrendingUp,
  X,
  CheckCircle2,
  Info,
  Copy,
} from "lucide-react";
import type { Card, Dataset, Display, Scope } from "../lib/model";
import { frequencyLabels } from "../lib/model";
import { csvFor, formatNumber, formatPeriod, queryData } from "../lib/query";
import type { QueryResult } from "../lib/query";

const Chart = lazy(() => import("./AtlasChart"));
export function DataTable({ query }: { query: QueryResult }) {
  return (
    <div
      className="table-scroll"
      role="region"
      aria-label="Valores da consulta"
      tabIndex={0}
    >
      <table>
        <caption>
          {query.title} · {query.unit}
          {query.scope === "estados"
            ? ` · ${formatPeriod(query.reference)}`
            : ""}
        </caption>
        <thead>
          <tr>
            <th scope="col">{query.scope === "estados" ? "UF" : "Período"}</th>
            {query.columns.map((c) => (
              <th scope="col" key={c.id}>
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {query.rows.map((r) => (
            <tr key={r.period}>
              <th scope="row">{formatPeriod(r.period)}</th>
              {r.values.map((v, i) => (
                <td key={i}>{formatNumber(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function downloadCSV(query: QueryResult, slug: string) {
  const url = URL.createObjectURL(
    new Blob([csvFor(query)], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}-${query.scope}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function ChartView({
  data,
  display,
  scope,
  range,
}: {
  data: Dataset;
  display: Display;
  scope: Scope;
  range?: [number, number];
}) {
  const q = queryData(data, scope, range);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref}>
      {!q.rows.some((r) => r.values.some((v) => v !== null)) ? (
        <div className="chart-placeholder">
          <Info />
          Sem observações neste recorte. Experimente a série completa.
        </div>
      ) : visible ? (
        <Suspense
          fallback={
            <div className="chart-placeholder">Preparando visualização…</div>
          }
        >
          <Chart
            title={data.titulo}
            items={[{ query: q, display, source: data.fonte.orgao }]}
          />
        </Suspense>
      ) : (
        <div className="chart-placeholder">
          O gráfico será carregado ao entrar na tela.
        </div>
      )}
    </div>
  );
}
interface Props {
  card: Card;
  data: Dataset;
  range?: [number, number];
  active?: boolean;
  focused?: boolean;
  detail?: boolean;
  onConfigure: (display?: Display, scope?: Scope, reset?: boolean) => void;
  onRemove?: () => void;
  onFocus?: () => void;
  onReplace?: () => void;
  onActivate?: () => void;
}
export function IndicatorCard({
  card,
  data,
  range,
  active,
  focused,
  detail,
  onConfigure,
  onRemove,
  onFocus,
  onReplace,
  onActivate,
}: Props) {
  const [tab, setTab] = useState<"chart" | "table">("chart");
  const [copied, setCopied] = useState(false);
  const display = card.display ?? data.visualizacao.tipo_padrao;
  const q = queryData(data, card.scope, range);
  const rows = q.rows.filter((r) => r.values[0] !== null);
  const last = card.scope === "nacional" ? rows.at(-1) : undefined;
  const prev = card.scope === "nacional" ? rows.at(-2) : undefined;
  const delta = last && prev ? last.values[0]! - prev.values[0]! : null;
  const sourceType = {
    government: "Fonte governamental",
    international: "Organismo internacional",
    civil: "Sociedade civil",
  }[data.provenance.organizationType];
  const hasStates = Boolean(
    data.visualizacao.dados_uf?.length && data.provenance.stateReference,
  );
  async function copyCitation() {
    const citation = `${data.fonte.orgao}. ${data.titulo}. ${data.fonte.pesquisa}. Referência: ${data.provenance.reference}. Disponível em: ${data.provenance.sourceUrl}. Coleta: ${data.provenance.retrievedAt ?? "não documentada"}. Consulta via Brasa Dados.`;
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <article
      tabIndex={-1}
      id={card.id}
      className={`indicator-card ${active ? "active-card" : ""} ${detail ? "detail-card" : ""}`}
      onFocus={onActivate}
    >
      <div className="card-heading">
        <div className="card-title">
          <span className="eyebrow">
            {frequencyLabels[data.provenance.frequency]} ·{" "}
            {data.fonte.orgao.split("(")[0].trim()}
          </span>
          <h2>{data.titulo}</h2>
        </div>
        <div className="card-actions">
          {onReplace && (
            <button
              className="icon-button"
              onClick={onReplace}
              aria-label={`Substituir ${data.titulo}`}
            >
              <ArrowLeftRight size={16} />
            </button>
          )}
          {onFocus && (
            <button
              className="icon-button"
              onClick={onFocus}
              aria-label={
                focused ? "Voltar ao painel completo" : `Ampliar ${data.titulo}`
              }
            >
              {focused ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
          {onRemove && (
            <button
              className="icon-button"
              onClick={onRemove}
              aria-label={`Remover ${data.titulo}`}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="metric-row">
        {last ? (
          <>
            <strong
              className={
                formatNumber(last.values[0]).length > 9
                  ? "long-number"
                  : undefined
              }
            >
              {formatNumber(last.values[0])}
              <span>{q.unit}</span>
            </strong>
            <div>
              {q.columns.length > 1 && <small>{q.columns[0].name}</small>}
              <span>{formatPeriod(last.period)}</span>
              {delta !== null && (
                <small>
                  {delta > 0 ? "+" : ""}
                  {formatNumber(delta)}{" "}
                  {q.unit.startsWith("%") ? "p.p." : q.unit} vs.{" "}
                  {formatPeriod(prev!.period)}
                </small>
              )}
            </div>
          </>
        ) : (
          <span>
            {card.scope === "estados"
              ? `Ranking · ${formatPeriod(q.reference)} · ${q.rows.filter((r) => r.values[0] !== null).length}/${data.provenance.expectedStates ?? 27} UFs com dado`
              : "Sem dado no período"}
          </span>
        )}
      </div>
      {data.provenance.status === "review" && (
        <div className="review-note">
          <Info size={14} />
          <span>Acervo em revisão. Valores ainda não conferidos na fonte.</span>
        </div>
      )}
      <div className="chart-toolbar">
        <div className="segmented" aria-label="Visualização">
          <button
            aria-pressed={tab === "chart" && display === "line"}
            disabled={card.scope === "estados"}
            onClick={() => {
              setTab("chart");
              onConfigure("line");
            }}
          >
            <TrendingUp size={14} />
            Linhas
          </button>
          <button
            aria-pressed={
              tab === "chart" && (display === "bar" || card.scope === "estados")
            }
            onClick={() => {
              setTab("chart");
              if (card.scope !== "estados") onConfigure("bar");
            }}
          >
            <BarChart3 size={14} />
            {card.scope === "estados" ? "Barras" : "Colunas"}
          </button>
          <button
            aria-pressed={tab === "table"}
            onClick={() => setTab("table")}
          >
            <Table2 size={14} />
            Tabela
          </button>
        </div>
        {hasStates && (
          <select
            aria-label={`Recorte de ${data.titulo}`}
            value={card.scope}
            onChange={(e) => onConfigure(undefined, e.target.value as Scope)}
          >
            <option value="nacional">
              {data.provenance.geography ?? "Brasil"}
            </option>
            <option value="estados">Ranking UF</option>
          </select>
        )}
      </div>
      {tab === "chart" ? (
        <ChartView
          data={data}
          display={display}
          scope={card.scope}
          range={range}
        />
      ) : (
        <DataTable query={q} />
      )}
      <div className="card-footer">
        <a href={data.fonte.url_oficial} target="_blank" rel="noreferrer">
          <ExternalLink size={13} />
          Fonte: {data.fonte.orgao.split("(")[0].trim()}
        </a>
        <button
          className="text-button"
          onClick={() => downloadCSV(q, data.slug)}
        >
          <Download size={14} />
          CSV do recorte
        </button>
      </div>
      <details className="context" open={detail || undefined}>
        <summary>Entenda o indicador</summary>
        <p>{data.explicacao_leiga.resumo}</p>
        <p>{data.explicacao_leiga.como_interpretar}</p>
        <p className="muted">{data.explicacao_leiga.por_que_importa}</p>
        {data.explicacao_leiga.pontos_de_atencao && (
          <p>{data.explicacao_leiga.pontos_de_atencao}</p>
        )}
      </details>
      <details className="context">
        <summary>
          Fonte e metodologia{" "}
          <span className={`status-dot ${data.provenance.status}`} />
        </summary>
        <div className="provenance-status">
          {data.provenance.status === "verified" ? (
            <CheckCircle2 size={16} />
          ) : (
            <Info size={16} />
          )}{" "}
          {data.provenance.status === "verified"
            ? "Extração conferida"
            : "Revisão pendente"}{" "}
          · {sourceType}
        </div>
        <dl>
          <dt>Pesquisa</dt>
          <dd>{data.fonte.pesquisa}</dd>
          <dt>Referência</dt>
          <dd>
            {formatPeriod(data.provenance.reference)} ·{" "}
            {data.provenance.observationStatus === "official"
              ? "Dado publicado pela fonte"
              : data.provenance.observationStatus === "provisional"
                ? "Dado provisório"
                : data.provenance.observationStatus === "estimate"
                  ? "Estimativa da fonte"
                  : "Situação não documentada"}
          </dd>
          <dt>Publicação / coleta</dt>
          <dd>
            {data.provenance.publishedAt ?? "Publicação não informada"} /{" "}
            {data.provenance.retrievedAt ?? "Coleta não documentada"}
          </dd>
          <dt>Transformação</dt>
          <dd>{data.provenance.transformation}</dd>
          <dt>Cobertura</dt>
          <dd>{data.detalhamento_tecnico.amostra_cobertura}</dd>
          <dt>Cálculo</dt>
          <dd>{data.detalhamento_tecnico.formula_calculo}</dd>
          <dt>Limitações</dt>
          <dd>
            {data.detalhamento_tecnico.limitacoes_e_quebras_metodologicas}
          </dd>
        </dl>
        {data.provenance.issues.length > 0 && (
          <ul>
            {data.provenance.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        )}
        <p>{data.detalhamento_tecnico.orientacoes_fact_checking}</p>
        <a href={data.provenance.sourceUrl} target="_blank" rel="noreferrer">
          Acessar dados de origem <ExternalLink size={13} />
        </a>
        <button className="text-button" onClick={() => void copyCitation()}>
          <Copy size={14} />
          {copied ? "Referência copiada" : "Copiar referência"}
        </button>
      </details>
      <details className="context advanced">
        <summary>Opções do gráfico</summary>
        <div className="advanced-controls">
          <select
            aria-label="Estilo adicional"
            value={display}
            disabled={card.scope === "estados"}
            onChange={(e) => {
              onConfigure(e.target.value as Display);
              setTab("chart");
            }}
          >
            <option value="line">Linhas retas</option>
            <option value="bar">Colunas</option>
            <option value="smooth">Linhas curvas</option>
            <option value="area">Área</option>
          </select>
          <button
            className="text-button"
            onClick={() => {
              onConfigure(undefined, undefined, true);
              setTab("chart");
            }}
          >
            <RotateCcw size={14} />
            Restaurar recomendado
          </button>
        </div>
      </details>
    </article>
  );
}
