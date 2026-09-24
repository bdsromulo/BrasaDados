import { Indicator } from '../types/indicator';

export const INDICADORES_REAIS: Indicator[] = [
  {
    id: "economia-taxa-selic",
    slug: "taxa-selic-over-bcb",
    titulo: "Taxa de Juros Básica — Selic Meta (% a.a.)",
    categoria: "economia",
    subcategoria: "politica-monetaria",
    tags: ["economia", "juros", "selic", "banco central", "copom", "crédito"],
    fonte: {
      orgao: "Banco Central do Brasil (BCB)",
      pesquisa: "Sistema Gerenciador de Séries Temporais (SGS) — Série 4189",
      url_oficial: "https://www.bcb.gov.br/controleinflacao/taxaselic",
      frequencia: "A cada 45 dias (Reuniões do Copom)",
      ultima_atualizacao: "2026-03-20"
    },
    explicacao_leiga: {
      resumo: "A taxa Selic é a taxa básica de juros da economia brasileira, definida pelo Banco Central para controlar a inflação.",
      como_interpretar: "Quando a inflação está alta, o Banco Central costuma subir a Selic para encarecer o crédito, desestimular o consumo e segurar os preços. Quando a economia está desaquecida e a inflação está controlada, ele reduz a Selic para incentivar empréstimos e investimentos.",
      por_que_importa: "A Selic influencia diretamente os juros do seu cartão de crédito, do financiamento da casa própria, do rendimento da poupança e dos títulos públicos.",
      pontos_de_atencao: "Em 2020, durante a pandemia, a Selic atingiu a mínima histórica de 2,0% ao ano, sendo elevada para conter a inflação pós-pandemia até 13,75% em 2022."
    },
    detalhamento_tecnico: {
      formula_calculo: "Taxa média ajustada dos financiamentos diários apurados no Sistema Especial de Liquidação e Custódia para títulos federais, fixada como meta anual pelo Comitê de Política Monetária (Copom).",
      unidade_medida: "Percentual ao ano (% a.a.)",
      amostra_cobertura: "Universo das operações interbancárias lastreadas em títulos públicos federais registradas no Selic.",
      anonimizacao_sigilo: "Dados agregados de mercado financeiro sem identificação de instituições participantes individuais.",
      limitacoes_e_quebras_metodologicas: "A série histórica contínua da meta Selic iniciou-se em março de 1999 com a implantação do regime de Metas para a Inflação.",
      orientacoes_fact_checking: "Atenção para não confundir a 'Meta Selic' (fixada pelo Copom) com a 'Taxa Selic Efetiva diária' (que oscila levemente em torno da meta, geralmente 0,10 p.p. abaixo)."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: {
        tipo: "temporal",
        rotulo: "Ano"
      },
      eixo_y: {
        rotulo: "Taxa Selic (% a.a.)",
        unidade: "%",
        escala_min: 0,
        escala_max: 16
      },
      series: [
        {
          id: "selic_meta",
          nome: "Taxa Selic Meta",
          cor: "#10b981", // esmeralda
          dados: [
            [2015, 14.25],
            [2016, 13.75],
            [2017, 7.00],
            [2018, 6.50],
            [2019, 4.50],
            [2020, 2.00],
            [2021, 9.25],
            [2022, 13.75],
            [2023, 11.75],
            [2024, 11.25],
            [2025, 13.25],
            [2026, 12.00]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2020, rotulo: "Mínima histórica da Selic (2% a.a.) na Pandemia" },
        { ano: 2022, rotulo: "Ciclo de aperto monetário (13,75% a.a.)" }
      ]
    },
    citacao_sugerida: {
      abnt: "BANCO CENTRAL DO BRASIL. Séries Temporais do Banco Central: Taxa de Juros - Selic fixada pelo Copom (Série 4189). Brasília: BCB, 2026. Acesso via Brasa Dados."
    }
  },
  {
    id: "economia-inflacao-ipca",
    slug: "inflacao-ipca-acumulada-ibge",
    titulo: "Inflação Oficial — IPCA Acumulado 12 Meses (%)",
    categoria: "economia",
    subcategoria: "precos-e-custo-de-vida",
    tags: ["economia", "inflação", "ipca", "ibge", "preços", "custo de vida"],
    fonte: {
      orgao: "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      pesquisa: "Sistema Nacional de Índices de Preços ao Consumidor (SNIPC)",
      url_oficial: "https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html",
      frequencia: "Mensal",
      ultima_atualizacao: "2026-03-12"
    },
    explicacao_leiga: {
      resumo: "O IPCA mede a variação de preços da cesta de compras de famílias brasileiras com renda de 1 a 40 salários mínimos.",
      como_interpretar: "Uma taxa de 4% significa que, em média, os produtos e serviços ficaram 4% mais caros nos últimos 12 meses. Quando a inflação sobe, o poder de compra do dinheiro diminui.",
      por_que_importa: "É a métrica oficial utilizada pelo governo e pelo Banco Central para avaliar se o país está cumprindo a meta de inflação anual.",
      pontos_de_atencao: "Em 2021, o IPCA ultrapassou os 10% devido a gargalos nas cadeias produtivas globais, desvalorização do real e alta das commodities."
    },
    detalhamento_tecnico: {
      formula_calculo: "Média geométrica ponderada pelo índice de Laspeyres da variação de preços de centenas de itens (alimentos, habitação, transporte, saúde, etc.).",
      unidade_medida: "Variação percentual acumulada em 12 meses (%)",
      amostra_cobertura: "Áreas urbanas de 16 regiões metropolitanas e municípios do Brasil, cobrindo famílias com rendimento entre 1 e 40 salários mínimos.",
      anonimizacao_sigilo: "Preços coletados em estabelecimentos comerciais sem divulgação de dados fiscais dos comércios.",
      limitacoes_e_quebras_metodologicas: "A estrutura de pesos do IPCA é atualizada periodicamente com base na Pesquisa de Orçamentos Familiares (POF), tendo sido revisada pela última vez na POF 2017-2018.",
      orientacoes_fact_checking: "Não confunda o IPCA com o IGP-M (da FGV). O IGP-M sofre forte influência do câmbio no atacado e de matérias-primas agrícolas, enquanto o IPCA foca no consumidor final urbano."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: {
        tipo: "temporal",
        rotulo: "Ano"
      },
      eixo_y: {
        rotulo: "IPCA Acumulado (%)",
        unidade: "%",
        escala_min: 0,
        escala_max: 12
      },
      series: [
        {
          id: "ipca_12m",
          nome: "IPCA Acumulado 12m",
          cor: "#f59e0b", // âmbar
          dados: [
            [2015, 10.67],
            [2016, 6.29],
            [2017, 2.95],
            [2018, 3.75],
            [2019, 4.31],
            [2020, 4.52],
            [2021, 10.06],
            [2022, 5.79],
            [2023, 4.62],
            [2024, 4.83],
            [2025, 4.25],
            [2026, 3.90]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2015, rotulo: "Pico de 10,67% (reajustes de tarifas)" },
        { ano: 2021, rotulo: "Pico inflacionário pós-pandemia (10,06%)" }
      ]
    },
    citacao_sugerida: {
      abnt: "IBGE — INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA. Índice Nacional de Preços ao Consumidor Amplo (IPCA). Rio de Janeiro: IBGE, 2026. Acesso via Brasa Dados."
    }
  },
  {
    id: "educacao-ideb-ensino-medio",
    slug: "ideb-ensino-medio-brasil",
    titulo: "IDEB — Índice da Educação Básica (Ensino Médio)",
    categoria: "educacao",
    subcategoria: "desempenho-escolar",
    tags: ["educação", "ideb", "inep", "saeb", "ensino médio", "escola pública"],
    fonte: {
      orgao: "INEP / Ministério da Educação",
      pesquisa: "Censo Escolar e Sistema de Avaliação da Educação Básica (Saeb)",
      url_oficial: "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb",
      frequencia: "Bienal (a cada 2 anos)",
      ultima_atualizacao: "2024-08-14"
    },
    explicacao_leiga: {
      resumo: "O IDEB é a nota oficial da qualidade educacional brasileira para escolas públicas e privadas, variando de 0 a 10.",
      como_interpretar: "Combina o fluxo escolar (quantos alunos passam de ano sem reprovação ou abandono) com a nota das provas de Português e Matemática no Saeb.",
      por_que_importa: "Garante que uma escola não seja bem avaliada apenas 'aprovando todo mundo sem ensinar nada' ou 'reprovando e excluindo os alunos com mais dificuldades'.",
      pontos_de_atencao: "A meta histórica projetada para o Ensino Médio era de 5,2 pontos em 2021. Em 2023, o Brasil atingiu 4,3 pontos."
    },
    detalhamento_tecnico: {
      formula_calculo: "IDEB_j = N_j * P_j, onde N_j é a nota média padronizada no Saeb (0 a 10) e P_j é a taxa média de aprovação da etapa.",
      unidade_medida: "Pontos (escala contínua de 0 a 10)",
      amostra_cobertura: "Censitário para todas as escolas públicas e privadas com pelo menos 10 alunos matriculados na 3ª série do EM.",
      anonimizacao_sigilo: "Escolas com menos de 10 alunos têm os resultados omitidos por sigilo estatístico e conformidade com a LGPD.",
      limitacoes_e_quebras_metodologicas: "O IDEB 2021 teve distorção de comparabilidade devido à aprovação automática adotada em vários estados durante a pandemia da Covid-19.",
      orientacoes_fact_checking: "Não compare a meta do Ensino Médio diretamente com a dos Anos Iniciais do Fundamental (que possuem escalas e metas distintas)."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: {
        tipo: "temporal",
        rotulo: "Ano de Avaliação"
      },
      eixo_y: {
        rotulo: "Nota IDEB",
        unidade: "pontos",
        escala_min: 0,
        escala_max: 8
      },
      series: [
        {
          id: "publica",
          nome: "Rede Pública",
          cor: "#3b82f6", // azul
          dados: [
            [2015, 3.5],
            [2017, 3.5],
            [2019, 3.9],
            [2021, 3.9],
            [2023, 4.1]
          ]
        },
        {
          id: "privada",
          nome: "Rede Privada",
          cor: "#10b981", // verde
          dados: [
            [2015, 5.3],
            [2017, 5.8],
            [2019, 6.0],
            [2021, 5.6],
            [2023, 5.8]
          ]
        },
        {
          id: "total",
          nome: "Média Geral Brasil",
          cor: "#8b5cf6", // roxo
          estilo: "dashed",
          dados: [
            [2015, 3.7],
            [2017, 3.8],
            [2019, 4.2],
            [2021, 4.2],
            [2023, 4.3]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2021, rotulo: "Edição da Pandemia (aprovação excepcional)" }
      ]
    },
    citacao_sugerida: {
      abnt: "INEP. Índice de Desenvolvimento da Educação Básica (IDEB) 2023: Resultados Nacionais. Brasília: MEC/INEP, 2024. Acesso via Brasa Dados."
    }
  },
  {
    id: "educacao-pisa-matematica",
    slug: "pisa-matematica-brasil-ocde",
    titulo: "PISA — Matemática: Brasil vs. OCDE e Chile (Pontos)",
    categoria: "internacional",
    subcategoria: "educacao-comparada",
    tags: ["internacional", "pisa", "ocde", "matemática", "inep", "educação"],
    fonte: {
      orgao: "OCDE / INEP / Banco Mundial",
      pesquisa: "Programme for International Student Assessment (PISA)",
      url_oficial: "https://www.oecd.org/pisa/",
      frequencia: "Trienal (a cada 3 anos)",
      ultima_atualizacao: "2023-12-05"
    },
    explicacao_leiga: {
      resumo: "O PISA é o principal exame internacional que compara a capacidade de jovens de 15 anos em aplicar conhecimentos matemáticos na resolução de problemas da vida real.",
      como_interpretar: "A média dos países desenvolvidos da OCDE gira em torno de 470 a 500 pontos. O Brasil historicamente pontua abaixo de 400 pontos, indicando defasagem no aprendizado fundamental.",
      por_que_importa: "Permite saber se o ensino brasileiro está acompanhando a formação técnica das principais economias do mundo.",
      pontos_de_atencao: "No PISA 2022, 73% dos alunos brasileiros de 15 anos não atingiram o nível básico de proficiência em matemática (Nível 2)."
    },
    detalhamento_tecnico: {
      formula_calculo: "Escala calibrada pela Teoria de Resposta ao Item (TRI) com média estandardizada de 500 pontos e desvio padrão de 100 pontos no ano base.",
      unidade_medida: "Pontuação padronizada (escala contínua)",
      amostra_cobertura: "Amostragem estratificada em dois estágios representando estudantes de 15 anos matriculados a partir do 7º ano do Ensino Fundamental.",
      anonimizacao_sigilo: "Dados públicos disponibilizados com anonimização total dos estudantes e das instituições escolares.",
      limitacoes_e_quebras_metodologicas: "A edição que ocorreria em 2021 foi adiada para 2022 devido à pandemia global de Covid-19.",
      orientacoes_fact_checking: "O PISA avalia a proficiência aos 15 anos, independentemente de o aluno estar atrasado ou no ano correto do ensino médio."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: {
        tipo: "temporal",
        rotulo: "Ano do Exame"
      },
      eixo_y: {
        rotulo: "Pontuação Média",
        unidade: "pontos",
        escala_min: 300,
        escala_max: 550
      },
      series: [
        {
          id: "brasil",
          nome: "Brasil",
          cor: "#16a34a", // verde
          dados: [
            [2003, 356],
            [2006, 370],
            [2009, 386],
            [2012, 391],
            [2015, 377],
            [2018, 384],
            [2022, 379]
          ]
        },
        {
          id: "ocde",
          nome: "Média Países da OCDE",
          cor: "#2563eb", // azul
          estilo: "dashed",
          dados: [
            [2003, 500],
            [2006, 498],
            [2009, 496],
            [2012, 494],
            [2015, 490],
            [2018, 489],
            [2022, 472]
          ]
        },
        {
          id: "chile",
          nome: "Chile (Referência América Latina)",
          cor: "#ea580c", // laranja
          dados: [
            [2003, 387],
            [2006, 411],
            [2009, 421],
            [2012, 423],
            [2015, 423],
            [2018, 417],
            [2022, 412]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2022, rotulo: "Queda global pós-pandemia (OCDE caiu 17 pts)" }
      ]
    },
    citacao_sugerida: {
      abnt: "OECD. PISA 2022 Results: The State of Learning and Equity in Education. Paris: OECD Publishing, 2023. Acesso via Brasa Dados."
    }
  },
  {
    id: "seguranca-taxa-mvi",
    slug: "mortes-violentas-intencionais-brasil",
    titulo: "Segurança — Mortes Violentas Intencionais (MVI por 100 mil hab.)",
    categoria: "seguranca",
    subcategoria: "violencia-letal",
    tags: ["segurança", "violência", "mvi", "homicídios", "fbsp", "atlas da violência"],
    fonte: {
      orgao: "Fórum Brasileiro de Segurança Pública (FBSP) / IPEA",
      pesquisa: "Anuário Brasileiro de Segurança Pública & Atlas da Violência",
      url_oficial: "https://forumseguranca.org.br/anuario-brasileiro-seguranca-publica/",
      frequencia: "Anual",
      ultima_atualizacao: "2025-07-18"
    },
    explicacao_leiga: {
      resumo: "A taxa de MVI mede quantas mortes violentas ocorreram no país a cada grupo de 100 mil habitantes.",
      como_interpretar: "Soma quatro categorias: homicídios dolosos, latrocínios (roubo com morte), lesão corporal seguida de morte e mortes decorrentes de intervenção policial.",
      por_que_importa: "É o indicador mais consistente da violência letal brasileira, pois unifica tipificações penais que variam entre as polícias civis de diferentes estados.",
      pontos_de_atencao: "O pico da série ocorreu em 2017 com 30,8 mortes por 100 mil habitantes (63.880 mortes no ano), apresentando tendência de queda desde então."
    },
    detalhamento_tecnico: {
      formula_calculo: "Taxa MVI = (Soma de Homicídios Dolosos + Latrocínios + Lesões Corporais Mortais + Mortes por Intervenção Policial / População Estimada IBGE) * 100.000.",
      unidade_medida: "Mortes por 100 mil habitantes",
      amostra_cobertura: "Registros de ocorrências policiais das 27 Secretarias de Segurança Pública Estaduais e do DF.",
      anonimizacao_sigilo: "Dados sumarizados em nível estadual e nacional, com identificação apenas de perfil sociodemográfico agregado.",
      limitacoes_e_quebras_metodologicas: "Subnotificação de mortes a esclarecer em certos estados e diferenças de classificação de mortes policiais antes de 2015.",
      orientacoes_fact_checking: "Não compare a taxa de MVI apenas com a taxa de 'Homicídio Doloso': a MVI inclui as mortes causadas por agentes do Estado e latrocínios."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: {
        tipo: "temporal",
        rotulo: "Ano"
      },
      eixo_y: {
        rotulo: "Taxa por 100 mil hab.",
        unidade: "por 100 mil",
        escala_min: 15,
        escala_max: 35
      },
      series: [
        {
          id: "taxa_mvi",
          nome: "Taxa MVI Brasil",
          cor: "#dc2626", // vermelho intenso
          dados: [
            [2015, 28.9],
            [2016, 29.7],
            [2017, 30.8],
            [2018, 27.5],
            [2019, 22.7],
            [2020, 23.6],
            [2021, 22.3],
            [2022, 23.4],
            [2023, 22.8],
            [2024, 21.9]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2017, rotulo: "Pico histórico nacional (30,8 por 100 mil)" }
      ]
    },
    citacao_sugerida: {
      abnt: "FÓRUM BRASILEIRO DE SEGURANÇA PÚBLICA. 18º Anuário Brasileiro de Segurança Pública. São Paulo: FBSP, 2024. Acesso via Brasa Dados."
    }
  },
  {
    id: "economia-desemprego-pnad",
    slug: "taxa-de-desocupacao-pnad-continua",
    titulo: "Mercado de Trabalho — Taxa de Desocupação (%)",
    categoria: "economia",
    subcategoria: "trabalho-e-renda",
    tags: ["economia", "emprego", "desemprego", "desocupação", "ibge", "pnad contínua"],
    fonte: {
      orgao: "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      pesquisa: "Pesquisa Nacional por Amostra de Domicílios Contínua (PNAD Contínua)",
      url_oficial: "https://www.ibge.gov.br/estatisticas/sociais/trabalho/9173-pesquisa-nacional-por-amostra-de-domicilios-continua-trimestral.html",
      frequencia: "Trimestral / Mensal móvel",
      ultima_atualizacao: "2026-02-28"
    },
    explicacao_leiga: {
      resumo: "A taxa de desocupação (conhecida popularmente como desemprego) mede a proporção de pessoas em idade de trabalhar que procuraram emprego e não encontraram.",
      como_interpretar: "Uma taxa de 7% significa que, de cada 100 pessoas disponíveis e em busca ativa de ocupação, 7 não conseguiram trabalhar.",
      por_que_importa: "Indica a saúde do mercado formal e informal de trabalho e a facilidade ou dificuldade para um cidadão encontrar renda.",
      pontos_de_atencao: "Quem não procurou trabalho nos últimos 30 dias (por exemplo, estudantes que só estudam ou pessoas desalentadas) não entra no cálculo do desemprego."
    },
    detalhamento_tecnico: {
      formula_calculo: "Taxa de Desocupação = (População Desocupada / Força de Trabalho) * 100.",
      unidade_medida: "Percentual (%)",
      amostra_cobertura: "Amostra probabilística de cerca de 211 mil domicílios em mais de 3.500 municípios do país a cada trimestre.",
      anonimizacao_sigilo: "Microdados totalmente desidentificados de acordo com a lei do sigilo estatístico do IBGE.",
      limitacoes_e_quebras_metodologicas: "Em 2012 houve a transição da antiga PME (Pesquisa Mensal de Emprego) para a PNAD Contínua com cobertura nacional integral.",
      orientacoes_fact_checking: "Não confunda 'taxa de desocupação' com 'taxa de subutilização da força de trabalho' (que inclui quem trabalha menos horas do que gostaria ou desistiu de procurar)."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: {
        tipo: "temporal",
        rotulo: "Ano"
      },
      eixo_y: {
        rotulo: "Desocupação (%)",
        unidade: "%",
        escala_min: 0,
        escala_max: 16
      },
      series: [
        {
          id: "taxa_desemprego",
          nome: "Taxa de Desocupação Média Anual",
          cor: "#6366f1", // índigo
          dados: [
            [2015, 8.5],
            [2016, 11.5],
            [2017, 12.7],
            [2018, 12.3],
            [2019, 11.9],
            [2020, 13.5],
            [2021, 13.2],
            [2022, 9.3],
            [2023, 7.8],
            [2024, 6.9],
            [2025, 6.6]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2020, rotulo: "Pico durante a pandemia (13,5% de desocupação)" },
        { ano: 2024, rotulo: "Menor patamar desde 2014 (6,9%)" }
      ]
    },
    citacao_sugerida: {
      abnt: "IBGE. Pesquisa Nacional por Amostra de Domicílios Contínua (PNAD Contínua). Rio de Janeiro: IBGE, 2025. Acesso via Brasa Dados."
    }
  },
  {
    id: "economia-pib-variacao",
    slug: "pib-variacao-real-anual-ibge",
    titulo: "Atividade Econômica — Crescimento Real do PIB (% anual)",
    categoria: "economia",
    subcategoria: "contas-nacionais",
    tags: ["economia", "pib", "crescimento", "recessão", "ibge", "contas nacionais"],
    fonte: {
      orgao: "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      pesquisa: "Sistema de Contas Nacionais Trimestrais (SCNT)",
      url_oficial: "https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais/9300-contas-nacionais-trimestrais.html",
      frequencia: "Trimestral / Anual",
      ultima_atualizacao: "2026-03-05"
    },
    explicacao_leiga: {
      resumo: "O PIB mede tudo o que o Brasil produziu de riqueza em um ano, descontando o efeito puramente artificial da inflação.",
      como_interpretar: "Valores positivos indicam expansão econômica (geração de emprego e negócios). Valores negativos representam recessão (contração da economia).",
      por_que_importa: "Determina a capacidade do país de aumentar sua renda média e arrecadar recursos para saúde, educação e infraestrutura.",
      pontos_de_atencao: "Em 2020, a economia recuou 3,3% devido ao fechamento de atividades na pandemia, recuperando-se com alta de 5,0% em 2021."
    },
    detalhamento_tecnico: {
      formula_calculo: "Taxa de variação em volume calculada pela ótica da produção (Agropecuária, Indústria e Serviços) e pela ótica da despesa (Consumo das Famílias, Governo, Investimento FBCF e Setor Externo).",
      unidade_medida: "Taxa percentual de variação em volume no ano (%)",
      amostra_cobertura: "Universo da economia brasileira estimado pelo SCNT com base em pesquisas estruturais agropecuárias, industriais e de serviços.",
      anonimizacao_sigilo: "Dados macroeconômicos estritamente consolidados.",
      limitacoes_e_quebras_metodologicas: "A série com base de referência atual utiliza a metodologia internacional do System of National Accounts (SNA 2008).",
      orientacoes_fact_checking: "Sempre diferencie o 'Crescimento Real' (que desconta a inflação) do 'PIB Nominal em Reais Correntes' (que pode subir apenas por aumento generalizado de preços)."
    },
    visualizacao: {
      tipo_padrao: "bar",
      eixo_x: {
        tipo: "temporal",
        rotulo: "Ano"
      },
      eixo_y: {
        rotulo: "Variação do PIB (%)",
        unidade: "%",
        escala_min: -5,
        escala_max: 7
      },
      series: [
        {
          id: "crescimento_pib",
          nome: "Crescimento Real do PIB (% anual)",
          cor: "#0ea5e9", // azul céu
          dados: [
            [2015, -3.55],
            [2016, -3.28],
            [2017, 1.32],
            [2018, 1.78],
            [2019, 1.22],
            [2020, -3.28],
            [2021, 4.99],
            [2022, 3.02],
            [2023, 2.91],
            [2024, 3.20],
            [2025, 2.40]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2015, rotulo: "Recessão de 2015-2016" },
        { ano: 2020, rotulo: "Choque pandêmico (-3,3%)" },
        { ano: 2021, rotulo: "Rebote econômico pós-isolamento (+5,0%)" }
      ]
    },
    citacao_sugerida: {
      abnt: "IBGE. Sistema de Contas Nacionais: Brasil 2024. Rio de Janeiro: Coordenação de Contas Nacionais/IBGE, 2025. Acesso via Brasa Dados."
    }
  }
];

export const CATEGORIAS_INFO = [
  { id: 'economia', nome: 'Economia & Trabalho', icone: 'TrendingUp', cor: 'emerald', count: 4 },
  { id: 'educacao', nome: 'Educação & Aprendizado', icone: 'GraduationCap', cor: 'blue', count: 1 },
  { id: 'seguranca', nome: 'Segurança Pública', icone: 'ShieldAlert', cor: 'red', count: 1 },
  { id: 'internacional', nome: 'Panorama Internacional', icone: 'Globe2', cor: 'purple', count: 1 },
  { id: 'saude', nome: 'Saúde & Vigilância', icone: 'HeartPulse', cor: 'rose', count: 0 },
  { id: 'meio-ambiente', nome: 'Meio Ambiente & Clima', icone: 'Trees', cor: 'amber', count: 0 },
] as const;
