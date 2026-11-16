import {NextResponse} from 'next/server';
import {contactSchema} from '@/lib/contact';

// Delivery is configured through the environment. Email is the route the
// business relies on; a webhook can run alongside it to push enquiries into a
// CRM or sheet without changing this file. While neither exists the form
// refuses to send, so an enquiry is never accepted and quietly dropped.
const emailConfigured=()=>!!(process.env.RESEND_API_KEY&&process.env.CONTACT_EMAIL_FROM);
const webhookConfigured=()=>!!process.env.CONTACT_WEBHOOK_URL;
// Spam protection is enforced only once both Turnstile keys exist, so the site
// can go live before a Cloudflare account does. The honeypot field and the
// request limits below apply either way.
const turnstileConfigured=()=>!!(process.env.TURNSTILE_SECRET_KEY&&process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
const recipient=()=>process.env.CONTACT_EMAIL_TO||'info@averan.eu';

const escapeHtml=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c] as string);

type Enquiry=Record<string,unknown>;

function emailContent(enquiry:Enquiry){
 const rows:[string,string][]=[['Name',String(enquiry.name||'')],['Company',String(enquiry.company||'—')],['Email',String(enquiry.email||'')],['Phone',String(enquiry.phone||'—')],['Message',String(enquiry.message||'—')]];
 return {
  text:rows.map(([label,value])=>`${label}: ${value}`).join('\n'),
  html:`<table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">${rows.map(([label,value])=>`<tr><td style="padding:6px 14px 6px 0;color:#6b7280;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('')}</table>`,
 };
}

async function sendEmail(enquiry:Enquiry){
 const {text,html}=emailContent(enquiry);
 const response=await fetch('https://api.resend.com/emails',{
  method:'POST',
  headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.RESEND_API_KEY}`},
  // Replying to the notification replies to the enquirer.
  body:JSON.stringify({from:process.env.CONTACT_EMAIL_FROM,to:[recipient()],reply_to:String(enquiry.email||''),subject:`Website enquiry — ${String(enquiry.name||'Unknown')}${enquiry.company?` (${String(enquiry.company)})`:''}`,text,html}),
  signal:AbortSignal.timeout(12000),
 });
 if(!response.ok)throw new Error('Email delivery rejected');
}

async function sendWebhook(enquiry:Enquiry,expectedOrigin:string){
 const url=process.env.CONTACT_WEBHOOK_URL as string;
 if(new URL(url).protocol!=='https:')throw new Error('HTTPS endpoint required');
 const upstream=await fetch(url,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',...(process.env.CONTACT_WEBHOOK_TOKEN?{Authorization:`Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}`}:{})},body:JSON.stringify({...enquiry,recipient:recipient(),source:new URL(expectedOrigin).hostname}),signal:AbortSignal.timeout(12000)});
 if(!upstream.ok)throw new Error('Delivery rejected');
 const receipt=await upstream.json();
 if(receipt.accepted!==true||typeof receipt.receiptId!=='string'||!receipt.receiptId.trim())throw new Error('No delivery or storage receipt');
}

export async function POST(request:Request){
 const origin=request.headers.get('origin');const expectedOrigin=process.env.SITE_ORIGIN||`${request.headers.get('x-forwarded-proto')||'http'}://${request.headers.get('host')}`;if(origin&&origin!==expectedOrigin)return NextResponse.json({error:'Request origin not allowed.'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json'))return NextResponse.json({error:'JSON content is required.'},{status:415});
 const reader=request.body?.getReader();let text='';let bytes=0;const decoder=new TextDecoder();
 if(reader){while(true){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.byteLength;if(bytes>12000){await reader.cancel();return NextResponse.json({error:'Request too large.'},{status:413})}text+=decoder.decode(chunk.value,{stream:true})}text+=decoder.decode()}
 let body;try{body=JSON.parse(text)}catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
 const parsed=contactSchema.safeParse(body);if(!parsed.success)return NextResponse.json({error:'Please check the form details.'},{status:400});
 if(!emailConfigured()&&!webhookConfigured())return NextResponse.json({error:'Enquiry delivery is not connected yet. Nothing has been sent. Please return once contact delivery is available.'},{status:503});
 try{
 if(turnstileConfigured()){
  const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY as string,response:parsed.data.token||''}),signal:AbortSignal.timeout(10000)});
  const result=await verify.json();if(!result.success||result.hostname!==new URL(expectedOrigin).hostname)return NextResponse.json({error:'Please complete the spam protection check again.'},{status:400});
 }
 const {website,token,...enquiry}=parsed.data;void website;void token;
 // Email failing fails the request. A webhook is an extra destination: once
 // the enquiry is in the inbox it is not lost, and a CRM hiccup should not
 // tell the sender to try again.
 if(emailConfigured()){
  await sendEmail(enquiry);
  if(webhookConfigured())await sendWebhook(enquiry,expectedOrigin).catch(()=>undefined);
 }else{
  await sendWebhook(enquiry,expectedOrigin);
 }
 return NextResponse.json({success:true});
 }catch{return NextResponse.json({error:'Your enquiry could not be delivered. Please try again later.'},{status:502})}
}
