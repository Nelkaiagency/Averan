import type {Metadata} from 'next';
import {Check} from 'lucide-react';
import {Comparison,Problems} from '@/components/interactions';
import {CallBand,PageHero} from '@/components/site-sections';
import {services} from '@/lib/services';
export const metadata:Metadata={title:'Services',description:'Enquiry, quote, grant paperwork, scheduling and invoicing automation for solar, heat pump, retrofit and electrical installers in Ireland.',alternates:{canonical:'/services'}};
export default function Services(){return <>
<PageHero eyebrow="SERVICES" title={<>What we set up<br/><em>for installers.</em></>}>We start by understanding how your jobs actually run, then connect enquiries, surveys, quotes, paperwork, installs and invoicing into one clear workflow.</PageHero>
<section className="services-section section-tight"><div className="container"><div className="services-grid">{services.map(({id,title,text,icon:Icon,items},i)=><article key={title} id={id} className="service-anchor"><div className="service-top"><span className="service-icon"><Icon size={22} strokeWidth={1.5}/></span></div><h3>{title}</h3><p>{text}</p><ul>{items.map(item=><li key={item}><Check size={12}/>{item}</li>)}</ul></article>)}</div><div className="service-expansion"><div><p className="eyebrow">ALSO AVAILABLE</p><h3>Websites and dashboards for installers.</h3></div><p>Enquiry-focused websites, simple quote request forms and a dashboard showing every job’s stage, so the office and the crews see the same picture.</p></div></div></section>
<section className="section container problems-section"><div className="section-heading"><div><p className="eyebrow">THE OPERATIONAL CHALLENGE</p><h2>More jobs.<br/>More admin.</h2></div><p>When demand picks up, enquiries, surveys and paperwork pile up faster than the office can keep track of them.</p></div><Problems/></section>
<section className="section container"><div className="section-heading"><div><p className="eyebrow">WHAT CHANGES</p><h2>Less searching.<br/>A clearer picture.</h2></div><p>Useful technology brings the right information and responsibilities together. Move the slider to compare.</p></div><Comparison/></section>
<CallBand location="services-band"/>
</>}
