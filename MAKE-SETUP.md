# Make setup: enquiry form and live demo

Two Make scenarios power the website:

| Scenario | Website setting | What it does |
| --- | --- | --- |
| **Averan – Enquiry form** | `ENQUIRY_WEBHOOK_URL` | Emails each website enquiry to info@averan.eu |
| **Averan – Live demo** | `LIVE_DEMO_WEBHOOK_URL` | Emails a visitor the instant reply your customers would get |

Until a setting is filled in, the site keeps working: the enquiry form opens a pre-filled email, and the live demo section stays hidden.

You need a Make account (the free plan is enough to start) and the Google Workspace account for info@averan.eu.

---

## 1. Enquiry form scenario

1. In Make, click **Create a new scenario**. Name it `Averan – Enquiry form`.
2. Add module **Webhooks → Custom webhook**. Click **Add**, name it `averan-enquiry`, and **copy the webhook address**. Keep this page open.
3. Teach Make the data shape: Make now waits for one test request. Send a test enquiry (see *Testing* below). Make shows **Successfully determined** and learns these fields:
   `name`, `business`, `email`, `phone`, `trade`, `message`, `recipient`, `source`, `receivedAt`
4. Add module **Gmail → Send an email**. Connect it to the info@averan.eu Google account (Google will ask you to approve access).
   - **To:** `info@averan.eu`
   - **Reply-To:** under *Show advanced settings → Additional email headers*, add key `Reply-To` with value `email` (so pressing Reply answers the customer directly)
   - **Subject:** `New enquiry: {{business}} ({{trade}})`. If `business` is empty, use `{{name}}`.
   - **Body type:** Raw HTML. Wrap free-text fields in `escapeHTML()` so anything a visitor types shows as plain text.
   - **Content:**
     ```
     New enquiry from averan.eu

     Name: {{name}}
     Business: {{business}}
     Email: {{email}}
     Phone: {{phone}}
     Trade: {{trade}}

     Biggest admin headache:
     {{message}}

     Received: {{receivedAt}}
     ```
5. Optional but recommended: add a **Google Sheets → Add a row** module after Gmail, so every enquiry is also logged in a sheet.
6. Click **Save**, then switch the scenario **ON** (bottom-left toggle) and set scheduling to **Immediately**.

> Never put the visitor's email in the **From** field. It must always come from info@averan.eu; the visitor goes in **Reply-To** only.

---

## 2. Live demo scenario

1. Create a new scenario named `Averan – Live demo`.
2. Add **Webhooks → Custom webhook**, name it `averan-live-demo`, and copy the address.
3. Send a test (see *Testing*). Make learns: `email`, `trade`, `source`, `consentedAt`.
4. Add **Gmail → Send an email** (same info@averan.eu connection):
   - **To:** map `email`
   - **Subject:** `Thanks for your enquiry. Quick question before we book you in`
   - **Content:** HTML using Make's `switch()` function so one email covers every trade:
     ```
     <p>Hi there,</p><p>Thanks for getting in touch about {{switch(1.trade; "solar"; "solar panels"; "heat"; "a heat pump"; "retrofit"; "insulation"; "electric"; "an EV charger"; "your project")}}. {{switch(1.trade; "solar"; "To size your system properly, could you reply with a few photos of your roof and a recent electricity bill?"; "heat"; "To check your home is ready, could you reply with a photo of your current boiler and your BER cert if you have one?"; "retrofit"; "To plan the works, could you reply with a few photos of your attic and a recent energy bill?"; "electric"; "So we can quote without a site visit, could you reply with a photo of your fuse board and where you park?"; "Could you reply with a few details about your home and what you need?")}}</p><p>Once we have those, we will come back to you with the next step, usually a link to book your free survey at a time that suits you.</p><p>Thanks,<br>Your installer</p><hr><p style="color:#888;font-size:13px">This is the Averan live demo: the automatic reply an installer's customers would get, sent in seconds. Want this for your business? Reply to this email or visit <a href="https://averan.eu">averan.eu</a>.</p>
     ```
     Typing `{{1.field}}` or `{{function(...)}}` into a Make field turns it into mapped pills automatically.

   The per-trade wording below is the same text, kept here for reference if you prefer a Router with one route per trade.

4. Add a **Router** with four routes, one per trade. On each route set a filter **`trade` equal to** `solar`, `heat`, `retrofit` or `electric`.
   On each route add **Gmail → Send an email**:
   - **To:** map `email`
   - **From:** info@averan.eu (the connected account)
   - **Subject:** `Thanks for your enquiry. Quick question before we book you in`
   - **Content** (plain text), one per route:

   **solar**
   ```
   Hi there,

   Thanks for getting in touch about solar panels. To size your system properly, could you reply with:

   • a few photos of your roof
   • a recent electricity bill

   Once we have those, we'll send you a link to book your free survey at a time that suits you.

   Thanks,
   [Installer name]

   —
   This is the Averan live demo: the automatic reply an installer's customers would get, sent in seconds. Want this for your business? Reply to this email or visit averan.eu.
   ```

   **heat**
   ```
   Hi there,

   Thanks for getting in touch about a heat pump. To check your home is ready, could you reply with:

   • a photo of your current boiler
   • your BER cert, if you have one

   Once we have those, we'll send you a link to book your free home survey.

   Thanks,
   [Installer name]

   —
   This is the Averan live demo: the automatic reply an installer's customers would get, sent in seconds. Want this for your business? Reply to this email or visit averan.eu.
   ```

   **retrofit**
   ```
   Hi there,

   Thanks for getting in touch about insulation. To plan the works, could you reply with:

   • a few photos of your attic
   • a recent energy bill

   Once we have those, we'll send you a link to book your free survey.

   Thanks,
   [Installer name]

   —
   This is the Averan live demo: the automatic reply an installer's customers would get, sent in seconds. Want this for your business? Reply to this email or visit averan.eu.
   ```

   **electric**
   ```
   Hi there,

   Thanks for getting in touch about an EV charger. So we can quote without a site visit, could you reply with:

   • a photo of your fuse board
   • a photo of where you park

   We'll come back to you with a fixed quote.

   Thanks,
   [Installer name]

   —
   This is the Averan live demo: the automatic reply an installer's customers would get, sent in seconds. Want this for your business? Reply to this email or visit averan.eu.
   ```
6. Save, switch **ON**, scheduling **Immediately**.

The demo never sends anything the visitor typed except their own address, so it can't be used to send spam content.

---

## 3. Protect the webhooks (recommended)

Anyone who learns a webhook address could send it data directly. Make has built-in protection:

1. Open the webhook module → **Edit** next to the webhook name → **API Key authentication** → **Add API key**.
2. Paste a long random secret, for example generated by a password manager. Use a different one per webhook.
3. Put the same secrets in the website settings as `ENQUIRY_WEBHOOK_TOKEN` and `LIVE_DEMO_WEBHOOK_TOKEN`. The website sends them in the `x-make-apikey` header automatically, and Make rejects any request without the right key.

---

## 4. Website settings (Vercel)

In Vercel → your project → **Settings → Environment Variables**, add for **Production**:

```
ENQUIRY_WEBHOOK_URL=<enquiry webhook address>
ENQUIRY_WEBHOOK_TOKEN=<enquiry secret>
LIVE_DEMO_WEBHOOK_URL=<live demo webhook address>
LIVE_DEMO_WEBHOOK_TOKEN=<live demo secret>
SITE_ORIGIN=https://averan.eu
```

Then **redeploy**. The live demo section and the privacy-policy line about the automation provider appear automatically after the redeploy.

Also add a rate limit in Vercel (Firewall) for `/api/enquiry` and `/api/live-demo`, for example 10 requests per minute per IP. The site has its own limits, but they are per server instance.

---

## Testing

Run the site locally with the webhook addresses set, or ask Claude to run these tests. Use **your own email** for the live demo test.

```bash
curl -X POST http://127.0.0.1:8766/api/enquiry -H "Content-Type: application/json" -d '{"name":"Test Owner","business":"Test Solar Ltd","email":"you@example.com","phone":"","trade":"Solar PV & batteries","message":"Test enquiry","consent":true,"website":""}'
```

```bash
curl -X POST http://127.0.0.1:8766/api/live-demo -H "Content-Type: application/json" -d '{"email":"you@example.com","trade":"solar","consent":true,"website":""}'
```

A working setup returns `{"success":true}`, and the email arrives within a few seconds.
