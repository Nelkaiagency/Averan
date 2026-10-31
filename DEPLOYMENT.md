# Averan launch guide

## Go-live checklist

Three things stand between the current deployment and a site that works as a
business asset. Each is done in a dashboard, not in code.

**1. Connect the domain.** `averan.eu` resolves to Vercel but serves no
certificate, so the address does not load — while every canonical URL, the
sitemap and the social tags point at it. In Vercel: Project → Settings →
Domains → add `averan.eu` and `www.averan.eu`, set the apex as primary,
redirect `www` to it, and wait for the certificate. Preserve the existing
Google Workspace MX, SPF, DKIM and DMARC records when touching DNS.

**2. Turn on enquiry delivery.** Until it is set up, the form tells visitors it
cannot send. Create a free account at resend.com, verify `averan.eu` with the
DNS records it gives you, then set in Vercel:

- `RESEND_API_KEY` — from the Resend dashboard
- `CONTACT_EMAIL_FROM` — e.g. `Averan Website <website@averan.eu>`, on the
  verified domain
- `CONTACT_EMAIL_TO` — optional, defaults to `info@averan.eu`

A webhook (`CONTACT_WEBHOOK_URL`) can be added alongside for a CRM. Email is
what the site relies on; a webhook failure never tells a visitor to try again.

**3. Confirm the site is deploying, then check indexing.** Search engines are
allowed by default — no variable has to be set, and an old `SITE_LIVE` entry in
Vercel now does nothing and can be deleted. Only `SITE_NOINDEX=true` suppresses
indexing.

Before trusting that, confirm Vercel is actually building this repository:
Project → Settings → Git should show `Nelkaiagency/Averan` on branch `main`,
and the Deployments tab should list a build for the most recent commit. Open
`https://averan.eu/robots.txt` and confirm it reads `Allow: /`; if it still
reads `Disallow: /`, the deployment is stale rather than misconfigured.

**Optional, recommended once live:** Cloudflare Turnstile is free and blocks
form spam. Set `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
together; the form enforces it only when both exist.

**Then verify, in this order:** the domain loads over HTTPS → `robots.txt`
allows crawling → send a real enquiry through the form → it arrives in
`info@averan.eu` → replying to it reaches the sender's address.


Prepared for https://averan.eu. No domain, DNS, hosting account or mailbox was changed. The website is a local preview until approved for deployment.

## 1. Hosting and domain

Use a Node-capable Next.js host; Vercel is one supported option. Import this project directory, install with `npm ci`, and build with `npm run build`. On Vercel use its Next.js preset and automatic start handling. For a conventional Node server, run the built app behind an HTTPS reverse proxy; use `npx next start --port 3000` rather than the local-only preview start command.

Only after domain approval: add `averan.eu` and `www.averan.eu` to the hosting project. Set `averan.eu` as primary and redirect `www.averan.eu` to it, preserving paths and query strings. Use the exact DNS values shown for this project by the provider; do not copy a generic IP address from an example.

At the existing DNS provider, export the current zone first. Add/update only the required website A/AAAA record for `@` and CNAME for `www` as instructed by the host. Preserve all Google Workspace MX records, verification TXT, SPF, DKIM and DMARC records. A website deployment does not require moving nameservers. If nameservers ever change, migrate the entire zone first.

Vercel provisions HTTPS after the domain validates. Confirm a valid certificate on both hostnames, HTTP-to-HTTPS redirection, and the permanent www-to-apex redirect. Check for CAA restrictions if certificate issuance fails.

References: [Vercel domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [domain redirects](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting).

## 2. Google Workspace email

Verify domain ownership in Google Admin using its supplied TXT record. Create `info@averan.eu` as an active user, group or alias with a real receiving mailbox. Follow the MX setup shown in your Admin console; new setups generally use `smtp.google.com`, while existing working Google MX configurations should be preserved. Activate Gmail, configure SPF/DKIM/DMARC for the actual senders, and test inbound mail and replies from an external account. Never add a second SPF record; update the existing policy when adding an authorized sender.

Google Workspace handles email; A/CNAME records route website traffic. Hosting does not automatically connect the website form to Gmail. [Google's official MX setup](https://support.google.com/a/answer/174125).

## 3. Contact delivery

Configure a private HTTPS webhook that validates and reliably stores the enquiry or queues/delivers it to `info@averan.eu`. It receives JSON fields `name`, `company`, `email`, `industry`, `solution` (optional), `consent` (true), `phone` (optional), `message`, `recipient`, and `source`. Treat all values as untrusted text; escape output in HTML emails. Never use the visitor address as the authenticated From address; use Reply-To instead.

The endpoint MUST return 2xx JSON `{ "accepted": true, "receiptId": "durable-record-or-message-id" }` only after durable acceptance. A bare HTTP 200 does not produce a successful form confirmation. Monitor any downstream email queue and retain failed deliveries for retry. Verify an actual enquiry in the destination inbox or durable store before launch.

Set hosting environment variables (server secrets must never have NEXT_PUBLIC prefixes):

| Variable | Required value |
| --- | --- |
| CONTACT_WEBHOOK_URL | Private HTTPS delivery/storage endpoint |
| CONTACT_WEBHOOK_TOKEN | Endpoint bearer token, if required |
| TURNSTILE_SECRET_KEY | Cloudflare server secret |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Public widget key; allowed domain averan.eu |
| SITE_ORIGIN | https://averan.eu |
| EMAIL_READY | true only after inbound mailbox verification |
| SITE_LIVE | true only for the approved production build |
| LINKEDIN_URL | Genuine https://www.linkedin.com/ profile, optional |
| FOUNDER_PHOTO_PATH | Optional local public image path, e.g. /milosz-nelka.jpg |

Rebuild after changes: public keys, metadata and availability copy are rendered at build time. Keep preview environments `SITE_LIVE=false`, with separate Turnstile hostnames/keys and staging delivery. No credentials belong in Git. Add hosting firewall rate limits for `/api/contact`; the app already limits body size, validates origin and fields, checks the honeypot and verifies Turnstile server-side. [Turnstile verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## 4. Publication gates

- Confirm founder introduction; optionally supply an authentic portrait and genuine social URL.
- Finalise the two draft legal notices with the actual controller identity, hosting/contact processors, retention period, rights contact and deployed cookie behavior. They are explicitly incomplete and must not be published as final policies.
- Verify valid form receipt, destination delivery, invalid fields, spam rejection, expired verification and upstream failure on staging. Local mocked handler checks do not verify a real inbox.
- Set `SITE_LIVE=true` only after these gates pass, rebuild, verify canonical URLs, sitemap and robots. Preview robots deliberately block indexing.
- Check production navigation, mobile devices, TLS and redirects. Run Lighthouse/PageSpeed against the deployed URL and monitor real-user Core Web Vitals; local layout checks cannot certify field performance.

No analytics, ad scripts or scheduling embeds are included. Turnstile loads only when configured. Fonts are self-hosted, images use Next.js optimization, below-fold images lazy-load, and motion respects reduced-motion preferences.

