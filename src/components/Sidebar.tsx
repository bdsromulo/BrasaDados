import { useState } from 'react';
import { 
  TrendingUp, 
  GraduationCap, 
  ShieldAlert, 
  Globe2, 
  HeartPulse, 
  Trees, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  PlusCircle,
  Database
} from 'lucide-react';
import { Indicator, CategoryId } from '../types/indicator';
import { CATEGORIAS_INFO } from '../data/indicators';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  indicators: Indicator[];
  selectedIndicatorId: string;
  onSelectIndicator: (indicator: Indicator) => void;
  onAddToQuadrant?: (indicator: Indicator) => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  indicators,
  selectedIndicatorId,
  onSelectIndicator,
  onAddToQuadrant
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'todas'>('todas');

  const iconMap: Record<string, any> = {
    TrendingUp,
    GraduationCap,
    ShieldAlert,
    Globe2,
    HeartPulse,
    Trees
  };

  const filteredIndicators = indicators.filter(ind => {
    const matchesCategory = activeCategory === 'todas' || ind.categoria === activeCategory;
    const matchesSearch = ind.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ind.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          ind.fonte.orgao.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <aside
      className={`relative flex flex-col shrink-0 border-r border-zinc-200/80 bg-white/95 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/95 transition-all duration-300 ease-in-out z-20 h-screen ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Cabeçalho do Menu Lateral */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-emerald-600 to-blue-600 text-white font-black text-sm shadow-sm">
            🇧🇷
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-base text-zinc-950 dark:text-zinc-50 leading-tight">
                Brasa Dados
              </span>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                Dados Oficiais Abertos
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Campo de Busca Rápida (quando expandido) */}
      {!collapsed && (
        <div className="p-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar indicador ou fonte..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200/80 bg-zinc-50/70 pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:bg-zinc-900 transition-all"
            />
          </div>
        </div>
      )}

      {/* Categorias / Navegação */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Lista de Categorias Macro */}
        <div>
          {!collapsed && (
            <div className="px-2 mb-1.5 flex items-center justify-between text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              <span>Áreas Sociais</span>
              {activeCategory !== 'todas' && (
                <button
                  onClick={() => setActiveCategory('todas')}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Ver todas
                </button>
              )}
            </div>
          )}

          <div className="space-y-1">
            {CATEGORIAS_INFO.map((cat) => {
              const Icone = iconMap[cat.icone] || Database;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id === activeCategory ? 'todas' : (cat.id as CategoryId))}
                  title={collapsed ? `${cat.nome} (${cat.count})` : undefined}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
                  } ${collapsed ? 'justify-center !px-2' : ''}`}
                >
                  <Icone className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`} />
                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between truncate">
                      <span className="truncate">{cat.nome}</span>
                      {cat.count > 0 && (
                        <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold">
                          {cat.count}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de Indicadores da Categoria / Filtro */}
        <div>
          {!collapsed && (
            <div className="px-2 mb-1.5 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Indicadores ({filteredIndicators.length})
            </div>
          )}

          <div className="space-y-1.5">
            {filteredIndicators.map((ind) => {
              const isSelected = selectedIndicatorId === ind.id;

              return (
                <div
                  key={ind.id}
                  className={`group relative flex items-center rounded-xl p-2 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 shadow-sm'
                      : 'border-zinc-200/70 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 dark:border-zinc-800/70 dark:bg-zinc-850 dark:hover:bg-zinc-800'
                  } ${collapsed ? 'justify-center !p-2.5' : ''}`}
                  onClick={() => onSelectIndicator(ind)}
                  title={collapsed ? ind.titulo : undefined}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
                      {!collapsed && (
                        <span className="truncate text-xs font-bold leading-tight">
                          {ind.titulo.split('—')[0]}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <p className={`truncate text-[10px] mt-0.5 ${isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        {ind.fonte.orgao.split('/')[0]}
                      </p>
                    )}
                  </div>

                  {!collapsed && onAddToQuadrant && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToQuadrant(ind);
                      }}
                      title="Adicionar a um quadrante no comparador"
                      className={`ml-1 rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                        isSelected
                          ? 'text-zinc-300 hover:text-white dark:text-zinc-600 dark:hover:text-zinc-950'
                          : 'text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                      }`}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rodapé do Menu Lateral */}
      <div className="border-t border-zinc-200/80 p-3 text-center dark:border-zinc-800/80">
        {!collapsed ? (
          <p className="text-[10px] text-zinc-400 leading-tight">
            Brasa Dados • 100% Client-side<br />Fontes Oficiais Governamentais
          </p>
        ) : (
          <span className="text-[10px] font-bold text-zinc-400">BD</span>
        )}
      </div>
    </aside>
  );
}
