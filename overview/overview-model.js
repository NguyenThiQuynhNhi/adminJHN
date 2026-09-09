/* Pure calculations used by the dashboard, charts, and report exports. */
(function(root) {
  'use strict';
  const {data:D,utilities:U}=root.OverviewDemo;
  const sum=(rows,key)=>rows.reduce((n,r)=>n+(Number(r[key])||0),0);
  const ratio=(a,b)=>b?a/b*100:0;
  const average=(rows,key)=>rows.length?sum(rows,key)/rows.length:0;
  const distinct=(rows,key)=>new Set(rows.map(r=>r[key])).size;
  const monthStart=date=>date.slice(0,7)+'-01';
  function shiftMonth(date,months) { const d=new Date(date+'T00:00:00Z'); const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+months);const end=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,end));return U.dayKey(d); }
  function inPeriod(date,start,end) {return date>=start&&date<=end;}
  function inactivityEvents(account,asOf=D.today) {
    const anchors=[account.registeredAt,...account.logins].filter(d=>d<=asOf).sort();
    return anchors.flatMap((last,i)=> {
      const threshold=U.addDays(last,90),next=anchors[i+1];
      return threshold<=asOf&&(!next||next>threshold)&&(!account.withdrawnAt||account.withdrawnAt>threshold)?[threshold]:[];
    });
  }
  function withdrawalStats(accounts,start,end) {
    const users=accounts.filter(a=>a.type==='Customer');
    return {withdrawals:users.filter(a=>a.withdrawalReason?.trim()&&a.withdrawnAt&&inPeriod(a.withdrawnAt,start,end)).length,
      newlyInactive:users.filter(a=>inactivityEvents(a,end).some(d=>inPeriod(d,start,end))).length};
  }
  function inactiveCount(accounts,at) {
    return accounts.filter(a=>a.registeredAt<=at&&(!a.withdrawnAt||a.withdrawnAt>at)).filter(a=> {
      const anchor=[a.registeredAt,...a.logins.filter(d=>d<=at)].sort().at(-1);
      return U.addDays(anchor,90)<=at;
    }).length;
  }
  function errorLogs(logs,now=D.now) { return logs.filter(log=>['FATAL','ERROR','WARN'].includes(log.severity)&&log.source!=='frontend'&&log.kind!=='validation'&&Date.parse(log.timestamp)>now-U.DAY&&Date.parse(log.timestamp)<=now); }
  function fraudCount(flags,enabled) {return new Set(flags.filter(f=>f.status==='unhandled'&&enabled[f.alertId]===true).map(f=>f.id)).size;}
  function paymentBreakdown(errors) {
    return ['Card declined','Authentication failure','Card expired','System/network error','Other'].map(category=>({category,count:new Set(errors.filter(e=>e.status==='unresolved'&&(e.category===category||(category==='Other'&&!['Card declined','Authentication failure','Card expired','System/network error'].includes(e.category)))).map(e=>e.id)).size}));
  }
  const propertyById=new Map(D.properties.map(p=>[p.id,p]));
  const agentById=new Map(D.agents.map(a=>[a.id,a]));
  function matchesProperty(p,f) {
    const includes=(key,value)=>!f[key]?.length||f[key].includes(String(value));
    return (!f.transaction||f.transaction==='All'||p.transaction===f.transaction)&&includes('groups',p.group)&&includes('subtypes',p.subtype)&&includes('prefectures',p.prefecture)&&includes('cities',p.city)&&(!f.line||p.line===f.line)&&includes('stations',p.station)&&(!f.walk||p.walk<=Number(f.walk))&&includes('structures',p.structure)&&includes('floorPlans',p.floorPlan)&&(!f.ageMin||p.age>=Number(f.ageMin))&&(!f.ageMax||p.age<=Number(f.ageMax))&&(!f.areaMin||p.floorArea>=Number(f.areaMin))&&(!f.areaMax||p.floorArea<=Number(f.areaMax))&&(!f.priceMin||p.price>=Number(f.priceMin))&&(!f.priceMax||p.price<=Number(f.priceMax));
  }
  function filteredFacts(f) {return D.facts.filter(r=>inPeriod(r.date,f.start,f.end)&&matchesProperty(propertyById.get(r.propertyId),f)&&(f.membership!=='Members'||r.member)&&(f.membership!=='Non-Members'||!r.member));}
  function filteredChats(f) {return f.membership==='Non-Members'?[]:D.chats.filter(r=>inPeriod(r.date,f.start,f.end)&&matchesProperty(propertyById.get(r.propertyId),f));}
  function filteredAccounts(f,type) {return D.accounts.filter(a=>(!type||a.type===type)&&a.registeredAt<=f.end&&(!f.prefectures?.length||f.prefectures.includes(a.prefecture))&&(!f.cities?.length||f.cities.includes(a.city)));}
  function groupBy(rows,key,calculate) { const groups=new Map();rows.forEach(row=> {const label=typeof key==='function'?key(row):row[key];if(!groups.has(label))groups.set(label,[]);groups.get(label).push(row);});return [...groups].map(([label,items])=>({label,...calculate(items)})); }
  function periodKey(date,unit) {
    if(unit==='Custom')return 'Custom period';
    if(unit==='Yearly')return date.slice(0,4);
    if(unit==='Quarterly')return date.slice(0,4)+' Q'+(Math.floor((Number(date.slice(5,7))-1)/3)+1);
    if(unit==='Monthly')return date.slice(0,7);
    if(unit==='Weekly') {const d=new Date(date+'T00:00:00Z');return U.addDays(date,-((d.getUTCDay()+6)%7));}
    return date;
  }
  function buckets(start,end,unit='Monthly') {const values=new Map();for(let d=start;d<=end;d=U.addDays(d,1)){const key=periodKey(d,unit);if(!values.has(key))values.set(key,{label:key,start:d,end:d});else values.get(key).end=d;}return [...values.values()];}
  function activity(accounts,end,days) {const start=U.addDays(end,1-days);return accounts.filter(a=>(!a.withdrawnAt||a.withdrawnAt>end)&&a.logins.some(d=>inPeriod(d,start,end))).length;}
  function amount(r) {return r.subscription+r.banner+r.sponsored+r.featured+r.appraisal+r.optionRevenue;}
  function performance(rows) {return {impressions:sum(rows,'impressions'),clicks:sum(rows,'clicks'),saves:sum(rows,'saves'),inquiries:sum(rows,'inquiries'),deals:sum(rows,'deals'),ctr:ratio(sum(rows,'clicks'),sum(rows,'impressions')),cvr:ratio(sum(rows,'inquiries'),sum(rows,'clicks'))};}
  const labels={impressions:'Impressions (IMP)',clicks:'Clicks (CL)',saves:'Saves (Keep)',inquiries:'Inquiries (CV)',deals:'Deals',ctr:'CTR',cvr:'CVR',sessions:'Sessions',members:'Members',guests:'Non-Members',registrations:'Registrations',subscription:'Subscription',banner:'Sponsored banner',sponsored:'Sponsored listing',featured:'Featured listing',appraisal:'Appraisal referral',optionRevenue:'Add-on / option purchases',revenue:'Revenue',count:'Count',dau:'DAU',wau:'WAU',mau:'MAU',seconds:'Seconds',withdrawals:'Withdrawals',newlyInactive:'Newly inactive users',price:'Average price',closingPrice:'Closing price',perSqm:'Price per m²',cpa:'CPA',utilization:'Utilization',responseRate:'Response rate',responseMinutes:'Response time (minutes)',sent:'Sent',read:'Read / Opened',marketingClicks:'Clicks',marketingCV:'Conversions',readRate:'Read / Open rate',clickRate:'Click-through rate',registrationCvr:'Registration CVR',purchases:'Purchases',purchasers:'Unique purchasers',budget:'Budget cap',blocked:'Blocked requests'};
  Object.assign(labels,{customers:'Customer DAU',agents:'Agent DAU',pageViews:'Page views',searches:'Searches',conversions:'Conversions',conversionRate:'Conversion rate',listingSeconds:'Viewing time per listing (seconds)',propertiesViewed:'Properties viewed per session',bounceRate:'Bounce rate',memberViews:'Member views',guestViews:'Guest views',memberSaves:'Member saves',guestSaves:'Guest saves',memberSearches:'Member searches',guestSearches:'Guest searches',memberInquiries:'Member inquiries',guestInquiries:'Guest inquiries',memberStepRate:'Member step conversion',guestStepRate:'Guest step conversion',chats:'Chats',messagesUser:'End-user messages',messagesAgent:'Agent messages',live:'Published listings',slots:'Listing slots',atCapacity:'Agents at capacity',atCapacityRate:'Agents at capacity (%)',listings:'Listings',adSpend:'Ad spend',totalPayments:'Total payments',rating:'Rating',appraisalRequests:'Appraisal requests',appraisalSent:'Requests sent to agents',days:'Days',contracts:'Contracts',ratio:'Supply / search ratio',total:'Total users',inactive:'Inactive users (90 days)',netGrowth:'Net growth',previousRevenue:'Previous month revenue',mom:'Month-on-month change',guestDau:'Guest DAU',guestWau:'Guest WAU',guestMau:'Guest MAU',memberShare:'Member session share',guestShare:'Guest session share',memberBounces:'Member bounces',guestBounces:'Guest bounces',memberSeconds:'Member session time (seconds)',guestSeconds:'Guest session time (seconds)',memberProperties:'Member properties viewed per session',guestProperties:'Guest properties viewed per session'});
  const currencyKeys=new Set(['subscription','banner','sponsored','featured','appraisal','optionRevenue','revenue','price','closingPrice','perSqm','cpa','budget','adSpend','totalPayments','previousRevenue']);
  const percentKeys=new Set(['ctr','cvr','utilization','responseRate','readRate','clickRate','registrationCvr','rate','conversionRate','bounceRate','atCapacityRate','memberStepRate','guestStepRate','mom','memberShare','guestShare']);
  function result(rows,keys,kind='bar',note='') {return {rows,columns:keys.map(key=>({key,label:labels[key]||key,unit:currencyKeys.has(key)?'JPY':percentKeys.has(key)?'%':''})),kind,note};}
  function aggregate(rows,key,fields,kind='bar',note='') {return result(groupBy(rows,key,items=>Object.fromEntries(fields.map(field=>[field,sum(items,field)]))),fields,kind,note);}
  function series(rows,segment,value,f,note='') {
    const segments=[...new Set(rows.map(segment))].sort();
    const output=result(buckets(f.start,f.end,f.unit).map(b=>{const period=rows.filter(r=>inPeriod(r.date,b.start,b.end));return {label:b.label,...Object.fromEntries(segments.map((s,i)=>['series'+i,sum(period.filter(r=>segment(r)===s),value)]))};}),[], 'line',note);
    output.columns=segments.map((s,i)=>({key:'series'+i,label:s,unit:''}));
    if(!segments.length)output.columns=[{key:'count',label:labels[value]||value,unit:''}];
    return output;
  }
  function metric(spec,f) {
    const id=spec.id,rows=filteredFacts(f),properties=D.properties.filter(p=>matchesProperty(p,f)),users=filteredAccounts(f,'Customer'),agents=filteredAccounts(f,'Agent');
    const timeline=(fields,kind='line')=>aggregate(rows,r=>periodKey(r.date,f.unit),fields,kind);
    const byProperty=(key,fields)=>aggregate(rows,r=>propertyById.get(r.propertyId)[key],fields);
    const perfs=(key,kind='bar')=>result(groupBy(rows,key,performance),['impressions','clicks','saves','inquiries','deals','ctr','cvr'],kind);
    const accountTrend=(pool,cumulative=false)=>result(buckets(f.start,f.end,f.unit).map(b=>({label:b.label,count:pool.filter(a=>cumulative?a.registeredAt<=b.end:inPeriod(a.registeredAt,b.start,b.end)).length})),['count'],'line');
    const activeTrend=pool=>result(buckets(f.start,f.end,f.unit).map(b=>({label:b.label,dau:activity(pool,b.end,1),wau:activity(pool,b.end,7),mau:activity(pool,b.end,30)})),['dau','wau','mau'],'line','Unique accounts with a login in the trailing 1 / 7 / 30 days at each observation date.');
    const prices=(dimension='subtype',closing=false)=> {
      const grouped=groupBy(rows,r=>periodKey(r.date,f.unit)+' · '+(f.transaction==='All'?propertyById.get(r.propertyId).transaction+' · ':'')+propertyById.get(r.propertyId)[dimension],items=> {
        const ps=[...new Set(items.map(r=>r.propertyId))].map(id=>propertyById.get(id));
        return {price:average(ps,'price'),closingPrice:average(ps,'closingPrice'),perSqm:ps.length?ps.reduce((n,p)=>n+p.price/p.floorArea,0)/ps.length:0};
      });
      const output=result(grouped,closing&&f.transaction==='For Sale'?['price','closingPrice','perSqm']:['price','perSqm'],f.transaction==='All'?'table':'line',f.transaction==='All'?'Sale prices, monthly rents and development unit prices are listed separately by transaction type. Select a transaction type for a comparable trend chart.':f.transaction==='For Rent'?'Monthly rent (JPY); unit price is JPY/m²/month.':f.transaction==='New Development'?'New-development unit price (JPY).':'Listing / closing sale prices (JPY).');
      output.columns.forEach(c=>{if(c.key==='perSqm')c.unit=f.transaction==='For Rent'?'JPY/m²/month':'JPY/m²';else if(f.transaction==='For Rent')c.unit='JPY/month';});return output;
    };
    if(['r28'].includes(id))return timeline(['subscription','banner','sponsored','featured','appraisal','optionRevenue'],'stacked');
    if(id==='r29')return result(buckets(U.addDays(D.today,-29),D.today,'Daily').map(b=>({label:b.label,registrations:D.accounts.filter(a=>a.registeredAt===b.end).length,customers:activity(D.accounts.filter(a=>a.type==='Customer'),b.end,1),agents:activity(D.agents,b.end,1)})),['registrations','customers','agents'],'line');
    if(id==='r30'||id==='r31'||id==='r91'){
      const dimension=id==='r31'?'city':'subtype',segments=[...new Set(properties.map(p=>p[dimension]))].sort();
      const output=result(buckets(f.start,f.end,f.unit).map(b=>({label:b.label,...Object.fromEntries(segments.map((s,i)=>['series'+i,properties.filter(p=>p[dimension]===s&&p.createdAt<=b.end&&(!p.endedAt||p.endedAt>b.end)).length]))})),[],'line','Published inventory at the end of each period, by '+(dimension==='city'?'city':'property type')+'.');
      output.columns=segments.length?segments.map((s,i)=>({key:'series'+i,label:s,unit:''})):[{key:'count',label:'Listings',unit:''}];return output;
    }
    if(id==='r32')return timeline(['inquiries','deals'],'bar');
    if(id==='r35')return f.breakdown==='prefecture'||f.breakdown==='city'?aggregate(rows.filter(r=>r.section==='Area Guides'),r=>propertyById.get(r.propertyId)[f.breakdown],['pageViews'],'bar','Area Guide views by '+f.breakdown+'.'):aggregate(rows,'section',['pageViews']);
    if(id==='r36')return series(rows,r=>r.section,'sessions',f,'Daily unique sessions within each section, aggregated to the selected period. A session can visit multiple sections.');
    if(id==='r37'||id==='r38')return result(groupBy(rows,'section',r=>({...performance(r),registrations:sum(r,'registrations'),conversions:sum(r,'registrations')+sum(r,'inquiries'),conversionRate:ratio(sum(r,'registrations')+sum(r,'inquiries'),sum(r,'clicks'))})),id==='r37'?['impressions','clicks','ctr']:['registrations','inquiries','conversions','conversionRate']);
    if(id==='r39'||id==='r40')return result(groupBy(rows,'section',r=>({seconds:sum(r,'sessions')?sum(r,'sessionSeconds')/sum(r,'sessions'):0,rate:ratio(sum(r,'bounced'),sum(r,'sessions'))})),[id==='r39'?'seconds':'rate']);
    if(id==='r42'||id==='r43'||id==='r69')return accountTrend(id==='r69'?agents:users,id==='r43');
    if(id==='r70')return activeTrend(agents);
    if(id==='r44'){
      const pool=D.guests.filter(g=>(!f.prefectures?.length||f.prefectures.includes(g.prefecture))&&(!f.cities?.length||f.cities.includes(g.city)));
      const guestActivity=(end,days)=>pool.filter(g=>g.visits.some(d=>inPeriod(d,U.addDays(end,1-days),end))).length;
      return result(buckets(f.start,f.end,f.unit).map(b=>({label:b.label,dau:activity(users,b.end,1),wau:activity(users,b.end,7),mau:activity(users,b.end,30),guestDau:guestActivity(b.end,1),guestWau:guestActivity(b.end,7),guestMau:guestActivity(b.end,30)})),f.membership==='Members'?['dau','wau','mau']:f.membership==='Non-Members'?['guestDau','guestWau','guestMau']:['dau','wau','mau','guestDau','guestWau','guestMau'],'line','Members use unique login accounts; guests use distinct cookie identities. These identity types are shown separately and can represent the same person.');
    }
    if(id==='r45')return result(groupBy(rows,r=>periodKey(r.date,f.unit)+' · '+(r.member?'Members':'Non-Members'),r=>({seconds:sum(r,'sessions')?sum(r,'sessionSeconds')/sum(r,'sessions'):0,listingSeconds:sum(r,'clicks')?sum(r,'listingSeconds')/sum(r,'clicks'):0})),['seconds','listingSeconds'],'line');
    if(id==='r46')return result(groupBy(users,f.breakdown==='nationality'?'nationality':'country',r=>({count:r.length})),['count'],'donut',f.breakdown==='nationality'?'Customer nationality distribution.':'Customer country of residence distribution.');
    if(id==='r47'&&(!f.breakdown||f.breakdown==='composition'))return result(buckets(f.start,f.end,f.unit).map(b=>{const items=rows.filter(r=>inPeriod(r.date,b.start,b.end)),members=sum(items.filter(r=>r.member),'sessions'),guests=sum(items.filter(r=>!r.member),'sessions');return {label:b.label,members,guests,memberShare:ratio(members,members+guests),guestShare:ratio(guests,members+guests),registrationCvr:ratio(sum(items,'registrations'),members+guests)};}),['members','guests','registrationCvr','memberShare','guestShare'],'combo','Stacked member / guest sessions and registration conversion rate. Guest identities are cookie/session-based and may include repeat individuals.');
    if(id==='r47' && f.breakdown && !['composition','totals'].includes(f.breakdown)) {
      if(f.breakdown==='funnel') {
        const keys=['sessions','clicks','saves','inquiries','deals'];
        return result(keys.map((key,i)=>{const members=rows.filter(r=>r.member),guests=rows.filter(r=>!r.member);return {label:labels[key],members:sum(members,key),guests:sum(guests,key),memberStepRate:i?ratio(sum(members,key),sum(members,keys[i-1])):100,guestStepRate:i?ratio(sum(guests,key),sum(guests,keys[i-1])):100};}),['members','guests','memberStepRate','guestStepRate'],'funnel');
      }
      return result(groupBy(rows,r=>r[f.breakdown]??propertyById.get(r.propertyId)[f.breakdown],items=>{const members=items.filter(r=>r.member),guests=items.filter(r=>!r.member);return {memberViews:sum(members,'pageViews'),guestViews:sum(guests,'pageViews'),memberSaves:sum(members,'saves'),guestSaves:sum(guests,'saves'),memberSearches:sum(members,'searches'),guestSearches:sum(guests,'searches'),memberInquiries:sum(members,'inquiries'),guestInquiries:sum(guests,'inquiries'),memberBounces:sum(members,'bounced'),guestBounces:sum(guests,'bounced'),memberSeconds:sum(members,'sessionSeconds')/Math.max(1,sum(members,'sessions')),guestSeconds:sum(guests,'sessionSeconds')/Math.max(1,sum(guests,'sessions')),memberProperties:sum(members,'clicks')/Math.max(1,sum(members,'sessions')),guestProperties:sum(guests,'clicks')/Math.max(1,sum(guests,'sessions'))};}),['memberViews','guestViews','memberSaves','guestSaves','memberSearches','guestSearches','memberInquiries','guestInquiries','memberBounces','guestBounces','memberSeconds','guestSeconds','memberProperties','guestProperties'],'paired');
    }
    if(id==='r47')return result(groupBy(rows,r=>r.member?'Members':'Non-Members',r=>({sessions:sum(r,'sessions'),registrations:sum(r,'registrations'),registrationCvr:ratio(sum(r,'registrations'),sum(r,'sessions')),...performance(r),seconds:sum(r,'sessionSeconds')/Math.max(1,sum(r,'sessions')),propertiesViewed:sum(r,'clicks')/Math.max(1,sum(r,'sessions')),bounceRate:ratio(sum(r,'bounced'),sum(r,'sessions'))})),['sessions','registrations','registrationCvr','impressions','clicks','saves','inquiries','deals','seconds','propertiesViewed','bounceRate'],'bar','Members and non-members are compared side by side. Guest identities are cookie/session-based and can include repeat individuals.');
    if(id==='r48'){const genders=['Female','Male','Not specified'];const output=result(groupBy(users,'age',items=>Object.fromEntries(genders.map((g,i)=>['gender'+i,items.filter(a=>a.gender===g).length]))),[],'stacked');output.columns=genders.map((g,i)=>({key:'gender'+i,label:g,unit:''}));return output;}
    if(id==='r49')return aggregate(rows,r=>r.language+' · '+r.device,['sessions'],'donut');
    if(id==='r50')return result(groupBy(users.filter(a=>inPeriod(a.registeredAt,f.start,f.end)),'acquisitionChannel',items=>({registrations:items.length})),['registrations'],'donut','Acquisition channel captured at first account registration.');
    if(id==='r51')return aggregate(rows,'country',['sessions'],'world');
    if(id==='r52')return timeline(['searches','clicks','saves','inquiries']);
    if(id==='r53')return series(rows,r=>String(propertyById.get(r.propertyId)[f.breakdown||'subtype']),'searches',f);
    if(id==='r54'){
      const fields=['sessions','clicks','saves','inquiries','deals'];
      const previous=filteredFacts({...f,start:shiftMonth(f.start,-12),end:f.end});
      const output=result(buckets(f.start,f.end,f.unit).map(b=>{const current=rows.filter(r=>inPeriod(r.date,b.start,b.end)),month=previous.filter(r=>inPeriod(r.date,shiftMonth(b.start,-1),shiftMonth(b.end,-1))),year=previous.filter(r=>inPeriod(r.date,shiftMonth(b.start,-12),shiftMonth(b.end,-12)));return {label:b.label,...Object.fromEntries(fields.flatMap(key=>{const value=sum(current,key),pm=sum(month,key),py=sum(year,key);return [[key,value],[key+'Mom',pm?(value-pm)/pm*100:null],[key+'Yoy',py?(value-py)/py*100:null]];}))};}),fields,'line','Counts at each funnel stage with month-on-month and year-on-year changes in View data. Partial periods compare the same date range; missing baselines are shown as —.');
      output.columns.push(...fields.flatMap(key=>[{key:key+'Mom',label:labels[key]+' · MoM',unit:'%'},{key:key+'Yoy',label:labels[key]+' · YoY',unit:'%'}]));return output;
    }
    if(id==='r55')return result(buckets(f.start,f.end,f.unit).map(b=>({label:b.label,count:inactiveCount(users,b.end)})),['count'],'line','Current stock of accounts without login for at least 90 days; withdrawn accounts excluded.');
    if(id==='r56')return result(Array.from({length:12},(_,i)=>{const start=shiftMonth(monthStart(D.today),i-11),end=i===11?D.today:U.addDays(shiftMonth(start,1),-1);return {label:start.slice(0,7),...withdrawalStats(users,start,end)};}),['withdrawals','newlyInactive'],'line','Past 12 months. Current month is provisional (1st through today); completed months are finalized. Each series counts unique customers separately.');
    if(id==='r57')return result(groupBy(filteredChats(f),r=>periodKey(r.date,f.unit),items=>({chats:distinct(items,'id'),messagesUser:sum(items,'messagesUser'),messagesAgent:sum(items,'messagesAgent')})),['chats','messagesUser','messagesAgent'],'line');
    if(id==='r58')return aggregate(filteredChats(f),r=>f.breakdown==='customerId'?r.customerId+' · '+r.country:r.country,['messagesUser'],f.breakdown==='customerId'?'table':'bar','Count of messages sent by registered End Users. Switch between country totals and individual End Users.');
    if(id==='r59')return aggregate(filteredChats(f),'agentId',['messagesAgent']);
    if(id==='r60')return result(groupBy(filteredChats(f),r=>r.businessHours?'Japan business hours (weekdays 09:00–18:00)':'Outside Japan business hours',r=>({responseMinutes:sum(r,'replied')?r.reduce((n,x)=>n+x.responseMinutes*x.replied,0)/sum(r,'replied'):null})),['responseMinutes'],'bar','Time from inquiry to first agent reply, averaged over replied chats. Business hours use weekdays and time of day only.');
    if(id==='r71'||id==='r81')return result(groupBy(agents,'plan',r=>({count:r.length,revenue:r.reduce((n,a)=>n+D.prices[a.plan],0)})),id==='r71'?['count']:['count','revenue'],'donut');
    if(id==='r72'||id==='r110')return result(groupBy(agents,'plan',items=> {const live=properties.filter(p=>p.createdAt<=f.end&&items.some(a=>a.id===p.agentId)&&(!p.endedAt||p.endedAt>f.end)),atCapacity=items.filter(a=>live.filter(p=>p.agentId===a.id).length>=a.slots).length;return {live:live.length,slots:sum(items,'slots'),utilization:ratio(live.length,sum(items,'slots')),atCapacity,atCapacityRate:ratio(atCapacity,items.length)};}),id==='r72'?['atCapacityRate','atCapacity','utilization','live','slots']:['utilization','live','slots'],'bar');
    if(id==='r73')return result([1,2,3].map(n=>({label:n+'+ ad products',count:agents.filter(a=>a.adProducts.length>=n).length,rate:ratio(agents.filter(a=>a.adProducts.length>=n).length,agents.length)})),['rate','count']);
    if(id==='r74')return result(groupBy(rows,r=>f.breakdown==='prefecture'?agentById.get(r.agentId).prefecture:f.breakdown==='subtype'?propertyById.get(r.propertyId).subtype:r.agentId,r=>({revenue:r.reduce((n,x)=>n+x.banner+x.sponsored+x.featured+x.appraisal,0)})),['revenue'],'bar');
    if(id==='r75'){
      const propertyFiltered=(f.transaction&&f.transaction!=='All')||['groups','subtypes','stations','structures','floorPlans'].some(key=>f[key]?.length)||['line','walk','ageMin','ageMax','areaMin','areaMax','priceMin','priceMax'].some(key=>f[key]);
      const pool=agents.filter(a=>!propertyFiltered||properties.some(p=>p.agentId===a.id&&p.createdAt<=f.end));
      return result(D.adTypes.map(type=>({label:type,count:pool.filter(a=>a.adProducts.includes(type)).length,rate:ratio(pool.filter(a=>a.adProducts.includes(type)).length,pool.filter(a=>a.adProducts.length).length)})),['count','rate'],'bar','Share among ad-using agents in the selected account area and property segment. Agents can use multiple ad types; shares need not total 100%.');
    }
    if(id==='r76')return result(groupBy(rows.filter(r=>r.purchases),r=>periodKey(r.date,f.unit)+' · '+r.option,r=>({purchasers:distinct(r,'agentId'),purchases:sum(r,'purchases'),revenue:sum(r,'optionRevenue')})),['purchases','purchasers','revenue'],'stacked','Purchases, unique purchasing agents and revenue per option in each period. Repeat purchases by one agent count once in unique purchasers.');
    if(id==='r77')return result(groupBy(agents,a=>{const count=properties.filter(p=>p.agentId===a.id&&p.createdAt<=f.end&&(!p.endedAt||p.endedAt>f.end)).length;return count===0?'0':count<=5?'1–5':count<=10?'6–10':'11+';},r=>({count:r.length})),['count'],'bar');
    if(id==='r78')return result(groupBy(rows,'agentId',r=>({responseRate:ratio(sum(r,'replied'),sum(r,'received')),responseMinutes:sum(r,'replied')?r.reduce((n,x)=>n+x.responseMinutes*x.replied,0)/sum(r,'replied'):0})),['responseRate','responseMinutes'],'scatter');
    if(id==='r79')return series(rows,r=>agentById.get(r.agentId).name,'deals',f);
    if(id==='r100')return timeline(['deals'],'bar');
    if(id==='r80')return result(agents.map(a=>{const ar=rows.filter(r=>r.agentId===a.id);return {label:a.name,listings:properties.filter(p=>p.agentId===a.id&&p.createdAt<=f.end&&(!p.endedAt||p.endedAt>f.end)).length,deals:sum(ar,'deals'),adSpend:ar.reduce((n,r)=>n+r.banner+r.sponsored+r.featured+r.appraisal,0),totalPayments:ar.reduce((n,r)=>n+amount(r),0),rating:a.rating};}),['listings','deals','adSpend','totalPayments','rating'],'table');
    if(id==='r82'||id==='r84')return byProperty(f.breakdown||'prefecture',[id==='r82'?'appraisalRequests':'appraisalSent']);
    if(id==='r83'){
      const allowed=[...new Set(Object.entries(D.groups).filter(([key,g])=>(!f.transaction||f.transaction==='All'||g.transaction===f.transaction)&&(!f.groups?.length||f.groups.includes(key))).flatMap(([,g])=>g.types))].filter(type=>!f.subtypes?.length||f.subtypes.includes(type));
      const pool=agents.filter(a=>a.appraisalRegistered&&a.appraisalTypes.some(type=>allowed.includes(type)));
      return f.breakdown==='subtype'?result(allowed.map(type=>({label:type,count:pool.filter(a=>a.appraisalTypes.includes(type)).length})),['count'],'bar','Registered appraisal agents by supported property type. An agent can support multiple types.'):result(groupBy(pool,'prefecture',items=>({count:items.length})),['count'],'donut','Registered appraisal agents by area, filtered by supported property types.');
    }
    if(id==='r92')return result(groupBy(properties,p=>p.prefecture+' · '+p.city,r=>({count:r.filter(p=>p.createdAt<=f.end&&(!p.endedAt||p.endedAt>f.end)).length})),['count'],'heatmap');
    if(id==='r93')return result(groupBy(properties,p=>p.transaction==='For Rent'?(p.price<150000?'Rent < ¥150k':p.price<300000?'Rent ¥150k–300k':'Rent ¥300k+'):(p.price<50000000?'Price < ¥50M':p.price<100000000?'Price ¥50M–100M':'Price ¥100M+'),r=>({count:r.length})),['count']);
    if(['r94','r95','r96','r98'].includes(id))return timeline([{r94:'impressions',r95:'clicks',r96:'saves',r98:'inquiries'}[id]]);
    if(id==='r97'||id==='r99')return result(groupBy(rows,r=>periodKey(r.date,f.unit),performance),[id==='r97'?'ctr':'cvr'],'line','Calculated from total numerator ÷ total denominator, not the mean of individual rates.');
    if(id==='r101')return result(groupBy(properties.filter(p=>p.endedAt&&inPeriod(p.endedAt,f.start,f.end)),'subtype',r=>({days:r.reduce((n,p)=>n+(Date.parse(p.endedAt)-Date.parse(p.createdAt))/U.DAY,0)/r.length})),['days']);
    if(id==='r102')return result(groupBy(properties.filter(p=>p.endedAt&&inPeriod(p.endedAt,f.start,f.end)),'endReason',r=>({count:r.length})),['count'],'donut');
    if(id==='r103'||id==='r104')return prices('subtype',id==='r104');
    if(id==='r105')return prices('age');
    if(['r107','r112','r116'].includes(id))return result(groupBy(rows,r=>periodKey(r.date,f.unit),r=> {const spend=r.reduce((n,x)=>n+(id==='r112'?x.subscription:id==='r116'?x.banner+x.sponsored+x.featured+x.appraisal:amount(x)),0);const cv=sum(r,f.conversion==='Closings'?'verifiedClosings':'inquiries');return {revenue:spend,conversions:cv,cpa:cv?spend/cv:null};}),['cpa','revenue','conversions'],'line','CPA denominator: '+(f.conversion==='Closings'?'verified closings':'inquiries')+'. No conversions are shown as no data rather than an infinite CPA.');
    if(id==='r108'||id==='r109')return result(groupBy(rows,r=>periodKey(r.date,f.unit)+' · '+(id==='r109'?propertyById.get(r.propertyId).prefecture+' · ':'')+agentById.get(r.agentId).plan,r=>({revenue:sum(r,'subscription'),contracts:distinct(r.filter(x=>x.subscription>0),'agentId')})),['revenue','contracts'],'stacked');
    if(id==='r111')return timeline(['sponsored','banner','featured','appraisal'],'stacked');
    if(id==='r113'||id==='r114')return result(groupBy(rows,id==='r113'?'adType':'placement',r=>{const cost=r.reduce((n,x)=>n+x.sponsored+x.banner+x.featured+x.appraisal,0),cv=sum(r,f.conversion==='Closings'?'verifiedClosings':'inquiries');return {revenue:cost,conversions:cv,cpa:cv?cost/cv:null};}),['cpa','revenue','conversions']);
    if(id==='r115')return perfs(r=>periodKey(r.date,f.unit),'line');
    if(id==='r117')return result(groupBy(rows,'agentId',r=>{const spend=r.reduce((n,x)=>n+x.sponsored+x.banner+x.featured+x.appraisal,0),cv=sum(r,f.conversion==='Closings'?'verifiedClosings':'inquiries');return {...performance(r),revenue:spend,cpa:cv?spend/cv:null};}),['impressions','clicks','ctr','inquiries','cvr','cpa','revenue'],'table');
    if(id==='r118')return result(groupBy(rows,r=>propertyById.get(r.propertyId).prefecture,r=>({appraisalRequests:sum(r,'appraisalRequests'),revenue:sum(r,'appraisal'),budget:1000000,utilization:ratio(sum(r,'appraisal'),1000000),blocked:sum(r,'blocked')})),['appraisalRequests','revenue','budget','utilization','blocked'],'heatmap');
    if(id==='r120')return prices('prefecture');
    if(id==='r121')return perfs(r=>propertyById.get(r.propertyId).city+' · '+propertyById.get(r.propertyId).subtype,'heatmap');
    if(id==='r122'||id==='r123')return perfs(r=>{const p=propertyById.get(r.propertyId);return id==='r122'?p.city:p.line+' · '+p.station;},'table');
    if(id==='r124'||id==='r125')return perfs(r=>{const p=propertyById.get(r.propertyId);return id==='r124'?(p.walk<=5?'≤ 5 minutes':p.walk<=10?'6–10 minutes':p.walk<=15?'11–15 minutes':'16+ minutes'):String(p[f.breakdown||'structure']);});
    if(id==='r127')return result(buckets(f.start,f.end,f.unit).flatMap(b=>groupBy(properties,p=>p.city+' · '+p.subtype,ps=>{const ids=new Set(ps.map(p=>p.id)),searches=sum(rows.filter(r=>ids.has(r.propertyId)&&inPeriod(r.date,b.start,b.end)),'searches'),listings=ps.filter(p=>p.createdAt<=b.end&&(!p.endedAt||p.endedAt>b.end)).length;return {listings,searches,ratio:searches?listings/searches:null};}).map(r=>({...r,label:b.label+' · '+r.label}))),['listings','searches','ratio'],'heatmap','Published inventory at period-end divided by searches during the period, by city and property type.');
    if(id==='r128')return aggregate(rows,r=>r.country+' · '+String(r.hour).padStart(2,'0')+':00',['sessions'],'heatmap');
    if(id==='r130') {const vals=['clicks','saves','inquiries','deals'].map(k=>sum(rows,k));return result(vals.map((count,i)=>({label:['Property views','Saves (Keep)','Inquiries','Deals'][i],count,rate:i?ratio(count,vals[i-1]):100})),['count','rate'],'funnel');}
    if(id==='r137')return result(groupBy(rows,r=>(f.breakdown==='campaign'?r.campaign+' · ':'')+(r.member?'In-platform':'Email'),r=>({sent:sum(r,'sent'),read:sum(r,'read'),marketingClicks:sum(r,'marketingClicks'),marketingCV:sum(r,'marketingCV'),readRate:ratio(sum(r,'read'),sum(r,'sent')),clickRate:ratio(sum(r,'marketingClicks'),sum(r,'read'))})),['sent','read','marketingClicks','marketingCV','readRate','clickRate'],'funnel');
    throw new Error('Metric renderer is not implemented: '+id);
  }
  root.OverviewModel={sum,ratio,average,distinct,monthStart,shiftMonth,inPeriod,inactivityEvents,withdrawalStats,inactiveCount,errorLogs,fraudCount,paymentBreakdown,matchesProperty,filteredFacts,filteredChats,filteredAccounts,groupBy,buckets,activity,amount,performance,result,metric};
})(typeof window!=='undefined'?window:globalThis);
