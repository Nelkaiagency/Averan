import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowUpRight,Check} from 'lucide-react';
import {CallButton} from '@/components/consent';
import {CallBand,PageHero} from '@/components/site-sections';
import {fineprint,plan,pricingFaqs} from '@/lib/pricing';
export const metadata:Metadata={title:'Pricing',description:'One package: Meta ads, instant AI follow-up and a CRM app for €2,000 over 3 months, plus ad spend paid directly to Meta. Free first call.',alternates:{canonical:'/pricing'}};
export default function Pricing(){return <>
<PageHero eyebrow="PRICING" title={<>One package.<br/><em>One clear price.</em></>}>Start with a free call. The package covers the ads, the AI follow-up and the app. Ad spend goes straight to Meta from your own card.</PageHero>
<section className="container pricing-grid" aria-label="Package"><article className="plan recommended"><h2>{plan.name}</h2><p className="plan-tagline">{plan.tagline}</p><p className="plan-price"><strong>{plan.price}</strong><span>{plan.priceNote}</span></p><p className="plan-tagline">{plan.adSpend}</p><CallButton className="button" location="pricing-package">{plan.cta} <ArrowUpRight size={15}/></CallButton><h3>What you get</h3><ul>{plan.includes.map(i=><li key={i}><Check size={14}/>{i}</li>)}</ul></article></section>
<section className="container fineprint"><ul>{fineprint.map(f=><li key={f}>{f}</li>)}</ul></section>
<section className="section container faq-section"><div className="section-heading"><div><p className="eyebrow">QUESTIONS, ANSWERED</p><h2>About pricing.</h2></div><p>Something else on your mind? <Link href="/contact" className="inline-link">Ask us on a free call.</Link></p></div><div className="faq-list">{pricingFaqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
<CallBand location="pricing-band"/>
</>}
