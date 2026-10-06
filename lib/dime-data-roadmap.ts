export type ArtifactProtocol = {
  key: string;
  label: string;
  payload: string;
  note: string;
};

export const artifactProtocols: ArtifactProtocol[] = [
  {
    key: "table",
    label: "Table",
    payload: `{
  "type": "table",
  "title": "League scoring, last 30",
  "source": "silver_boxscores",
  "columns": [
    { "key": "player", "label": "Player" },
    { "key": "ppg", "label": "PPG", "numeric": true },
    { "key": "ts", "label": "TS%", "numeric": true }
  ],
  "rows": [
    { "player": "Gilgeous-Alexander", "team": "OKC", "ppg": 32.7, "ts": 0.618 },
    { "player": "Doncic", "team": "LAL", "ppg": 30.1, "ts": 0.601 }
  ]
}`,
    note: "The agent sends data. The UI owns sorting, formatting, and the table grammar.",
  },
  {
    key: "chart",
    label: "Chart",
    payload: `{
  "type": "chart",
  "title": "Scoring trend, last 15",
  "source": "silver_boxscores",
  "x": "game",
  "series": [
    { "name": "Gilgeous-Alexander", "tone": "ink", "values": [31, 28, 35] },
    { "name": "Doncic", "tone": "muted", "values": [29, 33, 27] }
  ],
  "footnote": "points per game"
}`,
    note: "Named series with tones. The UI owns scales, axes, and the ink/muted mapping.",
  },
  {
    key: "shotchart",
    label: "Shot chart",
    payload: `{
  "type": "shotchart",
  "title": "Shot chart, Gilgeous-Alexander",
  "source": "tracking feed",
  "zones": [
    { "id": "rim", "label": "Rim", "attempts": 214, "fg_pct": 0.682, "x": 0.5, "y": 0.92 },
    { "id": "mid", "label": "Midrange", "attempts": 168, "fg_pct": 0.512, "x": 0.5, "y": 0.55 }
  ]
}`,
    note: "Zones carry their own coordinates and percentages. The UI owns the court geometry.",
  },
  {
    key: "compare",
    label: "Compare",
    payload: `{
  "type": "compare",
  "title": "SGA vs Doncic",
  "source": "silver_boxscores",
  "a": "Gilgeous-Alexander",
  "b": "Doncic",
  "rows": [
    { "label": "PPG", "a": 32.7, "b": 30.1, "better": "higher" },
    { "label": "TS%", "a": 0.618, "b": 0.601, "better": "higher" },
    { "label": "TOV", "a": 2.4, "b": 3.8, "better": "lower" }
  ]
}`,
    note: "Each row declares which direction is better. The UI owns the bars and the leader mark.",
  },
];

export type DataSource = {
  view: string;
  today: string;
  real: string;
  status: "ready" | "needs pipeline" | "needs accounts" | "needs a call" | "needs integration";
};

export const dataSources: DataSource[] = [
  { view: "Chat", today: "Hardcoded thread", real: "v2 agent stream", status: "needs integration" },
  { view: "Tonight", today: "7 mock games", real: "silver_schedule + odds feed", status: "needs a call" },
  { view: "Explore", today: "24 mock players", real: "silver_boxscores", status: "ready" },
  { view: "Matchups", today: "4 mock matchups", real: "silver_boxscores, silver_schedule", status: "ready" },
  { view: "Lineups", today: "15 mock lineups", real: "silver_lineups", status: "ready" },
  { view: "Trades", today: "Mock rosters", real: "Salary table", status: "needs pipeline" },
  { view: "Awards", today: "Mock ladders", real: "Odds feed", status: "needs a call" },
  { view: "Props", today: "20 mock props", real: "silver_boxscores + lines feed", status: "needs a call" },
  { view: "Saved", today: "6 mock threads", real: "Threads API", status: "needs accounts" },
  { view: "Warehouse", today: "7 mock tables", real: "DuckDB metadata", status: "ready" },
];

export type Phase = {
  n: string;
  title: string;
  detail: string;
};

export const phases: Phase[] = [
  {
    n: "1",
    title: "Chat + artifacts on the real agent",
    detail: "The ask, watch it work, get artifacts loop is the product. Everything else can wait.",
  },
  {
    n: "2",
    title: "Tonight, Explore, Matchups on warehouse data",
    detail: "Read-only views against tables that already exist. No new pipelines.",
  },
  {
    n: "3",
    title: "Lineups, Trades, Awards, Props",
    detail: "Needs the salary table and the odds decision from below.",
  },
  {
    n: "4",
    title: "Saved, Warehouse browser",
    detail: "Saved needs accounts. The warehouse browser needs a metadata API on DuckDB.",
  },
];

export type OpenQuestion = {
  key: string;
  question: string;
  options: string[];
};

export const openQuestions: OpenQuestion[] = [
  {
    key: "fork",
    question: "The fork",
    options: ["Merge into dime", "Stay separate"],
  },
  {
    key: "accounts",
    question: "Accounts",
    options: ["Per-user login", "Single-user"],
  },
  {
    key: "odds",
    question: "Odds feed",
    options: ["Licensed", "Scraped", "Manual"],
  },
  {
    key: "salaries",
    question: "Salaries",
    options: ["Build the pipeline", "Static data is fine"],
  },
];
