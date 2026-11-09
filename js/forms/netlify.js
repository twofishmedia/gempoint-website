// Sends a lead to Netlify Forms. The page must also contain a hidden <form name="…"
// data-netlify="true"> listing the same field names, so Netlify registers the form at deploy time.

export async function submitNetlifyForm(formName, fields) {
  const body = new URLSearchParams({ "form-name": formName, "bot-field": "", ...fields });
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Form "${formName}" was not accepted (${res.status})`);
}
