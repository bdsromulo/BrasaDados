# 🇧🇷 Brasa Dados — Arquitetura, Hipóteses & Estratégia de Dados

O **Brasa Dados** é uma plataforma pública, aberta e independente focada em agregação, contextualização e visualização didática de dados estruturais e conjunturais do Brasil.

O objetivo central é transformar indicadores socioeconômicos dispersos em painéis visuais compreensíveis para cidadãos leigos, ao mesmo tempo em que fornece aos analistas, jornalistas e fact-checkers o rigor metodológico necessário (amostra, critérios de anonimização, notas técnicas, séries históricas e fontes primárias).

---

## 1. Princípios de Engenharia & Restrições de Design

| Princípio | Diretriz | Benefício |
| :--- | :--- | :--- |
| **Zero Backend Runtime** | 100% estático (JAMstack). Hospedado no **GitHub Pages** ou **Cloudflare Pages**. | Custo zero de servidor, alta velocidade (CDN global), imunidade a quedas de servidor e fácil manutenção. |
| **Mínimo Dado Bruto** | Evitar carregar microdados brutos (pesados demais para navegador). Focar em dados pré-agregados e séries prontas. | Carregamento instantâneo no navegador (< 100 KB por gráfico). |
| **Padrão Dual de Leitura** | Cada gráfico traz visão leiga ("O que isso significa?") e visão técnica ("Metodologia & Amostra"). | Acessibilidade democrática sem perder a confiabilidade para checagem de fatos. |
| **Análise Cruzada (4 Quadrantes)** | Área de trabalho flexível para colocar até 4 gráficos lado a lado e mesclá-los quando compatíveis. | Permite correlações visuais rápidas (ex: Evasão Escolar vs. Homicídios de Jovens). |

---

## 2. Taxonomia & Mapeamento de Fontes e Categorias

Para garantir a organização hierárquica `Categoria -> Subcategoria -> Fonte -> Indicador`, a estrutura foi mapeada nas seguintes frentes:

```
Brasa Dados
├── 1. Educação
│   ├── Censo Escolar (MEC/INEP)
│   ├── Indicadores de Desempenho (SAEB, IDEB, PISA)
│   ├── Ensino Superior & Avaliação (Censo Superior, Enade)
│   └── Financiamento (FUNDEB, Despesas da União)
├── 2. Saúde
│   ├── Vigilância & Mortalidade (DataSUS/SIM, SINASC)
│   ├── Imunização & Doenças (SI-PNI, Infogripe/Fiocruz)
│   ├── Capacidade Instalada (CNES - Leitos SUS vs. Privados)
│   └── Saúde Suplementar (ANS)
├── 3. Segurança Pública
│   ├── Violência Letal (FBSP - Anuário, Atlas da Violência/IPEA)
│   ├── Sistema Prisional (SENAPPEN / SISDEPEN)
│   ├── Segurança Viária (Polícia Rodoviária Federal / Renaest)
│   └── Criminalidade Patrimonial & Gênero (Sinesp / MJSP)
├── 4. Economia & Trabalho
│   ├── Emprego e Renda (IBGE/PNAD Contínua, Novo CAGED/MTE)
│   ├── Preços & Inflação (IBGE/IPCA, FGV/IGP-M)
│   ├── Política Monetária & Fiscal (Banco Central - Séries SGS, Tesouro Transparente)
│   └── Desigualdade & Pobreza (IBGE, IpeaData - Gini, Linhas de Pobreza)
├── 5. Aspectos Internacionais & Comércio
│   ├── Balança Comercial (Comex Stat / MDIC)
│   ├── Fluxos de Investimento (Banco Central - IED)
│   └── Comparações Globais (Banco Mundial, Our World in Data, OCDE)
└── 6. Meio Ambiente & Clima
    ├── Desmatamento & Cobertura (INPE/PRODES, DETER, MapBiomas)
    ├── Queimadas e Focos de Calor (INPE Queimadas)
    └── Recursos Hídricos (Agência Nacional de Águas - ANA)
```

---

## 3. Como Obter Dados sem Processamento Pesado de Dados Brutos

O maior risco de um projeto de dados brasileiros é tentar processar microdados (como a base bruta do Censo ou PNAD, que possui gigabytes). Para contornar isso e manter o site **leve, rápido e 100% frontend**, adotamos três estratégias complementares:

### Estratégia A: APIs Públicas Oficiais que já Entregam Dados Agregados
Diversos órgãos já possuem endpoints que retornam séries temporais consolidadas e tabelas prontas em JSON:

1. **IBGE SIDRA (Sistema IBGE de Recuperação Automática)**:
   - *O que é:* O SIDRA permite consultar tabelas agregadas por município, estado ou Brasil sem tocar em microdados.
   - *Exemplo de Uso:* Inflação do IPCA consolidada mensal, taxa de desocupação trimestral da PNAD.
   - *Endpoint API:* `https://servicodados.ibge.gov.br/api/v3/agregados/{tabela}/periodos/{periodo}/variaveis/{variavel}?localidades=BR`

2. **Banco Central do Brasil — SGS (Sistema Gerenciador de Séries Temporais)**:
   - *O que é:* Séries limpas de taxas de juros (Selic), câmbio, reservas internacionais, endividamento público.
   - *Endpoint API:* `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo_serie}/dados?formato=json`

3. **IpeaData (Instituto de Pesquisa Econômica Aplicada)**:
   - *O que é:* Mais de 9.000 séries históricas de saúde, educação, criminalidade e economia.
   - *Endpoint API:* API REST em OData `http://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='{CODIGO}')`

4. **Our World in Data (OWID)** & **Banco Mundial (World Bank Open Data)**:
   - *O que é:* Séries prontas e padronizadas para comparações internacionais do Brasil (ex: emissões per capita, gastos com educação como % do PIB).

### Estratégia B: Pipeline "Headless" via GitHub Actions (Data Sync Diário/Semanal)
Para fontes que não possuem API aberta (ex: planilhas em Excel publicadas anualmente pelo Fórum de Segurança Pública ou INEP):
- Um script Python simples roda em uma **GitHub Action** agendada.
- Ele baixa o arquivo oficial da fonte, extrai apenas as colunas agregadas de interesse e salva arquivos `.json` estáticos na pasta `/public/data/` do repositório.
- **Resultado:** O frontend apenas consome um arquivo JSON de 20 KB já mastigado, com zero esforço de processamento em tempo real.

### Estratégia C: Gráficos Curados e Padronizados (Apache ECharts)
- Em vez de embutir *iframes* externos (que quebram layout, não têm suporte a modo escuro e não permitem mesclar gráficos), usamos uma biblioteca moderna de renderização vetorial no front: **Apache ECharts** (ou Chart.js).
- Cada indicador possui um manifesto de metadados padronizado. Assim, o gráfico é desenhado no próprio site, permitindo responsividade perfeita, exportação em PNG/SVG e a mesclagem em múltiplos quadrantes.

---

## 4. O Sistema de 4 Quadrantes & Mesclagem (Workbench)

Um dos maiores diferenciais do **Brasa Dados** é a tela de laboratório/comparador:

```
┌──────────────────────────────┬──────────────────────────────┐
│ Quadrante 1                  │ Quadrante 2                  │
│ [ Taxa de Desocupação (%)  ] │ [ Salário Médio Real (R$)  ] │
│ Fonte: IBGE / PNAD           │ Fonte: IBGE                  │
├──────────────────────────────┼──────────────────────────────┤
│ Quadrante 3                  │ Quadrante 4                  │
│ [ Inflação Acumulada 12m   ] │ [ Taxa Selic Over (% a.a.) ] │
│ Fonte: IBGE / IPCA           │ Fonte: Banco Central         │
└──────────────────────────────┴──────────────────────────────┘
               [ ⚡ Mesclar Q3 e Q4 (Eixo % comum) ]
```

### Regras de Mesclagem de Gráficos:
1. **Compatibilidade de Domínio Temporal:** Ambos os gráficos devem compartilhar a mesma unidade de tempo (ex: Anos `2010-2024` ou Meses `Jan/2020-Dez/2024`).
2. **Compatibilidade de Unidades:**
   - *Mesmo Eixo Y:* Quando ambos medem `%` (ex: Taxa Selic e Inflação IPCA) ou `Taxa por 100 mil hab.` (ex: Homicídios e Mortes no Trânsito).
   - *Eixo Y Duplo (Eixo Secundário):* Se as unidades forem diferentes (ex: `PIB em R$ bilhões` no eixo esquerdo e `Taxa de Câmbio R$/US$` no eixo direito), o sistema pode ativar automaticamente uma escala secundária à direita.
3. **Sincronização de Cursor:** Passar o mouse sobre um ano no Quadrante 1 destaca o mesmo ano em todos os quadrantes ativos.

---

## 5. Estrutura do Esquema de Dados (Schema de Indicador)

Cada dado no Brasa Dados será armazenado como um documento estático (JSON ou Markdown com Frontmatter) seguindo esta estrutura padronizada para Fact-Checking:

```json
{
  "id": "educacao-ideb-ensino-medio",
  "titulo": "Índice de Desenvolvimento da Educação Básica (IDEB) - Ensino Médio",
  "categoria": "educacao",
  "subcategoria": "desempenho-escolar",
  "fonte": {
    "orgao": "INEP / Ministério da Educação",
    "nome_pesquisa": "Censo da Educação Básica e Sistema de Avaliação da Educação Básica (Saeb)",
    "url_oficial": "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb",
    "ultima_atualizacao": "2024-08-14"
  },
  "explicacao_leiga": {
    "resumo": "O IDEB é a nota oficial da qualidade das escolas no Brasil, variando de 0 a 10.",
    "como_interpretar": "Combina o rendimento escolar (quantos alunos passam de ano sem reprovar) com o desempenho em provas de português e matemática.",
    "por_que_importa": "Ajuda a saber se as escolas estão ensinando de verdade ou apenas aprovando os alunos sem aprendizado."
  },
  "detalhamento_tecnico": {
    "formula_criterios": "Calculado a partir de: IDEB = N_j * P_j (onde N é a média padronizada no Saeb e P é o indicador de fluxo escolar).",
    "amostra_cobertura": "Censo escolar de todas as escolas públicas e privadas com pelo menos 10 alunos matriculados na etapa avaliada.",
    "anonimizacao_sigilo": "Resultados de turmas ou escolas com menos de 10 alunos são suprimidos para preservar a privacidade individual (conforme LGPD e normas do INEP).",
    "limitacoes_cuidados": "Atenção em comparações durante a pandemia (2021), quando as regras de aprovação foram alteradas emergencialmente na maioria dos estados."
  },
  "visualizacao": {
    "tipo_padrao": "line",
    "eixo_x": "Ano",
    "eixo_y_unidade": "Pontos (0 a 10)",
    "series": [
      { "nome": "Rede Pública", "dados": [[2017, 3.5], [2019, 3.9], [2021, 3.9], [2023, 4.1]] },
      { "nome": "Rede Privada", "dados": [[2017, 5.8], [2019, 6.0], [2021, 5.6], [2023, 5.8]] },
      { "nome": "Total Brasil", "dados": [[2017, 3.8], [2019, 4.2], [2021, 4.2], [2023, 4.3]] }
    ]
  }
}
```

---

## 6. Stack Tecnológica Recomendada (Frontend Only)

| Camada | Tecnologia Escolhida | Justificativa |
| :--- | :--- | :--- |
| **Framework Web** | **React + Vite** (ou **Astro**) com **TypeScript** | Performance ultrarrápida, compilação estática pura para HTML/JS/CSS, tipagem segura para os esquemas de dados. |
| **Estilização** | **Tailwind CSS + Shadcn UI** | Interface moderna, limpa, responsiva e com suporte nativo a Dark Mode / Light Mode. |
| **Visualização de Dados**| **Apache ECharts** (`echarts-for-react`) | Motor gráfico de padrão profissional, suporta animações, zoom, múltiplos eixos, temas e mesclagem dinâmica de séries. |
| **Roteamento & Estado** | **Zustand** + **React Router** | Estado ultra-leve para gerenciar quais gráficos estão nos 4 quadrantes do workbench. |
| **Hospedagem** | **Cloudflare Pages** ou **GitHub Pages** | Gratuito, deploy automático via git push, HTTPS incluso e CDN global de latência mínima. |

---

## 7. Design do Switch de Tema (Modo Claro / Escuro)

Inspirado na usabilidade e estética fluida dos projetos de referência (**Cine Brasilis** e **Oásis UTFPR**):
- **Formato Pílula Segmentada (*Segmented Pill Switch*):**
  - Contêiner arredondado (`rounded-full`), fundo sutil com borda translúcida e desfoque de fundo (`backdrop-blur-md`).
  - Duas (ou três) opções: **Sol (Claro)** e **Lua (Escuro)** [com opção opcional de **Sistema**].
  - A opção ativa se destaca com fundo elevado em cartão branco/preto (`shadow-sm`, `rounded-full`, transição suave de deslizamento/fade).
  - Ícones SVG minimalistas (estilo *Feather / Lucide*) acompanhados ou não de rótulo textual sutil de alta legibilidade.
- **Persistência & Detecção:**
  - Carregamento inicial antes da renderização para evitar efeito *FOUC* (flash de tema incorreto): lê `localStorage.getItem("brasadados_tema")` e recorre a `window.matchMedia("(prefers-color-scheme: dark)")`.
  - Aplica o atributo `class="dark"` no elemento `<html>` do documento.
- **Sincronização com os Gráficos ECharts:**
  - O motor do Apache ECharts escuta a troca de tema e recalcula dinamicamente as cores de grade, eixos, tooltips e paletas de contraste (ex: fundo escuro `zinc-900`/`zinc-950` vs. fundo claro `zinc-50`/`white`).

---

## 8. Arquitetura de Interface & Layout (Dashboard Canvas)

A experiência de navegação do **Brasa Dados** é estruturada no conceito de **Workbench de Alta Eficiência**, maximizando a área visual dos dados:

```
┌───────────────┬──────────────────────────────────────────────────────────────────┐
│ [≡] BRASA     │  BARRA SUPERIOR DE FILTROS & CONTROLES DO CANVAS                 │
│     DADOS     │  [Período: 2014-2024 ▼] [Recorte: Brasil / UFs ▼] [Grid: 1|2|4]  │
│               │  [⚡ Mesclar Séries]              [🔍 Buscar] [☀️/🌙 Tema] [↗ Export]│
├───────────────┼──────────────────────────────────────────────────────────────────┤
│ 📚 Educação   │                                                                  │
│  ├ Censo      │                   CANVAS PRINCIPAL                               │
│  ├ INEP/Ideb  │                                                                  │
│  └ FUNDEB     │         [ Área de Gráficos de Alta Resolução ]                   │
│               │         (Ocupa todo o espaço até a borda direita da tela)         │
│ 🏥 Saúde      │                                                                  │
│  ├ DataSUS    │         • 1 Gráfico em tela cheia OU                             │
│  └ Imunização │         • Até 4 Quadrantes simultâneos com zoom sincronizado     │
│               │                                                                  │
│ 🛡️ Segurança  │                                                                  │
│ 📈 Economia   │──────────────────────────────────────────────────────────────────┤
│ 🌐 Global     │  PAINEL CONTEXTUAL INFERIOR (Colapsável / Em Abas)               │
│ 🌿 Meio Amb.  │  [💡 Explicação para Leigos]  [📋 Metodologia & Fact-Checking]   │
│               │  [⚖️ Fórmula & Amostra]        [🔗 Fonte Primária Oficial]        │
│ [ < Colapsar] │                                                                  │
└───────────────┴──────────────────────────────────────────────────────────────────┘
```

### Componentes do Layout:

1. **Menu Lateral Colapsável (Sidebar à Esquerda):**
   * **Estado Expandido (`w-64` / 256px):**
     * Logotipo com identidade nacional estilizada.
     * Lista hierárquica por Categorias com ícones temáticos e submenus expansíveis (acordeão).
     * Indicadores com badges de status (ex: "Novo", "2024", "Série Histórica").
     * Rodapé da sidebar com botão de colapso rápido `[ < Recolher ]` e links para *Sobre* e *Metodologia*.
   * **Estado Colapsado / Ícones (`w-18` / 72px):**
     * Oculta textos e mantém apenas ícones centralizados de alta identificação visual.
     * *Tooltips* flutuantes imediatos ao passar o mouse (hover) exibindo o nome da categoria e opções rápidas.
     * Transição CSS suave (`transition-all duration-300 ease-in-out`).
     * No mobile, comporta-se como gaveta retrátil (*drawer*) com gatilho flutuante.

2. **Barra Superior de Filtros do Canvas (Header de Ações):**
   * Posicionada imediatamente acima do canvas gráfico, fixada no topo da área útil.
   * **Controles Rápidos:**
     * **Seletor de Escopo Temporal:** Atalhos `[5 anos]`, `[10 anos]`, `[Tudo]` ou slider de datas.
     * **Seletor de Nível Geográfico:** Filtro `[Brasil Total]`, `[Regiões]`, `[UF]` (quando aplicável ao indicador).
     * **Alternador de Grade do Canvas:** Botões de layout `[ ■ 1 Tela ]`, `[ ❚❚ 2 Telas ]`, `[ ⊞ 4 Quadrantes ]`.
     * **Botão "Mesclar Compatíveis":** Fica destacado quando o usuário seleciona 2 ou mais séries que compartilham escala ou eixo temporal.
     * **Switch de Tema Claro / Escuro:** Pílula segmentada integrada no canto direito superior.
     * **Botão de Exportação / Compartilhamento:** Copiar URL com filtros aplicados ou baixar imagem/PNG carimbada.

3. **Canvas Principal de Visualização:**
   * Ocupa 100% da largura restante da tela (da borda direita da sidebar até o limite direito do monitor).
   * Redimensionamento automático do Apache ECharts (`resize()` responsivo via `ResizeObserver`).
   * Abaixo do gráfico, um bloco modular bipartido com a **Explicação para Leigos** e a **Ficha Metodológica de Fact-Checking** (com links externos diretos para as fontes primárias do governo).

---

## 9. Documentos Complementares & Próximos Passos

- 📊 **Metodologia de Dados & Estudos de Caso:** Consulte [`METODOLOGIA_DADOS.md`](file:///c:/Users/Rômulo%20Silva/Desktop/Códigos/brasadados/METODOLOGIA_DADOS.md) para a análise aprofundada de como obter indicadores (PISA, PIB, IDEB, MVI) sem microdados.
- 🔌 **Endpoints & APIs Públicas:** Consulte [`PIPELINES.md`](file:///c:/Users/Rômulo%20Silva/Desktop/Códigos/brasadados/PIPELINES.md) para exemplos práticos de chamadas ao IBGE SIDRA e Banco Central SGS.
- 📋 **Checklist de Tarefas:** Consulte [`TAREFAS.md`](file:///c:/Users/Rômulo%20Silva/Desktop/Códigos/brasadados/TAREFAS.md) para o roadmap sequencial de desenvolvimento.
