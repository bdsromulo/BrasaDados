# Importação e atualização de dados

## Comandos implementados

```sh
npm run data:sync
npm run data:sync -- --id=economia-taxa-selic
npm run data:import
node scripts/import-reviewed.mjs caminho/manifesto.json
npm run validate:data
npm run data:audit
npm test
npm run build
```

`scripts/migrate-legacy.mjs` é uma migração única do acervo anterior. Não sobrescreve indicadores já existentes. Não deve ser usado para atualização periódica.

## Fontes automatizadas

| Indicador | Código | Frequência exibida / transformação |
| --- | --- | --- |
| Selic Meta | BCB SGS 432 | Último valor diário publicado no mês, % a.a. |
| Dólar comercial de venda | BCB SGS 1 | Média aritmética mensal dos dias publicados, R$/US$ |
| Dívida bruta do governo geral | BCB SGS 13762 | Última observação mensal, % do PIB |
| Desocupação | IBGE 4099 / variável 4099 | Trimestres civis; Brasil e UFs |
| IPCA acumulado em 12 meses | IBGE 1737 / 2265 | Mensal; Brasil |
| Crescimento real do PIB | IBGE 6784 / 9810 | Contas Nacionais Anuais consolidadas |
| Gini | IBGE 7435 / 10681 | Anual; Brasil e UFs |
| Rendimento domiciliar per capita real | IBGE 7533 / 10816 | Anual; preços médios do último ano da fonte |
| Informalidade | IBGE 4093 / 12466 | Trimestral; Brasil e UFs |
| Insegurança alimentar | IBGE 9552 / 9784 | Anual; total, leve, moderada e grave; UFs no total |
| Analfabetismo, 15 anos ou mais | IBGE 7113 / 10267 | Anual; lacunas em 2020 e 2021 preservadas |
| População estimada | IBGE 6579 / 9324 | Anual; pessoas; estimativas, não Censo |
| Gasto corrente total em saúde | Banco Mundial / OMS SH.XPD.CHEX.GD.ZS | Anual; público e privado, % do PIB |
| Índice de percepção da corrupção | Transparência Internacional / perfil do Brasil | Anual; pontuação 0–100 desde 2012 |
| Focos ativos de fogo | INPE Programa Queimadas / `brasil.json` | Anual; soma por estado/bioma, apenas anos completos desde 2013 |

Classificações estão explícitas em `scripts/sources.mjs`. A tabela 9552 usa o percentual de domicílios por situação de segurança alimentar; não a distribuição interna de um subgrupo. SGS 432 é Meta Selic, não Selic acumulada mensal. SGS 1 é dólar de venda, não de compra. A tabela 6784 é anual, não trimestral.

O BCB é consultado em janelas de até nove anos. O IBGE é consultado para todos os períodos disponíveis. Reimportar toda a série captura revisões históricas e, no rendimento real, mantém uma única base de preços. Não há interpolação. O mês em andamento é sinalizado como potencialmente incompleto.

## Arquivos e divulgações oficiais

`scripts/curated-sources.mjs` é o manifesto versionado de transcrições conferidas: pobreza (SIS 2025), IDEB (divulgação INEP 2025), saneamento (SINISA 2024, referência 2023), esperança de vida (TCMB 2024), violência (FBSP 2026), matriz elétrica (BEN 2026) e desmatamento (PRODES). O importador também aceita uma lista JSON no mesmo esquema, para reproduzir uma edição revisada.

`scripts/parse-life-table.py` extrai a Tabela 1 do PDF TCMB 2024 arquivado em `data/official-files/`, validando edição, estrutura, número de linhas e cobertura. Requer Python com `pypdf`. Execute `python scripts/parse-life-table.py data/official-files/tcmb_2024.pdf`; o JSON resultante é comparado com os dados publicados nos testes. Os PDFs usados na revisão são preservados com hashes no inventário da pasta.

`scripts/parse-fbsp.py` extrai a série nacional de MVI (página 30), o ranking das 27 UFs (página 28) e os feminicídios (página 159) do Anuário 2026 arquivado. `scripts/parse-ben.py` extrai apenas as barras comparáveis da oferta interna elétrica de 2023–2025 do BEN 2026 (página 35), excluindo a geração centralizada. Ambos exigem `pypdf`, verificam a edição/estrutura e geram JSONs versionados em `data/official-files/`. Os testes comparam esses JSONs com os indicadores publicados e verificam os hashes dos PDFs no manifesto.

O importador do Banco Mundial confere país, indicador, paginação e status das observações. Mantém lacunas internas e exclui somente anos vazios fora da cobertura publicada. A data de atualização geral do WDI é registrada como tal, sem confundi-la com a referência ou a publicação de cada observação.

O importador da Transparência Internacional lê a série de pontuação publicada na página do Brasil, registra a resposta original e valida anos e valores antes de substituir o conjunto anterior. O índice mede percepção; não é uma contagem de casos de corrupção.

O importador do INPE valida os 12 meses de cada recorte, reconcilia a soma com `total_focos`, exige 27 UFs por ano e cruza os códigos de estado com o cadastro do IBGE. Exclui 2012, ano de troca do satélite de referência, e o ano ainda incompleto. Preserva a resposta original, inclusive os biomas, para reprodução e revisão histórica.

Essas transcrições não são um robô que baixa futuras edições nem um parser universal de PDFs/XLSX. Uma nova edição exige conferir a tabela, atualizar o manifesto e suas notas de origem. Evidências guardam fonte, posição na publicação, referência, séries e hash do manifesto. Nos importadores de API, o hash é da resposta bruta; não confundir os dois.

## Garantias e publicação

- Uma resposta vazia, HTTP inválido, valor não numérico, período inválido/duplicado ou metadado obrigatório ausente interrompe a atualização daquele indicador.
- A escrita do JSON validado é atômica. Falhas preservam o arquivo anterior daquele indicador.
- A sincronização registra sucesso/falha e horário por indicador em `data/sync-report.json`, mantém resultados anteriores dos IDs não consultados e retorna erro se qualquer job falhar.
- Uma execução local pode atualizar alguns indicadores antes de outro falhar. O lote **não deve ser publicado** quando o comando retorna erro; o último site publicado continua intacto.
- O workflow `refresh-data.yml`, acionado manualmente, só disponibiliza o artefato de atualização se sincronização, importação, testes e build passarem. Em falha, publica apenas o relatório de diagnóstico. Não faz commit nem deploy automático.
- O workflow de Pages valida testes e dados antes de disponibilizar `dist`. Nenhuma atualização remota foi acionada nesta implementação.

Agendamento, abertura automática de PRs e revisão humana de novas edições podem ser adicionados quando houver uma rotina editorial definida.
