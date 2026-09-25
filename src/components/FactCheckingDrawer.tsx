import { useState } from 'react';
import { Indicator, SourceResourceType } from '../types/indicator';
import { 
  Sparkles, 
  FileText, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Copy, 
  Check,
  Info,
  Link2
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

  function getResourceMeta(tipo?: SourceResourceType) {
    switch (tipo) {
      case 'api':
        return {
          rotulo: 'API Aberta / Endpoint REST',
          descricao: 'Dados consultáveis de forma automatizada por chamadas HTTP REST.',
          badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
        };
      case 'dados_abertos':
        return {
          rotulo: 'Portal de Dados Abertos',
          descricao: 'Conjunto de dados brutos para download em formatos abertos (CSV, JSON, microdados).',
          badgeColor: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700'
        };
      case 'painel':
        return {
          rotulo: 'Painel Interativo / Dashboard',
          descricao: 'Plataforma oficial de exploração visual com filtros temáticos e espaciais.',
          badgeColor: 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-700'
        };
      case 'serie_temporal':
        return {
          rotulo: 'Série Histórica Estruturada',
          descricao: 'Banco de séries temporais oficiais parametrizadas pela instituição de pesquisa.',
          badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700'
        };
      case 'relatorio_oficial':
        return {
          rotulo: 'Relatório Técnico / Estatístico',
          descricao: 'Publicação oficial consolidada com notas metodológicas integrais e auditoria.',
          badgeColor: 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700'
        };
      default:
        return {
          rotulo: 'Fonte Oficial Primária',
          descricao: 'Portal institucional governamental do órgão responsável.',
          badgeColor: 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700'
        };
    }
  }

  const resMeta = getResourceMeta(indicator.fonte.tipo_recurso);

  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden transition-all">
      {/* Barra de Abas do Painel */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 gap-2">
        <div className="inline-flex rounded-xl bg-zinc-200/80 p-1 dark:bg-zinc-800 border border-zinc-300/60 dark:border-zinc-700/60 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('leigo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'leigo'
                ? 'bg-emerald-600 text-white shadow-xs dark:bg-emerald-500'
                : 'text-zinc-700 hover:text-zinc-950 hover:bg-white/60 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-700/60'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Visão Cidadã (Para Leigos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tecnico')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tecnico'
                ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-500'
                : 'text-zinc-700 hover:text-zinc-950 hover:bg-white/60 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-700/60'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Metodologia & Fact-Checking</span>
          </button>
        </div>

        {/* Link Oficial da Fonte com Badge Explícito de Tipo */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${resMeta.badgeColor}`}>
            {resMeta.rotulo}
          </span>
          <a
            href={indicator.fonte.url_oficial}
            target="_blank"
            rel="noopener noreferrer"
            title={`Acessar dados brutos/oficiais em: ${indicator.fonte.url_oficial}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 transition-all cursor-pointer shadow-2xs"
          >
            <span>{indicator.fonte.rotulo_link || `Fonte Oficial (${indicator.fonte.orgao.split('/')[0]})`}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Conteúdo da Aba 1: Visão Cidadã / Para Leigos */}
      {activeTab === 'leigo' && (
        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs leading-relaxed animate-in fade-in duration-150">
          <div className="space-y-1.5">
            <span className="font-extrabold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <Info className="h-3.5 w-3.5" /> O que esse dado mede?
            </span>
            <p className="text-zinc-800 dark:text-zinc-200">
              {indicator.explicacao_leiga.resumo}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-extrabold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Como Interpretar?
            </span>
            <p className="text-zinc-800 dark:text-zinc-200">
              {indicator.explicacao_leiga.como_interpretar}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-extrabold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Por que importa para você?
            </span>
            <p className="text-zinc-800 dark:text-zinc-200">
              {indicator.explicacao_leiga.por_que_importa}
            </p>
            {indicator.explicacao_leiga.pontos_de_atencao && (
              <p className="text-[11px] font-medium text-amber-950 dark:text-amber-200 bg-amber-500/15 dark:bg-amber-950/40 p-2.5 rounded-xl mt-2 border border-amber-300 dark:border-amber-700">
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
            <div className="space-y-2 rounded-xl bg-zinc-100/70 p-4 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                Fórmula de Cálculo & Critérios
              </span>
              <p className="text-zinc-900 dark:text-zinc-100 font-mono text-[11px] font-semibold">
                {indicator.detalhamento_tecnico.formula_calculo}
              </p>
              <div className="text-[11px] text-zinc-600 dark:text-zinc-400 pt-1">
                <strong>Unidade de medida:</strong> {indicator.detalhamento_tecnico.unidade_medida} • <strong>Frequência:</strong> {indicator.fonte.frequencia}
              </div>
            </div>

            <div className="space-y-2 rounded-xl bg-zinc-100/70 p-4 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Amostra, Cobertura & Anonimização (LGPD)
              </span>
              <p className="text-zinc-800 dark:text-zinc-200">
                {indicator.detalhamento_tecnico.amostra_cobertura}
              </p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                <strong>Critério de Sigilo:</strong> {indicator.detalhamento_tecnico.anonimizacao_sigilo}
              </p>
            </div>
          </div>

          {/* Alertas de Fact-Checking & Quebras Metodológicas */}
          <div className="rounded-xl border border-amber-300 bg-amber-500/10 p-4 text-amber-950 dark:border-amber-600/60 dark:bg-amber-950/40 dark:text-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Diretrizes para Checagem de Fatos e Evitar Comparações Enganosas:</span>
            </div>
            <p className="text-[11px] leading-relaxed pl-5 font-normal">
              {indicator.detalhamento_tecnico.orientacoes_fact_checking}
            </p>
            <p className="text-[11px] leading-relaxed pl-5 text-zinc-700 dark:text-zinc-300">
              <strong>Limitações e Quebras de Série:</strong> {indicator.detalhamento_tecnico.limitacoes_e_quebras_metodologicas}
            </p>
          </div>

          {/* Card de Transparência e Acesso aos Dados Oficiais */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-850 p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-extrabold text-xs text-zinc-950 dark:text-zinc-50 uppercase tracking-wider">
                  Origem dos Dados & Acesso à Fonte Bruta
                </span>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${resMeta.badgeColor}`}>
                {resMeta.rotulo}
              </span>
            </div>
            
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              {resMeta.descricao}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px]">
              <div className="text-zinc-600 dark:text-zinc-400">
                <strong>Órgão:</strong> {indicator.fonte.orgao} • <strong>Pesquisa:</strong> {indicator.fonte.pesquisa}
              </div>

              <a
                href={indicator.fonte.url_oficial}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <span>Acessar {indicator.fonte.rotulo_link || 'Fonte Oficial'}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Citação ABNT */}
          {indicator.citacao_sugerida && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-100 p-3.5 dark:border-zinc-800 dark:bg-zinc-800">
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Como Citar (Padrão ABNT Oficial):
                </span>
                <p className="font-mono text-[11px] text-zinc-800 dark:text-zinc-200 truncate">
                  {indicator.citacao_sugerida.abnt}
                </p>
              </div>
              <button
                type="button"
                onClick={copyCitation}
                className="flex items-center gap-1.5 shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 shadow-2xs hover:bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600 cursor-pointer"
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
