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
  function closedSales(rows){return rows.filter(r=>{
    if(r.dealType!=='Sale'||r.transactionSource!=='Yuushi Client Transaction'||!(r.status==='closed'||r.status==='suspended'&&r.suspensionReason==='Sold'))return false;
    if(r.verificationStatus==='Matched')return Number.isFinite(Number(r.finalSalePrice??r.value));
    return r.verificationStatus==='Admin Resolved'&&r.adminResolutionAccepted===true&&Number.isFinite(Number(r.finalSalePrice??r.value));
  }).map(r=>({...r,value:Number(r.finalSalePrice??r.value)}));}
  // Final sale credit belongs only to the signed-in account stored as Closed By.
  function attributedStaff(row){return row.closedByStaffId||null;}
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
    // Average Days to Close must use the same on-platform, eligible Sale population
    // as Total Sales Value. A locally marked Sold listing or an external sale
    // without an eligible Yuushi transaction does not earn a sales KPI.
    const properties=new Map((store.properties||[]).map(p=>[String(p.id),p]));
    const projects=new Map((store.projects||[]).map(p=>[String(p.id),p]));
    return closedSales(store.transactions||[]).map(t=>{
      const listing=properties.get(String(t.propertyId))||projects.get(String(t.projectId));
      return {...t,id:t.unitId||t.id,
        publishedDate:t.publishedDate||listing?.datePublished||null,
        confirmedSoldAt:t.confirmedSoldAt||t.transactionDate||null};
    }).filter(t=>Number.isFinite(time(t.publishedDate))&&Number.isFinite(time(t.confirmedSoldAt))&&time(t.confirmedSoldAt)>=time(t.publishedDate));
  }
  // Q&A confirmed: repeated Chat with Agency reopens the active Client–Property
  // Inquiry; it does not create a new record. A new Inquiry may be created
  // when the previous Inquiry has been closed and a new request is submitted.
  // Dashboard counts persisted Inquiry creation records, not CTA clicks/messages.
  const inquiryRecords=records=>records;
  // Q&A confirmed event-based Views: count new organic viewport exposures.
  // The event producer must suppress repeated callbacks while a card remains
  // continuously visible; do NOT deduplicate by Client/day/session.
  const countViews=events=>events.length;
  root.AgencyDashboardRules={countViews,inquiryRecords,soldListings,responseCycles,inquiryViewing,soldDate,closedSales,attributedStaff,scheduledAt,calendar};
})(window);
