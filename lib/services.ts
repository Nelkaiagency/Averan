import {Inbox,FileCheck2,ClipboardList,CalendarCheck} from 'lucide-react';
// What we set up for solar, heat pump, retrofit and electrical installers.
export const services=[
 {id:'enquiries',title:'Enquiry & Survey Automation',short:'Every lead answered, surveys booked online.',text:'Enquiries from ads, your website and missed calls land in one list, get an instant reply and book their own survey slot.',icon:Inbox,items:['Instant replies to every lead','Online survey booking','Leads routed by area']},
 {id:'quotes',title:'Quote & Follow-Up Workflows',short:'Quotes that get chased until they get a reply.',text:'You approve the quote, then friendly follow-ups go out automatically until the customer replies, accepts or declines.',icon:FileCheck2,items:['Quote summaries customers understand','Automatic follow-ups','Alerts when customers reply']},
 {id:'paperwork',title:'Grant & Job Paperwork',short:'Every form and document tracked per job.',text:'Each job gets a checklist of the grant, grid and customer documents your process needs, with upload links and reminders.',icon:ClipboardList,items:['Per-job paperwork checklists','Customer upload links','Installs held until paperwork is ready']},
 {id:'installs',title:'Scheduling, Sign-off & Invoicing',short:'From install date to paid invoice.',text:'Crews get their job packs, completion documents go to the customer and finished jobs become invoice drafts for you to check.',icon:CalendarCheck,items:['Crew job packs','Completion certs and handover','Invoices and payment reminders']},
];
