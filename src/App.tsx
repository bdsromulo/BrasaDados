import { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopControls } from './components/TopControls';
import { QuadrantWorkbench } from './components/QuadrantWorkbench';
import { IndicatorPickerModal } from './components/IndicatorPickerModal';
import { INDICADORES_REAIS } from './data/indicators';
import { Indicator, GridMode, ChartDisplayType } from './types/indicator';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('brasadados_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const [gridMode, setGridMode] = useState<GridMode>('1');
  const [yearsRange, setYearsRange] = useState<[number, number]>([2015, 2026]);
  const [isMerged, setIsMerged] = useState<boolean>(false);
  const [chartDisplayType, setChartDisplayType] = useState<ChartDisplayType>('line-straight');

  // Inicializa a tela vazia por padrão conforme solicitação do usuário
  const [slots, setSlots] = useState<(Indicator | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>('');
  
  // Estado do Modal Pop-up de Adição de Indicadores
  const [isPickerModalOpen, setIsPickerModalOpen] = useState<boolean>(false);
  const [pickerTargetSlot, setPickerTargetSlot] = useState<number | undefined>(undefined);

  function toggleSidebar() {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('brasadados_sidebar_collapsed', String(next));
      return next;
    });
  }

  function handleOpenPicker(slotIndex?: number) {
    setPickerTargetSlot(slotIndex);
    setIsPickerModalOpen(true);
  }

  function handleSelectIndicatorFromModal(indicator: Indicator, targetSlotIndex?: number) {
    setSelectedIndicatorId(indicator.id);
    
    if (targetSlotIndex !== undefined) {
      // Aloca no slot específico
      setSlots(prev => {
        const copy = [...prev];
        copy[targetSlotIndex] = indicator;
        return copy;
      });
      if (targetSlotIndex === 1 && gridMode === '1') {
        setGridMode('2');
      } else if (targetSlotIndex >= 2 && gridMode !== '4') {
        setGridMode('4');
      }
    } else {
      // Adição inteligente no próximo slot disponível
      const occupied = slots.filter(Boolean).length;
      if (occupied === 0) {
        setSlots([indicator, null, null, null]);
        setGridMode('1');
      } else if (occupied === 1) {
        setSlots(prev => [prev[0], indicator, null, null]);
        setGridMode('2');
      } else if (occupied === 2) {
        setSlots(prev => [prev[0], prev[1], indicator, null]);
        setGridMode('4');
      } else {
        setSlots(prev => {
          const firstEmpty = prev.findIndex(s => s === null);
          const target = firstEmpty >= 0 ? firstEmpty : 0;
          const copy = [...prev];
          copy[target] = indicator;
          return copy;
        });
      }
    }
  }

  // Ação ao arrastar e soltar (Drag and Drop)
  function handleDropIndicator(indicatorId: string, targetSlotIndex?: number) {
    const found = INDICADORES_REAIS.find(i => i.id === indicatorId);
    if (!found) return;

    setSelectedIndicatorId(found.id);

    if (targetSlotIndex !== undefined) {
      setSlots(prev => {
        const copy = [...prev];
        copy[targetSlotIndex] = found;
        return copy;
      });
      if (targetSlotIndex === 1 && gridMode === '1') {
        setGridMode('2');
      } else if (targetSlotIndex >= 2 && gridMode !== '4') {
        setGridMode('4');
      }
    } else {
      // Solto no canvas geral
      const occupied = slots.filter(Boolean).length;
      if (occupied === 0) {
        setSlots([found, null, null, null]);
        setGridMode('1');
      } else if (occupied === 1) {
        // Coloca lado a lado (2 Telas)
        setSlots(prev => [prev[0], found, null, null]);
        setGridMode('2');
      } else if (occupied === 2) {
        // Expande para 4 Quadrantes
        setSlots(prev => [prev[0], prev[1], found, null]);
        setGridMode('4');
      } else {
        setSlots(prev => {
          const firstEmpty = prev.findIndex(s => s === null);
          const target = firstEmpty >= 0 ? firstEmpty : 0;
          const copy = [...prev];
          copy[target] = found;
          return copy;
        });
      }
    }
  }

  // Ação ao clicar em um indicador da barra lateral
  function handleSelectIndicatorFromSidebar(indicator: Indicator) {
    setSelectedIndicatorId(indicator.id);
    const occupied = slots.filter(Boolean).length;
    if (occupied === 0) {
      setSlots([indicator, null, null, null]);
      setGridMode('1');
    } else if (gridMode === '1') {
      setSlots([indicator, slots[1], slots[2], slots[3]]);
    } else {
      // Se não estiver na tela, preenche o primeiro vago
      const alreadyIn = slots.findIndex(s => s?.id === indicator.id);
      if (alreadyIn < 0) {
        const firstEmpty = slots.findIndex(s => s === null);
        const target = firstEmpty >= 0 ? firstEmpty : 0;
        setSlots(prev => {
          const copy = [...prev];
          copy[target] = indicator;
          return copy;
        });
      }
    }
  }

  // Ação ao clicar no botão "+" de um indicador da barra lateral
  function handleAddToQuadrant(indicator: Indicator) {
    handleDropIndicator(indicator.id);
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

  const activeIndicatorsCount = useMemo(() => {
    return slots.filter(Boolean).length;
  }, [slots]);

  // Permite mesclar quaisquer 2 ou mais indicadores visíveis
  const canMerge = useMemo(() => {
    const visibleCount = gridMode === '1' ? 1 : gridMode === '2' ? 2 : 4;
    const active = slots.slice(0, visibleCount).filter((i): i is Indicator => i !== null);
    return active.length >= 2;
  }, [slots, gridMode]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
      {/* 1. Menu Lateral Colapsável à Esquerda */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        indicators={INDICADORES_REAIS}
        selectedIndicatorId={selectedIndicatorId}
        onSelectIndicator={handleSelectIndicatorFromSidebar}
        onAddToQuadrant={handleAddToQuadrant}
        onOpenPickerModal={() => handleOpenPicker()}
      />

      {/* 2. Área do Canvas Principal */}
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
          activeCount={activeIndicatorsCount}
          chartDisplayType={chartDisplayType}
          onSetChartDisplayType={setChartDisplayType}
          onOpenPickerModal={() => handleOpenPicker()}
        />

        {/* Bancada de Visualização em Quadrantes com Suporte a Drag & Drop */}
        <QuadrantWorkbench
          gridMode={gridMode}
          slots={slots}
          onUpdateSlot={handleUpdateSlot}
          availableIndicators={INDICADORES_REAIS}
          timeRange={yearsRange}
          isMerged={isMerged}
          onSetGridMode={setGridMode}
          chartDisplayType={chartDisplayType}
          onOpenPickerModal={handleOpenPicker}
          onDropIndicator={handleDropIndicator}
        />
      </main>

      {/* 3. Modal Pop-up para Escolha e Pesquisa de Indicadores */}
      <IndicatorPickerModal
        isOpen={isPickerModalOpen}
        onClose={() => setIsPickerModalOpen(false)}
        onSelectIndicator={handleSelectIndicatorFromModal}
        indicators={INDICADORES_REAIS}
        targetSlotIndex={pickerTargetSlot}
        currentActiveIds={slots.filter((i): i is Indicator => i !== null).map(i => i.id)}
      />
    </div>
  );
}
