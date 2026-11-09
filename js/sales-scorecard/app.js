// The Sales Team Scorecard: intake → six sections of four statements → contact step → report.

import { SCALE, CATS, INTAKE, SAMPLE } from "./content.js";
import { band, bandLabel, tier, analyze, contextNotes } from "./scoring.js";
import { esc } from "../lib/html.js";
import { copyText } from "../lib/clipboard.js";
import { checkContact } from "../forms/contact.js";
import { submitNetlifyForm } from "../forms/netlify.js";
import { formatPhoneFieldsAsTyped } from "../forms/phone.js";

const blankAnswers = () => Object.fromEntries(CATS.map((c) => [c.id, [0, 0, 0, 0]]));
const blankIntake = () => ({ company: "", size: "", rev: "", lead: "" });

/** settings = { formName, contact: {name, title, email, booking} } */
export function startScorecard(app, settings) {
  const contact = settings.contact;
  const state = {
    view: "intro", step: 0, intake: blankIntake(), ans: blankAnswers(), sample: false,
    contact: { name: "", email: "", phone: "" }, submitted: false,
  };
  const byId = (id) => document.getElementById(id);

  function show(view) { state.view = view; render(); window.scrollTo(0, 0); }
  function render() {
    if (state.view === "intro") return renderIntro();
    if (state.view === "q") return renderQ();
    if (state.view === "gate") return renderGate();
    return renderReport();
  }

  function renderIntro() {
    const i = state.intake;
    app.innerHTML = `
  <header class="hero">
    <span class="eyebrow">Free 5-minute assessment · 24 questions</span>
    <h1>How strong is your sales engine?</h1>
    <p class="lede">Rate your team across the six areas that decide whether revenue is repeatable. You'll get a scored report with your biggest gaps, quick wins, and a 90-day plan to fix them.</p>
    <p class="byline">Built by ${esc(contact.name)}, ${esc(contact.title)}.</p>
  </header>
  <div class="gets">
    <div><b>Your score by area</b><span class="muted">See where you're strong and where deals are leaking.</span></div>
    <div><b>Specific fixes</b><span class="muted">Every weak answer comes with a concrete next step.</span></div>
    <div><b>A 90-day plan</b><span class="muted">Your top three priorities, sequenced month by month.</span></div>
  </div>
  <div class="areas" aria-label="Areas assessed">${CATS.map((c) => `<span class="tag">${esc(c.name)}</span>`).join("")}</div>
  <form class="panel stack" id="intake" style="margin-top:28px" novalidate>
    <h3>A little about your team</h3>
    <label class="f" for="company">Company name (optional)
      <input type="text" id="company" value="${esc(i.company)}" autocomplete="organization"></label>
    ${INTAKE.map((q) => `<fieldset><legend>${esc(q.label)}</legend><div class="chips">${q.opts.map((o, k) => `
      <label class="chip"><input type="radio" name="${q.id}" id="${q.id}-${k}" value="${esc(o)}" ${i[q.id] === o ? "checked" : ""}><span>${esc(o)}</span></label>`).join("")}</div></fieldset>`).join("")}
    <div class="row">
      <button class="btn" type="submit" id="start">Start the assessment</button>
      <button class="btn ghost" type="button" id="sample">See a sample report</button>
    </div>
  </form>`;
    const f = byId("intake");
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      state.intake.company = byId("company").value.trim();
      INTAKE.forEach((q) => { const c = f.querySelector(`input[name="${q.id}"]:checked`); state.intake[q.id] = c ? c.value : ""; });
      state.sample = false; state.step = 0; show("q");
    });
    byId("sample").addEventListener("click", () => {
      state.intake = { ...SAMPLE.intake };
      Object.keys(SAMPLE.ans).forEach((k) => { state.ans[k] = [...SAMPLE.ans[k]]; });
      state.sample = true; show("report");
    });
  }

  function renderQ() {
    const c = CATS[state.step], a = state.ans[c.id], base = state.step * 4;
    app.innerHTML = `
  <span class="eyebrow">Section ${state.step + 1} of ${CATS.length}</span>
  <div class="progress" aria-hidden="true">${CATS.map((_, k) => `<i class="${k <= state.step ? "done" : ""}"></i>`).join("")}</div>
  <h2 style="margin-top:14px">${esc(c.name)}</h2>
  <p class="hint" style="margin-top:6px">How true is each statement for your team today? Answer for how things actually work, not how they should.</p>
  <form id="qf" style="margin-top:12px" novalidate>
    ${c.qs.map((q, k) => `<fieldset class="q"><legend><span class="n">${String(base + k + 1).padStart(2, "0")}</span>${esc(q.t)}</legend>
      <div class="scale">${SCALE.map(([v, l]) => `<label class="opt"><input type="radio" name="q${k}" id="${c.id}-${k}-${v}" value="${v}" ${a[k] == v ? "checked" : ""}><span><b>${v}</b>${l}</span></label>`).join("")}</div></fieldset>`).join("")}
    <div class="navrow">
      <button type="button" class="btn ghost" id="back">${state.step === 0 ? "Back to start" : "Previous"}</button>
      <button type="submit" class="btn" id="next" ${a.includes(0) ? "disabled" : ""}>${state.step === CATS.length - 1 ? "See my report" : "Next section"}</button>
    </div>
  </form>`;
    const f = byId("qf"), next = byId("next");
    f.addEventListener("change", (e) => {
      const k = +e.target.name.slice(1); a[k] = +e.target.value; next.disabled = a.includes(0);
    });
    f.addEventListener("submit", (e) => {
      e.preventDefault(); if (a.includes(0)) return;
      if (state.step < CATS.length - 1) { state.step++; show("q"); } else show("gate");
    });
    byId("back").addEventListener("click", () => {
      if (state.step === 0) show("intro"); else { state.step--; show("q"); }
    });
  }

  function renderGate() {
    const c = state.contact;
    app.innerHTML = `
  <span class="eyebrow">Last step</span>
  <div class="progress" aria-hidden="true">${CATS.map(() => `<i class="done"></i>`).join("")}</div>
  <h2 style="margin-top:14px">Your report is ready</h2>
  <p class="hint" style="margin-top:6px">Tell us where to reach you and your full scorecard opens on the next screen.</p>
  <form class="panel stack" id="gf" style="margin-top:20px" novalidate>
    <div class="grid2">
      <label class="f" for="lead-name">Your name
        <input type="text" id="lead-name" autocomplete="name" value="${esc(c.name)}" required></label>
      <label class="f" for="lead-email">Work email
        <input type="text" id="lead-email" inputmode="email" autocomplete="email" value="${esc(c.email)}" required></label>
      <label class="f" for="lead-phone">Phone (optional)
        <input type="text" id="lead-phone" inputmode="tel" autocomplete="tel" value="${esc(c.phone)}"></label>
      <label class="f" for="lead-company">Company
        <input type="text" id="lead-company" autocomplete="organization" value="${esc(state.intake.company)}"></label>
    </div>
    <p class="err" id="gerr" aria-live="polite"></p>
    <div class="navrow" style="margin-top:0">
      <button type="button" class="btn ghost" id="gback">Previous</button>
      <button type="submit" class="btn" id="gsend">Show my report</button>
    </div>
    <p class="fine">${esc(contact.name)} will see your results and may follow up once. No spam, and your information is never sold.</p>
  </form>`;
    byId("gback").addEventListener("click", () => { state.view = "q"; state.step = CATS.length - 1; render(); });
    byId("gf").addEventListener("submit", async (e) => {
      e.preventDefault();
      const v = (id) => byId(id).value.trim();
      const checked = checkContact({ name: v("lead-name"), email: v("lead-email"), phone: v("lead-phone") }, "Enter your name to see your report.");
      if (checked.error) { byId("gerr").textContent = checked.error; return; }
      state.contact = checked.contact;
      state.intake.company = v("lead-company");
      const btn = byId("gsend"); btn.disabled = true; btn.textContent = "Building your report…";
      try { await sendLead(); state.submitted = true; } catch (_) { state.submitted = false; }
      show("report");
    });
  }

  function sendLead() {
    const { cats, overall, ranked } = analyze(state.ans);
    const score = Object.fromEntries(cats.map((c) => [c.id, String(c.s)]));
    const i = state.intake, c = state.contact;
    return submitNetlifyForm(settings.formName, {
      name: c.name, email: c.email, phone: c.phone, company: i.company,
      team_size: i.size, revenue: i.rev, sales_lead: i.lead,
      overall: String(overall), tier: tier(overall)[0],
      top_priorities: ranked.slice(0, 3).map((x) => `${x.name} (${x.s})`).join("; "),
      strategy_icp: score.strat, sales_process: score.proc, pipeline_forecasting: score.pipe,
      people_coaching: score.people, prospecting: score.gen, tools_metrics: score.tools,
      answers: cats.map((x) => `${x.name}: ${x.qs.map((q, k) => `Q${k + 1}=${x.a[k]}`).join(", ")}`).join("\n"),
    });
  }

  function ring(score) {
    const r = 62, C = 2 * Math.PI * r, off = C * (1 - score / 100), col = `var(--${band(score)})`;
    return `<svg class="ring" viewBox="0 0 150 150" role="img" aria-label="Overall score ${score} out of 100">
    <circle cx="75" cy="75" r="${r}" fill="none" stroke="var(--line)" stroke-width="12"/>
    <circle cx="75" cy="75" r="${r}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round"
      stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 75 75)"/>
    <text x="75" y="80" text-anchor="middle" font-size="38">${score}</text>
    <text x="75" y="104" text-anchor="middle" font-size="12" style="fill:var(--muted)">out of 100</text></svg>`;
  }

  function summaryText(cats, overall, tname, plan) {
    const i = state.intake;
    return [
      `Sales Team Scorecard${i.company ? " — " + i.company : ""}`,
      `Overall: ${overall}/100 (${tname})`,
      `Team: ${i.size || "n/a"} sellers · Revenue: ${i.rev || "n/a"} · Sales led by: ${i.lead || "n/a"}`,
      ``,
      `Scores by area:`,
      ...cats.map((c) => `- ${c.name}: ${c.s}`),
      ``,
      `Top priorities:`,
      ...plan.map((c, k) => `${k + 1}. ${c.name} (${c.s})`),
    ].join("\n");
  }

  function renderReport() {
    const { cats, overall, ranked } = analyze(state.ans);
    const [tname, tdesc] = tier(overall);
    const who = state.intake.company ? esc(state.intake.company) : "Your team";
    const strengths = cats.filter((c) => c.s >= 60).sort((x, y) => y.s - x.s);
    const quick = cats.flatMap((c) => c.tune.map((q) => ({ c: c.name, q }))).slice(0, 5);
    const plan = ranked.slice(0, 3);
    const months = ["Days 1–30", "Days 31–60", "Days 61–90"];
    const notes = contextNotes(state.intake);

    app.innerHTML = `
  ${state.sample ? `<p class="samplenote" style="margin-bottom:18px">This is a sample report with example answers. Take the assessment to see your own.</p>` : ""}
  <header class="rhead">
    ${ring(overall)}
    <div class="stack" style="gap:10px;min-width:0">
      <span class="eyebrow">Sales Team Scorecard · ${who}</span>
      <h1 style="font-size:clamp(2rem,5vw,2.8rem)">${tname}</h1>
      <p>${tdesc}</p>
      ${notes.map((x) => `<p class="muted">${x}</p>`).join("")}
    </div>
  </header>

  <section class="block">
    <h2>Score by area</h2>
    <div class="bars">${cats.map((c) => `<div class="bar"><span class="lbl">${esc(c.name)}</span>
      <div class="track"><i style="width:${Math.max(c.s, 2)}%;background:var(--${band(c.s)})"></i></div>
      <span class="num">${c.s}</span></div>`).join("")}</div>
    <p class="legend">Dashed line marks 60, the point where an area starts working as a strength. Below 40 is a gap that's likely costing you deals.</p>
  </section>

  <section class="block">
    <h2>Your 90-day plan</h2>
    <p class="muted">Start with your three lowest-scoring areas, one per month.</p>
    <div class="priority">${plan.map((c, k) => {
      const items = (c.gaps.length ? c.gaps : c.tune.length ? c.tune : c.qs).slice(0, 3);
      return `<div class="pcard"><span class="when">${months[k]}</span><h3>${esc(c.name)}</h3>
        <span><span class="pill p-${band(c.s)}">${c.s} · ${bandLabel(c.s)}</span></span>
        <ul>${items.map((q) => `<li>${esc(q.fix)}</li>`).join("")}</ul></div>`; }).join("")}</div>
  </section>

  ${quick.length ? `<section class="block">
    <h2>Quick wins</h2>
    <p class="muted">You're partway there on these. A small push turns each into a strength.</p>
    <ul style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px">${quick.map((x) => `<li><b>${esc(x.c)}:</b> ${esc(x.q.fix)}</li>`).join("")}</ul>
  </section>` : ""}

  ${strengths.length ? `<section class="block">
    <h2>Strengths to build on</h2>
    <ul style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px">${strengths.map((c) => `<li><b>${esc(c.name)} (${c.s}):</b> ${esc(c.high)}</li>`).join("")}</ul>
  </section>` : ""}

  <section class="block">
    <h2>Full playbook by area</h2>
    ${ranked.map((c) => {
      const b = band(c.s), diag = c.s < 40 ? c.low : c.s < 60 ? c.mid : c.high;
      return `<div class="cat s-${b}">
        <div class="top"><h3>${esc(c.name)}</h3><span class="pill p-${b}">${c.s} · ${bandLabel(c.s)}</span></div>
        <p>${esc(diag)}</p>
        ${c.gaps.length ? `<div><p class="sub">Gaps to fix</p><ul>${c.gaps.map((q) => `<li>${esc(q.fix)}</li>`).join("")}</ul></div>` : ""}
        ${c.tune.length ? `<div><p class="sub">Tune up</p><ul>${c.tune.map((q) => `<li>${esc(q.fix)}</li>`).join("")}</ul></div>` : ""}
        <p class="kit">Tools that help: ${esc(c.kit)}</p>
      </div>`; }).join("")}
  </section>

  <section class="block" style="border-bottom:0">
    <div class="cta">
      <span class="eyebrow" style="color:var(--cta-btn)">Next step</span>
      <h2>Want help closing these gaps?</h2>
      <p>GemPoint Sales puts a seasoned, fractional VP of Sales inside B2B teams to install the process, pipeline discipline, and coaching rhythm this report points to, without a full-time hire.
      ${state.submitted ? "We have a copy of your results, so a free 30-minute review can start right where this report ends." : "Copy your results and send them over for a free 30-minute review."}</p>
      ${contact.email ? `<p class="contact">${esc(contact.email)}</p>` : ""}
      <div class="row">
        ${contact.booking ? `<a class="btn" href="${esc(contact.booking)}" target="_blank" rel="noopener">Book a free review</a>` : ""}
        <button class="btn ${contact.booking ? "ghost" : ""}" id="copy" type="button">Copy my results</button>
        <button class="btn ghost" id="retake" type="button">${state.sample ? "Take the assessment" : "Retake"}</button>
      </div>
      <p class="toast" id="toast" aria-live="polite"></p>
      <textarea id="copytext" readonly hidden style="width:100%;min-height:160px;font:inherit;font-size:.85rem;color:var(--ink);background:var(--bg)"></textarea>
    </div>
  </section>`;

    byId("retake").addEventListener("click", () => {
      state.ans = blankAnswers();
      if (state.sample) state.intake = blankIntake();
      state.sample = false; state.submitted = false; state.step = 0; show("intro");
    });
    byId("copy").addEventListener("click", () => {
      const text = summaryText(cats, overall, tname, plan);
      const toast = byId("toast"), ta = byId("copytext");
      copyText(text).then(() => { toast.textContent = "Results copied. Paste them into an email."; }, () => {
        ta.value = text; ta.hidden = false; ta.focus(); ta.select(); toast.textContent = "Select all and copy the text below.";
      });
    });
  }

  formatPhoneFieldsAsTyped(document);
  render();
}
