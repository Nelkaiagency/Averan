import type {Metadata} from 'next';
import Link from 'next/link';
import {bookingUrl,site,trackingEnabled} from '@/lib/site';
export const metadata:Metadata={title:'Privacy Policy',description:'How Averan collects, uses and protects personal data.',alternates:{canonical:'/privacy'}};
const mail=<a href={`mailto:${site.email}`}>{site.email}</a>;
export default function Privacy(){return <article className="legal-page container">
<p className="eyebrow">LEGAL</p><h1>Privacy Policy</h1><p className="legal-updated">Last updated: {site.policyUpdated}</p>
<p>This policy explains how Averan collects and uses personal data when you visit {site.domain}, book a call, email us or work with us. We keep it short, we only collect what we need, and we never sell your data.</p>

<h2>1. Who we are</h2>
<p>The data controller is <strong>{site.controller}</strong>, based in {site.location}. For anything about your data, contact us at {mail}. We are not required to appoint a Data Protection Officer, but every privacy request is handled directly by our team.</p>

<h2>2. What we collect</h2>
<ul>
<li><strong>When you book a call:</strong> your name, email address, the time you choose and anything you write in the booking form (for example your business name, phone number or what you would like to improve).</li>
{process.env.LIVE_DEMO_WEBHOOK_URL&&<li><strong>When you try our live demo:</strong> your email address and the trade you picked, used once to send you the demo email. We don’t add you to any list or contact you again unless you ask us to.</li>}
<li><strong>When you fill in our enquiry form:</strong> your name, business name, email, phone number if you give it, your trade and anything you write about your business.</li>
<li><strong>When you email us:</strong> your email address, name, the content of your message and any attachments.</li>
<li><strong>When you become a client:</strong> contact and billing details, and the business information needed to deliver the work (for example how your processes run, and records inside the systems we set up for you).</li>
<li><strong>When you visit the website:</strong> our hosting provider automatically processes technical data such as your IP address, browser type and the pages requested, to deliver the site and keep it secure.{trackingEnabled?' If you accept analytics and advertising cookies, Google also collects usage data as described in our Cookie Policy.':''}</li>
</ul>
<p>Please do not send us special category data (for example health information) unless we have specifically asked for it.</p>

<h2>3. Why we use it, and our legal basis</h2>
<table className="legal-table"><thead><tr><th>Purpose</th><th>Legal basis (GDPR Art. 6)</th></tr></thead><tbody>
<tr><td>Arranging and holding a call you requested, and replying to your emails</td><td>Steps taken at your request before entering a contract (6(1)(b)), or our legitimate interest in responding to enquiries (6(1)(f))</td></tr>
<tr><td>Delivering services to clients, invoicing and support</td><td>Performance of a contract (6(1)(b))</td></tr>
<tr><td>Keeping accounting and tax records</td><td>Legal obligation (6(1)(c))</td></tr>
<tr><td>Running and securing the website</td><td>Legitimate interest in a working, secure website (6(1)(f))</td></tr>
{trackingEnabled&&<tr><td>Measuring visits and the performance of our Google Ads</td><td>Your consent (6(1)(a)), which you can withdraw at any time</td></tr>}
<tr><td>Occasional follow-up about a request you made</td><td>Legitimate interest (6(1)(f)). We do not send marketing newsletters, and you can ask us to stop at any time</td></tr>
</tbody></table>

<h2>4. Who we share it with</h2>
<p>We do not sell or rent personal data. We only share it with service providers who process it on our behalf, under written data processing terms:</p>
<ul>
<li><strong>Google Ireland Limited</strong> (Google Workspace): our email, calendar{bookingUrl?', appointment booking page':''} and Google Meet video calls.</li>
<li><strong>{site.hostingProvider}</strong>: website hosting and delivery.</li>
{(process.env.LIVE_DEMO_WEBHOOK_URL||process.env.ENQUIRY_WEBHOOK_URL)&&<li><strong>Our automation provider</strong> (Make or Zapier): delivers enquiry form messages to our inbox{process.env.LIVE_DEMO_WEBHOOK_URL?' and sends the live demo email':''}.</li>}
{trackingEnabled&&<li><strong>Google Ireland Limited</strong> (Google Analytics and Google Ads): only if you accept these cookies.</li>}
<li><strong>Our accountant, bank and payment providers</strong>: for client invoicing and statutory records.</li>
</ul>
<p>We may also disclose data where the law requires it, for example to Revenue or in response to a valid legal request.</p>

<h2>5. International transfers</h2>
<p>Some of our providers, or their sub-processors, may process data outside the European Economic Area, including in the United States. Where that happens, transfers are protected by the EU-U.S. Data Privacy Framework where the provider is certified, or by the European Commission’s Standard Contractual Clauses.</p>

<h2>6. How long we keep it</h2>
<ul>
<li><strong>Enquiries and booking details</strong> that do not lead to work: up to 24 months after our last contact, then deleted.</li>
<li><strong>Client records, contracts and invoices:</strong> 6 years after the end of the financial year they relate to, as required by Irish tax law.</li>
<li><strong>Website server logs:</strong> kept by our hosting provider for a short period for security purposes, in line with its own retention settings.</li>
</ul>

<h2>7. Your rights</h2>
<p>Under the GDPR you have the right to access your data, to have it corrected or deleted, to restrict or object to how we use it, and to receive it in a portable format. Where we rely on consent, you can withdraw it at any time without affecting earlier processing. To use any of these rights, email {mail}. We will reply within one month, and we may ask you to confirm your identity first.</p>
<p>If you are unhappy with how we handle your data, please tell us so we can try to fix it. You also have the right to complain to the <a href="https://www.dataprotection.ie" rel="noopener noreferrer">Data Protection Commission</a>, Ireland’s data protection authority.</p>

<h2>8. Security</h2>
<p>We use reputable providers, encrypted connections (HTTPS), two-factor authentication on our accounts and access limited to the people who need it. No system is completely secure, but we take reasonable steps to protect your data and will notify you and the Data Protection Commission of a breach where the law requires it.</p>

<h2>9. Changes to this policy</h2>
<p>We will update this page if the way we handle data changes. The date at the top shows when it was last revised. Cookies are covered separately in our <Link href="/cookies">Cookie Policy</Link>.</p>
</article>}
