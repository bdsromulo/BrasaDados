import type { Dataset, Scope, Preset, CatalogEntry } from "./model.ts";

export interface QueryResult {
  title: string;
  unit: string;
  scope: Scope;
  reference: string;
  source?: string;
  auditStatus?: string;
  retrievedAt?: string;
  columns: { id: string; name: string }[];
  rows: { period: string; values: (number | null)[] }[];
}
export function year(period: string) {
  return Number(period.slice(0, 4));
}
export function rangeFor(
  datasets: Dataset[],
  preset: Preset,
): [number, number] | undefined {
  if (preset === "all") return undefined;
  const years = datasets
    .flatMap((d) =>
      d.visualizacao.series.flatMap((s) => s.dados.map(([p]) => year(p))),
    )
    .filter(Number.isFinite);
  if (!years.length) return undefined;
  const end = Math.max(...years);
  return [end - Number(preset) + 1, end];
}
export function queryData(
  d: Dataset,
  scope: Scope,
  range?: [number, number],
): QueryResult {
  const base = {
    title: d.titulo,
    unit: d.visualizacao.eixo_y.unidade,
    scope,
    reference: d.provenance.reference,
    source: d.provenance.sourceUrl,
    retrievedAt: d.provenance.retrievedAt,
    auditStatus:
      d.provenance.status === "verified"
        ? "Extração conferida"
        : "Valores legados em revisão",
  };
  if (scope === "estados") {
    const reference = d.provenance.stateReference;
    const rows =
      reference &&
      (!range || (year(reference) >= range[0] && year(reference) <= range[1]))
        ? [...(d.visualizacao.dados_uf ?? [])]
            .sort((a, b) => (b.valor ?? -Infinity) - (a.valor ?? -Infinity))
            .map((p) => ({ period: `${p.uf} · ${p.nome}`, values: [p.valor] }))
        : [];
    return {
      ...base,
      reference: reference ?? "Referência não documentada",
      columns: [{ id: d.id, name: d.titulo }],
      rows,
    };
  }
  const series = d.visualizacao.series;
  const periods = [
    ...new Set(series.flatMap((s) => s.dados.map(([p]) => p))),
  ].sort();
  // Preserve missing regular observations as null so lines never bridge an absent period.
  const frequency = d.provenance.frequency;
  if (
    periods.length > 1 &&
    ["annual", "biennial", "monthly", "quarterly"].includes(frequency)
  ) {
    const first = periods[0],
      last = periods.at(-1)!;
    if (frequency === "annual" || frequency === "biennial") {
      for (
        let y = year(first);
        y <= year(last);
        y += frequency === "biennial" ? 2 : 1
      )
        periods.push(String(y));
    } else {
      const n = frequency === "monthly" ? 12 : 4;
      for (let y = year(first); y <= year(last); y++)
        for (let part = 1; part <= n; part++) {
          const p =
            frequency === "monthly"
              ? `${y}-${String(part).padStart(2, "0")}`
              : `${y}-Q${part}`;
          if (p >= first && p <= last) periods.push(p);
        }
    }
  }
  const keys = [...new Set(periods)]
    .sort()
    .filter((p) => !range || (year(p) >= range[0] && year(p) <= range[1]));
  const maps = series.map((s) => new Map(s.dados));
  return {
    ...base,
    columns: series.map((s) => ({ id: s.id, name: s.nome })),
    rows: keys.map((period) => ({
      period,
      values: maps.map((m) => m.get(period) ?? null),
    })),
  };
}
export function mergeReason(
  items: { data: Dataset; scope: Scope }[],
  range?: [number, number],
): string | null {
  if (items.length < 2)
    return "Adicione pelo menos dois indicadores para mesclar.";
  if (items.some((i) => i.scope !== "nacional"))
    return "A mesclagem está disponível para séries históricas nacionais.";
  if (
    new Set(items.map((i) => i.data.provenance.geography ?? "Brasil")).size > 1
  )
    return "Os recortes territoriais diferem. Compare os cartões sem mesclar.";
  if (items.some((i) => i.data.provenance.status !== "verified"))
    return "Mescle apenas indicadores com valores conferidos na fonte.";
  if (new Set(items.map((i) => i.data.provenance.frequency)).size > 1)
    return "As frequências diferem. Compare os cartões ou a tabela, sem mesclar.";
  if (new Set(items.map((i) => i.data.visualizacao.eixo_y.unidade)).size > 2)
    return "A mesclagem comporta até duas unidades de medida.";
  const periods = items.map(
    (i) =>
      new Set(
        i.data.visualizacao.series.flatMap((s) =>
          s.dados
            .filter(
              ([p, v]) =>
                v !== null &&
                (!range || (year(p) >= range[0] && year(p) <= range[1])),
            )
            .map(([p]) => p),
        ),
      ),
  );
  if (![...periods[0]].some((p) => periods.every((set) => set.has(p))))
    return "Não há períodos com observações em comum.";
  return null;
}
export function formatNumber(n: number | null, decimals = 4) {
  return n === null
    ? "Sem dado"
    : new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: decimals,
      }).format(n);
}
export function formatPeriod(p: string) {
  if (/^\d{4}-Q[1-4]$/.test(p)) return `${p.at(-1)}º tri/${p.slice(0, 4)}`;
  if (/^\d{4}-\d{2}$/.test(p)) return `${p.slice(5)}/${p.slice(0, 4)}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(p)) return p.split("-").reverse().join("/");
  return p;
}
export function csvFor(q: QueryResult): string {
  const cell = (s: string) => `"${s.replaceAll('"', '""')}"`;
  return (
    "\uFEFF" +
    [
      [
        q.scope === "estados" ? "UF" : "Período",
        ...q.columns.map((c) => `${c.name} (${q.unit})`),
        "Referência",
        "Fonte",
        "Conferência",
      ],
      ...q.rows.map((r) => [
        r.period,
        ...r.values.map((v) => (v === null ? "" : String(v).replace(".", ","))),
        q.scope === "estados" ? q.reference : r.period,
        q.source ?? "",
        q.auditStatus ?? "",
      ]),
    ]
      .map((row) => row.map(cell).join(";"))
      .join("\r\n")
  );
}
export function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
const synonyms: Record<string, string> = {
  desemprego: "desocupacao",
  emprego: "trabalho",
  inflacao: "ipca",
  juros: "selic",
  esgoto: "saneamento",
  fome: "alimentar",
  renda: "rendimento",
};
export function matches(entry: CatalogEntry, search: string): boolean {
  const haystack = normalize(
    [entry.titulo, entry.source, entry.summary, ...entry.tags].join(" "),
  );
  return normalize(search)
    .split(/\s+/)
    .every(
      (word) =>
        haystack.includes(word) ||
        (synonyms[word] && haystack.includes(synonyms[word])),
    );
}
