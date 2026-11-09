// The "Request the kit" form on the Playbook Kit page. The form works without JavaScript (Netlify takes the
// post directly); this adds phone formatting, friendly checks, the "Request <kit>" buttons and an in-page thank-you.

import { checkContact } from "../forms/contact.js";
import { submitNetlifyForm } from "../forms/netlify.js";
import { formatPhoneFieldsAsTyped } from "../forms/phone.js";

const FIELDS = ["name", "email", "phone", "company", "team_size", "kit", "message"];

/** form: the <form name="kit-requests">; done: the element shown after a request is sent. */
export function startKitRequest(form, done) {
  const error = form.querySelector(".kit-form__error");
  const button = form.querySelector("button[type=submit]");
  const value = (name) => form.elements[name].value.trim();

  formatPhoneFieldsAsTyped(form);

  // "Request Starter" etc. jump to the form with that kit already chosen.
  document.querySelectorAll("a[data-kit]").forEach((link) => link.addEventListener("click", () => {
    form.elements.kit.value = link.dataset.kit;
    setTimeout(() => form.elements.name.focus({ preventScroll: true }), 0);
  }));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const checked = checkContact({ name: value("name"), email: value("email"), phone: value("phone") }, "Enter your name so we know who's asking.");
    if (checked.error) { error.textContent = checked.error; return; }
    if (!value("kit")) { error.textContent = "Choose which kit you're interested in."; form.elements.kit.focus(); return; }
    error.textContent = "";

    const fields = Object.fromEntries(FIELDS.map((name) => [name, value(name)]));
    Object.assign(fields, checked.contact);
    button.disabled = true;
    button.textContent = "Sending…";
    try {
      await submitNetlifyForm(form.getAttribute("name"), fields);
    } catch (_) {
      button.disabled = false;
      button.textContent = "Request the kit";
      error.textContent = "Your request didn't go through. Try again, or email sales@gempointadvisors.com.";
      return;
    }
    done.querySelector("[data-name]").textContent = fields.name.split(" ")[0];
    done.querySelector("[data-email]").textContent = fields.email;
    form.hidden = true;
    done.hidden = false;
    done.focus();
  });
}
