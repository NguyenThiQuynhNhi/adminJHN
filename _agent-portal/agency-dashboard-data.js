/* One shared in-memory fixture; localStorage holds only review preferences/layout. */
(function(root){
  'use strict';
  const M=root.AgencyDashboardModel;
  const key='yuushi.agency.dashboard.preview';
  let store=root.AgencyDashboardMock.create();
  function preferences(){try{return JSON.parse(localStorage.getItem(key))||{};}catch{return {};}}
  function context(){
    const p=preferences(),role=['Agency Admin','Sales Agent','Property Manager','Reception'].includes(p.role)?p.role:'Agency Admin';
    const user=store.staff.find(s=>s.role===role),permissions={};
    const allowed={ 'Sales Agent':['properties','propertyPerformance','leads','contacts','groups','viewing','task','jobs','calls','emails','sms','comments','calendar','offers','transactions','agreements','inquiries','messageEvents','responseTimes','events','profile','profileEvents','staff'], 'Property Manager':['properties','propertyPerformance','projects','viewing','task','jobs','calendar','comments','contacts','events','profile','staff'], Reception:['contacts','groups','leads','viewing','task','calls','emails','sms','comments','calendar','inquiries','messageEvents','responseTimes','events','profile']};
    M.sources.forEach(s=>{const visible=role==='Agency Admin'||allowed[role].includes(s.id);permissions[s.id]={scope:visible?(role==='Agency Admin'||['profile','profileEvents'].includes(s.id)?'agency':'own'):'none',actions:{view:visible,export:visible,create:visible}};});
    let suppression=true;try{suppression=JSON.parse(localStorage.getItem('yuushi.ads.performanceSuppressed'))!==false;}catch{}
    return {mode:'preview',mockScope:true,staffId:user.staffId,agencyId:user.agencyId,name:user.name,agentRating:permissions.profile?.actions.view?store.profile[0].rating:null,agencyName:store.profile[0].name,role,permissions,policyMap:Object.fromEntries(M.sources.map(s=>[s.id,s.id])),features:{crmPremium:p.crmPremium!==false},suppression};
  }
  function setPreview(p){const next={...preferences(),...p};localStorage.setItem(key,JSON.stringify(next));if('suppression' in p)localStorage.setItem('yuushi.ads.performanceSuppressed',JSON.stringify(p.suppression));}
  function read(source,ctx=context()){return {rows:store[source]||[],related:store,state:'ready',mode:'preview',complete:true,history:true,cadence:'Tokyo time (JST)',updatedAt:null};}
  function clear(){store=root.AgencyDashboardMock.create();}
  root.AgencyDashboardData={context,read,clear,setPreview,preferences};
})(window);
