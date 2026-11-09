// What the Sales Team Scorecard asks and recommends.

/** Answer scale for every statement, 1 (never) to 5 (always). */
export const SCALE = [["1","Never"],["2","Rarely"],["3","Sometimes"],["4","Mostly"],["5","Always"]];

/** Six areas, four statements each. Each statement carries the fix shown when it scores low. */
export const CATS = [
 {id:"strat", name:"Strategy & ICP", kit:"ICP & persona worksheet, Sales Playbook template",
  low:"Sellers are chasing any deal that moves. Without a shared picture of the best-fit customer, effort spreads thin and win rates suffer.",
  mid:"You have a sense of who you sell to, but it isn't written down tightly enough for every seller to apply it the same way.",
  high:"Your targeting is clear and documented. This is a foundation to build the rest of the system on.",
  qs:[
   {t:"We have a written ideal customer profile that every seller describes the same way.", fix:"Write a one-page ICP: company size, industry, buying triggers, and clear disqualifiers."},
   {t:"Our value proposition is documented and tied to specific buyer pains.", fix:"Write one value statement per buyer persona, each tied to a pain the buyer can measure."},
   {t:"Revenue targets are broken down by quarter, by rep, and by lead source.", fix:"Split the annual number into quarterly quotas by rep and by source so gaps show up early."},
   {t:"We know our win rate and our top reasons for losing deals.", fix:"Tag every lost deal with a reason and review the top three in a monthly meeting."}]},
 {id:"proc", name:"Sales Process", kit:"Sales process map, discovery call script, proposal templates",
  low:"Every rep sells their own way, so results depend on who works the deal. That makes it hard to coach, forecast, or scale.",
  mid:"A process exists but is applied unevenly. Tightening stage definitions and discovery will make results more predictable.",
  high:"Your process is defined and followed. Keep refining it with win/loss data.",
  qs:[
   {t:"Our sales stages have written entry and exit criteria.", fix:"Define 5–7 stages, each with a buyer action that must happen before a deal moves forward."},
   {t:"Every rep runs discovery the same way, using a shared question framework.", fix:"Build a discovery script with 10–15 core questions and role-play it with each rep."},
   {t:"We use a qualification framework (such as BANT or MEDDIC) on every deal.", fix:"Pick one qualification framework and add its fields to every opportunity in the CRM."},
   {t:"Proposals and follow-ups follow a standard template and timeline.", fix:"Standardize the proposal outline and send a written recap within 24 hours of every meeting."}]},
 {id:"pipe", name:"Pipeline & Forecasting", kit:"Pipeline tracker & KPI dashboard, weekly meeting agendas",
  low:"The forecast is a guess and the pipeline is too thin or too stale to hit the number. Surprises at quarter end are likely.",
  mid:"You have visibility into the pipeline, but coverage or forecast accuracy needs work.",
  high:"Your pipeline is healthy and your forecast is reliable. Use that confidence to plan hiring and spend.",
  qs:[
   {t:"Our pipeline holds at least 3x the current quarter's target.", fix:"Track pipeline coverage weekly and trigger a prospecting push whenever it drops below 3x."},
   {t:"Our forecast usually lands within 10% of actual results.", fix:"Forecast only from deals that meet stage exit criteria, and compare forecast to actual every month."},
   {t:"Stalled deals are flagged and reviewed every week.", fix:"Flag any deal with no activity in 14 days and decide in the weekly review: advance it or close it."},
   {t:"We hold a weekly pipeline review with a consistent agenda.", fix:"Run a 45-minute weekly pipeline review with the same agenda: new, moved, stalled, and committed deals."}]},
 {id:"people", name:"People & Coaching", kit:"90-day rep onboarding plan, 1:1 agendas",
  low:"Reps are mostly on their own. Ramp time is long, turnover is expensive, and top performance isn't being copied.",
  mid:"Some coaching and onboarding happen, but not consistently enough to raise the whole team's performance.",
  high:"You develop sellers well. This is a real advantage as you add headcount.",
  qs:[
   {t:"New reps reach full productivity within 90 days.", fix:"Build a week-by-week 90-day onboarding plan with checkpoints a rep must pass."},
   {t:"Managers coach reps on real deals for at least 2 hours per rep each month.", fix:"Schedule a recurring deal-coaching 1:1 with each rep and review one live deal every session."},
   {t:"Our compensation plan rewards the behaviors we actually want.", fix:"Audit the comp plan against your goals: margin, new logos, retention. Pay for what matters most."},
   {t:"We use a defined hiring profile and structured interviews for sellers.", fix:"Write a seller scorecard and use the same interview questions and role-play for every candidate."}]},
 {id:"gen", name:"Prospecting & Lead Gen", kit:"Outbound sequence pack, AI prompt pack",
  low:"New business depends on referrals or the founder. When those slow down, so does revenue.",
  mid:"Lead flow exists but isn't predictable. A defined outbound motion would smooth it out.",
  high:"You generate pipeline on purpose, not by luck. Keep testing messaging and channels.",
  qs:[
   {t:"Our pipeline doesn't depend on referrals or the founder alone.", fix:"Set a target for the share of pipeline from outbound and marketing, and track it monthly."},
   {t:"Reps follow defined outbound cadences with weekly activity targets.", fix:"Launch one 8–12 touch email and LinkedIn cadence per persona with weekly activity goals."},
   {t:"Marketing and sales agree on what counts as a qualified lead.", fix:"Write a shared qualified-lead definition and a handoff process both teams sign off on."},
   {t:"Inbound leads get a response within one business hour.", fix:"Set up instant lead alerts and a one-hour response rule with a named owner."}]},
 {id:"tools", name:"Tools, Data & Metrics", kit:"Pipeline tracker & KPI dashboard",
  low:"Leaders are flying blind. Without clean CRM data and a few core metrics, it's hard to see what's working.",
  mid:"The tools are in place, but data quality or reporting habits are holding you back.",
  high:"Your data is trustworthy and leaders use it. That makes every other fix easier to measure.",
  qs:[
   {t:"Every deal and activity is tracked in a CRM that reps keep current.", fix:"Make the CRM the only source for pipeline reviews: if it isn't in the CRM, it isn't discussed."},
   {t:"We review a short set of sales KPIs every week.", fix:"Pick 5–7 KPIs (activities, meetings, pipeline added, win rate, cycle length) and review them weekly."},
   {t:"Leaders can see conversion rates between each sales stage.", fix:"Build a stage-conversion report so you can see exactly where deals drop out."},
   {t:"We use automation or AI to cut admin work for sellers.", fix:"Automate call notes, follow-up drafts, and CRM updates so reps spend more time selling."}]}
];

/** "A little about your team" questions on the intro screen. */
export const INTAKE = [
 {id:"size", label:"How many people sell (including you)?", opts:["Just me","2–5","6–10","11+"]},
 {id:"rev", label:"Annual revenue", opts:["Under $1M","$1M–$5M","$5M–$20M","$20M+"]},
 {id:"lead", label:"Who leads sales today?", opts:["Founder / owner","A sales manager","No one specifically"]}
];

/** Example answers behind "See a sample report". */
export const SAMPLE = {intake:{company:"Example Co. (sample)",size:"2–5",rev:"$1M–$5M",lead:"Founder / owner"},
  ans:{strat:[3,2,3,2],proc:[2,3,1,3],pipe:[2,1,2,3],people:[2,1,3,1],gen:[3,4,3,4],tools:[5,4,4,3]}};
