# gempointadvisors.com

The GemPoint Advisors website. Plain HTML, CSS and JavaScript modules, no build step. Netlify publishes it from the `main` branch; while the GitHub connection is paused, upload the folder on the project's **Deploys** page instead.

## Pages

| Address | File | What it is |
| --- | --- | --- |
| `/` | `index.html` | Home page (business and technology consulting) |
| `/technology/` | `technology/index.html` | GemPoint Technology: consulting and integration |
| `/sales/` | `sales/index.html` | GemPoint Sales: fractional VP of Sales |
| `/playbook-kit/` | `playbook-kit/index.html` | Sales Playbook Kit product page |
| `/ai-readiness/` | `ai-readiness/index.html` | Free AI Readiness Check (lead capture) |
| `/plus/` | `plus/index.html` | Plus Inc's white-label AI Readiness Check (hidden from search) |
| `/sales-scorecard/` | `sales-scorecard/index.html` | Free Sales Team Scorecard (lead capture) |
| `/signatures/` | `signatures/index.html` | Internal email signature builder (hidden from search) |

Short links: `/ai`, `/scorecard`, `/kit` (set in `netlify.toml`).

## Leads

The assessments and the Playbook Kit page send leads to Netlify Forms:

- `ai-readiness-leads`
- `plus-inc-ai-readiness`
- `scorecard-leads`
- `kit-requests` ("Request the kit" on `/playbook-kit/`, until the kit has a checkout)

Each page also contains a hidden copy of its form, so Netlify registers the form and its fields when the site is deployed.
Phone numbers are always formatted as (xxx) xxx-xxxx.

See them in Netlify under **Forms**. Turn on email notifications there so each lead goes to sales@gempointadvisors.com.

## Referral partners

Partners get a link to the AI Readiness Check with their code:

`https://gempointadvisors.com/ai-readiness/?partner=example-msp`

Their customers see "Shared with you by <partner>", and every lead records the partner. To add a partner, add them to `PARTNERS` in `js/ai-readiness/brands/gempoint.js`, and optionally add a short link for them in `netlify.toml`.

## White-label partners

A white-label partner gets their own branded copy of the AI Readiness Check, built from the same engine. Plus Inc is the first: `gempointadvisors.com/plus`, with its own Netlify form (`plus-inc-ai-readiness`) and a "Partnered with GemPoint Advisors" footer. Older Plus Inc links (`/ai-readiness/?partner=plus-inc`) redirect there.

To add another white-label partner:

1. Copy `js/ai-readiness/brands/plus-inc.js` and change the form name, contact details and wording.
2. Copy `css/brand/plus-inc.css` and change the colours, fonts and logo height.
3. Copy `plus/index.html` to a new folder, point it at the two new files and the partner's logo, and rename the hidden form to match.

## Booking links and contact details

Each assessment's contact details (name, email, booking link) are in its settings file:

- GemPoint AI Readiness Check: `js/ai-readiness/brands/gempoint.js`
- Plus Inc: `js/ai-readiness/brands/plus-inc.js` (Plus Inc's contact email is still to be added)
- Sales Team Scorecard: `js/sales-scorecard/settings.js`

When a booking link is set, a "Book a free review" button appears on that assessment's report.

## How the code is organised

```
css/
  site.css                  marketing pages (home, Sales, Technology, Playbook Kit)
  brand/gempoint.css        GemPoint colours and fonts, light and dark
  brand/plus-inc.css        Plus Inc colours and fonts
  assessment-base.css       layout shared by the assessments
  ai-readiness.css          AI Readiness Check (all brands)
  sales-scorecard.css       Sales Team Scorecard
  signatures.css            email signature builder
  kit-request.css           "Request the kit" form on the Playbook Kit page
js/
  lib/                      small helpers: safe HTML text, copying to the clipboard
  forms/                    phone formatting, contact-step checks, sending leads to Netlify
  ai-readiness/             the AI Readiness Check: questions (content.js), scoring, the page (app.js),
                            referral codes (partners.js), and one settings file per brand (brands/)
  sales-scorecard/          the Sales Team Scorecard: questions, scoring, the page, settings
  signatures/               the signature builder: signature HTML (templates.js) and the page (app.js)
  playbook-kit/             the "Request the kit" form (request.js)
```

Each page's `index.html` holds its text for search engines, its hidden Netlify form, and a few lines that start its script. The marketing pages keep their layout in their own markup; `404.html` is self-contained on purpose so it always displays.

## Brand

Logos are in `assets/logos/`. Brand colors: navy `#10244A`, emerald `#0A7B57`, bright emerald `#3CC08E` (on navy only), technology blue `#2F5E9E`. Headlines use Source Serif 4; everything else uses Inter.
