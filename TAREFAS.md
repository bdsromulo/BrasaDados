# 📋 Brasa Dados — Roteiro de Desenvolvimento & Tarefas (TODOs)

Este documento centraliza as fases de planejamento, implementação e refinamento do **Brasa Dados**.

---

## 🎯 Status Geral do Projeto

- [ ] **Fase 0: Especificação de Metadados & Catálogo Piloto** `[EM ANDAMENTO]`
- [ ] **Fase 1: Estrutura Base do Frontend (JAMstack)**
- [ ] **Fase 2: Catálogo Inicial de Dados (10 a 15 Indicadores Estruturais)**
- [ ] **Fase 3: Páginas de Categorias & Visualização Individual com Dupla Explicação**
- [ ] **Fase 4: Comparador Multiquadrante (1 a 4 Gráficos & Mesclagem)**
- [ ] **Fase 5: Recursos de Fact-Checking, Compartilhamento & Exportação**
- [ ] **Fase 6: CI/CD & Deploy Contínuo (Cloudflare Pages / GitHub Pages)**

---

## 📌 Detalhamento das Fases e Tarefas

### Fase 0: Especificação & Catálogo Piloto
- [x] Documentar arquitetura geral no [`REPOSITORIO.md`](file:///c:/Users/Rômulo%20Silva/Desktop/Códigos/brasadados/REPOSITORIO.md).
- [ ] Definir o schema TypeScript padronizado para os indicadores (`IndicatorMetadata.ts`).
- [ ] Mapear os primeiros 12 indicadores piloto (2 de cada grande área):
  - **Educação:** IDEB (Ensino Médio e Fundamental) & Taxa de Analfabetismo (PNAD/IBGE).
  - **Saúde:** Cobertura Vacinal contra Poliomielite/Tríplice Viral (DataSUS) & Taxa de Mortalidade Infantil.
  - **Segurança:** Taxa de Mortes Violentas Intencionais (FBSP) & População Carcerária Total (SISDEPEN).
  - **Economia:** Taxa de Desocupação (PNAD Contínua) & Inflação Acumulada IPCA (IBGE).
  - **Internacional:** Saldo da Balança Comercial Brasil (Comex Stat) & Participação do Brasil no PIB Mundial (Banco Mundial).
  - **Meio Ambiente:** Taxa Anual de Desmatamento na Amazônia Legal (PRODES/INPE) & Focos de Queimadas.

---

### Fase 1: Estrutura Base do Frontend (Zero Backend)
- [ ] Inicializar projeto com **Vite + React (TypeScript)**.
- [ ] Configurar **Tailwind CSS** e biblioteca de componentes utilitários (ex: Radix / Lucide React para ícones).
- [ ] Integrar **Apache ECharts** (`echarts` + `echarts-for-react`) com tema claro e tema escuro customizados.
- [ ] Configurar roteador SPA (`react-router-dom`) com rotas amigáveis:
  - `/` (Home com destaques e panorama geral do Brasil).
  - `/categorias` e `/categoria/:categoriaSlug` (Listagem temática).
  - `/indicador/:indicadorSlug` (Página do gráfico individual com explicações completas).
  - `/comparador` (Bancada de 4 quadrantes para análise multivariada).
  - `/sobre` e `/metodologia` (Manifesto editorial, neutralidade de dados e guia de citação).
- [ ] Desenvolver **Layout de Aplicação (Dashboard Canvas)**:
  - **Menu Lateral Colapsável à Esquerda:** Alternância fluida entre modo expandido (`w-64`) e colapsado com ícones (`w-18`), tooltips ao hover, suporte a mobile drawer e estado salvo no `localStorage`.
  - **Barra Superior de Filtros do Canvas:** Controles rápidos para período temporal, recorte geográfico/social, seleção de layout de tela (1, 2 ou 4 quadrantes), busca rápida e o switch de tema.
  - **Canvas Principal de Dados:** Área de renderização flexível que se expande até a borda direita da tela, com auto-redimensionamento do Apache ECharts via `ResizeObserver`.
- [ ] Implementar **Switch de Tema Claro / Escuro** no cabeçalho (inspirado no padrão pílula segmentada do *Cine Brasilis* e *Oásis UTFPR*), com persistência em `localStorage`, detecção do sistema via `prefers-color-scheme`, ícones SVG (Sol/Lua) e transição fluida.
- [ ] Criar gerenciador de estado leve via **Zustand** para controlar os gráficos selecionados para a mesa de comparação e o estado de colapso da sidebar.

---

### Fase 2: Catálogo de Dados & Ingestão Estática
- [ ] Criar pasta `/public/data/indicators/` com os arquivos JSON de cada indicador.
- [ ] Criar pasta `/src/data/catalog.json` contendo o índice de navegação (título, categoria, tags, resumo).
- [ ] Criar scripts simples em Python/Node.js em `/scripts/sync/` para consultar APIs públicas do IBGE (SIDRA) e Banco Central (SGS) e gerar os JSONs estáticos automaticamente.
- [ ] Garantir que nenhum arquivo de dados individual ultrapasse 150 KB para preservar a velocidade no navegador.

---

### Fase 3: Páginas Temáticas e Indicador com Dupla Leitura
- [ ] **Menu Hierárquico:**
  - Navegação visual por categorias (Educação, Saúde, Segurança, Economia, etc.) e filtros por fonte (IBGE, INEP, DataSUS, BCB, etc.).
- [ ] **Componente de Visualização Individual:**
  - Gráfico responsivo com zoom por seleção de período (5 anos, 10 anos, série completa).
  - Filtro de recortes (por Região/UF, Sexo ou Rede Pública vs. Privada, quando disponível no indicador).
- [ ] **Aba 1 — "Visão Cidadã / Para Leigos":**
  - Resumo em linguagem acessível sem jargões.
  - "O que este número mede na prática?"
  - Destaque dos pontos de virada históricos (ex: queda na pandemia, picos inflacionários).
- [ ] **Aba 2 — "Metodologia & Fact-Checking":**
  - Ficha técnica: Órgão emissor, nome da pesquisa, link direto para a fonte primária.
  - Metodologia de amostragem, intervalo de confiança e margem de erro (se pesquisa por amostragem).
  - Critérios de anonimização e tratamento da informação (LGPD / sigilo estatístico).
  - Alertas e limitações de comparabilidade histórica (ex: mudanças na metodologia da PNAD em 2012).
- [ ] Botão de ação rápida: **"➕ Adicionar ao Comparador"** com indicador visual do número de slots ocupados (ex: 2/4).

---

### Fase 4: O Comparador Multiquadrante (Workbench)
- [ ] Criar layout de grade dinâmica na tela `/comparador`:
  - Modo 1 tela (tela cheia).
  - Modo 2 telas (lado a lado horizontal ou vertical).
  - Modo 4 quadrantes (grade 2x2).
- [ ] Permitir arrastar/adicionar indicadores em qualquer um dos 4 quadrantes através de um modal de busca rápida.
- [ ] **Mecanismo de Mesclagem Inteligente (Merge):**
  - Identificar se dois gráficos possuem unidades compatíveis (ex: ambos são percentuais `%` ou taxas por 100k habitantes).
  - Exibir botão **"Mesclar Séries"**, renderizando ambas no mesmo gráfico com legendas distintas e cores contrastantes.
  - Suportar eixo secundário (Eixo Y à direita) quando as unidades forem distintas mas temporariamente correlacionadas.
- [ ] Sincronização de zoom temporal: alterar o período no controle central ajusta todos os quadrantes simultaneamente.

---

### Fase 5: Ferramentas de Fact-Checking, Citação & Exportação
- [ ] **Gerador de Citação ABNT / APA:**
  - Botão que copia a referência bibliográfica oficial pronta para acadêmicos, jornalistas e estudantes.
- [ ] **Exportação para Mídias Sociais / Reportagens:**
  - Exportar gráfico em imagem PNG/SVG de alta resolução com carimbo contendo: título, fonte oficial, data de extração e logotipo do Brasa Dados.
- [ ] **Compartilhamento por URL Única:**
  - Codificar o estado da tela de comparação nos parâmetros da URL (ex: `/comparador?slots=ideb,homicidios,pib&merge=0,1`).
  - Isso permite que um jornalista ou usuário envie um link exato do cruzamento que realizou.
- [ ] **Download dos Dados:**
  - Botão simples de "Baixar CSV" ou "Baixar JSON" do recorte visualizado.

---

### Fase 6: Automação, Testes & Publicação
- [ ] Criar **GitHub Action de Build & Test**:
  - Validar se todos os JSONs de indicadores respeitam o schema do TypeScript antes de fazer o build.
- [ ] Criar **GitHub Action de Atualização Agendada (Cron)**:
  - Disparada mensalmente para checar se há novos dados no SIDRA/BCB e realizar commit automático.
- [ ] Configurar deploy no **Cloudflare Pages** (ou GitHub Pages) com domínio personalizado (ex: `brasadados.com.br` ou similar).
- [ ] Testes de acessibilidade (WCAG 2.1) e contraste para daltônicos nas paletas dos gráficos.

---

## 💡 Ideias Adicionais & Futuras
- **Linha do Tempo de Políticas Públicas:** Capacidade de ligar/desligar marcadores temporais nos gráficos (ex: "Entrada em vigor do Estatuto do Desarmamento em 2003", "Reforma do Ensino Médio", "Início do Auxílio Brasil/Bolsa Família").
- **Dicionário de Termos Brasileiros:** Glossário integrado com termos como *IPCA*, *Selic*, *Ideb*, *MVI*, *Gini*, *Déficit Primário*.
- **Modo Apresentação:** Ocultar menus e focar na visualização em tela cheia para salas de aula, palestras ou transmissões ao vivo.
