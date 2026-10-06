"use client";

export type ChartSeries = { name: string; tone: "ink" | "muted"; values: number[] };

export default function ArtifactChart({
  series,
  height = 180,
  footnote,
}: {
  series: ChartSeries[];
  height?: number;
  footnote?: string;
}) {
  const W = 720;
  const H = height;
  const PAD = 10;
  const all = series.flatMap((s) => s.values);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const n = Math.max(...series.map((s) => s.values.length));
  const x = (i: number) => PAD + (i / Math.max(n - 1, 1)) * (W - PAD * 2);
  const y = (v: number) => PAD + (1 - (v - min) / span) * (H - PAD * 2);
  const line = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-4">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5 text-[11.5px] text-ink-2">
            <span className={`h-[2px] w-4 rounded-full ${s.tone === "ink" ? "bg-ink" : "bg-line-strong"}`} />
            {s.name}
          </span>
        ))}
        <span className="ml-auto font-mono text-[11px] tabular-nums text-ink-3">
          {min.toFixed(0)}–{max.toFixed(0)} pts
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label="Scoring trend chart">
        <line x1={PAD} x2={W - PAD} y1={y(max)} y2={y(max)} stroke="var(--line)" strokeWidth={1} />
        <line x1={PAD} x2={W - PAD} y1={y(min)} y2={y(min)} stroke="var(--line)" strokeWidth={1} />
        {series.map((s) => (
          <path
            key={s.name}
            d={line(s.values)}
            fill="none"
            stroke={s.tone === "ink" ? "var(--ink)" : "var(--line-strong)"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      {footnote && <div className="mt-1 font-mono text-[11px] text-ink-3">{footnote}</div>}
    </div>
  );
}
