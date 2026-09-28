# Entregas e pendências · Atlas Cívico

## Implementado

- [x] Logo SVG, tokens Atlas Cívico, fontes locais e dois temas.
- [x] Estado por cartão; adição unificada, preview de arraste, limite de quatro, substituição explícita, remoção/desfazer, maximização.
- [x] Padrão editorial por indicador, preferências independentes e restauração.
- [x] Períodos relativos, consulta única, tabela, CSV e PNG; mesclagem com regras e bloqueios explicados.
- [x] Exploração mobile por busca/categorias, detalhe, comparação por toque, até quatro cartões empilhados.
- [x] Links por hash com filtros, persistência e busca por acentos/sinônimos.
- [x] Catálogo separado, dados e ECharts sob demanda.
- [x] Inventário dos 32 indicadores originais; referência, publicação, coleta, status e natureza da fonte.
- [x] Importadores BCB/IBGE, manifestos reproduzíveis de transcrições, validação e preservação da última versão por indicador.
- [x] Primeiro lote de oito novos indicadores e correção da identificação da Selic Meta.
- [x] Testes de estado, filtros e importação, build e checks antes do deploy.

## Ainda necessário para encerrar integralmente o plano de dados

- [ ] Conferência numérica dos 13 indicadores legados ainda pendentes no inventário; seus valores continuam sinalizados como em revisão.
- [ ] Históricos anteriores de IDEB, água e esgoto com evidências oficiais; ampliar recortes estaduais onde faltam.
- [ ] Extratores específicos para novas edições de arquivos oficiais. O importador atual reproduz manifestos de transcrições revisadas, não interpreta PDFs/XLSX arbitrários.
- [ ] Medir em telefone físico e rede móvel real; a validação atual usa viewport responsivo e tamanho do build.
- [x] Workflow de publicação no GitHub Pages configurado para `main`, com testes e build obrigatórios. Conferir a URL final após cada atualização.

## Backlog de experiência e curadoria

### Prioridade alta · Painel como centro da navegação

- [x] Manter **Meu painel** visível ao selecionar áreas do Brasil, explorar indicadores e abrir detalhes em telas a partir de 768 px, com catálogo contextual, retorno pelo histórico e preservação de gráficos, período e rolagem. A estrutura admite conteúdo editorial de insights futuro, ainda sem publicá-lo.
- [x] Destacar o arraste no catálogo desktop com puxadores, instrução e posições vazias acionáveis na bancada; manter preview, cancelamento, inclusão por clique e alternativa por teclado.
- [ ] Validar com pessoas se a mecânica de arrastar é descoberta sem instrução prévia e exercitar o gesto em navegadores desktop reais.
- [x] Manter uma referência à comparação durante a consulta em telefone, com contador, nomes dos indicadores, adição por toque e retorno direto ao painel.

### Prioridade alta · Recomendações editoriais no painel vazio

- [x] Trocar os atalhos alfabéticos por **IPCA + Selic Meta**, **PIB + Desemprego** e **Inflação (IPCA)** individual, com inclusão do par em uma ação atômica e cartões independentes removíveis ou substituíveis.
- [x] Manter curadoria por identificadores explícitos, pergunta e contexto; exigir valores conferidos e períodos compatíveis. IPCA + Selic pode ser mesclado; PIB anual + desemprego trimestral fica lado a lado, sem inferência causal.
- [x] Conferir temas, tamanhos 360, 390, 768, 1024 e 1440 px, teclado, limite de quatro cartões e ausência de substituição implícita em testes e navegador responsivo.
- [ ] Concluir leitura com leitor de tela e teste em telefone físico; a verificação atual cobriu árvore de acessibilidade e viewport responsivo.

## Roteiro posterior aprovado

Inclusão digital, moradia, mobilidade, estrutura etária e cobertura municipal ampla. Novos indicadores exigem definição, fonte primária, código/tabela, referência, unidade, frequência, cobertura e transformação explícitos.

Consulte [VALIDACAO.md](docs/VALIDACAO.md) para os cenários efetivamente exercitados, sem confundir testes de código com revisão estatística das fontes.
