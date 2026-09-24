/* Read-only view of the page's existing records. Never persists business data. */
(function () {
  'use strict';
  const source = document.currentScript.dataset.source;
  const number = value => {if(typeof value==='number')return Number.isFinite(value)?value:null;if(typeof value!=='string'||!/^¥?[\d,]+(?:\.\d+)?$/.test(value.trim()))return null;return Number(value.replace(/[¥,]/g,''));};
  const title = value => String(value||'').replace(/^\w/,x=>x.toUpperCase());
  const base = r=>({id:r.id??r.ref,title:r.title||r.name||r.leadname||r.property,agencyId:r.agencyId,staffId:r.staffId??r.userId??r.agentId,departmentId:r.departmentId,ownerStaffId:r.ownerStaffId??r.ownerId,assignedStaffId:r.assignedStaffId??r.assignedUserId,closingStaffId:r.closingStaffId??r.agentId,acceptedStaffId:r.acceptedStaffId??r.userId,status:r.status,agent:r.agent||r.owner||r.assignedTo,property:r.property||r.name,prefecture:r.prefecture,city:r.city,municipalityCode:r.municipalityCode});
  const acceptedDate = value=>{const match=String(value).match(/^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})(?:, (\d\d:\d\d))?$/);if(!match)return value;const month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(match[2])+1;return `${match[3]}-${String(month).padStart(2,'0')}-${match[1].padStart(2,'0')}${match[4]?'T'+match[4]:''}`;};
  const readers = {
    properties:()=>properties.map(r=>({...base(r),status:r.publishStatus,propertyType:r.propType,intent:r.txType,datePublished:r.datePublished,dateUpdated:r.dateUpdated,value:r.txType==='Rent'?number(r.rentMonthly):number(r.priceBuy),priceBasis:r.txType==='Rent'?'JPY/month':'JPY sale',organic:r.performance?.standardListing})),
    projects:()=>projects.map(r=>({...base(r),status:r.publishStatus,developer:r.developer,datePublished:r.datePublished,completionDate:r.completionDate,inventory:r.group===5?r.floorPlanTypes?.map(c=>({quantity:number(c.units),status:c.saleStatus})):r.group===6?r.lots?.map(c=>({quantity:1,status:c.saleStatus})):undefined})),
    leads:()=>LEADS.map(r=>({...base(r),intent:r.intent,enquiry:r.enquiry,follow:r.follow,value:number(r.price),priceBasis:r.intent==='rent'?'JPY/month':'JPY sale'})),
    appraisals:()=>APPRAISALS.map(r=>({...base(r),received:r.received,propertyType:r.propertyInfo?.propertyType,timeline:r.propertyInfo?.sellingTimeline,valuation:r.clientInfo?.preferredValuationMethod,language:r.clientInfo?.preferredLanguage})),
    contacts:()=>CONTACTS.map(r=>({...base(r),status:r.profile?.status,firstContact:r.firstContact,lastInteraction:r.lastInteraction,nationality:r.profile?.nationality,gender:['Female','Male','Other','Prefer not to say'].includes(r.profile?.gender)?r.profile.gender:undefined,age:r.profile?.age,buyerStatus:r.additional?.buyerStatus,propertyType:r.investment?.propertyType,city:r.investment?.desiredCity,purpose:r.investment?.purpose,groups:r.groups,leads:r.leads?.map(v=>({status:v.status})),offers:r.offers?.map(v=>({status:v.status}))})),
    groups:()=>GROUPS.map(r=>({...base(r),group:r.name,modified:r.modified,memberIds:CONTACTS.filter(c=>c.groups?.includes(r.id)).map(c=>c.id)})),
    activities:()=>Object.entries(RECORDS).flatMap(([type,rows])=>rows.map(r=>({...base(r),activityType:type,start:r.start,end:r.end,due:r.due,createdAt:r.createdAt,modifiedAt:r.modifiedAt}))),
    offers:()=>OFFERS.map(r=>({...base(r),status:title(r.status),sentDate:r.sentDate,offerPrice:r.offerPrice,listPrice:r.listPrice,counterPrice:r.counterPrice,expiryDate:r.expiryDate})),
    transactions:()=>TRANSACTIONS.map(r=>({...base(r),status:r.type,date:r.date,value:number(r.price),pub:r.pub,reason:r.reason})),
    agreements:()=>agreements.map(r=>({id:r.id,title:r.title,acceptedOn:acceptedDate(r.acceptedOn),published:acceptedDate(r.published),status:'Accepted'})),
    staff:()=>staff.map(r=>({...base(r),role:r.role,last:r.last,twofa:r.twofa}))
  };
  if(['properties','projects'].includes(source)){
    if(location.hash==='#create' && typeof openCreateModal==='function')openCreateModal();
    const search=new URLSearchParams(location.search).get('dashboardSearch'),input=document.getElementById('fSearch');
    if(search&&input){input.value=search;input.dispatchEvent(new Event('input',{bubbles:true}));}
  }
  if(source==='activities'){const status=new URLSearchParams(location.search).get('dashboardStatus'),select=document.getElementById('statusFilter');if(status&&select&&[...select.options].some(o=>o.value===status)){select.value=status;select.dispatchEvent(new Event('change',{bubbles:true}));}}
  if(source==='properties')window.addEventListener('storage', event=>{if(event.key==='yuushi.ads.performanceSuppressed' && typeof currentProp!=='undefined' && currentProp){const section=document.querySelector('[data-section="performance"]');if(section)section.outerHTML=renderSection('performance',currentProp);}});
  window.YuushiDashboardSource = {read(){return {rows:readers[source](),mode:'preview',complete:true,updatedAt:null,cadence:'Tokyo time (JST)'};}};
})();
