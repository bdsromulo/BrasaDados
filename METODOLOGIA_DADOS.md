# 📊 Metodologia de Obtenção de Dados & Estratégia Gráfica — Brasa Dados

Este documento esclarece em detalhes **de onde vêm os dados**, **o que significa "dado bruto" vs. "dado agregado"** no contexto público brasileiro e **qual é o nível de esforço e transformação** necessário para exibir cada indicador no **Brasa Dados**.

---

## 1. O Dilema: Adaptar Gráficos Prontos vs. Regerar a partir de Dados Crus

Para construir uma plataforma limpa, rápida, sem backend e que suporte o **Comparador de 4 Quadrantes com Mesclagem de Gráficos**, dividimos a obtenção de dados em 3 níveis:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              ESPECTRO DE DADOS                               │
├───────────────────────┬──────────────────────────────┬───────────────────────┤
│ NÍVEL 1: APIs DIRETA  │ NÍVEL 2: TABELAS AGREGADAS   │ NÍVEL 3: MICRODADOS   │
│ (Automatização Total) │ (Extração Anual Leve)        │ (Bases Crús Pesadas)  │
├───────────────────────┼──────────────────────────────┼───────────────────────┤
│ • IBGE SIDRA          │ • Anuário de Seg. Pública    │ • Microdados Censo    │
│ • Banco Central (SGS) │ • Relatório do PISA (OCDE)   │ • Microdados PNAD     │
│ • Banco Mundial / OWID│ • Resumo Técnico do IDEB     │ • Microdados Enem     │
│                       │                              │                       │
│ ➡️ O dado já vem em   │ ➡️ O dado já vem somado em   │ ❌ Gigabytes de linhas│
│ JSON [ano, valor].    │ planilhas oficiais anuais.   │ individuais de alunos │
│ Zero esforço manual.  │ Conversão única para JSON.   │ ou questionários.     │
│                       │                              │                       │
│ 🌟 ~50% do site       │ 🌟 ~45% do site              │ ⚠️ EVITAR (< 5%)     │
└───────────────────────┴──────────────────────────────┴───────────────────────┘
```

---

## 2. Por Que NÃO Usar *Iframes* / Gráficos Embutidos de Terceiros?

Poderíamos ser tentados a simplesmente colocar um `<iframe>` de um gráfico pronto do Datawrapper, PowerBI do governo ou Our World in Data. **Por que isso inviabilizaria o Brasa Dados?**

1. **Quebra o Comparador de 4 Quadrantes:** Dois iframes diferentes não conversam entre si. Você não consegue sincronizar o cursor, o zoom temporal ou passar o mouse em 2020 em um e destacar o mesmo ano no outro.
2. **Impossibilita a Mesclagem (Merge):** Você jamais conseguiria colocar uma linha do PIB e uma linha do Desemprego sobre o mesmo eixo se ambas fossem iframes externos fechados.
3. **Quebra o Tema Claro/Escuro:** Gráficos externos vêm com fundo branco ou cinza fixo, estragando o modo escuro.
4. **Instabilidade:** Se o portal terceiro mudar o link, seu gráfico fica em branco.

### A Abordagem Vencedora do Brasa Dados:
Nós **NÃO** pegamos a imagem nem o iframe. Nós pegamos **apenas as coordenadas da série temporal** (ex: `[[2020, 3.8], [2021, 4.2], [2022, 4.5]]`) e **desenhamos o gráfico dentro do nosso próprio motor (Apache ECharts)**.

> **Vantagem:** O arquivo de dados tem menos de **10 KB**, carrega instantaneamente, tem identidade visual brasileira limpa, responde ao modo escuro e pode ser mesclado livremente no comparador.

---

## 3. Análise Detalhada dos Indicadores Básicos

Vejamos como funcionam na prática os exemplos solicitados:

### Caso A: Índice PISA (Programa Internacional de Avaliação de Alunos)
* **O que é:** Avaliação internacional trienal coordenada pela OCDE e aplicada no Brasil pelo INEP em estudantes de 15 anos (Leitura, Matemática e Ciências).
* **Precisa de dados crus (respostas individuais de cada aluno)?**
  * **NÃO.** A OCDE avalia cerca de 600 mil alunos no mundo (sendo ~14 mil no Brasil). Você não precisa processar o caderno de provas de cada aluno.
* **Onde o dado oficial já existe pronto:**
  * O Banco Mundial disponibiliza a série histórica do PISA via API aberta em JSON (`World Bank Indicator: LO.PISA.MAT`, `LO.PISA.REA`).
  * O INEP publica a cada 3 anos o *Relatório Brasil no PISA* com uma tabela consolidada: nota média do Brasil vs. média da OCDE vs. países vizinhos (Chile, México, Argentina, Colômbia).
* **O que o Brasa Dados faz:**
  * Armazenamos um JSON simples contendo os anos das edições (`2000, 2003, 2006, 2009, 2012, 2015, 2018, 2022`) e as notas médias.
  * **Trabalho necessário:** Zero dados crus. O arquivo JSON leva 5 minutos para ser montado ou sincronizado e só muda a cada 3 anos.

---

### Caso B: PIB (Produto Interno Bruto)
* **O que é:** A soma de todas as riquezas e serviços produzidos no país. Pode ser medido em:
  1. *Crescimento Percentual Anual (%):* Mede se a economia expandiu ou encolheu.
  2. *Variação Trimestral contra trimestre anterior (com ajuste sazonal).*
  3. *PIB per capita (R$ ou US$ correntes):* Riqueza dividida pela população.
* **Precisa de dados crus (notas fiscais ou balanços de empresas)?**
  * **NÃO.** Nem o IBGE divulga dados brutos de empresas (por sigilo fiscal). O IBGE calcula o Sistema de Contas Nacionais e entrega a série 100% pronta.
* **Onde o dado oficial já existe pronto:**
  * **IBGE SIDRA (Tabela 6784):** Endpoint direto que retorna as taxas de crescimento do PIB trimestral e anual.
  * **Banco Central SGS (Série 4380 / 1211):** Retorna o PIB consolidado mensal ou anual em formato JSON limpo.
* **O que o Brasa Dados faz:**
  * Um script leve de 20 linhas faz uma chamada HTTP na API do SIDRA ou BCB uma vez por trimestre, pega o array de datas e valores e salva no arquivo `/public/data/indicators/economia-pib.json`.
  * O ECharts plota o gráfico de barras (com valores positivos em verde e negativos/recessões em vermelho).

---

### Caso C: IDEB (Índice de Desenvolvimento da Educação Básica)
* **O que é:** Nota de 0 a 10 para o Ensino Fundamental e Médio, calculada a cada 2 anos pelo INEP.
* **Precisa de dados crus do Censo Escolar e do Saeb?**
  * **NÃO.** O INEP já divulga a planilha oficial consolidada com a nota do Brasil, das Regiões, dos Estados e das Redes (Pública vs. Privada).
* **O que o Brasa Dados faz:**
  * Extrai a tabela de resumo nacional que tem apenas ~10 linhas por rede e transforma no JSON padronizado.
  * Permite ao usuário comparar no gráfico a evolução da escola pública vs. escola privada nos últimos 15 anos.

---

### Caso D: Segurança Pública (Mortes Violentas Intencionais - MVI)
* **O que é:** O indicador mais confiável de criminalidade letal do Brasil, somando homicídios dolosos, latrocínios, lesões corporais seguidas de morte e mortes decorrentes de intervenção policial.
* **Precisa de dados crus (boletins de ocorrência das delegacias)?**
  * **NÃO.** As secretarias de segurança estaduais têm formatos heterogêneos e sigilosos.
* **Onde o dado oficial já existe pronto:**
  * O **Fórum Brasileiro de Segurança Pública (FBSP)** consolida todos os estados e publica anualmente as *Tabelas Oficiais do Anuário*.
  * O **IPEA** publica o *Atlas da Violência* com a série histórica por estado e perfil da vítima (jovens, negros, mulheres).
* **O que o Brasa Dados faz:**
  * Pegamos a tabela consolidada do Anuário/Atlas, que já traz a taxa calculada por 100 mil habitantes de 2011 até o ano mais recente.
  * Salvamos no JSON estático do indicador. Atualização necessária: apenas 1 vez por ano (quando o anuário é publicado em julho).

---

## 4. O Que Fica na Ficha de Metodologia e Fact-Checking?

Para garantir a credibilidade editorial do Brasa Dados, cada indicador armazena em seu JSON metadados rigorosos:

| Campo do Metadado | Função no Fact-Checking | Exemplo Prático |
| :--- | :--- | :--- |
| **`orgao_emissor`** | Identifica a autoridade oficial do dado | INEP / MEC |
| **`amostra_cobertura`** | Diz quem foi ou não medido | Escolas com pelo menos 10 alunos matriculados na 3ª série do EM |
| **`taxa_resposta`** | Critério de validade estatística | Exige 80% de presença dos alunos no dia do exame |
| **`anonimizacao`** | Regra de privacidade (LGPD) | Escolas com menos de 10 alunos são suprimidas da divulgação pública |
| **`quebra_metodologica`** | Evita comparações desonestas ou enganosas | *Exemplo:* Em 2021, o IDEB subiu em vários estados por causa de regras emergenciais de aprovação automática durante a pandemia |
| **`url_oficial`** | Link para a fonte primária | Link direto para o portal do governo ou da instituição |

---

## 5. Resumo da Estratégia de Engenharia

1. **Nunca reinventar a roda estatística:** Todo órgão de excelência (IBGE, IPEA, BCB, INEP, Fiocruz, FBSP, OCDE) já publica indicadores consolidados. Nosso papel é a curadoria, padronização, contextualização e cruzamento visual.
2. **Dados em JSON estático (< 20 KB cada):** As séries temporais são leves e servidas diretamente via CDN (Cloudflare ou GitHub Pages), garantindo carregamento instantâneo sem banco de dados.
3. **Regeneração visual própria (ECharts):** Com os pontos em mãos, temos 100% de liberdade para controlar cores, tema claro/escuro, zoom compartilhado e o comparador de 4 quadrantes.
