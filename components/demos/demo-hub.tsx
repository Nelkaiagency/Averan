'use client';
import {useState} from 'react';
import {Smartphone,PhoneMissed} from 'lucide-react';
import {HomeownerDemo} from './homeowner-demo';
import {MissedCallDemo} from './missed-call-demo';

const demos=[
 {id:'homeowner',label:'Be the customer',sub:'Send an enquiry and watch it get answered and booked',icon:Smartphone,el:<HomeownerDemo/>},
 {id:'missed',label:'Missed call',sub:'Turn a missed call into a sorted enquiry',icon:PhoneMissed,el:<MissedCallDemo/>},
] as const;

export function DemoHub(){
 const [active,setActive]=useState<string>('homeowner');
 const current=demos.find(d=>d.id===active)!;
 return <div className="demo-hub">
  <div className="demo-picker" role="tablist" aria-label="Choose a demo">{demos.map(({id,label,sub,icon:Icon})=><button key={id} type="button" role="tab" id={`demo-tab-${id}`} aria-selected={active===id} aria-controls="demo-panel" onClick={()=>setActive(id)}><span className="demo-picker-icon"><Icon size={18}/></span><span><strong>{label}</strong><small>{sub}</small></span></button>)}</div>
  <div id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${active}`} className="demo-panel" key={active}>{current.el}</div>
  <p className="demo-note">Example data and example scenarios. Nothing you type in these demos leaves your browser, and nothing here is a client result.</p>
 </div>;
}
