'use client';
import {useId,useState,type FormEvent} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Check,LoaderCircle} from 'lucide-react';
import {site,tracking} from '@/lib/site';

// Quick enquiry for business owners who'd rather type than book a call.
// Sends through /api/enquiry; if delivery isn't connected yet, it opens a pre-filled email instead.
export const enquiryTrades=['Solar PV & batteries','Heat pumps','Insulation & retrofit','Electrical & EV chargers','Other energy installs'] as const;
type Fields={name:string;business:string;email:string;phone:string;trade:string;message:string};

const mailtoFor=(f:Fields)=>`mailto:${site.email}?subject=${encodeURIComponent(`Enquiry from ${f.business||f.name}`)}&body=${encodeURIComponent(`Name: ${f.name}\nBusiness: ${f.business}\nEmail: ${f.email}\nPhone: ${f.phone}\nTrade: ${f.trade}\n\nBiggest admin headache:\n${f.message}\n`)}`;

export function EnquiryForm({dark=false,location}:{dark?:boolean;location:string}){
 const id=useId();
 const [state,setState]=useState<'idle'|'sending'|'sent'|'emailed'|'error'>('idle'),[error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(state==='sending')return;
  const form=e.currentTarget,d=new FormData(form);
  const f:Fields={name:String(d.get('name')||'').trim(),business:String(d.get('business')||'').trim(),email:String(d.get('email')||'').trim(),phone:String(d.get('phone')||'').trim(),trade:String(d.get('trade')||''),message:String(d.get('message')||'').trim()};
  if(f.name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)){setState('error');setError('Please add your name and a valid email.');return}
  if(d.get('consent')!=='on'){setState('error');setError('Please tick the box so we can reply to you.');return}
  setState('sending');setError('');
  try{
   const res=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f,consent:true,website:String(d.get('website')||'')}),signal:AbortSignal.timeout(15000)});
   const data=await res.json().catch(()=>({}));
   if(res.status===503&&data.fallback){window.location.href=mailtoFor(f);setState('emailed');return}
   if(!res.ok||!data.success)throw new Error(data.error||'Something went wrong. Please email us instead.');
   if(window.gtag){window.gtag('event','enquiry_submit',{form_location:location});if(tracking.adsCallConversion)window.gtag('event','conversion',{send_to:tracking.adsCallConversion})}
   setState('sent');form.reset();
  }catch(err){setState('error');setError(err instanceof Error&&err.name!=='TimeoutError'?err.message:'That took too long. Please try again or email us.')}
 }
 if(state==='sent')return <div className={`enquiry-done${dark?' dark':''}`} role="status"><Check size={22}/><div><strong>Thanks, we’ve got it.</strong><p>We’ll reply within one working day with a few questions or times for a quick call.</p></div></div>;
 if(state==='emailed')return <div className={`enquiry-done${dark?' dark':''}`} role="status"><Check size={22}/><div><strong>Your email app should open now.</strong><p>Your details are filled in. Just press send. Nothing opened? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p></div></div>;
 return <form className={`enquiry-form${dark?' dark':''}`} onSubmit={submit} noValidate>
  <p className="enquiry-title">Or tell us about your business</p>
  <div className="enquiry-row"><label htmlFor={`${id}-name`}>Your name<input id={`${id}-name`} name="name" autoComplete="name" required maxLength={80}/></label><label htmlFor={`${id}-business`}>Business name<input id={`${id}-business`} name="business" autoComplete="organization" maxLength={120}/></label></div>
  <div className="enquiry-row"><label htmlFor={`${id}-email`}>Email<input id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254}/></label><label htmlFor={`${id}-phone`}><span>Phone <small>(optional)</small></span><input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30}/></label></div>
  <label htmlFor={`${id}-trade`}>What do you install?<select id={`${id}-trade`} name="trade" defaultValue={enquiryTrades[0]}>{enquiryTrades.map(t=><option key={t}>{t}</option>)}</select></label>
  <label htmlFor={`${id}-message`}><span>Biggest admin headache <small>(optional)</small></span><textarea id={`${id}-message`} name="message" rows={3} maxLength={1500} placeholder="For example: chasing quotes, booking surveys, grant forms…"/></label>
  <div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
  <label className="enquiry-consent"><input type="checkbox" name="consent"/><span>Averan may contact me about this enquiry. Not a marketing sign-up. <Link href="/privacy">Privacy Policy</Link></span></label>
  <button type="submit" className={dark?'button light':'button'} disabled={state==='sending'}>{state==='sending'?<><LoaderCircle className="loading-icon" size={16}/>Sending…</>:<>Send enquiry <ArrowUpRight size={16}/></>}</button>
  {state==='error'&&<p className="enquiry-error" role="alert">{error}</p>}
 </form>;
}
