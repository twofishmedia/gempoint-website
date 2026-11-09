// Turns scorecard answers into scores, bands, a ranking and context notes. No page code here.

import { CATS } from "./content.js";

/** Four answers of 1–5 → score 0–100. */
export const scoreOf = (answers) => Math.round((answers.reduce((a, b) => a + b, 0) / answers.length - 1) / 4 * 100);

/** "bad" | "warn" | "good", used for colours and pills. */
export const band = (score) => score < 40 ? "bad" : score < 60 ? "warn" : "good";
export const bandLabel = (score) => score < 40 ? "Gap" : score < 60 ? "Developing" : "Strength";

/** [name, description] for the overall score. */
export const tier = (score) => score < 40 ? ["Founder-dependent","Sales runs on individual effort, not a system. The upside from building one is large."]
  : score < 60 ? ["Building","Pieces of a system exist. Closing the biggest gaps will make growth more predictable."]
  : score < 80 ? ["Scaling","You have a working system. Targeted fixes will raise win rates and shorten ramp time."]
  : ["Optimized","Your sales engine is strong. Focus on fine-tuning and protecting what works."];

/** Scores each area from {areaId: [four answers]}, with its gaps (≤2) and tune-ups (=3), ranked lowest first. */
export function analyze(answers) {
  const cats = CATS.map((c) => {
    const a = answers[c.id], s = scoreOf(a);
    return { ...c, a, s, gaps: c.qs.filter((q, k) => a[k] <= 2), tune: c.qs.filter((q, k) => a[k] === 3) };
  });
  const overall = Math.round(cats.reduce((t, c) => t + c.s, 0) / cats.length);
  const ranked = [...cats].sort((x, y) => x.s - y.s);
  return { cats, overall, ranked };
}

/** Extra advice based on who leads sales and how big the team is. */
export function contextNotes(intake) {
  const notes = [];
  if (intake.lead === "Founder / owner") notes.push("Sales is founder-led. The biggest lever is getting what's in your head onto paper so others can sell without you.");
  if (intake.lead === "No one specifically") notes.push("No one owns sales leadership. A fractional sales leader can install the system without the cost of a full-time hire.");
  if (intake.size === "6–10" || intake.size === "11+") notes.push("With a team this size, inconsistent process costs more every month. Standardizing now pays off quickly.");
  return notes;
}
