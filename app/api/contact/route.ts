import {NextResponse} from 'next/server';
import {contactSchema} from '@/lib/contact';
export async function POST(request:Request){
 const origin=request.headers.get('origin');const expectedOrigin=process.env.SITE_ORIGIN||`${request.headers.get('x-forwarded-proto')||'http'}://${request.headers.get('host')}`;if(origin&&origin!==expectedOrigin)return NextResponse.json({error:'Request origin not allowed.'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json'))return NextResponse.json({error:'JSON content is required.'},{status:415});
 const reader=request.body?.getReader();let text='';let bytes=0;const decoder=new TextDecoder();
 if(reader){while(true){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.byteLength;if(bytes>12000){await reader.cancel();return NextResponse.json({error:'Request too large.'},{status:413})}text+=decoder.decode(chunk.value,{stream:true})}text+=decoder.decode()}
 let body;try{body=JSON.parse(text)}catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
 const parsed=contactSchema.safeParse(body);if(!parsed.success)return NextResponse.json({error:'Please check the form details.'},{status:400});
 if(!process.env.CONTACT_WEBHOOK_URL||!process.env.TURNSTILE_SECRET_KEY||!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)return NextResponse.json({error:'Enquiry delivery is not connected yet. Nothing has been sent. Please return once contact delivery is available.'},{status:503});
 try{
 const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY,response:parsed.data.token||''}),signal:AbortSignal.timeout(10000)});
 const result=await verify.json();if(!result.success||result.hostname!==new URL(expectedOrigin).hostname)return NextResponse.json({error:'Please complete the spam protection check again.'},{status:400});
 const {website,token,...enquiry}=parsed.data;
 if(new URL(process.env.CONTACT_WEBHOOK_URL).protocol!=='https:')throw new Error('HTTPS endpoint required');
 const upstream=await fetch(process.env.CONTACT_WEBHOOK_URL,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',...(process.env.CONTACT_WEBHOOK_TOKEN?{Authorization:`Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}`}:{})},body:JSON.stringify({...enquiry,recipient:'info@averan.eu',source:'averan.eu'}),signal:AbortSignal.timeout(12000)});
 if(!upstream.ok)throw new Error('Delivery rejected');
 const receipt=await upstream.json();
 if(receipt.accepted!==true||typeof receipt.receiptId!=='string'||!receipt.receiptId.trim())throw new Error('No delivery or storage receipt');
 return NextResponse.json({success:true});
 }catch{return NextResponse.json({error:'Your enquiry could not be delivered. Please try again later.'},{status:502})}
}
