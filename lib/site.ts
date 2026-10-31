export const SITE_URL='https://averan.eu';

/**
 * Whether this deployment should be indexed by search engines.
 *
 * `SITE_LIVE` wins when it is set either way. With it unset, a production
 * deployment is indexable and everything else is not — so the live site is
 * never invisible to Google because a flag was missed, while previews and
 * local builds stay out of the index.
 */
export const isLive=process.env.SITE_LIVE!==undefined
 ? process.env.SITE_LIVE==='true'
 : process.env.VERCEL_ENV==='production';
