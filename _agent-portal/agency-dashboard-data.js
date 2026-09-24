/* One shared in-memory fixture; localStorage holds only platform settings/layout. */
(function(root){
  'use strict';
  const M=root.AgencyDashboardModel;
  let store=root.AgencyDashboardMock.create();
  function context(){
    // Static prototype session. Production supplies the signed-in staff context here.
    const role='Agency Admin';
    const user=store.staff.find(s=>s.role===role),permissions={};
    const allowed={ 'Sales Agent':['properties','propertyPerformance','leads','contacts','groups','viewing','task','jobs','calls','emails','sms','comments','calendar','offers','transactions','agreements','inquiries','messageEvents','responseTimes','events','profile','profileEvents','staff'], 'Property Manager':['properties','propertyPerformance','projects','viewing','task','jobs','calendar','comments','contacts','events','profile','staff'], Reception:['contacts','groups','leads','viewing','task','calls','emails','sms','comments','calendar','inquiries','messageEvents','responseTimes','events','profile']};
    M.sources.forEach(s=>{const visible=role==='Agency Admin'||allowed[role].includes(s.id);permissions[s.id]={scope:visible?(role==='Agency Admin'||['profile','profileEvents'].includes(s.id)?'agency':'own'):'none',actions:{view:visible,export:visible,create:visible}};});
    const dashboardPermission={view:role!=='Reception',export:['Agency Admin','Sales Agent','Property Manager'].includes(role)};
    let suppression=true;try{suppression=JSON.parse(localStorage.getItem('yuushi.ads.performanceSuppressed'))!==false;}catch{}
    return {mode:'preview',staffId:user.staffId,agencyId:user.agencyId,name:user.name,agentRating:permissions.profile?.actions.view?store.profile[0].rating:null,agencyName:store.profile[0].name,role,dashboardPermission,permissions,policyMap:Object.fromEntries(M.sources.map(s=>[s.id,s.id])),suppression};
  }
  function read(source,ctx=context()){
    if(!M.canViewDashboard(ctx))return {rows:[],related:null,state:'unavailable',mode:'preview',complete:false,history:false,cadence:'Tokyo time (JST)',updatedAt:null};
    return {rows:store[source]||[],related:store,state:'ready',mode:'preview',complete:true,history:true,cadence:'Tokyo time (JST)',updatedAt:null};
  }
  function clear(){store=root.AgencyDashboardMock.create();}
  root.AgencyDashboardData={context,read,clear};
})(window);
