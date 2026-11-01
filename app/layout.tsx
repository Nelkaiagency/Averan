import type {Metadata} from 'next';
import './globals.css';
import {Navigation} from '@/components/interactions';
import {SiteFooter} from '@/components/site-sections';
import {ConsentBanner} from '@/components/consent';
import {Reveal} from '@/components/reveal';
const title='Averan | Admin Automation for Solar, Heat Pump & Electrical Installers';
const description='We automate the admin for Irish solar, heat pump, retrofit and electrical installers: enquiries, surveys, quotes, grant paperwork, scheduling and invoicing in one clear workflow.';
export const metadata:Metadata={metadataBase:new URL('https://averan.eu'),title:{default:title,template:'%s | Averan'},description,alternates:{canonical:'/'},openGraph:{title,description,type:'website',locale:'en_IE',siteName:'Averan',url:'https://averan.eu',images:[{url:'/averan-mark.png',width:1254,height:1254,alt:'Official Averan A logo'}]},twitter:{card:'summary',title,description,images:['/averan-mark.png']},icons:{icon:'/averan-mark.png',apple:'/averan-mark.png'},robots:{index:process.env.SITE_LIVE==='true',follow:process.env.SITE_LIVE==='true'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en-IE"><body><a className="skip-link" href="#main">Skip to content</a><Navigation/><main id="main">{children}</main><SiteFooter/><ConsentBanner/><Reveal/></body></html>}
