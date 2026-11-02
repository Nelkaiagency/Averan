'use client';
import {useState,type FormEvent} from 'react';
import Link from 'next/link';
import {Check,LoaderCircle,MailCheck,Send} from 'lucide-react';

// Real demo: the visitor's own inbox receives the instant reply, sent by a real automation.
const options=[['solar','Solar panels'],['heat','Heat pump'],['retrofit','Insulation / retrofit'],['electric','EV charger / electrical']] as const;

export function LiveDemo(){
 const [state,setState]=useState<'idle'|'sending'|'sent'|'error'>('idle'),[message,setMessage]=useState('');
 const [elapsed,setElapsed]=useState<number|null>(null);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(state==='sending')return;
  const f=new FormData(e.currentTarget);
  const body={email:String(f.get('email')||'').trim(),trade:String(f.get('trade')),consent:f.get('consent')==='on',website:String(f.get('website')||'')};
  if(!body.consent){setState('error');setMessage('Please tick the box so we can send the demo email.');return}
  setState('sending');setMessage('');const t0=performance.now();
  try{const res=await fetch('/api/live-demo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});const data=await res.json();if(!res.ok||!data.success)throw new Error(data.error||'Something went wrong.');setElapsed((performance.now()-t0)/1000);setState('sent')}
  catch(err){setState('error');setMessage(err instanceof Error&&err.name!=='TimeoutError'?err.message:'The demo timed out. Please try again later.')}
 }
 if(state==='sent')return <div className="live-done pop" role="status"><MailCheck size={26}/><div><strong>Check your inbox.</strong><p>Our automation sent your instant reply{elapsed!==null&&elapsed<10?' in a few seconds':''}. That’s exactly what your customers would get, with your name and branding on it. It can take a minute to arrive; check spam if you don’t see it.</p></div></div>;
 return <form className="live-form" onSubmit={submit} noValidate>
  <div className="live-row"><label>Your email<input name="email" type="email" required autoComplete="email" inputMode="email" placeholder="you@yourcompany.ie" maxLength={254}/></label><label>Pretend you’re asking about<select name="trade" defaultValue="solar">{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label></div>
  <div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
  <label className="live-consent"><input type="checkbox" name="consent"/><span>Send me one demo email. It is not a sign-up: we don’t add you to any list. <Link href="/privacy">Privacy Policy</Link></span></label>
  <button type="submit" className="button" disabled={state==='sending'}>{state==='sending'?<><LoaderCircle className="loading-icon" size={16}/>Sending…</>:<><Send size={16}/>Send me the instant reply</>}</button>
  {state==='error'&&<p className="live-error" role="alert">{message}</p>}
  <ul className="live-points"><li><Check size={13}/>A real automation, not a mock-up</li><li><Check size={13}/>Arrives in seconds</li><li><Check size={13}/>One email, nothing more</li></ul>
 </form>;
}
