import { useState } from 'react';
import { Indicator, GridMode, ChartDisplayType } from '../types/indicator';
import { EChartCanvas } from './EChartCanvas';
import { FactCheckingDrawer } from './FactCheckingDrawer';
import { X, Maximize2, Plus } from 'lucide-react';

interface QuadrantWorkbenchProps {
  gridMode: GridMode;
  slots: (Indicator | null)[];
  onUpdateSlot: (index: number, indicator: Indicator | null) => void;
  availableIndicators: Indicator[];
  timeRange: [number, number];
  isMerged: boolean;
  onSetGridMode: (mode: GridMode) => void;
  chartDisplayType: ChartDisplayType;
}

export function QuadrantWorkbench({
  gridMode,
  slots,
  onUpdateSlot,
  availableIndicators,
  timeRange,
  isMerged,
  onSetGridMode,
  chartDisplayType
}: QuadrantWorkbenchProps) {
  const [activeSlotForDetails, setActiveSlotForDetails] = useState<number>(0);

  // Determinar quantos slots estão visíveis de acordo com o gridMode
  const visibleSlotsCount = gridMode === '1' ? 1 : gridMode === '2' ? 2 : 4;
  const activeSlots = slots.slice(0, visibleSlotsCount);
  const occupiedIndicators = activeSlots.filter((item): item is Indicator => item !== null);

  // Indicador selecionado para exibição das notas de fact-checking
  const currentDetailedIndicator = slots[activeSlotForDetails] || occupiedIndicators[0] || availableIndicators[0];

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
      {/* MODO MESCLADO (Gráfico Unificado Comparativo) */}
      {isMerged && occupiedIndicators.length > 0 ? (
        <div className="flex flex-col rounded-2xl border border-amber-300/80 bg-white p-4 shadow-sm dark:border-amber-900/60 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80 gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                ⚡ Comparativo Mesclado em Eixo Comum
              </span>
              <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-50 mt-1">
                {occupiedIndicators.map(i => i.titulo.split('—')[0].trim()).join(' vs. ')}
              </h2>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {occupiedIndicators.length} séries correlacionadas
            </span>
          </div>

          <div className="h-[360px] sm:h-[420px] w-full pt-2">
            <EChartCanvas
              mergedIndicators={occupiedIndicators}
              timeRange={timeRange}
              displayType={chartDisplayType}
              height="100%"
            />
          </div>
        </div>
      ) : (
        /* MODO EM GRADE NORMAL (1, 2 OU 4 QUADRANTES) */
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

            return (
              <div
                key={index}
                className={`flex flex-col rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 dark:bg-zinc-900 ${
                  isDetailed
                    ? 'border-emerald-500/80 ring-2 ring-emerald-500/20 dark:border-emerald-500/70'
                    : 'border-zinc-200/80 dark:border-zinc-800/80'
                }`}
                onClick={() => {
                  if (slotIndicator) setActiveSlotForDetails(index);
                }}
              >
                {slotIndicator ? (
                  <>
                    {/* Cabeçalho do Quadrante */}
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 font-mono">
                            Q{index + 1}
                          </span>
                          <h3 className="truncate font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                            {slotIndicator.titulo}
                          </h3>
                        </div>
                        <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {slotIndicator.fonte.orgao} • {slotIndicator.detalhamento_tecnico.unidade_medida}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {gridMode !== '1' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateSlot(0, slotIndicator);
                              onSetGridMode('1');
                            }}
                            title="Expandir para tela cheia"
                            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                          >
                            <Maximize2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {gridMode !== '1' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateSlot(index, null);
                            }}
                            title="Remover deste quadrante"
                            className="rounded-lg p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Gráfico no Canvas */}
                    <div
                      className={`w-full pt-2 ${
                        gridMode === '1'
                          ? 'h-[360px] sm:h-[400px]'
                          : 'h-[240px] sm:h-[280px]'
                      }`}
                    >
                      <EChartCanvas
                        indicator={slotIndicator}
                        timeRange={timeRange}
                        displayType={chartDisplayType}
                        height="100%"
                      />
                    </div>
                  </>
                ) : (
                  /* Slot Vazio / Placeholder */
                  <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-xs text-zinc-700 dark:text-zinc-300">
                      Quadrante {index + 1} Vazio
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-1 max-w-[200px]">
                      Selecione um indicador para comparar com os demais:
                    </p>

                    <select
                      className="mt-3 rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-800 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
                      onChange={(e) => {
                        const found = availableIndicators.find(i => i.id === e.target.value);
                        if (found) onUpdateSlot(index, found);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Escolher indicador...</option>
                      {availableIndicators.map(i => (
                        <option key={i.id} value={i.id}>{i.titulo}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Painel Inferior de Fact-Checking & Visão Cidadã */}
      {currentDetailedIndicator && (
        <div className="pt-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Contexto & Auditoria Metodológica: {currentDetailedIndicator.titulo}
            </span>
          </div>
          <FactCheckingDrawer indicator={currentDetailedIndicator} />
        </div>
      )}
    </div>
  );
}
