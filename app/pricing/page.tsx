import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowUpRight,Check,Minus} from 'lucide-react';
import {CallButton} from '@/components/consent';
import {CallBand,PageHero,WorksWith} from '@/components/site-sections';
import {comparison,custom,fineprint,plans,pricingFaqs,type Cell} from '@/lib/pricing';
export const metadata:Metadata={title:'Pricing',description:'Clear starting prices for admin automation for solar, heat pump, retrofit and electrical installers in Ireland. Free review, fixed quotes, no markup on software.',alternates:{canonical:'/pricing'}};
const cell=(v:Cell)=>v===true?<Check size={16} aria-label="Included"/>:v==='—'?<Minus size={16} aria-label="Not included"/>:v;
export default function Pricing(){return <>
<PageHero eyebrow="PRICING" title={<>Clear prices.<br/><em>No surprises.</em></>}>Start with a free review. If we can help, you get a fixed quote before any work begins, and nothing goes live until you approve it.</PageHero>
<section className="container pricing-grid" aria-label="Packages">{plans.map(p=><article key={p.id} className={`plan${p.recommended?' recommended':''}`}>{p.recommended&&<span className="plan-badge">MOST POPULAR</span>}<h2>{p.name}</h2><p className="plan-tagline">{p.tagline}</p><p className="plan-price"><strong>{p.price}</strong><span>{p.priceNote}</span></p><CallButton className={p.recommended?'button':'button outline'} location={`pricing-${p.id}`}>{p.cta} <ArrowUpRight size={15}/></CallButton><h3>What you get</h3><ul>{p.includes.map(i=><li key={i}><Check size={14}/>{i}</li>)}</ul></article>)}</section>
<section className="container custom-plan"><div><p className="eyebrow">{custom.name.toUpperCase()}</p><h2>{custom.tagline}</h2></div><ul>{custom.includes.map(i=><li key={i}><Check size={14}/>{i}</li>)}</ul><CallButton className="button outline" location="pricing-custom">Talk to us <ArrowUpRight size={15}/></CallButton></section>
<section className="container fineprint"><ul>{fineprint.map(f=><li key={f}>{f}</li>)}</ul></section>
<section className="section container"><div className="section-heading"><div><p className="eyebrow">COMPARE</p><h2>What each package includes.</h2></div><p>The Care Plan can be added to any project once it is live.</p></div>
<div className="compare-wrap"><table className="compare-table"><thead><tr><th scope="col"><span className="visually-hidden">Feature</span></th>{plans.slice(0,3).map(p=><th scope="col" key={p.id}>{p.name}<small>{p.price}</small></th>)}</tr></thead>{comparison.map(g=><tbody key={g.group}><tr className="compare-group"><th scope="rowgroup" colSpan={4}>{g.group}</th></tr>{g.rows.map(([label,...vals])=><tr key={label}><th scope="row">{label}</th>{vals.map((v,i)=><td key={i}>{cell(v)}</td>)}</tr>)}</tbody>)}</table></div></section>
<WorksWith/>
<section className="section container faq-section"><div className="section-heading"><div><p className="eyebrow">QUESTIONS, ANSWERED</p><h2>About pricing.</h2></div><p>Something else on your mind? <Link href="/contact" className="inline-link">Ask us on a free call.</Link></p></div><div className="faq-list">{pricingFaqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
<CallBand location="pricing-band"/>
</>}
