export type CategoryId = 
  | 'educacao' 
  | 'saude' 
  | 'seguranca' 
  | 'economia' 
  | 'internacional' 
  | 'meio-ambiente';

export interface IndicatorSource {
  orgao: string;
  pesquisa: string;
  url_oficial: string;
  frequencia: string;
  ultima_atualizacao: string;
}

export interface LaymanExplanation {
  resumo: string;
  como_interpretar: string;
  por_que_importa: string;
  pontos_de_atencao?: string;
}

export interface TechnicalDetail {
  formula_calculo: string;
  unidade_medida: string;
  amostra_cobertura: string;
  anonimizacao_sigilo: string;
  limitacoes_e_quebras_metodologicas: string;
  orientacoes_fact_checking: string;
}

export interface DataSeries {
  id: string;
  nome: string;
  cor?: string;
  estilo?: 'solid' | 'dashed';
  dados: Array<[number | string, number]>;
}

export interface HistoricalMilestone {
  ano: number;
  rotulo: string;
}

export interface IndicatorVisualization {
  tipo_padrao: 'line' | 'bar';
  eixo_x: {
    tipo: 'temporal' | 'categoria';
    rotulo: string;
  };
  eixo_y: {
    rotulo: string;
    unidade: string;
    escala_min?: number;
    escala_max?: number;
  };
  series: DataSeries[];
  marcos_historicos?: HistoricalMilestone[];
}

export interface Indicator {
  id: string;
  slug: string;
  titulo: string;
  categoria: CategoryId;
  subcategoria: string;
  tags: string[];
  fonte: IndicatorSource;
  explicacao_leiga: LaymanExplanation;
  detalhamento_tecnico: TechnicalDetail;
  visualizacao: IndicatorVisualization;
  citacao_sugerida?: {
    abnt: string;
  };
}

export type GridMode = '1' | '2' | '4';

export type ChartDisplayType = 'line-smooth' | 'line-straight' | 'area' | 'bar';
