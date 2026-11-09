// What the AI Readiness Check asks and recommends. Shared by every brand that runs it.

/** The six scored areas, each with its question, answers (worst to best), why it matters and the fix. */
export const AREAS = [
 {id:"strategy", name:"Strategy",
  q:"Where does AI fit in your plans for the next 12 months?",
  opts:["We haven't talked about it","A few people are curious","Leadership has named a few places it could help","We have a written plan with owners and goals"],
  why:"Without agreed priorities, AI spending goes to whatever tool someone saw last week, and nothing gets measured.",
  task:{title:"Pick three places AI should help this year", steps:[
   ["List your biggest time drains","Ask each leader for the two tasks that eat the most hours on their team each week."],
   ["Score them by value and effort","Rate each one 1–5 on time saved and 1–5 on how hard it is to change. Keep the top three."],
   ["Give each one an owner and a goal","Name one person per item and a number to hit in 90 days, such as hours saved or turnaround time."]]}},
 {id:"data", name:"Data",
  q:"If you needed a report on last quarter's customers, how would you get it?",
  opts:["Dig through email, paper and spreadsheets","Pull from several systems and piece it together by hand","Mostly from one system, with some cleanup","Straight from one trusted system in a few minutes"],
  why:"AI is only as good as the information you give it. Scattered or messy data means unreliable answers.",
  task:{title:"Name one source of truth for customer data", steps:[
   ["Choose the system of record","Pick the one place customer information officially lives, usually your CRM or accounting system."],
   ["Clean your top 100 records","Merge duplicates, fill missing contacts, and fix company names for your most important customers."],
   ["Set the rule going forward","New customer information goes into that system first. Spreadsheets become views, not sources."]]}},
 {id:"systems", name:"Systems",
  q:"How connected are your core systems, like CRM, accounting and operations?",
  opts:["Mostly paper and separate spreadsheets","Separate apps that don't talk to each other","Some are connected, some data is re-typed by hand","Connected, with data flowing between them automatically"],
  why:"AI tools and automations need to reach your systems. Disconnected apps keep people re-typing the same data.",
  task:{title:"Map how your systems connect", steps:[
   ["List every core system","Write down each business app, what it's used for, who owns it, and what it costs per year."],
   ["Mark the manual hand-offs","Highlight every place someone copies data from one system into another."],
   ["Automate one hand-off","Pick the most frequent manual hand-off and connect it, with a built-in integration or a tool like Zapier or Power Automate."]]}},
 {id:"people", name:"People",
  q:"How is your team using AI tools today?",
  opts:["Not at all, as far as we know","A few people on their own, with personal accounts","Some teams use approved tools for specific tasks","Widely, with training and shared practices"],
  why:"Tools don't change anything until people use them well. Untrained, unofficial use creates risk without much payoff.",
  task:{title:"Run a 30-day AI pilot with one team", steps:[
   ["Pick one team and two tasks","Choose a willing team and two repetitive tasks, like drafting proposals or summarizing calls."],
   ["Give them an approved tool and an hour of training","Provide business accounts, not personal ones, and show real examples using your own work."],
   ["Measure and share the results","Track time saved for 30 days, then have the team show the rest of the company what worked."]]}},
 {id:"governance", name:"Governance",
  q:"Do you have rules for what employees can put into AI tools?",
  opts:["No, and we're not sure what's being shared","Informal guidance only","A written policy that isn't enforced yet","A written policy, approved tools, and controls to enforce it"],
  why:"Without clear rules, customer data, pricing and contracts can end up in tools you don't control.",
  task:{title:"Put an AI use policy in place", steps:[
   ["Find out what's in use","Run a short anonymous survey asking which AI tools people use and what they use them for."],
   ["Write a one-page policy","Cover approved tools, what data never goes into AI, and who to ask when unsure."],
   ["Move to business accounts","Pick approved tools with business terms that keep your data out of training, and retire personal accounts for work."]]}},
 {id:"processes", name:"Processes",
  q:"How well are your repeatable processes, like quoting, onboarding and invoicing, written down?",
  opts:["They live in people's heads","Some notes, mostly out of date","Key processes are written down","Documented, measured and reviewed regularly"],
  why:"You can't hand a process to AI, or to a new hire, if it only exists in someone's head.",
  task:{title:"Document the one process AI could help most", steps:[
   ["Pick a high-volume process","Choose something done often with clear inputs and outputs, like quotes, intake or invoicing."],
   ["Write it as a checklist","List each step, who does it, and what information they use, the way you'd teach a new hire."],
   ["Time it for a week","Record how long each run takes. That baseline shows whether AI actually saves time later."]]}}
];

/** When two areas tie for lowest score, the more foundational one is the bottleneck. */
export const FOUNDATION = ["governance","data","processes","systems","people","strategy"];
export const SIZES = ["1–10","11–50","51–200","201+"];
export const HOPES = [
  ["Cut time on admin and repetitive work","Draft routine emails, fill in forms and update records automatically."],
  ["Respond to customers faster","AI-drafted replies and a help assistant that answers from your own FAQs and policies."],
  ["Speed up quotes, proposals or invoicing","First-draft quotes and proposals built from your price list and past work."],
  ["Get better reports and forecasts","Ask questions of your sales and finance data in plain English."],
  ["Grow sales and marketing","Personal outreach, follow-ups and content at a pace a small team can keep up with."],
  ["Train and onboard staff faster","An internal assistant that answers \u201chow do we do this?\u201d from your documented processes."],
  ["Reduce IT and security risk","Approved tools, a clear policy, and visibility into what data leaves the company."],
  ["Get more from tools we already pay for","Turn on and train people on the AI already included in your Microsoft 365, Google or CRM plans."]
];
export const EXTRAS = [
  {title:"How is your business using AI today?", sub:"Pick all that apply. This part isn't scored. It helps tailor your plan.",
   groups:[
    {key:"tools", label:"Tools in use", none:"None yet", opts:["ChatGPT","Microsoft Copilot","Google Gemini","Claude","AI built into our software (CRM, accounting, etc.)","None yet"]},
    {key:"uses", label:"What it's used for", none:"Nothing yet", opts:["Writing emails and documents","Summarizing meetings and notes","Customer service or chat","Sales and marketing content","Reports and data analysis","IT, coding or automation","Research and planning","Nothing yet"]}]},
  {title:"What do you most hope AI could do for your business?", sub:"Pick up to three, and tell us anything we missed.",
   groups:[{key:"hopes", label:"Your top hopes", max:3, opts:HOPES.map(h=>h[0])}], other:true, timeline:true}
];
export const TIMELINES = ["In the next 3 months","In 3–12 months","Just exploring for now"];
export const TOTAL_STEPS = AREAS.length + EXTRAS.length;

/** Example answers behind "See a sample report". */
export const SAMPLE = {company:"Example Co. (sample)", size:"11–50", ans:{strategy:1,data:1,systems:2,people:1,governance:0,processes:2},
  extra:{tools:["ChatGPT","Microsoft Copilot"], uses:["Writing emails and documents","Summarizing meetings and notes"], hopes:["Respond to customers faster","Speed up quotes, proposals or invoicing"], other:"", timeline:"In 3–12 months"}};

/** Answers to the two unscored steps, before the visitor picks anything. */
export const blankExtra = () => ({tools:[], uses:[], hopes:[], other:"", timeline:""});
