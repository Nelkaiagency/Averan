# Averan launch guide

## Go-live checklist

Four things stand between the current deployment and a site that works as a
business asset. Each is done in a dashboard, not in code.

**1. Connect the domain.** `averan.eu` resolves to Vercel but serves no
certificate, so the address does not load — while every canonical URL, the
sitemap and the social tags point at it. In Vercel: Project → Settings →
Domains → add `averan.eu` and `www.averan.eu`, set the apex as primary,
redirect `www` to it, and wait for the certificate. Preserve the existing
Google Workspace MX, SPF, DKIM and DMARC records when touching DNS.

**2. Turn on enquiry delivery and the live demo.** Both run through Make
scenarios that send from info@averan.eu (see `MAKE-SETUP.md`). Add an API key to
each Make webhook, then set in Vercel (Production):

- `ENQUIRY_WEBHOOK_URL`, `ENQUIRY_WEBHOOK_TOKEN`
- `LIVE_DEMO_WEBHOOK_URL`, `LIVE_DEMO_WEBHOOK_TOKEN`
- `SITE_ORIGIN=https://averan.eu`

Until the enquiry webhook is set, the form opens a pre-filled email instead, so
no enquiry is lost. The live demo section stays hidden until its webhook is set.
Add Vercel firewall rate limits for `/api/enquiry` and `/api/live-demo`.

**3. Add the booking link (optional).** Create a Google Calendar appointment
schedule with Google Meet on info@averan.eu and set `NEXT_PUBLIC_BOOKING_URL`.
Until then, "Book a call" buttons open a pre-filled email.

**4. Confirm the site is deploying, then check indexing.** Search engines are
allowed by default — no variable has to be set, and an old `SITE_LIVE` entry in
Vercel now does nothing and can be deleted. Only `SITE_NOINDEX=true` suppresses
indexing.

Before trusting that, confirm Vercel is actually building this repository:
Project → Settings → Git should show `Nelkaiagency/Averan` on branch `main`,
and the Deployments tab should list a build for the most recent commit. Open
`https://averan.eu/robots.txt` and confirm it reads `Allow: /`; if it still
reads `Disallow: /`, the deployment is stale rather than misconfigured.

**Then verify, in this order:** the domain loads over HTTPS → `robots.txt`
allows crawling → send a real enquiry through the form → it arrives in
`info@averan.eu` → replying to it reaches the sender's address → try the live
demo with your own email.

## Hosting and domain

Use a Node-capable Next.js host; Vercel is one supported option. Install with `npm ci` and build with `npm run build`. On Vercel use its Next.js preset and automatic start handling.

Add `averan.eu` and `www.averan.eu` to the hosting project. Set `averan.eu` as primary and redirect `www.averan.eu` to it, preserving paths and query strings. Use the exact DNS values shown for this project by the provider; do not copy a generic IP address from an example.

At the existing DNS provider, export the current zone first. Add/update only the required website A/AAAA record for `@` and CNAME for `www` as instructed by the host. Preserve all Google Workspace MX records, verification TXT, SPF, DKIM and DMARC records. A website deployment does not require moving nameservers.

Vercel provisions HTTPS after the domain validates. Confirm a valid certificate on both hostnames, HTTP-to-HTTPS redirection, and the permanent www-to-apex redirect. Check for CAA restrictions if certificate issuance fails.

References: [Vercel domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [domain redirects](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting).

## Google Workspace email

`info@averan.eu` must be a real receiving mailbox. Make sends enquiry notifications and live-demo replies from it through the Gmail connection, so keep SPF/DKIM/DMARC configured for Google Workspace. Never add a second SPF record; update the existing policy when adding an authorized sender. [Google's official MX setup](https://support.google.com/a/answer/174125).

## Environment variables

| Variable | Value |
| --- | --- |
| ENQUIRY_WEBHOOK_URL / _TOKEN | Make enquiry webhook and its API key |
| LIVE_DEMO_WEBHOOK_URL / _TOKEN | Make live-demo webhook and its API key |
| SITE_ORIGIN | https://averan.eu |
| NEXT_PUBLIC_BOOKING_URL | Google Calendar appointment page, optional |
| NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_GOOGLE_ADS_ID, NEXT_PUBLIC_GOOGLE_ADS_CALL_CONVERSION | Optional; turns on the consent banner |
| SITE_NOINDEX | true only to keep the site out of search results |
| LINKEDIN_URL | Genuine https://www.linkedin.com/ profile, optional |

Rebuild after changes: public keys, metadata and the live-demo section are rendered at build time. No credentials belong in Git.

## Publication gates

- Review drafted copy: prices and package details in `lib/pricing.ts`, the "reply within one working day" promise, tools in the integrations strip, and grant/paperwork wording in the demos.
- Verify enquiry delivery, invalid fields, spam rejection and upstream failure on the deployed site.
- Check production navigation, mobile devices, TLS and redirects. Run Lighthouse/PageSpeed against the deployed URL.

No analytics or ad scripts load unless their IDs are set and the visitor accepts cookies. Fonts are self-hosted, images use Next.js optimization, and motion respects reduced-motion preferences.
