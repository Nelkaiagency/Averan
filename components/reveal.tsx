'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

// Fades page sections in as they scroll into view. Classes are only added by JS,
// so content stays visible if scripts fail, and nothing moves for reduced-motion users.
export function Reveal(){
 const path=usePathname();
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  // The opening section animates with pure CSS on load, so it is never waiting on this script.
  const els=[...document.querySelectorAll<HTMLElement>('main > section, main > div > section')].slice(1);
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px',threshold:0});// threshold 0: tall sections can never show 8% of themselves at once
  els.forEach(el=>{el.classList.add('reveal');obs.observe(el)});
  // Safety net: never leave a section invisible if the observer doesn't fire (embeds, odd browsers).
  const fallback=setTimeout(()=>els.forEach(el=>el.classList.add('in')),2500);
  return()=>{obs.disconnect();clearTimeout(fallback)};
 },[path]);
 return null;
}
