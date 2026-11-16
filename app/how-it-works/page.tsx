import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowUpRight,Check,UserRound} from 'lucide-react';
import {ProcessTimeline} from '@/components/interactions';
import {CallBand,PageHero} from '@/components/site-sections';
import {job} from '@/lib/installer-content';
export const metadata:Metadata={title:'How It Works',description:'How an enquiry moves from a Meta ad to an instant AI reply to a booked slot, and how we set it up with you.',alternates:{canonical:'/how-it-works'}};
export default function HowItWorks(){return <>
<PageHero eyebrow="HOW IT WORKS" title={<>From Meta ad<br/>to <em>booked slot.</em></>}>This is how an enquiry moves once Averan is set up. You stay in charge of the customer, the quote and the job.</PageHero>
<section className="section container job-section"><div className="section-heading"><div><p className="eyebrow">ONE ENQUIRY, START TO FINISH</p><h2>No lead left waiting.</h2></div><p><UserRound size={14} className="inline-icon"/> marks the steps where you take over. Everything else runs by itself.</p></div><ol className="job-timeline">{job.map(([step,copy,human])=><li key={step}><span className="job-number" aria-hidden="true">{human?<UserRound size={16}/>:<Check size={16}/>}</span><h3>{step}</h3><p>{copy}</p>{human&&<span className="job-approve"><UserRound size={13}/>You take over</span>}</li>)}</ol><p className="job-more"><Link href="/#demos" className="text-link">Try the interactive demos <ArrowUpRight size={15}/></Link></p></section>
<section className="section container process-section"><div className="process-intro"><p className="eyebrow">HOW WE WORK WITH YOU</p><h2>Simple to start.<br/><span className="purple">Clear along the way.</span></h2><p>From the first call to ongoing improvement, every step has a purpose.</p></div><ProcessTimeline/></section>
<CallBand location="how-it-works-band"/>
</>}
