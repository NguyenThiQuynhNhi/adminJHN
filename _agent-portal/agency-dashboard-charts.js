/* Small SVG/HTML renderers shared by the dashboard and its browser checks. */
(function(root){
  'use strict';
  const M=root.AgencyDashboardModel;
  const colors=['#b66744','#5d8874','#7796ac','#b59a59','#987ea6','#cd9272','#719b95'];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number=v=>typeof v==='number'&&Number.isFinite(v);
  const format=(v,unit='')=>v==null?'N/A':typeof v==='boolean'?(v?'Yes':'No'):number(v)?(unit==='JPY'?'¥':'')+v.toLocaleString('en-US',{maximumFractionDigits:unit==='JPY'?0:1})+(unit==='%'?'%':unit&&unit!=='JPY'?' '+unit:''):esc(v);
  const label=s=>({scheduledActionAt:'Scheduled Action',staffId:'Staff',onSale:'On Sale',soldOut:'Sold Out',organic:'Organic',paid:'Paid',inquiries:'Inquiries',views:'Views'})[s]||s.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^./,c=>c.toUpperCase());
  const dateText=v=>Number.isFinite(M.time(v))?new Date(M.time(v)).toLocaleString('en-GB',{timeZone:'Asia/Tokyo',dateStyle:'medium',timeStyle:'short'})+' JST':'—';
  function table(w,r){
    const m=M.definition(w), rows=r.rows||[];
    if(w.systemWidget===74&&r.supporting){const q=r.supporting;return [['Used','Limit','Remaining','Utilization (%)'],[q.used,q.limit,q.remaining,q.utilization??'N/A']];}
    if(w.systemWidget===58&&r.supporting){const q=r.supporting;return [['Plan','Paid Cycle End','Auto-renewal','Confirmation Required'],[r.value,dateText(q.cycleEnd),q.autoRenewal?'On':'Paused',q.confirmationRequired?'Yes':'No']];}
    if(w.systemWidget===79)return [['Campaign','Status','Start','End','Locked Price (JPY)','Review Deadline','Hours Remaining'],...rows.map(row=>{const review=r.supporting?.reviews.find(v=>v.id===row.id);return [row.title,row.status,dateText(row.startDate),dateText(row.endDate),row.lockedPrice,review?dateText(review.reviewDeadline):'—',review?Math.max(review.hoursRemaining,0):'—'];})];
    if(w.systemWidget===73)return [['Notice','Details','Relevant Date'],...rows.map(row=>[row.title,row.summary||'',dateText(row.date)])];
    if(r.shape==='scalar')return [['Metric','Value','Unit'],[w.title||m.title,r.value??'N/A',r.unit||'']];
    if(r.shape==='multi')return [['Group',...(r.series||[]).map(label)],...rows.map(row=>[row.label,...r.series.map(s=>row[s]??'N/A')])];
    if(['category','time','pipeline'].includes(r.shape))return [['Group',w.title||m.title,'Unit'],...rows.map(row=>[row.label,row.value??'N/A',r.unit||''])];
    if(r.shape==='ranked'&&m.no===103)return [['Rank','Property',(w.rankField||m.field)==='conversion'?'Views → Inquiry (%)':label((w.rankField||m.field).split('.').pop()),'Status'],...rows.map((row,i)=>[i+1,row.property||row.title,row.value,row.status])];
    if(r.shape==='ranked')return [['Rank','Property','Views','Inquiries','Keep','Status'],...rows.map((row,i)=>[i+1,row.property||row.title,row.organic?.views,row.organic?.inquiries,row.organic?.keep,row.status])];
    const keys=['name','property','client','status','agent','publishedDate','confirmedSoldAt','scheduledActionAt','start','end','due','expiryDate','date','modified','lastSignIn','acceptedOn','value','priceBasis','areaId','city','tier','expiresAt','adType','packageMonths','startDate','endDate','reviewDeadline','lockedPrice','impressions','clicks','keep','ctr','kpr','amount','engine'].filter(k=>rows.some(row=>row[k]!=null));
    if(!keys.length)keys.push('id');
    return [keys.map(k=>label(k)+(['lockedPrice','amount'].includes(k)||k==='value'&&r.unit==='JPY'?' (JPY)':['ctr','kpr'].includes(k)?' (%)':k==='responseMinutes'?' (minutes)':'')),...rows.map(row=>keys.map(k=>row[k]??'N/A'))];
  }
  function render(w,r){
    const m=M.definition(w), allowed=M.charts(m,w,r), chart=allowed.includes(w.chart)?w.chart:allowed[0];
    const state=(title,text)=>`<div class="state"><div><strong>${esc(title)}</strong><p>${esc(text)}</p></div></div>`;
    if(['locked','suppressed','unavailable','invalid'].includes(r.state))return state(({locked:'Access restricted',suppressed:'Performance details hidden',unavailable:'Unable to display data',invalid:'Check filters'})[r.state],r.message);
    if(r.state==='empty')return state('No results in this view','Try a different period or filter.');
    if(!w.detailsOnly&&w.systemWidget===74&&r.supporting){const q=r.supporting;return `<div data-system-widget="74"><dl class="support-grid"><div data-supporting-field="156"><dt>Used</dt><dd>${format(q.used)}</dd></div><div data-supporting-field="157"><dt>Limit</dt><dd>${format(q.limit)}</dd></div><div><dt>Remaining</dt><dd>${format(q.remaining)}</dd></div><div data-supporting-field="159"><dt>Utilization</dt><dd>${format(q.utilization,'%')}</dd></div></dl>${q.utilization==null?'':`<progress class="progress" max="100" value="${Math.min(q.utilization,100)}" aria-label="Quota utilization"></progress>`}</div>`;}
    if(!w.detailsOnly&&w.systemWidget===58&&r.supporting){const q=r.supporting;return `<div data-system-widget="58"><div class="kpi-value text-value">${format(r.value)}</div><dl class="support-grid"><div data-supporting-field="299"><dt>Paid cycle end</dt><dd>${esc(dateText(q.cycleEnd))}</dd></div><div data-supporting-field="300"><dt>Auto-renewal</dt><dd>${q.autoRenewal?'On':'Paused'}</dd></div><div data-supporting-field="301"><dt>Renewal confirmation</dt><dd>${q.confirmationRequired?'Required':'Not required'}</dd></div></dl></div>`;}
    const note=(r.message?`<p class="note">${esc(r.message)}</p>`:'')+(r.ignored?.length?`<p class="note">Not applied: ${esc(r.ignored.join(', '))}.</p>`:'')+(w.compare?`<p class="change">${r.change==null?'N/A':(r.change>=0?'+':'')+format(r.change,'%')} vs previous period</p>`:'');
    const rows=r.rows||[], kpi=`<div class="kpi-value ${typeof r.value==='string'?'text-value':''}">${format(r.value,r.unit)}</div>`;
    let html='';
    if(w.systemWidget===73&&!w.detailsOnly)return `<div data-system-widget="73" class="list">${rows.map(row=>`<div class="list-row"><div><strong>${esc(row.title)}</strong><p class="list-sub">${esc(row.summary||'')}</p><span class="list-sub" ${row.noticeSource==='campaigns'?'data-supporting-field="271"':row.noticeSource==='subscription'?'data-supporting-field="301"':''}>${row.noticeSource==='campaigns'?'Review deadline':row.noticeSource==='subscription'?'Paid cycle end':'Recorded'} · ${esc(dateText(row.date))}</span></div></div>`).join('')}</div>`;
    if(chart==='kpi')html=kpi;
    else if(chart==='progress')html=kpi+(number(r.value)?`<progress class="progress" max="100" value="${Math.max(0,Math.min(r.value,100))}" aria-label="${esc(w.title||m.title)}"></progress>`:'');
    else if(['table','ranked'].includes(chart)){
      const data=table(w,r);html=`<div class="table-wrap"><table><thead><tr>${data[0].map(v=>`<th>${esc(v)}</th>`).join('')}</tr></thead><tbody>${data.slice(1).map(row=>`<tr>${row.map(v=>`<td>${number(v)?format(v):esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    } else if(['list','timeline'].includes(chart)){
      const field=r.dateField||m.date;
      const data=chart==='timeline'?[...rows].sort((a,b)=>M.time(a[field])-M.time(b[field])):rows;
      html=`<div class="${chart}">${data.map(row=>{const date=row[field]||row.start||row.date||row.acceptedOn;return `<div class="list-row"><div><strong>${esc(row.title||row.property||row.name||row.label||row.id)}</strong><div class="list-sub">${esc([row.property&&!String(row.title).includes(row.property)?row.property:null,row.client,row.agent].filter(Boolean).join(' · '))}</div>${date?`<time class="list-sub" datetime="${esc(date)}">${esc(new Date(M.time(date)).toLocaleString('en-GB',{timeZone:'Asia/Tokyo',dateStyle:'medium',timeStyle:'short'}))} JST</time>`:''}</div><span class="list-sub">${esc(row.status??(row.value!=null?format(row.value,r.unit):row.city||''))}</span></div>`;}).join('')}</div>`;
    } else {
      const data=r.shape==='ranked'?rows.map(row=>({label:row.property||row.title||row.label||row.id,value:row.value})):rows;
      const series=r.shape==='multi'?r.series:['value'];
      const values=data.flatMap(row=>series.map(s=>row[s])).filter(number);
      if(!values.length)return `<div data-chart="${chart}">${state('N/A','There is no valid denominator or numeric observation in this view.')}</div>`+note;
      const legend=r.shape==='multi'?`<div class="legend">${series.map((s,i)=>`<span><i style="background:${colors[i%colors.length]}"></i>${esc(label(s))}</span>`).join('')}</div>`:'';
      const summary=data.map(row=>row.label+': '+series.map(s=>label(s)+' '+format(row[s],r.unit)).join(', ')).join('; ');
      if(['doughnut','pie'].includes(chart)){
        const total=data.reduce((s,row)=>s+Math.max(row.value||0,0),0);let angle=0;
        if(!total)html=state('0','All categories have zero values.');
        else {const gradient=data.map((row,i)=>{const from=angle;angle+=Math.max(row.value||0,0)/total*100;return `${colors[i%colors.length]} ${from}% ${angle}%`;}).join(',');html=`<div class="donut-wrap"><div class="donut ${chart==='pie'?'pie':''}" role="img" aria-label="${esc(summary)}" style="background:conic-gradient(${gradient})">${chart==='doughnut'?`<div class="donut-inner">${format(total,r.unit)}</div>`:''}</div><div class="legend">${data.map((row,i)=>`<span><i style="background:${colors[i%colors.length]}"></i>${esc(row.label)} · ${format(row.value,r.unit)}</span>`).join('')}</div></div>`;}
      } else if(['bar','funnel'].includes(chart)){
        const min=Math.min(0,...values),max=Math.max(1,...values),span=max-min,zero=-min/span*100;
        html=`<div class="bars ${chart==='funnel'?'funnel':''}">${data.map((row,i)=>`<div class="bar-item"><span class="bar-label" title="${esc(row.label)}">${esc(row.label)}</span><div class="bar-track"><div class="bar-fill" style="margin-left:${number(row.value)?(Math.min(row.value,0)-min)/span*100:zero}%;width:${Math.abs(row.value||0)/span*100}%;background:${colors[i%colors.length]}"></div></div><span class="bar-value">${format(row.value,r.unit)}</span></div>`).join('')}</div>`;
      } else {
        const width=620,height=280,left=65,right=20,top=20,bottom=65,plotW=width-left-right,plotH=height-top-bottom;
        const min=Math.min(0,...values),max=Math.max(1,...values,...(chart==='stacked'?data.map(row=>series.reduce((s,k)=>s+Math.max(row[k]||0,0),0)):[])),span=max-min;
        const y=v=>top+(max-v)/span*plotH;
        const times=data.map(row=>M.time(row.label));const temporal=times.every(Number.isFinite)&&times.length>1;
        const x=i=>left+(temporal?(times[i]-times[0])/Math.max(times[times.length-1]-times[0],1):i/Math.max(data.length-1,1))*plotW;
        let svg=Array.from({length:5},(_,i)=>{const v=min+span*i/4;return `<line x1="${left}" y1="${y(v)}" x2="${width-right}" y2="${y(v)}" stroke="#e9e1d6"/><text x="${left-7}" y="${y(v)+4}" text-anchor="end">${esc(format(v))}</text>`;}).join('');
        if(['line','multiline','area'].includes(chart)){
          series.forEach((s,k)=>{let segment=[];const draw=()=>{if(!segment.length)return;const points=segment.map(i=>`${x(i)},${y(data[i][s])}`).join(' ');if(chart==='area')svg+=`<polygon points="${x(segment[0])},${y(0)} ${points} ${x(segment[segment.length-1])},${y(0)}" fill="${colors[k]}" opacity=".18"/>`;svg+=`<polyline points="${points}" fill="none" stroke="${colors[k%colors.length]}" stroke-width="2.5"/>`;segment=[];};data.forEach((row,i)=>{if(number(row[s])){segment.push(i);svg+=`<circle cx="${x(i)}" cy="${y(row[s])}" r="3" fill="${colors[k%colors.length]}"><title>${esc(row.label)} · ${esc(label(s))}: ${format(row[s],r.unit)}</title></circle>`;}else draw();});draw();});
          data.forEach((row,i)=>{if(i===0||i===data.length-1||i%Math.max(1,Math.ceil(data.length/5))===0)svg+=`<text x="${x(i)}" y="${height-bottom+23}" text-anchor="middle">${esc(row.label)}</text>`;});
        } else {
          const slot=plotW/Math.max(data.length,1);
          data.forEach((row,i)=>{let stack=0;const grouped=chart==='grouped';series.forEach((s,k)=>{const v=row[s];if(!number(v))return;const bw=slot*.72/(grouped?series.length:1),xx=left+slot*i+slot*.14+(grouped?k*bw:0),from=chart==='stacked'?stack:0,to=from+v;svg+=`<rect x="${xx}" y="${Math.min(y(from),y(to))}" width="${Math.max(bw-1,1)}" height="${Math.abs(y(from)-y(to))}" rx="2" fill="${colors[(series.length===1?i:k)%colors.length]}"><title>${esc(row.label)} · ${esc(label(s))}: ${format(v,r.unit)}</title></rect>`;stack=to;});if(i%Math.max(1,Math.ceil(data.length/8))===0)svg+=`<text transform="translate(${left+slot*(i+.5)},${height-bottom+16}) rotate(-25)" text-anchor="end">${esc(String(row.label).slice(0,24))}</text>`;});
        }
        html=legend+`<svg class="dashboard-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(summary)}"><title>${esc(w.title||m.title)}${r.unit?' ('+esc(r.unit)+')':''}</title>${svg}</svg>`;
      }
    }
    const deadlines=m.no===76&&!r.grouped&&r.supporting?.reviews.length?`<div data-supporting-field="271" class="list-sub">${r.supporting.reviews.map(v=>`${esc(v.title)} · Review deadline ${esc(dateText(v.reviewDeadline))} (${format(Math.max(v.hoursRemaining,0),'hours')} remaining)`).join('<br>')}</div>`:'';
    return `<div data-chart="${chart}">${html}</div>`+deadlines+note;
  }
  root.AgencyDashboardCharts={render,table};
})(window);
