import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap{return ['','/privacy','/cookies'].map(path=>({url:`${SITE_URL}${path}`,changeFrequency:'monthly' as const,priority:path?0.3:1}))}
