/* Operational dashboard adapter.
   Business enums/formulas are owned by analytics-platform.js and real operational stores.
   This file must not invent domain values. Prototype-only infrastructure/payment telemetry is explicit. */
(function(root){
  'use strict';
  const A=root.YuushiAnalytics;
  if(!A)throw new Error('analytics-platform.js must be loaded before overview-data.js');
  const DAY=86400000;
  const dayKey=date=>new Date(date).toISOString().slice(0,10);
  const addDays=(date,days)=>dayKey(Date.parse(date+'T00:00:00Z')+days*DAY);
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const now=Date.now();
  const read=(key,fallback=[])=>A.read(key,fallback);
  const events=A.events();

  const groups={};
  const structures=[];
  const countries=[];
  const places=[];

  function uniqueBy(rows,key){
    const map=new Map();
    for(const row of rows||[]){const id=typeof key==='function'?key(row):row?.[key];if(id!=null)map.set(id,{...map.get(id),...row});}
    return [...map.values()];
  }
  // Platform-wide account KPIs use Admin-managed shared directories.
  // A browser-local Customer/Agency profile is not a valid substitute for the complete platform population.
  const userDirectoryRaw=read('yuushi.admin.userDirectory',null);
  const agencyDirectoryRaw=read('yuushi.admin.agencyDirectory',null);
  const userDirectory=Array.isArray(userDirectoryRaw)?userDirectoryRaw:[];
  const agencyDirectory=Array.isArray(agencyDirectoryRaw)?agencyDirectoryRaw:[];
  const customerDirectoryReady=Array.isArray(userDirectoryRaw);
  const agencyDirectoryReady=Array.isArray(agencyDirectoryRaw);
  const accountDirectoryReady=customerDirectoryReady&&agencyDirectoryReady;
  const accounts=uniqueBy([
    ...userDirectory.map(a=>({...a,type:'Client',registeredAt:a.registeredAt||a.createdAt||null,withdrawnAt:a.withdrawnAt||null})),
    ...agencyDirectory.map(a=>({...a,type:'Agency',name:a.name||a.company||a.id,registeredAt:a.registeredAt||a.createdAt||null,withdrawnAt:a.withdrawnAt||null}))
  ],a=>a.id||a.customerId||a.agencyId);
  const agencies=accounts.filter(a=>a.type==='Agency');
  const agents=agencies;

  const transactionRaw=read('yuushi.transactionVerificationRecords',null);
  const transactions=Array.isArray(transactionRaw)?transactionRaw:[];
  const transactionStoreReady=Array.isArray(transactionRaw);
  const enquiryRaw=read('yuushi.agencyEnquiryAssignments',null);
  const enquiries=Array.isArray(enquiryRaw)?enquiryRaw:[];
  const enquiryStoreReady=Array.isArray(enquiryRaw);
  const reportsRaw=read('yuushi.c07.propertyReports',null);
  const reports=Array.isArray(reportsRaw)?reportsRaw:(reportsRaw&&typeof reportsRaw==='object'?Object.values(reportsRaw):[]);
  const reportStoreReady=Array.isArray(reportsRaw)||(reportsRaw&&typeof reportsRaw==='object');

  // Monetization Admin is the prototype operational source for plans, ad bookings
  // and payment transactions. Overview must not maintain a second hard-coded catalog.
  const commerceRaw=read('yuushi-cms-v1',null);
  const commerce=commerceRaw&&typeof commerceRaw==='object'?commerceRaw:{plans:[],features:[],addons:[],slots:[],bookings:[],transactions:[]};
  const commerceStoreReady=Boolean(commerceRaw&&typeof commerceRaw==='object');
  const plans=(commerce.plans||[]).filter(p=>p.status!=='Retired');
  const prices=Object.fromEntries(plans.map(p=>[p.name,Number(p.price)||0]));
  const adTypes=[...new Set((commerce.slots||[]).map(s=>String(s.product??'')).filter(Boolean))];
  const options=(commerce.addons||[]).map(a=>a.name).filter(Boolean);
  const subscriptions=read('yuushi.subscriptionRecords',[]);
  const campaigns=Array.isArray(commerce.bookings)?commerce.bookings:[];
  const commerceTransactions=Array.isArray(commerce.transactions)?commerce.transactions:[];
  const appraisalDeliveryRaw=read('yuushi.appraisalDeliveries',null);
  const appraisalDeliveries=Array.isArray(appraisalDeliveryRaw)?appraisalDeliveryRaw:[];
  const appraisalDeliveryReady=Array.isArray(appraisalDeliveryRaw);
  const propertySnapshotRaw=read('yuushi.analytics.propertySnapshots',null);
  const propertySnapshots=Array.isArray(propertySnapshotRaw)?propertySnapshotRaw:[];
  const propertyStoreReady=Array.isArray(propertySnapshotRaw);
  const properties=uniqueBy(propertySnapshots,'id');

  const evtDate=e=>(e.occurredAt||e.createdAt||'').slice(0,10);
  // Site/content/member analytics describe the Client experience only.
  // Agency/Admin portal navigation must never inflate Client sessions, page views or member funnels.
  const member=e=>e.accountType==='Customer';
  const clientEvents=events.filter(e=>e.portal==='Client'&&['Customer','Guest'].includes(e.accountType));
  const factEvents=[...clientEvents,...events.filter(e=>e.type==='inquiry_created'&&!clientEvents.includes(e))];
  const facts=factEvents.map(e=>{
    const base={date:evtDate(e),propertyId:e.propertyId||null,agencyId:e.agencyId||null,agentId:e.agencyId||null,member:member(e),country:e.country||'',device:e.deviceType||'',language:e.language||'',channel:e.channel||'',section:e.page||'',exitSection:e.exitPage||'',placement:e.placement||'',adType:e.adType||'',option:e.option||'',campaign:e.campaign||'',hour:e.occurredAt?new Date(e.occurredAt).getHours():0,
      impressions:0,views:0,clicks:0,saves:0,inquiries:0,deals:0,verifiedClosings:0,searches:0,sessions:0,bounced:0,sessionSeconds:0,listingSeconds:0,pageViews:0,registrations:0,
      subscription:0,banner:0,sponsored:0,featured:0,appraisal:0,optionRevenue:0,purchases:0,messagesUser:0,messagesAgent:0,chats:0,replied:0,received:0,responseMinutes:0,appraisalRequests:0,appraisalSent:0,sent:0,read:0,marketingClicks:0,marketingCV:0,blocked:0,adImpressions:0,adViews:0,adClicks:0,adInquiries:0,adVerifiedClosings:0};
    if(e.type==='property_card_rendered')base.impressions=1;
    if(e.type==='property_card_viewed')base.views=1;
    if(e.type==='property_card_clicked')base.clicks=1;
    if(e.type==='property_saved')base.saves=1;
    if(e.type==='inquiry_created'){base.inquiries=1;if(e.campaignId||e.campaign)base.adInquiries=1;}
    if(e.type==='search_submitted')base.searches=1;
    if(e.type==='client_route_view')base.pageViews=1;
    if(e.type==='session_started')base.sessions=1;
    if(e.type==='account_registered')base.registrations=1;
    if(e.type==='ad_rendered'){base.adImpressions=1;}
    if(e.type==='ad_viewed'){base.adViews=1;}
    if(e.type==='ad_clicked'){base.adClicks=1;}
    return base;
  }).filter(r=>r.date);

  // Align Admin deal counts with the Agency's currently eligible Yuushi transaction
  // population. External/off-platform deals and unresolved mismatches are excluded.
  // The final dispute/evidence resolution workflow still requires JHN confirmation.
  for(const t of transactions){
    const date=(t.transactionDate||t.soldDate||t.updatedAt||'').slice(0,10);if(!date)continue;
    const completed=t.status==='closed'||(t.status==='suspended'&&t.suspensionReason==='Sold');
    const matched=t.verificationStatus==='Matched'||(t.verificationStatus==='Admin Resolved'&&t.adminResolutionAccepted===true);
    const eligible=t.transactionSource==='Yuushi Client Transaction'&&completed&&matched;
    facts.push({date,propertyId:t.propertyId||null,agencyId:t.agencyId||null,agentId:t.agencyId||null,member:true,country:'',device:'',language:'',channel:'',section:'Transaction',exitSection:'',placement:'',adType:'',option:'',campaign:'',hour:0,
      impressions:0,views:0,clicks:0,saves:0,inquiries:0,deals:eligible?1:0,verifiedClosings:0,searches:0,sessions:0,bounced:0,sessionSeconds:0,listingSeconds:0,pageViews:0,registrations:0,
      subscription:0,banner:0,sponsored:0,featured:0,appraisal:0,optionRevenue:0,purchases:0,messagesUser:0,messagesAgent:0,chats:0,replied:0,received:0,responseMinutes:0,appraisalRequests:0,appraisalSent:0,sent:0,read:0,marketingClicks:0,marketingCV:0,blocked:0,adImpressions:0,adViews:0,adClicks:0,adInquiries:0,adVerifiedClosings:0,
      transactionId:t.transactionId,transactionSource:t.transactionSource,verificationStatus:t.verificationStatus});
  }

  const chats=enquiries.map(q=>({
    id:q.conversationId||q.id,date:(q.createdAt||q.lastOpenedAt||'').slice(0,10),propertyId:q.propertyId||null,customerId:q.customerId||q.clientId||null,agencyId:q.agencyId||null,agentId:q.agencyId||null,country:q.country||'',
    messages:(q.msgs||q.messages||[]).map(m=>({sender:/client|customer|them/i.test(m.sender)?'Client':'Agency',sentAt:m.sentAt||m.time||q.createdAt||null,businessHours:m.businessHours}))
  }));

  const sessionStarts=clientEvents.filter(e=>e.type==='session_started');
  const sessionEnds=clientEvents.filter(e=>e.type==='session_ended');
  const accountSessions=sessionStarts.map(s=>{
    const end=sessionEnds.find(e=>e.sessionId===s.sessionId&&e.occurredAt>=s.occurredAt);
    return {accountId:s.accountId,date:evtDate(s),seconds:end?Math.max(0,(Date.parse(end.occurredAt)-Date.parse(s.occurredAt))/1000):null};
  });
  // Account activity is derived from authenticated Client events. A dashboard-only login seed is never used.
  // Any authenticated route/action event is activity; account_login is additionally emitted at sign-in.
  const activityByAccount=new Map();
  clientEvents.filter(e=>e.accountId&&e.accountType==='Customer').forEach(e=>{
    const date=evtDate(e);if(!date)return;
    const dates=activityByAccount.get(e.accountId)||[];if(!dates.includes(date))dates.push(date);activityByAccount.set(e.accountId,dates);
  });
  accounts.forEach(a=>{a.logins=(activityByAccount.get(a.id||a.customerId||a.agencyId)||[]).sort();});
  const guestMap=new Map();
  clientEvents.filter(e=>e.accountType==='Guest').forEach(e=>{
    const id=e.anonymousVisitorId;if(!id)return;
    const row=guestMap.get(id)||{id,prefecture:e.prefecture||'',city:e.city||'',visits:[]};
    const d=evtDate(e);if(d&&!row.visits.includes(d))row.visits.push(d);guestMap.set(id,row);
  });
  const guests=[...guestMap.values()];

  const adminChatRaw=read('yuushi.adminSupportThreads',null);
  const adminChats=Array.isArray(adminChatRaw)?adminChatRaw:[];
  const adminChatStoreReady=Array.isArray(adminChatRaw);
  const fraudRaw=read('yuushi.admin.fraudFlags',null);
  const fraudFlags=Array.isArray(fraudRaw)?fraudRaw:[];
  const fraudStoreReady=Array.isArray(fraudRaw);
  const telemetry=A.telemetry();
  const paymentCategory=reason=>{
    const text=String(reason||'').toLowerCase();
    if(/declin|insufficient/.test(text))return 'Card declined';
    if(/auth/.test(text))return 'Authentication failure';
    if(/expir/.test(text))return 'Card expired';
    if(/network|system|connection|api/.test(text))return 'System / network error';
    return 'Other';
  };
  const operationalPaymentErrors=commerceTransactions
    .filter(t=>String(t.status).toLowerCase()==='failed')
    .map(t=>({id:t.id,category:paymentCategory(t.reason),status:'unresolved',code:t.reason||'',occurredAt:t.date?new Date(t.date+'T00:00:00Z').toISOString():null}));
  const paymentErrors=[...operationalPaymentErrors,...(telemetry.paymentErrors||[])];
  const succeededPayments=commerceTransactions.filter(t=>['succeeded','success'].includes(String(t.status).toLowerCase())&&['Charge','Capture'].includes(t.event));
  const logs=read('yuushi.admin.systemIssues',[]);
  const data={
    today,now,accounts,agencies,agents,subscriptions,adminChats,accountSessions,guests,properties,facts,chats,fraudFlags,paymentErrors,logs,
    reports,transactions,enquiries,campaigns,commerceTransactions,succeededPayments,appraisalDeliveries,analyticsEvents:events,places,groups,structures,countries,plans,prices,adTypes,options,
    customerDirectoryReady,agencyDirectoryReady,accountDirectoryReady,propertyStoreReady,appraisalDeliveryReady,
    transactionStoreReady,enquiryStoreReady,reportStoreReady,commerceStoreReady,adminChatStoreReady,fraudStoreReady,
    telemetry,metricStatus:(id)=>{
      const accountMetrics=new Set(['r29','r42','r43','r44','r46','r55','r56','r69','r70','r71','r72','r73','r77','r80','r81','r83','r110']);
      const propertySnapshotMetrics=new Set(['r77','r92','r93','r101','r102']);
      const enquiryMetrics=new Set(['r32','r57','r58','r59','r60','r78','r98']);
      const transactionMetrics=new Set(['r32','r79','r100']);
      if(accountMetrics.has(id)&&!accountDirectoryReady)return {ready:false,note:'Platform-wide Customer/Agency directory has not been synchronized from Admin User/Agency Management yet.'};
      if(propertySnapshotMetrics.has(id)&&!propertyStoreReady)return {ready:false,note:'Operational Property snapshot store has not been synchronized from Property Management yet.'};
      if(enquiryMetrics.has(id)&&!enquiryStoreReady)return {ready:false,note:'Agency Inquiry/conversation store has not been synchronized yet.'};
      if(transactionMetrics.has(id)&&!transactionStoreReady)return {ready:false,note:'Agency-recorded Transaction store has not been synchronized yet.'};
      if(['r84','r118'].includes(id))return appraisalDeliveryReady
        ? {ready:true,note:'Calculated from persisted appraisal_delivery records; one row represents one request delivered to one Agency.'}
        : {ready:false,note:'Appraisal delivery store has not been synchronized from Agency Appraisal Management yet.'};
      return A.overviewMetricStatus(id);
    }
  };
  const utilities={DAY,dayKey,addDays};
  root.OverviewDemo={data,utilities};
})(typeof window!=='undefined'?window:globalThis);
