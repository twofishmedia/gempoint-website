// GemPoint Technology's own AI Readiness Check (gempointadvisors.com/ai-readiness/).

import { partnerFromLink } from "../partners.js";

/* Referral partners. Give each partner a link ending in ?partner=<code>. Their customers see
   "Shared with you by <name>", and every lead records which partner sent it. */
const PARTNERS = {
  "plus-inc": "Plus Inc",
  "example-msp": "Example IT Partners (sample)",
};

/* Say on the contact step that the referring partner may see the results. */
const SHARE_WITH_PARTNER = true;

export default {
  formName: "ai-readiness-leads",
  contact: {
    name: "GemPoint Technology",
    email: "sales@gempointadvisors.com",
    booking: "https://calendar.app.google/uAdSdYZCHj5WHTkj8", // a 45-minute meeting
    reviewMinutes: 45,
  },
  progress: "facets",
  partner: () => partnerFromLink(PARTNERS),
  showPartnerBadge: true,
  text: {
    introFooter: "Built by GemPoint Technology, the technology consulting and integration practice of GemPoint Advisors.",
    gateNotice: (partner) => `GemPoint Technology will see your results and may follow up once${partner && partner.name && SHARE_WITH_PARTNER ? `, and may share them with ${partner.name}, who introduced you` : ""}. Your information is never sold.`,
    ctaBody: (partner) => `${partner && partner.name ? `GemPoint Technology works alongside ${partner.name} to help businesses like yours put AI to work. ` : ""}GemPoint Technology plans and delivers AI and integration projects alongside your IT team or provider. We'll walk through your results, check them against how your business actually runs, and tell you what we'd do first.`,
  },
};
