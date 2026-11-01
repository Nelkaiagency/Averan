'use client';
import {useState} from 'react';
import {Phone,PhoneMissed,MessageSquare,RotateCcw,Check,Siren,Wrench,FileText} from 'lucide-react';

// Missed-call text-back: the visitor lets the phone ring out, then answers as the customer.
const replies=[{id:'urgent',label:'No power in half the house',queue:'Urgent call-outs',icon:Siren,note:'Flagged urgent. You get a phone alert straight away.'},{id:'small',label:'Need a few sockets added',queue:'Small jobs',icon:Wrench,note:'Added to small jobs. Offered the next free slot.'},{id:'quote',label:'Quote for an EV charger',queue:'Quotes',icon:FileText,note:'Sent the photo-upload link so you can quote from the office.'}] as const;
type Stage='ringing'|'missed'|'answered';

export function MissedCallDemo(){
 const [stage,setStage]=useState<Stage>('ringing'),[reply,setReply]=useState<string|null>(null);
 const chosen=replies.find(r=>r.id===reply);
 const reset=()=>{setStage('ringing');setReply(null)};
 return <div className="mc">
  <div className="mc-phone">
   {stage==='ringing'&&<div className="mc-ring"><span className="ring-icon"><Phone size={28}/></span><strong>Incoming call</strong><small>You’re up a ladder on another job.</small><button type="button" className="button" onClick={()=>setStage('missed')}><PhoneMissed size={16}/>Let it ring out</button></div>}
   {stage!=='ringing'&&<div className="thread">
    <div className="sys-note pop"><PhoneMissed size={13}/>Missed call</div>
    <div className="bubble in pop">Sorry we missed you, we’re on a job. What do you need help with?</div>
    {!reply?<><p className="mc-prompt">Answer as the customer:</p><div className="phone-actions">{replies.map(r=><button key={r.id} type="button" onClick={()=>{setReply(r.id);setStage('answered')}}><MessageSquare size={14}/>{r.label}</button>)}</div></>
    :<><div className="bubble out pop">{chosen!.label}</div><div className="bubble in pop">Thanks! {chosen!.note}</div></>}
   </div>}
  </div>
  <div className="mc-queues" aria-live="polite">{replies.map(r=>{const Icon=r.icon,here=reply===r.id;return <div key={r.id} className={`mc-queue${here?' active':''}`}><p><Icon size={15}/>{r.queue}</p>{here?<div className="lead-card mini pop"><strong>New caller</strong><span><Check size={12}/>Texted back automatically</span><span><Check size={12}/>Sorted into {r.queue.toLowerCase()}</span></div>:<span className="mc-empty">Empty</span>}</div>})}</div>
  <div className="demo-foot">{reply?<p className="demo-done"><Check size={16}/>A missed call became a sorted job, while you stayed on the ladder.</p>:<p>{stage==='ringing'?'The phone is ringing. Let it go to missed.':'Pick what the customer replies.'}</p>}<button type="button" className="demo-reset" onClick={reset}><RotateCcw size={15}/>Start again</button></div>
 </div>;
}
