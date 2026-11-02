import type {Metadata} from 'next';
import Link from 'next/link';
import {CookieSettingsLink} from '@/components/consent';
import {bookingUrl,site,tracking,trackingEnabled} from '@/lib/site';
export const metadata:Metadata={title:'Cookie Policy',description:'Which cookies and similar technologies averan.eu uses, and how to control them.',alternates:{canonical:'/cookies'}};
export default function Cookies(){return <article className="legal-page container">
<p className="eyebrow">LEGAL</p><h1>Cookie Policy</h1><p className="legal-updated">Last updated: {site.policyUpdated}</p>
<p>Cookies are small files a website stores on your device. Similar technologies, such as your browser’s local storage, work in the same way. Irish law (the ePrivacy Regulations, S.I. 336 of 2011) says we may only use them without asking if they are strictly necessary. Everything else needs your consent first.</p>

<h2>Strictly necessary</h2>
<p>These are needed for the site to work and do not require consent.</p>
<table className="legal-table"><thead><tr><th>Name</th><th>Provider</th><th>Purpose</th><th>Duration</th></tr></thead><tbody>
{trackingEnabled?<tr><td>averan-consent-v1 (local storage)</td><td>Averan</td><td>Remembers whether you accepted or rejected optional cookies, so we don’t ask on every page</td><td>Until you clear it or change your choice</td></tr>
:<tr><td colSpan={4}>None. This website does not currently set any cookies or store anything on your device.</td></tr>}
</tbody></table>

<h2>Analytics and advertising (optional)</h2>
{trackingEnabled?<>
<p>These are only set if you click <strong>Accept</strong> on the cookie banner. If you reject them, or ignore the banner, nothing is loaded from Google and none of these cookies are set.</p>
<table className="legal-table"><thead><tr><th>Name</th><th>Provider</th><th>Purpose</th><th>Duration</th></tr></thead><tbody>
{tracking.gaId&&<><tr><td>_ga</td><td>Google Analytics</td><td>Distinguishes visitors so we can count visits</td><td>2 years</td></tr><tr><td>_ga_{tracking.gaId.replace('G-','')}</td><td>Google Analytics</td><td>Keeps track of a visit (session)</td><td>2 years</td></tr></>}
{tracking.adsId&&<><tr><td>_gcl_au</td><td>Google Ads</td><td>Measures whether someone who clicked one of our ads later booked a call</td><td>90 days</td></tr><tr><td>IDE, test_cookie (google.com, doubleclick.net)</td><td>Google Ads</td><td>Ad measurement on Google’s own domains</td><td>Up to 13 months</td></tr></>}
</tbody></table>
<p>Google’s own use of this data is described in <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer">How Google uses information from sites that use its services</a>. We do not allow Google to use this data for ad personalisation.</p>
</>:<p>We do not currently use analytics or advertising cookies. If we add them in future, we will update this page and ask for your consent with a banner before anything is set.</p>}

<h2>Third-party pages we link to</h2>
<p>{bookingUrl?'When you book a call, our booking page opens on Google Calendar in a new tab. That page is run by Google, which may set its own cookies under its own policy. Nothing from it is embedded on averan.eu.':'Links to other websites, such as LinkedIn, take you to pages run by those companies, which may set their own cookies.'} See <a href="https://policies.google.com/technologies/cookies" rel="noopener noreferrer">Google’s cookie information</a>.</p>

<h2>Your choices</h2>
<p>{trackingEnabled?<>You can change your choice at any time: <CookieSettingsLink/>. </>:null}You can also block or delete cookies in your browser settings. Blocking strictly necessary storage may stop some features from working.</p>

<h2>Contact</h2>
<p>Questions about cookies or your data? Email <a href={`mailto:${site.email}`}>{site.email}</a> or read our <Link href="/privacy">Privacy Policy</Link>.</p>
</article>}
