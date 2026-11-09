// The AI Readiness Check: intro → six scored questions → two "your AI picture" steps → contact step → report.
// One engine for every brand; a brand file (js/ai-readiness/brands/) supplies the name, contact details,
// Netlify form, referral handling and the few sentences that differ.

import { AREAS, SIZES, HOPES, EXTRAS, TIMELINES, TOTAL_STEPS, SAMPLE, blankExtra } from "./content.js";
import { band, bandLabel, tier, analyze } from "./scoring.js";
import { esc } from "../lib/html.js";
import { copyText } from "../lib/clipboard.js";
import { checkContact } from "../forms/contact.js";
import { submitNetlifyForm } from "../forms/netlify.js";
import { formatPhoneFieldsAsTyped } from "../forms/phone.js";

/**
 * brand = {
 *   formName,                       Netlify form that receives leads
 *   contact: {name, email, booking}, shown on the report; email and booking may be ""
 *   progress: "facets" | "lines",   style of the question progress marks
 *   partner(): {code, name} | null, who referred this visitor
 *   showPartnerBadge,               show "Shared with you by …" on the intro
 *   text: { introFooter, gateNotice(partner), ctaBody(partner) }   plain text, escaped here
 * }
 */
export function startAiReadiness(app, brand) {
  const state = {
    view: "intro", step: 0, ans: {}, extra: blankExtra(), sample: false,
    partner: brand.partner(),
    contact: { name: "", email: "", phone: "", company: "", size: "" },
    submitted: false,
  };
  const contact = brand.contact;
  const byId = (id) => document.getElementById(id);

  function go(view) { state.view = view; render(); window.scrollTo(0, 0); }
  function render() { ({ intro: renderIntro, q: renderQ, gate: renderGate, report: renderReport })[state.view](); }

  function renderIntro() {
    const partnerName = state.partner && state.partner.name;
    app.innerHTML = `
  <header class="hero">
    ${brand.showPartnerBadge && partnerName ? `<span class="partner">Shared with you by <b>${esc(partnerName)}</b></span>` : ""}
    <span class="eyebrow">Free AI readiness check · 8 questions · 3 minutes</span>
    <h1>Is your business ready for AI?</h1>
    <p class="lede">Answer eight quick questions about how your company runs and how you use AI today. You'll get a readiness score, the area holding you back most, and one task to start on this week.</p>
  </header>
  <div class="gets">
    <div><b>A score out of 100</b><span>Where you stand across six areas that decide whether AI pays off.</span></div>
    <div><b>Your biggest bottleneck</b><span>The one area slowing everything else down.</span></div>
    <div><b>One task, three steps</b><span>A concrete first move you can start without buying anything.</span></div>
    <div><b>Take it with you</b><span>A ready-made prompt to rerun this in ChatGPT, Claude, Copilot or Gemini.</span></div>
  </div>
  <div class="areas" aria-label="Areas assessed">${AREAS.map((a) => `<span class="tag">${a.name}</span>`).join("")}</div>
  <div class="row">
    <button class="btn" type="button" id="start">Start the assessment</button>
    <button class="btn ghost" type="button" id="sample">See a sample report</button>
  </div>
  <p class="fine" style="margin-top:20px">${esc(brand.text.introFooter)}</p>`;
    byId("start").addEventListener("click", () => { state.sample = false; state.step = 0; go("q"); });
    byId("sample").addEventListener("click", () => {
      state.sample = true;
      state.ans = { ...SAMPLE.ans };
      state.extra = JSON.parse(JSON.stringify(SAMPLE.extra));
      state.contact = { ...state.contact, company: SAMPLE.company, size: SAMPLE.size };
      go("report");
    });
  }

  function progress(doneThrough) {
    const cls = brand.progress === "lines" ? "facets lines" : "facets";
    const marks = Array.from({ length: TOTAL_STEPS }, (x, k) => {
      if (doneThrough === "all") return `<i class="done"></i>`;
      return `<i class="${k < state.step ? "done" : k === state.step ? "now" : ""}"></i>`;
    });
    return `<div class="${cls}" aria-hidden="true">${marks.join("")}</div>`;
  }

  function renderQ() {
    if (state.step >= AREAS.length) return renderExtra();
    const a = AREAS[state.step], cur = state.ans[a.id];
    app.innerHTML = `
  <span class="eyebrow">Question ${state.step + 1} of ${TOTAL_STEPS}</span>
  ${progress()}
  <div class="qcard">
    <span class="qarea">${a.name}</span>
    <h2 id="qh">${esc(a.q)}</h2>
    <div class="choices" role="group" aria-labelledby="qh">
      ${a.opts.map((o, k) => `<button type="button" class="choice" id="${a.id}-${k}" data-v="${k}" aria-pressed="${cur === k}"><span class="dot" aria-hidden="true"></span><span>${esc(o)}</span></button>`).join("")}
    </div>
    <div class="navrow">
      <button type="button" class="btn ghost" id="back">${state.step === 0 ? "Back to start" : "Previous"}</button>
      <button type="button" class="btn" id="next" ${cur === undefined ? "disabled" : ""}>Next</button>
    </div>
  </div>`;
    app.querySelectorAll(".choice").forEach((b) => b.addEventListener("click", () => {
      state.ans[a.id] = +b.dataset.v;
      app.querySelectorAll(".choice").forEach((x) => x.setAttribute("aria-pressed", x === b));
      byId("next").disabled = false;
      setTimeout(advance, 260);
    }));
    byId("next").addEventListener("click", advance);
    byId("back").addEventListener("click", () => { if (state.step === 0) go("intro"); else { state.step--; go("q"); } });
  }

  function advance() {
    if (state.view !== "q" || state.step >= AREAS.length || state.ans[AREAS[state.step].id] === undefined) return;
    state.step++; go("q");
  }

  function extraDone(x) {
    const e = state.extra;
    return x.groups.every((g) => e[g.key].length > 0) && (!x.timeline || e.timeline);
  }

  function renderExtra() {
    const x = EXTRAS[state.step - AREAS.length], e = state.extra, last = state.step === TOTAL_STEPS - 1;
    app.innerHTML = `
  <span class="eyebrow">Question ${state.step + 1} of ${TOTAL_STEPS}</span>
  ${progress()}
  <div class="qcard">
    <span class="qarea">Your AI picture</span>
    <h2>${esc(x.title)}</h2>
    <p class="hint">${esc(x.sub)}</p>
    ${x.groups.map((g) => `<div class="group" role="group" aria-labelledby="g-${g.key}">
      <span class="glabel" id="g-${g.key}">${esc(g.label)}${g.max ? ` <span class="hint" id="cnt-${g.key}">(${e[g.key].length} of ${g.max})</span>` : ""}</span>
      <div class="multi">${g.opts.map((o, k) => `<button type="button" class="choice" id="${g.key}-${k}" data-g="${g.key}" data-o="${esc(o)}" aria-pressed="${e[g.key].includes(o)}"><span class="box" aria-hidden="true"></span><span>${esc(o)}</span></button>`).join("")}</div>
    </div>`).join("")}
    ${x.other ? `<label class="f" for="hopes-other">Anything else you'd like AI to help with? (optional)<textarea class="other" id="hopes-other">${esc(e.other)}</textarea></label>` : ""}
    ${x.timeline ? `<div class="group" role="group" aria-labelledby="g-tl"><span class="glabel" id="g-tl">When would you like to act on this?</span>
      <div class="multi three">${TIMELINES.map((t, k) => `<button type="button" class="choice" id="tl-${k}" data-tl="${esc(t)}" aria-pressed="${e.timeline === t}"><span class="dot" aria-hidden="true"></span><span>${esc(t)}</span></button>`).join("")}</div></div>` : ""}
    <div class="navrow">
      <button type="button" class="btn ghost" id="back">Previous</button>
      <button type="button" class="btn" id="next" ${extraDone(x) ? "" : "disabled"}>${last ? "See my results" : "Next"}</button>
    </div>
  </div>`;
    const next = byId("next");
    const groupOf = (k) => x.groups.find((g) => g.key === k);
    app.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
      const g = groupOf(b.dataset.g), list = e[g.key], o = b.dataset.o;
      let sel = list.includes(o) ? list.filter((v) => v !== o) : [...list, o];
      if (g.none) { if (o === g.none) sel = list.includes(o) ? [] : [g.none]; else sel = sel.filter((v) => v !== g.none); }
      if (g.max && sel.length > g.max) sel = sel.slice(sel.length - g.max);
      e[g.key] = sel;
      app.querySelectorAll(`[data-g="${g.key}"]`).forEach((c) => c.setAttribute("aria-pressed", sel.includes(c.dataset.o)));
      const cnt = byId("cnt-" + g.key); if (cnt) cnt.textContent = `(${sel.length} of ${g.max})`;
      next.disabled = !extraDone(x);
    }));
    app.querySelectorAll("[data-tl]").forEach((b) => b.addEventListener("click", () => {
      e.timeline = b.dataset.tl;
      app.querySelectorAll("[data-tl]").forEach((c) => c.setAttribute("aria-pressed", c === b));
      next.disabled = !extraDone(x);
    }));
    const other = byId("hopes-other");
    if (other) other.addEventListener("input", () => { e.other = other.value.slice(0, 1000); });
    next.addEventListener("click", () => { if (!extraDone(x)) return; if (last) go("gate"); else { state.step++; go("q"); } });
    byId("back").addEventListener("click", () => { state.step--; go("q"); });
  }

  function renderGate() {
    const c = state.contact;
    app.innerHTML = `
  <span class="eyebrow">Last step</span>
  ${progress("all")}
  <h2 style="margin-top:16px">Your results are ready</h2>
  <p class="muted" style="margin-top:8px">Tell us where to send a copy and your full report opens on the next screen.</p>
  <form class="panel stack" id="gf" style="margin-top:20px" novalidate>
    <div class="grid2">
      <label class="f" for="lead-name">Your name<input type="text" id="lead-name" autocomplete="name" value="${esc(c.name)}"></label>
      <label class="f" for="lead-email">Work email<input type="text" id="lead-email" inputmode="email" autocomplete="email" value="${esc(c.email)}"></label>
      <label class="f" for="lead-company">Company<input type="text" id="lead-company" autocomplete="organization" value="${esc(c.company)}"></label>
      <label class="f" for="lead-size">Number of employees
        <select id="lead-size"><option value="">Choose one</option>${SIZES.map((s) => `<option ${c.size === s ? "selected" : ""}>${s}</option>`).join("")}</select></label>
      <label class="f" for="lead-phone">Phone (optional)<input type="text" id="lead-phone" inputmode="tel" autocomplete="tel" value="${esc(c.phone)}"></label>
    </div>
    <p class="err" id="gerr"></p>
    <div class="navrow" style="margin-top:0">
      <button type="button" class="btn ghost" id="gback">Previous</button>
      <button type="submit" class="btn" id="gsend">Show my results</button>
    </div>
    <p class="fine">${esc(brand.text.gateNotice(state.partner))}</p>
  </form>`;
    byId("gback").addEventListener("click", () => { state.step = TOTAL_STEPS - 1; go("q"); });
    byId("gf").addEventListener("submit", async (e) => {
      e.preventDefault();
      const v = (id) => byId(id).value.trim();
      const checked = checkContact({ name: v("lead-name"), email: v("lead-email"), phone: v("lead-phone") }, "your results");
      if (checked.error) { byId("gerr").textContent = checked.error; return; }
      state.contact = { ...checked.contact, company: v("lead-company"), size: v("lead-size") };
      const btn = byId("gsend"); btn.disabled = true; btn.textContent = "Building your report…";
      try { await sendLead(); state.submitted = true; } catch (_) { state.submitted = false; }
      state.sample = false; go("report");
    });
  }

  function sendLead() {
    const { areas, overall, bottleneck } = analyze(state.ans);
    const e = state.extra, pt = state.partner, c = state.contact;
    const fields = {
      partner: pt ? (pt.name || pt.code) : "", partner_code: pt ? pt.code : "",
      ai_tools: e.tools.join("; "), ai_uses: e.uses.join("; "), ai_hopes: e.hopes.join("; "), ai_hopes_other: e.other, timeline: e.timeline,
      name: c.name, email: c.email, phone: c.phone, company: c.company, company_size: c.size,
      overall: String(overall), tier: tier(overall)[0], bottleneck: bottleneck.name,
      answers: areas.map((a) => `${a.name}: ${a.opts[a.v]}`).join("\n"),
    };
    areas.forEach((a) => { fields[a.id] = String(a.s); });
    return submitNetlifyForm(brand.formName, fields);
  }

  function gauge(score) {
    const r = 64, C = 2 * Math.PI * r, off = C * (1 - score / 100);
    return `<svg class="gauge" viewBox="0 0 156 156" role="img" aria-label="AI readiness score ${score} out of 100">
    <circle cx="78" cy="78" r="${r}" fill="none" stroke="var(--line)" stroke-width="12"/>
    <circle cx="78" cy="78" r="${r}" fill="none" stroke="var(--${band(score)})" stroke-width="12" stroke-linecap="butt"
      stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 78 78)"/>
    <text x="78" y="84" text-anchor="middle" font-size="40">${score}</text>
    <text x="78" y="108" text-anchor="middle" font-size="12" style="fill:var(--muted)">out of 100</text></svg>`;
  }

  function promptText(areas, overall, bottleneck) {
    const c = state.contact, e = state.extra;
    return [
      "Act as an experienced IT and AI advisor for small and mid-sized businesses.",
      "I took a short AI readiness assessment. Here are my answers:",
      "",
      ...areas.map((a) => `- ${a.name}: ${a.q} → "${a.opts[a.v]}"`),
      "",
      `AI tools we use today: ${e.tools.join(", ") || "not answered"}.`,
      `What we use AI for today: ${e.uses.join(", ") || "not answered"}.`,
      `What we most hope AI can do: ${e.hopes.join(", ") || "not answered"}${e.other ? ". Also: " + e.other : ""}.`,
      `When we'd like to act: ${e.timeline || "not answered"}.`,
      `Company size: ${c.size || "[number of employees]"} employees. Industry: [your industry].`,
      `My score was ${overall}/100, and my biggest bottleneck was ${bottleneck.name}.`,
      "",
      "Please:",
      "1. Score my readiness in each of the six areas from 0 to 100 and explain each score in one sentence.",
      "2. Confirm or challenge my biggest bottleneck.",
      "3. Give me a 90-day plan: one priority per month, each with three concrete steps.",
      "4. For each of my hopes, suggest one specific AI use case and what has to be true before it works.",
      "Ask me follow-up questions first if any answer is unclear.",
    ].join("\n");
  }

  function summaryText(areas, overall, tname, bottleneck) {
    const c = state.contact, e = state.extra;
    return [
      `AI Readiness Check${c.company ? " — " + c.company : ""}`,
      `Score: ${overall}/100 (${tname})`,
      `Biggest bottleneck: ${bottleneck.name}`,
      "",
      ...areas.map((a) => `- ${a.name}: ${a.s}`),
      "",
      `Next task: ${bottleneck.task.title}`,
      `Top hopes for AI: ${e.hopes.join("; ")}`,
      `Timeline: ${e.timeline}`,
    ].join("\n");
  }

  function renderReport() {
    const { areas, overall, bottleneck } = analyze(state.ans);
    const [tname, tdesc] = tier(overall);
    const who = state.contact.company ? esc(state.contact.company) : "Your business";
    const t = bottleneck.task, e = state.extra;
    app.innerHTML = `
  ${state.sample ? `<p class="samplenote" style="margin-bottom:20px">This is a sample report with example answers. Take the assessment to see your own.</p>` : ""}
  <header class="rhead">
    ${gauge(overall)}
    <div class="stack" style="gap:10px;min-width:0">
      <span class="eyebrow">AI readiness · ${who}</span>
      <h1 style="font-size:clamp(2rem,5vw,2.7rem)">${tname}</h1>
      <p class="muted">${tdesc}</p>
    </div>
  </header>

  <section class="block">
    <h2>Score by area</h2>
    <div class="bars">${areas.map((a) => `<div class="bar ${a.id === bottleneck.id ? "low" : ""}"><span class="lbl">${a.name}</span>
      <div class="track"><i style="width:${Math.max(a.s, 3)}%;background:var(--${band(a.s)})"></i></div>
      <span class="num">${a.s}</span></div>`).join("")}</div>
  </section>

  <section class="block">
    <div class="bneck">
      <span class="eyebrow" style="color:var(--bad)">Your biggest bottleneck</span>
      <div class="row" style="justify-content:space-between"><h2>${bottleneck.name}</h2><span class="pill p-${band(bottleneck.s)}">${bottleneck.s} · ${bandLabel(bottleneck.s)}</span></div>
      <p class="muted">You answered: “${esc(bottleneck.opts[bottleneck.v])}”</p>
      <p>${esc(bottleneck.why)}</p>
    </div>
    <div class="task">
      <span class="eyebrow" style="color:var(--accent)">Your next task</span>
      <h3 style="font-size:1.3rem">${esc(t.title)}</h3>
      <ol class="steps">${t.steps.map(([h, d]) => `<li><span><b>${esc(h)}.</b> ${esc(d)}</span></li>`).join("")}</ol>
    </div>
  </section>

  <section class="block">
    <h2>Where AI could help you first</h2>
    <p class="muted">Based on what you hope AI will do. ${overall < 40 ? "Finish your next task first, so these have a foundation to build on." : overall < 60 ? "Pick one of these for a small pilot once your next task is underway." : "Your foundations can support a pilot on one of these now."}</p>
    <div class="goals">${e.hopes.map((h) => { const m = HOPES.find((x) => x[0] === h); return `<div class="goal"><b>${esc(h)}</b><span class="muted">${esc(m ? m[1] : "")}</span></div>`; }).join("")}
    ${e.other ? `<div class="goal"><b>Also on your list</b><span class="muted">${esc(e.other)}</span></div>` : ""}</div>
    <dl class="kv">
      <dt>AI tools today</dt><dd>${esc(e.tools.join(", "))}</dd>
      <dt>Used today for</dt><dd>${esc(e.uses.join(", "))}</dd>
      <dt>Timeline</dt><dd>${esc(e.timeline)}</dd>
    </dl>
  </section>

  <section class="block">
    <h2>Take it with you</h2>
    <p class="muted">Paste this prompt into ChatGPT, Claude, Copilot or Gemini to go deeper on your answers. Add your industry where it says [your industry].</p>
    <label class="fine" for="prompt" style="font-weight:600">Your assessment prompt</label>
    <textarea class="prompt" id="prompt" readonly>${esc(promptText(areas, overall, bottleneck))}</textarea>
    <div class="row"><button class="btn ghost" type="button" id="copyprompt">Copy prompt</button><span class="toast" id="ptoast" role="status"></span></div>
  </section>

  <section class="block" style="border-bottom:0">
    <div class="cta">
      <span class="eyebrow">Next step</span>
      <h2>Want a second opinion on your plan?</h2>
      <p>${esc(brand.text.ctaBody(state.partner))}
      ${state.submitted ? " We have a copy of your answers, so a free 30-minute review can start right where this report ends." : ""}</p>
      ${contact.email ? `<p style="user-select:all;font-weight:600;color:var(--on-cta)">${esc(contact.email)}</p>` : ""}
      <div class="row">
        ${contact.booking ? `<a class="btn" href="${esc(contact.booking)}" target="_blank" rel="noopener" style="text-decoration:none">Book a free AI review</a>` : ""}
        <button class="btn ${contact.booking ? "ghost" : ""}" type="button" id="copysum">Copy my results</button>
        <button class="btn ghost" type="button" id="retake">${state.sample ? "Take the assessment" : "Retake"}</button>
      </div>
      <p class="toast" id="stoast" role="status" style="color:var(--cta-btn)"></p>
    </div>
  </section>`;

    const copy = (text, toastId, ok, fallbackEl) => {
      const toast = byId(toastId);
      copyText(text).then(() => { toast.textContent = ok; }, () => {
        if (fallbackEl) { fallbackEl.focus(); fallbackEl.select(); }
        toast.textContent = "Select the text and copy it.";
      });
    };
    byId("copyprompt").addEventListener("click", () => {
      const ta = byId("prompt"); copy(ta.value, "ptoast", "Prompt copied.", ta);
    });
    byId("copysum").addEventListener("click", () => {
      copy(summaryText(areas, overall, tname, bottleneck), "stoast", "Results copied. Paste them into an email.", byId("prompt"));
    });
    byId("retake").addEventListener("click", () => {
      state.ans = {}; state.extra = blankExtra();
      if (state.sample) state.contact = { ...state.contact, company: "", size: "" };
      state.sample = false; state.submitted = false; state.step = 0; go(state.contact.email ? "q" : "intro");
    });
  }

  formatPhoneFieldsAsTyped(document);
  render();
}
