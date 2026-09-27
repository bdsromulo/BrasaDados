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

## Roteiro posterior aprovado

Inclusão digital, moradia, mobilidade, estrutura etária e cobertura municipal ampla. Novos indicadores exigem definição, fonte primária, código/tabela, referência, unidade, frequência, cobertura e transformação explícitos.

Consulte [VALIDACAO.md](docs/VALIDACAO.md) para os cenários efetivamente exercitados, sem confundir testes de código com revisão estatística das fontes.
