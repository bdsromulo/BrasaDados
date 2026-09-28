import type { CatalogEntry, Dataset } from "./model.ts";
import { mergeReason } from "./query.ts";

export interface Recommendation {
  id: string;
  question: string;
  context: string;
  indicatorIds: string[];
  note: string;
  canMerge: boolean;
}

export const recommendations: Recommendation[] = [
  {
    id: "prices-rates",
    question: "Como evoluíram preços e juros?",
    context:
      "Compare o IPCA acumulado em 12 meses com a meta Selic observada ao fim de cada mês.",
    indicatorIds: ["economia-inflacao-ipca", "economia-taxa-selic"],
    note: "Duas séries mensais · mesclagem disponível",
    canMerge: true,
  },
  {
    id: "growth-jobs",
    question: "Crescimento e desemprego caminharam juntos?",
    context:
      "Observe as trajetórias sem tratar a comparação visual como prova de relação causal.",
    indicatorIds: ["economia-pib-variacao", "economia-desemprego-pnad"],
    note: "PIB anual · desemprego trimestral · gráficos lado a lado",
    canMerge: false,
  },
  {
    id: "start-inflation",
    question: "Comece pela inflação",
    context:
      "Acompanhe a variação dos preços ao consumidor antes de adicionar outras perspectivas.",
    indicatorIds: ["economia-inflacao-ipca"],
    note: "Um indicador · série mensal",
    canMerge: false,
  },
];

export function availableRecommendations(catalog: CatalogEntry[]) {
  const byId = new Map(catalog.map((entry) => [entry.id, entry]));
  return recommendations.filter((item) =>
    item.indicatorIds.every((id) => byId.get(id)?.status === "verified"),
  );
}

export function recommendationError(item: Recommendation, datasets: Dataset[]) {
  if (
    datasets.length !== item.indicatorIds.length ||
    datasets.some(
      (d, i) =>
        d.id !== item.indicatorIds[i] || d.provenance.status !== "verified",
    )
  )
    return "Os dados desta sugestão não estão disponíveis para comparação.";
  if (item.canMerge)
    return (
      mergeReason(datasets.map((data) => ({ data, scope: "nacional" }))) ?? null
    );
  if (item.indicatorIds.length === 2) {
    const [a, b] = datasets;
    const yearsA = new Set(
      a.visualizacao.series.flatMap((s) =>
        s.dados.filter(([, v]) => v !== null).map(([p]) => p.slice(0, 4)),
      ),
    );
    const yearsB = new Set(
      b.visualizacao.series.flatMap((s) =>
        s.dados.filter(([, v]) => v !== null).map(([p]) => p.slice(0, 4)),
      ),
    );
    if (![...yearsA].some((year) => yearsB.has(year)))
      return "Não há anos com dados em comum para esta sugestão.";
  }
  return null;
}
