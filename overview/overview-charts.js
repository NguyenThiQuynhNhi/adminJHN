(function(root){
  'use strict';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const colors=['#a97948','#4a7196','#4e9277','#c09344','#9b739e','#be7064'];
  const number=(value,unit='')=>value===null||!Number.isFinite(Number(value))?'—':(unit.startsWith('JPY')?'¥':'')+Number(value).toLocaleString('en-US',{maximumFractionDigits:unit==='%'?2:Number(value)<10?2:0})+(unit==='%'?'%':'');
  function table(result,sortKey=null){const rows=[...result.rows];if(sortKey)rows.sort((a,b)=>Number(b[sortKey])-Number(a[sortKey]));return `<div class="table-wrap"><table><thead><tr><th>Period / Segment</th>${result.columns.map((c,i)=>`<th><button type="button" data-sort="${esc(c.key)}" data-sort-column="${i+1}">${esc(c.label)}${c.unit?' ('+c.unit+')':''} ↕</button></th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.label)}</td>${result.columns.map(c=>`<td data-value="${r[c.key]===null?'':esc(r[c.key])}">${number(r[c.key],c.unit)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
  function render(result,chosen){
    if(!result.rows.length)return '<div class="empty">No data for the selected filters.<br>Adjust the period or clear a filter.</div>';
    // A time + segment label represents separate series, never a single zig-zag line.
    if(['line','stacked'].includes(result.kind)&&result.rows.some(r=>String(r.label).includes(' · '))){
      const metric=result.columns.find(c=>c.key===chosen)||result.columns[0],segments=[...new Set(result.rows.map(r=>String(r.label).split(' · ').slice(1).join(' · ')))],periods=[...new Set(result.rows.map(r=>String(r.label).split(' · ')[0]))].sort();
      const columns=segments.map((s,i)=>({key:'segment'+i,label:s+' · '+metric.label,unit:metric.unit}));
      result={...result,columns,rows:periods.map(p=>({label:p,...Object.fromEntries(segments.map((s,i)=>['segment'+i,result.rows.find(r=>r.label===p+' · '+s)?.[metric.key]??null]))}))};chosen=null;
    }
    const all=result.columns,primary=all.find(c=>c.key===chosen)||all[0];
    const sameUnit=all.filter(c=>c.unit===primary.unit);
    const columns=result.kind==='paired'?all.filter(c=>c.key.replace(/^(member|guest)/,'')===primary.key.replace(/^(member|guest)/,'')):chosen?[primary]:['line','stacked','funnel'].includes(result.kind)?sameUnit.slice(0,6):[primary];
    const rows=result.rows;
    if(result.kind==='table')return table(result,primary.key);
    if(result.kind==='combo'&&!chosen){
      const max=Math.max(...rows.map(r=>r.members+r.guests),1),maxRate=Math.max(...rows.map(r=>r.registrationCvr),1),step=520/rows.length,y=value=>180-value/max*150;
      const bars=rows.map((r,i)=>{const x=50+i*step,w=Math.max(1,step*.65);return `<rect x="${x}" y="${y(r.members)}" width="${w}" height="${r.members/max*150}" fill="${colors[0]}"><title>${esc(r.label)} Members: ${number(r.members)}</title></rect><rect x="${x}" y="${y(r.members+r.guests)}" width="${w}" height="${r.guests/max*150}" fill="${colors[1]}"><title>${esc(r.label)} Guests: ${number(r.guests)}</title></rect>${i%Math.max(1,Math.ceil(rows.length/5))===0?`<text x="${x}" y="201">${esc(r.label)}</text>`:''}`;}).join('');
      return `<svg viewBox="0 0 620 220" role="img" aria-label="Member and guest sessions with registration conversion rate"><path d="M45 25V180H580V25" fill="none" stroke="#ddd"/><text x="45" y="15">Sessions · max ${number(max)}</text><text x="385" y="15">Registration CVR · max ${number(maxRate,'%')}</text>${bars}<polyline points="${rows.map((r,i)=>(50+i*step+step*.325)+','+(180-r.registrationCvr/maxRate*150)).join(' ')}" fill="none" stroke="${colors[2]}" stroke-width="3"/>${rows.map((r,i)=>`<circle cx="${50+i*step+step*.325}" cy="${180-r.registrationCvr/maxRate*150}" r="3" fill="${colors[2]}"><title>${esc(r.label)}: ${number(r.registrationCvr,'%')}</title></circle>`).join('')}</svg><div class="chart-legend">${['Members','Non-Members','Registration CVR (right axis)'].map((label,i)=>`<span><i style="background:${colors[i]}"></i>${label}</span>`).join('')}</div>`;
    }
    if(result.kind==='heatmap'){
      const max=Math.max(...rows.map(r=>Number(r[primary.key])||0),1);
      return `<div class="heatmap">${rows.map(r=>`<div class="heat-cell" style="background:rgba(169,121,72,${.08+.5*(Number(r[primary.key])||0)/max})" title="${esc(r.label)}"><span>${esc(r.label)}</span><strong>${number(r[primary.key],primary.unit)}</strong></div>`).join('')}</div>`;
    }
    if(result.kind==='world'){
      const coords={'Japan':[790,105],'Hong Kong':[750,139],'Singapore':[723,189],'United States':[190,115],'Australia':[810,244],'United Kingdom':[450,80]};
      const max=Math.max(...rows.map(r=>r[primary.key]),1);
      return `<svg viewBox="0 0 960 330" role="img" aria-label="Access by country: geographic bubble heatmap"><rect width="960" height="330" fill="#f5f1e9"/><g fill="#e2d8c8"><path d="M70 55 140 35 250 60 310 115 245 165 210 195 160 160 100 140Z"/><path d="m245 180 70 30 20 70-50 45-30-65Z"/><path d="m425 65 100-25 105 15 70-20 155 40 30 70-100 15-55 45-40-30-70-35-45-30-70 10Z"/><path d="m435 135 105-10 50 80-55 95-50-25-40-65Z"/><path d="m755 230 90-25 55 40-35 40-100-5Z"/></g>${rows.map(r=>{const xy=coords[r.label];return xy?`<circle cx="${xy[0]}" cy="${xy[1]}" r="${6+16*Math.sqrt(r[primary.key]/max)}" fill="#a97948" opacity=".7"><title>${esc(r.label)}: ${number(r[primary.key])}</title></circle><text x="${xy[0]+12}" y="${xy[1]-15}">${esc(r.label)}</text>`:'';}).join('')}</svg>`;
    }
    if(result.kind==='donut'){
      const total=rows.reduce((n,r)=>n+(Number(r[primary.key])||0),0);let offset=0;
      const circles=rows.map((r,i)=>{const share=total?(Number(r[primary.key])||0)/total:0;const html=`<circle cx="125" cy="110" r="72" fill="none" stroke="${colors[i%colors.length]}" stroke-width="28" stroke-dasharray="${share*452.39} ${452.39-share*452.39}" stroke-dashoffset="${-offset*452.39}" transform="rotate(-90 125 110)"><title>${esc(r.label)}: ${number(r[primary.key],primary.unit)}</title></circle>`;offset+=share;return html;}).join('');
      return `<svg viewBox="0 0 620 220" role="img" aria-label="${esc(primary.label)} distribution">${circles}<text x="125" y="110" text-anchor="middle" style="font-size:22px">${number(total,primary.unit)}</text>${rows.slice(0,9).map((r,i)=>`<rect x="260" y="${18+i*22}" width="9" height="9" fill="${colors[i%colors.length]}"/><text x="280" y="${27+i*22}">${esc(r.label)} · ${number(r[primary.key],primary.unit)}</text>`).join('')}</svg>`;
    }
    if(result.kind==='funnel'||(['bar','paired'].includes(result.kind)&&rows.length<=8)){
      const max=Math.max(...rows.flatMap(r=>columns.map(c=>Number(r[c.key])||0)),1);
      return `<div class="bar-list">${rows.flatMap(r=>columns.map((c,i)=>`<div class="bar-row"><span>${esc(r.label)}${columns.length>1?' · '+esc(c.label):''}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(0,Number(r[c.key])||0)/max*100}%;background:${colors[i%6]}"></div></div><strong>${number(r[c.key],c.unit)}</strong></div>`)).join('')}</div>`;
    }
    if(result.kind==='scatter'){
      const [x,y]=all,maxX=Math.max(...rows.map(r=>r[x.key]),1),maxY=Math.max(...rows.map(r=>r[y.key]),1);
      return `<svg viewBox="0 0 620 220" role="img" aria-label="${esc(x.label)} versus ${esc(y.label)}"><path d="M45 15V185H600" fill="none" stroke="#ddd"/>${rows.map(r=>`<circle cx="${45+r[x.key]/maxX*530}" cy="${185-r[y.key]/maxY*155}" r="5" fill="${colors[0]}" opacity=".7"><title>${esc(r.label)}: ${number(r[x.key],x.unit)} / ${number(r[y.key],y.unit)}</title></circle>`).join('')}<text x="280" y="215">${esc(x.label)}</text><text x="48" y="12">${esc(y.label)}</text></svg>`;
    }
    const displayed=rows.length>60?rows.filter((_,i)=>i%Math.ceil(rows.length/60)===0):rows;
    const width=620,left=48,top=12,height=165,span=552,stacked=result.kind==='stacked';
    const max=Math.max(...displayed.map(r=>stacked?columns.reduce((n,c)=>n+(Number(r[c.key])||0),0):Math.max(...columns.map(c=>Number(r[c.key])||0))),1)*1.08;
    const x=i=>left+(displayed.length===1?span/2:i/(displayed.length-1)*span),y=value=>top+height-(Number(value)||0)/max*height;
    const grid=Array.from({length:4},(_,i)=>{const value=max*i/3;return `<line x1="${left}" y1="${y(value)}" x2="600" y2="${y(value)}" stroke="#e8dfd3"/><text x="40" y="${y(value)+3}" text-anchor="end">${value>=1000000?(value/1000000).toFixed(1)+'M':value>=1000?(value/1000).toFixed(1)+'k':Math.round(value)}</text>`;}).join('');
    let drawing='';
    if(result.kind==='line')drawing=columns.map((c,j)=>{let path='';let gap=true;displayed.forEach((r,i)=>{if(r[c.key]===null||r[c.key]===undefined){gap=true;return;}path+=(gap?'M':'L')+x(i)+' '+y(r[c.key])+' ';gap=false;});return `<path d="${path}" fill="none" stroke="${colors[j%6]}" stroke-width="2"/>${displayed.filter(r=>r[c.key]!==null&&r[c.key]!==undefined).map(r=>`<circle cx="${x(displayed.indexOf(r))}" cy="${y(r[c.key])}" r="2.5" fill="${colors[j%6]}"><title>${esc(r.label)} / ${esc(c.label)}: ${number(r[c.key],c.unit)}</title></circle>`).join('')}`;}).join('');
    else {const step=span/Math.max(displayed.length,1);drawing=displayed.flatMap((r,i)=>{let base=0;return columns.map((c,j)=>{const value=Number(r[c.key])||0,barWidth=stacked?step*.65:step*.7/columns.length,px=left+i*step+(stacked?step*.17:j*barWidth),py=y(value+(stacked?base:0)),h=value/max*height;base+=value;return `<rect x="${px}" y="${py}" width="${Math.max(1,barWidth-1)}" height="${h}" fill="${colors[j%6]}" rx="2"><title>${esc(r.label)} / ${esc(c.label)}: ${number(value,c.unit)}</title></rect>`;});}).join('');}
    return `<svg viewBox="0 0 ${width} 220" role="img" aria-label="${esc(columns.map(c=>c.label).join(', '))} chart">${grid}${drawing}${displayed.filter((_,i)=>i%Math.max(1,Math.ceil(displayed.length/5))===0).map(r=>{const i=displayed.indexOf(r);return `<text x="${x(i)}" y="201" text-anchor="middle">${esc(String(r.label).slice(0,19))}</text>`;}).join('')}</svg><div class="chart-legend">${columns.map((c,i)=>`<span><i style="background:${colors[i%6]}"></i>${esc(c.label)}${c.unit?' ('+c.unit+')':''}</span>`).join('')}</div>${rows.length>60?'<div class="muted">Chart sampled for readability; the table and CSV include every row.</div>':''}`;
  }
  root.OverviewCharts={esc,number,table,render,colors};
})(typeof window!=='undefined'?window:globalThis);
