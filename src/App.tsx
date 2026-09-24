import { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopControls } from './components/TopControls';
import { QuadrantWorkbench } from './components/QuadrantWorkbench';
import { INDICADORES_REAIS } from './data/indicators';
import { Indicator, GridMode, ChartDisplayType } from './types/indicator';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('brasadados_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const [gridMode, setGridMode] = useState<GridMode>('4');
  const [yearsRange, setYearsRange] = useState<[number, number]>([2015, 2026]);
  const [isMerged, setIsMerged] = useState<boolean>(false);
  const [chartDisplayType, setChartDisplayType] = useState<ChartDisplayType>('line-straight');

  // Inicializa com 4 indicadores reais emblemáticos nos 4 quadrantes
  const [slots, setSlots] = useState<(Indicator | null)[]>([
    INDICADORES_REAIS[0], // Selic (BCB)
    INDICADORES_REAIS[1], // Inflação IPCA (IBGE)
    INDICADORES_REAIS[2], // IDEB Ensino Médio (INEP)
    INDICADORES_REAIS[4], // Mortes Violentas Intencionais (FBSP)
  ]);

  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(
    INDICADORES_REAIS[0].id
  );

  function toggleSidebar() {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('brasadados_sidebar_collapsed', String(next));
      return next;
    });
  }

  function handleSelectIndicator(indicator: Indicator) {
    setSelectedIndicatorId(indicator.id);
    // Coloca no primeiro slot se o modo for 1 tela, ou no slot 0
    if (gridMode === '1') {
      setSlots(prev => [indicator, prev[1], prev[2], prev[3]]);
    } else {
      // Se não estiver em nenhum slot, preenche o primeiro vago ou o primeiro slot
      setSlots(prev => {
        const alreadyIn = prev.findIndex(s => s?.id === indicator.id);
        if (alreadyIn >= 0) return prev;
        const firstEmpty = prev.findIndex(s => s === null);
        const target = firstEmpty >= 0 ? firstEmpty : 0;
        const copy = [...prev];
        copy[target] = indicator;
        return copy;
      });
    }
  }

  function handleAddToQuadrant(indicator: Indicator) {
    setSelectedIndicatorId(indicator.id);
    setSlots(prev => {
      const firstEmpty = prev.findIndex(s => s === null);
      if (firstEmpty >= 0) {
        const copy = [...prev];
        copy[firstEmpty] = indicator;
        return copy;
      }
      // Se todos estiverem cheios, substitui o slot 1
      return [prev[0], indicator, prev[2], prev[3]];
    });
  }

  function handleUpdateSlot(index: number, indicator: Indicator | null) {
    setSlots(prev => {
      const copy = [...prev];
      copy[index] = indicator;
      return copy;
    });
    if (indicator) {
      setSelectedIndicatorId(indicator.id);
    }
  }

  // Verifica se há pelo menos 2 indicadores ativos compatíveis para mesclar
  const canMerge = useMemo(() => {
    const visibleCount = gridMode === '1' ? 1 : gridMode === '2' ? 2 : 4;
    const active = slots.slice(0, visibleCount).filter((i): i is Indicator => i !== null);
    if (active.length < 2) return false;

    // Checa se pelo menos 2 compartilham a mesma unidade (ex: % ou pontos)
    const units = active.map(i => i.visualizacao.eixo_y.unidade);
    const hasSameUnit = units.some((u, idx) => units.indexOf(u) !== idx);
    return hasSameUnit;
  }, [slots, gridMode]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
      {/* 1. Menu Lateral Colapsável à Esquerda */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        indicators={INDICADORES_REAIS}
        selectedIndicatorId={selectedIndicatorId}
        onSelectIndicator={handleSelectIndicator}
        onAddToQuadrant={handleAddToQuadrant}
      />

      {/* 2. Área do Canvas Principal (ocupa toda a largura restante até a borda direita) */}
      <main className="flex flex-1 flex-col overflow-hidden relative">
        {/* Barra Superior de Filtros e Controles */}
        <TopControls
          gridMode={gridMode}
          onSetGridMode={setGridMode}
          selectedYearsRange={yearsRange}
          onSetYearsRange={setYearsRange}
          canMerge={canMerge}
          isMerged={isMerged}
          onToggleMerge={() => setIsMerged(prev => !prev)}
          activeCount={slots.filter(Boolean).length}
          chartDisplayType={chartDisplayType}
          onSetChartDisplayType={setChartDisplayType}
        />

        {/* Bancada de Visualização em Quadrantes */}
        <QuadrantWorkbench
          gridMode={gridMode}
          slots={slots}
          onUpdateSlot={handleUpdateSlot}
          availableIndicators={INDICADORES_REAIS}
          timeRange={yearsRange}
          isMerged={isMerged}
          onSetGridMode={setGridMode}
          chartDisplayType={chartDisplayType}
        />
      </main>
    </div>
  );
}
