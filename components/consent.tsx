'use client';
import {useEffect,useState,type ReactNode} from 'react';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {bookingUrl,callHref,tracking,trackingEnabled} from '@/lib/site';

declare global {interface Window {dataLayer?:unknown[];gtag?:(...args:unknown[])=>void}}
const KEY='averan-consent-v1',OPEN='averan:open-consent';
type Choice='granted'|'denied';
const read=():Choice|null=>{try{const v=localStorage.getItem(KEY);return v==='granted'||v==='denied'?v:null}catch{return null}};
const save=(v:Choice)=>{try{localStorage.setItem(KEY,v)}catch{}};

// Google tags load only after the visitor accepts. Nothing is requested from Google before that.
function loadGoogleTag(){
 if(!trackingEnabled||window.gtag)return;
 const ids=[tracking.gaId,tracking.adsId].filter(Boolean);
 window.dataLayer=window.dataLayer||[];
 window.gtag=function(){window.dataLayer!.push(arguments)};
 window.gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 window.gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'denied'});
 window.gtag('js',new Date());
 ids.forEach(id=>window.gtag!('config',id));
 const s=document.createElement('script');s.async=true;s.src=`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`;document.head.appendChild(s);
}
function clearGoogleCookies(){
 const host=location.hostname.replace(/^www\./,'');
 document.cookie.split(';').map(c=>c.split('=')[0].trim()).filter(n=>/^(_ga|_gid|_gat|_gcl_)/.test(n)).forEach(n=>{[`;domain=.${host}`,`;domain=${host}`,''].forEach(d=>{document.cookie=`${n}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${d}`})});
}

export function ConsentBanner(){
 const [open,setOpen]=useState(false);
 useEffect(()=>{
  if(!trackingEnabled)return;
  const choice=read();if(choice==='granted')loadGoogleTag();if(!choice)setOpen(true);
  const reopen=()=>setOpen(true);window.addEventListener(OPEN,reopen);return()=>window.removeEventListener(OPEN,reopen);
 },[]);
 if(!open)return null;
 function decide(choice:Choice){
  const before=read();save(choice);setOpen(false);
  if(choice==='granted')loadGoogleTag();
  else if(before==='granted'){window.gtag?.('consent','update',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});clearGoogleCookies();location.reload()}
 }
 return <div className="consent-banner" role="dialog" aria-modal="false" aria-labelledby="consent-title" aria-describedby="consent-copy">
  <div><strong id="consent-title">Cookies on averan.eu</strong><p id="consent-copy">We’d like to use Google Analytics and Google Ads cookies to understand how people find and use this site. They are only set if you accept. You can change your mind at any time. <Link href="/cookies">Cookie Policy</Link></p></div>
  <div className="consent-actions"><button type="button" className="button consent-choice" onClick={()=>decide('denied')}>Reject</button><button type="button" className="button consent-choice" onClick={()=>decide('granted')}>Accept</button></div>
 </div>;
}

export function CookieSettingsLink(){
 if(!trackingEnabled)return null;
 return <button type="button" className="footer-link-button" onClick={()=>window.dispatchEvent(new Event(OPEN))}>Cookie settings</button>;
}

// Every "Request a Call" goes here: the booking page when configured, otherwise a pre-filled email.
export function CallButton({className='button',children,location}:{className?:string;children?:ReactNode;location:string}){
 const external=!!bookingUrl;
 function track(){
  if(!window.gtag||read()!=='granted')return;
  window.gtag('event','request_call_click',{link_location:location});
  if(tracking.adsCallConversion)window.gtag('event','conversion',{send_to:tracking.adsCallConversion});
 }
 return <a className={className} href={callHref} onClick={track} {...(external?{target:'_blank',rel:'noopener noreferrer'}:{})}>{children??<>Book a call <ArrowUpRight size={16}/></>}{external&&<span className="visually-hidden"> (opens booking page in a new tab)</span>}</a>;
}
