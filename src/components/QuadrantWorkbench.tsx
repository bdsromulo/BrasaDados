import { useState } from 'react';
import { Indicator, GridMode, ChartDisplayType, ViewScope } from '../types/indicator';
import { EChartCanvas } from './EChartCanvas';
import { FactCheckingDrawer } from './FactCheckingDrawer';
import { 
  X, 
  Maximize2, 
  Plus, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  ExternalLink,
  PlusCircle,
  Columns2,
  Sparkles
} from 'lucide-react';

interface QuadrantWorkbenchProps {
  gridMode: GridMode;
  slots: (Indicator | null)[];
  onUpdateSlot: (index: number, indicator: Indicator | null) => void;
  availableIndicators?: Indicator[];
  timeRange: [number, number];
  isMerged: boolean;
  onSetGridMode: (mode: GridMode) => void;
  chartDisplayType: ChartDisplayType;
  onOpenPickerModal: (slotIndex?: number) => void;
  onDropIndicator: (indicatorId: string, targetSlotIndex?: number) => void;
}

export function QuadrantWorkbench({
  gridMode,
  slots,
  onUpdateSlot,
  timeRange,
  isMerged,
  onSetGridMode,
  chartDisplayType,
  onOpenPickerModal,
  onDropIndicator
}: QuadrantWorkbenchProps) {
  const [activeSlotForDetails, setActiveSlotForDetails] = useState<number>(0);
  const [slotScopes, setSlotScopes] = useState<Record<number, ViewScope>>({});
  const [isDragOverCanvas, setIsDragOverCanvas] = useState<boolean>(false);
  const [dragOverSlotIndex, setDragOverSlotIndex] = useState<number | null>(null);

  // Determinar quantos slots estão visíveis de acordo com o gridMode
  const visibleSlotsCount = gridMode === '1' ? 1 : gridMode === '2' ? 2 : 4;
  const activeSlots = slots.slice(0, visibleSlotsCount);
  const occupiedIndicators = activeSlots.filter((item): item is Indicator => item !== null);
  const totalOccupied = slots.filter((item): item is Indicator => item !== null);

  // Indicador selecionado para exibição das notas de fact-checking
  const currentDetailedIndicator = slots[activeSlotForDetails] || occupiedIndicators[0] || null;

  // Cálculo de KPIs rápidos para o cartão do indicador
  function getIndicatorKPIs(indicator: Indicator) {
    const primarySeries = indicator.visualizacao.series[0];
    if (!primarySeries || !primarySeries.dados.length) return null;

    const dadosFiltrados = primarySeries.dados.filter(([ano]) => {
      const numAno = typeof ano === 'number' ? ano : parseInt(String(ano));
      return numAno >= timeRange[0] && numAno <= timeRange[1];
    });

    if (!dadosFiltrados.length) return null;

    const ultimo = dadosFiltrados[dadosFiltrados.length - 1];
    const penultimo = dadosFiltrados.length > 1 ? dadosFiltrados[dadosFiltrados.length - 2] : null;

    let delta: { valor: number; texto: string; direcao: 'up' | 'down' | 'neutral' } | null = null;
    if (penultimo) {
      const diff = ultimo[1] - penultimo[1];
      const diffFormatted = diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2);
      delta = {
        valor: diff,
        texto: `${diffFormatted} ${indicator.visualizacao.eixo_y.unidade === '%' ? 'p.p.' : ''}`,
        direcao: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral'
      };
    }

    let minVal = dadosFiltrados[0];
    let maxVal = dadosFiltrados[0];

    dadosFiltrados.forEach((item) => {
      if (item[1] < minVal[1]) minVal = item;
      if (item[1] > maxVal[1]) maxVal = item;
    });

    return {
      ultimo: { ano: ultimo[0], valor: ultimo[1] },
      delta,
      min: { ano: minVal[0], valor: minVal[1] },
      max: { ano: maxVal[0], valor: maxVal[1] },
      unidade: indicator.visualizacao.eixo_y.unidade
    };
  }

  // Exportar dados do indicador em formato CSV
  function downloadCSV(indicator: Indicator) {
    const seriesList = indicator.visualizacao.series;
    if (!seriesList.length) return;

    const allYearsSet = new Set<string | number>();
    seriesList.forEach(s => s.dados.forEach(([ano]) => allYearsSet.add(ano)));
    const sortedYears = Array.from(allYearsSet).sort((a, b) => Number(a) - Number(b));

    const headers = ['Ano', ...seriesList.map(s => `"${s.nome} (${indicator.visualizacao.eixo_y.unidade})"` )];
    const rows = sortedYears.map(ano => {
      const rowValues = [ano];
      seriesList.forEach(s => {
        const found = s.dados.find(([a]) => a === ano);
        rowValues.push(found ? found[1] : '');
      });
      return rowValues.join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${indicator.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleDropOnSlot(e: React.DragEvent, slotIndex: number) {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSlotIndex(null);
    setIsDragOverCanvas(false);
    try {
      const raw = e.dataTransfer.getData('application/json');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.indicatorId) {
          onDropIndicator(parsed.indicatorId, slotIndex);
          return;
        }
      }
      const plainId = e.dataTransfer.getData('text/plain');
      if (plainId) {
        onDropIndicator(plainId, slotIndex);
      }
    } catch (err) {
      console.error('Falha ao processar drop:', err);
    }
  }

  function handleDropOnCanvas(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOverCanvas(false);
    try {
      const raw = e.dataTransfer.getData('application/json');
      let indId = '';
      if (raw) {
        const parsed = JSON.parse(raw);
        indId = parsed.indicatorId;
      }
      if (!indId) {
        indId = e.dataTransfer.getData('text/plain');
      }
      if (indId) {
        onDropIndicator(indId);
      }
    } catch (err) {
      console.error('Falha ao processar drop no canvas:', err);
    }
  }

  return (
    <div 
      className={`flex-1 flex flex-col p-4 overflow-y-auto space-y-4 transition-all ${
        isDragOverCanvas ? 'ring-2 ring-emerald-500/40 bg-emerald-50/10 dark:bg-emerald-950/10' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOverCanvas(true);
      }}
      onDragLeave={(e) => {
        // Se saiu da janela/canvas
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragOverCanvas(false);
        }
      }}
      onDrop={handleDropOnCanvas}
    >
      {/* 1. TELA VAZIA INICIAL (Nenhum gráfico adicionado ainda) */}
      {totalOccupied.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[460px] rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-8 text-center transition-all">
          <div className="relative mb-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#04382c] border border-emerald-800/80 text-white shadow-xl select-none">
              <span className="font-nike text-4xl tracking-tighter text-white">
                BD
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenPickerModal(0)}
              className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer transition-transform hover:scale-110"
              title="Adicionar primeiro gráfico"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
            Seu Painel de Visualização está Vazio
          </h2>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 max-w-lg leading-relaxed">
            Comece adicionando seu primeiro indicador social ou econômico oficial do Brasil. 
            Você pode cruzar séries temporais lado a lado ou em até 4 quadrantes simultâneos.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenPickerModal(0)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer hover:shadow-lg hover:scale-105"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Adicionar Primeiro Gráfico</span>
            </button>

            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">ou</span>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-xs text-zinc-600 dark:text-zinc-300">
              <span>👉 Arraste qualquer indicador da barra lateral para cá</span>
            </div>
          </div>
        </div>
      ) : isMerged && occupiedIndicators.length > 0 ? (
        /* MODO MESCLADO (Gráfico Unificado Comparativo) */
        <div className="flex flex-col rounded-2xl border border-amber-300 bg-white p-4 shadow-sm dark:border-amber-800/80 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  <Sparkles className="h-3.5 w-3.5" /> Comparativo Mesclado (Eixo Duplo Inteligente)
                </span>
                <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
                  {occupiedIndicators.length} indicadores cruzados
                </span>
              </div>
              <h2 className="font-extrabold text-base text-zinc-950 dark:text-zinc-50 mt-1">
                {occupiedIndicators.map(i => i.titulo.split('—')[0].trim()).join(' vs. ')}
              </h2>
            </div>
            
            <button
              type="button"
              onClick={() => onSetGridMode('4')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
            >
              Voltar para visão em quadrantes separada
            </button>
          </div>

          <div className="h-[380px] sm:h-[440px] w-full pt-2">
            <EChartCanvas
              mergedIndicators={occupiedIndicators}
              timeRange={timeRange}
              displayType={chartDisplayType}
              height="100%"
            />
          </div>
        </div>
      ) : (
        /* MODO EM GRADE (1 TELA, 2 TELAS OU 4 QUADRANTES) */
        <div
          className={`grid gap-4 ${
            gridMode === '1'
              ? 'grid-cols-1'
              : gridMode === '2'
              ? 'grid-cols-1 lg:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {activeSlots.map((slotIndicator, index) => {
            const isDetailed = activeSlotForDetails === index;
            const kpi = slotIndicator ? getIndicatorKPIs(slotIndicator) : null;
            const isSlotDragOver = dragOverSlotIndex === index;

            return (
              <div
                key={index}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverSlotIndex(index);
                }}
                onDragLeave={() => {
                  setDragOverSlotIndex(null);
                }}
                onDrop={(e) => handleDropOnSlot(e, index)}
                className={`flex flex-col rounded-2xl border p-4 shadow-sm transition-all duration-200 ${
                  isSlotDragOver
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/30 ring-2 ring-emerald-500/40'
                    : slotIndicator
                    ? isDetailed
                      ? 'border-emerald-500 bg-white dark:bg-zinc-900 ring-2 ring-emerald-500/20'
                      : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                    : 'border-dashed border-zinc-300 bg-zinc-50/70 dark:border-zinc-700 dark:bg-zinc-900/50'
                }`}
                onClick={() => {
                  if (slotIndicator) setActiveSlotForDetails(index);
                }}
              >
                {slotIndicator ? (
                  <>
                    {/* Cabeçalho do Quadrante */}
                    <div className="flex items-start justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800 gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 font-mono">
                            Q{index + 1}
                          </span>
                          <h3 className="truncate font-extrabold text-sm text-zinc-950 dark:text-zinc-50">
                            {slotIndicator.titulo}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <a
                            href={slotIndicator.fonte.url_oficial}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={`Acessar fonte bruta/oficial: ${slotIndicator.fonte.rotulo_link}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 hover:underline cursor-pointer"
                          >
                            <span>{slotIndicator.fonte.orgao.split('/')[0]}</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                          <span className="text-zinc-300 dark:text-zinc-700">•</span>
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700">
                            {slotIndicator.fonte.tipo_recurso === 'api' ? '⚡ API' :
                             slotIndicator.fonte.tipo_recurso === 'dados_abertos' ? '📂 Dados Abertos' :
                             slotIndicator.fonte.tipo_recurso === 'painel' ? '📊 Painel' :
                             slotIndicator.fonte.tipo_recurso === 'serie_temporal' ? '📈 Série' : '📄 Relatório'}
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-700">•</span>
                          <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                            {slotIndicator.detalhamento_tecnico.unidade_medida}
                          </span>
                        </div>
                      </div>

                      {/* Botões de Ação do Quadrante */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Seletor Brasil vs Ranking UF */}
                        {slotIndicator.visualizacao.dados_uf && slotIndicator.visualizacao.dados_uf.length > 0 && (
                          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-800 shadow-2xs mr-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSlotScopes(prev => ({ ...prev, [index]: 'nacional' }));
                              }}
                              title="Série temporal histórica do Brasil"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                                (slotScopes[index] || 'nacional') === 'nacional'
                                  ? 'bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white'
                                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
                              }`}
                            >
                              🇧🇷 Brasil
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSlotScopes(prev => ({ ...prev, [index]: 'estados' }));
                              }}
                              title="Ranking comparativo entre os estados brasileiros"
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                                slotScopes[index] === 'estados'
                                  ? 'bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white'
                                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
                              }`}
                            >
                              🗺️ Ranking UF ({slotIndicator.visualizacao.dados_uf.length})
                            </button>
                          </div>
                        )}

                        {/* Botão de Acesso Direto à Fonte Bruta/Oficial */}
                        <a
                          href={slotIndicator.fonte.url_oficial}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={`Acessar fonte oficial (${slotIndicator.fonte.rotulo_link}) em nova aba`}
                          className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-100/60 dark:text-emerald-400 dark:hover:bg-emerald-950/60 cursor-pointer transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadCSV(slotIndicator);
                          }}
                          title="Baixar dados em planilha CSV"
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>

                        {gridMode !== '1' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateSlot(0, slotIndicator);
                              onSetGridMode('1');
                            }}
                            title="Expandir para tela cheia (1 Tela)"
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                          >
                            <Maximize2 className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateSlot(index, null);
                          }}
                          title="Remover deste quadrante"
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/40 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Faixa de KPIs Rápidos */}
                    {kpi && (
                      <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-zinc-700 dark:text-zinc-300">
                        <div className="flex items-center gap-1 font-bold text-zinc-950 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Último ({kpi.ultimo.ano}):</span>
                          <span>{kpi.ultimo.valor} {kpi.unidade}</span>
                        </div>

                        {kpi.delta && (
                          <div className={`flex items-center gap-0.5 font-bold ${
                            kpi.delta.direcao === 'up' ? 'text-emerald-700 dark:text-emerald-400' :
                            kpi.delta.direcao === 'down' ? 'text-amber-700 dark:text-amber-400' :
                            'text-zinc-500'
                          }`}>
                            {kpi.delta.direcao === 'up' && <ArrowUpRight className="h-3.5 w-3.5" />}
                            {kpi.delta.direcao === 'down' && <ArrowDownRight className="h-3.5 w-3.5" />}
                            {kpi.delta.direcao === 'neutral' && <Minus className="h-3.5 w-3.5" />}
                            <span>{kpi.delta.texto}</span>
                          </div>
                        )}

                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold hidden sm:flex items-center gap-2 ml-auto">
                          <span>Mín: {kpi.min.valor} ({kpi.min.ano})</span>
                          <span>•</span>
                          <span>Máx: {kpi.max.valor} ({kpi.max.ano})</span>
                        </div>
                      </div>
                    )}

                    {/* Gráfico Canvas */}
                    <div
                      className={`w-full pt-1 ${
                        gridMode === '1'
                          ? (slotScopes[index] === 'estados' ? 'h-[460px] sm:h-[520px]' : 'h-[360px] sm:h-[400px]')
                          : (slotScopes[index] === 'estados' ? 'h-[320px] sm:h-[380px]' : 'h-[230px] sm:h-[260px]')
                      }`}
                    >
                      <EChartCanvas
                        indicator={slotIndicator}
                        timeRange={timeRange}
                        displayType={chartDisplayType}
                        viewScope={slotScopes[index] || 'nacional'}
                        height="100%"
                      />
                    </div>
                  </>
                ) : (
                  /* SLOT VAZIO / ÁREA PARA ARRASTAR OU CLICAR */
                  <div className="flex flex-1 min-h-[260px] flex-col items-center justify-center p-6 text-center">
                    <button
                      type="button"
                      onClick={() => onOpenPickerModal(index)}
                      className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-200/80 hover:bg-emerald-600 hover:text-white text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-emerald-500 dark:hover:text-white transition-all cursor-pointer shadow-xs hover:scale-105"
                      title="Adicionar indicador neste quadrante"
                    >
                      <Plus className="h-7 w-7" />
                    </button>
                    <span className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">
                      Quadrante {index + 1} Disponível
                    </span>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[240px]">
                      Clique no botão acima ou arraste um indicador da barra lateral para cá.
                    </p>

                    <button
                      type="button"
                      onClick={() => onOpenPickerModal(index)}
                      className="mt-4 px-3.5 py-1.5 rounded-xl border border-zinc-300 bg-white hover:border-emerald-500 hover:text-emerald-700 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all cursor-pointer shadow-2xs"
                    >
                      Selecionar Indicador
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. DICA VISUAL PARA ARRASTAR SEGUNDO GRÁFICO (quando há 1 gráfico e está em modo 1 Tela) */}
      {occupiedIndicators.length === 1 && gridMode === '1' && (
        <div 
          onClick={() => {
            onSetGridMode('2');
            onOpenPickerModal(1);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOverSlotIndex(1);
          }}
          onDragLeave={() => setDragOverSlotIndex(null)}
          onDrop={(e) => handleDropOnSlot(e, 1)}
          className={`flex items-center justify-between p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
            dragOverSlotIndex === 1
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/40'
              : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              <Columns2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-zinc-950 dark:text-zinc-100">
                Quer comparar lado a lado?
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Arraste um segundo indicador aqui ou clique para abrir 2 Telas lado a lado.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-200/80 hover:bg-emerald-600 hover:text-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all">
            <Plus className="h-4 w-4" />
            <span>Adicionar 2º Gráfico</span>
          </div>
        </div>
      )}

      {/* 3. Painel Inferior de Fact-Checking & Visão Cidadã */}
      {currentDetailedIndicator && (
        <div className="pt-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Contexto & Auditoria Metodológica: {currentDetailedIndicator.titulo}
            </span>
          </div>
          <FactCheckingDrawer indicator={currentDetailedIndicator} />
        </div>
      )}
    </div>
  );
}
