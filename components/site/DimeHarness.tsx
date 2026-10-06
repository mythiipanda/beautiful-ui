"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import ThinkingState from "@/components/primitives/ThinkingState";
import ToolChips, { type ToolStep } from "@/components/primitives/ToolChips";
import ArtifactShell from "@/components/dime/ArtifactShell";
import ArtifactCompare from "@/components/dime/ArtifactCompare";
import ArtifactChart from "@/components/dime/ArtifactChart";
import ArtifactShotChart from "@/components/dime/ArtifactShotChart";
import ArtifactTable, { type ArtifactColumn } from "@/components/dime/ArtifactTable";
import DimeSidebar from "@/components/site/DimeSidebar";
import TonightView from "@/components/dime/views/TonightView";
import ExploreView from "@/components/dime/views/ExploreView";
import MatchupsView from "@/components/dime/views/MatchupsView";
import LineupsView from "@/components/dime/views/LineupsView";
import TradesView from "@/components/dime/views/TradesView";
import AwardsView from "@/components/dime/views/AwardsView";
import PropsView from "@/components/dime/views/PropsView";
import SavedView from "@/components/dime/views/SavedView";
import WarehouseView from "@/components/dime/views/WarehouseView";
import {
  answerText,
  compareRows,
  exploreRows,
  followUps,
  lukaTrend,
  sgaTrend,
  sgaZones,
  thinkRows,
  tonightGames,
} from "@/lib/dime-data";

/* ── Dime harness: the demo re-skinned as Dime, an AI analyst
 * workbench for NBA data. Agent output renders as artifacts;
 * everything below uses Beautiful UI tokens, nothing else. ── */

function Ico({ d, size = 15 }: { d: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d}</svg>
  );
}

const TOOL_STEPS: ToolStep[] = [
  {
    icon: "read", label: "boxscores.query", chip: "per-game scoring · last 30", mono: true, detailMono: true,
    detail: [
      { text: "SELECT player, AVG(pts), AVG(ts_pct)" },
      { text: "FROM silver_boxscores · 2 rows · 412ms" },
    ],
  },
  {
    icon: "read", label: "lineups.query", chip: "on/off net rating", mono: true, detailMono: true,
    detail: [
      { text: "SELECT on_court_net, off_court_net" },
      { text: "FROM silver_lineups · 2 rows · 388ms" },
    ],
  },
  {
    icon: "write", label: "artifact.build", chip: "scoring trend · last 15", mono: true, detailMono: false,
    detail: [{ text: "2 series rendered · pts by game" }],
  },
];

const TABLE_COLS: ArtifactColumn[] = [
  { key: "player", label: "Player" },
  { key: "team", label: "Team" },
  { key: "gp", label: "GP", numeric: true },
  { key: "ppg", label: "PPG", numeric: true },
  { key: "ts", label: "TS%", numeric: true },
  { key: "usg", label: "USG%", numeric: true },
  { key: "net", label: "Net/100", numeric: true },
];
type PlayerTuple = [string, string, number, number, number, number, number];
const TABLE_ROWS: PlayerTuple[] = exploreRows.map((r) => [r.name, r.team, r.gp, r.ppg, r.ts, r.usg, r.net]);

function renderPlayerCell(row: PlayerTuple, col: number) {
  if (col === 0) return <span className="font-medium text-ink">{row[0]}</span>;
  if (col === 1) return <span className="text-ink-2">{row[1]}</span>;
  if (col === 3) return <span className="text-ink">{row[3].toFixed(1)}</span>;
  if (col === 6)
    return (
      <span className={row[6] >= 9 ? "text-green" : "text-ink-2"}>
        {row[6] > 0 ? "+" : ""}{row[6].toFixed(1)}
      </span>
    );
  const v = row[col];
  return <span className="text-ink-2">{typeof v === "number" ? v.toFixed(col === 2 ? 0 : 1) : v}</span>;
}

function TonightStrip() {
  return (
    <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
      {tonightGames.map((g) => (
        <div key={g.away + g.home} className="min-w-0 bg-surface px-3.5 py-2.5 transition-colors duration-100 hover:bg-hover">
          <div className="flex items-center gap-1.5">
            {g.live && <span className="size-1.5 shrink-0 rounded-full bg-red" />}
            <span className="truncate text-[13px] font-medium text-ink">
              {g.away}<span className="font-normal text-ink-3"> @ </span>{g.home}
            </span>
            <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-ink-3">{g.time}</span>
          </div>
          <div className="mt-1 truncate font-mono text-[11px] tabular-nums text-ink-2">
            {g.line}<span className="text-ink-3"> · {g.ou}</span>
          </div>
          {g.note && <div className="mt-0.5 truncate text-[11px] text-ink-3">{g.note}</div>}
        </div>
      ))}
    </div>
  );
}

function DimeComposer({
  draft,
  setDraft,
  onSubmit,
  inputRef,
}: {
  draft: string;
  setDraft: (v: string) => void;
  onSubmit: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const canSend = draft.trim().length > 0;
  return (
    <div className="rounded-control border border-line bg-field p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.035)] transition-[border-color,box-shadow] duration-150 focus-within:border-line-strong">
      <textarea
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder="Ask about any team, player, lineup, or market…"
        rows={1}
        className="w-full resize-none bg-transparent px-1 pt-0.5 text-[13.5px] leading-[1.5] text-ink placeholder:text-ink-3 focus:outline-none"
      />
      <div className="flex items-center justify-end px-1 pb-0.5 pt-1.5">
        <button
          type="button"
          aria-label="Send"
          disabled={!canSend}
          onClick={onSubmit}
           className="flex size-7 items-center justify-center rounded-[8px]
            transition-[background-color,color,transform] duration-150 enabled:active:scale-[0.96]"
          style={{
            background: canSend ? "var(--ink)" : "var(--line-strong)",
            color: canSend ? "var(--surface)" : "var(--ink-2)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

type Tab = { id: string; label: string };

type ViewKey =
  | "tonight"
  | "explore"
  | "matchups"
  | "lineups"
  | "trades"
  | "awards"
  | "props"
  | "saved"
  | "warehouse";

const VIEWS: Record<ViewKey, ComponentType> = {
  tonight: TonightView,
  explore: ExploreView,
  matchups: MatchupsView,
  lineups: LineupsView,
  trades: TradesView,
  awards: AwardsView,
  props: PropsView,
  saved: SavedView,
  warehouse: WarehouseView,
};

const SHELLED_VIEWS: ReadonlySet<ViewKey> = new Set(["props", "saved", "warehouse"]);
const FLEX_VIEWS: ReadonlySet<ViewKey> = new Set(["lineups", "trades", "awards"]);

function renderView(key: ViewKey) {
  const View = VIEWS[key];
  if (SHELLED_VIEWS.has(key)) return <View key={key} />;
  if (FLEX_VIEWS.has(key))
    return (
      <div
        key={key}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-line bg-page"
      >
        <View />
      </div>
    );
  return (
    <div
      key={key}
      className="min-h-0 min-w-0 flex-1 overflow-y-auto rounded-[14px] border border-line bg-page"
    >
      <View />
    </div>
  );
}

export default function DimeHarness() {
  const [tabs, setTabs] = useState<Tab[]>([{ id: "t1", label: "SGA vs Luka — Oct 6" }]);
  const [activeTab, setActiveTab] = useState("t1");
  const [activeView, setActiveView] = useState<"chat" | ViewKey>("chat");
  const [messages, setMessages] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const addTab = () => {
    const id = `t${Date.now()}`;
    setTabs((t) => [...t, { id, label: "New analysis" }]);
    setActiveTab(id);
  };

  const submit = () => {
    const q = draft.trim();
    if (!q) return;
    setMessages((m) => [...m, q]);
    setDraft("");
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages]);

  const pickFollowUp = (f: string) => {
    setDraft(f);
    inputRef.current?.focus();
  };

  return (
    <main className="flex h-[100dvh] gap-0 overscroll-none bg-canvas p-2.5 text-ink lg:pl-0">
      <DimeSidebar
        activeNav={activeView}
        onNavChange={(key: string) => setActiveView(key as "chat" | ViewKey)}
        onNewAnalysis={() => {
          setActiveView("chat");
          addTab();
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex min-h-0 flex-1 gap-2.5">
          {activeView === "chat" ? (
          <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-line bg-page">
            <div className="flex h-11 shrink-0 items-center gap-1 overflow-x-auto border-b border-line px-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex h-7 shrink-0 items-center gap-2 rounded-[7px] px-2.5 text-[12.5px] font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.97] ${
                    activeTab === t.id ? "bg-hover text-ink" : "text-ink-3 hover:bg-hover hover:text-ink-2"
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <button
                type="button"
                aria-label="New tab"
                onClick={addTab}
                className="flex size-7 shrink-0 items-center justify-center rounded-[7px] text-ink-3 transition-[background-color,color,transform] duration-150 hover:bg-hover hover:text-ink active:scale-[0.94]"
              >
                <Ico d={<path d="M12 5v14M5 12h14" />} size={14} />
              </button>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[760px] px-4 py-8 sm:px-8">
                <div className="flex justify-end pl-10 sm:pl-24" style={{ animation: "fade-up 280ms cubic-bezier(0.23,1,0.32,1) both" }}>
                  <div className="rounded-xl bg-field px-3.5 py-2 text-[13px] leading-relaxed text-ink shadow-hairline">
                    Compare SGA and Luka this season — scoring, efficiency, and team impact.
                  </div>
                </div>

                <div className="mt-2">
                  <ThinkingState variant="Steps" rows={thinkRows} done="Thought for 6 seconds" />
                </div>

                <div className="mt-3">
                  <ToolChips
                    steps={TOOL_STEPS}
                    diffs={[]}
                    labels={{ header: "3 warehouse calls", more: "" }}
                  />
                </div>

                <div className="mt-5 flex flex-col gap-4">
                  <ArtifactShell title="Scoring & efficiency — last 30 games" source="silver_boxscores" delay={0}>
                    <ArtifactCompare rows={compareRows} aName="SGA" bName="Dončić" />
                  </ArtifactShell>
                  <ArtifactShell title="Scoring trend — last 15 games" source="silver_boxscores" delay={40}>
                    <ArtifactChart
                      series={[
                        { name: "Gilgeous-Alexander", tone: "ink", values: sgaTrend },
                        { name: "Dončić", tone: "muted", values: lukaTrend },
                      ]}
                      footnote="points per game · last 15"
                    />
                  </ArtifactShell>
                  <ArtifactShell title="Shot chart — Gilgeous-Alexander" source="tracking feed" delay={80}>
                    <ArtifactShotChart zones={sgaZones} />
                  </ArtifactShell>
                </div>

                <p className="mt-5 max-w-[620px] text-[13.5px] leading-[1.65] text-ink-2">{answerText}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {followUps.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => pickFollowUp(f)}
                      className="rounded-full bg-surface px-3 py-1.5 text-left text-[12px] text-ink shadow-btn transition-[background-color,transform] duration-150 hover:bg-hover active:scale-[0.97]"
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <ArtifactShell title="League scoring" source="silver_boxscores · 8 of 330,485 rows" delay={120}>
                    <ArtifactTable columns={TABLE_COLS} rows={TABLE_ROWS} renderCell={renderPlayerCell} />
                  </ArtifactShell>
                </div>

                <div className="mt-4">
                  <ArtifactShell title="Tonight" source="silver_schedule · 6 games" delay={160}>
                    <TonightStrip />
                  </ArtifactShell>
                </div>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className="mt-4 flex justify-end pl-10 sm:pl-24"
                    style={{ animation: "fade-up 280ms cubic-bezier(0.23,1,0.32,1) both" }}
                  >
                    <div className="rounded-xl bg-field px-3.5 py-2 text-[13px] leading-relaxed text-ink shadow-hairline">
                      {m}
                    </div>
                  </div>
                ))}
                <div className="h-6" />
              </div>
            </div>

            <div className="shrink-0 px-4 pb-4">
              <div className="mx-auto max-w-[760px]">
                <DimeComposer draft={draft} setDraft={setDraft} onSubmit={submit} inputRef={inputRef} />
              </div>
            </div>
          </section>
          ) : (
            renderView(activeView)
          )}
        </div>
      </div>
    </main>
  );
}
