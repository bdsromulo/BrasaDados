export type Category =
  | "economia"
  | "educacao"
  | "saude"
  | "seguranca"
  | "meio-ambiente"
  | "internacional";
export type Frequency =
  "annual" | "quarterly" | "monthly" | "daily" | "biennial" | "irregular";
export type Display = "line" | "bar" | "smooth" | "area";
export type Scope = "nacional" | "estados";
export type Preset = "5" | "10" | "all";
export type Point = [string, number | null];
export interface Series {
  id: string;
  nome: string;
  dados: Point[];
}
export interface Provenance {
  geography?: string;
  status: "verified" | "review";
  organizationType: "government" | "international" | "civil";
  sourceUrl: string;
  datasetCode?: string;
  retrievedAt?: string;
  publishedAt?: string;
  reference: string;
  frequency: Frequency;
  observationStatus: "official" | "provisional" | "estimate" | "undocumented";
  transformation: string;
  issues: string[];
  stateReference?: string;
  expectedStates?: number;
}
export interface Dataset {
  id: string;
  slug: string;
  titulo: string;
  categoria: Category;
  tags: string[];
  fonte: {
    orgao: string;
    pesquisa: string;
    url_oficial: string;
    frequencia: string;
  };
  explicacao_leiga: {
    resumo: string;
    como_interpretar: string;
    por_que_importa: string;
    pontos_de_atencao?: string;
  };
  detalhamento_tecnico: {
    formula_calculo: string;
    unidade_medida: string;
    amostra_cobertura: string;
    limitacoes_e_quebras_metodologicas: string;
    orientacoes_fact_checking: string;
  };
  visualizacao: {
    tipo_padrao: "line" | "bar";
    eixo_y: { rotulo: string; unidade: string };
    series: Series[];
    dados_uf?: { uf: string; nome: string; valor: number | null }[];
  };
  provenance: Provenance;
}
export interface CatalogEntry {
  id: string;
  slug: string;
  titulo: string;
  categoria: Category;
  tags: string[];
  source: string;
  summary: string;
  unit: string;
  latest: Point | null;
  status: Provenance["status"];
  frequency: Frequency;
  hasStates: boolean;
}
export interface Card {
  id: string;
  indicatorId: string;
  display?: Display;
  scope: Scope;
}
export interface Panel {
  cards: Card[];
  activeId: string | null;
  focusedId: string | null;
  merged: boolean;
  preset: Preset;
  pendingId: string | null;
  undo: Pick<Panel, "cards" | "activeId" | "focusedId" | "merged"> | null;
  notice: string;
}
export const categories: { id: Category; name: string; short: string }[] = [
  { id: "economia", name: "Economia & trabalho", short: "Economia" },
  { id: "educacao", name: "Educação & aprendizado", short: "Educação" },
  { id: "saude", name: "Saúde & bem-estar", short: "Saúde" },
  { id: "seguranca", name: "Segurança pública", short: "Segurança" },
  { id: "meio-ambiente", name: "Ambiente & infraestrutura", short: "Ambiente" },
  {
    id: "internacional",
    name: "Panorama internacional",
    short: "Internacional",
  },
];
export const frequencyLabels: Record<Frequency, string> = {
  annual: "Anual",
  quarterly: "Trimestral",
  monthly: "Mensal",
  daily: "Diária",
  biennial: "Bienal",
  irregular: "Anos selecionados",
};
