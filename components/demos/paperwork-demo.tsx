'use client';
import {useState,type DragEvent} from 'react';
import {Check,FileText,Lock,Unlock,Bell,RotateCcw,CalendarCheck,Upload} from 'lucide-react';

// Paperwork gate: the install date stays locked until every document is in.
// Drag documents onto the job, or click them (keyboard and touch friendly).
const required=['Customer ID','Electricity bill','Signed quote','Grant application','Grid connection form'];

export function PaperworkDemo(){
 const [have,setHave]=useState<string[]>([]),[over,setOver]=useState(false),[reminder,setReminder]=useState(false),[booked,setBooked]=useState(false);
 const missing=required.filter(d=>!have.includes(d)),done=!missing.length;
 const add=(d:string)=>{if(!have.includes(d)){setHave(h=>[...h,d]);setReminder(false)}};
 const drop=(e:DragEvent)=>{e.preventDefault();setOver(false);add(e.dataTransfer.getData('text/plain'))};
 const reset=()=>{setHave([]);setReminder(false);setBooked(false)};
 return <div className="pw">
  <div className="pw-docs"><p className="hd-label"><Upload size={15}/>Documents from the customer</p><p className="pw-hint">Drag each one onto the job, or tap it.</p>
   <div className="pw-chips">{required.map(d=>have.includes(d)?null:<button key={d} type="button" draggable onDragStart={e=>e.dataTransfer.setData('text/plain',d)} onClick={()=>add(d)} className="pw-chip"><FileText size={15}/>{d}</button>)}{done&&<span className="pw-all">All documents received</span>}</div>
  </div>
  <div className={`pw-job${over?' over':''}${done?' complete':''}`} onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)} onDrop={drop} aria-live="polite">
   <div className="lead-top"><strong>Solar install · Murphy</strong><span className={`lead-status ${done?'ok':''}`}>{done?'Paperwork complete':'Waiting on documents'}</span></div>
   <div className="pw-progress"><span style={{width:`${have.length/required.length*100}%`}}/></div>
   <ul className="lead-checks">{required.map(d=><li key={d} className={have.includes(d)?'ok pop':''}>{have.includes(d)?<Check size={13}/>:<span className="dot"/>}{d}</li>)}</ul>
   <div className="pw-actions">
    {!done&&<button type="button" className="button outline" onClick={()=>setReminder(true)}><Bell size={15}/>Remind customer</button>}
    <button type="button" className="button" disabled={!done||booked} onClick={()=>setBooked(true)}>{booked?<><CalendarCheck size={15}/>Install booked</>:done?<><Unlock size={15}/>Book install date</>:<><Lock size={15}/>Book install date</>}</button>
   </div>
   {reminder&&!done&&<div className="pw-reminder pop"><p className="kicker">REMINDER THE CUSTOMER GETS</p><p>Hi Mary, we’re nearly ready to book your install. We just need: <strong>{missing.join(', ')}</strong>. You can upload them here in a minute.</p></div>}
   {booked&&<p className="demo-done pop"><Check size={16}/>Crew booked, with every form already in. No wasted trips.</p>}
  </div>
  <div className="demo-foot"><p>{done?'Every form is in, so the install date unlocks.':'The install date stays locked until the paperwork is complete.'}</p><button type="button" className="demo-reset" onClick={reset}><RotateCcw size={15}/>Start again</button></div>
 </div>;
}
