'use client';
import {useState,type FormEvent} from 'react';
import {Check,FileImage,FileText,Inbox,MapPin,RotateCcw,Send,CalendarCheck,Smartphone,LayoutDashboard,Zap} from 'lucide-react';

// The visitor plays the homeowner on the phone; the installer's office reacts on the right.
// Nothing moves until the visitor acts. All data is example data and never leaves the browser.
type TradeId='solar'|'heat'|'retrofit'|'electric';
const trades:Record<TradeId,{label:string;job:string;docs:[string,string];ask:string;surveyor:string}>={
 solar:{label:'Solar PV',job:'Solar panels',docs:['Roof photos','Electricity bill'],ask:'To size your system, could you send a few photos of your roof and a recent electricity bill?',surveyor:'solar surveyor'},
 heat:{label:'Heat pumps',job:'Heat pump',docs:['Boiler photo','BER cert'],ask:'To check your home is ready, could you send a photo of your current boiler and your BER cert if you have one?',surveyor:'heat pump surveyor'},
 retrofit:{label:'Retrofit',job:'Attic & wall insulation',docs:['Attic photos','Recent bill'],ask:'To plan the works, could you send a few photos of your attic and a recent energy bill?',surveyor:'retrofit surveyor'},
 electric:{label:'EV & electrical',job:'EV charger',docs:['Fuse board photo','Parking spot photo'],ask:'To quote without a site visit, could you send a photo of your fuse board and where you park?',surveyor:'electrician'},
};
const counties=['Cork','Kerry','Limerick','Waterford','Clare','Tipperary'];
const slots=['Tuesday morning','Wednesday afternoon','Thursday morning'];
type Log={text:string;kind:'auto'|'customer'};

export function HomeownerDemo(){
 const [trade,setTrade]=useState<TradeId>('solar');
 const [name,setName]=useState(''),[county,setCounty]=useState('Cork');
 const [sent,setSent]=useState(false),[docs,setDocs]=useState<string[]>([]),[slot,setSlot]=useState<string|null>(null);
 const [log,setLog]=useState<Log[]>([]),[flash,setFlash]=useState(0);
 const t=trades[trade],who=name.trim()||'Sarah',docsDone=docs.length===2;
 const status=slot?'Survey booked':docsDone?'Ready to book':sent?'Waiting for details':'';
 const push=(entries:Log[])=>{setLog(l=>[...entries,...l]);setFlash(f=>f+1)};
 function reset(next:TradeId=trade){setTrade(next);setName('');setCounty('Cork');setSent(false);setDocs([]);setSlot(null);setLog([])}
 function send(e:FormEvent){e.preventDefault();setSent(true);push([{text:`Instant reply sent to ${who}`,kind:'auto'},{text:`Lead assigned to the ${county} ${t.surveyor}`,kind:'auto'},{text:`New ${t.job.toLowerCase()} enquiry from ${who}`,kind:'customer'}])}
 function upload(d:string){if(docs.includes(d))return;const next=[...docs,d];setDocs(next);push(next.length===2?[{text:'All details in. Survey times offered',kind:'auto'},{text:`${d} received`,kind:'customer'}]:[{text:`${d} received and filed`,kind:'customer'}])}
 function book(s:string){setSlot(s);push([{text:`Reminder scheduled for the day before`,kind:'auto'},{text:`Added to the ${t.surveyor}’s calendar`,kind:'auto'},{text:`${who} booked ${s}`,kind:'customer'}])}
 return <div className="hd">
  <div className="demo-tabs" role="tablist" aria-label="Choose your trade">{(Object.keys(trades) as TradeId[]).map(id=><button key={id} type="button" role="tab" aria-selected={trade===id} onClick={()=>reset(id)}>{trades[id].label}</button>)}</div>
  <div className="hd-grid">
   <div className="hd-side"><p className="hd-label"><Smartphone size={15}/>You, the homeowner</p>
    <div className="phone" aria-live="polite"><div className="phone-notch"/><div className="phone-screen">
     {!sent?<form className="phone-form" onSubmit={send}>
      <p className="phone-title">Get a free quote</p>
      <label>Your first name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Sarah" maxLength={30} autoComplete="off"/></label>
      <label>County<select value={county} onChange={e=>setCounty(e.target.value)}>{counties.map(c=><option key={c}>{c}</option>)}</select></label>
      <label>Interested in<input value={t.job} readOnly/></label>
      <button type="submit" className="button"><Send size={15}/>Send enquiry</button>
      <small>Example only. Nothing you type is sent anywhere.</small>
     </form>:<div className="thread">
      <div className="bubble out">Hi, I’d like a quote for {t.job.toLowerCase()} in {county}.</div>
      <div className="bubble in pop">Thanks {who}! {t.ask}</div>
      {!docsDone&&<div className="phone-actions">{t.docs.map((d,i)=><button key={d} type="button" className={docs.includes(d)?'done':''} disabled={docs.includes(d)} onClick={()=>upload(d)}>{docs.includes(d)?<Check size={14}/>:i===0?<FileImage size={14}/>:<FileText size={14}/>}{docs.includes(d)?`${d} sent`:`Send ${d.toLowerCase()}`}</button>)}</div>}
      {docs.map(d=><div key={d} className="bubble out pop attach"><FileImage size={14}/>{d}</div>)}
      {docsDone&&!slot&&<><div className="bubble in pop">Perfect, thank you. Pick a time for your free survey:</div><div className="phone-actions">{slots.map(s=><button key={s} type="button" onClick={()=>book(s)}><CalendarCheck size={14}/>{s}</button>)}</div></>}
      {slot&&<div className="bubble in pop">You’re booked in for {slot}. We’ll send a reminder the day before.</div>}
     </div>}
    </div></div>
   </div>
   <div className="hd-side"><p className="hd-label"><LayoutDashboard size={15}/>Your office, at the same moment</p>
    <div className="office">
     <div className="office-head"><Inbox size={16}/>Enquiries<span className="office-badge">{sent?1:0}</span></div>
     {!sent?<p className="office-empty">Waiting for enquiries. Send one from the phone.</p>:<div className="lead-card pop" key={trade}>
      <div className="lead-top"><strong>{who}</strong><span className={`lead-status ${slot?'ok':docsDone?'ready':''}`}>{status}</span></div>
      <p className="lead-meta"><MapPin size={13}/>{county} · {t.job} · Website</p>
      <ul className="lead-checks"><li className="ok"><Check size={13}/>Instant reply sent</li>{t.docs.map(d=><li key={d} className={docs.includes(d)?'ok':''}>{docs.includes(d)?<Check size={13}/>:<span className="dot"/>}{d}</li>)}<li className={slot?'ok':''}>{slot?<Check size={13}/>:<span className="dot"/>}Survey {slot?`booked: ${slot}`:'not booked yet'}</li></ul>
     </div>}
     <div className="office-cal"><p>{t.surveyor[0].toUpperCase()+t.surveyor.slice(1)}’s week</p><div>{slots.map(s=><span key={s} className={slot===s?'booked pop':''}>{s.replace(' morning',' AM').replace(' afternoon',' PM')}{slot===s&&<b>{who}</b>}</span>)}</div></div>
     <div className="office-log" key={flash}><p><Zap size={13}/>What ran automatically</p>{log.length?<ul>{log.slice(0,5).map((l,i)=><li key={log.length-i} className={`${l.kind}${i===0?' pop':''}`}>{l.text}</li>)}</ul>:<span>Nothing yet.</span>}</div>
    </div>
   </div>
  </div>
  <div className="demo-foot">{slot?<p className="demo-done"><Check size={16}/>That’s the whole first stage: enquiry, details and survey booked, without anyone in the office lifting a finger.</p>:<p>{!sent?'Step one: send the enquiry from the phone.':!docsDone?'Now send the details the installer asked for.':'Now pick a survey time.'}</p>}<button type="button" className="demo-reset" onClick={()=>reset()}><RotateCcw size={15}/>Start again</button></div>
 </div>;
}
