// The signature builder page: reads the form, shows live previews, copies the result.

import { fullSignature, shortSignature } from "./templates.js";
import { copyHtml } from "../lib/clipboard.js";
import { formatPhoneFieldsAsTyped } from "../forms/phone.js";

const COPY_MESSAGES = {
  copied: "Copied. Paste it into your email settings.",
  selected: "Selected. Press Ctrl+C (or ⌘C) to copy.",
  failed: "Select the signature and copy it with Ctrl+C (or ⌘C).",
};

export function startSignatureBuilder() {
  const $ = (id) => document.getElementById(id);
  const form = $("form");
  let practice = "adv";

  function details() {
    const v = (id) => $(id).value.trim();
    return {
      name: v("f-name") || "Your Name", title: v("f-title") || "Managing Partner",
      phone: v("f-phone"), email: v("f-email"), web: v("f-web"), book: v("f-book"), logo: v("f-logo"),
    };
  }
  const full = () => fullSignature(details(), practice);
  const short = () => shortSignature(details(), practice);

  function render() {
    $("sig-full").innerHTML = full();
    $("sig-short").innerHTML = short();
    if (!$("html-full").hidden) $("html-full").value = full();
    if (!$("html-short").hidden) $("html-short").value = short();
    $("lognote").hidden = true;
  }

  function toggleCode(buttonId, areaId, make) {
    const area = $(areaId);
    area.hidden = !area.hidden;
    $(buttonId).textContent = area.hidden ? "Show HTML" : "Hide HTML";
    if (!area.hidden) { area.value = make(); area.focus(); area.select(); }
  }

  async function copy(make, previewId, toastId) {
    $(toastId).textContent = COPY_MESSAGES[await copyHtml(make(), $(previewId))];
  }

  document.querySelectorAll(".seg button").forEach((button) => button.addEventListener("click", () => {
    practice = button.dataset.p;
    document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-pressed", b === button));
    render();
  }));
  // Format the phone number before the previews redraw, so they always show (xxx) xxx-xxxx.
  formatPhoneFieldsAsTyped(form);
  form.addEventListener("input", render);
  form.addEventListener("submit", (e) => e.preventDefault());
  $("copy-full").addEventListener("click", () => copy(full, "sig-full", "t-full"));
  $("copy-short").addEventListener("click", () => copy(short, "sig-short", "t-short"));
  $("code-full").addEventListener("click", () => toggleCode("code-full", "html-full", full));
  $("code-short").addEventListener("click", () => toggleCode("code-short", "html-short", short));
  render();
}
