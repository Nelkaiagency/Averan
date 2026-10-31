import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import type {Metadata} from 'next';

export const metadata:Metadata={title:'Page not found',robots:{index:false,follow:true}};

export default function NotFound(){
 return <main id="main" className="container" style={{minHeight:'70vh',display:'flex',flexDirection:'column',justifyContent:'center',gap:18,paddingTop:80,paddingBottom:80}}>
  <p className="eyebrow"><span/> 404</p>
  <h1>That page isn&apos;t here.</h1>
  <p className="hero-description">The link may be out of date, or the page may have moved. Everything about Averan is on the main page.</p>
  <div className="hero-actions"><Link className="button" href="/">Back to Averan <ArrowUpRight size={17}/></Link></div>
 </main>;
}
