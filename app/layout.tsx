import type {Metadata} from 'next';
import './globals.css';
import {SITE_URL,isLive} from '@/lib/site';
const title='Averan | Operations & Technology Consulting';
const description='Independent operations and technology consultancy helping businesses improve processes, design better systems and implement practical digital solutions.';
export const metadata:Metadata={metadataBase:new URL(SITE_URL),title:{default:title,template:'%s | Averan'},description,alternates:{canonical:'/'},openGraph:{title,description,type:'website',locale:'en_IE',siteName:'Averan',url:SITE_URL,images:[{url:'/averan-mark.png',width:1254,height:1254,alt:'Official Averan A logo'}]},twitter:{card:'summary_large_image',title,description,images:['/averan-mark.png']},icons:{icon:'/averan-mark.png',apple:'/averan-mark.png'},robots:{index:isLive,follow:isLive}};
const organisation={'@context':'https://schema.org','@type':'ProfessionalService',name:'Averan',description,url:SITE_URL,email:'info@averan.eu',image:`${SITE_URL}/averan-mark.png`,areaServed:'IE',address:{'@type':'PostalAddress',addressLocality:'Cork',addressCountry:'IE'},knowsAbout:['Operational consulting','Process design','Business systems','Workflow automation']};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organisation)}}/></body></html>}
