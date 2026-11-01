import type {Metadata} from 'next';
import './globals.css';
import {Navigation} from '@/components/interactions';
import {SiteFooter} from '@/components/site-sections';
import {ConsentBanner} from '@/components/consent';
import {Reveal} from '@/components/reveal';
import {SITE_URL,isLive,site} from '@/lib/site';
const title='Averan | Admin Automation for Solar, Heat Pump & Electrical Installers';
const description='We automate the admin for Irish solar, heat pump, retrofit and electrical installers: enquiries, surveys, quotes, grant paperwork, scheduling and invoicing in one clear workflow.';
// Social images come from app/opengraph-image.tsx, so none are listed here.
export const metadata:Metadata={metadataBase:new URL(SITE_URL),title:{default:title,template:'%s | Averan'},description,alternates:{canonical:'/'},openGraph:{title,description,type:'website',locale:'en_IE',siteName:'Averan',url:SITE_URL},twitter:{card:'summary_large_image',title,description},icons:{icon:'/averan-mark.png',apple:'/averan-mark.png'},robots:{index:isLive,follow:isLive}};
const organisation={'@context':'https://schema.org','@type':'ProfessionalService',name:'Averan',description,url:SITE_URL,email:site.email,image:`${SITE_URL}/averan-mark.png`,areaServed:'IE',address:{'@type':'PostalAddress',addressLocality:'Cork',addressCountry:'IE'},knowsAbout:['Solar PV installer admin','Heat pump installer admin','Retrofit project coordination','Electrical contractor admin','Workflow automation']};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en-IE"><body><a className="skip-link" href="#main">Skip to content</a><Navigation/><main id="main">{children}</main><SiteFooter/><ConsentBanner/><Reveal/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organisation)}}/></body></html>}
