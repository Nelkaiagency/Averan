# Averan

Averan operations and technology consultancy website, built with Next.js.

Pages: Home, Services, How It Works, About, Contact, Privacy Policy, Cookie Policy.

## Development

Run `npm ci`, then `npm run dev`. Run `npm run build` before deploying.

## Request a Call

Every "Request a Call" button opens the booking page in `NEXT_PUBLIC_BOOKING_URL` in a new tab. Until it is set, buttons open a pre-filled email to info@averan.eu. Recommended: a Google Calendar appointment schedule on the info@averan.eu Workspace account (Calendar > Create > Appointment schedule > Share > copy the booking page link).

## Cookies and tracking

By default the site sets no cookies and shows no banner. Setting `NEXT_PUBLIC_GA_ID` and/or `NEXT_PUBLIC_GOOGLE_ADS_ID` turns on a consent banner (equal Accept/Reject); Google tags load only after Accept, and the Cookie Policy lists the matching cookies automatically. A "Cookie settings" footer link lets visitors change their choice.

## Legal details

Controller identity, email, hosting provider and the policy date live in `lib/site.ts`. Update `policyUpdated` whenever the policies change. Rebuild after changing any environment variable.
