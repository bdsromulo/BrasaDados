import { useState } from 'react';
import { Indicator } from '../types/indicator';
import { 
  Sparkles, 
  FileText, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Copy, 
  Check,
  Info
} from 'lucide-react';

interface FactCheckingDrawerProps {
  indicator: Indicator;
}

export function FactCheckingDrawer({ indicator }: FactCheckingDrawerProps) {
  const [activeTab, setActiveTab] = useState<'leigo' | 'tecnico'>('leigo');
  const [copied, setCopied] = useState(false);

  function copyCitation() {
    if (indicator.citacao_sugerida?.abnt) {
      navigator.clipboard.writeText(indicator.citacao_sugerida.abnt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/95 overflow-hidden transition-all">
      {/* Barra de Abas do Painel */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-200/80 px-4 py-2 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-850/60 gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('leigo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'leigo'
                ? 'bg-emerald-600 text-white shadow-xs dark:bg-emerald-500'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Visão Cidadã (Para Leigos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tecnico')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tecnico'
                ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-500'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Metodologia & Fact-Checking</span>
          </button>
        </div>

        {/* Link Oficial da Fonte */}
        <div className="flex items-center gap-3">
          <a
            href={indicator.fonte.url_oficial}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <span>Fonte Primária ({indicator.fonte.orgao.split('/')[0]})</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Conteúdo da Aba 1: Visão Cidadã / Para Leigos */}
      {activeTab === 'leigo' && (
        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed animate-in fade-in duration-150">
          <div className="space-y-1.5">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Info className="h-3.5 w-3.5" /> O que esse dado mede?
            </span>
            <p className="text-zinc-600 dark:text-zinc-300">
              {indicator.explicacao_leiga.resumo}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Como Interpretar?
            </span>
            <p className="text-zinc-600 dark:text-zinc-300">
              {indicator.explicacao_leiga.como_interpretar}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Por que importa para você?
            </span>
            <p className="text-zinc-600 dark:text-zinc-300">
              {indicator.explicacao_leiga.por_que_importa}
            </p>
            {indicator.explicacao_leiga.pontos_de_atencao && (
              <p className="text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl mt-2 border border-amber-200/60 dark:border-amber-800/60">
                ⚡ <strong>Atenção:</strong> {indicator.explicacao_leiga.pontos_de_atencao}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 2: Metodologia Técnica & Fact-Checking */}
      {activeTab === 'tecnico' && (
        <div className="p-4 sm:p-5 space-y-4 text-xs leading-relaxed animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 rounded-xl bg-zinc-50 p-3.5 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800/70">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                Fórmula de Cálculo & Critérios
              </span>
              <p className="text-zinc-600 dark:text-zinc-300 font-mono text-[11px]">
                {indicator.detalhamento_tecnico.formula_calculo}
              </p>
              <div className="text-[11px] text-zinc-500 pt-1">
                <strong>Unidade de medida:</strong> {indicator.detalhamento_tecnico.unidade_medida} • <strong>Frequência:</strong> {indicator.fonte.frequencia}
              </div>
            </div>

            <div className="space-y-2 rounded-xl bg-zinc-50 p-3.5 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800/70">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Amostra, Cobertura & Anonimização (LGPD)
              </span>
              <p className="text-zinc-600 dark:text-zinc-300">
                {indicator.detalhamento_tecnico.amostra_cobertura}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                <strong>Critério de Sigilo:</strong> {indicator.detalhamento_tecnico.anonimizacao_sigilo}
              </p>
            </div>
          </div>

          {/* Alertas de Fact-Checking & Quebras Metodológicas */}
          <div className="rounded-xl border border-amber-300/80 bg-amber-50/70 p-3.5 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Diretrizes para Checagem de Fatos e Evitar Comparações Enganosas:</span>
            </div>
            <p className="text-[11px] leading-relaxed pl-5">
              {indicator.detalhamento_tecnico.orientacoes_fact_checking}
            </p>
            <p className="text-[11px] leading-relaxed pl-5 text-zinc-600 dark:text-zinc-400">
              <strong>Limitações e Quebras de Série:</strong> {indicator.detalhamento_tecnico.limitacoes_e_quebras_metodologicas}
            </p>
          </div>

          {/* Citação ABNT */}
          {indicator.citacao_sugerida && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-zinc-100/60 p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Como Citar (Padrão ABNT Oficial):
                </span>
                <p className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300 truncate">
                  {indicator.citacao_sugerida.abnt}
                </p>
              </div>
              <button
                type="button"
                onClick={copyCitation}
                className="flex items-center gap-1 shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-800 shadow-2xs hover:bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar citação'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
