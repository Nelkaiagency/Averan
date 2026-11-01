import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowUpRight,Check,UserRound} from 'lucide-react';
import {ProcessTimeline} from '@/components/interactions';
import {CallBand,PageHero} from '@/components/site-sections';
import {job} from '@/lib/installer-content';
export const metadata:Metadata={title:'How It Works',description:'How one solar, heat pump or electrical install job runs from enquiry to payment once your admin is connected, and how we work with you to set it up.',alternates:{canonical:'/how-it-works'}};
export default function HowItWorks(){return <>
<PageHero eyebrow="HOW IT WORKS" title={<>From first enquiry<br/>to <em>paid invoice.</em></>}>This is how an install job runs once your admin is connected. You stay in charge of every decision that matters.</PageHero>
<section className="section container job-section"><div className="section-heading"><div><p className="eyebrow">ONE JOB, START TO FINISH</p><h2>Nothing waits on memory.</h2></div><p><UserRound size={14} className="inline-icon"/> marks the steps where you check and decide. Everything else runs by itself.</p></div><ol className="job-timeline">{job.map(([step,copy,human])=><li key={step}><span className="job-number" aria-hidden="true">{human?<UserRound size={16}/>:<Check size={16}/>}</span><h3>{step}</h3><p>{copy}</p>{human&&<span className="job-approve"><UserRound size={13}/>You approve</span>}</li>)}</ol><p className="job-more"><Link href="/#demos" className="text-link">Try the interactive demos <ArrowUpRight size={15}/></Link></p></section>
<section className="section container process-section"><div className="process-intro"><p className="eyebrow">HOW WE WORK WITH YOU</p><h2>Clarity before<br/><span className="purple">complexity.</span></h2><p>From the first call to ongoing improvement, every step has a purpose.</p></div><ProcessTimeline/></section>
<CallBand location="how-it-works-band"/>
</>}
