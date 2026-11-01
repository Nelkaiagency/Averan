// Business facts used across pages and legal notices. Update here, not in page copy.
export const site={
 name:'Averan',
 controller:'Averan',
 location:'Cork, Ireland',
 email:'info@averan.eu',
 domain:'averan.eu',
 origin:'https://averan.eu',
 hostingProvider:'Vercel Inc.',
 policyUpdated:'1 November 2026',
};
// Google Calendar appointment page (or Calendly / Cal.com). Falls back to email until set.
export const bookingUrl=process.env.NEXT_PUBLIC_BOOKING_URL?.startsWith('https://')?process.env.NEXT_PUBLIC_BOOKING_URL:'';
export const callHref=bookingUrl||`mailto:${site.email}?subject=${encodeURIComponent('Call request')}&body=${encodeURIComponent('Hi Averan,\n\nI would like to arrange a call.\n\nName:\nBusiness:\nPhone (optional):\nWhat I would like to improve:\n')}`;
// Optional measurement. Nothing loads unless an ID is set AND the visitor accepts.
export const tracking={
 gaId:process.env.NEXT_PUBLIC_GA_ID?.match(/^G-[A-Z0-9]+$/)?process.env.NEXT_PUBLIC_GA_ID:'',
 adsId:process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.match(/^AW-\d+$/)?process.env.NEXT_PUBLIC_GOOGLE_ADS_ID:'',
 adsCallConversion:process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_CONVERSION?.match(/^AW-\d+\/[\w-]+$/)?process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_CONVERSION:'',
};
export const trackingEnabled=!!(tracking.gaId||tracking.adsId);

export const SITE_URL='https://averan.eu';

/**
 * Whether this deployment should be indexed by search engines.
 *
 * Indexing is on by default. Vercel preview and development deployments are
 * excluded, and `SITE_NOINDEX=true` suppresses it deliberately — but nothing
 * else can switch it off, so the live site can never end up invisible to
 * Google because a flag was left set in a dashboard.
 */
const environment=process.env.VERCEL_ENV;
export const isLive=process.env.SITE_NOINDEX!=='true'&&environment!=='preview'&&environment!=='development';
