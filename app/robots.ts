import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',...(process.env.SITE_LIVE==='true'?{allow:'/',disallow:'/api/'}:{disallow:'/'})},sitemap:'https://averan.eu/sitemap.xml'}}
