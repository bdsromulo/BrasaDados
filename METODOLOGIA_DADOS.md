# Metodologia e confiabilidade

## O que foi conferido

O acervo original de 32 indicadores foi inventariado. A implementação acrescentou oito indicadores, chegando a 40. Há 27 com valores reimportados ou transcritos de publicações identificadas e 13 legados aguardando conferência numérica. O [inventário](docs/AUDITORIA.md) detalha fontes, unidades, frequências, cobertura e pendências; `public/data/legacy-audit.json` preserva os achados iniciais.

“Extração conferida” significa que o conjunto exibido foi obtido de uma fonte identificada, com transformação registrada. Não garante que a própria fonte nunca revisará o dado. “Em revisão” significa que o acervo anterior não tinha evidência suficiente para confirmar seus valores e agregações. Avisos são visíveis na consulta e no CSV/PNG; essas séries não entram na mesclagem.

## Datas e natureza do dado

- **Referência:** período medido pela observação; em ranking, um recorte comum explícito.
- **Publicação:** data da divulgação, quando documentada. Não é inferida da coleta.
- **Coleta:** data em que o importador consultou a fonte ou a transcrição foi conferida.
- **Situação:** publicado pela fonte, provisório, estimativa ou não documentada. “Publicado pela fonte” não é sinônimo de definitivo.

O acervo não ganha uma data de atualização artificial só por passar pelo build. Metadados de publicação ausentes são mostrados como não informados.

## Consulta e cobertura

Cinco e dez anos são janelas de anos-calendário encerradas no ano mais recente dos dados selecionados. “Série completa” remove esse corte. Séries com diferentes frequências mantêm suas datas exatas na tabela; um valor anual não é repetido em todos os meses. Ausências são `null`, aparecem como “Sem dado”, geram célula vazia no CSV e interrompem linhas.

Rankings só aparecem quando há referência documentada. A nova importação de UFs usa o último período da série nacional e conserva ausências naquele período, em vez de buscar silenciosamente o último dado de cada UF. Os rankings legados sem ano conhecido ficam indisponíveis. Contagem de cobertura e limitações acompanham o indicador.

Linhas são o padrão para séries de evolução; colunas para fluxos/variações discretas e retratos de categorias; UFs usam barras horizontais. Curvas e área são escolhas secundárias. Alterações manuais são locais ao cartão.

## Limitações relevantes

- PIB usa Contas Nacionais Anuais consolidadas, com referência 2023. Não foi emendado a estimativas trimestrais mais recentes.
- IDEB usa apenas os anos 2023 e 2025 conferidos na divulgação, total e rede pública. Histórico e UFs anteriores não foram certificados por reaproveitamento do acervo.
- Água, coleta e tratamento de esgoto usam SINISA 2024, referência 2023. Há apenas um retrato nacional nessa edição importada; não é uma série histórica ampliada.
- População usa estimativas anuais do IBGE, em pessoas, sem misturar dados do Censo ou preencher 2022–2023. Esperança de vida usa anos selecionados das tábuas de 2024; lacunas do histórico permanecem visíveis.
- PRODES usa o ano de monitoramento agosto–julho e a Amazônia Legal. O valor consolidado de 2025 substitui a estimativa inicial; o ranking estadual conserva referência explícita em 2024. Recortes territoriais diferentes bloqueiam a mesclagem.
- Mortes violentas intencionais e feminicídios seguem a edição 2026 do FBSP, incluindo as revisões históricas publicadas nessa edição. A taxa de MVI tem ranking das 27 UFs em 2025; a contagem de feminicídios não recebeu ranking nesta transcrição.
- O Índice de Percepção da Corrupção usa a série de pontuação 2012–2025 na página da Transparência Internacional para o Brasil. Pontuação e posição no ranking são medidas diferentes.
- A matriz elétrica renovável usa a oferta interna de eletricidade no BEN 2026. O gráfico da fonte também exibe geração centralizada com outro universo; essa barra não foi misturada à série. O relatório revisa o valor de 2023 para 89,2%.
- Focos ativos de fogo usam somente o satélite de referência do INPE, com anos completos desde 2013. A série antiga agregava valores sem evidência de comparabilidade e foi substituída. O dado é contagem de detecções, não de incêndios nem de área queimada; o ranking soma os biomas de cada UF em 2025.
- Gasto corrente em saúde é o total público e privado, com fonte OMS/Banco Mundial. O identificador antigo foi preservado para os links, mas não significa gasto exclusivo do governo. A série termina no último ano com valor publicado, sem preencher anos recentes ausentes.
- Os dois percentuais de tratamento de esgoto têm denominadores distintos (água consumida e esgoto coletado). Não devem ser somados ou tomados como medidas idênticas.
- Pobreza usa as linhas US$ 6,85 e US$ 2,15 em PPC 2017 da SIS 2025. Não combina outras linhas/PPC.
- Insegurança alimentar reúne a PNAD Contínua 2023–2024; não une automaticamente PNAD e POF anteriores.
- O rendimento real muda de base de preços quando a fonte atualiza a edição. A série inteira precisa ser reimportada.
- Fontes governamentais, organismos internacionais e sociedade civil são identificados separadamente. FBSP, SEEG e Transparência Internacional não são órgãos governamentais.

O roteiro posterior inclui completar a conferência dos 13 legados, recuperar históricos oficiais de IDEB/saneamento, ampliar UFs e, depois, inclusão digital, moradia, mobilidade, estrutura etária e cobertura municipal. O indicador prisional permanece em revisão: os relatórios SISDEPEN separam celas estaduais, sistema federal e outras prisões, e esses universos precisam ser conciliados antes de formar uma série nacional única.
