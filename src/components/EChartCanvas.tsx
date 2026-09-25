import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Indicator, ChartDisplayType, ViewScope } from '../types/indicator';

interface EChartCanvasProps {
  indicator?: Indicator;
  mergedIndicators?: Indicator[];
  height?: string | number;
  timeRange?: [number, number]; // [anoInicio, anoFim]
  displayType?: ChartDisplayType;
  viewScope?: ViewScope;
}

export function EChartCanvas({
  indicator,
  mergedIndicators,
  height = '100%',
  timeRange,
  displayType,
  viewScope
}: EChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');
    const chart = echarts.init(containerRef.current, isDark ? 'dark' : undefined, {
      renderer: 'canvas'
    });
    chartInstanceRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(containerRef.current);

    // Observer para alternância de tema no elemento <html>
    const themeObserver = new MutationObserver(() => {
      if (!containerRef.current) return;
      const currentDark = document.documentElement.classList.contains('dark');
      chart.dispose();
      const newChart = echarts.init(containerRef.current, currentDark ? 'dark' : undefined);
      chartInstanceRef.current = newChart;
      renderChart(newChart);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    renderChart(chart);

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  // Re-renderizar quando as props mudarem
  useEffect(() => {
    if (chartInstanceRef.current) {
      renderChart(chartInstanceRef.current);
    }
  }, [indicator, mergedIndicators, timeRange, displayType, viewScope]);

  function renderChart(chart: echarts.ECharts) {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#d4d4d8' : '#3f3f46';
    const splitLineColor = isDark ? '#27272a' : '#f4f4f5';
    const axisLineColor = isDark ? '#3f3f46' : '#e4e4e7';

    // Determina o tipo de série com base na preferência do usuário ou no padrão do indicador
    const getSeriesType = (defaultType?: 'line' | 'bar') => {
      if (displayType === 'bar') return 'bar';
      if (displayType === 'line-smooth' || displayType === 'line-straight' || displayType === 'area') return 'line';
      return defaultType || 'line';
    };

    const getIsSmooth = (defaultType?: 'line' | 'bar') => {
      if (displayType === 'line-smooth' || displayType === 'area') return true;
      if (displayType === 'line-straight') return false;
      if (displayType === 'bar') return false;
      return defaultType !== 'bar';
    };

    // Cenário 1: Gráficos Mesclados (2 ou mais indicadores sobre o mesmo canvas)
    if (mergedIndicators && mergedIndicators.length > 0) {
      const allSeries: any[] = [];
      const legendData: string[] = [];

      // Identifica se os indicadores têm unidades diferentes para ativar EIXO DUPLO (Dual Y-Axis)
      const uniqueUnits = Array.from(new Set(mergedIndicators.map(i => i.visualizacao.eixo_y.unidade)));
      const hasDualAxis = uniqueUnits.length > 1;

      mergedIndicators.forEach((ind, index) => {
        const sType = getSeriesType(ind.visualizacao.tipo_padrao);
        const sSmooth = getIsSmooth(ind.visualizacao.tipo_padrao);
        const yAxisIdx = hasDualAxis ? uniqueUnits.indexOf(ind.visualizacao.eixo_y.unidade) : 0;
        const baseColor = ind.visualizacao.series[0]?.cor || (index === 0 ? '#10b981' : '#f59e0b');

        ind.visualizacao.series.forEach((s) => {
          const seriesName = `${ind.titulo.split('—')[0].trim()} • ${s.nome}`;
          legendData.push(seriesName);

          let filteredData = s.dados;
          if (timeRange) {
            filteredData = s.dados.filter(([ano]) => {
              const numAno = typeof ano === 'number' ? ano : parseInt(String(ano));
              return numAno >= timeRange[0] && numAno <= timeRange[1];
            });
          }

          const seriesConfig: any = {
            name: seriesName,
            type: sType,
            smooth: sSmooth,
            showSymbol: true,
            symbolSize: 6,
            barMaxWidth: 32,
            yAxisIndex: yAxisIdx,
            lineStyle: {
              width: 3,
              type: s.estilo || 'solid'
            },
            itemStyle: {
              color: s.cor || baseColor,
              borderRadius: sType === 'bar' ? [4, 4, 0, 0] : 0
            },
            data: filteredData
          };

          if (displayType === 'area') {
            seriesConfig.areaStyle = {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: s.cor || baseColor },
                { offset: 1, color: isDark ? 'rgba(24, 24, 27, 0.05)' : 'rgba(255, 255, 255, 0.05)' }
              ])
            };
          }

          allSeries.push(seriesConfig);
        });
      });

      // Configuração dos Eixos Y (Simples ou Duplo)
      const yAxisConfig: any = hasDualAxis
        ? [
            {
              type: 'value',
              name: `${uniqueUnits[0]}`,
              nameTextStyle: { color: textColor, fontSize: 11 },
              axisLine: { show: false },
              splitLine: { lineStyle: { color: splitLineColor } },
              axisLabel: { color: textColor, fontSize: 11 }
            },
            {
              type: 'value',
              name: `${uniqueUnits[1]}`,
              nameTextStyle: { color: textColor, fontSize: 11 },
              axisLine: { show: false },
              splitLine: { show: false },
              axisLabel: { color: textColor, fontSize: 11 }
            }
          ]
        : {
            type: 'value',
            name: uniqueUnits[0] ? `(${uniqueUnits[0]})` : '',
            axisLine: { show: false },
            splitLine: { lineStyle: { color: splitLineColor } },
            axisLabel: { color: textColor, fontSize: 11 }
          };

      const option: echarts.EChartsOption = {
        backgroundColor: 'transparent',
        toolbox: {
          show: true,
          right: 10,
          top: 8,
          iconStyle: { borderColor: isDark ? '#a1a1aa' : '#71717a' },
          feature: {
            saveAsImage: {
              title: 'Baixar Imagem PNG',
              pixelRatio: 2,
              backgroundColor: isDark ? '#18181b' : '#ffffff'
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          borderColor: isDark ? '#27272a' : '#e4e4e7',
          textStyle: { color: isDark ? '#fafafa' : '#09090b', fontSize: 12 }
        },
        legend: {
          data: legendData,
          top: 8,
          textStyle: { color: textColor, fontSize: 11 }
        },
        grid: {
          top: 55,
          right: hasDualAxis ? 55 : 30,
          bottom: 30,
          left: 50,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine: { lineStyle: { color: axisLineColor } },
          axisLabel: { color: textColor, fontSize: 11 }
        },
        yAxis: yAxisConfig,
        series: allSeries
      };

      chart.setOption(option, true);
      return;
    }

    // Cenário 2: Gráfico Individual Único
    if (!indicator) return;

    // Cenário 2B: Visualização de Ranking por Unidade Federativa (UF)
    if (viewScope === 'estados' && indicator.visualizacao.dados_uf && indicator.visualizacao.dados_uf.length > 0) {
      // Ordenação crescente para que o maior valor apareça no topo do gráfico de barras horizontais
      const sortedUfs = [...indicator.visualizacao.dados_uf].sort((a, b) => a.valor - b.valor);
      const nomesUfs = sortedUfs.map(d => `${d.uf} - ${d.nome}`);
      const valoresUfs = sortedUfs.map(d => d.valor);
      const baseCor = indicator.visualizacao.series[0]?.cor || '#10b981';

      const option: echarts.EChartsOption = {
        backgroundColor: 'transparent',
        animationDuration: 600,
        toolbox: {
          show: true,
          right: 10,
          top: 4,
          iconStyle: { borderColor: isDark ? '#a1a1aa' : '#71717a' },
          feature: {
            saveAsImage: {
              title: 'Baixar Imagem PNG',
              pixelRatio: 2,
              backgroundColor: isDark ? '#18181b' : '#ffffff'
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          borderColor: isDark ? '#27272a' : '#e4e4e7',
          textStyle: { color: isDark ? '#fafafa' : '#09090b', fontSize: 12 },
          formatter: (params: any) => {
            if (!Array.isArray(params) || params.length === 0) return '';
            const p = params[0];
            return `<div style="font-weight: 700; margin-bottom: 4px;">${p.name}</div>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${baseCor};"></span>
                      <span style="color:${isDark ? '#a1a1aa' : '#52525b'};">Taxa/Valor:</span>
                      <span style="font-weight:700;">${p.value} ${indicator.visualizacao.eixo_y.unidade}</span>
                    </div>`;
          }
        },
        grid: {
          top: 25,
          right: 45,
          bottom: 15,
          left: 10,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: indicator.visualizacao.eixo_y.unidade,
          nameTextStyle: { color: textColor, fontSize: 10 },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: splitLineColor } },
          axisLabel: { color: textColor, fontSize: 10 }
        },
        yAxis: {
          type: 'category',
          data: nomesUfs,
          axisLine: { lineStyle: { color: axisLineColor } },
          axisTick: { show: false },
          axisLabel: {
            color: textColor,
            fontSize: 10,
            formatter: (val: string) => val.split(' - ')[0] // Exibe apenas a sigla no eixo
          }
        },
        series: [
          {
            name: indicator.titulo,
            type: 'bar',
            data: valoresUfs,
            barMaxWidth: 16,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: baseCor },
                { offset: 1, color: isDark ? '#38bdf8' : '#0284c7' }
              ]),
              borderRadius: [0, 4, 4, 0]
            },
            label: {
              show: true,
              position: 'right',
              color: textColor,
              fontSize: 10,
              formatter: '{c}'
            }
          }
        ]
      };

      chart.setOption(option, true);
      return;
    }

    const { visualizacao } = indicator;
    const seriesList: any[] = [];
    const legendData: string[] = [];

    const currentType = getSeriesType(visualizacao.tipo_padrao);
    const currentSmooth = getIsSmooth(visualizacao.tipo_padrao);

    visualizacao.series.forEach((s) => {
      legendData.push(s.nome);

      let filteredData = s.dados;
      if (timeRange) {
        filteredData = s.dados.filter(([ano]) => {
          const numAno = typeof ano === 'number' ? ano : parseInt(String(ano));
          return numAno >= timeRange[0] && numAno <= timeRange[1];
        });
      }

      const seriesConfig: any = {
        name: s.nome,
        type: currentType,
        smooth: currentSmooth,
        showSymbol: true,
        symbolSize: 7,
        barMaxWidth: 42,
        lineStyle: {
          width: 3,
          type: s.estilo || 'solid'
        },
        itemStyle: {
          color: s.cor || '#2563eb',
          borderRadius: currentType === 'bar' ? [5, 5, 0, 0] : 0
        },
        data: filteredData
      };

      // Estilo de Área com Gradiente Suave
      if (displayType === 'area') {
        seriesConfig.areaStyle = {
          opacity: 0.35,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: s.cor || '#2563eb' },
            { offset: 1, color: isDark ? 'rgba(24, 24, 27, 0.05)' : 'rgba(255, 255, 255, 0.05)' }
          ])
        };
      }

      seriesList.push(seriesConfig);
    });

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      animationDuration: 600,
      toolbox: {
        show: true,
        right: 10,
        top: 8,
        iconStyle: { borderColor: isDark ? '#a1a1aa' : '#71717a' },
        feature: {
          saveAsImage: {
            title: 'Baixar Imagem PNG',
            pixelRatio: 2,
            backgroundColor: isDark ? '#18181b' : '#ffffff'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#18181b' : '#ffffff',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        textStyle: { color: isDark ? '#fafafa' : '#09090b', fontSize: 12 },
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return '';
          let res = `<div style="font-weight: 700; margin-bottom: 4px;">Ano ${params[0].name || params[0].value[0]}</div>`;
          params.forEach((item: any) => {
            const val = Array.isArray(item.value) ? item.value[1] : item.value;
            res += `<div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};"></span>
              <span style="color:${isDark ? '#a1a1aa' : '#52525b'};">${item.seriesName}:</span>
              <span style="font-weight:700;">${val} ${visualizacao.eixo_y.unidade}</span>
            </div>`;
          });
          return res;
        }
      },
      legend: {
        show: seriesList.length > 1,
        data: legendData,
        top: 8,
        textStyle: { color: textColor, fontSize: 11 }
      },
      grid: {
        top: seriesList.length > 1 ? 48 : 28,
        right: 25,
        bottom: 30,
        left: 45,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        name: visualizacao.eixo_x.rotulo,
        nameTextStyle: { color: textColor, fontSize: 10 },
        axisLine: { lineStyle: { color: axisLineColor } },
        axisLabel: { color: textColor, fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        name: `${visualizacao.eixo_y.rotulo} (${visualizacao.eixo_y.unidade})`,
        nameTextStyle: { color: textColor, fontSize: 11, align: 'left' },
        min: visualizacao.eixo_y.escala_min,
        max: visualizacao.eixo_y.escala_max,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLabel: {
          color: textColor,
          fontSize: 11,
          formatter: `{value} ${visualizacao.eixo_y.unidade === '%' ? '%' : ''}`
        }
      },
      series: seriesList
    };

    chart.setOption(option, true);
  }

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: height }}
      className="relative transition-all duration-200"
    />
  );
}
