import { GridMode, ChartDisplayType } from '../types/indicator';
import { ThemeToggle } from './ThemeToggle';
import { 
  LayoutGrid, 
  Square, 
  Columns2, 
  Sparkles, 
  Calendar,
  BarChart2,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';

interface TopControlsProps {
  gridMode: GridMode;
  onSetGridMode: (mode: GridMode) => void;
  selectedYearsRange: [number, number];
  onSetYearsRange: (range: [number, number]) => void;
  canMerge: boolean;
  isMerged: boolean;
  onToggleMerge: () => void;
  activeCount: number;
  chartDisplayType: ChartDisplayType;
  onSetChartDisplayType: (type: ChartDisplayType) => void;
}

export function TopControls({
  gridMode,
  onSetGridMode,
  selectedYearsRange,
  onSetYearsRange,
  canMerge,
  isMerged,
  onToggleMerge,
  activeCount,
  chartDisplayType,
  onSetChartDisplayType
}: TopControlsProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 bg-white/90 px-4 py-2.5 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90 z-10">
      {/* Lado Esquerdo: Filtros Temporais */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1 hidden sm:flex">
          <Calendar className="h-3.5 w-3.5" />
          <span>Período:</span>
        </div>

        <div className="inline-flex rounded-xl border border-zinc-200/80 bg-zinc-100/70 p-0.5 dark:border-zinc-800 dark:bg-zinc-800/60 shadow-2xs">
          <button
            type="button"
            onClick={() => onSetYearsRange([2019, 2026])}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedYearsRange[0] === 2019
                ? 'bg-white text-zinc-950 shadow-xs font-bold dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Últimos 5 Anos
          </button>
          <button
            type="button"
            onClick={() => onSetYearsRange([2015, 2026])}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedYearsRange[0] === 2015
                ? 'bg-white text-zinc-950 shadow-xs font-bold dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            10 Anos
          </button>
        </div>

        {/* Seletor de Tipo de Gráfico: Linhas Curvas vs Retas vs Barras */}
        <div className="inline-flex rounded-xl border border-zinc-200/80 bg-zinc-100/70 p-0.5 dark:border-zinc-800 dark:bg-zinc-800/60 shadow-2xs">
          <button
            type="button"
            onClick={() => onSetChartDisplayType('line-smooth')}
            title="Linhas Curvadas (Visão fluida de tendência)"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              chartDisplayType === 'line-smooth'
                ? 'bg-white text-zinc-950 shadow-xs font-bold dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden lg:inline">Curvas</span>
          </button>

          <button
            type="button"
            onClick={() => onSetChartDisplayType('line-straight')}
            title="Linhas Retas (Rigor de medição ponto a ponto para Fact-Checking)"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              chartDisplayType === 'line-straight'
                ? 'bg-white text-zinc-950 shadow-xs font-bold dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden lg:inline">Retas</span>
          </button>

          <button
            type="button"
            onClick={() => onSetChartDisplayType('area')}
            title="Gráfico de Área com Gradiente Suave"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              chartDisplayType === 'area'
                ? 'bg-white text-zinc-950 shadow-xs font-bold dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden lg:inline">Área</span>
          </button>

          <button
            type="button"
            onClick={() => onSetChartDisplayType('bar')}
            title="Gráfico de Barras / Colunas"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              chartDisplayType === 'bar'
                ? 'bg-white text-zinc-950 shadow-xs font-bold dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden lg:inline">Barras</span>
          </button>
        </div>
      </div>

      {/* Centro / Ações de Comparação: Botão de Mesclagem */}
      <div className="flex items-center gap-2">
        {canMerge && (
          <button
            type="button"
            onClick={onToggleMerge}
            title={
              isMerged
                ? "Separar séries nos quadrantes individuais"
                : "Mesclar indicadores compatíveis em um único gráfico comparativo"
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isMerged
                ? 'bg-amber-500 text-zinc-950 ring-2 ring-amber-400/50 dark:bg-amber-400 dark:text-zinc-950'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 animate-pulse'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isMerged ? 'Desfazer Mesclagem' : '⚡ Mesclar Compatíveis'}</span>
          </button>
        )}
      </div>

      {/* Lado Direito: Seletor de Grade de Quadrantes & Switch de Tema */}
      <div className="flex items-center gap-3">
        {/* Seletor de Quadrantes 1, 2 ou 4 */}
        <div className="inline-flex rounded-xl border border-zinc-200/80 bg-zinc-100/70 p-0.5 dark:border-zinc-800 dark:bg-zinc-800/60 shadow-2xs">
          <button
            type="button"
            onClick={() => onSetGridMode('1')}
            title="1 Gráfico em tela cheia"
            className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              gridMode === '1'
                ? 'bg-white text-zinc-950 shadow-xs font-bold dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Square className="h-3.5 w-3.5" />
            <span className="hidden md:inline">1 Tela</span>
          </button>

          <button
            type="button"
            onClick={() => onSetGridMode('2')}
            title="2 Gráficos lado a lado"
            className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              gridMode === '2'
                ? 'bg-white text-zinc-950 shadow-xs font-bold dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Columns2 className="h-3.5 w-3.5" />
            <span className="hidden md:inline">2 Telas</span>
          </button>

          <button
            type="button"
            onClick={() => onSetGridMode('4')}
            title="4 Quadrantes (grade 2x2)"
            className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              gridMode === '4'
                ? 'bg-white text-zinc-950 shadow-xs font-bold dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden md:inline">4 Quadrantes</span>
            {activeCount > 1 && (
              <span className="ml-0.5 rounded-full bg-emerald-500 text-white px-1.5 py-0.2 text-[9px] font-mono">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Switch de Tema Claro / Escuro (Design Cine Brasilis / Oásis UTFPR) */}
        <ThemeToggle />
      </div>
    </header>
  );
}
