/* Deterministic demonstration data. No live payment, log, or analytics connection. */
(function(root) {
  'use strict';
  const DAY=86400000;
  const dayKey=date=>new Date(date).toISOString().slice(0,10);
  const addDays=(date,days)=>dayKey(Date.parse(date+'T00:00:00Z')+days*DAY);
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const now=Date.now();
  const hash=value=>{let n=2166136261;for(const char of String(value))n=Math.imul(n^char.charCodeAt(0),16777619);return n>>>0;};
  const places=[['Tokyo','Shibuya','Yamanote','Shibuya'],['Tokyo','Shinjuku','Chuo','Shinjuku'],['Osaka','Kita','Osaka Loop','Osaka'],['Fukuoka','Hakata','Kuko','Hakata'],['Kanagawa','Yokohama','Tokaido','Yokohama'],['Hokkaido','Sapporo','Hakodate','Sapporo']];
  const groups={
    '1':{label:'Group 1 · Single Unit',transaction:'For Sale',types:['Apartment','Tower Mansion','Retail Unit','Office Unit','Factory & Warehouse Unit','Resort Apartment & Condo Hotel Unit']},
    '2':{label:'Group 2 · Whole Building',transaction:'For Sale',types:['Whole Apartment Building','Whole Office Building','Hotel']},
    '3':{label:'Group 3 · Land',transaction:'For Sale',types:['Residential Land','Commercial Land','Other Land']},
    '4':{label:'Group 4 · Rental Properties',transaction:'For Rent',types:['Apartment','House','Office Unit']},
    '5':{label:'Group 5 · New Development Apartments',transaction:'New Development',types:['New Apartment','New Tower Mansion']},
    '6':{label:'Group 6 · New Development Houses',transaction:'New Development',types:['New House']}
  };
  const structures=['SRC','RC','Steel','Lightweight Steel','Wooden','Other'];
  const countries=['Japan','Hong Kong','Singapore','United States','Australia','United Kingdom'];
  const plans=['Free','Bronze','Silver','Gold'];
  const prices={Free:0,Bronze:15000,Silver:30000,Gold:60000};
  const adTypes=['Sponsored','Banner','Featured listing','Appraisal referral'];
  const options=['CRM Boost Package','Profile Enhancement Basic','Profile Enhancement Standard','Profile Enhancement Premium','Additional Listing Slots','Multi-user Account'];
  const accounts=Array.from({length:330},(_,i)=> {
    const agent=i>=300;const registeredAt=addDays(today,-(35+hash('reg'+i)%690));
    const location=places[i%places.length];const logins=[];
    let date=addDays(registeredAt,1);
    while(date<=today) {logins.push(date); date=addDays(date, i%11===0?105:2+hash('login'+i+date)%18);}
    if(i%7===0) while(logins.length && logins.at(-1)>addDays(today,-(90+hash(i)%110)))logins.pop();
    const withdrawnAt=!agent&&i%17===0?addDays(today,-(hash('withdraw'+i)%350)):null;
    const last=withdrawnAt?logins.filter(d=>d<withdrawnAt):logins;
    return {id:(agent?'AG-':'CU-')+String(i+1).padStart(4,'0'),type:agent?'Agent':'Customer',name:agent?'Agency '+(i-299):'Customer '+(i+1),registeredAt,logins:last,withdrawnAt,withdrawalReason:withdrawnAt?['No longer needed','Moved away','Other'][i%3]:'',prefecture:location[0],city:location[1],country:countries[i%6],language:['Japanese','English','Chinese'][i%3],gender:['Female','Male','Not specified'][i%3],age:['18–24','25–34','35–44','45–54','55+'][i%5],plan:agent?plans[i%4]:'Member',rating:Math.round((3.6+(i%14)/10)*10)/10,slots:agent?[3,10,25,50][i%4]:0,adProducts:agent?adTypes.slice(0,i%5):[],appraisalRegistered:agent&&i%3!==0};
  });
  const agents=accounts.filter(a=>a.type==='Agent');
  const properties=Array.from({length:48},(_,i)=> {
    const group=String(i%6+1),g=groups[group],place=places[Math.floor(i/6)%6];
    const floorArea=35+hash('area'+i)%260;
    const price=g.transaction==='For Rent'?80000+hash(i)%420000:15000000+hash(i)%160000000;
    return {id:'PR-'+(i+1),agentId:agents[i%agents.length].id,group,transaction:g.transaction,subtype:g.types[Math.floor(i/6)%g.types.length],prefecture:place[0],city:place[1],line:place[2],station:place[3],walk:[3,8,13,20][i%4],structure:structures[Math.floor(i/3)%6],floorPlan:['Studio','1LDK','2LDK','3LDK','4LDK+'][i%5],age:hash('age'+i)%45,floorArea,price,closingPrice:Math.round(price*.96),createdAt:addDays(today,-(150+hash(i)%450)),endedAt:i%9===0?addDays(today,-(hash('end'+i)%90)):null,endReason:['YUUSHI deal','Sold on other channel','Seller took off market'][Math.floor(i/9)%3]};
  });
  const facts=[];
  for(let offset=0;offset<400;offset++) {
    const date=addDays(today,-offset);
    properties.forEach((p,i)=>[true,false].forEach(member=> {
      const n=hash(date+p.id+member);const impressions=30+n%300,clicks=2+n%24,saves=n%8,inquiries=n%5,deals=inquiries>1&&n%19===0?1:0;
      facts.push({date,propertyId:p.id,agentId:p.agentId,member,country:countries[(n>>>4)%6],device:['Desktop','Mobile','Tablet'][n%3],language:['Japanese','English','Chinese'][n%3],channel:['Organic search','Paid search','Direct','Social','Referral'][n%5],section:['Homepage','Property Search Results','Property Detail','Area Guides','Article Content','Company Info','Terms & FAQ'][n%7],placement:['Homepage','Search results','Property detail','Area guide'][n%4],adType:adTypes[n%4],option:options[n%6],hour:n%24,impressions,clicks,saves,inquiries,deals,verifiedClosings:deals&&n%2===0?1:0,searches:clicks+3,sessions:8+n%28,bounced:n%5,sessionSeconds:(8+n%28)*(90+n%300),pageViews:impressions,registrations:!member&&n%31===0?1:0,subscription:member&&i%3===0?300+n%1200:0,banner:n%4===0?100+n%300:0,sponsored:n%4===1?150+n%500:0,featured:n%4===2?120+n%250:0,appraisal:n%4===3?100+n%200:0,optionRevenue:n%7===0?80+n%300:0,purchases:n%7===0?1:0,messagesUser:n%7,messagesAgent:n%5,chats:n%3,replied:n%3,received:3+n%4,responseMinutes:10+n%240,businessHours:n%24>=9&&n%24<18,appraisalRequests:n%13===0?1:0,appraisalSent:n%13===0?2:0,sent:10+n%25,read:5+n%5,marketingClicks:n%5,marketingCV:n%2,blocked:n%41===0?1:0});
    }));
  }
  const fraudFlags=Array.from({length:20},(_,i)=>({id:'FLAG-'+(i+1),alertId:'alert-'+[1,2,3,4,6,13,5,7,10,12][i%10],status:i%4===0?'handled':'unhandled',account:accounts[i*7].id,detectedAt:new Date(now-i*3600000).toISOString()}));
  const paymentErrors=['Card declined','Authentication failure','Card expired','System/network error','Other'].flatMap((category,i)=>Array.from({length:i+1},(_,j)=>({id:'PAY-'+i+'-'+j,category,status:j===2?'resolved':'unresolved',code:['insufficient_funds','authentication_required','expired_card','api_connection_error','chargeback'][i],occurredAt:new Date(now-(i+j)*3600000).toISOString()})));
  const logs=Array.from({length:38},(_,i)=>({id:'LOG-'+i,timestamp:new Date(now-i*3600000).toISOString(),severity:['FATAL','ERROR','WARN','INFO'][i%4],source:['server','api','matching','payment','worker','frontend'][i%6],kind:i%8===0?'validation':'system',message:['System crash','Unexpected exception','Repeated retries','API communication failure','Matching failure','Frontend warning'][i%6]}));
  const data={today,now,accounts,agents,properties,facts,fraudFlags,paymentErrors,logs,places,groups,structures,countries,plans,prices,adTypes,options};
  const utilities={DAY,dayKey,addDays,hash};
  root.OverviewDemo={data,utilities};
})(typeof window!=='undefined'?window:globalThis);
