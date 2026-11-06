# gempointadvisors.com

The GemPoint Advisors website. Plain HTML, no build step. Netlify publishes this repository automatically every time a change is saved to the `main` branch.

## Pages

| Address | File | What it is |
| --- | --- | --- |
| `/` | `index.html` | Home page (business and technology consulting) |
| `/technology/` | `technology/index.html` | GemPoint Technology: consulting and integration |
| `/sales/` | `sales/index.html` | GemPoint Sales: fractional VP of Sales |
| `/playbook-kit/` | `playbook-kit/index.html` | Sales Playbook Kit product page |
| `/ai-readiness/` | `ai-readiness/index.html` | Free AI Readiness Check (lead capture) |
| `/sales-scorecard/` | `sales-scorecard/index.html` | Free Sales Team Scorecard (lead capture) |
| `/signatures/` | `signatures/index.html` | Internal email signature builder (hidden from search) |

Short links: `/ai`, `/scorecard`, `/kit` (set in `netlify.toml`).

## Leads

Both assessments send results to Netlify Forms:

- `ai-readiness-leads`
- `scorecard-leads`

See them in Netlify under **Forms**. Turn on email notifications there so each lead goes to sales@gempointadvisors.com.

## Referral partners

Partners get a link to the AI Readiness Check with their code:

`https://gempointadvisors.com/ai-readiness/?partner=plus-inc`

Plus Inc white-labels the assessment: `gempointadvisors.com/plus` is a Plus Inc-branded copy in `plus/index.html`, with its own Netlify form (`plus-inc-ai-readiness`) and a "Partnered with GemPoint Advisors" footer. Set Plus Inc's contact email and booking link in the `CONTACT` settings near the top of its script. Older Plus Inc links (`/ai-readiness/?partner=plus-inc`) redirect there.

Their customers see "Shared with you by <partner>", and every lead records the partner. To add a partner, edit the `PARTNERS` list near the top of the script in `ai-readiness/index.html`, and optionally add a short link for them in `netlify.toml`:

```js
const PARTNERS = {
  "plus-inc": "Plus Inc",
  "new-partner-code": "New Partner Name"
};
```

## Booking link

When you have a Calendly (or similar) link, add it to `booking: ""` in the `CONTACT` settings near the top of the script in both `ai-readiness/index.html` and `sales-scorecard/index.html`. A "Book a free review" button then appears on every report.

## Brand

Logos are in `assets/logos/`. Brand colors: navy `#10244A`, emerald `#0A7B57`, bright emerald `#3CC08E` (on navy only), technology blue `#2F5E9E`. Headlines use Source Serif 4; everything else uses Inter.
