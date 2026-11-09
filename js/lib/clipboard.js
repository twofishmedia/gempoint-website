// Copies plain text. Resolves when copied; rejects when the browser won't allow it,
// so the caller can fall back to selecting the text for the visitor.
export function copyText(text) {
  try {
    return navigator.clipboard.writeText(text);
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Copies formatted HTML (with a plain-text version) so it pastes with its formatting.
 * Falls back to selecting `node` and the browser's copy command.
 * Resolves "copied", "selected" (the visitor must press Ctrl+C / ⌘C) or "failed".
 */
export async function copyHtml(html, node) {
  try {
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([node.innerText], { type: "text/plain" }),
      })]);
      return "copied";
    }
  } catch (_) { /* fall through to selecting the text */ }
  try {
    const range = document.createRange();
    range.selectNodeContents(node);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    return document.execCommand && document.execCommand("copy") ? "copied" : "selected";
  } catch (_) {
    return "failed";
  }
}
