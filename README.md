# 🇧🇷 Brasa Dados

> **O Panorama Visual e Fidedigno do Brasil:** Agregação, contextualização e visualização didática de dados socioeconômicos públicos brasileiros com foco em fact-checking, neutralidade metodológica e análise cruzada em multiquadrantes.

---

## ⚡ Diferenciais do Projeto

- **Zero Backend de Runtime:** 100% estático (JAMstack), preparado para deploy instantâneo no **GitHub Pages** ou **Cloudflare Pages**.
- **Acervo de 20 Indicadores Oficiais Reais:** Cobrindo todas as áreas sociais com séries históricas do **Banco Central**, **IBGE**, **INEP/MEC**, **DataSUS**, **INPE (PRODES/Queimadas)**, **FBSP (Anuário de Segurança)**, **MDIC (Comex Stat)** e **OCDE**.
- **Variedade de Visualizações no Motor ECharts:**
  - 📈 **Linhas Curvas (*Spline*)** para visão fluida de tendências.
  - 📉 **Linhas Retas (*Linear*)** para rigor metodológico de auditoria e fact-checking.
  - 🌊 **Gráfico de Área com Gradiente** para visualização elegante de densidade temporal.
  - 📊 **Gráfico de Barras / Colunas** para comparação discreta ano a ano.
- **Bancada Multiquadrante (1, 2 ou 4 Telas):** Permite colocar até 4 gráficos lado a lado e sincronizar análises.
- **Fusão de Séries com Eixo Duplo Inteligente (⚡ Mesclar):** Possibilidade de cruzar quaisquer indicadores no mesmo gráfico (usando escala única para unidades iguais ou **Eixo Y Duplo** para unidades distintas, como PIB em % x Dólar em R$).
- **Cards de Métricas Rápidas (KPIs):** Cada quadrante exibe o último valor registrado, variação (*delta* recente com indicação visual) e valores mínimo/máximo do período.
- **Exportação de Dados:** Download da imagem do gráfico em alta resolução (PNG) com carimbo oficial e download dos dados em planilha (CSV).
- **Dupla Leitura Editorial:** Cada dado tem uma aba para leigos (*"O que isso significa na prática?"*) e uma aba técnica para fact-checking (*"Amostra, fórmula, sigilo estatístico e cópia da citação ABNT"*).
- **Menu Lateral Colapsável:** Alternância suave entre modo expandido e modo compacto de ícones.
- **Switch de Tema Claro / Escuro:** Estilo pílula segmentada com persistência local e zero *flicker* no carregamento.

---

## 🚀 Como Rodar Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

```bash
# 1. Instalar as dependências (já instaladas nesta máquina)
npm install

# 2. Rodar o servidor de desenvolvimento
npm run dev

# 3. Compilar para produção (gera pasta /dist estática pronta para deploy)
npm run build
```

---

## 📚 Documentação Técnica

- [`REPOSITORIO.md`](./REPOSITORIO.md): Visão geral, arquitetura JAMstack, taxonomia e especificações.
- [`METODOLOGIA_DADOS.md`](./METODOLOGIA_DADOS.md): Como obter séries pré-agregadas sem usar microdados brutos pesados.
- [`PIPELINES.md`](./PIPELINES.md): Endpoints das APIs oficiais (SIDRA, SGS, IpeaData, Banco Mundial).
- [`TAREFAS.md`](./TAREFAS.md): Roadmap detalhado e próximas etapas.
