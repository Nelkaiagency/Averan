import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import type {Metadata} from 'next';

export const metadata:Metadata={title:'Page not found',robots:{index:false,follow:true}};

// The root layout already provides <main id="main">, so this renders a section inside it.
export default function NotFound(){
 return <section className="hero hero-centered container" style={{minHeight:'60vh'}}><div className="hero-copy">
  <p className="eyebrow"><span/> 404</p>
  <h1>That page isn&apos;t here.</h1>
  <p className="hero-description">The link may be out of date, or the page may have moved.</p>
  <div className="hero-actions"><Link className="button" href="/">Back to Averan <ArrowUpRight size={17}/></Link><Link className="text-link" href="/contact">Contact us</Link></div>
 </div></section>;
}
