import {NextResponse} from 'next/server';
import {z} from 'zod';

// Live demo: forwards one visitor email to the Make/Zapier webhook that sends the demo reply.
// It can send email to any address, so it is guarded: consent, honeypot, origin check,
// per-IP and daily caps, and a fixed message controlled by the automation, never by the visitor.
const schema=z.object({
 email:z.email().max(254),
 trade:z.enum(['solar','heat','retrofit','electric']),
 consent:z.literal(true),
 website:z.string().max(0),
});
const PER_IP=3,IP_WINDOW=60*60*1000,DAILY=100;
// In-memory, so limits are per server instance. Add hosting-level rate limits for /api/live-demo too.
const hits=new Map<string,{count:number;reset:number}>();
let day={count:0,reset:0};

export async function POST(request:Request){
 const webhook=process.env.LIVE_DEMO_WEBHOOK_URL;
 if(!webhook?.startsWith('https://'))return NextResponse.json({error:'The live demo is not switched on yet.'},{status:503});
 const origin=request.headers.get('origin'),expected=process.env.SITE_ORIGIN||`${request.headers.get('x-forwarded-proto')||'http'}://${request.headers.get('host')}`;
 if(origin&&origin!==expected)return NextResponse.json({error:'Request origin not allowed.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>2000)return NextResponse.json({error:'Request too large.'},{status:413});
 let body:unknown;try{body=await request.json()}catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
 const parsed=schema.safeParse(body);
 if(!parsed.success)return NextResponse.json({error:'Please enter a valid email and tick the box.'},{status:400});

 const now=Date.now(),ip=(request.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'unknown';
 if(now>day.reset)day={count:0,reset:now+24*60*60*1000};
 const h=hits.get(ip);const entry=!h||now>h.reset?{count:0,reset:now+IP_WINDOW}:h;
 if(entry.count>=PER_IP||day.count>=DAILY)return NextResponse.json({error:'The live demo is busy. Please try again later.'},{status:429});
 entry.count++;hits.set(ip,entry);day.count++;

 try{
  const res=await fetch(webhook,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',...(process.env.LIVE_DEMO_WEBHOOK_TOKEN?{'x-make-apikey':process.env.LIVE_DEMO_WEBHOOK_TOKEN,Authorization:`Bearer ${process.env.LIVE_DEMO_WEBHOOK_TOKEN}`}:{})},body:JSON.stringify({email:parsed.data.email,trade:parsed.data.trade,source:'averan.eu live demo',consentedAt:new Date().toISOString()}),signal:AbortSignal.timeout(10000)});
  if(!res.ok)throw new Error('Webhook rejected');
  return NextResponse.json({success:true});
 }catch{return NextResponse.json({error:'The demo message could not be sent. Please try again later.'},{status:502})}
}
