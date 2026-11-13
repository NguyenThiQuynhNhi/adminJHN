(() => {
  'use strict';
  const D=OverviewDemo.data,U=OverviewDemo.utilities,M=OverviewModel,V=OverviewCharts,S=OverviewSpec;
  const {esc,number}=V;
  const page=document.body.dataset.overviewPage;
  const pages={
    kpi:['KPI Dashboard','kpi-dashboard.html'],content:['Content Performance','content-performance-dashboard.html'],users:['End User Statistics','end-user-stats-dashboard.html'],agents:['Agency Statistics','agent-stats-dashboard.html'],properties:['Property Statistics','property-stats-dashboard.html'],ads:['Revenue & Ad Performance','ad-performance-dashboard.html'],market:['Market Analysis','market-analysis-dashboard.html'],cross:['Cross Analysis','cross-analysis-dashboard.html'],league:['Agency League','agent-league-dashboard.html'],marketing:['CRM Marketing','marketing-dashboard.html'],reports:['Report Management','report-management-dashboard.html']
  };
  const storage={get(key,fallback){try{return JSON.parse(localStorage.getItem('yuushi.overview.'+key))??fallback;}catch{return fallback;}},set(key,value){try{localStorage.setItem('yuushi.overview.'+key,JSON.stringify(value));}catch{}}};
  const membershipDisplay={All:'All',Members:'Members Only','Non-Members':'Non-Members Only',Compare:'Members vs Non-Members'};
  const defaults={transaction:'All',propertyTypes:[],groups:[],subtypes:[],unit:'Monthly',comparison:'Previous Month',start:U.addDays(D.today,-29),end:D.today,compareStart:'',compareEnd:'',prefectures:[],cities:[],line:'',stations:[],walk:'',structures:[],floorPlans:[],ageMin:'',ageMax:'',areaMin:'',areaMax:'',priceMin:'',priceMax:'',membership:'All',conversion:'Inquiries'};
  let filtersApplied=Boolean(storage.get('filters',null));
  let filters={...defaults,...storage.get('filters',{})};
  let enabledFraud={...Object.fromEntries(S.alerts.filter(a=>a.fraud).map(a=>[a.id,true])),...storage.get('fraudKpi',{})};
  let targets=storage.get('targets',[]),savedReports=storage.get('reportShortcuts',[]),schedules=storage.get('reportSchedules',[]);
  const results=new Map(),choices=new Map();
  const select=(id,label,values,multiple=false)=>`<label class="field">${esc(label)}<select id="${id}" name="${id}" ${multiple?'multiple':''}>${values.map(v=>{const [value,text]=Array.isArray(v)?v:[v,v];return `<option value="${esc(value)}">${esc(text)}</option>`;}).join('')}</select></label>`;
  const input=(id,label,type='date')=>`<label class="field">${esc(label)}<input id="${id}" name="${id}" type="${type}" ${type==='number'?'min="0" step="any"':''}></label>`;
  const headings={content:[35,40],users:[42,60],agents:[69,84],properties:[91,105],ads:[107,118],market:[120,128],cross:[130,137],league:[80,80],marketing:[137,137]};
  const metricsForPage=()=>{const range=headings[page];return range?S.metrics.filter(s=>!s.outOfScope&&s.definition&&s.row>=range[0]&&s.row<=range[1]):[];};
  function toast(message){const el=document.getElementById('toast');el.textContent=message;el.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.hidden=true,4500);}
  function downloadCSV(name,columns,rows){toast('CSV export prepared for demo. '+rows.length+' rows · '+name);}
  window.mockExportContext=b=>{const r=results.get(b.dataset.export);return r?r.rows.length+' filtered rows.':'Current dashboard filters applied.';};
  function exportResult(id,format='csv'){const r=results.get(id);if(!r||r.unavailable)return;toast((format==='xlsx'?'Excel':'CSV')+' export prepared for demo. '+r.rows.length+' filtered rows.');}
  window.mockExportPrepare=(button,format)=>exportResult(button.dataset.export,format);
  function filterMarkup(){return `<form class="filters" id="overviewFilters"><div class="filters-summary"><strong>Analytics filters</strong><p id="filterSummary" hidden></p><div class="actions"><button class="btn" type="button" id="resetFilters">Reset</button><button class="btn primary" type="submit">Apply filters</button></div></div><div class="filter-primary">${select('transaction','Transaction type',['All','For Sale','For Rent','New Development'])}${select('unit','Period unit',['Daily','Weekly','Monthly','Quarterly','Yearly','Custom'])}${input('start','Start date')}${input('end','End date')}${select('comparison','Compare with',['None','Previous Day','Previous Month','Previous Quarter','Previous Year','Custom'])}${select('membership','User type',[['All','All'],['Members','Members Only'],['Non-Members','Non-Members Only'],['Compare','Members vs Non-Members']])}</div><div class="pair" id="customComparison" hidden>${input('compareStart','Comparison start')}${input('compareEnd','Comparison end')}</div><details><summary>Property, area and station filters</summary><div class="filter-grid"><fieldset class="field-group"><legend>Property Type</legend><div id="propertyTypeOptions" class="filter-check-list"></div><select id="propertyTypes" multiple hidden></select></fieldset><fieldset class="field-group"><legend>Region</legend><input id="regionSearch" type="search" placeholder="Search prefecture / city…"><div id="regionOptions" class="filter-check-list filter-tree"></div><select id="prefectures" multiple hidden></select><select id="cities" multiple hidden></select></fieldset><fieldset class="field-group"><legend>Railway / Station</legend><input id="railwaySearch" type="search" placeholder="Search line / station…"><div id="railwayOptions" class="filter-check-list filter-tree"></div><select id="line" hidden></select><select id="stations" multiple hidden></select><label class="field">Maximum walking time${select('walk','Maximum walking time',[['','Any'],['5','5 minutes'],['10','10 minutes'],['15','15 minutes'],['30','30 minutes']])}</label></fieldset><fieldset class="field-group"><legend>Building Structure</legend><div id="structureOptions" class="filter-check-list"></div><select id="structures" multiple hidden></select></fieldset><fieldset class="field-group"><legend>Floor Plan</legend><div id="floorPlanOptions" class="filter-check-list"></div><select id="floorPlans" multiple hidden></select></fieldset><fieldset class="field-group"><legend>Building Age Range</legend><div class="filter-range"><label>Minimum age (years)<input id="ageMin" type="number" min="0" placeholder="Min"></label><label>Maximum age (years)<input id="ageMax" type="number" min="0" placeholder="Max"></label></div><div class="filter-presets" id="agePresets"><button type="button" data-range="age" data-min="0" data-max="5">0–5</button><button type="button" data-range="age" data-min="6" data-max="10">6–10</button><button type="button" data-range="age" data-min="11" data-max="20">11–20</button><button type="button" data-range="age" data-min="21" data-max="30">21–30</button><button type="button" data-range="age" data-min="31" data-max="">31+</button></div></fieldset><fieldset class="field-group"><legend>Floor Area Range</legend><div class="filter-range"><label>Minimum floor area (m²)<input id="areaMin" type="number" min="0" placeholder="Min"></label><label>Maximum floor area (m²)<input id="areaMax" type="number" min="0" placeholder="Max"></label></div><div class="filter-presets" id="areaPresets"><button type="button" data-range="area" data-min="0" data-max="20">0–20</button><button type="button" data-range="area" data-min="20" data-max="30">20–30</button><button type="button" data-range="area" data-min="30" data-max="50">30–50</button><button type="button" data-range="area" data-min="50" data-max="80">50–80</button><button type="button" data-range="area" data-min="80" data-max="100">80–100</button><button type="button" data-range="area" data-min="100" data-max="">100+</button></div></fieldset><fieldset class="field-group"><legend>Price Range</legend><p id="priceBasis" class="muted"></p><div class="filter-range"><label>Minimum price (JPY)<input id="priceMin" type="number" min="0" placeholder="Min"></label><label>Maximum price (JPY)<input id="priceMax" type="number" min="0" placeholder="Max"></label></div><div class="filter-presets" id="pricePresets"><button type="button" data-range="price" data-min="0" data-max="20000000">Under ¥20M</button><button type="button" data-range="price" data-min="20000000" data-max="50000000">¥20M–50M</button><button type="button" data-range="price" data-min="50000000" data-max="80000000">¥50M–80M</button><button type="button" data-range="price" data-min="80000000" data-max="100000000">¥80M–100M</button><button type="button" data-range="price" data-min="100000000" data-max="">¥100M+</button></div>${select('conversion','CPA conversion',['Inquiries','Closings'])}</fieldset></div></details><p class="error" id="filterError" role="alert" hidden></p><style>.filter-check-list{max-height:190px;overflow:auto;border:1px solid var(--line);border-radius:8px;padding:8px}.filter-check-list label{display:flex;gap:7px;align-items:center;padding:4px 2px}.filter-check-list input{width:auto;min-height:auto}.filter-tree details{margin:4px 0 4px 8px}.filter-tree summary{cursor:pointer;font-weight:600}.filter-range{display:grid;grid-template-columns:1fr 1fr;gap:8px}.filter-presets{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.filter-presets button{border:1px solid var(--line);background:#fff;border-radius:6px;padding:5px 8px;cursor:pointer}</style></form>`;}
  function readFilters(){const next={};Object.keys(defaults).forEach(key=>{const el=document.getElementById(key);if(!el)return;if(el.multiple){next[key]=el.options.length?[...el.selectedOptions].map(o=>o.value):(filters[key]||defaults[key]||[]);}else{next[key]=el.value;}});return {...filters,...next};}
  function setSelectOptions(id,values,selected=[]){const el=document.getElementById(id);el.innerHTML=values.map(v=>{const [value,label]=Array.isArray(v)?v:[v,v];return `<option value="${esc(value)}" ${selected.includes(value)?'selected':''}>${esc(label)}</option>`;}).join('');}
  function updateDependentFilters(){const current=readFilters();const propertyTypes=['Apartment','Tower Mansion','House','Retail Unit','Office Unit','Factory & Warehouse Unit','Resort Apartment & Condo Hotel Unit','Car Park','Residential Multi-Family Building','Retail Building','Office Building','Factory & Warehouse Building','Mixed-Use Building','Hotel & Ryokan','Resort House & Villa & Ski Chalet','Residential Land','Commercial Land','Other Land','Carpark (Operational)','Carpark (Development Land)'];const structures=['SRC','RC','Steel','Lightweight Steel','Wooden'];const floorPlans=['1K','1R','1DK','1LDK','1SLDK','2DK','2LDK','2SLDK','3DK','3LDK','3SLDK','4DK','4LDK','4SLDK','5DK','5LDK','5SLDK','6LDK+'];const prefs=['Tokyo','Osaka','Kanagawa','Kyoto','Hokkaido','Fukuoka','Saitama','Chiba','Aichi','Hyogo'];const citiesByPref=window.YuushiMunicipality?.namesByPrefecture||{};const railway={Tokyo:{'JR Yamanote Line':['Shibuya','Shinjuku','Tokyo','Ueno','Ebisu'],'Ginza Line':['Omotesando','Shibuya','Asakusa','Ginza'],'Hanzomon Line':['Aoyama-Itchome','Shibuya','Otemachi']},Osaka:{'Midosuji Line':['Umeda','Namba','Shinsaibashi','Tennoji'],'JR Osaka Loop Line':['Osaka','Tennoji','Kyobashi']},Kanagawa:{'JR Tokaido Line':['Yokohama','Kawasaki','Ofuna'],'Tokyu Toyoko Line':['Yokohama','Hiyoshi','Musashi-Kosugi']},Hokkaido:{'Sapporo Namboku Line':['Sapporo','Odori','Susukino','Nakajima-Koen'],'Sapporo Tozai Line':['Odori','Maruyama-Koen','Shin-Sapporo']},Fukuoka:{'Fukuoka Kuko Line':['Hakata','Tenjin','Fukuoka Airport'],'Fukuoka Hakozaki Line':['Nakasu-Kawabata','Kaizuka']},Aichi:{'Nagoya Higashiyama Line':['Nagoya','Sakae','Hoshigaoka'],'JR Chuo Line':['Nagoya','Chikusa','Ozone']}};const renderChecks=(id,values,selected)=>{const el=document.getElementById(id);if(!el)return;el.innerHTML=values.map(v=>'<label><input type="checkbox" data-filter-group="'+id+'" value="'+esc(v)+'" '+(selected.includes(v)?'checked':'')+'> '+esc(v)+'</label>').join('');};const setHidden=(id,values,selected)=>setSelectOptions(id,values,selected);renderChecks('propertyTypeOptions',propertyTypes,current.propertyTypes||[]);renderChecks('structureOptions',structures,current.structures||[]);renderChecks('floorPlanOptions',floorPlans,current.floorPlans||[]);setHidden('propertyTypes',propertyTypes,current.propertyTypes||[]);setHidden('structures',structures,current.structures||[]);setHidden('floorPlans',floorPlans,current.floorPlans||[]);const region=document.getElementById('regionOptions');if(region){region.innerHTML=prefs.map(pref=>{const cities=citiesByPref[pref]||[];return '<details><summary><label><input type="checkbox" data-pref="'+esc(pref)+'" '+((current.prefectures||[]).includes(pref)?'checked':'')+'> '+esc(pref)+'</label></summary>'+cities.map(city=>'<label><input type="checkbox" data-city="'+esc(pref)+'" value="'+esc(city)+'" '+((current.cities||[]).includes(city)?'checked':'')+'> '+esc(city)+'</label>').join('')+'</details>';}).join('');}setHidden('prefectures',prefs,current.prefectures||[]);const allCities=[...new Set(Object.values(citiesByPref).flat())];setHidden('cities',allCities,current.cities||[]);const rail=document.getElementById('railwayOptions');if(rail){rail.innerHTML=Object.entries(railway).map(([pref,lines])=>'<details><summary>'+esc(pref)+'</summary>'+Object.entries(lines).map(([line,stations])=>'<details><summary><label><input type="checkbox" data-line="'+esc(line)+'" '+(current.line===line?'checked':'')+'> '+esc(line)+'</label></summary>'+stations.map(station=>'<label><input type="checkbox" data-station="'+esc(line)+'" value="'+esc(station)+'" '+((current.stations||[]).includes(station)?'checked':'')+'> '+esc(station)+'</label>').join('')+'</details>').join('')+'</details>').join('');}setHidden('line',['',...Object.values(railway).flatMap(x=>Object.keys(x))],current.line?[current.line]:['']);setHidden('stations',[...new Set(Object.values(railway).flatMap(x=>Object.values(x).flat()))],current.stations||[]);document.getElementById('customComparison').hidden=current.comparison!=='Custom';document.getElementById('priceBasis').textContent=current.transaction==='For Rent'?'Monthly rent (JPY/month)':current.transaction==='New Development'?'Unit price (JPY)':'Sale price (JPY)';}
  function restoreFilters(){Object.entries(filters).forEach(([key,value])=>{const el=document.getElementById(key);if(el&&!el.multiple)el.value=value;});for(const key of ['prefectures','structures','floorPlans','propertyTypes']){const el=document.getElementById(key);[...el.options].forEach(o=>o.selected=filters[key]?.includes(o.value));}updateDependentFilters();for(const key of ['cities','stations']){const el=document.getElementById(key);[...el.options].forEach(o=>o.selected=filters[key]?.includes(o.value));}updateDependentFilters();}
  function validateFilters(f){if(!f.start||!f.end||f.start>f.end)return 'Choose a valid start and end date.';if(f.end>D.today)return 'The end date cannot be after today.';if(f.comparison==='Custom'&&(!f.compareStart||!f.compareEnd||f.compareStart>f.compareEnd))return 'Choose a valid comparison period.';for(const pair of [['ageMin','ageMax'],['areaMin','areaMax'],['priceMin','priceMax']])if(f[pair[0]]&&f[pair[1]]&&Number(f[pair[0]])>Number(f[pair[1]]))return 'A minimum value cannot exceed its maximum.';return '';}
  function previousFilters(f){if(f.comparison==='None')return null;if(f.comparison==='Custom')return {...f,start:f.compareStart,end:f.compareEnd};const months={'Previous Month':-1,'Previous Quarter':-3,'Previous Year':-12};return {...f,start:f.comparison==='Previous Day'?U.addDays(f.start,-1):M.shiftMonth(f.start,months[f.comparison]),end:f.comparison==='Previous Day'?U.addDays(f.end,-1):M.shiftMonth(f.end,months[f.comparison])};}
  function metricFilters(spec){const choice=choices.get(spec.id)||{};const breakdownDefaults={r35:'section',r46:'country',r47:'composition',r58:'country',r74:'agentId',r83:'prefecture',r53:'subtype',r82:'prefecture',r84:'location',r125:'structure'};const base=page==='kpi'?{...defaults,start:spec.id==='r28'?M.shiftMonth(M.monthStart(D.today),-11):U.addDays(D.today,-29),end:D.today,unit:spec.id==='r28'?'Monthly':'Daily',comparison:'None'}:spec.id==='r54'&&!filtersApplied?{...filters,start:M.shiftMonth(M.monthStart(D.today),-11),end:D.today,unit:'Monthly'}:filters;return {...base,breakdown:breakdownDefaults[spec.id],...choice};}
  function comparisonText(spec,result){const prev=previousFilters(metricFilters(spec));if(!prev||spec.id==='r56')return '';try{const previous=M.metric(spec,prev);const c=result.columns[0];const current=['r43','r44','r55','r70'].includes(spec.id)?result.rows.at(-1)?.[c.key]||0:M.sum(result.rows,c.key),old=['r43','r44','r55','r70'].includes(spec.id)?previous.rows.at(-1)?.[c.key]||0:M.sum(previous.rows,c.key);if(c.unit==='%'||/price|seconds|cpa|days|rating|response/i.test(c.key))return 'Comparison period: '+prev.start+' – '+prev.end+' · see comparison table';return `${number(current,c.unit)} vs ${number(old,c.unit)} · ${old?((current-old)/old*100).toFixed(1)+'%':'No comparison baseline'}`;}catch{return '';}}
  const metricTitleOverrides={
    r55:'Inactive Clients 30+ Days',
    r107:'Platform CPA',
    r112:'Agency Subscription Cost per Conversion',
    r113:'Agency Ad Cost per Conversion by Ad Type',
    r114:'Agency Ad Cost per Conversion by Placement',
    r115:'Paid Ad IMP / View / Click / CV / CVR'
  };
  const metricTitle=spec=>metricTitleOverrides[spec.id]||spec.title;
  function prototypeResult(spec,f){
    const title=metricTitle(spec),seed=Number(String(spec.id||'').replace(/\D/g,''))||1;
    const periods=['May 2026','Jun 2026','Jul 2026','Aug 2026','Sep 2026','Oct 2026'];
    const grow=(base,i,step=1)=>Math.max(0,Math.round(base+i*step+((seed+i*7)%5)));
    const result=(kind,columns,rows)=>({kind,columns,rows,prototype:true,note:''});
    if(spec.id==='r42')return result('line',[{key:'registrations',label:'New Client Registrations'}],periods.map((label,i)=>({label,registrations:grow(38,i,6)})));
    if(spec.id==='r43')return result('line',[{key:'registeredClients',label:'Cumulative Registered Clients'}],periods.map((label,i)=>({label,registeredClients:1180+i*96+(seed%12)})));
    if(spec.id==='r44')return result('line',[
      {key:'dau',label:'DAU'},{key:'wau',label:'WAU'},{key:'mau',label:'MAU'},
      {key:'guestDaily',label:'Guest Unique Visitors · Daily'},{key:'guest7d',label:'Guest Unique Visitors · 7-day'},{key:'guest30d',label:'Guest Unique Visitors · 30-day'}
    ],periods.map((label,i)=>({label,dau:210+i*12,wau:820+i*34,mau:2140+i*61,guestDaily:330+i*18,guest7d:1290+i*42,guest30d:3180+i*79})));
    if(spec.id==='r45')return result('line',[{key:'seconds',label:'Avg Session Time',unit:'seconds'},{key:'listingSeconds',label:'Avg Viewing Time per Listing',unit:'seconds'}],periods.map((label,i)=>({label,seconds:270+i*17+(seed%12),listingSeconds:74+i*5+(seed%6)})));
    if(spec.id==='r46')return result('bar',[{key:'clients',label:'Clients'}],[['Japan',420],['China',138],['United States',94],['Singapore',67],['Hong Kong',51],['Australia',34]].map(([label,clients])=>({label,clients})));
    if(spec.id==='r47')return result('table',[
      {key:'sessions',label:'Sessions'},{key:'views',label:'Property Views'},{key:'clicks',label:'Property Clicks'},{key:'saves',label:'Keep / Saves'},{key:'inquiries',label:'Property Inquiries'}
    ],[
      {label:'Registered Members',sessions:1680,views:4320,clicks:1260,saves:418,inquiries:176},
      {label:'Guests / Non-Members',sessions:2410,views:5180,clicks:980,saves:0,inquiries:0},
      {label:'Total',sessions:4090,views:9500,clicks:2240,saves:418,inquiries:176}
    ]);
    if(spec.id==='r48')return result('bar',[{key:'clients',label:'Clients'}],[
      ['18–24 · Female',118],['18–24 · Male',96],['25–34 · Female',226],['25–34 · Male',204],['35–44 · Female',174],['35–44 · Male',159]
    ].map(([label,clients])=>({label,clients})));
    if(spec.id==='r49')return result('bar',[{key:'sessions',label:'Sessions'}],[
      ['Japanese · Smartphone',860],['Japanese · PC',540],['English · Smartphone',420],['English · PC',310],['Simplified Chinese · Smartphone',185],['Japanese · Tablet',96]
    ].map(([label,sessions])=>({label,sessions})));
    if(spec.id==='r50')return result('bar',[{key:'registrations',label:'Registrations'}],[
      ['Organic Search',402],['Direct',286],['Referral',161],['Social',128],['Paid Ads',97]
    ].map(([label,registrations])=>({label,registrations})));
    if(spec.id==='r51')return result('world',[{key:'accesses',label:'Accesses'}],[['Japan',1960],['United States',310],['Singapore',246],['Hong Kong',198],['Australia',151],['United Kingdom',104]].map(([label,accesses])=>({label,accesses})));
    if(spec.id==='r52')return result('line',[
      {key:'searches',label:'Searches'},{key:'views',label:'Property Views'},{key:'saves',label:'Keep / Saves'},{key:'inquiries',label:'Property Inquiries'}
    ],periods.map((label,i)=>({label,searches:grow(1480,i,115),views:grow(5100,i,410),saves:grow(340,i,28),inquiries:grow(160,i,14)})));
    if(spec.id==='r53')return result('bar',[{key:'searches',label:'Searches'}],[
      ['Apartment',640],['House',428],['2LDK',362],['Tokyo / Shibuya',331],['≤ ¥80M',288],['Building age ≤ 10 years',214]
    ].map(([label,searches])=>({label,searches})));
    if(spec.id==='r54')return result('line',[
      {key:'sessions',label:'Sessions'},{key:'views',label:'Property Views'},{key:'clicks',label:'Property Clicks'},{key:'saves',label:'Keep / Saves'},{key:'inquiries',label:'Property Inquiries'},{key:'deals',label:'Agency-recorded Deals'}
    ],periods.map((label,i)=>({label,sessions:grow(4200,i,260),views:grow(9800,i,590),clicks:grow(2520,i,165),saves:grow(620,i,44),inquiries:grow(286,i,22),deals:grow(61,i,6)})));
    if(spec.id==='r55')return result('line',[{key:'inactiveClients',label:'Inactive Clients 30+ Days'}],periods.map((label,i)=>({label,inactiveClients:92+i*7+(seed%5)})));
    if(spec.id==='r56')return result('line',[{key:'withdrawals',label:'Withdrawals'}],periods.map((label,i)=>({label,withdrawals:[8,11,9,13,10,12][i]})));
    if(spec.id==='r57')return result('line',[{key:'conversations',label:'Conversation Count'},{key:'messages',label:'Message Count'}],periods.map((label,i)=>({label,conversations:180+i*14,messages:1240+i*95})));
    if(spec.id==='r58')return result('bar',[{key:'clientMessages',label:'Client-sent Messages'}],[
      ['Japan',1480],['China',372],['United States',244],['Singapore',186],['Hong Kong',151]
    ].map(([label,clientMessages])=>({label,clientMessages})));
    if(spec.id==='r59')return result('bar',[{key:'agencyMessages',label:'Agency-sent Messages'}],[
      ['Yamada Estates Co., Ltd.',462],['Osaka Premier Realty',351],['Agency 6 Realty Co.',289],['Karuizawa Living',214],['Land Pros',173]
    ].map(([label,agencyMessages])=>({label,agencyMessages})));
    if(spec.id==='r60')return result('bar',[{key:'responseMinutes',label:'Average Response Time',unit:'minutes'}],[
      {label:'Japan business hours',responseMinutes:42},{label:'Outside Japan business hours',responseMinutes:116}
    ]);
    if(/Avg Session Time/i.test(title))return result('line',[{key:'seconds',label:'Avg Session Time',unit:'seconds'}],periods.map((label,i)=>({label,seconds:240+i*18+(seed%20)})));
    if(/Distribution by Nationality \/ Country/i.test(title))return result('bar',[{key:'count',label:'Clients'}],[['Japan',420],['China',138],['United States',94],['Singapore',67],['Hong Kong',51],['Australia',34]].map(([label,count])=>({label,count})));
    if(/Member vs Non-Member/i.test(title))return result('table',[
      {key:'sessions',label:'Sessions'},{key:'views',label:'Property Views'},{key:'clicks',label:'Property Clicks'},{key:'saves',label:'Keep / Saves'},{key:'inquiries',label:'Property Inquiries'}
    ],[
      {label:'Registered Members',sessions:1680,views:4320,clicks:1260,saves:418,inquiries:176},
      {label:'Guests / Non-Members',sessions:2410,views:5180,clicks:980,saves:0,inquiries:0},
      {label:'Total',sessions:4090,views:9500,clicks:2240,saves:418,inquiries:176}
    ]);
    if(/Distribution by Age \/ Gender/i.test(title))return result('bar',[{key:'count',label:'Clients'}],[
      ['18–24 · Female',118],['18–24 · Male',96],['25–34 · Female',226],['25–34 · Male',204],['35–44 · Female',174],['35–44 · Male',159]
    ].map(([label,count])=>({label,count})));
    if(/Distribution by Language \/ Device/i.test(title))return result('bar',[{key:'count',label:'Sessions'}],[
      ['Japanese · Mobile',860],['Japanese · Desktop',540],['English · Mobile',420],['English · Desktop',310],['Simplified Chinese · Mobile',185],['Simplified Chinese · Desktop',96]
    ].map(([label,count])=>({label,count})));
    if(/Acquisition Channel Analysis/i.test(title))return result('bar',[{key:'sessions',label:'Sessions'}],[
      ['Organic Search',1280],['Direct',940],['Referral',520],['Social',410],['Paid Ads',330]
    ].map(([label,sessions])=>({label,sessions})));
    if(/Access by Country Heatmap/i.test(title))return result('world',[{key:'accesses',label:'Accesses'}],[['Japan',1960],['United States',310],['Singapore',246],['Hong Kong',198],['Australia',151],['United Kingdom',104]].map(([label,accesses])=>({label,accesses})));
    if(/Site-wide Funnel/i.test(title)||spec.id==='r54')return result('funnel',[
      {key:'sessions',label:'Sessions'},{key:'views',label:'Property Views'},{key:'clicks',label:'Property Clicks'},{key:'saves',label:'Keep / Saves'},{key:'inquiries',label:'Property Inquiries'},{key:'deals',label:'Agency-recorded Deals'}
    ],[{label:'Selected period',sessions:5200,views:13800,clicks:3640,saves:890,inquiries:420,deals:96}]);
    if(/Behavior Metrics Trend/i.test(title))return result('line',[
      {key:'impressions',label:'Standard Listing Impressions'},{key:'views',label:'Property Views'},{key:'clicks',label:'Property Clicks'},{key:'saves',label:'Keep / Saves'},{key:'inquiries',label:'Property Inquiries'}
    ],periods.map((label,i)=>({label,impressions:grow(8200,i,560),views:grow(5100,i,410),clicks:grow(1480,i,95),saves:grow(340,i,28),inquiries:grow(160,i,14)})));
    if(/Ad .*IMP|Paid Ad|Ad Performance/i.test(title))return result('line',[
      {key:'adImpressions',label:'Ad Impressions'},{key:'adViews',label:'Ad Views'},{key:'adClicks',label:'Ad Clicks'},{key:'adInquiries',label:'Ad-attributed Inquiries'}
    ],periods.map((label,i)=>({label,adImpressions:grow(3500,i,280),adViews:grow(2200,i,170),adClicks:grow(310,i,24),adInquiries:grow(42,i,5)})));
    if(/Price Trend|Average Price|Sales Value|Revenue|Spend/i.test(title))return result('line',[{key:'value',label:/Price/i.test(title)?'Average Price':'Value',unit:'JPY'}],periods.map((label,i)=>({label,value:42000000+i*1750000+(seed%7)*250000})));
    if(/CPA|Cost per/i.test(title))return result('line',[{key:'cpa',label:'Cost per Conversion',unit:'JPY'}],periods.map((label,i)=>({label,cpa:9800-i*260+(seed%5)*90})));
    if(/Response Rate/i.test(title))return result('line',[{key:'responseRate',label:'Response Rate',unit:'%'}],periods.map((label,i)=>({label,responseRate:82+i*1.7+(seed%3)})));
    if(/Rating/i.test(title))return result('line',[{key:'rating',label:'Rating'}],periods.map((label,i)=>({label,rating:4.1+i*.08+(seed%3)*.03})));
    if(/Distribution|Breakdown|by Country|by Agency|by Type|by Placement/i.test(title))return result('bar',[{key:'count',label:'Count'}],[['Tokyo',186],['Osaka',142],['Kanagawa',98],['Chiba',74],['Saitama',61]].map(([label,count])=>({label,count:count+(seed%9)})));
    return result('line',[{key:'count',label:'Count'}],periods.map((label,i)=>({label,count:grow(42+(seed%20),i,7)})));
  }
  function metricDescription(spec,result){
    const description=((result.prototype?spec.definition:result.note)||spec.definition||'').trim();
    const calculation=(spec.id==='r56'
      ?'Withdrawals are explicit account withdrawals only. Inactivity is not counted as withdrawal.'
      :spec.id==='r55'
        ?'Analytics segment: active Customer accounts with no recorded login/activity for at least 30 days. Long-term Inactive (90+ days) and Dormant (180+ days) remain separate system-alert states.'
        :(spec.calculation||'')).trim();
    if(!calculation||description.toLowerCase().includes(calculation.toLowerCase()))return description;
    const sentence=text=>/[.!?]$/.test(text)?text:text+'.';
    return `${sentence(description)} ${sentence(calculation)}`;
  }
  function metricControls(spec){if(spec.id==='r54'){const selected=choices.get(spec.id)?.series||['sessions','views','clicks','saves','inquiries','deals'];return '<div class="inline-fields" aria-label="Visible funnel series">'+[['sessions','Sessions'],['views','Property Views'],['clicks','Property Clicks'],['saves','Keep / Saves'],['inquiries','Property Inquiries'],['deals','Agency-recorded Deals']].map(([key,label])=>`<label class="muted"><input type="checkbox" data-series="${spec.id}" value="${key}" ${selected.includes(key)?'checked':''}> ${label}</label>`).join('')+'</div>';}if(spec.id==='r125'){const choice=metricFilters(spec);return `<div class="inline-fields"><label class="muted">Attribute <select data-breakdown="r125">${[['structure','Building Structure'],['floorPlan','Floor Plan'],['age','Building Age Range'],['floorArea','Floor Area Range'],['price','Price Range']].map(([key,label])=>`<option value="${key}" ${choice.breakdown===key?'selected':''}>${label}</option>`).join('')}</select></label><label class="muted">Rank by <select data-rank-by="r125">${[['impressions','Standard Listing Impressions'],['views','Property Views'],['clicks','Property Clicks'],['saves','Keep / Saves'],['inquiries','Property Inquiries']].map(([key,label])=>`<option value="${key}" ${(choice.rankBy||'impressions')===key?'selected':''}>${label}</option>`).join('')}</select></label></div>`;}let options=null;if(spec.id==='r35')options=[['section','Site sections'],['prefecture','Area Guides by prefecture'],['city','Area Guides by neighborhood']];if(spec.id==='r83')options=[['prefecture','Agency area'],['subtype','Supported property types']];if(spec.id==='r137')options=[['channel','Delivery channel'],['campaign','Delivery campaign']];if(spec.id==='r74')options=[['agentId','Per Agency'],['prefecture','Agency location'],['subtype','Property type']];if(spec.id==='r58')options=[['country','Country totals'],['customerId','Messages per End User']];if(spec.id==='r46')options=[['country','Country of residence'],['nationality','Nationality']];if(['r53','r82'].includes(spec.id))options=[['subtype','Property type'],['prefecture','Prefecture'],['city','City / Ward'],['station','Station'],['floorPlan','Floor plan / bedrooms'],['floorArea','Floor area'],['price','Price'],['structure','Structure'],['age','Building age']];if(spec.id==='r84')options=[['location','Property location'],['subtype','Property type']];if(spec.id==='r47')options=[['composition','Session composition and registration rate'],['totals','Behavior totals'],['section','Page type'],['transaction','Transaction type'],['group','Property group'],['city','Area / saved property interest'],['propertyId','Most saved properties'],['subtype','Search property type'],['floorPlan','Search bedrooms'],['price','Search price range'],['age','Search building age'],['exitSection','Exit pages'],['funnel','Member / guest funnel']];return options?`<div class="inline-fields"><label class="muted">Breakdown <select data-breakdown="${spec.id}">${options.map(([key,label])=>`<option value="${key}" ${(metricFilters(spec).breakdown||options[0][0])===key?'selected':''}>${label}</option>`).join('')}</select></label></div>`:'';}
  function memberComparisonResult(spec,f){
    if(spec.id==='r47')return M.metric(spec,{...f,membership:'All'});
    const members=M.metric(spec,{...f,membership:'Members'});
    const nonMembers=M.metric(spec,{...f,membership:'Non-Members'});
    if(!members||!nonMembers||members.unavailable||nonMembers.unavailable||!Array.isArray(members.rows)||!Array.isArray(nonMembers.rows)){
      return {kind:'table',columns:[],rows:[],unavailable:true,note:'Member / non-member comparison is unavailable for this metric.'};
    }
    if(JSON.stringify({columns:members.columns,rows:members.rows})===JSON.stringify({columns:nonMembers.columns,rows:nonMembers.rows})){
      return {kind:'table',columns:[],rows:[],unavailable:true,note:'The available source does not provide a distinct Members / Non-Members breakdown for this metric.'};
    }
    const sourceColumns=[...new Map([...members.columns,...nonMembers.columns].map(c=>[c.key,c])).values()];
    const memberRows=new Map(members.rows.map((row,index)=>[String(row.label??index),row]));
    const nonMemberRows=new Map(nonMembers.rows.map((row,index)=>[String(row.label??index),row]));
    const labels=[...new Set([...memberRows.keys(),...nonMemberRows.keys()])];
    const columns=sourceColumns.flatMap(column=>[
      {key:'members_'+column.key,label:'Members · '+column.label,unit:column.unit||''},
      {key:'nonMembers_'+column.key,label:'Non-Members · '+column.label,unit:column.unit||''}
    ]);
    const rows=labels.map(label=>{
      const member=memberRows.get(label)||{},nonMember=nonMemberRows.get(label)||{};
      const row={label};
      sourceColumns.forEach(column=>{
        row['members_'+column.key]=member[column.key]??null;
        row['nonMembers_'+column.key]=nonMember[column.key]??null;
      });
      return row;
    });
    return {kind:'table',columns,rows,prototype:false,memberComparison:true,note:'Members and Non-Members are calculated independently and displayed side by side.'};
  }
  function chartCard(spec){const title=metricTitle(spec),currentFilters=metricFilters(spec),compareMembers=currentFilters.membership==='Compare';let result;try{result=compareMembers?memberComparisonResult(spec,currentFilters):M.metric(spec,currentFilters);}catch(error){console.error(error);result={unavailable:true};}
    if(!compareMembers&&(result.unavailable||!Array.isArray(result.rows)||result.rows.length===0))result=prototypeResult(spec,currentFilters);
    results.set(spec.id,result);
    const selected=choices.get(spec.id)?.measure;
    const previous=result.prototype||compareMembers?null:previousFilters(currentFilters);
    let comparison='';
    if(previous&&spec.id!=='r56'){try{const pr=M.metric(spec,previous);if(pr&&!pr.unavailable&&pr.rows?.length)comparison=`<details><summary>Comparison data · ${esc(previous.start)} – ${esc(previous.end)}</summary><div data-comparison-table>${V.table(pr)}</div></details>`;}catch{}}
    const prototypeBadge='';
    const footerText=compareMembers?'Members and Non-Members are shown as separate values for each available metric.':result.prototype?'':comparisonText(spec,result);
    return `<article class="card chart-card ${result.kind==='table'||['r47','r56','r128'].includes(spec.id)?'wide':''}" id="metric-${spec.id}" data-metric="${spec.id}"><div class="chart-heading"><h3>${esc(title)}</h3><span class="badge">${esc(spec.id==='r56'?'Monthly · 12 months':metricFilters(spec).unit)}</span>${prototypeBadge}</div><div class="chart-subtitle"><strong>Description:</strong> ${esc(metricDescription(spec,result))}</div>${['r42','r43','r44','r46','r48','r55','r56','r69','r70','r71','r73','r81'].includes(spec.id)?'<p class="muted">Account metric: period and account area filters apply; property attributes do not apply.</p>':''}${metricControls(spec)}${spec.id==='r125'?'':`<div class="inline-fields" style="margin:8px 0"><label class="muted">Measure <select data-measure="${spec.id}"><option value="">${result.kind==='line'||result.kind==='stacked'?'Compatible series':'Primary measure'}</option>${result.columns.map(c=>`<option value="${esc(c.key)}" ${selected===c.key?'selected':''}>${esc(c.label)}</option>`).join('')}</select></label></div>`}<div class="chart-wrap">${compareMembers?(result.rows.length?V.table(result):'<div class="empty">No segmented Members / Non-Members data is available for this metric under the selected filters.</div>'):choices.get(spec.id)?.series?.length===0&&!selected?'<div class="empty">Select a funnel series to display.</div>':V.render(!selected&&choices.get(spec.id)?.series?{...result,columns:result.columns.filter(c=>choices.get(spec.id).series.includes(c.key))}:result,selected)}</div>${result.kind==='table'?'':`<details><summary>View data · ${result.rows.length} rows</summary>${V.table(result)}</details>`}${comparison}<div class="chart-footer"><span class="change">${esc(footerText)}</span><button class="btn" type="button" data-export="${spec.id}">Export</button></div></article>`;
  }
  function renderAnalytics(){results.clear();const metrics=metricsForPage();document.getElementById('filterSummary').textContent='';document.getElementById('mainContent').innerHTML=`<div class="section-heading"><h2>${esc(pages[page][0])}</h2><span class="chart-count">${metrics.length} metrics</span></div><div class="section-links">${metrics.map(s=>`<a href="#metric-${s.id}">${esc(metricTitle(s))}</a>`).join('')}</div><div class="chart-grid">${metrics.map(chartCard).join('')}</div>`;}
  function kcard(label,value,note='',klass=''){return `<div class="card ${klass}"><div class="metric-label">${esc(label)}</div><div class="metric-value">${value}</div><div class="muted">${esc(note)}</div></div>`;}
  function renderKpi(){
    results.clear();
    const norm=value=>String(value||'').trim().toLowerCase().replace(/\s+/g,'_');
    const unprocessedReports=D.reportStoreReady?(D.reports||[]).filter(r=>['awaiting_agency_response','pending_admin_review'].includes(norm(r.status))).length:'—';
    const pendingAds=D.commerceStoreReady?(D.campaigns||[]).filter(r=>['pending_review','pending','awaiting_approval'].includes(norm(r.status))).length:'—';
    const telemetry=D.telemetry||{};
    const systemIssues=telemetry.systemIssues||{total:0,critical:0,error:0,warning:0};
    const paymentErrorCount=(D.paymentErrors||[]).filter(e=>!e.status||String(e.status).toLowerCase()==='unresolved').length;
    const alerts=[
      ['Unresponded Messages',D.adminChatStoreReady?M.unrespondedMessages():'—','unresponded'],
      ['Property Reports (Unprocessed)',unprocessedReports,'complaints'],
      ['Pending Ad Approvals',pendingAds,'ads'],
      ['Fraud Detections',D.fraudStoreReady?M.fraudCount(D.fraudFlags,enabledFraud):'—','fraud'],
      ['Payment Errors',paymentErrorCount,'payments'],
      ['Pending Agency Reviews',D.agencyDirectoryReady?M.pendingAgencies():'—','agents']
    ];
    const users=D.accountDirectoryReady?M.platformAccounts():[],customerUsers=users.filter(a=>a.type==='Client'),agentUsers=users.filter(a=>a.type==='Agency');
    const currentMonth=M.monthStart(D.today),inquiryCreatedDate=q=>String(q.createdAt||'').slice(0,10),todayInquiryCount=D.enquiryStoreReady?(D.enquiries||[]).filter(q=>inquiryCreatedDate(q)===D.today).length:null,yesterdayInquiryCount=D.enquiryStoreReady?(D.enquiries||[]).filter(q=>inquiryCreatedDate(q)===U.addDays(D.today,-1)).length:null;
    const withdrawal=M.withdrawalStats(D.accounts,currentMonth,D.today);
    const delta=(a,b)=>b?((a-b)/b*100).toFixed(1)+'% vs previous day':'No previous-day baseline';
    const mockValue=(value,unit='')=>Number.isFinite(Number(value))?number(Number(value),unit):'—';
    const mockNote=label=>label+' · prototype telemetry only; production source is backend/API.';
    const statusBadge=item=>{const status=item?.status||'Not configured';const cls=/operational|healthy|ok/i.test(status)?'green':'amber';return '<b class="badge '+cls+'">'+esc(status)+'</b>';};
    const publishedCount=D.propertyStoreReady?D.properties.filter(p=>(p.publishStatus||p.status)==='Published'&&!(p.endedAt||p.suspensionDate)).length:null;
    const graphs=['r28','r29','r30','r31','r32'].map(id=>S.metrics.find(s=>s.id===id));
    document.getElementById('mainContent').innerHTML=`
      <div class="section-heading"><h2>Operational alerts</h2><button class="btn" id="fraudSettings">Fraud KPI settings</button></div>
      <div class="cards six">${alerts.map(([label,count,key])=>`<button type="button" class="card alert-card ${['ads','agents'].includes(key)?'amber':'red'}" data-alert="${key}"><div class="metric-label">${label}</div><div class="metric-value">${count}</div><span class="muted">Review details →</span></button>`).join('')}</div>
      <div class="section-heading"><h2>System status</h2></div>
      <div class="status-strip">
        <span>API ${statusBadge(telemetry.api)}</span>
        <span>Database ${statusBadge(telemetry.database)}</span>
        <span>Stripe ${statusBadge(telemetry.paymentGateway)}</span>
        <span>System Issues · 24h <button class="btn" data-alert="logs">${Number(systemIssues.total)||0} →</button> <small>Critical ${Number(systemIssues.critical)||0} · Error ${Number(systemIssues.error)||0} · Warning ${Number(systemIssues.warning)||0}</small></span>
      </div>
      <div class="section-heading"><h2>Platform KPIs</h2><div class="inline-fields"><label>Account type <select id="kpiUserType"><option>All</option><option>Client</option><option>Agency</option></select></label><label>Active window <select id="kpiActiveWindow"><option value="1">DAU</option><option value="7">WAU</option><option value="30">MAU</option></select></label></div></div>
      <div class="cards">
        ${kcard('Total Users',D.accountDirectoryReady?users.length:'—',D.accountDirectoryReady?'Excludes withdrawn accounts · '+customerUsers.length+' Clients / '+agentUsers.length+' Agencies':'Requires synchronized Customer + Agency directories')}
        ${kcard('Active Users','<span id="kpiActiveValue">'+(D.accountDirectoryReady?M.activity(users,D.today,1):'—')+'</span>',D.accountDirectoryReady?'Registered accounts with recorded login/activity in selected window':'Requires synchronized account directory + activity events')}
        ${kcard('Avg Session Time',Number.isFinite(Number(telemetry.avgSessionSeconds))?mockValue(telemetry.avgSessionSeconds)+'s':'—',mockNote('Avg Session Time'))}
        ${kcard("Today's Revenue",mockValue(telemetry.todayRevenue,'JPY'),mockNote("Today's Revenue"))}
        ${kcard('MTD Revenue',mockValue(telemetry.mtdRevenue,'JPY'),mockNote('MTD Revenue'))}
        ${kcard('MRR','—','Requires Subscription Plan Master + active recurring payment/subscription records. Dashboard must not hard-code plan prices.')}
        ${kcard('Total Listed Properties',publishedCount==null?'—':publishedCount,publishedCount==null?'Requires operational/shared Property store.':'Published listings from persisted Property records only.')}
        ${kcard("Today's Inquiries",todayInquiryCount==null?'—':todayInquiryCount,todayInquiryCount==null?'Requires synchronized Inquiry store':delta(todayInquiryCount,yesterdayInquiryCount)+' · NEW Client → Agency property inquiries only; duplicate reopen does not increment')}
      </div>
      <div class="section-heading"><h2>Account changes this month</h2><span class="badge amber">Provisional · ${currentMonth} – ${D.today}</span></div>
      <div class="cards">
        ${kcard('Withdrawals this month',withdrawal.withdrawals,'Explicit account_status_changed → Withdrawn only. Suspend/Ban and inactivity are excluded.','red')}
      </div>
      <div class="section-heading"><h2>Targets and progress</h2><button class="btn" id="targetSettings">Set targets</button></div><div id="targetCards"></div>
      <div class="section-heading"><h2>Trends</h2><a href="end-user-stats-dashboard.html#metric-r56">View withdrawal history →</a></div><div class="chart-grid">${graphs.map(chartCard).join('')}</div>`;
    renderTargets();
    document.getElementById('fraudSettings').onclick=openFraudSettings;document.getElementById('targetSettings').onclick=openTargetSettings;
    const update=()=>{const type=document.getElementById('kpiUserType').value,days=Number(document.getElementById('kpiActiveWindow').value);document.getElementById('kpiActiveValue').textContent=D.accountDirectoryReady?M.activity(users.filter(a=>type==='All'||a.type===type),D.today,days):'—';};
    document.getElementById('kpiUserType').onchange=update;document.getElementById('kpiActiveWindow').onchange=update;
  }
  function openDialog(title,html){const d=document.getElementById('overviewDialog');document.getElementById('dialogTitle').textContent=title;document.getElementById('dialogBody').innerHTML=html;d.showModal();}
  function openFraudSettings(){openDialog('Fraud KPI · alert inclusion',`<p class="muted">Count unique flags with status “unhandled” for enabled alert types. Turning an item off excludes it from this KPI; it does not disable detection or delete flags.</p><form id="fraudForm">${S.alerts.filter(a=>a.fraud).map(a=>`<label class="switch-row"><input type="checkbox" name="${a.id}" ${enabledFraud[a.id]?'checked':''}><span><strong>${esc(a.name)}</strong><p>${esc(a.trigger)}</p><p>${esc(a.target.replace(/\bAgent\b/g,'Agency'))}</p></span></label>`).join('')}<p class="muted">Other automated alerts are not classified as Fraud in the workbook.</p><button type="submit" class="btn primary">Save KPI settings</button></form>`);document.getElementById('fraudForm').onsubmit=e=>{e.preventDefault();S.alerts.filter(a=>a.fraud).forEach(a=>enabledFraud[a.id]=e.target.elements[a.id].checked);storage.set('fraudKpi',enabledFraud);document.getElementById('overviewDialog').close();renderKpi();toast('Fraud KPI settings saved.');};}
  function showAlert(type){
    if(type==='fraud'){const flags=D.fraudFlags.filter(f=>f.status==='unhandled'&&enabledFraud[f.alertId]);openDialog('Unhandled fraud flags',`<p class="muted">${flags.length} included flags. Review the flag; detection alone does not establish fraud.</p><div class="table-wrap"><table><thead><tr><th>Flag</th><th>Alert</th><th>Account</th><th>Detected</th></tr></thead><tbody>${flags.map(f=>`<tr><td>${esc(f.id)}</td><td>${esc(S.alerts.find(a=>a.id===f.alertId)?.name)}</td><td>${esc(f.account)}</td><td>${esc(f.detectedAt)}</td></tr>`).join('')}</tbody></table></div>`);return;}
    if(type==='payments'){const breakdown=M.paymentBreakdown(D.paymentErrors);openDialog('Payment Errors',`<p class="muted">Unique unresolved payment failures and chargebacks, grouped into the five agreed categories.</p>${V.table({rows:breakdown.map(r=>({label:r.category,count:r.count})),columns:[{key:'count',label:'Unresolved',unit:''}]})}<details open><summary>Error details</summary><div class="table-wrap"><table><thead><tr><th>ID</th><th>Category</th><th>Stripe code / reason</th><th>Status</th></tr></thead><tbody>${D.paymentErrors.filter(e=>e.status==='unresolved').map(e=>`<tr><td>${e.id}</td><td>${esc(e.category)}</td><td>${esc(e.code)}</td><td>${e.status}</td></tr>`).join('')}</tbody></table></div></details>`);return;}
    if(type==='logs'){const summary=M.systemIssueSummary(D.logs),logs=summary.issues;openDialog('System Issues · past 24 hours',`<div class="notice">Total ${summary.total} · Critical ${summary.critical} · Error ${summary.error} · Warning ${summary.warning}. User-input validation, minor frontend warnings, INFO and DEBUG events are excluded.</div><div class="table-wrap"><table><thead><tr><th>Occurred</th><th>Severity</th><th>Function / service</th><th>Identifier</th><th>Summary</th><th>Occurrences</th><th>Status</th></tr></thead><tbody>${logs.map(l=>`<tr><td>${esc(l.occurredAt||l.timestamp)}</td><td><span class="badge ${l.severity==='WARN'?'amber':'red'}">${l.severity==='FATAL'?'CRITICAL':esc(l.severity)}</span></td><td>${esc(l.affectedService||l.source)}</td><td>${esc(l.errorCode||l.id)}</td><td>${esc(l.summary||'System issue')}</td><td>${Number(l.occurrenceCount)||1}</td><td>${esc(l.status||'Open')}</td></tr>`).join('')}</tbody></table></div>`);return;}
    const destinations={unresponded:['Unresponded Messages','../messagesupport/admin-messages.html'],complaints:['Unprocessed Property Reports','../property/property-report-management.html'],ads:['Pending Ad Approvals','../monetisation ads/05-booking-approvals.html'],agents:['Pending Agency Reviews','../usermanagement/agent-management.html']};const [title,url]=destinations[type];openDialog(title,`<p>Open the corresponding admin queue to review these items.</p><a class="btn primary" href="${esc(url)}">Open management page →</a>`);
  }
  const targetMetrics={users:'New users',listings:'Published listings'};
  function targetActual(target){
    if(target.metric==='users')return M.platformAccounts(D.accounts,target.end).filter(a=>a.registeredAt&&M.inPeriod(String(a.registeredAt).slice(0,10),target.start,target.end)).length;
    if(target.metric==='listings')return D.properties.filter(p=>p.createdAt&&String(p.createdAt).slice(0,10)<=target.end&&(p.publishStatus||p.status)==='Published'&&!(p.endedAt||p.suspensionDate)).length;
    return null;
  }
  function renderTargets(){const holder=document.getElementById('targetCards');if(!holder)return;holder.innerHTML=targets.length?`<div class="cards">${targets.map(t=>{const actual=targetActual(t);if(actual==null){const sampleActual=Math.max(1,Math.round(Number(t.value)*(.62+((targets.indexOf(t)%4)*.07))));const samplePct=M.ratio(sampleActual,t.value);return `<div class="card"><div class="metric-label">${esc(targetMetrics[t.metric]||t.metric)}</div><div class="metric-value">${number(samplePct)}%</div><div class="target-progress"><span style="width:${Math.min(100,samplePct)}%"></span></div><div class="muted">${number(sampleActual)} / ${number(t.value)} · ${esc(t.start)} – ${esc(t.end)}</div></div>`;}const pct=M.ratio(actual,t.value);return `<div class="card"><div class="metric-label">${esc(targetMetrics[t.metric])}</div><div class="metric-value">${number(pct)}%</div><div class="target-progress"><span style="width:${Math.min(100,pct)}%"></span></div><div class="muted">${number(actual)} / ${number(t.value)} · ${esc(t.start)} – ${esc(t.end)}</div></div>`;}).join('')}</div>`:'<div class="notice">No targets configured. Add a target to start tracking progress.</div>';}
  function openTargetSettings(){openDialog('Target setting',`<form id="targetForm" class="targets-form">${select('targetMetric','Target Metric',Object.entries(targetMetrics))}<label class="field">Start Date<input id="targetStart" type="date" required></label><label class="field">End Date<input id="targetEnd" type="date" required></label><label class="field">Target Value<input id="targetValue" type="number" required min="1" step="1"></label><button class="btn primary">Add target</button></form><div id="savedTargets">${targets.map((t,i)=>`<p class="muted">${esc(targetMetrics[t.metric]||t.metric)} · ${number(t.value)} · ${t.start} – ${t.end} <button class="btn" data-delete-target="${i}">Remove</button></p>`).join('')}</div>`);const valueInput=document.getElementById('targetValue');valueInput.step='1';valueInput.min='1';document.getElementById('targetStart').value=M.monthStart(D.today);document.getElementById('targetEnd').value=U.addDays(M.shiftMonth(M.monthStart(D.today),1),-1);document.getElementById('targetForm').onsubmit=event=>{event.preventDefault();const t={metric:document.getElementById('targetMetric').value,value:Number(document.getElementById('targetValue').value),start:document.getElementById('targetStart').value,end:document.getElementById('targetEnd').value};if(!targetMetrics[t.metric]||!M.validateTarget(t)){toast('Enter valid required dates and a positive whole-number target.');return;}targets.push(t);storage.set('targets',targets);renderTargets();document.getElementById('overviewDialog').close();toast('Target saved.');};}
  const reportTypes={market:'Monthly Market Report',revenue:'Revenue Report',endUsers:'End User Report',agencies:'Agency Report',operations:'Operational Report',custom:'Custom Report Builder',scheduled:'Scheduled Report Delivery',anonymized:'Data Monetization Report'};
  function reportData(type){const rows=M.filteredFacts(filters),users=M.filteredAccounts(filters);if(type==='market'){
      const marketRows=[
        {label:'Jun 2026',salePrice:68400000,rent:184000,listings:1240,deals:86},
        {label:'Jul 2026',salePrice:69200000,rent:186000,listings:1285,deals:91},
        {label:'Aug 2026',salePrice:70100000,rent:188000,listings:1318,deals:94},
        {label:'Sep 2026',salePrice:71300000,rent:191000,listings:1362,deals:102},
        {label:'Oct 2026',salePrice:72500000,rent:194000,listings:1408,deals:108}
      ];
      const result=M.result(marketRows,['salePrice','rent','listings','deals'],'line',
        'Production report requires persisted historical Property snapshots and price/lifecycle events. Current Property state is not reused as historical market data.');
      result.sampleData=true;
      return result;
    }
    if(type==='anonymized'){
      const sampleRows=[
        {label:'Tokyo · Apartment',listings:482,averagePrice:72800000,deals:46},
        {label:'Osaka · Apartment',listings:316,averagePrice:51200000,deals:31},
        {label:'Kanagawa · House',listings:204,averagePrice:63800000,deals:19},
        {label:'Kyoto · Apartment',listings:146,averagePrice:48900000,deals:12}
      ];
      const result=M.result(sampleRows,['listings','averagePrice','deals'],'bar',
        'Phase 2. Aggregated market data only; personal information is excluded. Production export requires anonymization before external distribution.');
      result.sampleData=true;
      return result;
    }
    if(type==='revenue'){
      const payments=(D.succeededPayments||[]).filter(t=>{const date=String(t.date||t.occurredAt||'').slice(0,10);return date&&M.inPeriod(date,filters.start,filters.end);});
      if(!payments.length){
        const sampleRows=[
          {label:'Jun 2026',subscription:820000,addons:92000,sponsored:145000,banner:210000,featured:118000,appraisal:68000,options:54000},
          {label:'Jul 2026',subscription:860000,addons:105000,sponsored:158000,banner:225000,featured:124000,appraisal:72000,options:59000},
          {label:'Aug 2026',subscription:890000,addons:111000,sponsored:162000,banner:238000,featured:139000,appraisal:76000,options:63000},
          {label:'Sep 2026',subscription:930000,addons:126000,sponsored:174000,banner:249000,featured:146000,appraisal:81000,options:67000},
          {label:'Oct 2026',subscription:970000,addons:132000,sponsored:188000,banner:267000,featured:158000,appraisal:85000,options:72000}
        ];
        const sampleResult=M.result(sampleRows,['subscription','addons','sponsored','banner','featured','appraisal','options'],'stacked',
          'Production revenue must be aggregated from completed Stripe payments by category and compared month over month.');
        sampleResult.sampleData=true;
        return sampleResult;
      }
      const category=t=>t.category||t.engine||t.productType||'Other';
      const amount=t=>Number(t.amount)||0;
      const output=M.groupBy(payments,t=>String(t.date||t.occurredAt).slice(0,7)+' · '+category(t),items=>({revenue:items.reduce((n,t)=>n+amount(t),0),payments:items.length}));
      const result=M.result(output,['revenue'],'table','Completed payment ledger records only. No revenue is inferred from listing/ad engagement facts.');
      result.columns.push({key:'payments',label:'Completed payments',unit:''});
      return result;
    }
    if(type==='withdrawalReasons'){
      const events=(D.analyticsEvents||[]).filter(e=>e.type==='account_status_changed'&&e.newStatus==='Withdrawn');
      const rows=[];
      for(const accountType of ['Customer','Agency','Supportal']){
        const master=window.YuushiAnalytics?.masters.withdrawalReasons?.[accountType]||[];
        for(const [code,label] of master){
          const count=events.filter(e=>e.accountType===accountType&&e.withdrawalReasonCode===code&&M.inPeriod((e.withdrawnAt||e.occurredAt||'').slice(0,10),filters.start,filters.end)).length;
          rows.push({label:accountType+' · '+label,accountType,code,count});
        }
      }
      return M.result(rows,['count'],'table','Canonical JHN withdrawal reasons only. Suspend/Ban and inactivity are excluded; Other detail remains free text and is not promoted to a new category.');
    }
    if(type==='reportReasons'){
      const reportLabels=new Map((window.YuushiAnalytics?.masters.reportReasons||[]).map(([code,label])=>[code,label]));
      const dismissLabels=new Map((window.YuushiAnalytics?.masters.reportDismissReasons||[]).map(([code,label])=>[code,label]));
      const rows=[];
      for(const [code,label] of reportLabels){
        const count=(D.reports||[]).filter(r=>r.reason===code).length;
        rows.push({label:'Report Reason · '+label,taxonomy:'Report Reason',code,count});
      }
      for(const [code,label] of dismissLabels){
        const count=(D.reports||[]).filter(r=>r.status==='dismissed'&&r.dismissReason===code).length;
        rows.push({label:'Dismiss Reason · '+label,taxonomy:'Dismiss Reason',code,count});
      }
      return M.result(rows,['count'],'table','Report Reason uses the Customer/Admin C07 reason enum. Dismiss Reason is a separate Admin decision taxonomy; the two are never merged.');
    }
    if(type==='users'||type==='endUsers'||type==='agencies'){
      const selectedAccountType=type==='endUsers'?'Client':type==='agencies'?'Agency':null;const allAccounts=(D.accounts||[]).filter(a=>!selectedAccountType||a.type===selectedAccountType),withdrawEvents=(D.analyticsEvents||[]).filter(e=>e.type==='account_status_changed'&&e.newStatus==='Withdrawn');
      if(!allAccounts.length){
        const sampleRows=[
          {label:'Jun 2026 · End User',total:3520,registrations:164,dormant:302,withdrawals:18,netGrowth:146},
          {label:'Jun 2026 · Agency',total:760,registrations:31,dormant:84,withdrawals:4,netGrowth:27},
          {label:'Jul 2026 · End User',total:3675,registrations:178,dormant:316,withdrawals:20,netGrowth:158},
          {label:'Jul 2026 · Agency',total:800,registrations:35,dormant:86,withdrawals:5,netGrowth:30},
          {label:'Aug 2026 · End User',total:3842,registrations:181,dormant:328,withdrawals:22,netGrowth:159},
          {label:'Aug 2026 · Agency',total:846,registrations:33,dormant:89,withdrawals:5,netGrowth:28},
          {label:'Sep 2026 · End User',total:4010,registrations:202,dormant:337,withdrawals:19,netGrowth:183},
          {label:'Sep 2026 · Agency',total:892,registrations:36,dormant:94,withdrawals:5,netGrowth:31},
          {label:'Oct 2026 · End User',total:4202,registrations:214,dormant:351,withdrawals:23,netGrowth:191},
          {label:'Oct 2026 · Agency',total:934,registrations:37,dormant:97,withdrawals:6,netGrowth:31}
        ];
        const visibleSampleRows=selectedAccountType?sampleRows.filter(row=>row.label.endsWith(selectedAccountType==='Client'?'End User':'Agency')):sampleRows;const sampleResult=M.result(visibleSampleRows,['total','registrations','dormant','withdrawals','netGrowth'],'line',
          'Net Growth = New Registrations − Withdrawals. Production values are calculated from account registration, status-change and session records.');
        sampleResult.columns=sampleResult.columns.map(c=>c.key==='dormant'?{...c,label:'Dormant Users'}:c);
        sampleResult.sampleData=true;
        return sampleResult;
      }
      return M.result(M.buckets(filters.start,filters.end,filters.unit).flatMap(b=>(selectedAccountType?[[selectedAccountType,selectedAccountType==='Client'?'End User':'Agency']]:[['Client','End User'],['Agency','Agency']]).map(([accountType,displayType])=>{
        const pool=allAccounts.filter(a=>a.type===accountType);
        const eventAccountType=accountType==='Client'?'Customer':accountType;const withdrawals=new Set(withdrawEvents.filter(e=>e.accountType===eventAccountType&&M.inPeriod((e.withdrawnAt||e.occurredAt||'').slice(0,10),b.start,b.end)).map(e=>e.eventId||[e.accountId,e.occurredAt].join('|'))).size;
        const newUsers=pool.filter(a=>a.registeredAt&&M.inPeriod(String(a.registeredAt).slice(0,10),b.start,b.end)).length;
        const activeAtEnd=pool.filter(a=>a.registeredAt&&String(a.registeredAt).slice(0,10)<=b.end&&(!a.withdrawnAt||String(a.withdrawnAt).slice(0,10)>b.end)).length;
        const sessionEvents=(D.analyticsEvents||[]).filter(e=>e.type==='session_started'&&e.accountType===eventAccountType&&e.accountId);
        const dormant=pool.filter(a=>{
          if(!a.registeredAt||(a.withdrawnAt&&String(a.withdrawnAt).slice(0,10)<=b.end))return false;
          const accountId=a.id||a.customerId||a.agencyId;
          const last=sessionEvents.filter(e=>String(e.accountId)===String(accountId)&&String(e.occurredAt).slice(0,10)<=b.end).sort((x,y)=>String(y.occurredAt).localeCompare(String(x.occurredAt)))[0];
          const baseline=last?String(last.occurredAt).slice(0,10):String(a.registeredAt).slice(0,10);
          return (Date.parse(b.end)-Date.parse(baseline))/86400000>=30;
        }).length;
        return {label:b.label+' · '+displayType,total:activeAtEnd,registrations:newUsers,dormant,withdrawals,netGrowth:newUsers-withdrawals};
      })),['total','registrations','dormant','withdrawals','netGrowth'],'line','Period aggregates by End User and Agency. Net Growth = New Registrations − Withdrawals.');
    }
    const unresolvedReports=(D.reports||[]).filter(r=>['awaiting_agency_response','pending_admin_review'].includes(String(r.status||'').trim().toLowerCase().replace(/\s+/g,'_'))).length;
    const pendingAds=(D.campaigns||[]).filter(r=>['pending review','pending','awaiting approval'].includes(String(r.status||'').trim().toLowerCase())).length;
    const operationalRows=[
      {label:'Unresponded Messages',count:M.unrespondedMessages()},
      {label:'Property Reports (Unprocessed)',count:unresolvedReports},
      {label:'Pending Ad Approvals',count:pendingAds},
      {label:'Fraud Detections',count:M.fraudCount(D.fraudFlags,enabledFraud)},
      {label:'Payment Errors',count:M.sum(M.paymentBreakdown(D.paymentErrors),'count')},
      {label:'Pending Agency Reviews',count:M.pendingAgencies()},
      {label:'Forgot Password Requests',count:(D.forgotPasswordRequests||[]).filter(r=>!['completed','resolved','closed'].includes(String(r.status||'').toLowerCase())).length}
    ];
    if(operationalRows.every(row=>row.count===0)){
      const sampleRows=[
        {label:'Unresponded Messages',count:12},{label:'Property Reports (Unprocessed)',count:8},
        {label:'Pending Ad Approvals',count:5},{label:'Fraud Detections',count:3},
        {label:'Payment Errors',count:4},{label:'Pending Agency Reviews',count:7},
        {label:'Forgot Password Requests',count:2}
      ];
      const sampleResult=M.result(sampleRows,['count'],'bar','Production report displays current operational queue counts.');
      sampleResult.sampleData=true;
      return sampleResult;
    }
    return M.result(operationalRows,['count'],'bar','Current operational queue snapshot.');
  }
  const builderAxes={month:'Month',date:'Date',prefecture:'Prefecture',city:'City / Ward',transaction:'Transaction type',group:'Property group',subtype:'Property sub-type',station:'Station',line:'Railway line',structure:'Building structure',floorPlan:'Floor plan',member:'Registered Members / Guests',country:'Country',section:'Content section',adType:'Ad type',placement:'Ad placement'};
  const builderMeasures={inquiries:'Property Inquiries',deals:'Agency-recorded Deals',sessions:'Client Sessions',searches:'Search Submissions'};
  function customReport(){
    const axes=[...document.querySelectorAll('input[name="builderAxes"]:checked')].map(o=>o.value);
    const measures=[...document.querySelectorAll('input[name="builderMeasures"]:checked')].map(o=>o.value);
    if(!axes.length||!measures.length){toast('Select at least one dimension and one metric.');return null;}
    const props=new Map(D.properties.map(p=>[p.id,p]));
    const facts=M.filteredFacts(filters);
    const labelFor=(r,key)=>{
      if(key==='month')return String(r.date||'').slice(0,7)||'Unknown';
      if(key==='member')return r.member?'Registered Members':'Guests / Non-Members';
      if(r[key]!=null&&r[key]!=='')return r[key];
      const p=props.get(r.propertyId);return p&&p[key]!=null?p[key]:'Unknown';
    };
    const grouped=M.groupBy(facts,r=>axes.map(key=>labelFor(r,key)).join(' · '),items=>Object.fromEntries(measures.map(k=>[k,M.sum(items,k)])));
    if(facts.length){
      return {data:M.result(grouped,measures,'bar','Based on the selected dimensions, metrics and current common filters.'),axes,measures,sampleData:false};
    }
    const segments=[
      {label:'Tokyo · Apartment',values:[128,42,1860,940]},
      {label:'Osaka · Apartment',values:[96,31,1420,710]},
      {label:'Kanagawa · House',values:[74,24,980,520]},
      {label:'Kyoto · Apartment',values:[52,18,760,390]}
    ];
    const sampleRows=segments.map(segment=>Object.fromEntries([['label',segment.label],...measures.map((metric,index)=>[metric,segment.values[index%segment.values.length]])]));
    const result=M.result(sampleRows,measures,'bar','No matching source facts exist for the selected filters; illustrative values are shown so the report layout can be reviewed.');
    result.sampleData=true;
    return {data:result,axes,measures,sampleData:true};
  }
  function reportReasonBreakdowns(){
    const reportLabels=new Map((window.YuushiAnalytics?.masters.reportReasons||[]).map(([code,label])=>[code,label]));
    const dismissLabels=new Map((window.YuushiAnalytics?.masters.reportDismissReasons||[]).map(([code,label])=>[code,label]));
    const reports=D.reports||[];
    const countBy=(rows,key,labels)=>[...labels].map(([code,label])=>({label,count:rows.filter(r=>r[key]===code).length})).filter(r=>r.count>0);
    return {
      reportReasons:M.result(countBy(reports,'reason',reportLabels),['count'],'bar','Counts from the Customer/Agency Property Report reason enum.'),
      dismissReasons:M.result(countBy(reports.filter(r=>r.status==='dismissed'),'dismissReason',dismissLabels),['count'],'bar','Dismissed reports only, grouped by the Admin Dismiss Reason taxonomy.')
    };
  }
  function renderReports(){results.clear();document.getElementById('filterSummary').textContent='';const types=['market','revenue','endUsers','agencies','operations','anonymized'];document.getElementById('mainContent').innerHTML=`<div class="section-heading"><h2>Standard reports</h2><span class="muted">Data generated from the selected period</span></div><div class="report-grid">${types.map(type=>{const r=reportData(type);results.set('report-'+type,r);return `<article class="card report-card"><h3>${reportTypes[type]}</h3><p>${esc(r.note||({endUsers:'End User accounts, registrations, inactivity, withdrawals and net growth.',agencies:'Agency accounts, registrations, inactivity, withdrawals and net growth.',revenue:'Revenue by subscription tier, category and banner placement.'}[type]||''))}</p><p>${r.rows.length} rows · ${filters.start} – ${filters.end}</p><div class="actions"><button class="btn" data-preview-report="${type}">View report</button><button class="btn primary" data-export="report-${type}">Export</button></div></article>`;}).join('')}</div><div class="section-heading"><h2>Custom report builder</h2></div><div class="card"><div class="filter-grid">
      <fieldset class="field-group"><legend>Dimensions · select one or more</legend><div class="filter-grid">${Object.entries(builderAxes).map(([key,label])=>`<label class="check-field"><input type="checkbox" name="builderAxes" value="${key}"> ${esc(label)}</label>`).join('')}</div></fieldset>
      <fieldset class="field-group"><legend>Metrics · select one or more</legend><div class="filter-grid">${Object.entries(builderMeasures).map(([key,label])=>`<label class="check-field"><input type="checkbox" name="builderMeasures" value="${key}"> ${esc(label)}</label>`).join('')}</div></fieldset>
      <div><label class="field">Shortcut name<input id="shortcutName" placeholder="e.g. Monthly Tokyo property report"></label><div class="actions" style="margin-top:12px"><button class="btn primary" id="buildReport">Preview report</button><button class="btn" id="saveShortcut">Save shortcut</button></div><p class="muted">Combine multiple dimensions and metrics. The current common date range and period unit are applied to the preview and CSV export.</p></div></div><div id="customReportOutput"></div><div class="actions" id="shortcuts">${savedReports.map((r,i)=>`<button class="btn" data-shortcut="${i}">${esc(r.name)}</button><button class="btn" data-delete-shortcut="${i}" aria-label="Delete ${esc(r.name)}">×</button>`).join('')}</div></div><div class="section-heading"><h2>Scheduled report delivery</h2></div><div class="card"><p class="notice">Configure when each report is generated and emailed. Recurrence follows Japan Standard Time (JST).</p><form id="scheduleForm"><div class="filter-grid"><div class="field-group"><h3>Report</h3>${select('scheduleType','Reports',Object.entries(reportTypes).filter(([key])=>key!=='scheduled'),true)}<p class="muted">Select one or more reports.</p></div><div class="field-group"><h3>Delivery schedule</h3><div class="filter-primary">${input('scheduleStart','Start date')}${select('scheduleFrequency','Frequency',['Daily','Weekly','Monthly'])}${input('scheduleTime','Delivery time (JST)','time')}${input('scheduleEnd','End date (optional)')}</div><p class="muted" id="schedulePattern">Runs every day from the start date until the end date.</p><p class="muted" id="scheduleNextRun">Select a start date and time to preview the first delivery.</p></div><div class="field-group"><h3>Recipients</h3><label class="field">Recipient email addresses<input type="text" id="scheduleRecipients" required placeholder="team@example.com, manager@example.com"></label></div><div class="field-group"><h3>Report period</h3><p class="muted">Each delivery uses the report filters selected above when the schedule is saved. Change the filters before creating a new schedule to use a different reporting period.</p></div></div><button class="btn primary" type="submit">Save schedule</button></form><div id="scheduleList"></div></div><div class="section-heading"><h2>Monthly market snapshot</h2></div><div class="notice">The previous completed month is generated automatically when this page opens. <button class="btn" id="monthlySnapshot">Download latest completed month</button></div>`;
    document.querySelector('input[name="builderAxes"]').checked=true;document.querySelector('input[name="builderMeasures"]').checked=true;document.getElementById('scheduleTime').value='09:00';document.getElementById('scheduleStart').value=D.today;document.getElementById('scheduleStart').min=D.today;document.getElementById('scheduleEnd').min=D.today;document.getElementById('scheduleFrequency').addEventListener('change',updateSchedulePreview);document.getElementById('scheduleStart').addEventListener('change',updateSchedulePreview);document.getElementById('scheduleEnd').addEventListener('change',updateSchedulePreview);document.getElementById('scheduleTime').addEventListener('change',updateSchedulePreview);updateSchedulePreview();
    document.getElementById('buildReport').onclick=()=>{const r=customReport();if(r){results.set('custom',r.data);document.getElementById('customReportOutput').innerHTML='<div class="section-heading"><h3>Report preview</h3><span class="muted">'+r.axes.length+' dimensions · '+r.measures.length+' metrics · '+r.data.rows.length+' rows · '+filters.start+' – '+filters.end+'</span></div><div class="chart-wrap">'+V.render(r.data)+'</div>'+V.table(r.data)+'<div class="actions"><button class="btn primary" data-export="custom">Export CSV</button></div>';}};
    document.getElementById('saveShortcut').onclick=()=>{const r=customReport(),name=document.getElementById('shortcutName').value.trim();if(!r||!name){toast('Name the shortcut before saving.');return;}savedReports.push({name,axes:r.axes,measures:r.measures,filters:{...filters}});storage.set('reportShortcuts',savedReports);renderReports();toast('Report shortcut saved.');};
    document.getElementById('scheduleForm').onsubmit=e=>{e.preventDefault();const reports=[...document.getElementById('scheduleType').selectedOptions].map(o=>o.value),frequency=document.getElementById('scheduleFrequency').value,startDate=document.getElementById('scheduleStart').value,endDate=document.getElementById('scheduleEnd').value,time=document.getElementById('scheduleTime').value,recipients=[...new Set(document.getElementById('scheduleRecipients').value.split(',').map(s=>s.trim()).filter(Boolean))];const invalid=recipients.filter(email=>!/^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/.test(email));if(!reports.length||!startDate||!time||invalid.length||!recipients.length|| (endDate&&endDate<startDate)){toast('Select at least one report and check the start date, delivery time, recipient email addresses and end date.');return;}schedules.push({id:Date.now(),reports,frequency,startDate,endDate:endDate||null,time,recipients,filters:{...filters},status:'Active',createdAt:new Date().toISOString()});storage.set('reportSchedules',schedules);renderScheduleList();document.getElementById('scheduleForm').reset();document.getElementById('scheduleStart').value=D.today;document.getElementById('scheduleTime').value='09:00';updateSchedulePreview();toast('Schedule saved.');};renderScheduleList();
    const old={...filters},end=U.addDays(M.monthStart(D.today),-1);filters={...defaults,start:M.monthStart(end),end,unit:'Monthly'};const snapshot=reportData('market');filters=old;storage.set('latestMonthlyMarketSnapshot',{month:end.slice(0,7),generatedAt:new Date().toISOString(),...snapshot});document.getElementById('monthlySnapshot').onclick=()=>downloadCSV('monthly-market-'+end.slice(0,7)+'.csv',[{key:'label',label:'Period / Segment'},...snapshot.columns],snapshot.rows);
  }
  function schedulePattern(s){const start=s.startDate||'Not set',end=s.endDate?' until '+s.endDate:' · no end date';const day=start&&start!=='Not set'?new Intl.DateTimeFormat('en-US',{weekday:'long',timeZone:'Asia/Tokyo'}).format(new Date(start+'T12:00:00+09:00')):'';if(s.frequency==='Weekly')return 'Every '+day+end;if(s.frequency==='Monthly')return 'Monthly on day '+(start!=='Not set'?Number(start.slice(-2)):'—')+end;return 'Every day'+end;}function updateSchedulePreview(){const frequency=document.getElementById('scheduleFrequency').value,start=document.getElementById('scheduleStart').value,end=document.getElementById('scheduleEnd').value,time=document.getElementById('scheduleTime').value,pattern=document.getElementById('schedulePattern'),next=document.getElementById('scheduleNextRun');if(!pattern||!next)return;const draft={frequency,startDate:start,endDate:end};pattern.textContent=frequency==='Weekly'?'Runs every '+(start?new Intl.DateTimeFormat('en-US',{weekday:'long',timeZone:'Asia/Tokyo'}).format(new Date(start+'T12:00:00+09:00')):'selected weekday')+' from the start date'+(end?' until '+end:'. No end date is set.'):frequency==='Monthly'?'Runs monthly on calendar day '+(start?Number(start.slice(-2)):'of the start date')+' from the start date'+(end?' until '+end:'. No end date is set.'):'Runs every day from the start date'+(end?' until '+end:'. No end date is set.');next.textContent=start&&time?'First planned delivery: '+start+' at '+time+' JST'+(end&&end<start?' · End date must be on or after start date.':''):'Select a start date and time to preview the first delivery.';}function renderScheduleList(){document.getElementById('scheduleList').innerHTML=schedules.length?`<div class="table-wrap"><table><thead><tr><th>Reports</th><th>Repeat pattern</th><th>Time (JST)</th><th>Recipients</th><th>Status</th><th>Actions</th></tr></thead><tbody>${schedules.map((s,i)=>{const reports=s.reports||(s.report?[s.report]:[]);return `<tr><td>${esc(reports.map(key=>reportTypes[key]||key).join(', '))}</td><td>${esc(schedulePattern(s))}</td><td>${esc(s.time||'—')}</td><td>${(s.recipients||[]).length} recipient(s)</td><td>${esc(s.status||'Active')}</td><td><button class="btn" data-view-recipients="${i}">View recipients</button> <button class="btn" data-delete-schedule="${i}">Remove</button></td></tr>`;}).join('')}</tbody></table></div>`:'<p class="muted">No schedules configured.</p>';}
  function render(){if(page==='kpi')renderKpi();else if(page==='reports')renderReports();else renderAnalytics();}
  document.getElementById('overviewApp').innerHTML=`<div class="overview-shell"><header class="page-header"><div><div class="eyebrow">YUUSHI · Admin Overview</div><h1>${esc(pages[page][0])}</h1><p class="subtitle">${new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())} ${new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date())} JST</p></div><div class="actions"><button class="btn" id="exportPage">Export page CSV</button><button class="btn primary" id="refreshPage">Refresh</button></div></header>${page==='kpi'?'':filterMarkup()}<main id="mainContent"></main><dialog id="overviewDialog" aria-labelledby="dialogTitle"><div class="dialog-title"><h2 id="dialogTitle"></h2><button class="close-button" id="closeDialog" aria-label="Close">×</button></div><div id="dialogBody"></div></dialog><div class="toast" id="toast" role="status" hidden></div></div>`;
  if(page!=='kpi'){
    restoreFilters();
    for(const id of ['transaction','comparison'])document.getElementById(id).addEventListener('change',updateDependentFilters);document.getElementById('overviewFilters').addEventListener('change',e=>{const t=e.target;if(t.matches('[data-filter-group]')){const key=t.dataset.filterGroup==='propertyTypeOptions'?'propertyTypes':t.dataset.filterGroup==='structureOptions'?'structures':'floorPlans';const values=[...document.querySelectorAll('[data-filter-group="'+t.dataset.filterGroup+'"]:checked')].map(x=>x.value);const hidden=document.getElementById(key);[...hidden.options].forEach(o=>o.selected=values.includes(o.value));}if(t.matches('[data-pref]')){const values=[...document.querySelectorAll('[data-pref]:checked')].map(x=>x.dataset.pref);[...document.getElementById('prefectures').options].forEach(o=>o.selected=values.includes(o.value));}if(t.matches('[data-city]')){const values=[...document.querySelectorAll('[data-city]:checked')].map(x=>x.value);[...document.getElementById('cities').options].forEach(o=>o.selected=values.includes(o.value));}if(t.matches('[data-line]')){document.querySelectorAll('[data-line]').forEach(x=>{if(x!==t)x.checked=false;});document.getElementById('line').value=t.checked?t.dataset.line:'';}if(t.matches('[data-station]')){const values=[...document.querySelectorAll('[data-station]:checked')].map(x=>x.value);[...document.getElementById('stations').options].forEach(o=>o.selected=values.includes(o.value));}});document.getElementById('overviewFilters').addEventListener('click',e=>{const b=e.target.closest('[data-range]');if(!b)return;const key=b.dataset.range;document.getElementById(key+'Min').value=b.dataset.min;document.getElementById(key+'Max').value=b.dataset.max;});for(const id of ['regionSearch','railwaySearch'])document.getElementById(id).addEventListener('input',e=>{const q=e.target.value.toLowerCase();const target=id==='regionSearch'?'regionOptions':'railwayOptions';document.querySelectorAll('#'+target+' details').forEach(node=>node.hidden=q&&!node.textContent.toLowerCase().includes(q));});
    document.getElementById('overviewFilters').onsubmit=e=>{e.preventDefault();const next=readFilters(),error=validateFilters(next);const errorEl=document.getElementById('filterError');errorEl.hidden=!error;errorEl.textContent=error;if(error)return;filtersApplied=true;filters=next;storage.set('filters',filters);render();};
    document.getElementById('resetFilters').onclick=()=>{filtersApplied=false;filters={...defaults};storage.set('filters',filters);restoreFilters();render();};
  }
  document.getElementById('refreshPage').onclick=()=>{render();toast('Figures updated.');};
  document.getElementById('exportPage').onclick=()=>{const rows=[...results].flatMap(([metric,r])=>r.rows.flatMap(row=>r.columns.map(c=>({metric,segment:row.label,measure:c.label,value:row[c.key],unit:c.unit}))));downloadCSV(page+'-'+D.today+'.csv',[{key:'metric',label:'Metric'},{key:'segment',label:'Period / Segment'},{key:'measure',label:'Measure'},{key:'value',label:'Value'},{key:'unit',label:'Unit'}],rows);};
  document.getElementById('closeDialog').onclick=()=>document.getElementById('overviewDialog').close();
  document.getElementById('overviewDialog').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close();});
  document.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;
    if(button.dataset.export)exportResult(button.dataset.export);
    if(button.dataset.alert)showAlert(button.dataset.alert);
    if(button.dataset.sort){const table=button.closest('table'),body=table.tBodies[0],column=Number(button.dataset.sortColumn),direction=button.dataset.direction==='desc'?'asc':'desc';button.dataset.direction=direction;[...body.rows].sort((a,b)=>{const av=a.cells[column].dataset.value,bv=b.cells[column].dataset.value;if(av==='')return bv===''?0:1;if(bv==='')return -1;return (Number(av)-Number(bv))*(direction==='asc'?1:-1);}).forEach(row=>body.appendChild(row));}
    if(button.dataset.previewReport){const r=results.get('report-'+button.dataset.previewReport);const chart=['market','revenue','users','operations','anonymized'].includes(button.dataset.previewReport)?'<div class="chart-wrap">'+V.render(r)+'</div>':'';const sample='';openDialog(reportTypes[button.dataset.previewReport],sample+chart+V.table(r));}
    
    if(button.dataset.deleteTarget!==undefined){targets.splice(Number(button.dataset.deleteTarget),1);storage.set('targets',targets);renderTargets();document.getElementById('overviewDialog').close();openTargetSettings();}
    if(button.dataset.viewRecipients!==undefined){const schedule=schedules[Number(button.dataset.viewRecipients)];if(schedule)openDialog('Schedule recipients',`<div class="recipient-list"><p>${(schedule.recipients||[]).length} recipient(s)</p><ul>${(schedule.recipients||[]).map(email=>`<li>${esc(email)}</li>`).join('')}</ul></div>`);}
    if(button.dataset.deleteSchedule!==undefined){schedules.splice(Number(button.dataset.deleteSchedule),1);storage.set('reportSchedules',schedules);renderScheduleList();}
    if(button.dataset.deleteShortcut!==undefined){savedReports.splice(Number(button.dataset.deleteShortcut),1);storage.set('reportShortcuts',savedReports);renderReports();}
    if(button.dataset.shortcut!==undefined){const shortcut=savedReports[Number(button.dataset.shortcut)];filters={...defaults,...shortcut.filters};storage.set('filters',filters);restoreFilters();renderReports();document.querySelectorAll('input[name="builderAxes"]').forEach(o=>o.checked=(shortcut.axes||[]).includes(o.value));document.querySelectorAll('input[name="builderMeasures"]').forEach(o=>o.checked=(shortcut.measures||[]).includes(o.value));document.getElementById('buildReport').click();}
  });
  document.addEventListener('change',e=>{if(e.target.dataset.series){const id=e.target.dataset.series,series=choices.get(id)?.series||['sessions','clicks','saves','inquiries','deals'];choices.set(id,{...choices.get(id),series:e.target.checked?[...new Set([...series,e.target.value])]:series.filter(key=>key!==e.target.value),measure:''});document.getElementById('metric-'+id).outerHTML=chartCard(S.metrics.find(s=>s.id===id));return;}const id=e.target.dataset.measure||e.target.dataset.breakdown||e.target.dataset.rankBy;if(!id)return;choices.set(id,{...choices.get(id),[e.target.dataset.measure?'measure':e.target.dataset.rankBy?'rankBy':'breakdown']:e.target.value});const spec=S.metrics.find(s=>s.id===id);const old=document.getElementById('metric-'+id);if(old)old.outerHTML=chartCard(spec);});
  render();
  if(window.parent && window.parent!==window){try{const target='overview/'+pages[page][1];window.parent.document.querySelectorAll('.menu-item[data-content]').forEach(link=>link.classList.toggle('active',link.dataset.content===target));}catch{}}
  if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
})();
