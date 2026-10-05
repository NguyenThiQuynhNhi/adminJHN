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
    const client=read('yuushi.client.account',null);
    const agency=read('yuushi.agency.primaryAccount',null);
    if(client&&!client.deletedAt)return {accountId:client.id||client.customerId||null,accountType:'Customer'};
    if(agency&&!agency.deletedAt)return {accountId:agency.id||null,accountType:'Agency'};
    return {accountId:null,accountType:'Guest'};
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
    property_standard_impressions:{source_ready:true,source_object:'AnalyticsEvent',required_events:['property_card_rendered']},
    property_views:{source_ready:true,source_object:'AnalyticsEvent',required_events:['property_card_viewed']},
    property_clicks:{source_ready:true,source_object:'AnalyticsEvent',required_events:['property_card_clicked']},
    property_saves:{source_ready:true,source_object:'AnalyticsEvent',required_events:['property_saved']},
    property_inquiries:{source_ready:true,source_object:'Inquiry',required_events:['inquiry_created'],storage_key:'yuushi.agencyEnquiryAssignments'},
    ad_impressions:{source_ready:true,source_object:'AnalyticsEvent',required_events:['ad_rendered']},
    ad_views:{source_ready:true,source_object:'AnalyticsEvent',required_events:['ad_viewed']},
    ad_clicks:{source_ready:true,source_object:'AnalyticsEvent',required_events:['ad_clicked']},
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
    const mock=new Set(['r22','r23','r24','r25','r26','r27']);
    const ready=new Set([
      'r32','r35','r36','r44','r47','r49','r52','r53','r54','r56','r57','r59','r60',
      'r78','r79','r94','r95','r96','r97','r98','r99','r100','r102','r115'
    ]);
    const pendingVerification=new Set(['r104','r107','r112','r113','r114','r116','r117']);
    const planMaster=new Set(['r71','r72','r73','r74','r75','r76','r81','r108','r109','r110','r111']);
    const historicalEvents=new Set(['r30','r31','r91','r101','r103','r105']);
    const appraisalDelivery=new Set(['r84']);
    const instrumentation=new Set(['r37','r38','r39','r40','r42','r43','r45','r46','r48','r50','r51','r55','r58','r69','r70','r77','r80','r82','r83','r92','r93','r120','r121','r122','r123','r124','r125','r126','r127','r128','r130','r131','r132','r133','r134','r135','r136','r137','r139','r140','r141','r142','r143','r144','r145']);
    if(mock.has(id))return {ready:'mock',note:'Prototype telemetry only; no backend health/payment integration is built in this repository.'};
    if(ready.has(id))return {ready:true,note:'Calculated from operational records and/or canonical analytics events.'};
    if(pendingVerification.has(id))return {ready:false,note:'Requires finalized transaction verification/cost semantics before production calculation.'};
    if(planMaster.has(id))return {ready:false,note:'Requires Subscription Plan Master / payment or campaign records. Dashboard must not hard-code plan prices or limits.'};
    if(historicalEvents.has(id))return {ready:false,note:'Requires persisted historical property lifecycle/price events; current-state records cannot reconstruct this trend.'};
    if(appraisalDelivery.has(id))return {ready:false,note:'Requires one persisted appraisal_delivery record per Agency recipient.'};
    if(instrumentation.has(id))return {ready:false,note:'Requires analytics instrumentation or an operational shared store that is not yet available.'};
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
    emit('session_started',{page:location.pathname+location.search});
    emit('page_view',{page:location.pathname+location.search,referrer:document.referrer||'',deviceType:innerWidth<768?'Mobile':innerWidth<1100?'Tablet':'Desktop',language:navigator.language||''});
    bindPropertyCards(document);
    root.addEventListener('beforeunload',()=>emit('session_ended',{page:location.pathname+location.search}),{once:true});
  }

  root.YuushiAnalytics={EVENT_KEY,TELEMETRY_KEY,masters,metricRegistry,overviewMetricStatus,read,write,emit,events,telemetry,setMockTelemetry,emitWithdrawal,bindPropertyCards,startPageInstrumentation,getVisitorId,getSessionId};
})(typeof window!=='undefined'?window:globalThis);
