// Plus Inc's white-label AI Readiness Check (gempointadvisors.com/plus/). Shows only Plus Inc's
// brand; GemPoint appears only in the page footer. Every lead is recorded as coming from Plus Inc.

export default {
  formName: "plus-inc-ai-readiness",
  contact: {
    name: "Plus Inc",
    email: "",   // Plus Inc's contact email for clients, e.g. "ai@plusinc.net"
    booking: "", // Plus Inc's booking link, if they have one
  },
  progress: "lines",
  partner: () => ({ code: "plus-inc", name: "Plus Inc" }),
  showPartnerBadge: false,
  text: {
    introFooter: "A free assessment from Plus Inc Business Solutions.",
    gateNotice: () => "Plus Inc and its assessment partner will see your results and may follow up. Your information is never sold.",
    ctaBody: () => "Plus Inc can walk through your results with you, compare them with how your business actually runs, and help you decide what to do first.",
  },
};
