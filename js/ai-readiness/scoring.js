// Turns answers into scores, bands and the bottleneck. No page or storage code here.

import { AREAS, FOUNDATION } from "./content.js";

/** Answer index 0–3 → score 0–100. */
export const areaScore = (answer) => Math.round(answer / 3 * 100);

/** "bad" | "warn" | "good", used for colours and pills. */
export const band = (score) => score < 40 ? "bad" : score < 67 ? "warn" : "good";
export const bandLabel = (score) => score < 40 ? "Gap" : score < 67 ? "Developing" : "Strength";

/** [name, description] for the overall score. */
export const tier = (score) => score < 40 ? ["Getting started","AI could help, but the foundations aren't there yet. Fix the basics first so your first projects don't stall."]
  : score < 60 ? ["Laying the groundwork","Some pieces are in place. Close your biggest gap and you'll be ready to run a real pilot."]
  : score < 80 ? ["Ready to pilot","Your foundations can support focused AI projects. Pick one with a clear goal and measure it."]
  : ["Ready to scale","You're well set up. The opportunity now is rolling AI out across teams with consistent rules."];

/** Scores every area from {areaId: answerIndex} and picks the bottleneck. */
export function analyze(answers) {
  const areas = AREAS.map((a) => ({ ...a, v: answers[a.id], s: areaScore(answers[a.id]) }));
  const overall = Math.round(areas.reduce((t, a) => t + a.s, 0) / areas.length);
  const low = Math.min(...areas.map((a) => a.s));
  const bottleneck = FOUNDATION.map((id) => areas.find((a) => a.id === id)).find((a) => a.s === low);
  return { areas, overall, bottleneck };
}
