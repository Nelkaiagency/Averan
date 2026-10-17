import {z} from 'zod';
import {industries,industryNames} from './solutions';
export const contactSchema=z.object({
 name:z.string().trim().min(2,'Please enter your name.').max(120),
 company:z.string().trim().max(160).optional().default(''),
 email:z.email('Please enter a valid email address.').max(254),
 phone:z.string().trim().max(40,'Please use 40 characters or fewer.').refine(v=>!v||(/^[+()\d\s.\-]{6,40}$/.test(v)&&v.replace(/\D/g,'').length>=6),'Please enter a valid phone number.').optional(),
 industry:z.union([z.literal(''),z.enum(industryNames,{error:'Please select your industry.'})]).optional().default(''),
 solution:z.string().trim().max(160).optional(),
 message:z.string().trim().max(5000).optional().default(''),
 consent:z.literal(true,{error:'Please confirm we may contact you about this request.'}),
 website:z.string().max(0),token:z.string().max(2048).optional(),
}).superRefine((value,ctx)=>{if(value.solution&&!industries.find(i=>i.name===value.industry)?.solutions.some(s=>s.title===value.solution))ctx.addIssue({code:'custom',path:['solution'],message:'Please choose an example for the selected industry.'})});
