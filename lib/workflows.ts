export type Workflow={name:string;short:string;reference:string;record:string;team:string;benefit:string;stages:{name:string;owner:string;detail:string;manual:string}[]};
export const workflows:Workflow[]=[
{name:'Construction Operations',short:'Construction',reference:'CN-1042',record:'New project enquiry',team:'Site Team A',benefit:'The enquiry, estimate, approval and delivery record stay connected. Everyone can see the next action and who owns it.',stages:[
{name:'New job enquiry',owner:'Office team',detail:'The enquiry opens a job record with the customer’s requirements attached.',manual:'A new enquiry sits in an inbox until someone notices and forwards it.'},
{name:'Information captured',owner:'Office team',detail:'Contact details, project scope and the site address are held in the same record.',manual:'Details are copied into separate spreadsheets and messages.'},
{name:'Estimate prepared',owner:'Estimating team',detail:'The estimator prepares a costed response using the captured requirements.',manual:'The estimator looks through emails to find the latest requirements.'},
{name:'Manager approval',owner:'Operations manager',detail:'The manager reviews the estimate. The system records the decision; it does not make it.',manual:'Approval is requested by email, with the decision recorded separately.'},
{name:'Job scheduled',owner:'Project coordinator',detail:'The approved job is given an agreed date and assigned to Site Team A.',manual:'Dates are agreed across calls and entered into a separate calendar.'},
{name:'Team notified',owner:'Site Team A',detail:'The assigned team receives the job brief, date and relevant documents.',manual:'Someone sends the same information to several people individually.'},
{name:'Progress tracked',owner:'Project lead',detail:'The project lead updates the shared record as the work progresses.',manual:'The office calls the team to ask for updates and revises its spreadsheet.'},
{name:'Invoice generated',owner:'Finance team',detail:'A draft invoice is prepared from the completed job for finance to review.',manual:'Finance re-enters job details to create an invoice.'}]},
{name:'Property Operations',short:'Property',reference:'PM-2086',record:'Maintenance request',team:'Assigned contractor',benefit:'The request, property and completion record stay together. Staff can follow progress without searching across conversations.',stages:[
{name:'New maintenance request',owner:'Service desk',detail:'A request is captured with the issue description and supporting details.',manual:'A tenant reports an issue in a message to a member of staff.'},
{name:'Request categorised',owner:'Service desk',detail:'The issue is categorised and its urgency reviewed by the service desk.',manual:'Staff read each message and decide where to forward it.'},
{name:'Property identified',owner:'Property manager',detail:'The request is linked to the relevant property and access information.',manual:'The address and access information are found in separate records.'},
{name:'Task assigned',owner:'Property manager',detail:'A responsible contractor is selected and the next action is made clear.',manual:'Several calls are made to find someone available.'},
{name:'Contractor notified',owner:'Assigned contractor',detail:'The contractor receives the request, location and agreed arrangements.',manual:'Details are copied into a new message to the contractor.'},
{name:'Status tracked',owner:'Property manager',detail:'Progress is visible in the shared request record.',manual:'Staff contact the contractor for updates.'},
{name:'Completion recorded',owner:'Property manager',detail:'Completion notes are added and the request is closed after review.',manual:'Completion is confirmed by message and filed separately.'}]},
{name:'Customer Enquiries',short:'Enquiries',reference:'EN-0318',record:'New customer enquiry',team:'Customer team',benefit:'Every enquiry has a record, a responsible person and an agreed follow-up. The team can see what needs attention.',stages:[
{name:'New enquiry',owner:'Shared inbox',detail:'A new enquiry arrives through the company’s contact form.',manual:'An enquiry arrives in one of several inboxes.'},
{name:'Contact details captured',owner:'Customer team',detail:'The enquiry and contact details are saved together.',manual:'Someone copies the contact details into a spreadsheet.'},
{name:'Enquiry classified',owner:'Customer team',detail:'The type of request is reviewed and classified for routing.',manual:'The recipient works out who might be able to help.'},
{name:'Relevant team notified',owner:'Customer team',detail:'The appropriate team is notified and an owner is assigned.',manual:'The message is forwarded, sometimes without clear ownership.'},
{name:'Follow-up scheduled',owner:'Account owner',detail:'A dated follow-up task is created for the assigned owner.',manual:'The owner tries to remember to follow up or adds a personal reminder.'},
{name:'CRM updated',owner:'Account owner',detail:'The interaction is recorded so future conversations have context.',manual:'The conversation history remains spread across individual inboxes.'}]}];
