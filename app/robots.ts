import type {MetadataRoute} from 'next';
import {SITE_URL,isLive} from '@/lib/site';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',...(isLive?{allow:'/',disallow:'/api/'}:{disallow:'/'})},sitemap:`${SITE_URL}/sitemap.xml`}}
