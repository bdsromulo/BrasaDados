# Arquitetura · Atlas Cívico

O site continua estático: não há autenticação, banco de dados nem chamadas a APIs externas durante a consulta. Os importadores rodam fora do navegador. Fontes tipográficas são servidas junto do site.

## Organização

| Caminho | Responsabilidade |
| --- | --- |
| `src/App.tsx` | Navegação hash, catálogo, bancada, comparação e detalhes |
| `src/lib/model.ts` | Tipos de indicador, catálogo, cartão e proveniência |
| `src/lib/panel.ts` | Reducer da bancada, desfazer, sanitização e persistência |
| `src/lib/query.ts` | Consulta única para visualização, métricas, tabela e CSV; compatibilidade |
| `src/lib/routing.ts` | Filtros nos links de indicadores |
| `src/lib/data.ts` | Fetch sob demanda, cache por indicador e recuperação após falha |
| `src/components/AtlasChart.tsx` | ECharts modular, redimensionamento, tema e PNG |
| `src/components/IndicatorCard.tsx` | Métricas, gráfico, tabela, metodologia e exportações |
| `src/components/Dialog.tsx` | Modal nativo, Escape, isolamento e retorno de foco |
| `src/index.css` | Tokens, identidade e breakpoints |
| `public/data/catalog.json` | Índice leve, sem séries completas |
| `public/data/indicators/` | Um JSON por indicador |
| `scripts/` | Importação, validação e auditoria |
| `data/evidence/` | Respostas brutas e manifestos de transcrição; não enviados ao navegador |
| `tests/` | Testes de estado, consulta, links e importadores |

`src/data/indicators.ts` e `src/types/indicator.ts` foram mantidos como registro da migração; não entram no bundle da aplicação. Não devem ser usados como fonte para novas atualizações.

## Estado e rotas

Cada cartão tem ID estável, indicador, recorte e preferência opcional. O padrão editorial só é aplicado quando a preferência está ausente. Adicionar não substitui um cartão; o quinto indicador fica pendente de escolha explícita. Remoções e substituições guardam um snapshot para desfazer. Uma nova adição/configuração encerra esse desfazer para evitar apagar mudanças posteriores.

Rotas: `#/`, `#/explorar`, `#/indicador/:slug` e `#/comparar`. Indicadores compartilham `period`, `scope` e `display`; comparações usam um payload versionado `s`. IDs, tipos, recortes e limite de quatro são validados ao decodificar. Links públicos antigos dos indicadores foram preservados.

O `localStorage` guarda a bancada em `brasadados_panel_v1` e o tema em `brasadados_tema`. Falhas no armazenamento não bloqueiam a sessão. Não são transmitidos dados pessoais.

## Dados e visualizações

A função `queryData` produz uma matriz de períodos e valores, preservando `null`. Gráfico, tabela, métrica e CSV usam esse resultado. Mesclagem exige séries nacionais conferidas, mesma frequência, observações em comum no período escolhido e até duas unidades. Comparações sem mesclagem preservam cada referência temporal.

O ECharts é importado por `React.lazy`; cada gráfico é ativado ao aproximar-se da área visível. `ResizeObserver` acompanha tamanho e `MutationObserver` reaplica cores ao trocar o tema. Tabelas HTML permitem leitura sem interagir com o canvas.

## Identidade

Fundo `#F4F7FC`, superfícies brancas, cobalto `#2448C7`, navy `#14264D`, teal `#087F8C`, lima `#D9F06B`, bordas `#DCE5F2`. Outfit em títulos e marca, Inter na interface e números tabulares. Tema escuro tem tokens próprios e séries mais claras. O logo é SVG; imagens do conceito não são utilizadas como interface.
