export const civilSources = [
  {
    id: "internacional-percepcao-corrupcao",
    title: "Índice de percepção da corrupção · Brasil",
    category: "internacional",
    unit: "pontos",
    source: "Transparência Internacional",
    type: "civil",
    url: "https://www.transparency.org/en/countries/brazil",
    summary:
      "Pontuação do Brasil no Índice de Percepção da Corrupção, baseada em avaliações de especialistas e empresários sobre o setor público.",
    interpretation:
      "A escala vai de zero a cem; pontuação maior indica menor percepção de corrupção no setor público. Não mede diretamente todos os episódios de corrupção.",
    importance:
      "Oferece uma comparação internacional da percepção sobre integridade institucional.",
    limitations:
      "O índice agrega fontes e percepções; mudanças pequenas devem ser interpretadas com cautela. A metodologia foi revisada em 2012, início da série comparável importada. Não confundir posição no ranking com pontuação.",
    coverage:
      "Brasil, pontuação nacional na escala internacional 0–100, 2012 em diante.",
    calculation:
      "Pontuação harmonizada das fontes elegíveis segundo a metodologia anual do CPI da Transparência Internacional.",
  },
];
export const inpeSources = [
  {
    id: "meio-ambiente-queimadas-focos",
    title: "Focos ativos de fogo · Satélite de referência",
    category: "meio-ambiente",
    unit: "focos",
    source: "Instituto Nacional de Pesquisas Espaciais (INPE)",
    url: "https://data.inpe.br/queimadas/estatisticas/media/estatistica/paises/brasil.json",
    frequency: "annual",
    display: "bar",
    summary:
      "Número de focos ativos de fogo detectados pelo satélite de referência no Brasil durante o ano civil.",
    interpretation:
      "Cada foco é uma detecção por satélite; não equivale a um incêndio individual nem mede diretamente a área queimada.",
    importance:
      "Permite acompanhar a variação anual da atividade de fogo com um método de observação padronizado.",
    limitations:
      "Série iniciada em 2013 para não misturar a transição do satélite de referência NOAA-12 para AQUA em 2012. Nuvens, horário de passagem e resolução afetam a detecção. O ano corrente fica fora até todos os 12 meses estarem completos. Não somar focos de todos os satélites como se fossem detecções independentes.",
    coverage:
      "Brasil e 27 UFs; anos civis completos desde 2013, satélite de referência do Programa Queimadas.",
    calculation:
      "Soma dos totais de focos por estado e bioma da base mensal nacional do INPE. Ranking estadual soma os biomas de cada UF no último ano completo.",
  },
];
export function makeDataset({
  id,
  title,
  category = "economia",
  unit = "%",
  summary,
  interpretation,
  importance,
  limitations,
  source = "Instituto Brasileiro de Geografia e Estatística (IBGE)",
  type = "government",
  url,
  frequency = "annual",
  display = "line",
  calculation,
  coverage = "Brasil; recortes estaduais quando publicados pela fonte.",
  observationStatus = "official",
}) {
  return {
    id,
    slug: id,
    titulo: title,
    categoria: category,
    tags: [category, title, source],
    fonte: {
      orgao: source,
      pesquisa: title,
      url_oficial: url,
      frequencia: frequency,
    },
    explicacao_leiga: {
      resumo: summary,
      como_interpretar: interpretation,
      por_que_importa: importance,
    },
    detalhamento_tecnico: {
      formula_calculo: calculation ?? summary,
      unidade_medida: unit,
      amostra_cobertura: coverage,
      limitacoes_e_quebras_metodologicas: limitations,
      orientacoes_fact_checking:
        "Compare conceitos, unidades e períodos equivalentes. Ausência de observação não significa zero.",
    },
    visualizacao: {
      tipo_padrao: display,
      eixo_y: { rotulo: title, unidade: unit },
      series: [],
    },
    provenance: {
      status: "verified",
      organizationType: type,
      sourceUrl: url,
      reference: "",
      frequency,
      observationStatus,
      transformation: "Valores publicados pela fonte, sem interpolação.",
      issues: [],
    },
  };
}
export const worldBankSources = [
  {
    id: "saude-gastos-publicos-pib",
    code: "SH.XPD.CHEX.GD.ZS",
    title: "Gasto corrente em saúde · Público e privado",
    category: "saude",
    unit: "% do PIB",
    source: "Organização Mundial da Saúde (OMS) / Banco Mundial",
    type: "international",
    observationStatus: "estimate",
    url: "https://data.worldbank.org/indicator/SH.XPD.CHEX.GD.ZS?locations=BR",
    summary:
      "Despesas correntes com bens e serviços de saúde consumidos no ano, dos setores público e privado, como proporção do PIB.",
    interpretation:
      "Mede o gasto corrente total em saúde. O percentual pode mudar tanto pelo gasto quanto pela evolução do PIB.",
    importance: "Contextualiza os recursos destinados à saúde na economia.",
    limitations:
      "Estimativas da OMS (Global Health Expenditure Database) distribuídas pelo Banco Mundial. Exclui despesas de capital, como edifícios, máquinas e estoques de emergência. Não representa apenas gasto público ou orçamento do SUS. Anos ainda sem valor publicado não são estimados pelo site.",
    coverage:
      "Brasil; total nacional de despesas correntes, públicas e privadas.",
    calculation:
      "Despesa corrente total em saúde dividida pelo PIB do mesmo ano, multiplicada por 100.",
  },
];
export const ibgeSources = [
  {
    id: "economia-desemprego-pnad",
    table: "4099",
    variable: "4099",
    frequency: "quarterly",
    states: true,
    title: "Taxa de desocupação",
    unit: "%",
    summary:
      "Parcela da força de trabalho de 14 anos ou mais que estava sem ocupação, procurou trabalho e estava disponível para trabalhar.",
    interpretation:
      "A taxa representa pessoas na força de trabalho; não toda a população. Cada ponto corresponde a um trimestre civil.",
    importance: "Ajuda a acompanhar as condições de acesso ao trabalho.",
    limitations:
      "Pesquisa por amostragem sujeita a incerteza e revisão de pesos. Trimestres civis não devem ser confundidos com trimestres móveis.",
  },
  {
    id: "economia-inflacao-ipca",
    table: "1737",
    variable: "2265",
    frequency: "monthly",
    states: false,
    title: "Inflação · IPCA em 12 meses",
    unit: "%",
    summary:
      "Variação acumulada dos preços ao consumidor nos 12 meses terminados em cada mês.",
    interpretation:
      "Uma taxa positiva indica preços maiores que 12 meses antes. A queda da taxa não implica queda do nível de preços.",
    importance: "Contextualiza mudanças no poder de compra.",
    limitations:
      "A cesta e a cobertura do IPCA não reproduzem o orçamento de cada família.",
  },
  {
    id: "economia-pib-variacao",
    table: "6784",
    variable: "9810",
    frequency: "annual",
    states: false,
    title: "Crescimento real do PIB",
    display: "bar",
    unit: "%",
    summary:
      "Variação anual do volume de bens e serviços finais produzidos no Brasil.",
    interpretation:
      "O crescimento real desconta a variação de preços. Valores negativos indicam retração.",
    importance:
      "Mede a evolução da atividade econômica, sem substituir indicadores de distribuição de renda.",
    limitations:
      "Contas Nacionais Anuais consolidadas. O último ano pode anteceder estimativas das Contas Trimestrais; as duas fontes não são emendadas automaticamente.",
  },
  {
    id: "economia-indice-gini",
    table: "7435",
    variable: "10681",
    frequency: "annual",
    states: true,
    title: "Desigualdade · Índice de Gini",
    unit: "índice",
    summary:
      "Mede a desigualdade do rendimento domiciliar per capita na PNAD Contínua.",
    interpretation:
      "Quanto mais próximo de zero, menor a desigualdade; quanto mais próximo de um, maior.",
    importance:
      "Complementa a renda média ao revelar concentração dos rendimentos.",
    limitations:
      "Pesquisas domiciliares têm limitações para captar rendimentos muito altos. Pesos e séries podem ser revisados.",
  },
  {
    id: "economia-rendimento-per-capita",
    table: "7533",
    variable: "10816",
    classification: "1019[49243]",
    frequency: "annual",
    states: true,
    title: "Rendimento domiciliar per capita · real",
    unit: "R$",
    summary:
      "Renda média mensal por morador, ajustada pelo IBGE para os preços médios do último ano da série.",
    interpretation:
      "Os valores reais permitem comparação no tempo. A média não equivale à renda recebida pela maioria.",
    importance: "Aproxima a análise do poder de compra das famílias.",
    limitations:
      "A base de preços muda quando a fonte publica novo ano. Toda a série é reimportada conjuntamente para evitar misturar bases.",
  },
  {
    id: "economia-informalidade",
    table: "4093",
    variable: "12466",
    classification: "2[6794]",
    frequency: "quarterly",
    states: true,
    title: "Trabalho · Taxa de informalidade",
    unit: "%",
    summary:
      "Proporção das pessoas ocupadas de 14 anos ou mais em ocupações informais, segundo a definição da PNAD Contínua.",
    interpretation:
      "Informalidade é medida entre ocupados. Desocupação usa a força de trabalho como denominador; as taxas não devem ser somadas.",
    importance: "Mostra uma dimensão da proteção e da qualidade das ocupações.",
    limitations:
      "Empregados sem carteira, trabalhadores por conta própria e empregadores sem CNPJ e trabalhadores familiares auxiliares integram o conceito. A cobertura temporal depende da disponibilidade da variável.",
  },
  {
    id: "saude-inseguranca-alimentar",
    table: "9552",
    variable: "9784",
    classification: "1[6795]|12404[109099,109100,109101,109102]",
    frequency: "annual",
    states: true,
    title: "Insegurança alimentar nos domicílios",
    category: "saude",
    unit: "%",
    summary:
      "Percentual de domicílios com insegurança alimentar, classificada pela Escala Brasileira de Insegurança Alimentar (EBIA).",
    interpretation:
      "A série total inclui os níveis leve, moderado e grave. Não some o total às três categorias.",
    importance: "Mostra restrições no acesso regular e adequado a alimentos.",
    limitations:
      "Esta série usa apenas a PNAD Contínua; dados de PNAD e POF anteriores não são unidos sem avaliação metodológica.",
    seriesClassification: "12404",
  },
];
export const bcbSources = [
  {
    id: "economia-taxa-selic",
    code: 432,
    start: 1999,
    aggregation: "last-month",
    title: "Taxa Selic Meta · fim do mês",
    unit: "% a.a.",
    summary:
      "Meta anual da taxa Selic definida pelo Copom, observada no último registro disponível de cada mês.",
    interpretation:
      "O ponto mensal mostra a meta vigente no encerramento do mês, não a Selic efetiva acumulada.",
    importance: "Contextualiza o custo do crédito e a política monetária.",
    limitations:
      "A agregação mensal pode ocultar mudanças ocorridas dentro do mês. O mês corrente contém o último registro disponível.",
    url: "https://dadosabertos.bcb.gov.br/dataset/432-taxa-de-juros---meta-selic-definida-pelo-copom",
  },
  {
    id: "economia-cambio-dolar",
    code: 1,
    start: 2000,
    aggregation: "mean-month",
    title: "Dólar comercial · média mensal de venda",
    unit: "R$/US$",
    summary:
      "Média aritmética das cotações diárias de venda do dólar comercial publicadas no SGS.",
    interpretation:
      "Valores maiores indicam mais reais por dólar. Não corresponde ao dólar turismo ou à cotação intradiária.",
    importance:
      "Ajuda a acompanhar custos de importação e a relação entre moedas.",
    limitations:
      "Média dos dias com cotação publicada; não ponderada pelo volume negociado. O mês corrente é parcial.",
    url: "https://dadosabertos.bcb.gov.br/dataset/1-taxa-de-cambio---livre---dolar-americano-venda---diario",
  },
  {
    id: "economia-divida-bruta",
    code: 13762,
    start: 2006,
    aggregation: "last-month",
    title: "Dívida bruta do governo geral",
    unit: "% do PIB",
    summary:
      "Dívida bruta do governo geral em proporção ao PIB, segundo a metodologia utilizada pelo BCB a partir de 2008.",
    interpretation:
      "A razão varia tanto pela dívida quanto pelo PIB. Não equivale à dívida líquida.",
    importance:
      "Contextualiza o endividamento público em relação ao tamanho da economia.",
    limitations:
      "A série está sujeita a revisões do PIB e das estatísticas fiscais. Não somar às medidas de dívida líquida.",
    url: "https://dadosabertos.bcb.gov.br/dataset/13762-divida-bruta-do-governo-geral--pib---metodologia-utilizada-a-partir-de-2008",
  },
];

ibgeSources.push(
  {
    id: "educacao-taxa-analfabetismo",
    table: "7113",
    variable: "10267",
    classification: "2[6794]|58[2795]",
    frequency: "annual",
    states: true,
    title: "Taxa de analfabetismo · 15 anos ou mais",
    category: "educacao",
    unit: "%",
    summary:
      "Percentual de pessoas de 15 anos ou mais que não sabem ler e escrever um bilhete simples, segundo a PNAD Contínua.",
    interpretation:
      "A taxa se refere à alfabetização declarada; não mede analfabetismo funcional ou capacidade de interpretar textos complexos.",
    importance:
      "Ajuda a identificar barreiras ao acesso à educação, ao trabalho e à participação social.",
    limitations:
      "O módulo ampliado não foi publicado em 2020 e 2021. As lacunas permanecem sem dados; não há interpolação. Pesos amostrais e séries podem ser revisados.",
    calculation:
      "Pessoas de 15 anos ou mais que não sabem ler/escrever divididas pela população dessa faixa etária, vezes 100.",
    coverage:
      "Brasil e 27 UFs, ambos os sexos, 15 anos ou mais; PNAD Contínua anual.",
  },
  {
    id: "demografia-populacao-brasil",
    table: "6579",
    variable: "9324",
    frequency: "annual",
    states: true,
    title: "População residente · estimativas anuais",
    unit: "pessoas",
    observationStatus: "estimate",
    summary:
      "Estimativa da população residente com referência em 1º de julho, publicada pelo IBGE para Brasil e UFs.",
    interpretation:
      "São estimativas anuais, não a contagem do Censo nem a projeção de longo prazo. Revisões de base podem alterar o nível da série.",
    importance:
      "Contextualiza o tamanho da população e o planejamento de serviços públicos.",
    limitations:
      "A tabela reúne edições anuais das estimativas, com bases censitárias e revisões metodológicas distintas. Ausências em anos censitários não são preenchidas com contagens do Censo. O acervo anterior misturava Censo e projeções e foi substituído por esta fonte explicitamente identificada.",
    coverage:
      "População residente no Brasil e nas 27 UFs em 1º de julho de cada ano disponível.",
    calculation:
      "Estimativas oficiais do IBGE; valores inteiros em pessoas, sem conversão ou arredondamento.",
  },
);
