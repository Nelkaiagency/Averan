'use client';
import {useEffect,useId,useRef,useState,type FormEvent} from 'react';
import Script from 'next/script';
import {ArrowUpRight,LoaderCircle} from 'lucide-react';
import {contactSchema} from '@/lib/contact';
import {industries} from '@/lib/solutions';

declare global {interface Window {turnstile?: {render:(el:HTMLElement,opts:Record<string,unknown>)=>string;reset:(id:string)=>void;remove:(id:string)=>void}}}
export function ContactForm({deliveryReady=false,initialIndustry='',initialSolution=''}:{deliveryReady?:boolean;initialIndustry?:string;initialSolution?:string}) {
 const prefix=useId(),[industry,setIndustry]=useState(initialIndustry),[solution,setSolution]=useState(initialSolution);
 const [status,setStatus]=useState<'idle'|'loading'|'success'|'error'>('idle'),[message,setMessage]=useState(''),[token,setToken]=useState(''),[errors,setErrors]=useState<Record<string,string>>({}),[ready,setReady]=useState(false);
 const context=useRef<HTMLDetailsElement>(null),widget=useRef<HTMLDivElement>(null),widgetId=useRef<string|null>(null),siteKey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
 const options=industries.find(i=>i.name===industry)?.solutions??[];
 useEffect(()=>{if(!ready||!widget.current||!window.turnstile||!siteKey)return;const id=window.turnstile.render(widget.current,{sitekey:siteKey,size:'flexible',callback:(t:string)=>setToken(t),'expired-callback':()=>setToken(''),'error-callback':()=>{setToken('');setMessage('Spam protection could not load. Please refresh and try again.');setStatus('error')}});widgetId.current=id;return()=>{window.turnstile?.remove(id);widgetId.current=null}},[ready,siteKey]);
 const errorId=(name:string)=>`${prefix}-${name}-error`;
 const error=(name:string)=>errors[name]?<small id={errorId(name)}>{errors[name]}</small>:null;
 const fieldProps=(name:string)=>({'aria-invalid':!!errors[name],'aria-describedby':errors[name]?errorId(name):undefined});
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(status==='loading'||!deliveryReady)return;
  const form=e.currentTarget,data=Object.fromEntries(new FormData(form));
  const parsed=contactSchema.safeParse({...data,consent:data.consent==='on',token});
  if(!parsed.success){const next:Record<string,string>={};parsed.error.issues.forEach(issue=>{next[String(issue.path[0])]=issue.message});setErrors(next);setStatus('error');setMessage('Please check the highlighted fields.');const first=form.elements.namedItem(Object.keys(next)[0]);if(first instanceof HTMLElement){if(context.current?.contains(first))context.current.open=true;first.focus();}return}
  setErrors({});setStatus('loading');setMessage('');
  try {const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(parsed.data),signal:AbortSignal.timeout(30000)});const result=await res.json();if(!res.ok||result.success!==true)throw new Error(result.error||'Your request could not be received. Please try again.');setStatus('success');setMessage('Your call request has been received. We’ll get in touch to arrange a suitable time.');form.reset();setIndustry(initialIndustry);setSolution(initialSolution)}
  catch(error){setStatus('error');setMessage(error instanceof Error&&error.name==='TimeoutError'?'The request timed out. Delivery could not be confirmed. Please try again later.':error instanceof Error?error.message:'Unable to send. Please try again.')}
  finally{setToken('');if(widgetId.current)window.turnstile?.reset(widgetId.current)}
 }
 return <form onSubmit={submit} noValidate className="contact-form" aria-busy={status==='loading'}>
  {!deliveryReady&&<p className="delivery-notice" role="status">Call requests are not available yet. Nothing will be sent.</p>}
  <div className="form-row"><div><label htmlFor={prefix+'-name'}>Name</label><input id={prefix+'-name'} name="name" placeholder="Your full name" autoComplete="name" maxLength={120} required {...fieldProps('name')}/>{error('name')}</div><div><label htmlFor={prefix+'-email'}>Email</label><input id={prefix+'-email'} type="email" name="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" maxLength={254} required {...fieldProps('email')}/>{error('email')}</div></div>
  <details ref={context} className="optional-context"><summary>Add phone or business details (optional)</summary>
  <div className="form-row"><div><label htmlFor={prefix+'-phone'}>Phone number (optional)</label><input id={prefix+'-phone'} name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} placeholder="+353 …" {...fieldProps('phone')}/>{error('phone')}</div><div><label htmlFor={prefix+'-company'}>Business name (optional)</label><input id={prefix+'-company'} name="company" autoComplete="organization" maxLength={160} {...fieldProps('company')}/>{error('company')}</div></div>
  <div className="form-row"><div><label htmlFor={`${prefix}-industry`}>Industry (optional)</label><select id={`${prefix}-industry`} name="industry" value={industry} onChange={e=>{setIndustry(e.target.value);setSolution('')}} {...fieldProps('industry')}><option value="">Not sure / prefer to discuss</option>{industries.map(i=><option key={i.id}>{i.name}</option>)}</select>{error('industry')}</div><div><label htmlFor={`${prefix}-solution`}>Solution of interest (optional)</label><select id={`${prefix}-solution`} name="solution" value={solution} onChange={e=>setSolution(e.target.value)} {...fieldProps('solution')}><option value="">Help me find the right starting point</option>{options.map(s=><option key={s.id}>{s.title}</option>)}</select>{error('solution')}</div></div>
  <div className="form-field"><label htmlFor={`${prefix}-message`}>What would you like to improve? (optional)</label><textarea id={`${prefix}-message`} name="message" rows={3} placeholder="Briefly describe what happens today and what you’d like to improve." maxLength={5000} {...fieldProps('message')}/>{error('message')}</div>
  </details>
  <div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
  <div className="consent-field"><input id={`${prefix}-consent`} name="consent" type="checkbox" required {...fieldProps('consent')}/><label htmlFor={`${prefix}-consent`}>I agree that Averan may contact me about this request. This does not sign me up for marketing.</label></div>{error('consent')}
  {siteKey&&<><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={()=>setReady(true)} onError={()=>{setStatus('error');setMessage('Spam protection could not load. Please refresh and try again.')}}/><div ref={widget}/></>}
  <p className="form-disclosure">We use these details to respond and arrange a suitable time. <a href="/privacy">Privacy information</a>.</p>
  <button disabled={status==='loading'||!deliveryReady} className="button" type="submit">{status==='loading'?<><LoaderCircle className="loading-icon" size={17}/>Sending…</>:<>Request a Call <ArrowUpRight size={16}/></>}</button>
  {message&&<p className={`form-feedback ${status}`} role={status==='error'?'alert':'status'}>{message}</p>
 }</form>
}

export function GeneralCallRequest({deliveryReady}:{deliveryReady:boolean}){return <div className="general-call-request"><h3>Request a Call</h3><p>Leave your name and email to arrange a suitable time. Other details are optional.</p><div id="general-call-form"><ContactForm deliveryReady={deliveryReady}/></div></div>}
