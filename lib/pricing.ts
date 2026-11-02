// DRAFT packages and prices. Confirm every figure and promise before going live.
export type Plan={id:string;name:string;tagline:string;price:string;priceNote:string;cta:string;recommended?:boolean;includes:string[]};
export const plans:Plan[]=[
 {id:'review',name:'Free Review',tagline:'Find out what is worth fixing first.',price:'€0',priceNote:'No obligation',cta:'Book a free call',includes:['Introductory call on Google Meet','We map one install job with you, from enquiry to invoice','A short written summary of the quick wins','Honest advice, even if the answer is “you don’t need us”']},
 {id:'starter',name:'Starter Workflow',tagline:'One task that eats your week, automated.',price:'from €750',priceNote:'One-off project',cta:'Start with one workflow',includes:['One workflow set up end to end, for example enquiry → instant reply → survey booked → follow-up reminder','Built on the tools you already use where possible','Walkthrough for you and your team','30 days of fixes after go-live']},
 {id:'connected',name:'Connected Workflow',tagline:'Every job joined up, from enquiry to invoice.',price:'from €2,500',priceNote:'One-off project',cta:'Plan my workflow',recommended:true,includes:['Everything in Starter Workflow','Enquiry → survey → quote → install → invoice as one process','A simple dashboard showing every job’s stage','Team training and a written how-to guide','60 days of fixes after go-live']},
 {id:'care',name:'Care Plan',tagline:'Keep it running while the business changes.',price:'€149',priceNote:'per month, cancel with 30 days’ notice',cta:'Ask about the Care Plan',includes:['We monitor your automations and fix what breaks','Up to 2 hours of small changes each month','Monthly check-in call','Priority email support']},
];
export const custom={name:'Custom',tagline:'Several crews or depots, an installer website, or a bigger system.',includes:['Scoped to your business','Fixed quote before any work starts','Phased delivery, so you see results early']};
export type Cell=boolean|string;
export const comparison:{group:string;rows:[string,Cell,Cell,Cell][]}[]=[
 {group:'What we do',rows:[['Process mapping','One process','For the project','Whole workflow'],['Workflows automated','—','1','Enquiry to invoice'],['Dashboard','—','—',true],['Team training','—','Walkthrough','Training + guide']]},
 {group:'After go-live',rows:[['Fixes included','—','30 days','60 days'],['Ongoing support','—','Add Care Plan','Add Care Plan']]},
 {group:'Always included',rows:[['Fixed price agreed before work starts',true,true,true],['You approve every change before it goes live',true,true,true],['You own your accounts, data and setup',true,true,true]]},
];
export const fineprint=['Prices are starting points for a typical small business. You get a fixed quote before any work begins.','Software subscriptions (for example your CRM or accounting tool) are paid by you directly, at their price. We never add a markup.','Prices exclude VAT where applicable.'];
export const pricingFaqs=[
 ['Why “from” prices?','Every business runs differently. After the free review we send a fixed quote, so you know the full cost before saying yes.'],
 ['Do I have to buy new software?','Usually not. We start with what you already use and only suggest something new when it clearly saves time or money.'],
 ['Who owns the systems you build?','You do. Accounts are set up in your business’s name, and we hand over logins and documentation.'],
 ['What if something breaks after the fix period?','Get in touch. Care Plan clients are covered; otherwise we quote for the fix before doing any work.'],
 ['Can I cancel the Care Plan?','Yes, with 30 days’ notice. There is no long-term contract.'],
 ['Do you work outside Cork?','Yes. We are based in Cork and work with businesses across Ireland, on Google Meet or in person.'],
] as const;
// Tools shown in the "Integrates with your software" banner. List only ones you have used for clients.
// Drop a logo at public/logos/<slug>.svg (or .png) and it replaces the letter badge on the next build.
// height: logo display height in px. use: one line on what we do with it, shown under the logo.
export const tools=[{slug:'google-workspace',name:'Google Workspace',height:30,use:'Enquiries, calendars and files in one place'},{slug:'zapier',name:'Zapier',height:30,use:'Quick links between your everyday apps'},{slug:'make',name:'Make',height:28,use:'Advanced multi-step workflows'},{slug:'hubspot',name:'HubSpot',height:36,use:'Every enquiry and follow-up tracked'},{slug:'xero',name:'Xero',height:46,use:'Finished jobs flow into invoices'}];
