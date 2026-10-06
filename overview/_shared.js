// Shared helpers for overview module pages.
// Provides: C, TT, ri, rf, dates, L30, L90, L12, spark, donut, hmap, miniBar.
// Plus Chart.js defaults.

if (typeof Chart === "undefined") {
  console.warn("Chart.js is not loaded; charts in this module will not render.");
} else {
  Chart.defaults.font = { family: "sans-serif", size: 11 };
  Chart.defaults.color = "#6b5c4e";
}

const C={gold:'#c4a25f',blue:'#1d4e89',green:'#2d6a4f',red:'#c41e3a',muted:'#6b5c4e',orange:'#c05621',
  goldA:'rgba(196,162,95,.35)',blueA:'rgba(29,78,137,.3)',greenA:'rgba(45,106,79,.3)'};
const TT={backgroundColor:'rgba(255,255,255,.97)',titleColor:'#2c1810',bodyColor:C.muted,borderColor:'#e5d9c0',borderWidth:1,padding:10,cornerRadius:6};
Chart.defaults.font={family:'sans-serif',size:11};
Chart.defaults.color=C.muted;

function ri(lo,hi,n=30){return Array.from({length:n},()=>Math.floor(Math.random()*(hi-lo)+lo));}
function rf(lo,hi,n=30){return Array.from({length:n},()=>+(Math.random()*(hi-lo)+lo).toFixed(2));}
function dates(n,mode='daily'){
  const a=[];const now=new Date();
  if(mode==='monthly'){const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];for(let i=n-1;i>=0;i--){const d=new Date(now);d.setMonth(d.getMonth()-i);a.push(months[d.getMonth()]);}return a;}
  for(let i=n-1;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);a.push(d.toLocaleDateString('en',{month:'short',day:'numeric'}));}
  return a;
}
const L30=dates(30),L90=dates(90),L12=dates(12,'monthly');

function spark(id,data,color){
  const el=document.getElementById(id);if(!el)return;
  new Chart(el,{type:'line',data:{labels:Array(data.length).fill(''),datasets:[{data,borderColor:color,borderWidth:1.5,fill:true,backgroundColor:color+'28',tension:0.4,pointRadius:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{enabled:false}},scales:{x:{display:false},y:{display:false}}}});
}
function donut(id,labels,data,colors){
  const el=document.getElementById(id);if(!el)return;
  new Chart(el,{type:'doughnut',data:{labels,datasets:[{data,backgroundColor:colors,borderWidth:2,borderColor:'#fff'}]},options:{responsive:false,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`${c.label}: ${c.raw}`}}},cutout:'65%'}});
}
function hmap(containerId,legendId,colorStops){
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const data=days.map(()=>Array.from({length:24},()=>Math.floor(Math.random()*100)));
  const mx=Math.max(...data.flat());
  function hc(v){const p=v/mx;const i=Math.floor(p*(colorStops.length-1));return colorStops[i];}
  const wrap=document.getElementById(containerId);if(!wrap)return;
  const hr=document.createElement('div');hr.className='hm-hour-row';
  hr.innerHTML='<div></div>'+Array.from({length:24},(_,i)=>`<div class="hm-h">${i}</div>`).join('');
  wrap.appendChild(hr);
  days.forEach((day,di)=>{
    const row=document.createElement('div');row.className='hm-row';
    const lbl=document.createElement('div');lbl.className='hm-day';lbl.textContent=day;row.appendChild(lbl);
    for(let hi=0;hi<24;hi++){const cell=document.createElement('div');cell.className='hm-cell';cell.style.background=hc(data[di][hi]);cell.title=`${day} ${String(hi).padStart(2,'0')}:00 — ${data[di][hi]} sessions`;row.appendChild(cell);}
    wrap.appendChild(row);
  });
  const lg=document.getElementById(legendId);if(!lg)return;
  colorStops.forEach(c=>{const d=document.createElement('div');d.style.cssText=`width:14px;height:14px;border-radius:2px;background:${c}`;lg.appendChild(d);});
}
function miniBar(id,rows){
  const el=document.getElementById(id);if(!el)return;
  const max=Math.max(...rows.map(r=>r.val));
  rows.forEach(r=>{
    const div=document.createElement('div');div.className='mini-bar-row';
    div.innerHTML=`<span class="mini-bar-lbl" style="width:${r.w||80}px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.label}</span>
      <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${(r.val/max*100).toFixed(0)}%;background:${r.color}"></div></div>
      <span class="mini-bar-val">${r.display}</span>`;
    el.appendChild(div);
  });
}
