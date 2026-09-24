# 🔌 Guia de Pipelines & Fontes de Dados Pré-Agregadas

Este guia orienta como alimentar o **Brasa Dados** sem precisar baixar nem processar microdados pesados (como as bases de vários gigabytes do Censo Escolar ou PNAD Contínua), aproveitando endpoints públicos que já fornecem os dados agregados prontos para visualização.

---

## 1. APIs Oficiais com Dados Agregados Prontos (JSON)

### A. Banco Central do Brasil — Sistema Gerenciador de Séries Temporais (SGS)
O SGS do Banco Central é uma das fontes mais limpas e estáveis do Brasil. O retorno é um JSON direto contendo data e valor.

* **Exemplo de Séries Relevantes:**
  * `432`: Taxa de juros - Selic acumulada no mês (% a.m.)
  * `4189`: Taxa Selic fixada pelo Copom (% a.a.)
  * `10844`: IPCA acumulado nos últimos 12 meses (%)
  * `1`: Taxa de câmbio - Livre - Dólar americano (compra)
  * `4505`: Dívida Líquida do Setor Público (% do PIB)

* **Exemplo de Chamada de API Direta:**
  ```http
  GET https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados/ultimos/120?formato=json
  ```

* **Estrutura do Retorno:**
  ```json
  [
    { "data": "01/01/2024", "valor": "11.75" },
    { "data": "01/02/2024", "valor": "11.25" }
  ]
  ```

---

### B. IBGE — API SIDRA (Sistema de Recuperação Automática)
O SIDRA permite consultar tabelas agregadas oficiais do IBGE para o Brasil, Grandes Regiões, Estados e Municípios.

* **Exemplo de Tabelas Estruturais:**
  * **Tabela 1737 (IPCA):** Número-índice e variação mensal e acumulada.
  * **Tabela 4099 (PNAD Contínua):** Taxa de desocupação das pessoas de 14 anos ou mais de idade (trimestral).
  * **Tabela 6784 (PIB Trimestral):** Taxa de variação do PIB em relação ao mesmo período do ano anterior.

* **Exemplo de Chamada para a Taxa de Desocupação (Brasil):**
  ```http
  GET https://servicodados.ibge.gov.br/api/v3/agregados/4099/periodos/-20/variaveis/4099?localidades=BR
  ```

---

### C. IpeaData (Instituto de Pesquisa Econômica Aplicada)
O IpeaData possui um repositório gigantesco de indicadores sociais históricos de educação, saúde, segurança e desigualdade (ex: Coeficiente de Gini desde a década de 1970).

* **Exemplo de Chamada via OData (JSON):**
  ```http
  GET http://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='AD_GINI')?$format=json
  ```
  *(Retorna o Índice de Gini anual do Brasil).*

---

### D. Our World in Data (OWID) & Banco Mundial
Para dados internacionais e posição do Brasil em relação ao mundo (ex: Emissões de CO2, Expectativa de Vida, Gastos Públicos em Saúde):

* **Banco Mundial API:**
  ```http
  GET https://api.worldbank.org/v2/country/BRA/indicator/NY.GDP.PCAP.CD?format=json
  ```
  *(Retorna PIB per capita em dólares correntes para o Brasil).*

---

## 2. Fontes Especiais Sem API Direta (Planilhas Oficiais Consolidadas)

Algumas das instituições mais importantes do país publicam relatórios anuais em arquivos consolidados (Excel/CSV ou relatórios técnicos), dispensando o uso de microdados:

| Instituição | Temática | Como Obter o Dado Agregado |
| :--- | :--- | :--- |
| **Fórum Brasileiro de Segurança Pública (FBSP)** | Mortes Violentas Intencionais (MVI), Feminicídios, Armas | Baixar as *Tabelas do Anuário Brasileiro de Segurança Pública* (divulgadas anualmente em planilhas limpas por estado). |
| **INEP / MEC** | IDEB, Censo Escolar (Resumo Técnico), Taxas de Rendimento | O INEP publica a página de **Resultados do IDEB** em arquivos consolidados por escola, município, estado e Brasil. |
| **DataSUS / Ministério da Saúde** | Cobertura Vacinal (SI-PNI), Mortalidade (SIM) | Utilizar as tabelas de séries históricas compiladas pelo Ministério da Saúde ou extração via biblioteca comunitária `pysus` para gerar o resumo agregado. |

---

## 3. Modelo de Automação Leve via GitHub Actions (Zero Backend)

Para manter o site 100% estático e sem custos de servidor, utilizamos uma rotina simples no GitHub Actions:

```
[ Agendamento Cron (Semanal / Mensal) ]
                 │
                 ▼
[ GitHub Action: Executa script de sync em Python / Node.js ]
                 │
                 ├── 1. Chama as APIs públicas (BCB, IBGE, IPEA)
                 ├── 2. Formata para o padrão leve do Brasa Dados
                 └── 3. Salva em /public/data/indicators/*.json
                 │
                 ▼
[ Git Commit & Push Automático no Repositório ]
                 │
                 ▼
[ Cloudflare Pages / GitHub Pages recompila o site estático ]
```

### Exemplo de Script de Sincronização Simples (`scripts/sync_bcb.mjs`):
```javascript
// Exemplo de script Node.js nativo (sem dependências) para atualizar uma série do BCB
import fs from 'fs';

async function updateSelic() {
  const url = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados/ultimos/60?formato=json';
  const response = await fetch(url);
  const data = await response.json();

  const formattedSeries = data.map(item => {
    const [dia, mes, ano] = item.data.split('/');
    return [`${ano}-${mes}-${dia}`, parseFloat(item.valor)];
  });

  const indicatorPath = './public/data/indicators/economia-taxa-selic.json';
  const existingData = JSON.parse(fs.readFileSync(indicatorPath, 'utf-8'));
  
  existingData.visualizacao.series[0].dados = formattedSeries;
  existingData.fonte.ultima_atualizacao = new Date().toISOString().split('T')[0];

  fs.writeFileSync(indicatorPath, JSON.stringify(existingData, null, 2));
  console.log('✅ Série da Selic atualizada com sucesso!');
}

updateSelic();
```

---

## 4. Estratégia para Incorporação de Gráficos de Terceiros (Quando aplicável)

Quando uma instituição já disponibiliza um gráfico interativo no **Datawrapper** ou **Flourish** sob licença aberta (Creative Commons ou uso governamental aberto):
1. **Opção A (Recomendada):** Extrair a série de dados subjacente e renderizar no motor próprio do Brasa Dados (ECharts). Vantagens: permite mesclagem no comparador, suporte nativo a tema escuro e visual uniforme.
2. **Opção B (Modo Incorporado):** Para gráficos complexos de mapas coropléticos ou diagramas muito específicos, permitir a opção de exibição em modo *Embed Sandbox* com créditos explícitos, ficha metodológica e link para o autor original.
