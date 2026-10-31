import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
const require=createRequire(import.meta.url);
const data=source=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const solutions=data(await fs.readFile(new URL('../lib/solutions.ts',import.meta.url),'utf8'));
const schema=data((await fs.readFile(new URL('../lib/contact.ts',import.meta.url),'utf8')).replace("'zod'",JSON.stringify(pathToFileURL(require.resolve('zod')).href)).replace("'./solutions'",JSON.stringify(solutions)));
const source=(await fs.readFile(new URL('../app/api/contact/route.ts',import.meta.url),'utf8')).replace("'@/lib/contact'",JSON.stringify(schema)).replace("'next/server'",JSON.stringify(pathToFileURL(require.resolve('next/server')).href));
const {POST}=await import(data(source));
const originalFetch=globalThis.fetch;
const keys=['SITE_ORIGIN','CONTACT_WEBHOOK_URL','CONTACT_WEBHOOK_TOKEN','TURNSTILE_SECRET_KEY','NEXT_PUBLIC_TURNSTILE_SITE_KEY','RESEND_API_KEY','CONTACT_EMAIL_FROM','CONTACT_EMAIL_TO'];
const saved=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
const payload={name:'Preview Tester',company:'Example Company',email:'preview@example.com',industry:'Automotive Dealerships',solution:'After-Hours Lead Response',consent:true,phone:'+353 123 4567',message:'Please review this illustrative operational process.',website:'',token:'test-token'};
let checks=0;
const request=(body=payload,origin='https://averan.eu',contentType='application/json')=>new Request('https://averan.eu/api/contact',{method:'POST',headers:{Origin:origin,Host:'averan.eu','Content-Type':contentType},body:typeof body==='string'?body:JSON.stringify(body)});
async function check(label,req,expected){const res=await POST(req);assert.equal(res.status,expected,label);checks++;console.log(`PASS ${label}: ${expected}`);return res}
try{
 process.env.SITE_ORIGIN='https://averan.eu';delete process.env.CONTACT_WEBHOOK_URL;
 await check('unconfigured delivery',request(),503);
 await check('invalid fields',request({}),400);
 await check('missing consent',request({...payload,consent:false}),400);
 await check('mismatched example',request({...payload,solution:'Client Onboarding Checklist'}),400);
 await check('invalid industry',request({...payload,industry:'Invented Industry'}),400);
 await check('invalid optional phone',request({...payload,phone:'not-a-phone'}),400);
 await check('honeypot',request({...payload,website:'spam'}),400);
 await check('origin rejection',request(payload,'https://other.example'),403);
 await check('content type',request(payload,'https://averan.eu','text/plain'),415);
 await check('malformed JSON',request('{'),400);
 await check('body limit',request('x'.repeat(12001)),413);
 process.env.CONTACT_WEBHOOK_URL='https://delivery.example/enquiries';process.env.TURNSTILE_SECRET_KEY='test-secret';process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY='test-public-key';
 let verify={success:true,hostname:'averan.eu'},receipt={accepted:true,receiptId:'mock-durable-id'},upstreamStatus=200,captured;
 globalThis.fetch=async(url,options)=>{if(String(url).includes('siteverify'))return Response.json(verify);captured=JSON.parse(options.body);return Response.json(receipt,{status:upstreamStatus})};
 await check('mocked durable acceptance',request(),200);assert.equal(captured.recipient,'info@averan.eu');assert.equal(captured.phone,payload.phone);assert.equal(captured.solution,payload.solution);assert.equal(captured.industry,payload.industry);assert.equal(captured.consent,true);assert.equal(captured.token,undefined);
 await check('minimal direct request',request({name:'Test User',email:'preview@example.com',consent:true,website:'',token:'test-token'}),200);assert.equal(captured.industry,'');assert.equal(captured.message,'');
 await check('blank optional context',request({...payload,company:'',industry:'',solution:'',message:''}),200);
 await check('short optional challenge',request({...payload,message:'Quotes'}),200);
 await check('solution without industry',request({...payload,industry:''}),400);
 receipt={};await check('200 without receipt rejected',request(),502);
 upstreamStatus=500;await check('upstream failure',request(),502);
 verify={success:false,hostname:'averan.eu'};await check('failed spam verification',request(),400);
 verify={success:true,hostname:'other.example'};await check('wrong verification hostname',request(),400);
 globalThis.fetch=async()=>{throw new Error('simulated timeout')};await check('network failure',request(),502);

 // --- email delivery -------------------------------------------------
 delete process.env.CONTACT_WEBHOOK_URL;delete process.env.TURNSTILE_SECRET_KEY;delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
 process.env.RESEND_API_KEY='test-resend-key';process.env.CONTACT_EMAIL_FROM='Averan Website <website@averan.eu>';process.env.CONTACT_EMAIL_TO='info@averan.eu';
 let emailStatus=200,emailBody,emailAuth;
 globalThis.fetch=async(url,options)=>{if(String(url).includes('api.resend.com')){emailBody=JSON.parse(options.body);emailAuth=options.headers.Authorization;return Response.json({id:'mock'},{status:emailStatus})}throw new Error('unexpected call: '+url)};
 await check('email delivery without a webhook',request(),200);
 assert.equal(emailAuth,'Bearer test-resend-key');
 assert.deepEqual(emailBody.to,['info@averan.eu']);
 assert.equal(emailBody.reply_to,payload.email,'reply goes back to the enquirer');
 assert.ok(emailBody.text.includes(payload.message),'message reaches the inbox');
 assert.ok(emailBody.subject.includes(payload.name));
 assert.ok(!emailBody.html.includes('<script'),'enquiry text is escaped');
 await check('script tags in a message are escaped',request({...payload,message:'<script>alert(1)</script>'}),200);
 assert.ok(!emailBody.html.includes('<script>'),'no raw script tag survives into the email');
 emailStatus=500;await check('email rejected',request(),502);emailStatus=200;

 // Turnstile is skipped while unconfigured, so a missing token still sends.
 await check('no spam keys configured',request({...payload,token:''}),200);

 // --- email plus webhook ---------------------------------------------
 process.env.CONTACT_WEBHOOK_URL='https://delivery.example/enquiries';
 let webhookOk=true,webhookCalled=false;
 globalThis.fetch=async(url,options)=>{if(String(url).includes('api.resend.com')){emailBody=JSON.parse(options.body);return Response.json({id:'mock'})}webhookCalled=true;if(!webhookOk)throw new Error('crm down');return Response.json({accepted:true,receiptId:'mock-durable-id'})};
 await check('email and webhook together',request(),200);assert.equal(webhookCalled,true);
 webhookOk=false;await check('webhook failure does not fail the enquiry',request(),200);
 webhookOk=true;

 // --- nothing configured ----------------------------------------------
 delete process.env.RESEND_API_KEY;delete process.env.CONTACT_EMAIL_FROM;delete process.env.CONTACT_WEBHOOK_URL;
 await check('no delivery configured',request(),503);

 console.log(`${checks} handler checks passed. External delivery and Turnstile calls were mocked; no data was sent.`);
}finally{globalThis.fetch=originalFetch;for(const key of keys){if(saved[key]===undefined)delete process.env[key];else process.env[key]=saved[key]}}
