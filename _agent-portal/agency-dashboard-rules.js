/* Current BA rules. Pure projections over existing records; no business workflows. */
(function(root){
  'use strict';
  const time=v=>root.AgencyDashboardModel.time(v);
  function responseCycles(messages){
    const conversations=new Map(),cycles=[];
    for(const m of messages){if(!Number.isFinite(time(m.date)))continue;const key=m.inquiryId||m.conversationId;if(!conversations.has(key))conversations.set(key,[]);conversations.get(key).push(m);}
    for(const list of conversations.values()){
      list.sort((a,b)=>time(a.date)-time(b.date)||String(a.id).localeCompare(String(b.id)));
      let lastClient=null;
      for(const m of list){
        if(m.sender==='client'){lastClient=m;continue;}
        if(m.sender==='agency'&&lastClient){cycles.push({...m,id:'RESPONSE-'+m.id,inboundAt:lastClient.date,replyAt:m.date,clientMessageId:lastClient.id,replyMessageId:m.id});lastClient=null;}
      }
    }
    return cycles;
  }
  function inquiryViewing(inquiry,viewings){return !!(inquiry.contactId&&inquiry.propertyId&&inquiry.staffId)&&viewings.some(v=>v.agencyId===inquiry.agencyId&&v.contactId===inquiry.contactId&&v.propertyId===inquiry.propertyId&&v.staffId===inquiry.staffId);}
  function soldDate(property,leads){
    const dates=leads.filter(l=>l.propertyId===property.id&&['Sold','Closed Won'].includes(l.status)).map(l=>l.soldAt);
    if(property.status==='Suspended'&&property.suspensionReason==='Sold')dates.push(property.soldAt);
    return dates.filter(d=>Number.isFinite(time(d))&&time(d)>=time(property.datePublished)).sort((a,b)=>time(a)-time(b))[0]||null;
  }
  function closedSales(rows){return rows.filter(r=>r.dealType==='Sale'&&(r.status==='closed'||r.status==='suspended'&&r.suspensionReason==='Sold'));}
  // BA attribution is still open. The selected stored staff field is a display setting.
  const attributionFields=['staffId','closingStaffId','ownerStaffId','assignedStaffId'];
  function attributedStaff(row,field='staffId'){return row[attributionFields.includes(field)?field:'staffId']||null;}
  function scheduledAt(row){
    if(['Done','Cancelled','Completed','No Show','Sent','Failed','Missed'].includes(row.status))return null;
    if(row.activityType==='viewing')return row.start||null;
    if(row.activityType==='task')return row.due||null;
    if(row.activityType==='jobs')return row.scheduledAt||row.due||null;
    if(['calls','emails','sms'].includes(row.activityType))return row.scheduledAt||null;
    return null;
  }
  function calendar(records){return records.map(row=>({...row,scheduledActionAt:scheduledAt(row)})).sort((a,b)=>(time(a.scheduledActionAt)||Infinity)-(time(b.scheduledActionAt)||Infinity));}
  function soldListings(store){
    const listings=store.properties.map(p=>({...p,publishedDate:p.datePublished,confirmedSoldAt:soldDate(p,store.leads),dealType:p.intent==='Rent'?'Rental':'Sale',reason:p.suspensionReason||'Not applicable'}));
    const units=store.transactions.filter(t=>t.unitId&&t.dealType==='Sale'&&t.status==='closed').map(t=>({...t,id:t.unitId}));
    return [...listings,...units].filter(p=>p.dealType==='Sale'&&Number.isFinite(time(p.confirmedSoldAt)));
  }
  // Existing Inquiry contexts are counted as stored; repeated client actions are not simulated.
  // Final repeated-Inquiry creation/reuse behavior remains a client decision.
  const inquiryRecords=records=>records;
  // Raw observations are counted for this frontend. Final repeated-View deduplication is pending.
  const countViews=events=>events.length;
  root.AgencyDashboardRules={countViews,inquiryRecords,soldListings,responseCycles,inquiryViewing,soldDate,closedSales,attributionFields,attributedStaff,scheduledAt,calendar};
})(window);
