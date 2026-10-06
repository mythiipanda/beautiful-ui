import { awards, exploreRows, tonightGames } from "./dime-data";

function norm(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const ALIASES: [string[], number][] = [
  [["sga", "shai", "gilgeous"], 0],
  [["luka", "doncic"], 1],
  [["jokic"], 2],
  [["tatum"], 3],
  [["giannis", "antetokounmpo"], 4],
  [["edwards", "ant-man"], 5],
  [["durant", "kd"], 6],
  [["curry", "steph"], 7],
];

function playerReply(i: number): string {
  const p = exploreRows[i];
  const net = (p.net > 0 ? "+" : "") + p.net.toFixed(1);
  return (
    `${p.name} (${p.team}) is at ${p.ppg.toFixed(1)} points per game on ${p.ts.toFixed(1)}% true shooting ` +
    `across ${p.gp} games, carrying a ${p.usg.toFixed(1)}% usage rate. ` +
    `The on-court number sits at ${net} per 100 possessions, which is the figure to watch if the role changes.`
  );
}

function tonightReply(): string {
  const n = tonightGames.length;
  const withTotals = tonightGames.map((g) => ({ g, total: parseFloat(g.ou.replace(/[^0-9.]/g, "")) }));
  const hi = withTotals.reduce((a, b) => (b.total > a.total ? b : a));
  const first = tonightGames[0];
  const late = tonightGames[2];
  return (
    `${n} games on tonight's slate. ${first.away} visit ${first.home} at ${first.time} with ${first.line} on the board` +
    `${first.note ? ` and ${first.note.toLowerCase()}` : ""}. ` +
    `The late window is ${late.away} at ${late.home} (${late.line}, ${late.time}). ` +
    `Highest total is ${hi.g.away} at ${hi.g.home} at ${hi.g.ou.replace("O/U ", "")}.`
  );
}

function awardsReply(): string {
  const top = awards.slice(0, 4);
  const line = top.map((a) => `${a.player} ${a.rating}`).join(", ");
  const mover = [...awards].sort((a, b) => b.trend - a.trend)[0];
  return (
    `The ladder reads ${line}. ` +
    `${mover.player} is the mover, up ${mover.trend.toFixed(0)} to ${mover.rating} after the last week of games.`
  );
}

function fallbackReply(q: string): string {
  const sga = exploreRows[0];
  const luka = exploreRows[1];
  const jokic = exploreRows[2];
  const variants = [
    `On raw scoring it stays tight at the top. ${sga.name} is at ${sga.ppg.toFixed(1)} per game on ` +
      `${sga.ts.toFixed(1)}% true shooting; ${luka.name} answers with ${luka.ppg.toFixed(1)} on ` +
      `${luka.ts.toFixed(1)}%. The gap is team context: +${sga.net.toFixed(1)} versus +${luka.net.toFixed(1)} per 100 with each on the floor.`,
    `Eight qualified scorers sit above 26 points per game. ${sga.name} leads at ${sga.ppg.toFixed(1)}, ` +
      `${luka.name} is next at ${luka.ppg.toFixed(1)}, and ${jokic.name} pairs ${jokic.ppg.toFixed(1)} per game ` +
      `with a group-best ${jokic.ts.toFixed(1)}% true shooting mark.`,
    `Start with tonight's board: ${tonightGames.length} games, and the ${tonightGames[4].away} at ` +
      `${tonightGames[4].home} matchup carries the night's highest total at ` +
      `${tonightGames[4].ou.replace("O/U ", "")}. Ask about a player and I will pull the scoring line.`,
  ];
  let h = 0;
  for (let i = 0; i < q.length; i++) h = (h * 31 + q.charCodeAt(i)) >>> 0;
  return variants[h % variants.length];
}

export function mockReply(question: string): string {
  const q = norm(question);
  for (const [keys, i] of ALIASES) {
    if (keys.some((k) => q.includes(k))) return playerReply(i);
  }
  if (/(tonight|slate|schedule|games today|games tonight)/.test(q)) return tonightReply();
  if (/(mvp|award|ladder|rankings?)/.test(q)) return awardsReply();
  if (/(defen|matchup|clutch|shot chart)/.test(q)) {
    const sga = exploreRows[0];
    const luka = exploreRows[1];
    return (
      `The mock cut only carries scoring and efficiency, so here is the honest slice. ` +
      `${sga.name}: ${sga.ppg.toFixed(1)} per game on ${sga.ts.toFixed(1)}% true shooting, +${sga.net.toFixed(1)} per 100. ` +
      `${luka.name}: ${luka.ppg.toFixed(1)} on ${luka.ts.toFixed(1)}%, +${luka.net.toFixed(1)} per 100.`
    );
  }
  return fallbackReply(question);
}
