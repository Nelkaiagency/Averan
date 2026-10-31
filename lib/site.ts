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
