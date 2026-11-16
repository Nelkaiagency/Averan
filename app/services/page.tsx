import type {Metadata} from 'next';
import {Check} from 'lucide-react';
import {CallBand,PageHero} from '@/components/site-sections';
import {services} from '@/lib/services';
export const metadata:Metadata={title:'Services',description:'Meta ads management, instant AI follow-up and a CRM app for local service businesses in Ireland, set up and run for you.',alternates:{canonical:'/services'}};
export default function Services(){return <>
<PageHero eyebrow="SERVICES" title={<>What we set up<br/><em>for you.</em></>}>We run the Meta ads that bring enquiries in, set up AI assistants that reply to them quickly, and keep every lead in one app.</PageHero>
<section className="services-section section-tight"><div className="container"><div className="services-grid">{services.map(({id,title,text,icon:Icon,items})=><article key={title} id={id} className="service-anchor"><div className="service-top"><span className="service-icon"><Icon size={22} strokeWidth={1.5}/></span></div><h3>{title}</h3><p>{text}</p><ul>{items.map(item=><li key={item}><Check size={12}/>{item}</li>)}</ul></article>)}</div><div className="service-expansion"><div><p className="eyebrow">NO PAGES YET?</p><h3>We can set up your Facebook and Instagram pages.</h3></div><p>If you don’t have active pages, or want a fresh start, we build and prepare them before your ads launch. Your ad account and pages stay in your name.</p></div></div></section>
<CallBand location="services-band"/>
</>}
