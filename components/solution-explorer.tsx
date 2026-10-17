'use client';
import {useEffect,useRef,useState} from 'react';
import {motion,useInView,useReducedMotion} from 'motion/react';
import {ArrowRight,ArrowUpRight,Building2,Check,ChevronDown,Cog,HardHat,Play,Pause,RotateCcw,Truck,Sparkles,Car,BriefcaseBusiness,Shapes,UserRound,Workflow} from 'lucide-react';
import {industries,type Solution} from '@/lib/solutions';
import {ContactForm} from './contact-form';
const icons=[HardHat,Cog,Truck,Sparkles,Building2,Car,BriefcaseBusiness,Shapes];
export default function SolutionExplorer({deliveryReady}:{deliveryReady:boolean}){
 const [selected,setSelected]=useState<string|null>(null),[example,setExample]=useState<string|null>(null);
 return <section id="how-it-works" className="section container solution-explorer">
  <div className="section-heading"><div><p className="eyebrow">SEE HOW IT WORKS</p><h2>See how enquiries become organised next steps.</h2></div><p>Click your industry to open practical examples right below it. No contact details needed.</p></div>
  <p><a className="text-link" href="#contact">Ready to discuss your business? Request a Call <ArrowUpRight size={15}/></a></p>
  <div id="industries" className="industry-picker"><h3>Choose your industry</h3><p>Open an industry to see the process and potential benefit.</p><div className="industry-accordions">{industries.map((industry,n)=>{
   const Icon=icons[n],open=selected===industry.id,solution=industry.solutions.find(s=>s.id===example)??industry.solutions[0];
   return <div className="industry-accordion" key={industry.id}>
    <button id={industry.id+'-toggle'} type="button" className="industry-toggle" aria-expanded={open} aria-controls={industry.id+'-panel'} onClick={()=>{setSelected(open?null:industry.id);setExample(industry.solutions[0].id)}}><Icon size={22}/><span><strong>{industry.name}</strong><small>{industry.summary}</small></span><ChevronDown size={20}/></button>
    <div id={industry.id+'-panel'} role="region" aria-labelledby={industry.id+'-toggle'} hidden={!open}>{open&&<div className="industry-dropdown">
     <p className="dropdown-caption">Illustrative examples · Not live client systems</p>
     <label className="mobile-example-picker">Choose an example<select value={solution.id} onChange={event=>setExample(event.target.value)}>{industry.solutions.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
     <div className="example-switcher" aria-label="Choose an example">{industry.solutions.map(s=><button type="button" key={s.id} aria-pressed={solution.id===s.id} onClick={()=>setExample(s.id)}>{s.title}</button>)}</div>
     <div className="example-summary" aria-live="polite"><h4>{solution.title}</h4><p>{solution.problem}</p><p className="quick-workflow">{solution.steps.map(step=>step.label).join(' → ')}</p><p><strong>Potential benefit:</strong> {solution.benefit}</p></div>
     <div className="dropdown-actions"><a href="#contact" className="button">Request a Call <ArrowUpRight size={15}/></a><span>What is practical depends on your processes, data and tools.</span></div>
     <details className="workflow-details" key={solution.id}><summary>Explore this workflow step by step</summary><SolutionDemo solution={solution} industry={industry.name} deliveryReady={deliveryReady}/></details>
    </div>}</div>
   </div>
  })}</div></div>
 </section>
}
function SolutionDemo({solution,industry,deliveryReady}:{solution:Solution;industry:string;deliveryReady:boolean}){
 const [step,setStep]=useState(0),[running,setRunning]=useState(false),[started,setStarted]=useState(false),[complete,setComplete]=useState(false),[requestOpen,setRequestOpen]=useState(false),[pageVisible,setPageVisible]=useState(true);
 const root=useRef<HTMLDivElement>(null),formHeading=useRef<HTMLHeadingElement>(null),inView=useInView(root,{amount:'some'}),reduced=useReducedMotion();
 const current=solution.steps[step];
 useEffect(()=>{const update=()=>setPageVisible(!document.hidden);update();document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update)},[]);
 useEffect(()=>{if(!running||!inView||!pageVisible)return;const timer=setTimeout(()=>{if(step===solution.steps.length-1){setRunning(false);setComplete(true)}else setStep(s=>s+1)},2600);return()=>clearTimeout(timer)},[running,step,inView,pageVisible,solution]);
 useEffect(()=>{if(requestOpen)formHeading.current?.focus()},[requestOpen]);
 function reset(){setStep(0);setStarted(false);setRunning(false);setComplete(false)}
 function run(){if(complete){setStep(0);setComplete(false)}setStarted(true);setRunning(!running)}
 return <div ref={root} className="solution-demo">
  <div className="demo-topline"><span><Workflow size={16}/>WORKFLOW EXAMPLE</span><span>Illustrative only · Not a live client system</span></div>
  <div className="demo-intro"><div><p className="eyebrow">{industry}</p><h3>{solution.title}</h3><p>{solution.problem}</p></div><div className="demo-controls"><button className="button" onClick={run}>{running?<Pause size={16}/>:<Play size={16}/>} {running?'Pause':complete?'Replay':started?'Resume':'Run Example'}</button><button className="demo-reset" onClick={reset} aria-label="Reset example"><RotateCcw size={16}/>Reset</button></div></div>
  <div className="potential-benefit"><span className="kicker">POTENTIAL BENEFIT</span><p>{solution.benefit}</p><small>What is practical depends on your processes, data and existing tools.</small></div>
  <p className="demo-instruction">Run the example or select any step. <UserRound size={14}/> marks a human review or decision. The demonstration illustrates those decisions; it does not make them.</p>
  <div className={`explorer-workflow ${running&&!reduced?'is-running':''}`}>{solution.steps.map((item,i)=><button key={item.label} type="button" className={`explorer-step ${i===step?'active':''} ${i<step||complete?'finished':''}`} aria-pressed={i===step} aria-label={`Step ${i+1}: ${item.label}`} onClick={()=>{setStep(i);setRunning(false);setStarted(false);setComplete(false)}}><span className="explorer-step-number">{i<step||complete?<Check size={15}/>:i+1}</span><span>{item.label}<small>{item.kind==='human'?'Human review':item.kind==='trigger'?'Trigger':'System action'}</small></span>{item.kind==='human'&&<UserRound size={16}/>}<span className="workflow-wire" aria-hidden="true"/></button>)}</div>
  <div className="active-step-detail" aria-live="polite" aria-atomic="true"><div><span className="kicker">{complete?'EXAMPLE COMPLETE':`STEP ${step+1} OF ${solution.steps.length}`}</span><h4>{current.label}</h4><p>{current.detail}</p></div><span className={`action-badge ${current.kind}`}>{current.kind==='human'?<UserRound size={16}/>:<Workflow size={16}/>} {current.kind==='human'?'A person checks and decides':current.kind==='trigger'?'The process starts here':'The system handles this step'}</span></div>
  <div className="demo-progress" aria-hidden="true"><motion.div initial={false} animate={{width:`${complete?100:step/(solution.steps.length-1)*100}%`}} transition={{duration:reduced?0:.35}}/></div>
  <div className="demo-bottom"><span>{complete?'All steps explored.':running?'Walking through the example…':started?'Paused. Continue whenever you’re ready.':'Move at your own pace.'}</span><button onClick={()=>{setRunning(false);setStarted(false);if(step===solution.steps.length-1)setComplete(true);else setStep(step+1)}} disabled={complete}>Next step<ArrowRight size={15}/></button></div>
  <div className="personalised-request"><div><p className="eyebrow">YOUR BUSINESS, YOUR PROCESS</p><h3>Could This Work for Your Business?</h3><p>Every business operates differently. Tell us a little about your processes and we&apos;ll explore what a practical solution could look like.</p></div><button className="button" aria-expanded={requestOpen} aria-controls="personalised-call-form" onClick={()=>{setRunning(false);setRequestOpen(!requestOpen)}}>{requestOpen?'Close form':'Request a Call'}<ArrowUpRight size={17}/></button></div>
  {requestOpen&&<div className="explorer-call-form" id="personalised-call-form"><h3 ref={formHeading} tabIndex={-1}>Request a Call</h3><p>Your industry and example are filled in below. If you leave your phone number blank, we’ll arrange the call by email.</p><ContactForm deliveryReady={deliveryReady} initialIndustry={industry} initialSolution={solution.title}/></div>}
 </div>
}
