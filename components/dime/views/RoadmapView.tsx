"use client";

import { useState } from "react";
import {
  artifactProtocols,
  dataSources,
  openQuestions,
  phases,
} from "@/lib/dime-data-roadmap";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[13.5px] font-semibold text-ink">{children}</h2>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 max-w-[640px] text-[13px] leading-[1.65] text-ink-2">{children}</p>;
}

function ArtifactProtocol() {
  const [tab, setTab] = useState(artifactProtocols[0].key);
  const active = artifactProtocols.find((p) => p.key === tab)!;
  return (
    <div>
      <div className="flex shrink-0 items-center gap-1 overflow-x-auto">
        {artifactProtocols.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setTab(p.key)}
            aria-pressed={tab === p.key}
            className={`h-7 shrink-0 select-none rounded-[7px] px-2.5 text-[12.5px] font-medium transition-colors duration-100 ${
              tab === p.key ? "bg-hover text-ink" : "text-ink-3 hover:text-ink-2"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="mt-2 min-w-0 overflow-x-auto rounded-[10px] border border-line bg-field">
        <pre className="min-w-max px-4 py-3 font-mono text-[12px] leading-[1.6] text-ink-2">
          {active.payload}
        </pre>
      </div>
      <p className="mt-1.5 font-mono text-[11.5px] text-ink-3">{active.note}</p>
    </div>
  );
}

function Streaming() {
  const rows: [string, string][] = [
    ["Today", "Static thread. All artifacts render at once."],
    ["Next", "SSE token stream. Each artifact mounts as its tool call finishes."],
  ];
  return (
    <div className="overflow-hidden rounded-[10px] border border-line">
      <table className="w-full text-[13px]">
        <tbody className="divide-y divide-line">
          {rows.map(([k, v]) => (
            <tr key={k}>
              <td className="w-20 shrink-0 whitespace-nowrap px-4 py-2.5 align-top font-mono text-[12px] text-ink-3">
                {k}
              </td>
              <td className="min-w-0 px-4 py-2.5 text-ink-2">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DataSources() {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-line">
      <table className="w-full min-w-[640px] text-[13px]">
        <thead>
          <tr className="border-b border-line">
            {["View", "Mock today", "Real source", "Status"].map((h) => (
              <th
                key={h}
                className="h-[34px] whitespace-nowrap px-4 text-left text-[12.5px] font-medium text-ink-2"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {dataSources.map((d) => (
            <tr key={d.view} className="transition-colors duration-100 hover:bg-hover">
              <td className="whitespace-nowrap px-4 py-2.5 font-medium text-ink">{d.view}</td>
              <td className="whitespace-nowrap px-4 py-2.5 text-ink-2">{d.today}</td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[12.5px] text-ink-2">
                {d.real}
              </td>
              <td
                className={`whitespace-nowrap px-4 py-2.5 font-mono text-[12px] tabular-nums ${
                  d.status === "ready" ? "text-ink" : "text-ink-3"
                }`}
              >
                {d.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Sequencing() {
  return (
    <ol className="flex flex-col gap-2.5">
      {phases.map((p) => (
        <li
          key={p.n}
          className="flex gap-3 rounded-[10px] border border-line bg-surface px-4 py-3 shadow-hairline"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-[7px] bg-hover font-mono text-[12px] tabular-nums text-ink">
            {p.n}
          </span>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-ink">{p.title}</div>
            <div className="mt-0.5 text-[12.5px] leading-[1.6] text-ink-2">{p.detail}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function OpenQuestions() {
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const decided = openQuestions.filter((q) => decisions[q.key]).length;
  return (
    <div>
      <p className="mb-3 font-mono text-[11.5px] tabular-nums text-ink-3">
        {decided} of {openQuestions.length} decided
      </p>
      <div className="flex flex-col gap-2.5">
        {openQuestions.map((q) => (
          <div
            key={q.key}
            className="rounded-[10px] border border-line bg-surface px-4 py-3 shadow-hairline"
          >
            <div className="text-[13px] font-medium text-ink">{q.question}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {q.options.map((o) => {
                const picked = decisions[q.key] === o;
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() =>
                      setDecisions((d) => ({ ...d, [q.key]: picked ? "" : o }))
                    }
                    aria-pressed={picked}
                    className={`touch-manipulation select-none rounded-[7px] px-2.5 py-1.5 text-[12.5px] font-medium transition-colors duration-100 active:scale-[0.97] ${
                      picked
                        ? "bg-ink text-surface"
                        : "border border-line text-ink-2 hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoadmapView() {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-line bg-page">
      <div className="flex h-11 shrink-0 items-center border-b border-line px-4">
        <h1 className="text-[13.5px] font-medium text-ink">Roadmap</h1>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-4 py-6 sm:px-8">
          <p className="max-w-[640px] text-[13px] leading-[1.65] text-ink-2">
            What this mockup needs to become the product. Nothing below is built yet.
          </p>

          <div className="mt-7">
            <SectionTitle>Artifact protocol</SectionTitle>
            <Body>
              The agent will emit artifacts as JSON inside its stream. The frontend already
              renders these four shapes. Define the schema once and version it, and the UI
              barely changes when the backend goes live. That makes the schema the integration
              decision that matters most.
            </Body>
            <div className="mt-3">
              <ArtifactProtocol />
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-ink-3">
              Mock payloads. Field names are proposals, not final.
            </p>
          </div>

          <div className="mt-7">
            <SectionTitle>Streaming</SectionTitle>
            <Body>
              The staggered reveals in this mockup already mimic the timing. The real product
              wires them to stream events.
            </Body>
            <div className="mt-3">
              <Streaming />
            </div>
          </div>

          <div className="mt-7">
            <SectionTitle>Data sources</SectionTitle>
            <Body>
              Every mock file maps to a real source. Honest about what does not exist yet.
            </Body>
            <div className="mt-3">
              <DataSources />
            </div>
          </div>

          <div className="mt-7">
            <SectionTitle>Static to dynamic</SectionTitle>
            <Body>
              GitHub Pages works because every number is mock. The real product needs accounts,
              saved threads, and live data, so it moves to Vercel where Dime prod already runs.
              Open question: merge this UI into the main Dime frontend repo, or keep it as its
              own app against the agent API.
            </Body>
          </div>

          <div className="mt-7">
            <SectionTitle>Threads, Saved, auth</SectionTitle>
            <Body>
              Tabs and saved analyses are local state. Persisted threads need accounts. Or the
              product stays single-user and they stay local. Your call.
            </Body>
          </div>

          <div className="mt-7">
            <SectionTitle>Design system</SectionTitle>
            <Body>
              The visual language lives in this fork: the table grammar, the artifact cards, the
              mono work-log type. Extract it into Dime's own component set, then delete
              everything from the fork Dime does not use. The upstream demo surfaces go first.
            </Body>
          </div>

          <div className="mt-7">
            <SectionTitle>Sequencing</SectionTitle>
            <div className="mt-3">
              <Sequencing />
            </div>
          </div>

          <div className="mt-7 pb-4">
            <SectionTitle>Open questions</SectionTitle>
            <Body>Tap an option to mark the decision. Local only.</Body>
            <div className="mt-3">
              <OpenQuestions />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
