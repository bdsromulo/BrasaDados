import { Indicator } from '../types/indicator';

export const INDICADORES_REAIS: Indicator[] = [
  // ==========================================
  // 1. ECONOMIA & TRABALHO
  // ==========================================
  {
    id: "economia-taxa-selic",
    slug: "taxa-selic-over-bcb",
    titulo: "Taxa Básica de Juros — Selic Meta (% a.a.)",
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
      resumo: "A taxa Selic é a taxa básica de juros da economia brasileira, fixada pelo Banco Central para controlar a inflação.",
      como_interpretar: "Quando a inflação está alta, o BC sobe a Selic para desaquecer o consumo e encarecer empréstimos. Com a inflação controlada, ele reduz a Selic para estimular investimentos.",
      por_que_importa: "Afeta diretamente o custo do cartão de crédito, empréstimos bancários, financiamentos imobiliários e o rendimento de investimentos.",
      pontos_de_atencao: "Em 2020 atingiu a mínima de 2,0% a.a. na pandemia, subindo a 13,75% em 2022 para conter o repique inflacionário."
    },
    detalhamento_tecnico: {
      formula_calculo: "Taxa média ajustada dos financiamentos diários apurados no Sistema Especial de Liquidação e Custódia para títulos federais, fixada como meta anual pelo Copom.",
      unidade_medida: "% ao ano",
      amostra_cobertura: "Universo das operações interbancárias com títulos públicos federais.",
      anonimizacao_sigilo: "Dados macroeconômicos agregados de mercado financeiro sem identificação institucional.",
      limitacoes_e_quebras_metodologicas: "Série contínua iniciada em março de 1999 com o regime de metas para a inflação.",
      orientacoes_fact_checking: "Não confunda a 'Meta Selic' do Copom com a 'Selic Efetiva diária' apurada pelo mercado."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Taxa Selic (% a.a.)", unidade: "%", escala_min: 0, escala_max: 16 },
      series: [
        {
          id: "selic_meta",
          nome: "Taxa Selic Meta",
          cor: "#10b981",
          dados: [
            [2015, 14.25], [2016, 13.75], [2017, 7.00], [2018, 6.50],
            [2019, 4.50], [2020, 2.00], [2021, 9.25], [2022, 13.75],
            [2023, 11.75], [2024, 11.25], [2025, 13.25], [2026, 12.00]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2020, rotulo: "Mínima histórica de 2% a.a." },
        { ano: 2022, rotulo: "Pico de 13,75% no pós-pandemia" }
      ]
    },
    citacao_sugerida: {
      abnt: "BANCO CENTRAL DO BRASIL. Séries Temporais do Banco Central: Taxa Selic fixada pelo Copom (Série 4189). Brasília: BCB, 2026. Acesso via Brasa Dados."
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
      resumo: "O IPCA mede a variação de preços da cesta de compras de famílias com renda de 1 a 40 salários mínimos.",
      como_interpretar: "Uma taxa positiva indica que as compras ficaram mais caras. Quando o IPCA desacelera, os preços continuam subindo, porém em ritmo mais moderado.",
      por_que_importa: "É o termômetro oficial da perda do poder de compra dos salários e orienta as decisões de taxa de juros do país.",
      pontos_de_atencao: "Em 2021 superou 10% devido a gargalos internacionais de abastecimento e alta no preço dos combustíveis e alimentos."
    },
    detalhamento_tecnico: {
      formula_calculo: "Média geométrica ponderada pelo índice de Laspeyres cobrindo 9 grupos de despesas familiares.",
      unidade_medida: "% em 12 meses",
      amostra_cobertura: "16 áreas urbanas e regiões metropolitanas cobrindo famílias de 1 a 40 salários mínimos.",
      anonimizacao_sigilo: "Levantamento de preços em estabelecimentos comerciais sem divulgação fiscal de empresas.",
      limitacoes_e_quebras_metodologicas: "Pesos revisados com base na Pesquisa de Orçamentos Familiares (POF 2017-2018).",
      orientacoes_fact_checking: "O IPCA afere o consumidor final urbano, diferentemente do IGP-M que reflete matérias-primas e atacado."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "IPCA Acumulado (%)", unidade: "%", escala_min: 0, escala_max: 12 },
      series: [
        {
          id: "ipca_12m",
          nome: "IPCA Acumulado 12m",
          cor: "#f59e0b",
          dados: [
            [2015, 10.67], [2016, 6.29], [2017, 2.95], [2018, 3.75],
            [2019, 4.31], [2020, 4.52], [2021, 10.06], [2022, 5.79],
            [2023, 4.62], [2024, 4.83], [2025, 4.25], [2026, 3.90]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2015, rotulo: "10,67% (choque de tarifas públicas)" },
        { ano: 2021, rotulo: "10,06% (inflação global pós-pandemia)" }
      ]
    },
    citacao_sugerida: {
      abnt: "IBGE. Sistema Nacional de Índices de Preços ao Consumidor (SNIPC): IPCA. Rio de Janeiro: IBGE, 2026. Acesso via Brasa Dados."
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
      resumo: "Mede a proporção de pessoas aptas e que procuraram trabalho ativamente nos últimos 30 dias mas não encontraram.",
      como_interpretar: "Uma taxa de 6,9% indica que 6,9 de cada 100 pessoas no mercado de trabalho não conseguiram vaga.",
      por_que_importa: "Sinaliza o nível de aquecimento econômico, geração de renda e facilidade para a população se manter financeiramente.",
      pontos_de_atencao: "Desalentados (quem desistiu de buscar trabalho) ou estudantes que não procuram vaga não contam como desocupados."
    },
    detalhamento_tecnico: {
      formula_calculo: "(População Desocupada / Força de Trabalho Total) * 100.",
      unidade_medida: "%",
      amostra_cobertura: "Amostra probabilística de 211 mil domicílios em mais de 3.500 municípios do país.",
      anonimizacao_sigilo: "Dados domiciliares desidentificados protegidos por sigilo estatístico do IBGE.",
      limitacoes_e_quebras_metodologicas: "Metodologia contínua iniciada em 2012, substituindo a antiga PME restrita a 6 capitais.",
      orientacoes_fact_checking: "Não confunda desocupação com informalidade (que mede quantos trabalham sem carteira assinada ou CNPJ)."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Desocupação (%)", unidade: "%", escala_min: 0, escala_max: 16 },
      series: [
        {
          id: "taxa_desemprego",
          nome: "Taxa Média Anual de Desocupação",
          cor: "#6366f1",
          dados: [
            [2015, 8.5], [2016, 11.5], [2017, 12.7], [2018, 12.3],
            [2019, 11.9], [2020, 13.5], [2021, 13.2], [2022, 9.3],
            [2023, 7.8], [2024, 6.9], [2025, 6.6]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2020, rotulo: "13,5% na pandemia" },
        { ano: 2024, rotulo: "6,9% (mínima em 10 anos)" }
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
      resumo: "Mede o crescimento físico da riqueza e serviços produzidos no Brasil, descontando a ilusão da inflação.",
      como_interpretar: "Valores acima de zero indicam expansão da economia. Valores abaixo de zero caracterizam recessão econômica.",
      por_que_importa: "Determina a capacidade da nação em gerar riqueza real por habitante e arrecadar fundos para serviços públicos.",
      pontos_de_atencao: "Em 2020 a economia encolheu 3,3% com a quarentena, tendo forte rebote de 5,0% em 2021 com a reabertura."
    },
    detalhamento_tecnico: {
      formula_calculo: "Taxa de variação em volume do Valor Adicionado Bruto somado aos Impostos Líquidos sobre Produtos.",
      unidade_medida: "% anual",
      amostra_cobertura: "Toda a economia brasileira compilada pelo Sistema de Contas Nacionais (SNA 2008).",
      anonimizacao_sigilo: "Dados estritamente agregados de Contas Nacionais.",
      limitacoes_e_quebras_metodologicas: "Série histórica harmonizada com metodologia de referência internacional SNA 2008.",
      orientacoes_fact_checking: "Sempre cite o 'PIB Real' (volume desinflacionado), e não o 'PIB Nominal' em reais correntes."
    },
    visualizacao: {
      tipo_padrao: "bar",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Variação do PIB (%)", unidade: "%", escala_min: -5, escala_max: 7 },
      series: [
        {
          id: "crescimento_pib",
          nome: "Crescimento Real do PIB (% anual)",
          cor: "#0ea5e9",
          dados: [
            [2015, -3.55], [2016, -3.28], [2017, 1.32], [2018, 1.78],
            [2019, 1.22], [2020, -3.28], [2021, 4.99], [2022, 3.02],
            [2023, 2.91], [2024, 3.20], [2025, 2.40]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2015, rotulo: "Recessão de 2015-2016 (-3,55%)" },
        { ano: 2020, rotulo: "Impacto pandêmico (-3,28%)" },
        { ano: 2021, rotulo: "Rebote pós-isolamento (+4,99%)" }
      ]
    },
    citacao_sugerida: {
      abnt: "IBGE. Sistema de Contas Nacionais: Contas Trimestrais. Rio de Janeiro: IBGE, 2025. Acesso via Brasa Dados."
    }
  },
  {
    id: "economia-indice-gini",
    slug: "indice-de-gini-desigualdade-renda-ibge",
    titulo: "Desigualdade de Renda — Coeficiente de Gini (0 a 1)",
    categoria: "economia",
    subcategoria: "distribuicao-de-renda",
    tags: ["economia", "gini", "desigualdade", "renda", "ibge", "pobreza"],
    fonte: {
      orgao: "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      pesquisa: "Pesquisa Nacional por Amostra de Domicílios Contínua (PNAD Contínua - Rendimento de Todas as Fontes)",
      url_oficial: "https://www.ibge.gov.br/estatisticas/sociais/rendimento-despesa-e-consumo/19897-pesquisa-nacional-por-amostra-de-domicilios-continua-rendimento-de-todas-as-fontes.html",
      frequencia: "Anual",
      ultima_atualizacao: "2025-05-10"
    },
    explicacao_leiga: {
      resumo: "O Coeficiente de Gini mede o grau de desigualdade na distribuição de renda da população, variando de 0 a 1.",
      como_interpretar: "Zero corresponderia à igualdade perfeita (todos com a mesma renda) e 1 à desigualdade máxima (uma só pessoa com toda a renda). Quanto menor o índice, menor é a desigualdade.",
      por_que_importa: "Permite acompanhar se o crescimento econômico do país está sendo compartilhado com a base da pirâmide social.",
      pontos_de_atencao: "Em 2023, o Gini do rendimento domiciliar per capita atingiu 0,518, o menor patamar já registrado desde o início da PNAD Contínua em 2012."
    },
    detalhamento_tecnico: {
      formula_calculo: "Área de concentração de Lorenz dividida pela área máxima sob a linha de perfeita igualdade, apurada sobre o rendimento domiciliar per capita.",
      unidade_medida: "Coeficiente (0 a 1)",
      amostra_cobertura: "Amostra nacional de domicílios entrevistados em todas as Unidades da Federação.",
      anonimizacao_sigilo: "Dados estritamente anônimos protegidos por sigilo legal.",
      limitacoes_e_quebras_metodologicas: "Em 2020 a pandemia impediu coletas presenciais em alguns meses, tendo ocorrido ajustes por entrevistas telefônicas.",
      orientacoes_fact_checking: "Sempre verifique se a fonte está usando 'Gini do Rendimento do Trabalho' ou 'Gini de Todas as Fontes' (que inclui benefícios sociais como Bolsa Família e aposentadorias)."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Índice de Gini", unidade: "pontos", escala_min: 0.48, escala_max: 0.56 },
      series: [
        {
          id: "gini_total",
          nome: "Gini Rendimento Domiciliar per Capita",
          cor: "#d97706",
          dados: [
            [2015, 0.524], [2016, 0.537], [2017, 0.538], [2018, 0.545],
            [2019, 0.544], [2020, 0.524], [2021, 0.544], [2022, 0.518],
            [2023, 0.518], [2024, 0.515], [2025, 0.512]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2018, rotulo: "Pico recente de desigualdade (0,545)" },
        { ano: 2020, rotulo: "Efeito do Auxílio Emergencial (0,524)" },
        { ano: 2023, rotulo: "Mínima histórica da série (0,518)" }
      ]
    },
    citacao_sugerida: {
      abnt: "IBGE. PNAD Contínua: Rendimento de todas as fontes 2023. Rio de Janeiro: IBGE, 2024. Acesso via Brasa Dados."
    }
  },
  {
    id: "economia-divida-bruta",
    slug: "divida-bruta-governo-geral-bcb",
    titulo: "Contas Públicas — Dívida Bruta do Governo Geral (% do PIB)",
    categoria: "economia",
    subcategoria: "politica-fiscal",
    tags: ["economia", "dívida", "fiscal", "pib", "banco central", "tesouro"],
    fonte: {
      orgao: "Banco Central do Brasil (BCB)",
      pesquisa: "Estatísticas Fiscais — Série SGS 4537",
      url_oficial: "https://www.bcb.gov.br/estatisticas/estatisticasfiscais",
      frequencia: "Mensal",
      ultima_atualizacao: "2026-02-15"
    },
    explicacao_leiga: {
      resumo: "Mede o tamanho do endividamento consolidado do Governo Federal, INSS e governos estaduais e municipais em relação ao PIB.",
      como_interpretar: "Uma dívida de 76% significa que o governo deve o equivalente a 76% de tudo o que a economia do país produz em um ano.",
      por_que_importa: "Dívidas muito elevadas aumentam o risco de crédito do país, forçam os juros para cima e encarecem a rolagem de títulos públicos.",
      pontos_de_atencao: "Em 2020 a dívida atingiu 86,9% do PIB devido aos programas emergenciais de saúde e suporte financeiro na pandemia."
    },
    detalhamento_tecnico: {
      formula_calculo: "(Estoque da Dívida Bruta do Governo Geral / PIB nominal acumulado dos últimos 12 meses) * 100.",
      unidade_medida: "% do PIB",
      amostra_cobertura: "Governo Federal, Previdência Social (INSS), Estados e Municípios (exclui empresas estatais e Banco Central).",
      anonimizacao_sigilo: "Dados contábeis consolidados oficiais da Secretaria do Tesouro Nacional e do Banco Central.",
      limitacoes_e_quebras_metodologicas: "Critério harmonizado com o Manual de Estatísticas de Finanças Públicas do FMI (GFSM 2014).",
      orientacoes_fact_checking: "Diferencie 'Dívida Bruta' (DBGG) de 'Dívida Líquida' (DLSP), que abate as reservas cambiais e ativos financeiros mantidos pelo governo."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "DBGG (% do PIB)", unidade: "% do PIB", escala_min: 50, escala_max: 95 },
      series: [
        {
          id: "divida_bruta",
          nome: "Dívida Bruta do Governo Geral",
          cor: "#e11d48",
          dados: [
            [2015, 65.5], [2016, 69.8], [2017, 74.1], [2018, 75.3],
            [2019, 74.4], [2020, 86.9], [2021, 78.3], [2022, 71.7],
            [2023, 74.4], [2024, 76.2], [2025, 78.5]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2020, rotulo: "Pico de 86,9% (gastos Covid-19)" },
        { ano: 2022, rotulo: "Redução para 71,7% (efeito inflação no PIB nominal)" }
      ]
    },
    citacao_sugerida: {
      abnt: "BANCO CENTRAL DO BRASIL. Estatísticas Fiscais: Dívida Bruta do Governo Geral (Série 4537). Brasília: BCB, 2025. Acesso via Brasa Dados."
    }
  },
  {
    id: "economia-cambio-dolar",
    slug: "taxa-de-cambio-dolar-comercial-bcb",
    titulo: "Moeda & Câmbio — Dólar Comercial Médio Anual (R$/US$)",
    categoria: "economia",
    subcategoria: "mercado-de-cambio",
    tags: ["economia", "dólar", "câmbio", "real", "moeda", "banco central"],
    fonte: {
      orgao: "Banco Central do Brasil (BCB)",
      pesquisa: "Taxas de Câmbio de Fechamento PTAX — Série SGS 1",
      url_oficial: "https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes",
      frequencia: "Diária / Média Anual",
      ultima_atualizacao: "2026-03-24"
    },
    explicacao_leiga: {
      resumo: "Mede o valor médio do Dólar norte-americano em Reais durante as transações comerciais do ano.",
      como_interpretar: "Quando o dólar sobe, produtos importados (como trigo, fertilizantes e eletrônicos) ficam mais caros em reais, mas exportadores ganham mais.",
      por_que_importa: "O câmbio pressiona os preços no supermercado e no posto de gasolina, além de ditar a competitividade externa das empresas brasileiras.",
      pontos_de_atencao: "Em 2014 o dólar médio era R$ 2,35; a partir da crise de 2015 e da pandemia de 2020 passou a operar permanentemente acima de R$ 5,00."
    },
    detalhamento_tecnico: {
      formula_calculo: "Média aritmética das cotações diárias de venda da taxa PTAX apurada pelo Banco Central.",
      unidade_medida: "R$ por US$",
      amostra_cobertura: "Mercado interbancário de câmbio brasileiro.",
      anonimizacao_sigilo: "Dados públicos consolidados de taxas cambiais.",
      limitacoes_e_quebras_metodologicas: "Regime de câmbio flutuante instituído em janeiro de 1999.",
      orientacoes_fact_checking: "A cotação PTAX (comercial) difere do câmbio turismo, que inclui margens de lucro de corretoras e IOF."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Cotação Média (R$)", unidade: "R$", escala_min: 1.5, escala_max: 6.5 },
      series: [
        {
          id: "cambio_ptax",
          nome: "Dólar Comercial Médio (PTAX)",
          cor: "#0284c7",
          dados: [
            [2014, 2.35], [2015, 3.33], [2016, 3.48], [2017, 3.19],
            [2018, 3.65], [2019, 3.94], [2020, 5.15], [2021, 5.39],
            [2022, 5.16], [2023, 4.99], [2024, 5.35], [2025, 5.65]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2020, rotulo: "Rompe patamar de R$ 5,00 na pandemia" }
      ]
    },
    citacao_sugerida: {
      abnt: "BANCO CENTRAL DO BRASIL. Taxas de Câmbio: Dólar Americano Comercial (Série 1). Brasília: BCB, 2025. Acesso via Brasa Dados."
    }
  },

  // ==========================================
  // 2. EDUCAÇÃO & APRENDIZADO
  // ==========================================
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
      resumo: "Nota de 0 a 10 que mede a qualidade da educação no país, combinando notas de provas com taxa de aprovação.",
      como_interpretar: "Uma nota mais alta significa que mais alunos aprendem português e matemática e passam de ano sem evasão.",
      por_que_importa: "Evita distorções em que uma escola só aprova sem ensinar, ou só ensina bem porque reprova os que têm dificuldade.",
      pontos_de_atencao: "A meta histórica projetada para o Ensino Médio era de 5,2 pontos em 2021; o Brasil atingiu 4,3 em 2023."
    },
    detalhamento_tecnico: {
      formula_calculo: "IDEB = Média padronizada Saeb (0 a 10) * Indicador de rendimento (taxa de aprovação do Censo).",
      unidade_medida: "Pontos (0 a 10)",
      amostra_cobertura: "Censitário para escolas com pelo menos 10 alunos na 3ª série do EM.",
      anonimizacao_sigilo: "Escolas com menos de 10 alunos suprimidas para preservar a privacidade individual (LGPD).",
      limitacoes_e_quebras_metodologicas: "O IDEB 2021 sofreu efeito de aprovação automática durante a pandemia em várias redes estaduais.",
      orientacoes_fact_checking: "Não compare a meta do Ensino Médio com as metas dos anos iniciais do Fundamental."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano de Avaliação" },
      eixo_y: { rotulo: "Nota IDEB", unidade: "pontos", escala_min: 0, escala_max: 8 },
      series: [
        {
          id: "publica",
          nome: "Rede Pública",
          cor: "#3b82f6",
          dados: [[2015, 3.5], [2017, 3.5], [2019, 3.9], [2021, 3.9], [2023, 4.1]]
        },
        {
          id: "privada",
          nome: "Rede Privada",
          cor: "#10b981",
          dados: [[2015, 5.3], [2017, 5.8], [2019, 6.0], [2021, 5.6], [2023, 5.8]]
        },
        {
          id: "total",
          nome: "Média Total Brasil",
          cor: "#8b5cf6",
          estilo: "dashed",
          dados: [[2015, 3.7], [2017, 3.8], [2019, 4.2], [2021, 4.2], [2023, 4.3]]
        }
      ],
      marcos_historicos: [
        { ano: 2021, rotulo: "Pandemia Covid-19 (regras especiais de aprovação)" }
      ],
      dados_uf: [
        { uf: "PR", nome: "Paraná", valor: 4.9 },
        { uf: "GO", nome: "Goiás", valor: 4.8 },
        { uf: "ES", nome: "Espírito Santo", valor: 4.8 },
        { uf: "CE", nome: "Ceará", valor: 4.5 },
        { uf: "PI", nome: "Piauí", valor: 4.5 },
        { uf: "PE", nome: "Pernambuco", valor: 4.4 },
        { uf: "SP", nome: "São Paulo", valor: 4.2 },
        { uf: "MG", nome: "Minas Gerais", valor: 4.2 },
        { uf: "MS", nome: "Mato Grosso do Sul", valor: 4.2 },
        { uf: "RS", nome: "Rio Grande do Sul", valor: 4.0 },
        { uf: "SC", nome: "Santa Catarina", valor: 4.0 },
        { uf: "MT", nome: "Mato Grosso", valor: 3.9 },
        { uf: "DF", nome: "Distrito Federal", valor: 3.9 },
        { uf: "BA", nome: "Bahia", valor: 3.7 },
        { uf: "RJ", nome: "Rio de Janeiro", valor: 3.6 },
        { uf: "PA", nome: "Pará", valor: 3.6 },
        { uf: "AM", nome: "Amazonas", valor: 3.5 },
        { uf: "MA", nome: "Maranhão", valor: 3.5 },
        { uf: "AP", nome: "Amapá", valor: 3.4 },
        { uf: "RN", nome: "Rio Grande do Norte", valor: 3.2 }
      ]
    },
    citacao_sugerida: {
      abnt: "INEP. Índice de Desenvolvimento da Educação Básica (IDEB) 2023: Resultados Nacionais. Brasília: MEC/INEP, 2024. Acesso via Brasa Dados."
    }
  },
  {
    id: "educacao-taxa-analfabetismo",
    slug: "taxa-de-analfabetismo-brasil-ibge",
    titulo: "Alfabetização — Taxa de Analfabetismo (15 anos ou mais, %)",
    categoria: "educacao",
    subcategoria: "alfabetizacao",
    tags: ["educação", "analfabetismo", "leitura", "ibge", "pnad contínua"],
    fonte: {
      orgao: "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      pesquisa: "PNAD Contínua — Educação",
      url_oficial: "https://www.ibge.gov.br/estatisticas/sociais/educacao/9173-pesquisa-nacional-por-amostra-de-domicilios-continua-anual.html",
      frequencia: "Anual",
      ultima_atualizacao: "2024-03-22"
    },
    explicacao_leiga: {
      resumo: "Mede a porcentagem de brasileiros com 15 anos ou mais de idade que não sabem ler e escrever um bilhete simples.",
      como_interpretar: "Uma taxa de 5,4% indica que cerca de 9,3 milhões de jovens e adultos no Brasil ainda não são alfabetizados.",
      por_que_importa: "A alfabetização é a porta de entrada para a cidadania, emprego formal, autonomia e combate à pobreza estrutural.",
      pontos_de_atencao: "O analfabetismo está concentrado principalmente na população com 60 anos ou mais (mais de 14% nesse grupo)."
    },
    detalhamento_tecnico: {
      formula_calculo: "(Pessoas de 15 anos ou mais que não sabem ler/escrever / População total de 15 anos ou mais) * 100.",
      unidade_medida: "%",
      amostra_cobertura: "Amostra probabilística nacional da PNAD Contínua em todas as UFs.",
      anonimizacao_sigilo: "Dados domiciliares anônimos protegidos por lei.",
      limitacoes_e_quebras_metodologicas: "Em 2020 e 2021 o módulo anual de educação foi suspenso devido à pandemia da Covid-19.",
      orientacoes_fact_checking: "Não confunda a 'Taxa de Analfabetismo estrita' com 'Analfabetismo Funcional' (que afere capacidade de interpretar textos complexos)."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Analfabetismo (%)", unidade: "%", escala_min: 3, escala_max: 9 },
      series: [
        {
          id: "analfabetismo_total",
          nome: "Taxa de Analfabetismo (15+ anos)",
          cor: "#4f46e5",
          dados: [
            [2016, 7.2], [2017, 6.9], [2018, 6.8], [2019, 6.6],
            [2022, 5.6], [2023, 5.4], [2024, 5.2], [2025, 5.0]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2023, rotulo: "Queda para 5,4% (9,3 milhões de pessoas)" }
      ]
    },
    citacao_sugerida: {
      abnt: "IBGE. PNAD Contínua: Educação 2023. Rio de Janeiro: IBGE, 2024. Acesso via Brasa Dados."
    }
  },
  {
    id: "educacao-abandono-ensino-medio",
    slug: "taxa-abandono-ensino-medio-inep",
    titulo: "Evasão Escolar — Taxa de Abandono no Ensino Médio (%)",
    categoria: "educacao",
    subcategoria: "fluxo-escolar",
    tags: ["educação", "evasão", "abandono", "ensino médio", "inep", "censo escolar"],
    fonte: {
      orgao: "INEP / Ministério da Educação",
      pesquisa: "Censo da Educação Básica — Indicadores de Rendimento Escolar",
      url_oficial: "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/taxas-de-rendimento-escolar",
      frequencia: "Anual",
      ultima_atualizacao: "2024-05-18"
    },
    explicacao_leiga: {
      resumo: "Mede o percentual de estudantes do Ensino Médio da rede pública que deixaram de frequentar a escola durante o ano letivo.",
      como_interpretar: "Uma taxa de 5,9% significa que quase 6 de cada 100 jovens do ensino médio abandonaram os estudos antes de concluir o ano.",
      por_que_importa: "O abandono no ensino médio é o momento mais crítico da evasão juvenil, quando muitos saem para trabalhar na informalidade.",
      pontos_de_atencao: "Em 2024 o governo implementou o programa nacional 'Pé-de-Meia' (poupança escolar) visando frear exatamente esse indicador."
    },
    detalhamento_tecnico: {
      formula_calculo: "Taxa de Abandono = (Alunos evadidos no ano letivo / Total de alunos matriculados) * 100.",
      unidade_medida: "%",
      amostra_cobertura: "Censo Escolar de todas as escolas públicas estaduais e federais do Brasil.",
      anonimizacao_sigilo: "Dados cadastrais de alunos totalmente anonimizados.",
      limitacoes_e_quebras_metodologicas: "Em 2020 a taxa caiu artificialmente para 2,3% por conta de normas emergenciais do Conselho Nacional de Educação.",
      orientacoes_fact_checking: "Diferencie 'Abandono' (saiu durante o ano letivo) de 'Evasão' (não se matriculou no ano seguinte)."
    },
    visualizacao: {
      tipo_padrao: "bar",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Taxa de Abandono (%)", unidade: "%", escala_min: 0, escala_max: 12 },
      series: [
        {
          id: "abandono_em",
          nome: "Taxa de Abandono (Rede Pública)",
          cor: "#e11d48",
          dados: [
            [2015, 9.3], [2017, 7.9], [2019, 5.9], [2020, 2.3],
            [2021, 5.6], [2022, 6.5], [2023, 5.9], [2024, 5.1], [2025, 4.6]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2020, rotulo: "Distorção pandêmica (regime especial de vínculo escolar)" },
        { ano: 2024, rotulo: "Início do Programa Pé-de-Meia" }
      ]
    },
    citacao_sugerida: {
      abnt: "INEP. Taxas de Rendimento Escolar do Censo da Educação Básica 2023. Brasília: MEC/INEP, 2024. Acesso via Brasa Dados."
    }
  },

  // ==========================================
  // 3. SAÚDE & VIGILÂNCIA
  // ==========================================
  {
    id: "saude-vacinacao-polio",
    slug: "cobertura-vacinal-poliomielite-datasus",
    titulo: "Imunização — Cobertura Vacinal contra Poliomielite (%)",
    categoria: "saude",
    subcategoria: "imunizacao",
    tags: ["saúde", "vacinação", "poliomielite", "datasus", "pni", "sus", "crianças"],
    fonte: {
      orgao: "Ministério da Saúde / DataSUS",
      pesquisa: "Programa Nacional de Imunizações (SI-PNI / Rede Nacional de Dados em Saúde - RNDS)",
      url_oficial: "https://infoms.saude.gov.br/extensions/SEIDIGI_PNI_COBERTURA_ESTADOS/SEIDIGI_PNI_COBERTURA_ESTADOS.html",
      frequencia: "Anual / Mensal",
      ultima_atualizacao: "2025-01-20"
    },
    explicacao_leiga: {
      resumo: "Mede o percentual de bebês de até 1 ano que receberam as 3 doses obrigatórias da vacina contra a paralisia infantil.",
      como_interpretar: "A meta segura recomendada pelo Ministério da Saúde e OMS é de 95%. Valores abaixo de 80% criam sério risco de reintrodução do vírus.",
      por_que_importa: "O Brasil foi declarado livre da poliomielite em 1994. A queda na vacinação entre 2016 e 2021 acendeu alerta máximo na saúde pública.",
      pontos_de_atencao: "Em 2021 atingiu a mínima perigosa de 71,1%, iniciando trajetória de recuperação a partir de 2023 (84,6%) e 2024 (87,5%)."
    },
    detalhamento_tecnico: {
      formula_calculo: "(Doses aplicadas da 3ª dose de Poliomielite em menores de 1 ano / População estimada de menores de 1 ano pelo IBGE/Sinasc) * 100.",
      unidade_medida: "% de cobertura",
      amostra_cobertura: "Todas as salas de vacina da rede municipal e estadual do SUS e clínicas privadas credenciadas.",
      anonimizacao_sigilo: "Dados consolidados por município e UF através do sistema SI-PNI/RNDS.",
      limitacoes_e_quebras_metodologicas: "Migração do sistema SI-PNI clássico para o módulo RNDS gerou instabilidade e atrasos de digitação em 2020 e 2021.",
      orientacoes_fact_checking: "Em alguns municípios a taxa calculada pode ultrapassar 100% por imprecisão de projeção demográfica ou atendimento a não-residentes."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Cobertura Vacinal (%)", unidade: "%", escala_min: 50, escala_max: 105 },
      series: [
        {
          id: "cobertura_polio",
          nome: "Cobertura Poliomielite (Meta: 95%)",
          cor: "#06b6d4",
          dados: [
            [2015, 98.3], [2016, 84.4], [2017, 84.7], [2018, 89.5],
            [2019, 84.2], [2020, 76.2], [2021, 71.1], [2022, 77.2],
            [2023, 84.6], [2024, 87.5], [2025, 89.2]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2015, rotulo: "Último ano acima da meta de 95% (98,3%)" },
        { ano: 2021, rotulo: "Ponto mais baixo da série histórica (71,1%)" },
        { ano: 2024, rotulo: "Recuperação para 87,5%" }
      ]
    },
    citacao_sugerida: {
      abnt: "MINISTÉRIO DA SAÚDE. Programa Nacional de Imunizações (PNI): Cobertura Vacinal contra Poliomielite. Brasília: DataSUS, 2025. Acesso via Brasa Dados."
    }
  },
  {
    id: "saude-mortalidade-infantil",
    slug: "taxa-de-mortalidade-infantil-datasus",
    titulo: "Vigilância em Saúde — Mortalidade Infantil (por 1.000 nascidos vivos)",
    categoria: "saude",
    subcategoria: "mortalidade",
    tags: ["saúde", "mortalidade", "infância", "nascimentos", "datasus", "sinasc", "sim"],
    fonte: {
      orgao: "Ministério da Saúde / DataSUS / IBGE",
      pesquisa: "Sistema de Informações sobre Mortalidade (SIM) e Nascidos Vivos (SINASC)",
      url_oficial: "https://datasus.saude.gov.br/mortalidade-desde-1996-pela-cid-10",
      frequencia: "Anual",
      ultima_atualizacao: "2024-11-30"
    },
    explicacao_leiga: {
      resumo: "Mede quantas crianças morrem antes de completar 1 ano de vida para cada grupo de 1.000 bebês nascidos vivos.",
      como_interpretar: "Uma taxa de 11,9 significa que quase 12 em cada 1.000 bebês não sobreviveram ao primeiro ano.",
      por_que_importa: "É considerado mundialmente o melhor indicador geral da qualidade do pré-natal, saneamento básico e atendimento médico de um país.",
      pontos_de_atencao: "O Brasil reduziu drasticamente esse indicador desde 1990 (quando era de quase 50 por mil), atingindo menos de 12 por mil atualmente."
    },
    detalhamento_tecnico: {
      formula_calculo: "(Óbitos de menores de 1 ano residentes / Nascidos vivos de mães residentes) * 1.000.",
      unidade_medida: "Óbitos por 1.000 nascidos vivos",
      amostra_cobertura: "Universo das declarações de óbito (DO) e de nascido vivo (DN) registradas no SIM e SINASC.",
      anonimizacao_sigilo: "Dados epidemiológicos consolidados sem quebra de sigilo dos prontuários de saúde.",
      limitacoes_e_quebras_metodologicas: "Ainda há subnotificação residual de nascimentos e óbitos em comunidades isoladas e aldeias indígenas no Norte.",
      orientacoes_fact_checking: "Diferencie 'Mortalidade Infantil' (menores de 1 ano) de 'Mortalidade na Infância' (menores de 5 anos)."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Taxa por mil", unidade: "por mil", escala_min: 8, escala_max: 18 },
      series: [
        {
          id: "mortalidade_infantil",
          nome: "Taxa de Mortalidade Infantil",
          cor: "#ec4899",
          dados: [
            [2012, 14.4], [2014, 13.8], [2016, 14.0], [2018, 13.4],
            [2019, 13.3], [2020, 12.8], [2021, 13.0], [2022, 12.6],
            [2023, 12.2], [2024, 11.9], [2025, 11.6]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2024, rotulo: "Menor taxa da história brasileira (11,9 por mil)" }
      ]
    },
    citacao_sugerida: {
      abnt: "MINISTÉRIO DA SAÚDE. Estatísticas Vitais: Mortalidade Infantil no Brasil (SIM/SINASC). Brasília: DataSUS, 2024. Acesso via Brasa Dados."
    }
  },
  {
    id: "saude-expectativa-vida",
    slug: "expectativa-de-vida-ao-nascer-ibge",
    titulo: "Demografia — Expectativa de Vida ao Nascer (Anos)",
    categoria: "saude",
    subcategoria: "demografia",
    tags: ["saúde", "longevidade", "expectativa de vida", "ibge", "tábua de mortalidade"],
    fonte: {
      orgao: "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      pesquisa: "Tábua Completa de Mortalidade do Brasil",
      url_oficial: "https://www.ibge.gov.br/estatisticas/sociais/populacao/9126-tabuas-completas-de-mortalidade.html",
      frequencia: "Anual (publicada em 1º de dezembro)",
      ultima_atualizacao: "2024-12-01"
    },
    explicacao_leiga: {
      resumo: "Estima quantos anos, em média, uma pessoa nascida naquele ano deve viver se as condições de saúde e mortalidade continuarem as mesmas.",
      como_interpretar: "Uma expectativa de 76,8 anos indica a longevidade média projetada para a população brasileira geral.",
      por_que_importa: "Influencia diretamente as políticas de previdência social, planejamento urbano, cuidados geriátricos e qualidade de vida.",
      pontos_de_atencao: "Em 2020 e 2021, o excesso de mortes por Covid-19 fez a expectativa cair de 76,6 para 72,8 anos, recuperando-se totalmente a partir de 2023."
    },
    detalhamento_tecnico: {
      formula_calculo: "Esperança de vida no instante do nascimento (e_0) derivada da função de sobrevivência da Tábua Atuarial de Mortalidade.",
      unidade_medida: "Anos de vida",
      amostra_cobertura: "População residente do Brasil projetada pelo IBGE e ajustada pelos registros de óbitos.",
      anonimizacao_sigilo: "Cálculo atuarial consolidado em nível nacional e estadual.",
      limitacoes_e_quebras_metodologicas: "Em anos censitários (2010 e 2022) as tábuas são recalibradas com base nos dados populacionais definitivos.",
      orientacoes_fact_checking: "A expectativa das mulheres brasileiras é historicamente de 7 a 8 anos maior do que a dos homens (devido à menor violência letal e maior cuidado médico)."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Expectativa (Anos)", unidade: "anos", escala_min: 70, escala_max: 80 },
      series: [
        {
          id: "expectativa_vida",
          nome: "Expectativa de Vida ao Nascer",
          cor: "#14b8a6",
          dados: [
            [2010, 73.9], [2012, 74.6], [2014, 75.2], [2016, 75.8],
            [2018, 76.3], [2019, 76.6], [2020, 74.8], [2021, 72.8],
            [2022, 75.5], [2023, 76.4], [2024, 76.8], [2025, 77.1]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2021, rotulo: "Queda acentuada na pandemia (-3,8 anos)" },
        { ano: 2024, rotulo: "Superação do patamar pré-pandemia (76,8 anos)" }
      ]
    },
    citacao_sugerida: {
      abnt: "IBGE. Tábuas Completas de Mortalidade para o Brasil 2023. Rio de Janeiro: IBGE, 2024. Acesso via Brasa Dados."
    }
  },

  // ==========================================
  // 4. SEGURANÇA PÚBLICA
  // ==========================================
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
      resumo: "Mede quantas mortes violentas ocorreram no Brasil para cada grupo de 100 mil habitantes.",
      como_interpretar: "Soma homicídios, latrocínios, lesões corporais seguidas de morte e mortes decorrentes de intervenção policial.",
      por_que_importa: "É a métrica mais confiável de criminalidade violenta no país, harmonizando as diferenças entre polícias dos estados.",
      pontos_de_atencao: "O pico da série ocorreu em 2017 com 30,8 por 100 mil (63.880 mortes no ano), apresentando queda contínua desde então."
    },
    detalhamento_tecnico: {
      formula_calculo: "Taxa MVI = (Soma de Homicídios + Latrocínios + Lesões Mortais + Mortes Policiais / População IBGE) * 100.000.",
      unidade_medida: "Por 100 mil hab.",
      amostra_cobertura: "Boletins de ocorrência das 27 Secretarias de Segurança Pública Estaduais.",
      anonimizacao_sigilo: "Dados consolidados com anonimização individual.",
      limitacoes_e_quebras_metodologicas: "Subnotificação de mortes a esclarecer em certos estados e diferenças de classificação antes de 2015.",
      orientacoes_fact_checking: "A MVI inclui mortes por agentes policiais, diferindo da taxa isolada de 'Homicídio Doloso'."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Taxa por 100 mil hab.", unidade: "por 100 mil", escala_min: 15, escala_max: 35 },
      series: [
        {
          id: "taxa_mvi",
          nome: "Taxa MVI Brasil",
          cor: "#dc2626",
          dados: [
            [2015, 28.9], [2016, 29.7], [2017, 30.8], [2018, 27.5],
            [2019, 22.7], [2020, 23.6], [2021, 22.3], [2022, 23.4],
            [2023, 22.8], [2024, 21.9]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2017, rotulo: "Pico de 30,8 por 100 mil (63.880 mortos)" },
        { ano: 2024, rotulo: "Menor patamar da série (21,9 por 100 mil)" }
      ],
      dados_uf: [
        { uf: "AP", nome: "Amapá", valor: 45.2 },
        { uf: "BA", nome: "Bahia", valor: 45.1 },
        { uf: "AM", nome: "Amazonas", valor: 40.2 },
        { uf: "AL", nome: "Alagoas", valor: 38.3 },
        { uf: "PE", nome: "Pernambuco", valor: 37.8 },
        { uf: "PA", nome: "Pará", valor: 34.8 },
        { uf: "CE", nome: "Ceará", valor: 34.5 },
        { uf: "SE", nome: "Sergipe", valor: 32.0 },
        { uf: "RR", nome: "Roraima", valor: 30.9 },
        { uf: "RN", nome: "Rio Grande do Norte", valor: 30.6 },
        { uf: "RO", nome: "Rondônia", valor: 29.1 },
        { uf: "TO", nome: "Tocantins", valor: 25.2 },
        { uf: "ES", nome: "Espírito Santo", valor: 24.8 },
        { uf: "AC", nome: "Acre", valor: 23.5 },
        { uf: "MT", nome: "Mato Grosso", valor: 22.6 },
        { uf: "RJ", nome: "Rio de Janeiro", valor: 20.9 },
        { uf: "MA", nome: "Maranhão", valor: 20.6 },
        { uf: "PB", nome: "Paraíba", valor: 19.5 },
        { uf: "PI", nome: "Piauí", valor: 19.2 },
        { uf: "GO", nome: "Goiás", valor: 18.7 },
        { uf: "PR", nome: "Paraná", valor: 17.8 },
        { uf: "MS", nome: "Mato Grosso do Sul", valor: 17.5 },
        { uf: "RS", nome: "Rio Grande do Sul", valor: 14.8 },
        { uf: "MG", nome: "Minas Gerais", valor: 12.8 },
        { uf: "DF", nome: "Distrito Federal", valor: 11.1 },
        { uf: "SC", nome: "Santa Catarina", valor: 8.6 },
        { uf: "SP", nome: "São Paulo", valor: 7.8 }
      ]
    },
    citacao_sugerida: {
      abnt: "FÓRUM BRASILEIRO DE SEGURANÇA PÚBLICA. 18º Anuário Brasileiro de Segurança Pública. São Paulo: FBSP, 2024. Acesso via Brasa Dados."
    }
  },
  {
    id: "seguranca-sistema-prisional",
    slug: "populacao-carceraria-vs-vagas-sisdepen",
    titulo: "Sistema Prisional — Presos vs. Vagas Oficiais (em milhares)",
    categoria: "seguranca",
    subcategoria: "sistema-penitenciario",
    tags: ["segurança", "presídios", "presos", "vagas", "sisdepen", "senappen", "justiça"],
    fonte: {
      orgao: "SENAPPEN / Ministério da Justiça e Segurança Pública",
      pesquisa: "Sistema de Informações Penitenciárias (SISDEPEN)",
      url_oficial: "https://www.gov.br/senappen/pt-br/assuntos/sisdepen",
      frequencia: "Semestral / Anual",
      ultima_atualizacao: "2024-10-15"
    },
    explicacao_leiga: {
      resumo: "Compara o número total de pessoas privadas de liberdade no Brasil com a capacidade oficial de vagas nos presídios.",
      como_interpretar: "A diferença entre as duas linhas representa a superlotação do sistema penitenciário (déficit de vagas).",
      por_que_importa: "A superlotação prisional facilita o controle de estabelecimentos penais por facções criminosas e viola direitos fundamentais.",
      pontos_de_atencao: "Em 2024 o Brasil contava com cerca de 864 mil presos para 525 mil vagas, gerando um déficit de mais de 330 mil vagas."
    },
    detalhamento_tecnico: {
      formula_calculo: "Soma censitária dos presos em celas físicas e prisão domiciliar monitorada por tornozeleira contra a capacidade de engenharia prisional.",
      unidade_medida: "Milhares de pessoas",
      amostra_cobertura: "Todas as unidades prisionais estaduais e penitenciárias federais.",
      anonimizacao_sigilo: "Dados públicos quantitativos sem quebra de sigilo de identidade dos custodiados.",
      limitacoes_e_quebras_metodologicas: "A inclusão de pessoas em prisão domiciliar monitorada por tornozeleira passou a ser uniformizada no Sisdepen a partir de 2019.",
      orientacoes_fact_checking: "Cerca de 40% da população prisional do país é formada por presos provisórios (sem julgamento condenatório definitivo)."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Pessoas (Milhares)", unidade: "mil pessoas", escala_min: 300, escala_max: 950 },
      series: [
        {
          id: "presos_total",
          nome: "População Prisional Total",
          cor: "#991b1b",
          dados: [
            [2015, 622.2], [2017, 726.7], [2019, 755.3], [2021, 820.7],
            [2022, 832.3], [2023, 852.0], [2024, 864.5]
          ]
        },
        {
          id: "vagas_total",
          nome: "Capacidade / Vagas Oficiais",
          cor: "#15803d",
          estilo: "dashed",
          dados: [
            [2015, 371.9], [2017, 423.2], [2019, 442.3], [2021, 478.4],
            [2022, 495.1], [2023, 512.4], [2024, 525.0]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2024, rotulo: "Déficit de quase 340 mil vagas" }
      ]
    },
    citacao_sugerida: {
      abnt: "SENAPPEN. Levantamento Nacional de Informações Penitenciárias (SISDEPEN). Brasília: MJSP, 2024. Acesso via Brasa Dados."
    }
  },
  {
    id: "seguranca-feminicidios",
    slug: "vitimas-de-feminicidio-brasil",
    titulo: "Violência Contra a Mulher — Vítimas de Feminicídio (Casos Registrados)",
    categoria: "seguranca",
    subcategoria: "violencia-de-genero",
    tags: ["segurança", "feminicídio", "mulher", "fbsp", "violência doméstica"],
    fonte: {
      orgao: "Fórum Brasileiro de Segurança Pública (FBSP)",
      pesquisa: "Anuário Brasileiro de Segurança Pública & Monitor da Violência",
      url_oficial: "https://forumseguranca.org.br",
      frequencia: "Anual",
      ultima_atualizacao: "2024-07-20"
    },
    explicacao_leiga: {
      resumo: "Mede o total de assassinatos de mulheres cometidos em razão do gênero feminino ou por violência doméstica/familiar.",
      como_interpretar: "Diferente de homicídios gerais, o feminicídio ocorre majoritariamente dentro de casa e é praticado por parceiros ou ex-parceiros.",
      por_que_importa: "Indica a gravidade da violência doméstica e a eficácia de medidas protetivas e da rede de acolhimento.",
      pontos_de_atencao: "Em 2023 foi registrado o recorde de 1.467 vítimas no país desde a entrada em vigor da Lei do Feminicídio (Lei 13.104/2015)."
    },
    detalhamento_tecnico: {
      formula_calculo: "Soma das mortes de mulheres tipificadas como feminicídio pelas Polícias Civis dos 26 estados e DF.",
      unidade_medida: "Vítimas registradas",
      amostra_cobertura: "Todos os registros policiais consolidados pelo Fórum de Segurança.",
      anonimizacao_sigilo: "Dados consolidados com sigilo absoluto da identidade das vítimas e familiares.",
      limitacoes_e_quebras_metodologicas: "A tipificação policial demorou alguns anos para ser adotada de forma uniforme por todas as delegacias após 2015.",
      orientacoes_fact_checking: "Nem todo assassinato de mulher é feminicídio: deve haver violência doméstica ou discriminação à condição de mulher."
    },
    visualizacao: {
      tipo_padrao: "bar",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Vítimas no Ano", unidade: "casos", escala_min: 800, escala_max: 1600 },
      series: [
        {
          id: "feminicidios",
          nome: "Casos de Feminicídio Registrados",
          cor: "#be185d",
          dados: [
            [2017, 1046], [2018, 1206], [2019, 1314], [2020, 1330],
            [2021, 1341], [2022, 1437], [2023, 1467], [2024, 1410], [2025, 1380]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2023, rotulo: "Pico histórico de 1.467 casos (4 mulheres por dia)" }
      ]
    },
    citacao_sugerida: {
      abnt: "FÓRUM BRASILEIRO DE SEGURANÇA PÚBLICA. Feminicídios no Brasil 2024. São Paulo: FBSP, 2024. Acesso via Brasa Dados."
    }
  },

  // ==========================================
  // 5. MEIO AMBIENTE & CLIMA
  // ==========================================
  {
    id: "meio-ambiente-desmatamento-amazonia",
    slug: "taxa-anual-desmatamento-amazonia-prodes-inpe",
    titulo: "Amazônia Legal — Taxa Anual de Desmatamento (km²/ano)",
    categoria: "meio-ambiente",
    subcategoria: "cobertura-vegetal",
    tags: ["meio ambiente", "amazônia", "desmatamento", "inpe", "prodes", "floresta", "clima"],
    fonte: {
      orgao: "Instituto Nacional de Pesquisas Espaciais (INPE)",
      pesquisa: "Programa de Monitoramento da Floresta Amazônica Brasileira por Satélite (PRODES)",
      url_oficial: "http://terrabrasilis.dpi.inpe.br/app/dashboard/deforestation/biomes/legal_amazon/rates",
      frequencia: "Anual (ano PRODES de agosto a julho)",
      ultima_atualizacao: "2024-11-06"
    },
    explicacao_leiga: {
      resumo: "Mede por satélite a área total de floresta primária que sofreu corte raso na Amazônia Legal durante o ano.",
      como_interpretar: "Uma taxa de 6.288 km² equivale a derrubar anualmente uma área equivalente a quatro vezes a cidade de São Paulo.",
      por_que_importa: "O desmatamento é a principal fonte brasileira de emissão de gases de efeito estufa e afeta o regime de chuvas em todo o país.",
      pontos_de_atencao: "Após atingir o pico de 13.038 km² em 2021, o desmatamento despencou mais de 50%, atingindo 6.288 km² no ciclo de 2024."
    },
    detalhamento_tecnico: {
      formula_calculo: "Mapeamento exaustivo por imagens orbitais (Landsat, Sentinel-2 e CBERS) de polígonos de perda florestal maiores que 6,25 hectares.",
      unidade_medida: "km² por ano",
      amostra_cobertura: "Universo dos 5 milhões de km² da Amazônia Legal brasileira nos 9 estados.",
      anonimizacao_sigilo: "Dados espaciais públicos abertos na plataforma TerraBrasilis.",
      limitacoes_e_quebras_metodologicas: "O ano PRODES conta de 1º de agosto do ano anterior a 31 de julho do ano de referência.",
      orientacoes_fact_checking: "Não confunda o 'PRODES' (dado oficial consolidado anual) com os alertas mensais do 'DETER' (que servem para fiscalização em tempo real)."
    },
    visualizacao: {
      tipo_padrao: "bar",
      eixo_x: { tipo: "temporal", rotulo: "Ano PRODES" },
      eixo_y: { rotulo: "Área Desmatada (km²)", unidade: "km²", escala_min: 0, escala_max: 15000 },
      series: [
        {
          id: "desmatamento_prodes",
          nome: "Área Desmatada Anual (km²)",
          cor: "#15803d",
          dados: [
            [2012, 4571], [2014, 5012], [2016, 7893], [2018, 7536],
            [2019, 10129], [2020, 10851], [2021, 13038], [2022, 11594],
            [2023, 9001], [2024, 6288], [2025, 5800]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2012, rotulo: "Mínima histórica (4.571 km²)" },
        { ano: 2021, rotulo: "Pico de 13.038 km²" },
        { ano: 2024, rotulo: "Queda acentuada de 30% em 2024 (6.288 km²)" }
      ]
    },
    citacao_sugerida: {
      abnt: "INPE. Monitoramento da Cobertura Florestal da Amazônia por Satélites (PRODES 2024). São José dos Campos: INPE/MCTI, 2024. Acesso via Brasa Dados."
    }
  },
  {
    id: "meio-ambiente-queimadas-focos",
    slug: "focos-de-queimadas-anuais-brasil-inpe",
    titulo: "Focos de Calor — Queimadas Anuais no Brasil (Milhares de Focos)",
    categoria: "meio-ambiente",
    subcategoria: "queimadas-e-incendios",
    tags: ["meio ambiente", "queimadas", "fogo", "inpe", "cerrado", "pantanal", "amazônia"],
    fonte: {
      orgao: "Instituto Nacional de Pesquisas Espaciais (INPE)",
      pesquisa: "Programa Queimadas — Satélite de Referência (Aqua Tarde)",
      url_oficial: "https://terrabrasilis.dpi.inpe.br/queimadas/portal/",
      frequencia: "Diária / Anual",
      ultima_atualizacao: "2025-01-10"
    },
    explicacao_leiga: {
      resumo: "Registra a quantidade de pontos de calor (focos de incêndio e queimadas florestais) captados pelos satélites de monitoramento em todo o território nacional.",
      como_interpretar: "Mais focos de calor indicam secas mais severas combinadas com ações humanas de uso do fogo para limpeza de pastagens e degradação florestal.",
      por_que_importa: "A fumaça afeta a saúde respiratória de milhões de pessoas nas cidades, agrava as mudanças climáticas e ameaça a biodiversidade.",
      pontos_de_atencao: "Em 2024, o Brasil enfrentou a pior seca em 70 anos, fazendo os focos saltarem para 275 mil, com graves incêndios no Pantanal, Amazônia e Cerrado."
    },
    detalhamento_tecnico: {
      formula_calculo: "Detecção de anomalias térmicas em superfície a partir do sensor MODIS a bordo do satélite de referência Aqua (passagem da tarde).",
      unidade_medida: "Milhares de focos ativos",
      amostra_cobertura: "Todos os 8,5 milhões de km² do território brasileiro e biomas associados.",
      anonimizacao_sigilo: "Dados geoespaciais abertos ao público em tempo real.",
      limitacoes_e_quebras_metodologicas: "Cobertura de nuvens densas pode impedir momentaneamente a detecção do foco pelo sensor óptico.",
      orientacoes_fact_checking: "Sempre use os dados do 'satélite de referência' para comparações temporais homogêneas entre anos diferentes."
    },
    visualizacao: {
      tipo_padrao: "bar",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Focos de Calor (Milhares)", unidade: "mil focos", escala_min: 100, escala_max: 320 },
      series: [
        {
          id: "focos_queimadas",
          nome: "Focos de Calor Detectados no Brasil",
          cor: "#ea580c",
          dados: [
            [2015, 236.1], [2016, 188.0], [2017, 260.0], [2018, 132.8],
            [2019, 197.6], [2020, 222.8], [2021, 184.1], [2022, 212.0],
            [2023, 189.9], [2024, 275.4], [2025, 195.0]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2018, rotulo: "Ano com menor registro recente (132,8 mil)" },
        { ano: 2024, rotulo: "Seca histórica e fumaça em múltiplos estados (275,4 mil)" }
      ]
    },
    citacao_sugerida: {
      abnt: "INPE. Programa Queimadas: Monitoramento por Satélite do Brasil 2024. São José dos Campos: INPE, 2025. Acesso via Brasa Dados."
    }
  },

  // ==========================================
  // 6. PANORAMA INTERNACIONAL & COMÉRCIO
  // ==========================================
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
      resumo: "Exame internacional que avalia a proficiência de estudantes de 15 anos em aplicar raciocínio matemático em desafios cotidianos.",
      como_interpretar: "A média dos países desenvolvidos da OCDE gira entre 470 e 500 pontos. O Brasil situa-se historicamente abaixo de 400 pontos.",
      por_que_importa: "Mostra como a formação técnica e científica dos jovens brasileiros se posiciona perante a concorrência global.",
      pontos_de_atencao: "No PISA 2022, mais de 70% dos alunos brasileiros de 15 anos não alcançaram o nível mínimo de proficiência básica."
    },
    detalhamento_tecnico: {
      formula_calculo: "Escala calibrada pela Teoria de Resposta ao Item (TRI) com média OCDE histórica de 500 pontos.",
      unidade_medida: "Pontuação TRI",
      amostra_cobertura: "Amostra probabilística de estudantes de 15 anos matriculados a partir do 7º ano do Fundamental.",
      anonimizacao_sigilo: "Dados abertos anonimizados divulgados pela OCDE.",
      limitacoes_e_quebras_metodologicas: "A aplicação prevista para 2021 ocorreu em 2022 devido ao fechamento global das escolas.",
      orientacoes_fact_checking: "O PISA afere jovens de 15 anos em geral, independentemente de estarem com atraso escolar."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano do Exame" },
      eixo_y: { rotulo: "Pontuação Média", unidade: "pontos", escala_min: 300, escala_max: 550 },
      series: [
        {
          id: "brasil",
          nome: "Brasil",
          cor: "#16a34a",
          dados: [
            [2003, 356], [2006, 370], [2009, 386], [2012, 391],
            [2015, 377], [2018, 384], [2022, 379]
          ]
        },
        {
          id: "ocde",
          nome: "Média Países da OCDE",
          cor: "#2563eb",
          estilo: "dashed",
          dados: [
            [2003, 500], [2006, 498], [2009, 496], [2012, 494],
            [2015, 490], [2018, 489], [2022, 472]
          ]
        },
        {
          id: "chile",
          nome: "Chile (Referência América Latina)",
          cor: "#ea580c",
          dados: [
            [2003, 387], [2006, 411], [2009, 421], [2012, 423],
            [2015, 423], [2018, 417], [2022, 412]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2022, rotulo: "Queda generalizada na pandemia (OCDE caiu 17 pontos)" }
      ]
    },
    citacao_sugerida: {
      abnt: "OECD. PISA 2022 Results: The State of Learning and Equity in Education. Paris: OECD Publishing, 2023. Acesso via Brasa Dados."
    }
  },
  {
    id: "internacional-balanca-comercial",
    slug: "saldo-balanca-comercial-brasil-comexstat",
    titulo: "Comércio Exterior — Saldo da Balança Comercial (US$ Bilhões)",
    categoria: "internacional",
    subcategoria: "comercio-exterior",
    tags: ["internacional", "exportação", "importação", "comércio", "balança comercial", "mdic"],
    fonte: {
      orgao: "Ministério do Desenvolvimento, Indústria, Comércio e Serviços (MDIC)",
      pesquisa: "Comex Stat — Estatísticas de Comércio Exterior do Brasil",
      url_oficial: "https://comexstat.mdic.gov.br",
      frequencia: "Mensal / Anual",
      ultima_atualizacao: "2026-02-10"
    },
    explicacao_leiga: {
      resumo: "Mede a diferença entre tudo o que o Brasil exportou (vendeu para o exterior) e tudo o que importou (comprou de fora).",
      como_interpretar: "Valores positivos representam superávit comercial (entrou mais dólares no país do que saiu). Valores negativos representam déficit.",
      por_que_importa: "Um superávit robusto fortalece as reservas internacionais do Banco Central e dá sustentação à moeda brasileira.",
      pontos_de_atencao: "Em 2023 o país bateu recorde histórico absoluto com superávit de US$ 98,8 bilhões, impulsionado por safras recordes de soja, milho, minério e petróleo."
    },
    detalhamento_tecnico: {
      formula_calculo: "Saldo = Exportações Totais FOB (Free on Board) - Importações Totais FOB em Dólares dos EUA.",
      unidade_medida: "US$ Bilhões",
      amostra_cobertura: "Universo das declarações aduaneiras de exportação (DU-E) e importação (DU-IMP) registradas na Receita Federal.",
      anonimizacao_sigilo: "Dados agregados por produto, estado e país parceiro sem identificação individual de empresas.",
      limitacoes_e_quebras_metodologicas: "Adoção do Portal Único do Comércio Exterior modernizou a captação aduaneira.",
      orientacoes_fact_checking: "A balança comercial mede mercadorias físicas; a conta corrente (balanço de pagamentos) inclui serviços e remessas de juros."
    },
    visualizacao: {
      tipo_padrao: "bar",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Superávit (US$ Bilhões)", unidade: "US$ bi", escala_min: -10, escala_max: 110 },
      series: [
        {
          id: "saldo_balanca",
          nome: "Superávit Comercial Anual (US$ Bi)",
          cor: "#10b981",
          dados: [
            [2014, -4.0], [2015, 19.7], [2016, 47.7], [2017, 67.0],
            [2018, 58.0], [2019, 48.0], [2020, 50.4], [2021, 61.4],
            [2022, 61.5], [2023, 98.8], [2024, 74.2], [2025, 78.0]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2014, rotulo: "Último déficit comercial anual (-US$ 4 bi)" },
        { ano: 2023, rotulo: "Recorde histórico brasileiro (+US$ 98,8 bi)" }
      ]
    },
    citacao_sugerida: {
      abnt: "MDIC. Comex Stat: Balança Comercial Brasileira Consolidada 2024. Brasília: SECEX/MDIC, 2025. Acesso via Brasa Dados."
    }
  },
  {
    id: "internacional-percepcao-corrupcao",
    slug: "indice-percepcao-da-corrupcao-transparencia-internacional",
    titulo: "Governança — Índice de Percepção da Corrupção (Pontos de 0 a 100)",
    categoria: "internacional",
    subcategoria: "governanca-e-instituicoes",
    tags: ["internacional", "corrupção", "transparência internacional", "governança", "instituições"],
    fonte: {
      orgao: "Transparência Internacional",
      pesquisa: "Corruption Perceptions Index (CPI)",
      url_oficial: "https://www.transparency.org/en/cpi",
      frequencia: "Anual",
      ultima_atualizacao: "2025-01-30"
    },
    explicacao_leiga: {
      resumo: "Avalia a percepção de especialistas e empresários internacionais sobre a corrupção no setor público de 180 países.",
      como_interpretar: "A escala vai de 0 (altamente corrupto) a 100 (muito transparente e íntegro). Países nórdicos lideram com pontuações acima de 85.",
      por_que_importa: "Afeta a atração de investimentos estrangeiros e sinaliza a solidez das instituições democráticas e de controle.",
      pontos_de_atencao: "O Brasil oscila historicamente entre 35 e 43 pontos, ficando abaixo da média global (43 pontos) e próximo à 104ª posição no ranking mundial."
    },
    detalhamento_tecnico: {
      formula_calculo: "Padronização e média ponderada de 13 fontes de dados independentes de governança e clima de negócios (Banco Mundial, Fórum Econômico Mundial, etc.).",
      unidade_medida: "Pontuação (0 a 100)",
      amostra_cobertura: "180 países e territórios avaliados internacionalmente.",
      anonimizacao_sigilo: "Metodologia pública auditada pela Transparência Internacional.",
      limitacoes_e_quebras_metodologicas: "Por medir percepção de especialistas e empresários, não afere processos judiciais individuais.",
      orientacoes_fact_checking: "Mudanças de 1 ou 2 pontos de um ano para o outro geralmente não são estatisticamente significativas."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Pontuação CPI", unidade: "pontos", escala_min: 20, escala_max: 60 },
      series: [
        {
          id: "cpi_brasil",
          nome: "Pontuação do Brasil no CPI",
          cor: "#7c3aed",
          dados: [
            [2014, 43], [2015, 38], [2016, 40], [2017, 37],
            [2018, 35], [2019, 35], [2020, 38], [2021, 38],
            [2022, 38], [2023, 36], [2024, 35], [2025, 36]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2014, rotulo: "43 pontos (melhor nota da década recente)" },
        { ano: 2024, rotulo: "35 pontos (107ª posição entre 180 nações)" }
      ]
    },
    citacao_sugerida: {
      abnt: "TRANSPARÊNCIA INTERNACIONAL. Índice de Percepção da Corrupção (IPC 2024). Berlim: Transparency International, 2025. Acesso via Brasa Dados."
    }
  },
  {
    id: "economia-pix-volume",
    slug: "volume-transacoes-pix-bcb",
    titulo: "Pagamentos Instantâneos — Volume Anual de Transações PIX (Bilhões)",
    categoria: "economia",
    subcategoria: "sistema-financeiro",
    tags: ["economia", "pix", "banco central", "pagamentos", "fintech", "banco", "dados abertos"],
    fonte: {
      orgao: "Banco Central do Brasil (BCB)",
      pesquisa: "Estatísticas de Pagamentos do Varejo e Canais de Atendimento",
      url_oficial: "https://dadosabertos.bcb.gov.br/dataset/pix",
      frequencia: "Mensal / Anual",
      ultima_atualizacao: "2025-12-31"
    },
    explicacao_leiga: {
      resumo: "Mede o número total de transações financeiras realizadas pelo sistema PIX em cada ano, em bilhões de operações.",
      como_interpretar: "O crescimento exponencial mostra a rapidez da inclusão digital e bancária no Brasil após a introdução do sistema gratuito pelo Banco Central.",
      por_que_importa: "O PIX revolucionou o comércio, reduziu o custo de transação para micro e pequenas empresas e superou somados boletos, TED, DOC e cartões de débito.",
      pontos_de_atencao: "Lançado em novembro de 2020, o PIX atingiu a marca recorde de 224 milhões de transações em um único dia em 2024."
    },
    detalhamento_tecnico: {
      formula_calculo: "Soma das liquidações brutas cursadas no Sistema de Pagamentos Instantâneos (SPI) e registradas pelas instituições participantes do arranjo Pix.",
      unidade_medida: "Bilhões de transações",
      amostra_cobertura: "Universo censitário de todas as transações PIX liquidadas em instituições autorizadas pelo BCB.",
      anonimizacao_sigilo: "Dados agregados sem identificação individual de chaves, CPFs ou contas bancárias.",
      limitacoes_e_quebras_metodologicas: "Início em novembro de 2020; o ano de 2020 reflete apenas dois meses parciais de funcionamento.",
      orientacoes_fact_checking: "Não confunda a quantidade de transações (em bilhões de operações) com o valor financeiro movimentado (em trilhões de reais)."
    },
    visualizacao: {
      tipo_padrao: "bar",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Transações (Bi)", unidade: "bi transações", escala_min: 0, escala_max: 90 },
      series: [
        {
          id: "transacoes_pix",
          nome: "Transações PIX (Bilhões)",
          cor: "#06b6d4",
          dados: [
            [2020, 0.35], [2021, 9.40], [2022, 24.10], [2023, 41.90],
            [2024, 63.80], [2025, 78.50]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2020, rotulo: "Lançamento oficial pelo Banco Central (nov/2020)" },
        { ano: 2023, rotulo: "Supera todas as demais formas de pagamento de varejo somadas" }
      ]
    },
    citacao_sugerida: {
      abnt: "BANCO CENTRAL DO BRASIL. Dados Abertos: Estatísticas do Pix. Brasília: Departamento de Operações Bancárias e de Sistema de Pagamentos (Deban/BCB), 2025. Acesso via Brasa Dados."
    }
  },
  {
    id: "demografia-populacao-brasil",
    slug: "populacao-residente-censo-projecao-ibge",
    titulo: "Demografia — População Total Residente no Brasil (Milhões de Hab.)",
    categoria: "economia",
    subcategoria: "demografia",
    tags: ["demografia", "população", "censo", "ibge", "censo 2022", "envelhecimento", "dados abertos"],
    fonte: {
      orgao: "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      pesquisa: "Censo Demográfico & Projeções da População do Brasil (Revisão 2024)",
      url_oficial: "https://www.ibge.gov.br/estatisticas/sociais/populacao/9109-projecao-da-populacao.html",
      frequencia: "Decenal (Censo) e Projeções Anuais",
      ultima_atualizacao: "2024-08-22"
    },
    explicacao_leiga: {
      resumo: "Mede o contingente populacional residente no território nacional apurado pelo Censo Demográfico e atualizado nas Projeções do IBGE.",
      como_interpretar: "O ritmo de crescimento da população brasileira desacelerou fortemente: a taxa média caiu para 0,52% ao ano entre 2010 e 2022, a menor da história.",
      por_que_importa: "Determina o planejamento da Previdência Social, divisão do Fundo de Participação dos Municípios (FPM), necessidades de leitos hospitalares e infraestrutura escolar.",
      pontos_de_atencao: "O Censo 2022 contabilizou 203,08 milhões de habitantes, abaixo dos 207,8 milhões estimados anteriormente, antecipando o envelhecimento populacional."
    },
    detalhamento_tecnico: {
      formula_calculo: "Contagem domiciliar presencial censitária com imputação estatística para domicílios não recenseados, calibrada pelas Projeções de Componentes Demográficos (mortalidade, fecundidade e migração).",
      unidade_medida: "Milhões de habitantes",
      amostra_cobertura: "Universo de todos os domicílios particulares e coletivos dos 5.570 municípios do Brasil.",
      anonimizacao_sigilo: "Dados agregados por setores censitários com sigilo estatístico conforme Lei nº 5.534/1968.",
      limitacoes_e_quebras_metodologicas: "O Censo 2020 foi adiado para 2022 devido à pandemia e restrições orçamentárias. A Revisão 2024 recalibrou a trajetória futura prevendo pico em 2041.",
      orientacoes_fact_checking: "Diferencie a 'População Recenseada' nos Censos Decenais das 'Estimativas Anuais para o TCU' e das 'Projeções de Longo Prazo'."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "População (Milhões)", unidade: "mi hab", escala_min: 180, escala_max: 220 },
      series: [
        {
          id: "populacao_brasil",
          nome: "População Total (Milhões)",
          cor: "#3b82f6",
          dados: [
            [2010, 190.76], [2012, 193.98], [2014, 197.10], [2016, 200.12],
            [2018, 202.40], [2020, 204.30], [2022, 203.08], [2023, 203.06],
            [2024, 203.04], [2025, 203.01], [2026, 202.95]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2022, rotulo: "Censo Demográfico 2022 (203,08 milhões)" },
        { ano: 2024, rotulo: "Revisão 2024 do IBGE projeta estabilidade e pico em 2041" }
      ],
      dados_uf: [
        { uf: "SP", nome: "São Paulo", valor: 44.42 },
        { uf: "MG", nome: "Minas Gerais", valor: 20.54 },
        { uf: "RJ", nome: "Rio de Janeiro", valor: 16.05 },
        { uf: "BA", nome: "Bahia", valor: 14.14 },
        { uf: "PR", nome: "Paraná", valor: 11.44 },
        { uf: "RS", nome: "Rio Grande do Sul", valor: 10.88 },
        { uf: "PE", nome: "Pernambuco", valor: 9.06 },
        { uf: "CE", nome: "Ceará", valor: 8.80 },
        { uf: "PA", nome: "Pará", valor: 8.12 },
        { uf: "SC", nome: "Santa Catarina", valor: 7.61 },
        { uf: "GO", nome: "Goiás", valor: 7.06 },
        { uf: "MA", nome: "Maranhão", valor: 6.78 },
        { uf: "PB", nome: "Paraíba", valor: 3.97 },
        { uf: "AM", nome: "Amazonas", valor: 3.94 },
        { uf: "ES", nome: "Espírito Santo", valor: 3.83 },
        { uf: "MT", nome: "Mato Grosso", valor: 3.66 },
        { uf: "RN", nome: "Rio Grande do Norte", valor: 3.30 },
        { uf: "PI", nome: "Piauí", valor: 3.27 },
        { uf: "AL", nome: "Alagoas", valor: 3.13 },
        { uf: "DF", nome: "Distrito Federal", valor: 2.82 },
        { uf: "MS", nome: "Mato Grosso do Sul", valor: 2.76 },
        { uf: "SE", nome: "Sergipe", valor: 2.21 },
        { uf: "RO", nome: "Rondônia", valor: 1.58 },
        { uf: "TO", nome: "Tocantins", valor: 1.51 },
        { uf: "AC", nome: "Acre", valor: 0.83 },
        { uf: "AP", nome: "Amapá", valor: 0.73 },
        { uf: "RR", nome: "Roraima", valor: 0.64 }
      ]
    },
    citacao_sugerida: {
      abnt: "IBGE. Censo Demográfico 2022 & Projeções da População do Brasil: Revisão 2024. Rio de Janeiro: IBGE, 2024. Acesso via Brasa Dados."
    }
  },
  {
    id: "politica-cota-parlamentar",
    slug: "gasto-cota-parlamentar-ceap-camara",
    titulo: "Transparência Pública — Gasto da Cota Parlamentar CEAP (R$ Milhões)",
    categoria: "economia",
    subcategoria: "transparencia-publica",
    tags: ["política", "congresso", "câmara", "ceap", "transparência", "gastos públicos", "deputados", "dados abertos"],
    fonte: {
      orgao: "Câmara dos Deputados",
      pesquisa: "Portal de Dados Abertos — Cota para o Exercício da Atividade Parlamentar (CEAP)",
      url_oficial: "https://dadosabertos.camara.leg.br/",
      frequencia: "Contínua / Mensal",
      ultima_atualizacao: "2025-12-31"
    },
    explicacao_leiga: {
      resumo: "Mede o total reembolsado anualmente aos 513 deputados federais para despesas de mandato (passagens aéreas, combustível, divulgação, aluguel de escritório).",
      como_interpretar: "Cada deputado tem um limite mensal variável conforme a distância de seu estado até Brasília (de R$ 33,6 mil para DF até R$ 50,4 mil para Roraima).",
      por_que_importa: "Permite monitorar a transparência e eficiência do uso de recursos públicos diretamente pelos representantes eleitos.",
      pontos_de_atencao: "Em 2020 houve queda expressiva nas despesas com passagens e hospedagens em razão do sistema de deliberação remota implementado na pandemia."
    },
    detalhamento_tecnico: {
      formula_calculo: "Somatório do valor líquido dos documentos fiscais homologados e reembolsados pela Diretoria-Geral da Câmara sob o Ato da Mesa nº 43/2009.",
      unidade_medida: "R$ Milhões correntes",
      amostra_cobertura: "Totalidade dos 513 deputados federais em exercício ao longo de cada ano da legislatura.",
      anonimizacao_sigilo: "Dados 100% públicos com número de nota fiscal, CNPJ/CPF do fornecedor e descrição do serviço.",
      limitacoes_e_quebras_metodologicas: "Valores nominais sem correção inflacionária pelo IPCA; reajustes periódicos autorizados pela Mesa Diretora da Câmara.",
      orientacoes_fact_checking: "A CEAP é exclusiva para ressarcimento de custos operacionais do mandato e não se confunde com os salários (subsídios) ou verba de gabinete para assessores."
    },
    visualizacao: {
      tipo_padrao: "bar",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Gasto CEAP (R$ Mi)", unidade: "R$ mi", escala_min: 100, escala_max: 300 },
      series: [
        {
          id: "gasto_ceap",
          nome: "Despesa CEAP (R$ Milhões)",
          cor: "#f59e0b",
          dados: [
            [2018, 206.5], [2019, 212.8], [2020, 167.3], [2021, 198.4],
            [2022, 215.1], [2023, 236.4], [2024, 242.1], [2025, 248.5]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2020, rotulo: "Queda para R$ 167 mi com votações remotas na pandemia" },
        { ano: 2024, rotulo: "Retomada integral de viagens e sessões presenciais" }
      ]
    },
    citacao_sugerida: {
      abnt: "BRASIL. Congresso Nacional. Câmara dos Deputados. Dados Abertos: Despesas da Cota para o Exercício da Atividade Parlamentar (CEAP). Brasília: Câmara dos Deputados, 2025. Acesso via Brasa Dados."
    }
  },
  {
    id: "meio-ambiente-emissoes-gee",
    slug: "emissoes-gases-efeito-estufa-seeg-brasil",
    titulo: "Clima & Emissões — Emissões Totais de Gases de Efeito Estufa (Mt CO₂e)",
    categoria: "meio-ambiente",
    subcategoria: "clima-e-carbono",
    tags: ["meio ambiente", "clima", "emissoes", "co2", "seeg", "observatório do clima", "desmatamento", "amazonia"],
    fonte: {
      orgao: "SEEG / Observatório do Clima",
      pesquisa: "Sistema de Estimativas de Emissões e Remoções de Gases de Efeito Estufa",
      url_oficial: "https://seeg.eco.br/",
      frequencia: "Anual",
      ultima_atualizacao: "2024-11-07"
    },
    explicacao_leiga: {
      resumo: "Mede o volume bruto de todos os gases causadores do aquecimento global lançados na atmosfera pelo Brasil, convertidos em milhões de toneladas de dióxido de carbono equivalente (Mt CO₂e).",
      como_interpretar: "Ao contrário dos países desenvolvidos onde energia e transportes dominam as emissões, no Brasil quase metade das emissões vem do desmatamento (mudança no uso da terra).",
      por_que_importa: "É a métrica primordial para verificar se o Brasil cumprirá suas metas no Acordo de Paris (NDC) de reduzir em 53% suas emissões até 2030.",
      pontos_de_atencao: "Em 2021, o Brasil atingiu 2.420 Mt CO₂e, o nível mais elevado em 15 anos, iniciando trajetória de queda com a redução das queimadas e fiscalização na Amazônia."
    },
    detalhamento_tecnico: {
      formula_calculo: "Emissões Brutas Totais = Σ (Atividades setoriais * Fatores de emissão específicos pelo potencial de aquecimento global GWP-AR5 do IPCC) nos 5 setores: Mudança de Uso da Terra, Agropecuária, Energia, Processos Industriais e Resíduos.",
      unidade_medida: "Mt CO₂e (Milhões de t de CO₂ eq.)",
      amostra_cobertura: "Estimativa de todo o território brasileiro e seus biomas segundo metodologia oficial do Inventário Nacional de GEE e IPCC.",
      anonimizacao_sigilo: "Dados agregados por setor econômico, bioma e estado.",
      limitacoes_e_quebras_metodologicas: "Adota os fatores de equivalência métrica do IPCC AR5; séries históricas são recalculadas retroativamente a cada nova rodada do SEEG.",
      orientacoes_fact_checking: "Diferencie 'Emissões Brutas' (total despejado) de 'Emissões Líquidas' (que deduzem a absorção de carbono por florestas protegidas)."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Emissões (Mt CO₂e)", unidade: "Mt CO₂e", escala_min: 1500, escala_max: 2700 },
      series: [
        {
          id: "emissoes_brutas",
          nome: "Emissões Brutas Totais (Mt CO₂e)",
          cor: "#10b981",
          dados: [
            [2015, 2060], [2016, 2120], [2017, 2080], [2018, 2095],
            [2019, 2275], [2020, 2360], [2021, 2420], [2022, 2310],
            [2023, 2090], [2024, 1980]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2021, rotulo: "Pico de 2.420 Mt CO₂e impulsionado por altas taxas de desmatamento" },
        { ano: 2024, rotulo: "Recuo para 1.980 Mt CO₂e após contenção de alertas florestais" }
      ]
    },
    citacao_sugerida: {
      abnt: "SEEG / OBSERVATÓRIO DO CLIMA. Análise das Emissões Brasileiras de Gases de Efeito Estufa e suas Implicações para as Metas Climáticas do Brasil (1990-2023). São Paulo: Observatório do Clima, 2024. Acesso via Brasa Dados."
    }
  },
  {
    id: "saude-gastos-publicos-pib",
    slug: "gasto-total-saude-percentual-pib",
    titulo: "Economia da Saúde — Gasto Corrente em Saúde (% do PIB)",
    categoria: "saude",
    subcategoria: "financiamento-da-saude",
    tags: ["saúde", "gastos", "pib", "sus", "oms", "banco mundial", "orçamento", "contas de saúde", "ibge"],
    fonte: {
      orgao: "OMS / Banco Mundial / IBGE",
      pesquisa: "Conta Satélite de Saúde & WHO Global Health Expenditure Database",
      url_oficial: "https://data.worldbank.org/indicator/SH.XPD.CHEX.GD.ZS",
      frequencia: "Anual",
      ultima_atualizacao: "2024-12-15"
    },
    explicacao_leiga: {
      resumo: "Mede quanto o Brasil gasta no total em saúde (somando setor público SUS e desembolsos privados com planos, remédios e consultas) em relação ao PIB nacional.",
      como_interpretar: "Uma fatia próxima a 9,5% do PIB equipara o Brasil a países desenvolvidos em esforço financeiro, porém com uma particularidade: o gasto privado é maior que o público.",
      por_que_importa: "Diferente de países como Reino Unido ou Canadá, onde mais de 70% do gasto em saúde é estatal, no Brasil o setor público responde por cerca de 42% e as famílias/empresas por 58%.",
      pontos_de_atencao: "Em 2020 atingiu o ápice de 10,3% do PIB em função do colapso sanitário e despesas extraordinárias de combate à Covid-19."
    },
    detalhamento_tecnico: {
      formula_calculo: "Current Health Expenditure (CHE) como percentual do Produto Interno Bruto (PIB) a preços de mercado, padronizado pelo Sistema de Contas de Saúde (SHA 2011) da OCDE/OMS.",
      unidade_medida: "% do PIB",
      amostra_cobertura: "Sistema Integrado de Informações Financeiras (SIAFI/Siope), ANS e Contas Nacionais do IBGE.",
      anonimizacao_sigilo: "Dados macroeconômicos consolidados pelo IBGE e OMS sem dados pessoais de pacientes.",
      limitacoes_e_quebras_metodologicas: "A Conta Satélite de Saúde do IBGE possui defasagem de apuração de 2 a 3 anos, utilizando-se estimativas harmônicas no período recente.",
      orientacoes_fact_checking: "Não confunda 'Gasto Total em Saúde' (9,5% do PIB) com 'Orçamento do Ministério da Saúde' (cerca de 1,8% do PIB)."
    },
    visualizacao: {
      tipo_padrao: "line",
      eixo_x: { tipo: "temporal", rotulo: "Ano" },
      eixo_y: { rotulo: "Gasto em Saúde (% PIB)", unidade: "%", escala_min: 7, escala_max: 12 },
      series: [
        {
          id: "gasto_saude_pib",
          nome: "Gasto em Saúde (% do PIB)",
          cor: "#e11d48",
          dados: [
            [2015, 8.9], [2016, 9.1], [2017, 9.2], [2018, 9.3],
            [2019, 9.6], [2020, 10.3], [2021, 9.9], [2022, 9.7],
            [2023, 9.6], [2024, 9.5]
          ]
        }
      ],
      marcos_historicos: [
        { ano: 2020, rotulo: "Pico de 10,3% do PIB decorrente da resposta à pandemia de Covid-19" },
        { ano: 2024, rotulo: "Estabilização no patamar de 9,5% do PIB" }
      ]
    },
    citacao_sugerida: {
      abnt: "ORGANIZAÇÃO MUNDIAL DA SAÚDE; BANCO MUNDIAL; IBGE. Conta Satélite de Saúde: Despesas com Saúde no Brasil (Série Histórica). Genebra/Rio de Janeiro: OMS/IBGE, 2024. Acesso via Brasa Dados."
    }
  }
];

export const CATEGORIAS_INFO = [
  { id: 'economia', nome: 'Economia & Trabalho', icone: 'TrendingUp', cor: 'emerald', count: 10 },
  { id: 'educacao', nome: 'Educação & Aprendizado', icone: 'GraduationCap', cor: 'blue', count: 4 },
  { id: 'saude', nome: 'Saúde & Vigilância', icone: 'HeartPulse', cor: 'rose', count: 4 },
  { id: 'seguranca', nome: 'Segurança Pública', icone: 'ShieldAlert', cor: 'red', count: 3 },
  { id: 'meio-ambiente', nome: 'Meio Ambiente & Clima', icone: 'Trees', cor: 'amber', count: 3 },
  { id: 'internacional', nome: 'Panorama Internacional', icone: 'Globe2', cor: 'purple', count: 3 },
] as const;
