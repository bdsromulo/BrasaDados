import { makeDataset } from "./sources.mjs";
import { readFileSync } from "node:fs";
const fbspSeries = JSON.parse(
  readFileSync(
    new URL("../data/official-files/fbsp-series.json", import.meta.url),
    "utf8",
  ),
);
const benSeries = JSON.parse(
  readFileSync(
    new URL("../data/official-files/ben-series.json", import.meta.url),
    "utf8",
  ),
);
const benPDF =
  "https://www.epe.gov.br/sites-pt/publicacoes-dados-abertos/publicacoes/PublicacoesArquivos/publicacao-975/topico-847/BEN_S%C3%ADntese_2026_PT.pdf";
const fbspPDF =
  "https://forumseguranca.org.br/wp-content/uploads/2026/07/anuario-2026.pdf";
const inep =
  "https://www.gov.br/inep/pt-br/centrais-de-conteudo/noticias/ideb/ideb-avanca-em-todas-as-etapas-da-educacao-basica";
const poverty =
  "https://agenciadenoticias.ibge.gov.br/media/com_mediaibge/arquivos/71016b2eb0a5feb8f7685271b1233db7.pdf";
const water =
  "https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/saneamento/sinisa/resultados-sinisa/013_RELATORIO_SINISA_ABASTECIMENTO_DE_AGUA_2024_defeso.pdf";
const sewage =
  "https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/saneamento/sinisa/resultados-sinisa/014_RELATORIO_SINISA_ESGOTAMENTO_SANITARIO_2024_defeso.pdf";
const lifeTable =
  "https://biblioteca.ibge.gov.br/visualizacao/periodicos/3097/tcmb_2024.pdf";
const prodesPDF =
  "https://www.gov.br/inpe/pt-br/assuntos/ultimas-noticias/20251015Nota_tcnica_EstimativaPRODES_2025.pdf";
const prodesConsolidated =
  "https://www.gov.br/inpe/pt-br/assuntos/ultimas-noticias/sistema-do-inpe-aponta-5-731-km2-de-desmatamento-na-amazonia-em-2025";
const years = Array.from({ length: 13 }, (_, i) => String(2012 + i));
function curated(config, series, code, pointer, publishedAt) {
  const d = makeDataset(config);
  d.visualizacao.series = series;
  d.provenance = {
    ...d.provenance,
    retrievedAt: "2026-09-27",
    publishedAt,
    reference: series[0].dados.at(-1)[0],
    datasetCode: code,
    transformation:
      "Transcrição conferida da publicação oficial. " +
      pointer +
      " Sem interpolação ou preenchimento de anos ausentes.",
    issues: [],
  };
  return d;
}
export const curatedDatasets = [
  curated(
    {
      id: "economia-pobreza-extrema",
      title: "Pobreza e extrema pobreza",
      url: poverty,
      summary:
        "Parcela da população com rendimento domiciliar per capita abaixo das linhas de pobreza e extrema pobreza usadas na Síntese de Indicadores Sociais 2025.",
      interpretation:
        "A linha de pobreza inclui as pessoas em extrema pobreza. As duas séries não são parcelas que se somam.",
      importance:
        "Permite acompanhar a insuficiência de renda para condições básicas de vida.",
      limitations:
        "Linhas de US$ 6,85 e US$ 2,15 por dia em PPC de 2017, conforme a edição 2025 do IBGE. Não combinar com séries calculadas com outra PPC ou linha. Pesos da PNAD podem ser revisados.",
    },
    [
      {
        id: "pobreza",
        nome: "Pobreza · US$ 6,85 PPC 2017",
        dados: years.map((y, i) => [
          y,
          [
            34.7, 32.5, 30.9, 31.7, 33.7, 33.7, 33.4, 32.6, 31.1, 36.8, 31.6,
            27.3, 23.1,
          ][i],
        ]),
      },
      {
        id: "extrema",
        nome: "Extrema pobreza · US$ 2,15 PPC 2017",
        dados: years.map((y, i) => [
          y,
          [6.6, 5.8, 5.2, 5.6, 6.7, 7.3, 7.4, 7.4, 6.1, 9, 5.9, 4.4, 3.5][i],
        ]),
      },
    ],
    "SIS 2025 / Tabela 2.18",
    "Gráfico “Proporção de pessoas, por classes de rendimento domiciliar per capita selecionadas — Brasil 2012–2024”.",
    "2025-12-03",
  ),
  ...[
    [
      "educacao-ideb-anos-iniciais",
      "IDEB · Anos iniciais do fundamental",
      6,
      6.3,
      5.7,
      6.1,
    ],
    [
      "educacao-ideb-anos-finais",
      "IDEB · Anos finais do fundamental",
      5,
      5.3,
      4.7,
      5,
    ],
    ["educacao-ideb-ensino-medio", "IDEB · Ensino médio", 4.3, 4.5, 4.1, 4.3],
  ].map(([id, title, a, b, c, d]) =>
    curated(
      {
        id,
        title,
        category: "educacao",
        unit: "pontos",
        source: "INEP / Ministério da Educação",
        url: inep,
        frequency: "biennial",
        summary:
          "Índice de Desenvolvimento da Educação Básica, que combina desempenho no Saeb e aprovação escolar.",
        interpretation:
          "A escala vai de zero a dez. As séries total e pública representam universos distintos e não devem ser somadas.",
        importance:
          "Contextualiza aprendizagem e progressão escolar em cada etapa.",
        limitations:
          "Recorte de 2023 e 2025 conferido na divulgação oficial. Histórico anterior e UFs não são reaproveitados do acervo sem conferência; comparar a mesma etapa e rede.",
        coverage:
          "Brasil: total das redes pública e privada e, separadamente, rede pública.",
      },
      [
        {
          id: "total",
          nome: "Total · pública e privada",
          dados: [
            ["2023", a],
            ["2025", b],
          ],
        },
        {
          id: "publica",
          nome: "Rede pública",
          dados: [
            ["2023", c],
            ["2025", d],
          ],
        },
      ],
      "INEP / IDEB 2025",
      "Divulgação de 5 de agosto de 2026, parágrafo comparativo 2023–2025.",
      "2026-08-05",
    ),
  ),
  curated(
    {
      id: "meio-ambiente-abastecimento-agua",
      title: "Abastecimento de água · Atendimento por rede",
      category: "meio-ambiente",
      url: water,
      source: "Ministério das Cidades / SINISA",
      display: "bar",
      summary:
        "Parcela da população atendida por rede de abastecimento de água, segundo o SINISA, no ano de referência 2023.",
      interpretation:
        "Acesso à rede não mede, por si só, continuidade ou qualidade do fornecimento. Total, urbano e rural têm denominadores diferentes.",
      importance:
        "Mostra a cobertura da infraestrutura básica de abastecimento.",
      limitations:
        "SINISA 2024, referência 2023, versão de 8 de abril de 2025. Não emendar automaticamente com SNIS devido a mudanças de população de referência e cobertura dos prestadores. A edição 2025 estava restrita no portal na coleta.",
      coverage:
        "Brasil; população total, urbana e rural no universo dos indicadores consolidados do SINISA.",
    },
    [
      {
        id: "total",
        nome: "População total · IAG0001",
        dados: [["2023", 83.1]],
      },
      {
        id: "urbana",
        nome: "População urbana · IAG0002",
        dados: [["2023", 93.3]],
      },
      {
        id: "rural",
        nome: "População rural · IAG0003",
        dados: [["2023", 24.2]],
      },
    ],
    "SINISA 2024 / IAG0001, IAG0002, IAG0003",
    "Relatório de Abastecimento de Água, página 19.",
    "2025-04-08",
  ),
  curated(
    {
      id: "meio-ambiente-tratamento-esgoto",
      title: "Tratamento de esgoto · Dois denominadores",
      category: "meio-ambiente",
      url: sewage,
      source: "Ministério das Cidades / SINISA",
      display: "bar",
      summary:
        "Volume de esgoto tratado comparado ao volume de água consumida e, separadamente, ao volume de esgoto coletado.",
      interpretation:
        "Os percentuais respondem a perguntas diferentes. Tratar grande parte do esgoto coletado não significa atender toda a população.",
      importance:
        "Distingue cobertura de coleta e efetivo tratamento dos volumes.",
      limitations:
        "SINISA 2024, referência 2023. O denominador do IES2003 é a água consumida; o IES2004 usa esgoto coletado. Não são taxas de domicílios atendidos. A transição SNIS–SINISA exige avaliação antes de unir históricos.",
    },
    [
      {
        id: "agua-consumida",
        nome: "Tratado / água consumida · IES2003",
        dados: [["2023", 49.4]],
      },
      {
        id: "esgoto-coletado",
        nome: "Tratado / esgoto coletado · IES2004",
        dados: [["2023", 78.7]],
      },
    ],
    "SINISA 2024 / IES2003, IES2004",
    "Relatório de Esgotamento Sanitário, página 22.",
    "2025-03-12",
  ),
];

const lifeRows = [
  ["1940", 45.5, 42.9, 48.3],
  ["1950", 48, 45.3, 50.8],
  ["1960", 52.5, 49.7, 55.5],
  ["1970", 57.6, 54.6, 60.8],
  ["1980", 62.5, 59.6, 65.7],
  ["1991", 66.9, 63.2, 70.9],
  ["2000", 71.1, 67.3, 75.1],
  ["2010", 74.4, 70.7, 78.1],
  ["2019", 76.2, 72.8, 79.6],
  ["2020", 74.8, 71.2, 78.5],
  ["2021", 72.8, 69.3, 76.4],
  ["2022", 75.4, 72.1, 78.8],
  ["2023", 76.4, 73.1, 79.7],
  ["2024", 76.6, 73.3, 79.9],
];
curatedDatasets.push(
  curated(
    {
      id: "saude-expectativa-vida",
      title: "Esperança de vida ao nascer",
      category: "saude",
      unit: "anos",
      url: lifeTable,
      frequency: "annual",
      observationStatus: "estimate",
      summary:
        "Número médio de anos que um recém-nascido viveria se os riscos de mortalidade do período permanecessem constantes.",
      interpretation:
        "É uma medida de período, não a previsão individual de duração da vida. Total, homens e mulheres são séries distintas.",
      importance:
        "Sintetiza condições de mortalidade e contribui para o planejamento de saúde e proteção social.",
      limitations:
        "Anos selecionados da edição 2024, com revisões históricas. Os anos não publicados nesta tabela permanecem ausentes; o ponto de 2025 do acervo anterior não foi confirmado e foi removido. Os números publicados têm uma casa decimal.",
      coverage:
        "Brasil; ambos os sexos, homens e mulheres; 1940 a 2024 em anos selecionados.",
      calculation:
        "Esperança de vida no nascimento (e0) derivada da tábua de mortalidade do IBGE.",
    },
    ["Total", "Homens", "Mulheres"].map((nome, i) => ({
      id: ["total", "homens", "mulheres"][i],
      nome,
      dados: lifeRows.map((row) => [row[0], row[i + 1]]),
    })),
    "TCMB 2024 / Tabela 1",
    "Tabela 1, página 8 do PDF. Extração reproduzível com scripts/parse-life-table.py; valores conferidos visualmente.",
    undefined,
  ),
);

const mvi = curated(
  {
    id: "seguranca-taxa-mvi",
    title: "Mortes violentas intencionais · Taxa nacional",
    category: "seguranca",
    unit: "por 100 mil hab.",
    source: "Fórum Brasileiro de Segurança Pública (FBSP)",
    type: "civil",
    url: fbspPDF,
    frequency: "annual",
    display: "line",
    summary:
      "Mortes violentas intencionais registradas para cada 100 mil habitantes, segundo consolidação do FBSP.",
    interpretation:
      "A taxa relaciona vítimas de MVI e população de referência. O número absoluto de mortes é outro indicador; não confunda taxa com contagem.",
    importance:
      "Ajuda a acompanhar a violência letal e comparar níveis entre períodos e UFs.",
    limitations:
      "Categoria MVI do FBSP soma vítimas de homicídio doloso, latrocínio, lesão corporal seguida de morte e morte decorrente de intervenção policial. O ano 2012 foi calculado retrospectivamente pela fonte; números de edições anteriores podem ser revistos. A edição 2026 usa estimativas populacionais do IBGE de 1º de julho. Classificação e registro podem variar entre polícias.",
    coverage:
      "Brasil e 27 UFs; série nacional 2012–2025 e ranking estadual de 2025.",
    calculation:
      "(Vítimas de MVI / estimativa populacional de referência) × 100.000, conforme FBSP.",
  },
  [{ id: "taxa", nome: "Brasil · taxa de MVI", dados: fbspSeries.mvi }],
  "FBSP 20º Anuário 2026 / Tabelas 01 e 02",
  "Tabela 02, página 30: série nacional; Tabela 01, página 28: ranking 2025. Extração reproduzível em scripts/parse-fbsp.py.",
  undefined,
);
mvi.provenance.stateReference = "2025";
mvi.provenance.expectedStates = 27;
mvi.visualizacao.dados_uf = fbspSeries.states;
curatedDatasets.push(mvi);

curatedDatasets.push(
  curated(
    {
      id: "seguranca-feminicidios",
      title: "Feminicídios registrados · Vítimas",
      category: "seguranca",
      unit: "vítimas",
      source: "Fórum Brasileiro de Segurança Pública (FBSP)",
      type: "civil",
      url: fbspPDF,
      frequency: "annual",
      display: "bar",
      summary:
        "Número de mulheres vítimas de feminicídio registrado pelas secretarias estaduais de segurança e consolidado pelo FBSP.",
      interpretation:
        "É uma contagem anual de vítimas classificadas como feminicídio, não a taxa por população nem o total de homicídios de mulheres.",
      importance:
        "Acompanha a violência letal motivada por gênero e a capacidade de reconhecimento desses crimes.",
      limitations:
        "Depende da classificação policial e da cobertura dos registros estaduais. A edição 2026 revisou anos anteriores; use a série inteira dessa edição. O total de 2025 é 1.571 vítimas; a estimativa anterior de 1.568 e os números sem evidência do acervo foram descartados.",
      coverage:
        "Brasil, vítimas registradas em 2016–2025; sem ranking estadual nesta extração.",
      calculation:
        "Soma das vítimas de feminicídio registradas pelas unidades federativas e consolidadas pelo FBSP.",
    },
    [
      {
        id: "feminicidios",
        nome: "Vítimas de feminicídio",
        dados: fbspSeries.feminicides,
      },
    ],
    "FBSP 20º Anuário 2026 / Gráfico 35",
    "Gráfico 35, página 159. Extração reproduzível em scripts/parse-fbsp.py; distinguir da série de homicídios femininos do mesmo gráfico.",
    undefined,
  ),
);
curatedDatasets.push(
  curated(
    {
      id: "meio-ambiente-matriz-eletrica-renovavel",
      title: "Renováveis na matriz elétrica brasileira",
      category: "meio-ambiente",
      unit: "%",
      source: "Empresa de Pesquisa Energética (EPE) / MME",
      url: benPDF,
      frequency: "annual",
      display: "line",
      summary:
        "Participação de fontes renováveis na oferta interna de energia elétrica brasileira, conforme o BEN 2026.",
      interpretation:
        "A parcela renovável considera toda a oferta elétrica, inclusive importação líquida. Não é a participação de renováveis em toda a matriz energética do país.",
      importance:
        "Mostra a composição da oferta elétrica e a exposição a fontes fósseis e às condições hidrológicas.",
      limitations:
        "A edição BEN 2026 revisa 2023 para 89,2%; o valor de 87,9% no acervo antigo era de outra edição. Foram preservados somente os três anos identificados numericamente no gráfico da mesma edição. O gráfico também traz uma barra de geração centralizada (89,9% em 2025), com denominador diferente, excluída desta série.",
      coverage: "Brasil, oferta interna de energia elétrica de 2023 a 2025.",
      calculation:
        "Oferta interna de eletricidade de fontes renováveis dividida pela oferta interna de eletricidade total, multiplicada por 100; inclui geração nacional e importação líquida.",
    },
    [
      {
        id: "renovaveis_matriz",
        nome: "Participação renovável",
        dados: benSeries,
      },
    ],
    "BEN 2026 / Relatório Síntese, página 35",
    "Gráfico Brasil (2023–2025), página impressa 35; extração reproduzível em scripts/parse-ben.py. Somente OIEE, sem a barra de geração centralizada.",
    undefined,
  ),
);
const prodesValues = [
  21050, 17770, 13730, 11030, 13786, 14896, 14896, 29059, 18161, 13227, 17383,
  17259, 18226, 18165, 21650, 25396, 27772, 19014, 14286, 11651, 12911, 7464,
  7000, 6418, 4571, 5891, 5012, 6207, 7893, 6947, 7536, 10129, 10851, 13038,
  11594, 9064, 6518, 5731,
];
const prodes = curated(
  {
    id: "meio-ambiente-desmatamento-amazonia",
    title: "Amazônia Legal · Desmatamento anual PRODES",
    category: "meio-ambiente",
    unit: "km²",
    url: prodesConsolidated,
    source: "Instituto Nacional de Pesquisas Espaciais (INPE)",
    display: "bar",
    summary:
      "Área de supressão de floresta primária detectada pelo PRODES na Amazônia Legal em cada ano de monitoramento.",
    interpretation:
      "O ano PRODES vai de agosto do ano anterior a julho do ano indicado. Não equivale ao total de queimadas nem à área de todo o bioma Amazônia.",
    importance:
      "Permite acompanhar a perda anual de floresta na região monitorada.",
    limitations:
      "O valor de 2025 é a taxa consolidada de 5.731 km² publicada em agosto de 2026, substituindo a estimativa inicial de 5.796 km². O ranking mantém os valores consolidados de 2024, com período explícito. Demais UFs não integram a Amazônia Legal. A série histórica considera polígonos maiores que 6,25 hectares.",
    coverage:
      "Amazônia Legal; nove UFs, incluindo apenas a área abrangida pela delimitação regional.",
    calculation:
      "Taxa anual de desmatamento por sensoriamento remoto e metodologia PRODES do INPE.",
  },
  [
    {
      id: "prodes",
      nome: "Amazônia Legal",
      dados: prodesValues.map((v, i) => [String(1988 + i), v]),
    },
  ],
  "PRODES / série 1988–2025 / consolidado 2025",
  "Histórico 1988–2024: Figura 3, página 4 da nota técnica de 15/10/2025 (" +
    prodesPDF +
    "). Valor 2025: divulgação consolidada de 18/08/2026. Ranking: Tabela 2, coluna consolidada 2024.",
  "2026-08-18",
);
prodes.provenance.geography = "Amazônia Legal";
prodes.provenance.stateReference = "2024";
prodes.provenance.expectedStates = 9;
prodes.provenance.issues.push(
  "Ranking de 2024: a distribuição estadual consolidada de 2025 não foi transcrita da divulgação. As 18 UFs fora da região estão fora do universo, não são valores zero.",
);
prodes.visualizacao.dados_uf = [
  ["AC", "Acre", 449],
  ["AM", "Amazonas", 1223],
  ["AP", "Amapá", 27],
  ["MA", "Maranhão", 307],
  ["MT", "Mato Grosso", 1257],
  ["PA", "Pará", 2395],
  ["RO", "Rondônia", 360],
  ["RR", "Roraima", 468],
  ["TO", "Tocantins", 32],
].map(([uf, nome, valor]) => ({ uf, nome, valor }));
curatedDatasets.push(prodes);

curatedDatasets.push(
  curated(
    {
      id: "meio-ambiente-saneamento-esgoto",
      title: "Coleta de esgoto · Atendimento por rede",
      category: "meio-ambiente",
      url: sewage,
      source: "Ministério das Cidades / SINISA",
      display: "bar",
      summary:
        "Parcela da população atendida com rede coletora de esgoto, no ano de referência 2023 do SINISA 2024.",
      interpretation:
        "A cobertura total, urbana e rural usa populações de referência distintas. Atendimento por rede coletora não significa que todo o volume coletado receba tratamento.",
      importance:
        "Ajuda a identificar a cobertura e as desigualdades de acesso à infraestrutura de esgotamento sanitário.",
      limitations:
        "Valores consolidados do SINISA 2024, referência 2023. O acervo anterior sem rastreabilidade foi substituído por este recorte conferido. Não emendar automaticamente séries SNIS e SINISA: bases populacionais e participação de prestadores podem mudar. O ranking estadual não foi transcrito nesta edição.",
      coverage:
        "Brasil; indicadores consolidados de população total, urbana e rural no universo do SINISA.",
      calculation:
        "População atendida com rede coletora dividida pela população de referência de cada indicador, multiplicada por 100.",
    },
    [
      {
        id: "total",
        nome: "População total · IES0001",
        dados: [["2023", 59.7]],
      },
      {
        id: "urbana",
        nome: "População urbana · IES0002",
        dados: [["2023", 67.5]],
      },
      {
        id: "rural",
        nome: "População rural · IES0003",
        dados: [["2023", 5.6]],
      },
    ],
    "SINISA 2024 / IES0001, IES0002, IES0003",
    "Relatório de Esgotamento Sanitário, página 19. PDF arquivado em data/official-files/sinisa_esgoto_2024.pdf.",
    "2025-03-12",
  ),
);
