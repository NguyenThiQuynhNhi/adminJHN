/* Confirmed BA mock rules. Existing legacy IDs remain permanent. */
(function(root){
  'use strict';
  const W=root.YuushiWorkflow;
  const staffKey='yuushi.agencyStaffDirectory';
  function syncStaff(rows){
    const saved=W.read(staffKey),map=new Map(saved.map(s=>[s.staffId,s]));
    rows.forEach(s=>{const old=map.get(s.staffId);if(old){s.status=old.status;s.statusLabel=old.status==='active'?'Active':'Suspended';}map.set(s.staffId,{...old,...s});});
    W.write(staffKey,[...map.values()]);refreshStaff();
  }
  function refreshStaff(){
    const saved=W.read(staffKey);
    for(const s of saved){const id=s.staffId;const old=W.AGENCY_SUB_ACCOUNTS.find(a=>a.id===id);const row={...s,id,status:s.status.toLowerCase()==='active'?'Active':'Suspended'};if(old)Object.assign(old,row);else W.AGENCY_SUB_ACCOUNTS.push(row);}
    for(const s of W.AGENCY_SUB_ACCOUNTS){const state=W.read('yuushi.agencyStaffAccess',{});if(state[s.id])s.status=state[s.id].status;}
    return W.AGENCY_SUB_ACCOUNTS.filter(s=>s.status==='Active');
  }
  function setStaffStatus(staff,status,actor=W.currentAgencyActor().name){
    const id=staff.staffId||staff.id,at=W.now();
    const rows=W.read(staffKey),i=rows.findIndex(s=>s.staffId===id);
    const row={...(i<0?staff:rows[i]),staffId:id,status:status.toLowerCase(),statusLabel:status,history:[...(i<0?staff.history||[]:rows[i].history||[]),{actor,action:'Staff '+status,timestamp:at}]};
    if(i<0)rows.push(row);else rows[i]=row;W.write(staffKey,rows);
    const access=W.read('yuushi.agencyStaffAccess',{});access[id]={status,at,actor};W.write('yuushi.agencyStaffAccess',access);refreshStaff();
    if(status!=='Suspended')return 0;
    const assignments=W.read(W.keys.enquiries),leads=W.read(W.keys.leadRecords);let count=0;
    for(const lead of leads){const assignment=assignments.find(a=>a.id===lead.id);if((lead.assignedStaffId||lead.assigneeId||assignment?.assigneeId)!==id||['Sold','Closed Won','Closed Lost','Lost','Closed','Rejected','Withdrawn'].includes(lead.status))continue;
      const oldStatus=lead.status;lead.previousAssignedStaffId=id;lead.assignedStaffId=id;lead.status='Closed Lost';lead.lossReason='Closed Lost because assigned staff was suspended.';
      const event={actor,action:lead.lossReason,oldValue:oldStatus,newValue:'Closed Lost',timestamp:at};lead.history=[...(lead.history||[]),event];lead.assignmentHistory=[...(lead.assignmentHistory||assignment?.assignmentHistory||[]),event];count++;
    }
    W.write(W.keys.leadRecords,leads);
    if(count)(root.YuushiAnalytics||root.top?.YuushiAnalytics)?.emit('lead_status_changed',{staffId:id,newStatus:'Closed Lost',reason:'Assigned staff suspended',affectedLeadCount:count});
    return count;
  }
  function openInquiry(data){
    if(!data.customerId||!data.agencyId||!data.propertyId)throw Error('Customer, Agency and Property are required.');
    const rows=W.read(W.keys.enquiries);
    const match=r=>String(r.customerId||r.clientId)===String(data.customerId)&&String(r.agencyId)===String(data.agencyId)&&String(r.propertyId)===String(data.propertyId);
    const closedStatuses=new Set(['closed','closed won','closed lost','resolved','cancelled','canceled','rejected','withdrawn']);
    // JHN Q&A: only a still-active Inquiry may be reopened. A closed Inquiry
    // remains historical; a subsequent request creates a new Inquiry record.
    // A Lead is not an Inquiry and must not be reused as the conversation record.
    let row=rows.filter(match).filter(r=>!closedStatuses.has(String(r.status||'').trim().toLowerCase()))
      .sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')))[0];
    if(row){row.lastOpenedAt=W.now();W.upsert(W.keys.enquiries,row);return {record:row,created:false};}
    const id=W.next(rows,'INQ-');row={...data,...W.unassigned(),id,conversationId:id,assignedStaffId:null,createdAt:W.now(),status:'New',msgs:[]};
    W.upsert(W.keys.enquiries,row);
    (root.YuushiAnalytics||root.top?.YuushiAnalytics)?.emit('inquiry_created',{inquiryId:id,conversationId:id,customerId:data.customerId,agencyId:data.agencyId,propertyId:data.propertyId,source:'Chat with Agency',accountId:data.customerId||null,accountType:'Customer',portal:'Client'});
    return {record:row,created:true};
  }
  root.YuushiBA={staffKey,syncStaff,refreshStaff,setStaffStatus,openInquiry};refreshStaff();
  // Recheck eligibility at submission time; a stale open assignment dialog cannot assign suspended staff.
  const originalAssign=W.assign;
  W.assign=function(row,type,person,note,actor){refreshStaff();if(person&&W.AGENCY_SUB_ACCOUNTS.some(s=>s.id===person.id&&s.status!=='Active'))throw Error('This staff member is suspended and cannot be assigned.');const result=originalAssign(row,type,person,note,actor);if(type==='Agent Individual')row.assignedStaffId=person.id;else row.assignedStaffId=null;return result;};
})(window);
