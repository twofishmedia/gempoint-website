// US phone numbers, always shown and sent as (xxx) xxx-xxxx.

/** The number's digits, without a leading country code 1, at most 10. */
export function phoneDigits(value) {
  let d = String(value ?? "").replace(/\D/g, "");
  if (d.length === 11 && d[0] === "1") d = d.slice(1);
  return d.slice(0, 10);
}

/** Formats as much of the number as has been typed: (864, (864) 555, (864) 555-0100. */
export function formatPhone(value) {
  const d = phoneDigits(value);
  if (!d) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export const isFullPhone = (value) => phoneDigits(value).length === 10;

/**
 * Formats every phone field (autocomplete="tel") under root as the visitor types or pastes,
 * keeping the caret after the same digit.
 */
export function formatPhoneFieldsAsTyped(root = document) {
  root.addEventListener("input", (e) => {
    const field = e.target;
    if (!(field instanceof HTMLInputElement) || field.autocomplete !== "tel") return;
    const digitsBefore = field.value.slice(0, field.selectionStart ?? field.value.length).replace(/\D/g, "").length;
    const next = formatPhone(field.value);
    if (next === field.value) return;
    field.value = next;
    let pos = 0;
    for (let seen = 0; pos < next.length && seen < digitsBefore; pos++) if (/\d/.test(next[pos])) seen++;
    try { field.setSelectionRange(pos, pos); } catch (_) { /* field type without a caret */ }
  });
}
