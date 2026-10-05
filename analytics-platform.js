/* Canonical platform analytics contract.
   Operational records/events are the source of truth. Dashboard demo code must not invent
   business enums, statuses, reasons or formulas. */
(function(root){
  'use strict';
  const EVENT_KEY='yuushi.analytics.events.v1';
  const TELEMETRY_KEY='yuushi.analytics.mockTelemetry.v1';
  const VISITOR_KEY='yuushi.analytics.anonymousVisitorId';
  const SESSION_KEY='yuushi.analytics.sessionId';

  const masters={
    withdrawalReasons:{
      Customer:[
        ['found_property_elsewhere','Found a property elsewhere'],
        ['completed_transaction','Completed my transaction (purchased/rented through this platform)'],
        ['not_searching','No longer searching / paused my search'],
        ['portal_difficult','Portal too difficult to use'],
        ['dissatisfied_agent_service','Dissatisfied with an agent or the service'],
        ['privacy_data_concerns','Privacy or data concerns'],
        ['duplicate_account','Duplicate account'],
        ['other','Other — please specify']
      ],
      Agency:[
        ['switching_platform','Switching to a different platform'],
        ['subscription_cost_high','Subscription cost too high'],
        ['portal_or_technical_issues','Portal was difficult to use or had technical issues'],
        ['client_communication_tools_insufficient','Tools for communicating with clients were insufficient'],
        ['listing_management_difficult','Listing management was difficult'],
        ['insufficient_leads_roi','Not generating enough leads/ROI'],
        ['duplicate_account','Duplicate account'],
        ['other','Other — please specify']
      ],
      Supportal:[
        ['business_closed_or_paused','My business closed or paused operations'],
        ['insufficient_requests_roi','Not enough client requests/ROI'],
        ['switching_platform','Switching to a different platform'],
        ['subscription_cost_high','Subscription cost too high'],
        ['portal_or_technical_issues','Portal was difficult to use or had technical issues'],
        ['client_communication_tools_insufficient','Tools for communicating with clients were insufficient'],
        ['duplicate_account','Duplicate account'],
        ['other','Other']
      ]
    },
    reportReasons:[
      ['property_already_sold','Property already sold'],
      ['incorrect_information','Incorrect information'],
      ['privacy_copyright_infringement','Privacy/Copyright infringement'],
      ['unauthorized_listing_own_property','Unauthorized listing of own property'],
      ['unauthorized_use_own_images','Unauthorized use of own images'],
      ['other','Other']
    ],
    reportDismissReasons:[
      ['issue_resolved','Issue resolved'],
      ['invalid_report','Invalid report'],
      ['not_enough_evidence','Not enough evidence'],
      ['no_issue_found','No issue found'],
      ['duplicate','Duplicate'],
      ['out_of_scope','Out of scope'],
      ['other','Other']
    ],
    listingEndReasons:[
      ['sold','Sold'],
      ['sold-others','Sold by Others'],
      ['seller-withdrew','Seller Withdrew'],
      ['expired','Listing Expired'],
      ['legal','Legal Hold']
    ]
  };

  const read=(key,fallback=[])=>{try{const v=JSON.parse(localStorage.getItem(key));return v??fallback;}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}return value;};
  const now=()=>new Date().toISOString();
  const uid=prefix=>prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);
  const getVisitorId=()=>{let id;try{id=localStorage.getItem(VISITOR_KEY);}catch{}if(!id){id=uid('anon');try{localStorage.setItem(VISITOR_KEY,id);}catch{}}return id;};
  const getSessionId=()=>{let id;try{id=sessionStorage.getItem(SESSION_KEY);}catch{}if(!id){id=uid('sess');try{sessionStorage.setItem(SESSION_KEY,id);}catch{}}return id;};
  const accountContext=()=>{
    let portal='';try{portal=sessionStorage.getItem('yuushi.activePortal')||'';}catch{}
    if(portal==='client'){
      const client=read('yuushi.client.account',null);
      return client&&!client.deletedAt
        ? {accountId:client.id||client.customerId||null,accountType:'Customer',portal:'Client'}
        : {accountId:null,accountType:'Guest',portal:'Client'};
    }
    if(portal==='agency'){
      const agency=read('yuushi.agency.primaryAccount',null);
      return agency&&!agency.deletedAt
        ? {accountId:agency.id||null,accountType:'Agency',portal:'Agency'}
        : {accountId:null,accountType:'Agency Staff',portal:'Agency'};
    }
    if(portal==='supportal')return {accountId:null,accountType:'Supportal',portal:'Supportal'};
    if(portal==='platform')return {accountId:null,accountType:'Platform Admin',portal:'Admin'};
    return {accountId:null,accountType:'Guest',portal:'Unknown'};
  };

  function emit(type,payload={}){
    if(!type)return null;
    const rows=read(EVENT_KEY,[]);
    const ctx=accountContext();
    const event={
      eventId:uid('evt'),type,occurredAt:now(),sessionId:getSessionId(),
      anonymousVisitorId:getVisitorId(),...ctx,...payload
    };
    rows.push(event);
    // Prototype guard only: keep a bounded local history. Production persistence is backend-owned.
    if(rows.length>10000)rows.splice(0,rows.length-10000);
    write(EVENT_KEY,rows);
    try{root.dispatchEvent(new CustomEvent('yuushi-analytics-event',{detail:event}));}catch{}
    return event;
  }
  const events=(type)=>read(EVENT_KEY,[]).filter(e=>!type||e.type===type);

  const metricRegistry={
    property_standard_impressions:{source_ready:false,source_object:'AnalyticsEvent',required_events:['property_card_rendered'],reason:'Event contract exists, but the current Client listing UI has no stable Property ID producer yet.'},
    property_views:{source_ready:false,source_object:'AnalyticsEvent',required_events:['property_card_viewed'],reason:'Viewport event contract exists, but the current Client listing UI has no stable Property ID producer yet.'},
    property_clicks:{source_ready:false,source_object:'AnalyticsEvent',required_events:['property_card_clicked'],reason:'Click event contract exists, but the current Client listing UI has no stable Property ID producer yet.'},
    property_saves:{source_ready:false,source_object:'AnalyticsEvent',required_events:['property_saved'],reason:'Save event contract exists, but the current Client listing UI has no stable Property ID producer yet.'},
    property_inquiries:{source_ready:true,source_object:'Inquiry',required_events:['inquiry_created'],storage_key:'yuushi.agencyEnquiryAssignments'},
    ad_impressions:{source_ready:false,source_object:'AnalyticsEvent',required_events:['ad_rendered'],reason:'No Client-side paid-ad impression producer is wired yet.'},
    ad_views:{source_ready:false,source_object:'AnalyticsEvent',required_events:['ad_viewed'],reason:'No Client-side paid-ad viewport producer is wired yet.'},
    ad_clicks:{source_ready:false,source_object:'AnalyticsEvent',required_events:['ad_clicked'],reason:'No Client-side paid-ad click producer is wired yet.'},
    withdrawal_trend:{source_ready:true,source_object:'AnalyticsEvent',required_events:['account_status_changed']},
    property_reports_unprocessed:{source_ready:true,source_object:'PropertyReport',storage_key:'yuushi.c07.propertyReports'},
    listing_end_reasons:{source_ready:true,source_object:'Property lifecycle record',required_fields:['suspensionReason','suspensionDate']},
    agency_suspension_reasons:{source_ready:false,reason:'Agency suspension action does not persist a structured suspension reason.'},
    staff_suspension_reasons:{source_ready:false,reason:'Staff suspension action does not persist a structured suspension reason.'},
    listing_trend:{source_ready:false,reason:'Historical property publish/suspend/remove events are not yet persisted consistently.'},
    price_trend:{source_ready:false,reason:'Historical property price-change events are not yet persisted consistently.'},
    appraisal_sent:{source_ready:false,reason:'Requires one persisted appraisal_delivery record per Agency recipient.'},
    verified_sales:{source_ready:false,reason:'Transaction verification/public-sale eligibility is pending JHN confirmation.'},
    public_sales_value:{source_ready:false,reason:'Transaction verification/public-sale eligibility is pending JHN confirmation.'},
    review_eligible_transactions:{source_ready:false,reason:'Transaction verification/review eligibility is pending JHN confirmation.'},
    platform_cpa:{source_ready:false,reason:'Requires YUUSHI marketing/acquisition spend; platform revenue is not an acquisition cost.'},
    session_content_analytics:{source_ready:true,source_object:'AnalyticsEvent',required_events:['page_view','session_started','search_submitted']},
    api_status:{source_ready:'mock',source_object:'Prototype telemetry'},
    db_status:{source_ready:'mock',source_object:'Prototype telemetry'},
    payment_gateway_status:{source_ready:'mock',source_object:'Prototype telemetry'},
    system_issues:{source_ready:'mock',source_object:'Prototype telemetry'},
    avg_session_time:{source_ready:'mock',source_object:'Prototype telemetry'},
    today_revenue:{source_ready:'mock',source_object:'Prototype payment telemetry'},
    mtd_revenue:{source_ready:'mock',source_object:'Prototype payment telemetry'},
    payment_errors:{source_ready:'mock',source_object:'Prototype payment telemetry'}
  };

  const overviewMetricStatus=(id)=>{
    // "ready" means this repository contains an actual producer/store for the metric inputs.
    // A schema alone or a dashboard seed is not sufficient.
    const mock=new Set(['r22','r23','r24','r25','r26','r27']);
    const ready=new Set(['r32','r56','r57','r59','r60','r78','r79','r98','r100','r102']);
    const propertyEngagement=new Set(['r37','r38','r47','r52','r53','r54','r94','r95','r96','r97','r99','r121','r122','r123','r124','r125']);
    const adEvents=new Set(['r113','r114','r115','r116','r117']);
    const pendingVerification=new Set(['r104']);
    const planMaster=new Set(['r71','r72','r73','r74','r75','r76','r81','r107','r108','r109','r110','r111','r112']);
    const historicalEvents=new Set(['r30','r31','r91','r103','r105','r120']);
    const appraisalDelivery=new Set(['r84','r118']);
    const instrumentation=new Set(['r35','r36','r39','r40','r42','r43','r44','r45','r46','r48','r49','r50','r51','r55','r58','r69','r70','r77','r80','r82','r83','r92','r93','r126','r127','r128','r130','r131','r132','r133','r134','r135','r136','r137','r139','r140','r141','r142','r143','r144','r145']);
    if(mock.has(id))return {ready:'mock',note:'Prototype telemetry only; no backend health/payment integration is built in this repository.'};
    if(ready.has(id))return {ready:true,note:'Calculated from an operational shared store and/or a canonical event with a real producer in this prototype.'};
    if(propertyEngagement.has(id))return {ready:false,note:'Requires Customer listing instrumentation with a stable Property ID. Event contracts exist, but the current static Client listing cards do not provide that identity yet.'};
    if(adEvents.has(id))return {ready:false,note:'Requires paid-ad render/view/click producers. Organic Property events must not be reused for Ad metrics.'};
    if(pendingVerification.has(id))return {ready:false,note:'Requires finalized transaction verification/public-sale eligibility before production calculation.'};
    if(planMaster.has(id))return {ready:false,note:'Requires Subscription Plan Master and/or persisted payment/campaign spend records. Dashboard must not hard-code plan prices or limits.'};
    if(historicalEvents.has(id))return {ready:false,note:'Property lifecycle/price events are now emitted prospectively; historical trend remains unavailable until sufficient event history exists.'};
    if(appraisalDelivery.has(id))return {ready:false,note:'Requires one persisted appraisal_delivery record per Agency recipient; the current Appraisal page still uses page-local records.'};
    if(instrumentation.has(id))return {ready:false,note:'Requires an analytics event producer or operational shared store that is not yet wired for this metric.'};
    if(id==='r101')return {ready:true,note:'Uses persisted Property listing start/end dates from the operational Property snapshot store.'};
    return {ready:false,note:'No validated platform data lineage is registered for this metric yet.'};
  };

  const defaultTelemetry={
    api:{status:'Operational',label:'Prototype health check'},
    database:{status:'Operational',label:'Prototype health check'},
    paymentGateway:{status:'Operational',label:'Prototype Stripe health check'},
    systemIssues:{total:0,critical:0,error:0,warning:0},
    avgSessionSeconds:null,
    todayRevenue:null,
    mtdRevenue:null,
    paymentErrors:[]
  };
  function telemetry(){return {...defaultTelemetry,...read(TELEMETRY_KEY,{})};}
  function setMockTelemetry(patch){return write(TELEMETRY_KEY,{...telemetry(),...patch});}

  function emitWithdrawal(accountType,account,reasonCode,reasonLabel,reasonOther=''){
    return emit('account_status_changed',{
      accountId:account?.id||account?.customerId||account?.agencyId||null,
      accountType,oldStatus:account?.status||'Active',newStatus:'Withdrawn',
      withdrawnAt:now(),withdrawalReasonCode:reasonCode,withdrawalReasonLabel:reasonLabel,
      withdrawalReasonOther:reasonCode==='other'?reasonOther:''
    });
  }

  function bindPropertyCards(container=document){
    const seenRendered=new WeakSet(),seenViewed=new WeakSet();
    const renderCard=card=>{
      if(seenRendered.has(card))return;seenRendered.add(card);
      emit('property_card_rendered',{
        propertyId:card.dataset.propertyId||null,agencyId:card.dataset.agencyId||null,
        placement:card.dataset.placement||'organic',paid:false,page:location.pathname
      });
    };
    const observer='IntersectionObserver'in root?new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting||entry.intersectionRatio<0.5||seenViewed.has(entry.target))continue;
        seenViewed.add(entry.target);
        emit('property_card_viewed',{
          propertyId:entry.target.dataset.propertyId||null,agencyId:entry.target.dataset.agencyId||null,
          placement:entry.target.dataset.placement||'organic',paid:false,page:location.pathname
        });
      }
    },{threshold:[0.5]}):null;
    const scan=()=>container.querySelectorAll?.('.ypc-card[data-property-id]').forEach(card=>{renderCard(card);observer?.observe(card);});
    scan();
    const mo='MutationObserver'in root?new MutationObserver(scan):null;mo?.observe(container.documentElement||container,{childList:true,subtree:true});
    container.addEventListener?.('click',e=>{
      const card=e.target.closest?.('.ypc-card[data-property-id]');if(!card)return;
      const base={propertyId:card.dataset.propertyId||null,agencyId:card.dataset.agencyId||null,placement:card.dataset.placement||'organic',paid:false,page:location.pathname};
      if(e.target.closest('.ypc-heart'))emit('property_saved',base);
      else if(!e.target.closest('.ypc-nav'))emit('property_card_clicked',base);
    },true);
  }

  function startPageInstrumentation(){
    const page=location.pathname+location.search;
    let started=false;
    try{started=sessionStorage.getItem('yuushi.analytics.sessionStarted')===getSessionId();}catch{}
    if(!started){
      emit('session_started',{page});
      try{sessionStorage.setItem('yuushi.analytics.sessionStarted',getSessionId());}catch{}
    }
    emit('page_view',{page,referrer:document.referrer||'',deviceType:innerWidth<768?'Mobile':innerWidth<1100?'Tablet':'Desktop',language:navigator.language||''});
    bindPropertyCards(document);
    root.addEventListener('beforeunload',()=>emit('session_ended',{page}),{once:true});
  }

  root.YuushiAnalytics={EVENT_KEY,TELEMETRY_KEY,masters,metricRegistry,overviewMetricStatus,read,write,emit,events,telemetry,setMockTelemetry,emitWithdrawal,bindPropertyCards,startPageInstrumentation,getVisitorId,getSessionId};
})(typeof window!=='undefined'?window:globalThis);
