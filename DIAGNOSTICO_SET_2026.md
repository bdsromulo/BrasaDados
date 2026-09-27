# Diagnóstico de Status do Projeto (Setembro/2026)

Este documento foi gerado automaticamente após a restauração e análise do repositório no ambiente local.

## 1. Origem e Restauração
* A pasta local `brasadados` no PC atual estava inicialmente vazia, indicando que o projeto não havia sido transferido ou clonado após as edições feitas em outra máquina.
* O repositório oficial (`bdsromulo/BrasaDados`) foi localizado no GitHub e clonado com sucesso.
* As dependências (`npm install`) foram devidamente instaladas. O projeto já está operante localmente.

## 2. Fontes de Dados Mapeadas
A arquitetura do Brasa Dados baseia-se em consumir informações agregadas de diversas fontes públicas oficiais para construir visualizações interativas em React/ECharts. As fontes identificadas no código e na documentação (`PIPELINES.md`) são:
* **SGS / Banco Central do Brasil** (Indicadores econômicos como Selic, Câmbio e Dívida)
* **IBGE / SIDRA** (Desemprego, IPCA, PIB)
* **IpeaData** (Índice de Gini)
* **FBSP** (Segurança Pública, Violência)
* **INEP / MEC** (Educação, IDEB)
* **DataSUS** (Saúde e Vacinação)
* **INPE** (Desmatamento)
* **Banco Mundial / OWID** (Dados globais comparativos)

## 3. Status de Atualização dos Dados (Importante)
A base de código em si está super atualizada, com o último commit datado de **25 de Setembro de 2026** (adicionando o layout "Nike-style" e 6 novos indicadores estratégicos).

Porém, **os dados numéricos e as séries históricas dos gráficos estão parcialmente defasados**:
* Atualmente, os dados estão *chumbados* (hardcoded) no arquivo TypeScript `src/data/indicators.ts`.
* Verificando o campo `ultima_atualizacao`, percebe-se que os dados de economia vão até **Março de 2026**, enquanto alguns indicadores de saúde, segurança e educação pararam em **2024 ou 2025**.
* O projeto prevê a criação de scripts de automação (`scripts/sync_bcb.mjs`, etc.) para extrair esses dados de APIs JSON de forma contínua no GitHub Actions (como documentado em `PIPELINES.md`), mas a pasta `scripts` ainda não foi implementada e o processo de atualização continua manual.

### Próximos Passos Sugeridos:
1. Retomar a **Fase 2** das tarefas (`TAREFAS.md`), focando na criação dos scripts em Node.js ou Python para automatizar as requisições ao SIDRA (IBGE) e SGS (BCB).
2. Substituir as constantes estáticas de `indicators.ts` pelo consumo dos JSONs gerados na pasta `/public/data/indicators/`.
