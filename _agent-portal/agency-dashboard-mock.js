/* Shared, deterministic Agency review fixtures. No module pages or network calls. */
(function(root){
  'use strict';
  const M=root.AgencyDashboardModel,R=root.AgencyDashboardRules, DAY=86400000;
  function create(now=new Date()){
    const anchor=M.time(M.tokyoDay(now));
    const date=(days=0,hours=0)=>new Date(anchor+days*DAY+hours*3600000).toISOString();
    const addMonths=(value,months)=>{const d=new Date(M.time(value)+9*3600000),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+months);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));return new Date(d.getTime()-9*3600000).toISOString();};
    const id=(prefix,i)=>prefix+'-'+String(i+1).padStart(3,'0');
    const make=(n,fn)=>Array.from({length:n},(_,i)=>fn(i));
    const choose=(values,i)=>values[i%values.length];
    const agencyId='AGENCY-001';
    const names=['Aiko Tanaka','Kenji Sato','Mika Ito','Yuki Mori','Ryo Suzuki','Hana Kato','Daichi Abe','Emi Yamamoto','Sora Hayashi','Nao Kimura','Rei Saito','Mei Watanabe'];
    const roles=['Agency Admin','Sales Agent','Property Manager','Reception'];
    const staff=make(12,i=>({id:id('STAFF',i),staffId:id('STAFF',i),departmentId:'DEPT-'+(i%4+1),ownerStaffId:id('STAFF',i),agencyId,name:names[i],agent:names[i],role:choose(roles,i),status:i===11?'suspended':'active',last:date(-i*3),lastSignIn:date(-i*3),twofa:i%4!==2}));
    const base=(prefix,i)=>({id:id(prefix,i),agencyId,staffId:staff[i%12].staffId,departmentId:staff[i%12].departmentId,ownerStaffId:staff[i%12].id,assignedStaffId:staff[i%12].id,agent:staff[i%12].name});
    const municipalities=[['Tokyo','Shinjuku-ku','13104'],['Tokyo','Shibuya-ku','13113'],['Tokyo','Minato-ku','13103'],['Kanagawa','Yokohama-shi Kohoku-ku','14109'],['Osaka','Osaka-shi Chuo-ku','27128'],['Kyoto','Kyoto-shi Nakagyo-ku','26104']];
    const cities=municipalities.map(row=>row[1]);
    const prefectures=municipalities.map(row=>row[0]);
    const types=['Apartment','House','Land','Commercial'];
    const contacts=make(60,i=>({...base('CONTACT',i),contactId:id('CONTACT',i),name:'Client '+(i+1),title:'Client '+(i+1),status:i%7===0?'Inactive':'Active',firstContact:date(-i*5-30),lastInteraction:date(-i*2),nationality:choose(['Japan','Vietnam','Singapore','United States'],i),gender:choose(['Female','Male','Other','Prefer Not To Say'],i),age:23+i%48,budgetMin:20000000+(i%8)*10000000,budgetMax:40000000+(i%8)*10000000,buyerStatus:choose(['First-time Buyer','Investor','Existing Owner'],i),propertyType:choose(types,i),city:choose(cities,i),desiredArea:choose(cities,i),purpose:choose(['Residence','Investment'],i),groups:[]}));

    const properties=make(40,i=>{const municipality=choose(municipalities,i);return {...base('PROP',i),propertyId:id('PROP',i),property:municipality[1]+' Residence '+(i+1),title:municipality[1]+' Residence '+(i+1),contactId:contacts[i].id,status:choose(['Published','Published','Pending Review','Published','Suspended','Rejected','Published','Draft'],i),draft:i%8===7,propertyType:choose(types,i),prefecture:municipality[0],city:municipality[1],municipalityCode:municipality[2],intent:i%5===0?'Rent':'Buy',value:i%5===0?180000+i*15000:35000000+i*2500000,priceBasis:i%5===0?'JPY/month':'JPY sale',datePublished:date(i<32?-300+i*5:-(39-i)*3),dateUpdated:date(-i*3)};});
    const projects=make(15,i=>{const municipality=choose(municipalities,i);return {...base('PROJECT',i),projectId:id('PROJECT',i),property:'New Development '+(i+1),title:'New Development '+(i+1),status:choose(['Published','Pending Review','Rejected','Suspended'],i),developer:choose(['Mori Development','Sakura Homes','Pacific Estates'],i),prefecture:municipality[0],city:municipality[1],municipalityCode:municipality[2],datePublished:date(-i*19-30),completionDate:date(i*12-30),inventory:make(6,j=>({id:id('UNIT-'+(i+1),j),projectId:id('PROJECT',i),quantity:i%2===0?j+2:1,status:(i+j)%3===0?'Sold Out':'On Sale'}))};});
    const leads=make(60,i=>{const p=properties[i%40],c=contacts[i];return {...base('LEAD',i),leadId:id('LEAD',i),contactId:c.id,propertyId:p.id,property:p.property,title:c.name+' · '+p.property,intent:p.intent,value:p.value,priceBasis:p.priceBasis,status:choose(['New','Assigned','Contact','Viewing','Proposal','Negotiation','Asleep','Sold','Closed Lost'],i),enquiry:date(i<40?-i*5-20:-(i-40)*2),enquiryDate:date(i<40?-i*5-20:-(i-40)*2),follow:date(i%21-10),followUpDate:date(i%21-10)};});
    const relation=(prefix,i)=>{const l=leads[i%leads.length];return {...base(prefix,i),ownerStaffId:l.ownerStaffId,assignedStaffId:l.ownerStaffId,agent:l.agent,leadId:l.id,contactId:l.contactId,propertyId:l.propertyId,property:l.property,client:contacts.find(c=>c.id===l.contactId).name};};
    const appraisals=make(30,i=>({...relation('APPRAISAL',i),received:date(-i*8),status:choose(['New','In Progress','Converted','Declined'],i),propertyType:choose(types,i),prefecture:choose(prefectures,i),city:choose(cities,i),timeline:choose(['Within 3 months','Within 6 months','Undecided'],i),valuation:choose(['Online','Visit'],i),language:choose(['Japanese','English'],i)}));
    const groups=make(10,i=>({...base('GROUP',i),group:'Client group '+(i+1),title:'Client group '+(i+1),modified:date(-i*4),memberIds:contacts.filter((c,j)=>j%10===i&&j<54).map(c=>c.id)}));
    contacts.forEach(c=>{c.groups=groups.filter(g=>g.memberIds.includes(c.id)).map(g=>g.id);c.leads=leads.filter(l=>l.contactId===c.id);});
    const activity=(type,n,statuses)=>make(n,i=>{const future=['viewing','task','jobs'].includes(type)&&i%3!==0;const start=date(future?1+i%26:-i*4-1,10+i%5);return {...relation(type.toUpperCase(),i),title:choose({viewing:['Property viewing'],task:['Follow up with client','Prepare listing','Review documents'],jobs:['Property inspection','Photography'],calls:['Client call'],emails:['Property recommendations'],sms:['Viewing reminder'],comments:['Client follow-up note']}[type],i),activityType:type,status:choose(future&&type==='viewing'?['Scheduled','Confirmed']:statuses,i),start,end:new Date(M.time(start)+3600000).toISOString(),due:date(i%17-8),createdAt:date(-i*5),modifiedAt:date(-i*2),sentAt:date(-i*4)};});
    const viewing=activity('viewing',30,['Completed','Cancelled','No Show']);
    const task=activity('task',40,['Todo','In Progress','Waiting','Done','Cancelled']);
    const jobs=activity('jobs',20,['Todo','In Progress','Waiting','Done','Cancelled']);
    const calls=activity('calls',30,['Completed','Missed']);
    const emails=activity('emails',40,['Sent','Sent','Failed','Draft']);
    const sms=activity('sms',25,['Sent','Failed','Pending']);
    const comments=activity('comments',25,['Posted']);
    jobs.forEach((r,i)=>r.scheduledAt=i%2?r.start:null);
    [calls,emails,sms].forEach(rows=>rows.forEach((r,i)=>{if(i%8===0){r.status=rows===calls?'Scheduled':rows===emails?'Draft':'Pending';r.scheduledAt=date(1+i%12,11);}}));
    const offers=make(40,i=>({...relation('OFF',i),offerId:id('OFF',i),title:'Offer '+(i+1),status:choose(['Pending','Countered','Accepted','Rejected','Withdrawn','Expired'],i),sentDate:date(-i*4-5),expiryDate:date(i%14-4),offerPrice:40000000+i*1500000,listPrice:45000000+i*1500000,counterPrice:42000000+i*1500000}));
    contacts.forEach(c=>c.offers=offers.filter(o=>o.contactId===c.id));
    const reasons=['Sold','Sold by Others','Seller Withdrew','Expired','Withdrawn by Agent','Duplicate','Legal Hold','Price Renegotiation','Other'];
    const transactions=make(32,i=>{const o=offers[i],p=properties.find(p=>p.id===o.propertyId),removal=i%4===0,reason=removal?reasons[(i/4)%reasons.length]:'Not applicable',sale=p.intent!=='Rent';return {...relation('TXN',i),transactionId:id('TXN',i),offerId:o.id,closingStaffId:o.ownerStaffId,status:removal?'suspended':'closed',value:sale?o.offerPrice:null,date:date(-i*4),transactionDate:date(-i*4),publishedDate:p.datePublished,dealType:sale?'Sale':'Rental',pub:i%3!==0,reason,suspensionReason:removal?reason:null};});
    // An ordinary manual sale can have no lead, offer or inquiry relationship.
    const manual={...base('PROP',40),propertyId:id('PROP',40),property:'Minato Garden Residence',title:'Minato Garden Residence',status:'Suspended',draft:false,intent:'Buy',propertyType:'Apartment',prefecture:'Tokyo',city:'Minato',value:72000000,priceBasis:'JPY sale',datePublished:date(-70),dateUpdated:date(-3)};
    properties.push(manual);
    Object.assign(manual,{suspensionReason:'Sold',soldAt:date(-3),salePrice:72000000});
    transactions.push({...base('TXN',32),transactionId:id('TXN',32),propertyId:manual.id,property:manual.property,staffId:manual.staffId,ownerStaffId:manual.staffId,assignedStaffId:manual.staffId,closingStaffId:manual.staffId,agent:manual.agent,departmentId:manual.departmentId,status:'suspended',suspensionReason:'Sold',reason:'Sold',dealType:'Sale',value:manual.salePrice,date:manual.soldAt,transactionDate:manual.soldAt,publishedDate:manual.datePublished,pub:true});
    // Individual sold development units are normal Sale transactions, not a new revenue bucket.
    projects.forEach((project,i)=>project.inventory.filter(unit=>unit.status==='Sold Out').forEach(inventory=>{
      for(let j=0;j<inventory.quantity;j++){
        const n=transactions.length,unitId=inventory.id+'-'+(j+1),soldAt=date(-2-i*3);
        transactions.push({...base('TXN',n),transactionId:id('TXN',n),projectId:project.id,inventoryId:inventory.id,unitId,propertyId:unitId,property:project.title+' · '+unitId,closingStaffId:staff[(n+1)%12].staffId,status:'closed',dealType:'Sale',value:58000000+(i%6)*7000000,date:soldAt,transactionDate:soldAt,publishedDate:project.datePublished,confirmedSoldAt:soldAt,pub:true,reason:'Not applicable',suspensionReason:null});
      }
    }));
    transactions.filter(t=>t.status==='closed'&&t.leadId).forEach(t=>{offers.find(o=>o.id===t.offerId).status='Accepted';const lead=leads.find(l=>l.id===t.leadId);if(t.dealType==='Sale'){lead.status='Sold';lead.soldAt=t.transactionDate;}viewing.filter(v=>v.leadId===t.leadId).forEach(v=>{v.status='Completed';v.start=new Date(M.time(t.transactionDate)-86400000+10*3600000).toISOString();v.end=new Date(M.time(v.start)+3600000).toISOString();});});
    properties.filter(p=>p.status==='Suspended'&&p.suspensionReason!=='Sold').forEach((p,i)=>p.suspensionReason=reasons[1+i%(reasons.length-1)]);
    leads.filter(l=>l.status==='Sold'&&!l.soldAt).forEach(l=>l.soldAt=date(-1));
    transactions.forEach(t=>{const property=properties.find(p=>p.id===t.propertyId);if(property)t.confirmedSoldAt=R.soldDate(property,leads);});
    offers.filter(o=>o.status==='Accepted').forEach(o=>{const t=transactions.find(t=>t.offerId===o.id&&t.status==='closed');o.acceptedAt=t?.transactionDate||new Date(M.time(o.sentDate)+86400000).toISOString();});
    const agreements=make(15,i=>({...relation('AGR',i),title:choose(['Agency agreement','Privacy consent','Viewing agreement'],i),status:'Accepted',acceptedStaffId:staff[i%12].id,published:date(-i*10-8),acceptedOn:date(-i*10)}));
    // Client-initiated property chat contexts. They do not create or require a Lead.
    const inquiries=make(40,i=>{const contact=contacts[(i*7)%contacts.length],property=properties[(i*3)%properties.length];return {...base('INQUIRY',i),inquiryId:id('INQUIRY',i),conversationId:id('INQUIRY',i),contactId:contact.id,propertyId:property.id,property:property.property,client:contact.name,title:'Inquiry · '+contact.name,createdAt:date(-i*4-2),createdByContactId:contact.id,origin:'Property Detail',kind:'client'};});
    // Some matches use the same existing contact/property/staff fields; no inquiry link is written.
    inquiries.filter((q,i)=>i%3===0).forEach((q,i)=>{const v=viewing[i%viewing.length];Object.assign(q,{contactId:v.contactId,propertyId:v.propertyId,property:v.property,client:v.client,agent:v.agent,departmentId:v.departmentId,staffId:v.staffId,ownerStaffId:v.staffId,assignedStaffId:v.staffId,createdByContactId:v.contactId});});
    const messageEvents=inquiries.flatMap((q,i)=>[0,1,3,8,9,20,21,40,60].map((minute,j)=>({...q,id:id('MSG-'+i,j),inquiryId:q.id,conversationId:q.conversationId,direction:[3,4,7].includes(j)?'outbound':'inbound',sender:[3,4,7].includes(j)?'agency':'client',unread:j===8&&i%4!==0||j===6&&i%5===0,date:new Date(M.time(q.createdAt)+minute*60000).toISOString()})));
    inquiries.forEach(q=>{q.hasLinkedViewing=R.inquiryViewing(q,viewing);});
    const responseTimes=R.responseCycles(messageEvents);
    const campaignProperties=properties.filter(p=>p.status==='Published'&&M.time(p.datePublished)<=M.time(date(-210)));
    const campaigns=make(28,i=>{const p=campaignProperties[i%campaignProperties.length],status=choose(['Active','Pending Review','Approved','Completed','Rejected','Rejected (Timeout)','Cancelled'],i),months=1+i%3,start=['Approved','Pending Review'].includes(status)?date(3+i%10):status==='Active'?date(-5-i%14):date(-180-i);return {...base('CAMPAIGN',i),campaignId:id('CAMPAIGN',i),propertyId:p.id,property:p.property,projectId:projects.filter(p=>p.status==='Published')[i%4].id,title:choose(M.AD_TYPES,Math.floor(i/4))+' · '+p.property,status,adType:choose(M.AD_TYPES,Math.floor(i/4)),packageMonths:months,startDate:start,endDate:addMonths(start,months),reviewDeadline:date(1+i%3),lockedPrice:30000*months*(1+i%4),authorized:status==='Pending Review',charged:['Active','Completed','Approved'].includes(status)};});
    const billing=campaigns.map((c,i)=>({...base('BILL',i),campaignId:c.id,adType:c.adType,title:c.title,date:M.time(c.startDate)>anchor?date(-2):c.startDate,engine:'Advertising',amount:c.lockedPrice,status:c.charged?'Succeeded':c.authorized?'Authorized':i%2?'Failed':'Refunded',resolved:i%2===0,retryPath:'billing-payments.html'}));
    billing.push(...make(6,i=>({...base('BILL',28+i),title:'Agency plan renewal',date:date(-i*30),engine:'Subscription',amount:18000,status:i===2?'Failed':'Succeeded',resolved:false,retryPath:'billing-payments.html'})));
    billing.forEach(b=>b.paymentMethodStatus='Valid');
    billing.forEach(b=>b.paymentMethodHealth=billing.some(x=>x.status==='Failed'&&!x.resolved)?'Action required':'Healthy');
    const viewEvents=[];
    function recordViews(row,count,channel){const observations=make(count,k=>({id:'VIEW-'+channel+'-'+row.id+'-'+k,agencyId,staffId:row.staffId,propertyId:row.propertyId,contactId:contacts[k%3].id,channel,date:row.date}));viewEvents.push(...observations);return R.countViews(observations);}
    const propertyPerformance=properties.flatMap((p,i)=>make(181,j=>{if(M.time(date(-j))<M.time(p.datePublished))return null;const observation={id:p.id+'-DAY-'+j,propertyId:p.id,staffId:p.staffId,date:date(-j)},views=p.draft?0:recordViews(observation,5+(i+j)%7,'organic'),clicks=2+(i+j)%4;return {...p,id:p.id+'-DAY-'+j,date:date(-j),organic:p.draft?{impressions:0,views:0,clicks:0,keep:0,inquiries:0}:{impressions:views*8,views,clicks,keep:(i+j)%3,inquiries:(i+j)%2},paid:{impressions:0,views:0,clicks:0,keep:0}};}).filter(Boolean));
    const adPerformance=campaigns.filter(c=>c.charged).flatMap((c,i)=>make(240,j=>{const d=date(-j);if(M.time(d)<M.time(c.startDate)||M.time(d)>M.time(c.endDate))return null;const clicks=3+(i+j)%12;return {...c,id:c.id+'-DAY-'+j,date:d,impressions:clicks*35,views:recordViews({...c,id:c.id+'-DAY-'+j,date:d},3+(i+j)%5,'paid'),clicks,keep:(i+j)%3,capturedAmount:0};}).filter(Boolean));
    campaigns.forEach(c=>{const rows=adPerformance.filter(r=>r.campaignId===c.id),captured=billing.filter(b=>b.campaignId===c.id&&b.status==='Succeeded').reduce((s,b)=>s+b.amount,0);rows.forEach(r=>r.capturedAmount=captured/rows.length);});
    adPerformance.forEach(r=>{const p=propertyPerformance.find(p=>p.propertyId===r.propertyId&&p.date===r.date);r.paid={impressions:r.impressions,views:r.views,clicks:r.clicks,keep:r.keep};if(p)Object.keys(p.paid).forEach(k=>p.paid[k]+=r[k]);});
    const profile=[{...base('PROFILE',0),name:'Sakura Realty',rating:4.7,email:'office@example.test',phone:'+81 3 5555 0100',address:'Shinjuku, Tokyo',license:'Tokyo (2) 123456',description:'Residential and investment property specialists.',serviceAreas:cities,languages:['Japanese','English','Vietnamese'],branches:['Shinjuku','Yokohama']}];
    profile[0].requiredFields=['name','email','phone','address','license','description','serviceAreas','languages'].map(field=>({field,valid:Array.isArray(profile[0][field])?profile[0][field].length>0:!!profile[0][field]}));
    const profileEvents=make(240,i=>({...base('PROFILE-VIEW',i),date:date(-i%180,-i%10),profileId:profile[0].id}));
    const entitlements=make(6,i=>({...base('COVERAGE',i),title:cities[i],areaId:'AREA-'+i,city:cities[i],tier:i<3?'Standard':'Extended',validFrom:date(-60),expiresAt:date(10+i*10),limit:40,used:appraisals.filter(a=>M.time(a.received)>=M.time(M.tokyoDay(now).slice(0,7)+'-01')).length,unlimited:false}));
    const subscription=[{...base('SUB',0),tier:'Agency',plan:'Agency + CRM Premium',cycleEnd:date(15),autoRenewal:false,confirmationRequired:true,expiresAt:date(15),paymentMethodHealth:billing.some(b=>b.status==='Failed'&&!b.resolved)?'Action required':'Healthy',notices:[]}];
    subscription[0].notices=billing.filter(b=>b.status==='Failed'&&!b.resolved).map(b=>({...b,title:'Payment requires attention',noticeSource:'billing',summary:b.title,resolved:false,priority:1}));
    if(subscription[0].confirmationRequired)subscription[0].notices.push({...subscription[0],notices:undefined,id:'NOTICE-RENEWAL',title:'Renewal confirmation required',noticeSource:'subscription',date:subscription[0].cycleEnd,summary:'Confirm your plan terms before the paid cycle ends.',resolved:false,priority:1});
    subscription[0].notices.push(...campaigns.filter(c=>c.status==='Pending Review').map(c=>({...c,id:'NOTICE-'+c.id,title:'Review deadline approaching',noticeSource:'campaigns',date:c.reviewDeadline,summary:c.title,resolved:false,priority:2})));
    const calendar=R.calendar([...viewing,...task,...jobs,...calls,...emails,...sms]);
    // Only meaningful approved feed categories, with their actual event datetime.
    const eventSources=[
      ...inquiries.map(r=>({...r,date:r.createdAt,activityType:'inquiry',title:'New Inquiry · '+r.client})),
      ...appraisals.map(r=>({...r,date:r.received,activityType:'appraisal',title:'Appraisal Request · '+r.client})),
      ...viewing.filter(r=>['Scheduled','Confirmed'].includes(r.status)).map(r=>({...r,date:r.createdAt,activityType:'viewing',title:'Viewing Scheduled · '+r.property})),
      ...offers.filter(r=>r.status==='Accepted').map(r=>({...r,date:r.acceptedAt,activityType:'offer',title:'Offer Accepted · '+r.property})),
      ...transactions.filter(r=>r.status==='closed'||r.dealType==='Sale'&&r.suspensionReason==='Sold').map(r=>({...r,date:r.transactionDate,activityType:'transaction',title:'Deal Closed · '+r.property}))
    ];
    const events=eventSources.map(r=>({...r,id:'EVENT-'+r.id})).sort((a,b)=>M.time(b.date)-M.time(a.date));
    return {viewEvents,properties,propertyPerformance,projects,leads,appraisals,entitlements,contacts,groups,viewing,task,jobs,calls,emails,sms,comments,calendar,offers,transactions,agreements,inquiries,messageEvents,responseTimes,campaigns,adPerformance,subscription,billing,staff,profile,events,profileEvents};
  }
  root.AgencyDashboardMock={create};
})(window);
