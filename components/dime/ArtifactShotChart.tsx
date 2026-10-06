"use client";

import type { ShotZone } from "@/lib/dime-data";

/* Half-court, 10px per foot. Baseline at y=0, half-court line at y=470. */

const LINE = "var(--line-strong)";

function Court() {
  return (
    <g fill="none" stroke={LINE} strokeWidth={1.5}>
      <rect x={1} y={1} width={498} height={468} />
      <line x1={0} y1={470} x2={500} y2={470} />
      {/* paint */}
      <rect x={170} y={0} width={160} height={190} />
      {/* free-throw circle */}
      <path d="M190,190 A60 60 0 0 1 310,190" />
      <path d="M190,190 A60 60 0 0 0 310,190" strokeDasharray="6 5" />
      {/* rim + backboard */}
      <circle cx={250} cy={52.5} r={7.5} />
      <line x1={220} y1={40} x2={280} y2={40} />
      {/* restricted-area arc */}
      <path d="M210,52.5 A40 40 0 0 0 290,52.5" />
      {/* three-point line */}
      <path d="M30,0 L30,142 A237.5 237.5 0 0 0 470,142 L470,0" />
    </g>
  );
}

export default function ArtifactShotChart({ zones }: { zones: ShotZone[] }) {
  const maxAtt = Math.max(...zones.map((z) => z.att));
  const px = (x: number) => (x / 100) * 500;
  const py = (y: number) => (y / 100) * 470;

  return (
    <div className="px-4 py-3">
      <svg viewBox="0 0 500 470" className="mx-auto w-full max-w-[420px]" role="img" aria-label="Shot chart">
        <rect x={0} y={0} width={500} height={470} fill="var(--surface)" />
        <Court />
        {zones.map((z, i) => {
          const r = 5 + (z.att / maxAtt) * 9;
          const opacity = 0.3 + (z.pct / 100) * 0.6;
          return (
            <g key={i}>
              <circle
                cx={px(z.x)} cy={py(z.y)} r={r}
                fill="var(--ink)" opacity={opacity}
                stroke="var(--page)" strokeWidth={2}
              />
              {z.att >= 80 && (
                <text
                  x={px(z.x)} y={py(z.y)} textAnchor="middle" dy="0.35em"
                  fontSize={10} fontFamily="var(--font-mono)" fill="var(--page)"
                >
                  {z.pct}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-ink-3">
        <span>size = attempts · brightness = fg%</span>
        <span className="tabular-nums">rim 71% · mid-range 45–54% · above break 36–41%</span>
      </div>
    </div>
  );
}
