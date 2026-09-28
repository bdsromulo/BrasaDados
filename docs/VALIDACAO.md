# Validação · 27/09/2026

## Automatizada

`npm test`: **32 testes aprovados**. Cobertura:

- Quinta inclusão não substitui; cancelar conserva os quatro cartões.
- Duplicatas ativam o cartão existente, mantendo recorte e preferência.
- Remover reorganiza; desfazer restaura seleção/foco; substituir restaura a configuração anterior ao desfazer.
- IDs continuam únicos após substituir e adicionar novamente; desfazer antigo não apaga novas adições.
- Maximizar/mesclar/separar preserva cartões e preferências independentes.
- Links e persistência sanitizam payload inválido, IDs desconhecidos e tipos não permitidos.
- Links de indicador preservam período, recorte e estilo; inclusão a partir do detalhe leva suas preferências.
- Janelas de cinco/dez anos, séries completas, períodos vazios, lacunas mensais/trimestrais e ausência de UFs.
- Mesclagem bloqueada por recorte, confiança, frequência, mais de duas unidades ou ausência de períodos comuns dentro do filtro.
- CSV mantém números do resultado filtrado, datas, ausência, fonte e situação de conferência; precisão de Gini/câmbio preservada.
- Validação de calendário, ordem, duplicatas, valores inválidos, séries vazias e referência de ranking.
- Agregações BCB de último valor/média mensal e parsing IBGE com ausência.
- Falha de validação preserva último arquivo; revisão histórica substitui atomicamente.
- As quinze séries importadas por API são reproduzidas das respostas arquivadas; hashes e valores correspondem aos JSONs publicados.
- A série do INPE reconcilia os totais mensais, descarta anos parciais e mantém 27 UFs; 2024 e 2025 foram cruzados com relatório oficial do MCTI.
- Séries extraídas do Anuário FBSP 2026 e do BEN 2026 correspondem aos JSONs publicados; hashes dos PDFs oficiais arquivados são conferidos.

`npm run build`: **aprovado**, incluindo TypeScript e validação dos 40 arquivos de dados e seus resumos no catálogo. O Vite avisa que o módulo gráfico diferido tem cerca de 510 KB sem compressão; não é carregado para apenas explorar o catálogo.

`npm run data:import`: reexecutado com sucesso para os doze indicadores de transcrição. A sincronização registrou sucesso nos quinze importadores de API; o caso de insegurança alimentar foi corrigido para tabela 9552 e reimportado. Relatório e evidências ficam em `data/`.

## Navegador

Inspeção com navegador integrado e viewport responsivo, em desenvolvimento e no preview do build de produção:

| Largura | Tema claro | Tema escuro | Resultado de geometria na bancada e no detalhe |
| --- | --- | --- | --- |
| 360 px | Verificado | Verificado | Sem transbordamento horizontal nem controles fora da largura |
| 390 px | Verificado | Verificado | Sem transbordamento horizontal nem controles fora da largura |
| 768 px | Verificado | Verificado | Catálogo recolhido, controles dentro da largura |
| 1024 px | Verificado | Verificado | Lateral desktop, controles dentro da largura |
| 1440 px | Verificado | Verificado | Gráficos lado a lado, controles dentro da largura |

Fluxos exercitados: adicionar por botão; arrastar um terceiro gráfico mantendo os dois anteriores; quinta inclusão e cancelamento; remover/desfazer; substituir via seletor/desfazer; maximizar e voltar; mesclar/separar; tabela comparativa com “Sem dado”; busca por “inflação”; link de detalhe com cinco anos/colunas; reabertura de comparação compartilhada; persistência de bancada e tema após reload. Os logs consultados não apresentaram erros de execução.

Teclado: Tab entra na busca do modal, o foco permanece no diálogo nativo e Escape fecha e retorna ao botão de origem. A tabela é HTML navegável, não depende do canvas. A consulta mobile foi operada por botões; não foi feito teste em aparelho físico ou leitor de tela real.

No preview de produção, o detalhe da matriz elétrica mostrou 86,8% em 2025 e variação de −1,4 p.p. ante 2024. A aba Tabela apresentou 89,2%, 88,2% e 86,8% para 2023–2025; em 360 px a página manteve largura de rolagem de 345 px, sem transbordamento horizontal.

O novo detalhe de focos ativos abriu com **Colunas** selecionado. Ao mudar para o ranking de 2025, passou a **Barras** horizontais e informou 27/27 UFs com dado; a tabela mostrou os valores estaduais com a mesma referência.

O acionamento de CSV foi exercitado, mas o navegador integrado não devolveu o evento/arquivo de download dentro do tempo disponível. O conteúdo CSV é validado em testes unitários. A exportação PNG abre uma prévia com identificação, período, fonte e situação da série; a imagem resultante foi inspecionada visualmente no tema escuro. A gravação final de CSV em um navegador externo ainda precisa de conferência manual.

O preview transitório de arraste e seu cancelamento foram implementados sem alterar o reducer; a ferramenta de UI executa o gesto completo e não capturou a etapa intermediária. A inclusão por arraste foi confirmada pelo terceiro cartão presente.

## Carregamento

Medição reproduzível: `node scripts/measure-build.mjs`, após o build. Valores gzip locais:

| Artefato | Tamanho |
| --- | ---: |
| JavaScript inicial | 87,3 KB |
| ECharts + componente, sob demanda | 171,8 KB |
| CSS | 6,8 KB |
| Catálogo | 5,7 KB |

O bundle anterior tinha aproximadamente 462 KB gzip no JavaScript inicial. A redução inicial é de cerca de 81%; isso não significa uma melhoria medida de 81% em tempo de carregamento. Inter e Outfit latinas somam aproximadamente 80,6 KB em WOFF2, hospedadas localmente. Dados por indicador são requisitados conforme a seleção e gráficos fora da tela são adiados. Não foi medida latência móvel, LCP/INP em dispositivo físico ou desempenho do domínio publicado.

## Capturas e pendências

- [Desktop claro](screenshots/atlas-desktop.png)
- [Desktop escuro](screenshots/atlas-desktop-dark.png)
- [Detalhe mobile](screenshots/atlas-mobile.png)
- [Prévia de PNG exportável](screenshots/atlas-export-dark.png)

Comparação com a direção Atlas Cívico: módulos geométricos do logo, tipografia Outfit/Inter, lateral navy, fundo claro, ação lima, cartões com bordas suaves e séries cobalto/teal. Não foram adicionadas contas ou notificações.

Os testes desta página foram realizados localmente antes da publicação. A auditoria numérica dos 13 indicadores legados, históricos oficiais ainda curtos e medições em telefone físico estão explicitados em [TAREFAS.md](../TAREFAS.md).

## Evolução do painel e recomendações editoriais

Na atualização seguinte, o painel passou a permanecer montado nas rotas de exploração e detalhe a partir de 768 px. No navegador local, a seleção de **Economia** abriu o catálogo à direita preservando dois gráficos e o período do painel; o link direto de detalhe também manteve os cartões. Alterar o período do detalhe de 10 para 5 anos não alterou o período da bancada. Escape fechou a exploração e devolveu o foco ao botão de origem; Voltar reabriu a rota contextual.

As recomendações foram testadas com os dados reais: IPCA + Selic Meta adicionou dois cartões e deixou **Mesclar séries** disponível; PIB + Desemprego adicionou dois cartões e mostrou o bloqueio por frequências diferentes. A adição em grupo é atômica, inclusive quando faltam posições. `npm test` passou com 36 testes. O build validou 40 indicadores, dos quais 27 conferidos na fonte.

Foram inspecionados 360, 390, 768, 1024 e 1440 px nos dois temas, sem transbordamento horizontal. Em 360/390 px o acesso persistente ao painel mostra a quantidade e os nomes dos indicadores; em 768/1024 px painel e detalhe cabem lado a lado em uma coluna de gráficos. A simulação automatizada do gesto de arrastar nesta rodada não confirmou o drop, por isso a conferência manual do gesto em navegadores desktop reais permanece pendente, assim como leitor de tela e telefone físico.
