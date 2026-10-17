import type {Metadata} from 'next';
import './globals.css';
const title='Averan | Operations & Technology Consulting';
const description='Independent operations and technology consultancy helping businesses improve processes, design better systems and implement practical digital solutions.';
export const metadata:Metadata={metadataBase:new URL('https://averan.eu'),title:{default:title,template:'%s | Averan'},description,alternates:{canonical:'/'},openGraph:{title,description,type:'website',locale:'en_IE',siteName:'Averan',url:'https://averan.eu',images:[{url:'/averan-mark.png',width:1254,height:1254,alt:'Official Averan A logo'}]},twitter:{card:'summary',title,description,images:['/averan-mark.png']},icons:{icon:'/averan-mark.png',apple:'/averan-mark.png'},robots:{index:process.env.SITE_LIVE==='true',follow:process.env.SITE_LIVE==='true'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
