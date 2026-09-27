import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { init, use } from "echarts/core";
import type { EChartsType, EChartsCoreOption } from "echarts/core";
import { LineChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  AriaComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { Display } from "../lib/model";
import type { QueryResult } from "../lib/query";
import { formatNumber, formatPeriod } from "../lib/query";
import { Dialog } from "./Dialog";

use([
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  AriaComponent,
  CanvasRenderer,
]);
const palette = [
  "#2448C7",
  "#087F8C",
  "#9C4F16",
  "#7650A8",
  "#AC3859",
  "#43743D",
];
const darkPalette = [
  "#8DA9FF",
  "#60CCD4",
  "#F7B376",
  "#C3A3F0",
  "#F193B0",
  "#A2C977",
];
export interface ChartItem {
  query: QueryResult;
  display: Display;
  source: string;
}
export default function AtlasChart({
  items,
  title,
}: {
  items: ChartItem[];
  title: string;
}) {
  const element = useRef<HTMLDivElement>(null);
  const [exportImage, setExportImage] = useState<string | null>(null);
  const [exportError, setExportError] = useState("");
  const [exporting, setExporting] = useState(false);
  const instance = useRef<EChartsType | null>(null);
  const current = useRef({ items, title });
  current.current = { items, title };
  const render = useRef<() => void>(() => {});
  render.current = () => {
    if (!instance.current) return;
    const { items: inputs } = current.current;
    const dark = document.documentElement.classList.contains("dark");
    const text = dark ? "#DCE5F2" : "#526681";
    const border = dark ? "#2C3F60" : "#E6EDF6";
    const colors = dark ? darkPalette : palette;
    const rank = inputs[0].query.scope === "estados";
    const periods = rank
      ? inputs[0].query.rows.map((r) => r.period)
      : [
          ...new Set(inputs.flatMap((i) => i.query.rows.map((r) => r.period))),
        ].sort();
    const units = [...new Set(inputs.map((i) => i.query.unit))].slice(0, 2);
    let colorIndex = 0;
    const series = inputs.flatMap((item) =>
      item.query.columns.map((col, index) => {
        const color = colors[colorIndex++ % colors.length];
        const rows = new Map(
          item.query.rows.map((r) => [r.period, r.values[index]]),
        );
        return {
          name:
            inputs.length > 1 ? `${item.query.title} · ${col.name}` : col.name,
          type: rank || item.display === "bar" ? "bar" : "line",
          yAxisIndex: rank ? 0 : units.indexOf(item.query.unit),
          data: periods.map((p) => rows.get(p) ?? null),
          connectNulls: false,
          smooth:
            !rank && (item.display === "smooth" || item.display === "area")
              ? 0.2
              : false,
          showSymbol: periods.length < 35,
          symbolSize: 6,
          lineStyle: { width: 2.5 },
          itemStyle: {
            color,
            borderRadius: rank ? [0, 3, 3, 0] : [3, 3, 0, 0],
          },
          barMaxWidth: rank ? 18 : 30,
          areaStyle:
            !rank && item.display === "area"
              ? { opacity: 0.1, color }
              : undefined,
        };
      }),
    );
    const multi = series.length > 1;
    const numberAxis = {
      type: "value",
      axisLabel: {
        color: text,
        fontSize: 11,
        formatter: (n: number) => formatNumber(n),
      },
      splitLine: { lineStyle: { color: border, type: "dashed" } },
      axisLine: { show: false },
    };
    const option: EChartsCoreOption = {
      backgroundColor: "transparent",
      animationDuration: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? 0
        : 180,
      animationDurationUpdate: 0,
      aria: {
        enabled: true,
        description: `${title}. Os valores também estão disponíveis na aba Tabela.`,
      },
      grid: {
        left: rank ? 12 : 8,
        right: units.length > 1 ? 24 : 16,
        top: multi ? 66 : 34,
        bottom: 12,
        containLabel: true,
      },
      legend: {
        show: multi,
        type: "scroll",
        top: 0,
        left: 0,
        right: 0,
        textStyle: { color: text, fontSize: 11 },
        pageTextStyle: { color: text },
      },
      tooltip: {
        trigger: "axis",
        triggerOn: "mousemove|click",
        confine: true,
        renderMode: "richText",
        backgroundColor: dark ? "#14264D" : "#FFFFFF",
        borderColor: border,
        textStyle: { color: dark ? "#F4F7FC" : "#14264D", fontSize: 12 },
        valueFormatter: (v: unknown) =>
          v === null || v === undefined ? "Sem dado" : formatNumber(Number(v)),
      },
      xAxis: rank
        ? { ...numberAxis, name: units[0], nameLocation: "middle", nameGap: 25 }
        : {
            type: "category",
            data: periods,
            axisTick: { show: false },
            axisLine: { lineStyle: { color: border } },
            axisLabel: {
              color: text,
              hideOverlap: true,
              fontSize: 11,
              formatter: formatPeriod,
            },
            boundaryGap: series.some((s) => s.type === "bar"),
          },
      yAxis: rank
        ? {
            type: "category",
            data: periods,
            inverse: true,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              color: text,
              fontSize: 11,
              formatter: (v: string) => v.split(" · ")[0],
            },
          }
        : units.map((unit, idx) => ({
            ...numberAxis,
            name: unit,
            nameTextStyle: { color: text, align: "left", fontSize: 11 },
            position: idx === 0 ? "left" : "right",
            splitLine: {
              show: idx === 0,
              lineStyle: { color: border, type: "dashed" },
            },
          })),
      series,
    };
    instance.current.setOption(option, { notMerge: true });
  };
  useEffect(() => {
    const chart = init(element.current!);
    instance.current = chart;
    render.current();
    const resize = new ResizeObserver(() => chart.resize());
    resize.observe(element.current!);
    const theme = new MutationObserver(() => render.current());
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      resize.disconnect();
      theme.disconnect();
      chart.dispose();
      instance.current = null;
    };
  }, []);
  useEffect(() => {
    render.current();
  }, [items, title]);
  async function exportPNG() {
    const chart = instance.current;
    if (!chart) return;
    const dark = document.documentElement.classList.contains("dark");
    const img = new Image();
    img.src = chart.getDataURL({
      pixelRatio: 2,
      backgroundColor: dark ? "#14264D" : "#FFFFFF",
    });
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(img.width, 900);
    canvas.height = img.height + 235;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = dark ? "#14264D" : "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = dark ? "#F4F7FC" : "#14264D";
    ctx.font = 'bold 25px "Inter Variable"';
    ctx.fillText(title, 30, 42, canvas.width - 60);
    ctx.drawImage(
      img,
      (canvas.width - img.width) / 2,
      65,
      img.width,
      img.height,
    );
    const logo = new Image();
    logo.src = `${import.meta.env.BASE_URL}favicon.svg`;
    try {
      await logo.decode();
      ctx.drawImage(logo, 30, canvas.height - 94, 42, 42);
    } catch {
      /* Text signature remains available. */
    }
    ctx.font = 'bold 21px "Outfit Variable"';
    ctx.fillText("brasa dados", 82, canvas.height - 65);
    ctx.font = '17px "Inter Variable"';
    ctx.fillText(
      `Fontes: ${[...new Set(items.map((i) => i.source))].join(" • ")}`,
      30,
      canvas.height - 33,
      canvas.width - 60,
    );
    ctx.font = '14px "Inter Variable"';
    ctx.fillText(
      [
        ...new Set(
          items.map(
            (i) =>
              `${i.query.auditStatus ?? ""} · coleta ${i.query.retrievedAt ?? "não documentada"}`,
          ),
        ),
      ].join(" • "),
      30,
      canvas.height - 10,
      canvas.width - 60,
    );
    const reference = items
      .map((i) =>
        i.query.scope === "estados"
          ? i.query.reference
          : `${formatPeriod(i.query.rows[0]?.period ?? "")} a ${formatPeriod(i.query.rows.at(-1)?.period ?? "")}`,
      )
      .join(" • ");
    ctx.font = '15px "Inter Variable"';
    ctx.fillText(reference, 280, canvas.height - 65, canvas.width - 310);
    setExportImage(canvas.toDataURL("image/png"));
  }
  const rank = items[0].query.scope === "estados";
  return (
    <>
      <div
        ref={element}
        className="chart-canvas"
        style={
          rank
            ? { height: Math.max(360, items[0].query.rows.length * 25 + 70) }
            : undefined
        }
        role="img"
        aria-label={`${title}. Consulte os números na aba Tabela.`}
      />
      <button
        className="text-button png-button"
        disabled={exporting}
        onClick={async () => {
          setExporting(true);
          setExportError("");
          try {
            await exportPNG();
          } catch {
            setExportError(
              "Não foi possível preparar a imagem. Tente novamente.",
            );
          } finally {
            setExporting(false);
          }
        }}
      >
        <Download size={14} />{" "}
        {exporting ? "Preparando imagem…" : "Exportar PNG"}
      </button>
      {exportError && <p role="alert">{exportError}</p>}
      {exportImage && (
        <Dialog
          title="Prévia da exportação"
          onClose={() => setExportImage(null)}
          wide
        >
          <p className="muted">
            Imagem do recorte selecionado, com fonte, período e identificação.
          </p>
          <img
            className="export-preview"
            src={exportImage}
            alt={`Exportação de ${title}, com fonte e referência temporal`}
          />
          <a className="primary" href={exportImage} download="brasa-dados.png">
            <Download size={16} /> Salvar PNG
          </a>
        </Dialog>
      )}
    </>
  );
}
