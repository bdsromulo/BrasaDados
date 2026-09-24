# 🇧🇷 Brasa Dados

> **O Panorama Visual e Fidedigno do Brasil:** Agregação, contextualização e visualização didática de dados socioeconômicos públicos brasileiros com foco em fact-checking, neutralidade metodológica e análise cruzada em multiquadrantes.

---

## ⚡ Diferenciais do Projeto

- **Zero Backend de Runtime:** 100% estático (JAMstack), preparado para deploy instantâneo no **GitHub Pages** ou **Cloudflare Pages**.
- **Dados Reais Oficiais:** Séries históricas consolidadas do **Banco Central (SGS)**, **IBGE (SIDRA e PNAD)**, **INEP/MEC**, **OCDE (PISA)** e **FBSP (Anuário de Segurança)**.
- **Bancada Multiquadrante (1, 2 ou 4 Telas):** Permite colocar até 4 gráficos lado a lado e sincronizar análises.
- **Fusão de Séries Compatíveis (⚡ Mesclar):** Possibilidade de plotar gráficos no mesmo eixo (ex: Taxa Selic x Inflação IPCA para visualizar o juro real).
- **Dupla Leitura Editorial:** Cada dado tem uma aba para leigos (*"O que isso significa na prática?"*) e uma aba técnica para fact-checking (*"Amostra, fórmula, sigilo estatístico e quebras metodológicas"*).
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
