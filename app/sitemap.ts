import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap{return ['','/services','/how-it-works','/pricing','/about','/contact','/privacy','/cookies'].map(path=>({url:`${SITE_URL}${path}`,changeFrequency:'monthly' as const,priority:!path?1:['/privacy','/cookies'].includes(path)?0.3:0.8}))}
