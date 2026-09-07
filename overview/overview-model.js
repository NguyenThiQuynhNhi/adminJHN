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
    return accounts.filter(a=>a.type==='Customer'&&a.registeredAt<=at&&(!a.withdrawnAt||a.withdrawnAt>at)).filter(a=> {
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
  function filteredAccounts(f,type) {return D.accounts.filter(a=>(!type||a.type===type)&&a.registeredAt<=f.end&&(!f.prefectures?.length||f.prefectures.includes(a.prefecture))&&(!f.cities?.length||f.cities.includes(a.city)));}
  function groupBy(rows,key,calculate) { const groups=new Map();rows.forEach(row=> {const label=typeof key==='function'?key(row):row[key];if(!groups.has(label))groups.set(label,[]);groups.get(label).push(row);});return [...groups].map(([label,items])=>({label,...calculate(items)})); }
  function periodKey(date,unit) {
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
  const currencyKeys=new Set(['subscription','banner','sponsored','featured','appraisal','optionRevenue','revenue','price','closingPrice','perSqm','cpa','budget']);
  const percentKeys=new Set(['ctr','cvr','utilization','responseRate','readRate','clickRate','registrationCvr','rate']);
  function result(rows,keys,kind='bar',note='') {return {rows,columns:keys.map(key=>({key,label:labels[key]||key,unit:currencyKeys.has(key)?'JPY':percentKeys.has(key)?'%':''})),kind,note};}
  function aggregate(rows,key,fields,kind='bar',note='') {return result(groupBy(rows,key,items=>Object.fromEntries(fields.map(field=>[field,sum(items,field)]))),fields,kind,note);}
  function metric(spec,f) {
    const id=spec.id,rows=filteredFacts(f),properties=D.properties.filter(p=>matchesProperty(p,f)),users=filteredAccounts(f,'Customer'),agents=filteredAccounts(f,'Agent');
    const timeline=(fields,kind='line')=>aggregate(rows,r=>periodKey(r.date,f.unit),fields,kind);
    const byProperty=(key,fields)=>aggregate(rows,r=>propertyById.get(r.propertyId)[key],fields);
    const perfs=(key,kind='bar')=>result(groupBy(rows,key,performance),['impressions','clicks','saves','inquiries','deals','ctr','cvr'],kind);
    const accountTrend=(pool,cumulative=false)=>result(buckets(f.start,f.end,f.unit).map(b=>({label:b.label,count:pool.filter(a=>cumulative?a.registeredAt<=b.end:inPeriod(a.registeredAt,b.start,b.end)).length})),['count'],'line');
    const activeTrend=pool=>result(buckets(f.start,f.end,f.unit).map(b=>({label:b.label,dau:activity(pool,b.end,1),wau:activity(pool,b.end,7),mau:activity(pool,b.end,30)})),['dau','wau','mau'],'line','Unique accounts with a login in the trailing 1 / 7 / 30 days at each observation date.');
    const prices=(dimension='subtype',closing=false)=> {
      const grouped=groupBy(rows,r=>periodKey(r.date,f.unit)+' · '+propertyById.get(r.propertyId)[dimension],items=> {
        const ps=[...new Set(items.map(r=>r.propertyId))].map(id=>propertyById.get(id));
        return {price:average(ps,'price'),closingPrice:average(ps,'closingPrice'),perSqm:ps.length?ps.reduce((n,p)=>n+p.price/p.floorArea,0)/ps.length:0};
      });
      return result(grouped,closing&&f.transaction==='For Sale'?['price','closingPrice','perSqm']:['price','perSqm'],'line',f.transaction==='For Rent'?'Monthly rent (JPY); unit price is JPY/m²/month.':f.transaction==='New Development'?'New-development unit price (JPY).':'Sale price (JPY). Select a transaction type to avoid mixing price units.');
    };
    if(['r28'].includes(id))return timeline(['subscription','banner','sponsored','featured','appraisal','optionRevenue'],'stacked');
    if(id==='r29')return result(buckets(U.addDays(D.today,-29),D.today,'Daily').map(b=>({label:b.label,registrations:D.accounts.filter(a=>a.registeredAt===b.end).length,customers:activity(D.accounts.filter(a=>a.type==='Customer'),b.end,1),agents:activity(D.agents,b.end,1)})),['registrations','customers','agents'],'line');
    if(id==='r30'||id==='r31'||id==='r91')return result(buckets(f.start,f.end,f.unit).flatMap(b=>groupBy(properties.filter(p=>p.createdAt<=b.end&&(!p.endedAt||p.endedAt>b.end)),id==='r31'?'city':'subtype',items=>({count:items.length})).map(r=>({...r,label:b.label+' · '+r.label}))),['count'],'line');
    if(id==='r32')return timeline(['inquiries','deals'],'bar');
    if(id==='r35')return aggregate(rows,'section',['pageViews']);
    if(id==='r36')return aggregate(rows,'section',['sessions'],'line','Distinct session identities in the section, represented by aggregated demo session counts.');
    if(id==='r37'||id==='r38')return result(groupBy(rows,'section',r=>({...performance(r),registrations:sum(r,'registrations'),conversions:sum(r,'registrations')+sum(r,'inquiries'),conversionRate:ratio(sum(r,'registrations')+sum(r,'inquiries'),sum(r,'clicks'))})),id==='r37'?['impressions','clicks','ctr']:['registrations','inquiries','conversions','conversionRate']);
    if(id==='r39'||id==='r40')return result(groupBy(rows,'section',r=>({seconds:sum(r,'sessions')?sum(r,'sessionSeconds')/sum(r,'sessions'):0,rate:ratio(sum(r,'bounced'),sum(r,'sessions'))})),[id==='r39'?'seconds':'rate']);
    if(id==='r42'||id==='r43'||id==='r69')return accountTrend(id==='r69'?agents:users,id==='r43');
    if(id==='r44'||id==='r70')return activeTrend(id==='r70'?agents:users);
    if(id==='r45')return result(groupBy(rows,r=>periodKey(r.date,f.unit)+' · '+(r.member?'Members':'Non-Members'),r=>({seconds:sum(r,'sessions')?sum(r,'sessionSeconds')/sum(r,'sessions'):0,listingSeconds:sum(r,'clicks')?sum(r,'sessionSeconds')/sum(r,'clicks'):0})),['seconds','listingSeconds'],'line');
    if(id==='r46')return result(groupBy(users,'country',r=>({count:r.length})),['count'],'donut','Nationality / residence distribution of registered customers.');
    if(id==='r47')return result(groupBy(rows,r=>r.member?'Members':'Non-Members',r=>({sessions:sum(r,'sessions'),registrations:sum(r,'registrations'),registrationCvr:ratio(sum(r,'registrations'),sum(r,'sessions')),...performance(r),seconds:sum(r,'sessionSeconds')/Math.max(1,sum(r,'sessions')),propertiesViewed:sum(r,'clicks')/Math.max(1,sum(r,'sessions')),bounceRate:ratio(sum(r,'bounced'),sum(r,'sessions'))})),['sessions','registrations','registrationCvr','impressions','clicks','saves','inquiries','deals','seconds','propertiesViewed','bounceRate'],'bar','Members and non-members are compared side by side. Guest identities are cookie/session-based and can include repeat individuals.');
    if(id==='r48')return result(groupBy(users,a=>a.age+' · '+a.gender,r=>({count:r.length})),['count'],'stacked');
    if(id==='r49')return aggregate(rows,r=>r.language+' · '+r.device,['sessions'],'donut');
    if(id==='r50')return aggregate(rows,'channel',['registrations'],'donut');
    if(id==='r51')return aggregate(rows,'country',['sessions'],'world');
    if(id==='r52')return timeline(['searches','clicks','saves','inquiries']);
    if(id==='r53')return byProperty(f.breakdown||'subtype',['searches']);
    if(id==='r54')return timeline(['sessions','clicks','saves','inquiries','deals']);
    if(id==='r55')return result(buckets(f.start,f.end,f.unit).map(b=>({label:b.label,count:inactiveCount(users,b.end)})),['count'],'line','Current stock of accounts without login for at least 90 days; withdrawn accounts excluded.');
    if(id==='r56')return result(Array.from({length:12},(_,i)=>{const start=shiftMonth(monthStart(D.today),i-11),end=i===11?D.today:U.addDays(shiftMonth(start,1),-1);return {label:start.slice(0,7),...withdrawalStats(users,start,end)};}),['withdrawals','newlyInactive'],'line','Past 12 months. Current month is provisional (1st through today); completed months are finalized. Each series counts unique customers separately.');
    if(id==='r57')return timeline(['chats','messagesUser','messagesAgent']);
    if(id==='r58')return aggregate(rows,'country',['messagesUser'],'bar','End-user message total by country; per-user average uses registered customer count in each country.');
    if(id==='r59')return aggregate(rows,'agentId',['messagesAgent']);
    if(id==='r60')return result(groupBy(rows,r=>r.businessHours?'Japan business hours (09:00–18:00)':'Outside Japan business hours',r=>({responseMinutes:average(r,'responseMinutes')})),['responseMinutes']);
    if(id==='r71'||id==='r81')return result(groupBy(agents,'plan',r=>({count:r.length,revenue:r.reduce((n,a)=>n+D.prices[a.plan],0)})),id==='r71'?['count']:['count','revenue'],'donut');
    if(id==='r72'||id==='r110')return result(groupBy(agents,'plan',items=> {const live=properties.filter(p=>items.some(a=>a.id===p.agentId)&&(!p.endedAt||p.endedAt>f.end));return {live:live.length,slots:sum(items,'slots'),utilization:ratio(live.length,sum(items,'slots')),atCapacity:items.filter(a=>live.filter(p=>p.agentId===a.id).length>=a.slots).length};}),id==='r72'?['atCapacity','utilization','live','slots']:['utilization','live','slots'],'bar');
    if(id==='r73')return result([1,2,3].map(n=>({label:n+'+ ad products',count:agents.filter(a=>a.adProducts.length>=n).length,rate:ratio(agents.filter(a=>a.adProducts.length>=n).length,agents.length)})),['rate','count']);
    if(id==='r74')return result(groupBy(rows,'agentId',r=>({revenue:r.reduce((n,x)=>n+x.banner+x.sponsored+x.featured+x.appraisal,0)})),['revenue'],'bar');
    if(id==='r75')return result(D.adTypes.map(type=>({label:type,count:agents.filter(a=>a.adProducts.includes(type)).length,rate:ratio(agents.filter(a=>a.adProducts.includes(type)).length,agents.filter(a=>a.adProducts.length).length)})),['count','rate'],'donut','Agents may use more than one ad type; shares need not total 100%.');
    if(id==='r76')return result(groupBy(rows.filter(r=>r.purchases),'option',r=>({purchasers:distinct(r,'agentId'),purchases:sum(r,'purchases'),revenue:sum(r,'optionRevenue')})),['purchasers','purchases','revenue'],'stacked');
    if(id==='r77')return result(groupBy(agents,a=>{const count=properties.filter(p=>p.agentId===a.id&&(!p.endedAt||p.endedAt>f.end)).length;return count===0?'0':count<=5?'1–5':count<=10?'6–10':'11+';},r=>({count:r.length})),['count'],'bar');
    if(id==='r78')return result(groupBy(rows,'agentId',r=>({responseRate:ratio(sum(r,'replied'),sum(r,'received')),responseMinutes:average(r,'responseMinutes')})),['responseRate','responseMinutes'],'scatter');
    if(id==='r79'||id==='r100')return timeline(['deals'],'bar');
    if(id==='r80')return result(agents.map(a=>{const ar=rows.filter(r=>r.agentId===a.id);return {label:a.name,listings:properties.filter(p=>p.agentId===a.id&&!p.endedAt).length,deals:sum(ar,'deals'),adSpend:ar.reduce((n,r)=>n+r.banner+r.sponsored+r.featured+r.appraisal,0),totalPayments:ar.reduce((n,r)=>n+amount(r),0),rating:a.rating};}),['listings','deals','adSpend','totalPayments','rating'],'table');
    if(id==='r82'||id==='r84')return byProperty(f.breakdown||'prefecture',[id==='r82'?'appraisalRequests':'appraisalSent']);
    if(id==='r83')return result(groupBy(agents.filter(a=>a.appraisalRegistered),'prefecture',r=>({count:r.length})),['count'],'donut');
    if(id==='r92')return result(groupBy(properties,p=>p.prefecture+' · '+p.city,r=>({count:r.filter(p=>!p.endedAt||p.endedAt>f.end).length})),['count'],'heatmap');
    if(id==='r93')return result(groupBy(properties,p=>p.transaction==='For Rent'?(p.price<150000?'Rent < ¥150k':p.price<300000?'Rent ¥150k–300k':'Rent ¥300k+'):(p.price<50000000?'Price < ¥50M':p.price<100000000?'Price ¥50M–100M':'Price ¥100M+'),r=>({count:r.length})),['count']);
    if(['r94','r95','r96','r98'].includes(id))return timeline([{r94:'impressions',r95:'clicks',r96:'saves',r98:'inquiries'}[id]]);
    if(id==='r97'||id==='r99')return result(groupBy(rows,r=>periodKey(r.date,f.unit),performance),[id==='r97'?'ctr':'cvr'],'line','Calculated from total numerator ÷ total denominator, not the mean of individual rates.');
    if(id==='r101')return result(groupBy(properties.filter(p=>p.endedAt&&inPeriod(p.endedAt,f.start,f.end)),'subtype',r=>({days:r.reduce((n,p)=>n+(Date.parse(p.endedAt)-Date.parse(p.createdAt))/U.DAY,0)/r.length})),['days']);
    if(id==='r102')return result(groupBy(properties.filter(p=>p.endedAt&&inPeriod(p.endedAt,f.start,f.end)),'endReason',r=>({count:r.length})),['count'],'donut');
    if(id==='r103'||id==='r104')return prices('subtype',id==='r104');
    if(id==='r105')return prices('age');
    if(['r107','r112','r116'].includes(id))return result(groupBy(rows,r=>periodKey(r.date,f.unit),r=> {const spend=r.reduce((n,x)=>n+(id==='r112'?x.subscription:id==='r116'?x.banner+x.sponsored+x.featured+x.appraisal:amount(x)),0);const cv=sum(r,f.conversion==='Closings'?'verifiedClosings':'inquiries');return {revenue:spend,conversions:cv,cpa:cv?spend/cv:0};}),['cpa','revenue','conversions'],'line','CPA denominator: '+(f.conversion==='Closings'?'verified closings':'inquiries')+'. No conversions are shown as no data rather than an infinite CPA.');
    if(id==='r108'||id==='r109')return result(groupBy(rows,r=>periodKey(r.date,f.unit)+' · '+(id==='r109'?propertyById.get(r.propertyId).prefecture+' · ':'')+agentById.get(r.agentId).plan,r=>({revenue:sum(r,'subscription'),contracts:distinct(r.filter(x=>x.subscription>0),'agentId')})),['revenue','contracts'],'stacked');
    if(id==='r111')return timeline(['sponsored','banner','featured','appraisal'],'stacked');
    if(id==='r113'||id==='r114')return result(groupBy(rows,id==='r113'?'adType':'placement',r=>{const cost=r.reduce((n,x)=>n+x.sponsored+x.banner+x.featured+x.appraisal,0),cv=sum(r,f.conversion==='Closings'?'verifiedClosings':'inquiries');return {revenue:cost,conversions:cv,cpa:cv?cost/cv:0};}),['cpa','revenue','conversions']);
    if(id==='r115')return perfs(r=>periodKey(r.date,f.unit),'line');
    if(id==='r117')return result(groupBy(rows,'agentId',r=>{const spend=r.reduce((n,x)=>n+x.sponsored+x.banner+x.featured+x.appraisal,0),cv=sum(r,f.conversion==='Closings'?'verifiedClosings':'inquiries');return {...performance(r),revenue:spend,cpa:cv?spend/cv:0};}),['impressions','clicks','ctr','inquiries','cvr','cpa','revenue'],'table');
    if(id==='r118')return result(groupBy(rows,r=>propertyById.get(r.propertyId).prefecture,r=>({appraisalRequests:sum(r,'appraisalRequests'),revenue:sum(r,'appraisal'),budget:1000000,utilization:ratio(sum(r,'appraisal'),1000000),blocked:sum(r,'blocked')})),['appraisalRequests','revenue','budget','utilization','blocked'],'heatmap');
    if(id==='r120')return prices('prefecture');
    if(id==='r121')return perfs(r=>propertyById.get(r.propertyId).city+' · '+propertyById.get(r.propertyId).subtype,'heatmap');
    if(id==='r122'||id==='r123')return perfs(r=>{const p=propertyById.get(r.propertyId);return id==='r122'?p.city:p.line+' · '+p.station;},'table');
    if(id==='r124'||id==='r125')return perfs(r=>{const p=propertyById.get(r.propertyId);return id==='r124'?(p.walk<=5?'≤ 5 minutes':p.walk<=10?'6–10 minutes':p.walk<=15?'11–15 minutes':'16+ minutes'):String(p[f.breakdown||'structure']);});
    if(id==='r127')return result(groupBy(rows,r=>propertyById.get(r.propertyId).city,r=>({listings:distinct(r,'propertyId'),searches:sum(r,'searches'),ratio:sum(r,'searches')?distinct(r,'propertyId')/sum(r,'searches'):0})),['listings','searches','ratio'],'heatmap');
    if(id==='r128')return aggregate(rows,r=>r.country+' · '+String(r.hour).padStart(2,'0')+':00',['sessions'],'heatmap');
    if(id==='r130') {const vals=['clicks','saves','inquiries','deals'].map(k=>sum(rows,k));return result(vals.map((count,i)=>({label:['Property views','Saves (Keep)','Inquiries','Deals'][i],count,rate:i?ratio(count,vals[i-1]):100})),['count','rate'],'funnel');}
    if(id==='r137')return result(groupBy(rows,r=>r.member?'In-platform':'Email',r=>({sent:sum(r,'sent'),read:sum(r,'read'),marketingClicks:sum(r,'marketingClicks'),marketingCV:sum(r,'marketingCV'),readRate:ratio(sum(r,'read'),sum(r,'sent')),clickRate:ratio(sum(r,'marketingClicks'),sum(r,'read'))})),['sent','read','marketingClicks','marketingCV','readRate','clickRate'],'funnel');
    throw new Error('Metric renderer is not implemented: '+id);
  }
  root.OverviewModel={sum,ratio,average,distinct,monthStart,shiftMonth,inPeriod,inactivityEvents,withdrawalStats,inactiveCount,errorLogs,fraudCount,paymentBreakdown,matchesProperty,filteredFacts,filteredAccounts,groupBy,buckets,activity,amount,performance,result,metric};
})(typeof window!=='undefined'?window:globalThis);
