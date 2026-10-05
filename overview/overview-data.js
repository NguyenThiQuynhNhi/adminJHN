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
  const clientCurrent=read('yuushi.client.account',null);
  const withdrawnClients=read('yuushi.client.withdrawnAccounts',[]);
  const agencyPrimary=read('yuushi.agency.primaryAccount',null);
  const agencyDirectory=read('yuushi.admin.agencyDirectory',[]);
  const accounts=uniqueBy([
    ...(clientCurrent?[{...clientCurrent,type:'Client',registeredAt:clientCurrent.registeredAt||clientCurrent.createdAt||null,withdrawnAt:clientCurrent.withdrawnAt||null}]:[]),
    ...withdrawnClients.map(a=>({...a,type:'Client',registeredAt:a.registeredAt||a.createdAt||null,withdrawnAt:a.withdrawnAt||a.deletedAt||null})),
    ...agencyDirectory.map(a=>({...a,type:'Agency',name:a.name||a.company||a.id,registeredAt:a.registeredAt||a.createdAt||null})),
    ...(agencyPrimary?[{...agencyPrimary,type:'Agency',name:agencyPrimary.name||agencyPrimary.company||agencyPrimary.id,registeredAt:agencyPrimary.registeredAt||agencyPrimary.createdAt||null,withdrawnAt:agencyPrimary.withdrawnAt||null}]:[])
  ],a=>a.id||a.customerId||a.agencyId);
  const agencies=accounts.filter(a=>a.type==='Agency');
  const agents=agencies;

  const transactions=read('yuushi.transactionVerificationRecords',[]);
  const enquiries=read('yuushi.agencyEnquiryAssignments',[]);
  const reportsObject=read('yuushi.c07.propertyReports',{});
  const reports=Array.isArray(reportsObject)?reportsObject:Object.values(reportsObject||{});

  // Monetization Admin is the prototype operational source for plans, ad bookings
  // and payment transactions. Overview must not maintain a second hard-coded catalog.
  const commerce=read('yuushi-cms-v1',{plans:[],features:[],addons:[],slots:[],bookings:[],transactions:[]});
  const plans=(commerce.plans||[]).filter(p=>p.status!=='Retired');
  const prices=Object.fromEntries(plans.map(p=>[p.name,Number(p.price)||0]));
  const adTypes=[...new Set((commerce.slots||[]).map(s=>String(s.product??'')).filter(Boolean))];
  const options=(commerce.addons||[]).map(a=>a.name).filter(Boolean);
  const subscriptions=read('yuushi.subscriptionRecords',[]);
  const campaigns=Array.isArray(commerce.bookings)?commerce.bookings:[];
  const commerceTransactions=Array.isArray(commerce.transactions)?commerce.transactions:[];
  const appraisalDeliveries=read('yuushi.appraisalDeliveries',[]);
  const propertySnapshots=read('yuushi.analytics.propertySnapshots',[]);
  const properties=uniqueBy(propertySnapshots,'id');

  const evtDate=e=>(e.occurredAt||e.createdAt||'').slice(0,10);
  const member=e=>['Customer','Agency'].includes(e.accountType);
  const businessEvents=events.filter(e=>['Customer','Agency','Guest'].includes(e.accountType)&&e.portal!=='Admin'&&e.portal!=='Supportal');
  const facts=businessEvents.map(e=>{
    const base={date:evtDate(e),propertyId:e.propertyId||null,agencyId:e.agencyId||null,agentId:e.agencyId||null,member:member(e),country:e.country||'',device:e.deviceType||'',language:e.language||'',channel:e.channel||'',section:e.page||'',exitSection:e.exitPage||'',placement:e.placement||'',adType:e.adType||'',option:e.option||'',campaign:e.campaign||'',hour:e.occurredAt?new Date(e.occurredAt).getHours():0,
      impressions:0,views:0,clicks:0,saves:0,inquiries:0,deals:0,verifiedClosings:0,searches:0,sessions:0,bounced:0,sessionSeconds:0,listingSeconds:0,pageViews:0,registrations:0,
      subscription:0,banner:0,sponsored:0,featured:0,appraisal:0,optionRevenue:0,purchases:0,messagesUser:0,messagesAgent:0,chats:0,replied:0,received:0,responseMinutes:0,appraisalRequests:0,appraisalSent:0,sent:0,read:0,marketingClicks:0,marketingCV:0,blocked:0};
    if(e.type==='property_card_rendered')base.impressions=1;
    if(e.type==='property_card_viewed')base.views=1;
    if(e.type==='property_card_clicked')base.clicks=1;
    if(e.type==='property_saved')base.saves=1;
    if(e.type==='inquiry_created')base.inquiries=1;
    if(e.type==='search_submitted')base.searches=1;
    if(e.type==='page_view')base.pageViews=1;
    if(e.type==='session_started')base.sessions=1;
    if(e.type==='account_registered')base.registrations=1;
    if(e.type==='ad_rendered'){base.adImpressions=1;}
    if(e.type==='ad_viewed'){base.adViews=1;}
    if(e.type==='ad_clicked'){base.adClicks=1;}
    return base;
  }).filter(r=>r.date);

  for(const t of transactions){
    const date=(t.soldDate||t.updatedAt||'').slice(0,10);if(!date)continue;
    facts.push({date,propertyId:t.propertyId||null,agencyId:t.agencyId||null,agentId:t.agencyId||null,member:true,country:'',device:'',language:'',channel:'',section:'Transaction',exitSection:'',placement:'',adType:'',option:'',campaign:'',hour:0,
      impressions:0,views:0,clicks:0,saves:0,inquiries:0,deals:1,verifiedClosings:0,searches:0,sessions:0,bounced:0,sessionSeconds:0,listingSeconds:0,pageViews:0,registrations:0,
      subscription:0,banner:0,sponsored:0,featured:0,appraisal:0,optionRevenue:0,purchases:0,messagesUser:0,messagesAgent:0,chats:0,replied:0,received:0,responseMinutes:0,appraisalRequests:0,appraisalSent:0,sent:0,read:0,marketingClicks:0,marketingCV:0,blocked:0,
      transactionId:t.transactionId,transactionSource:t.transactionSource,verificationStatus:t.verificationStatus});
  }

  const chats=enquiries.map(q=>({
    id:q.conversationId||q.id,date:(q.createdAt||q.lastOpenedAt||'').slice(0,10),propertyId:q.propertyId||null,customerId:q.customerId||q.clientId||null,agencyId:q.agencyId||null,agentId:q.agencyId||null,country:q.country||'',
    messages:(q.msgs||q.messages||[]).map(m=>({sender:/client|customer|them/i.test(m.sender)?'Client':'Agency',sentAt:m.sentAt||m.time||q.createdAt||null,businessHours:m.businessHours}))
  }));

  const sessionStarts=businessEvents.filter(e=>e.type==='session_started');
  const sessionEnds=businessEvents.filter(e=>e.type==='session_ended');
  const accountSessions=sessionStarts.map(s=>{
    const end=sessionEnds.find(e=>e.sessionId===s.sessionId&&e.occurredAt>=s.occurredAt);
    return {accountId:s.accountId,date:evtDate(s),seconds:end?Math.max(0,(Date.parse(end.occurredAt)-Date.parse(s.occurredAt))/1000):null};
  });
  // Account activity is derived from canonical session events, not a dashboard-only login seed.
  const sessionsByAccount=new Map();
  accountSessions.forEach(s=>{if(!s.accountId||!s.date)return;const dates=sessionsByAccount.get(s.accountId)||[];if(!dates.includes(s.date))dates.push(s.date);sessionsByAccount.set(s.accountId,dates);});
  accounts.forEach(a=>{a.logins=(sessionsByAccount.get(a.id||a.customerId||a.agencyId)||[]).sort();});
  const guestMap=new Map();
  businessEvents.filter(e=>e.accountType==='Guest').forEach(e=>{
    const id=e.anonymousVisitorId;if(!id)return;
    const row=guestMap.get(id)||{id,prefecture:e.prefecture||'',city:e.city||'',visits:[]};
    const d=evtDate(e);if(d&&!row.visits.includes(d))row.visits.push(d);guestMap.set(id,row);
  });
  const guests=[...guestMap.values()];

  const adminChats=read('yuushi.adminSupportThreads',[]);
  const fraudFlags=read('yuushi.admin.fraudFlags',[]);
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
    reports,transactions,campaigns,commerceTransactions,succeededPayments,appraisalDeliveries,analyticsEvents:events,places,groups,structures,countries,plans,prices,adTypes,options,
    telemetry,metricStatus:A.overviewMetricStatus
  };
  const utilities={DAY,dayKey,addDays,hash:value=>{let n=2166136261;for(const char of String(value))n=Math.imul(n^char.charCodeAt(0),16777619);return n>>>0;}};
  root.OverviewDemo={data,utilities};
})(typeof window!=='undefined'?window:globalThis);
