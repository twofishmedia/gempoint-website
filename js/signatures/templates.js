// Email signature HTML for Gmail, Outlook and Apple Mail. Pure functions: details in, markup out.
// Email clients ignore stylesheets, so every style is inline and layout uses tables.

import { esc } from "../lib/html.js";

const LOGOS = {
  adv: "https://gempointadvisors.com/assets/email/gempoint-advisors-signature.png",
  sales: "https://gempointadvisors.com/assets/email/gempoint-sales-signature.png",
  tech: "https://gempointadvisors.com/assets/email/gempoint-technology-signature.png",
};

export const PRACTICES = {
  adv: { label: "GemPoint Advisors", color: "#0A7B57" },
  sales: { label: "GemPoint Sales", color: "#0A7B57" },
  tech: { label: "GemPoint Technology", color: "#2F5E9E" },
};

const F = "font-family:Arial,Helvetica,sans-serif;";
const urlify = (u) => !u ? "" : /^https?:\/\//i.test(u) ? u : "https://" + u.replace(/^\/+/, "");
const bare = (u) => u.replace(/^https?:\/\//i, "").replace(/\/$/, "");
const telHref = (phone) => "tel:" + phone.replace(/[^\d+]/g, "");

function contactLines(d, color) {
  const lines = [];
  if (d.phone) lines.push(`<a href="${esc(telHref(d.phone))}" style="${F}color:#10244A;text-decoration:none;">${esc(d.phone)}</a>`);
  if (d.email) lines.push(`<a href="mailto:${esc(d.email)}" style="${F}color:#10244A;text-decoration:none;">${esc(d.email)}</a>`);
  if (d.web) lines.push(`<a href="${esc(urlify(d.web))}" style="${F}color:${color};text-decoration:none;font-weight:bold;">${esc(bare(d.web))}</a>`);
  return lines;
}

/**
 * The full signature for new emails.
 * d = {name, title, phone, email, web, book, logo}; practice = "adv" | "sales" | "tech".
 */
export function fullSignature(d, practice) {
  const p = PRACTICES[practice];
  const src = d.logo ? urlify(d.logo) : LOGOS[practice];
  const lines = contactLines(d, p.color);
  const book = d.book ? `<tr><td style="padding-top:10px;"><a href="${esc(urlify(d.book))}" style="${F}font-size:13px;font-weight:bold;color:#FFFFFF;background:${p.color};text-decoration:none;padding:6px 12px;border-radius:4px;display:inline-block;">Book a call</a></td></tr>` : "";
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;${F}">
<tr><td style="padding:0 0 10px 0;"><span style="${F}font-size:16px;font-weight:bold;color:#10244A;">${esc(d.name)}</span><br><span style="${F}font-size:13px;color:#4B5B76;">${esc(d.title)}, ${esc(p.label)}</span></td></tr>
<tr><td style="border-top:2px solid ${p.color};padding:12px 0 0 0;">
<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tr>
<td style="vertical-align:middle;padding-right:16px;"><img src="${esc(src)}" width="190" height="45" alt="${esc(p.label)}" style="display:block;width:190px;height:45px;border:0;"></td>
<td style="vertical-align:middle;border-left:1px solid #DCE2EA;padding-left:16px;${F}font-size:13px;line-height:20px;color:#10244A;">${lines.join("<br>") || `<span style="color:#4B5B76;">Add your phone and email</span>`}</td>
</tr></table></td></tr>${book}
</table>`;
}

/** The short signature for replies and forwards. */
export function shortSignature(d, practice) {
  const p = PRACTICES[practice];
  const bits = [
    d.phone ? `<a href="${esc(telHref(d.phone))}" style="${F}color:#4B5B76;text-decoration:none;">${esc(d.phone)}</a>` : "",
    d.web ? `<a href="${esc(urlify(d.web))}" style="${F}color:${p.color};text-decoration:none;font-weight:bold;">${esc(bare(d.web))}</a>` : "",
  ].filter(Boolean);
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;${F}"><tr>
<td style="${F}font-size:13px;line-height:19px;color:#10244A;"><span style="font-weight:bold;">${esc(d.name)}</span> <span style="color:#4B5B76;">· ${esc(p.label)}</span>${bits.length ? `<br>${bits.join(`<span style="color:#A8B5CB;"> | </span>`)}` : ""}</td>
</tr></table>`;
}
