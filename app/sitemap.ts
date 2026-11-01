import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{return ['','/services','/how-it-works','/pricing','/about','/contact','/privacy','/cookies'].map(path=>({url:`https://averan.eu${path}`,changeFrequency:'monthly' as const,priority:!path?1:['/privacy','/cookies'].includes(path)?0.3:0.8}))}
