import {NextResponse} from 'next/server';
import {z} from 'zod';

// Quick enquiry form: forwards to the Make/Zapier webhook that emails info@averan.eu.
// Without a webhook it returns 503 + fallback, and the form opens a pre-filled email instead.
const schema=z.object({
 name:z.string().trim().min(2).max(80),
 business:z.string().trim().max(120),
 email:z.email().max(254),
 phone:z.string().trim().max(30).refine(v=>!v||/^[+()\d\s.\-]{6,30}$/.test(v)),
 trade:z.enum(['Solar PV & batteries','Heat pumps','Insulation & retrofit','Electrical & EV chargers','Other energy installs']),
 message:z.string().trim().max(1500),
 consent:z.literal(true),
 website:z.string().max(0),
});
const PER_IP=5,IP_WINDOW=60*60*1000,DAILY=200;
// In-memory, so per server instance. Add hosting-level rate limits for /api/enquiry too.
const hits=new Map<string,{count:number;reset:number}>();
let day={count:0,reset:0};

export async function POST(request:Request){
 const origin=request.headers.get('origin'),expected=process.env.SITE_ORIGIN||`${request.headers.get('x-forwarded-proto')||'http'}://${request.headers.get('host')}`;
 if(origin&&origin!==expected)return NextResponse.json({error:'Request origin not allowed.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>6000)return NextResponse.json({error:'Request too large.'},{status:413});
 let body:unknown;try{body=await request.json()}catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
 const parsed=schema.safeParse(body);
 if(!parsed.success)return NextResponse.json({error:'Please check your details and tick the box.'},{status:400});

 const webhook=process.env.ENQUIRY_WEBHOOK_URL;
 if(!webhook?.startsWith('https://'))return NextResponse.json({fallback:true},{status:503});

 const now=Date.now(),ip=(request.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'unknown';
 if(now>day.reset)day={count:0,reset:now+24*60*60*1000};
 const h=hits.get(ip),entry=!h||now>h.reset?{count:0,reset:now+IP_WINDOW}:h;
 if(entry.count>=PER_IP||day.count>=DAILY)return NextResponse.json({error:'Too many enquiries right now. Please email us instead.'},{status:429});
 entry.count++;hits.set(ip,entry);day.count++;

 const {website,consent,...enquiry}=parsed.data;
 try{
  const res=await fetch(webhook,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',...(process.env.ENQUIRY_WEBHOOK_TOKEN?{'x-make-apikey':process.env.ENQUIRY_WEBHOOK_TOKEN,Authorization:`Bearer ${process.env.ENQUIRY_WEBHOOK_TOKEN}`}:{})},body:JSON.stringify({...enquiry,recipient:'info@averan.eu',source:'averan.eu enquiry form',receivedAt:new Date().toISOString()}),signal:AbortSignal.timeout(10000)});
  if(!res.ok)throw new Error('Webhook rejected');
  return NextResponse.json({success:true});
 }catch{return NextResponse.json({error:'Your enquiry could not be sent. Please email us instead.'},{status:502})}
}
