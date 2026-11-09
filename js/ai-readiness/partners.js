// Who referred the visitor. Partners share a link ending in ?partner=<code> (or ?ref=<code>);
// a bare #<code> also works for preview links. Unknown codes are still recorded with the lead.

export function partnerFromLink(knownPartners) {
  let code = "";
  try {
    const q = new URLSearchParams(location.search);
    code = q.get("partner") || q.get("ref") || "";
  } catch (_) { /* no query string */ }
  if (!code) {
    const hash = (location.hash || "").slice(1);
    if (/^[A-Za-z0-9-]{2,40}$/.test(hash)) code = hash;
  }
  code = code.trim().toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
  return code ? { code, name: knownPartners[code] || "" } : null;
}
