import { useState, useMemo } from 'react';
import { Search, X, Plus, Database, TrendingUp, GraduationCap, HeartPulse, ShieldAlert, Trees, Globe2 } from 'lucide-react';
import { Indicator, CategoryId, SourceResourceType } from '../types/indicator';
import { CATEGORIAS_INFO } from '../data/indicators';

interface IndicatorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndicator: (indicator: Indicator, targetSlotIndex?: number) => void;
  indicators: Indicator[];
  targetSlotIndex?: number;
  currentActiveIds?: string[];
}

export function IndicatorPickerModal({
  isOpen,
  onClose,
  onSelectIndicator,
  indicators,
  targetSlotIndex,
  currentActiveIds = []
}: IndicatorPickerModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'todas'>('todas');

  const categoryIcons: Record<string, any> = {
    TrendingUp,
    GraduationCap,
    HeartPulse,
    ShieldAlert,
    Trees,
    Globe2
  };

  const filteredIndicators = useMemo(() => {
    return indicators.filter((ind) => {
      const matchesCat = selectedCategory === 'todas' || ind.categoria === selectedCategory;
      const q = search.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesSearch =
        ind.titulo.toLowerCase().includes(q) ||
        ind.fonte.orgao.toLowerCase().includes(q) ||
        ind.tags.some(t => t.toLowerCase().includes(q)) ||
        ind.explicacao_leiga.resumo.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [indicators, search, selectedCategory]);

  if (!isOpen) return null;

  function getBadgeLabel(tipo?: SourceResourceType) {
    switch (tipo) {
      case 'api': return 'API Aberta';
      case 'dados_abertos': return 'Dados Abertos';
      case 'painel': return 'Painel Interativo';
      case 'serie_temporal': return 'Série Histórica';
      case 'relatorio_oficial': return 'Relatório Oficial';
      default: return 'Fonte Oficial';
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Pop-up */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-850/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-xs dark:bg-emerald-500">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-zinc-950 dark:text-zinc-50">
                {targetSlotIndex !== undefined ? `Adicionar ao Quadrante ${targetSlotIndex + 1}` : 'Adicionar Indicador ao Painel'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Selecione uma métrica oficial do Brasil com auditoria metodológica e fontes abertas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-200/70 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/30 dark:bg-zinc-900">
          {/* Campo de Busca */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Pesquisar por título, órgão (IBGE, BCB, INEP...), tag ou conceito..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-zinc-300 bg-white pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Pílulas de Categorias com Contagem */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('todas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'todas'
                  ? 'bg-emerald-600 text-white shadow-xs dark:bg-emerald-500'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750'
              }`}
            >
              <span>Todas as Áreas</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                selectedCategory === 'todas' ? 'bg-emerald-700/60 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
              }`}>
                {indicators.length}
              </span>
            </button>

            {CATEGORIAS_INFO.map((cat) => {
              const Icon = categoryIcons[cat.icone] || Database;
              const isSelected = selectedCategory === cat.id;
              const count = indicators.filter(i => i.categoria === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as CategoryId)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs dark:bg-emerald-500'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.nome}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    isSelected ? 'bg-emerald-700/60 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Indicadores */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[55vh]">
          {filteredIndicators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500 dark:text-zinc-400">
              <Database className="h-10 w-10 text-zinc-300 dark:text-zinc-600 mb-2" />
              <p className="text-sm font-semibold">Nenhum indicador encontrado para essa pesquisa.</p>
              <p className="text-xs text-zinc-400 mt-1">Tente pesquisar por outros termos ou selecione "Todas as Áreas".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredIndicators.map((ind) => {
                const isCurrentlyActive = currentActiveIds.includes(ind.id);
                const badgeLabel = getBadgeLabel(ind.fonte.tipo_recurso);

                return (
                  <div
                    key={ind.id}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify({ indicatorId: ind.id }));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    className={`flex flex-col justify-between rounded-xl border p-3.5 transition-all text-left group ${
                      isCurrentlyActive
                        ? 'border-emerald-500/50 bg-emerald-50/30 dark:border-emerald-700/50 dark:bg-emerald-950/20'
                        : 'border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-850/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div>
                      {/* Topo do Card */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {badgeLabel}
                        </span>

                        <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                          {ind.detalhamento_tecnico.unidade_medida}
                        </span>
                      </div>

                      {/* Título do Indicador */}
                      <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 mt-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {ind.titulo}
                      </h3>

                      {/* Órgão Oficial */}
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {ind.fonte.orgao}
                      </p>

                      {/* Resumo do Dado */}
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 mt-1.5 leading-relaxed">
                        {ind.explicacao_leiga.resumo}
                      </p>
                    </div>

                    {/* Botão de Ação */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        {isCurrentlyActive ? 'Já presente no painel' : 'Disponível para adicionar'}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectIndicator(ind, targetSlotIndex);
                          onClose();
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isCurrentlyActive
                            ? 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-xs'
                        }`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{isCurrentlyActive ? 'Adicionar Novamente' : 'Adicionar ao Painel'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé do Modal com Dica de Drag & Drop */}
        <div className="border-t border-zinc-200 px-5 py-3 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-850/60 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>💡 <strong>Dica:</strong> Você também pode arrastar qualquer cartão da lista ou da barra lateral e soltar no canvas.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
