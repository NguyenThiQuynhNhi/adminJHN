(function(root){
  'use strict';

  const META_KEY='yuushi.agencyFileLibrary';
  const DB_NAME='yuushiAgencyFiles';
  const STORE='blobs';
  const DB_VERSION=1;
  const MB=1024*1024;
  const GB=1024*MB;
  const PLAN_LIMITS={
    Free:{storage:.5*GB,daily:50*MB,doc:20*MB,video:0},
    Bronze:{storage:3*GB,daily:100*MB,doc:50*MB,video:0},
    Silver:{storage:10*GB,daily:200*MB,doc:50*MB,video:200*MB},
    Gold:{storage:20*GB,daily:200*MB,doc:50*MB,video:200*MB},
    Platinum:{storage:40*GB,daily:200*MB,doc:50*MB,video:200*MB}
  };

  function readMeta(){
    try{
      const rows=JSON.parse(localStorage.getItem(META_KEY)||'[]');
      return Array.isArray(rows)?rows:[];
    }catch{return []}
  }
  function writeMeta(rows){
    localStorage.setItem(META_KEY,JSON.stringify(rows));
    try{root.dispatchEvent(new CustomEvent('yuushi-file-library-change',{detail:{count:rows.length}}));}catch{}
  }
  function account(){
    try{
      const primary=JSON.parse(localStorage.getItem('yuushi.agency.primaryAccount')||'null')||{};
      const staff=JSON.parse(localStorage.getItem('yuushi.agencySignedInStaff')||'null')||{};
      return {
        agencyId:primary.id||primary.agencyId||staff.agencyId||'AG-00000001',
        staffId:staff.staffId||staff.id||'STF-0001',
        name:staff.name||primary.contactName||'Taro Tanaka',
        role:staff.role||'Agency Admin',
        plan:String(primary.plan||primary.subscriptionPlan||'Gold')
      };
    }catch{return {agencyId:'AG-00000001',staffId:'STF-0001',name:'Taro Tanaka',role:'Agency Admin',plan:'Gold'}}
  }
  function planName(){
    const raw=account().plan.toLowerCase();
    return Object.keys(PLAN_LIMITS).find(p=>p.toLowerCase()===raw)||'Gold';
  }
  function limits(){return PLAN_LIMITS[planName()]||PLAN_LIMITS.Gold}
  function fmtBytes(n){
    n=Number(n)||0;
    if(n>=GB)return (n/GB).toFixed(n>=10*GB?1:2)+' GB';
    if(n>=MB)return (n/MB).toFixed(n>=10*MB?1:2)+' MB';
    if(n>=1024)return (n/1024).toFixed(1)+' KB';
    return n+' B';
  }
  function category(mime,name){
    const m=String(mime||'').toLowerCase(), n=String(name||'').toLowerCase();
    if(m.startsWith('image/'))return 'Image';
    if(m.startsWith('video/'))return 'Video';
    if(m.includes('pdf')||n.endsWith('.pdf'))return 'PDF';
    if(m.includes('spreadsheet')||/\.(xls|xlsx|csv)$/.test(n))return 'Spreadsheet';
    if(m.includes('word')||m.includes('document')||/\.(doc|docx|txt|rtf)$/.test(n))return 'Document';
    return 'Other';
  }
  function openDb(){
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,DB_VERSION);
      req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE);};
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
  }
  async function putBlob(id,file){
    const db=await openDb();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put(file,id);
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
    });
    db.close();
  }
  async function getBlob(id){
    const db=await openDb();
    const value=await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly');
      const req=tx.objectStore(STORE).get(id);
      req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);
    });
    db.close();return value;
  }
  async function removeBlob(id){
    const db=await openDb();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
    });
    db.close();
  }
  function rows(){
    const a=account();
    return readMeta().filter(f=>f.agencyId===a.agencyId&&!f.deletedAt);
  }
  function usage(){
    const list=rows(), used=list.reduce((s,f)=>s+(Number(f.size)||0),0), lim=limits();
    return {plan:planName(),used,limit:lim.storage,remaining:Math.max(0,lim.storage-used),percent:lim.storage?Math.min(100,used/lim.storage*100):0,dailyLimit:lim.daily};
  }
  function todayUploadBytes(){
    const today=new Date().toISOString().slice(0,10), a=account();
    return readMeta().filter(f=>f.agencyId===a.agencyId&&f.uploaderId===a.staffId&&!f.deletedAt&&String(f.uploadedAt||'').slice(0,10)===today)
      .reduce((s,f)=>s+(Number(f.size)||0),0);
  }
  function validateFile(file){
    const lim=limits(), u=usage(), isVideo=String(file.type||'').startsWith('video/');
    const max=isVideo?lim.video:lim.doc;
    if(isVideo&&!lim.video)return 'Video upload is available from Silver plan and above.';
    if(file.size>max)return '“'+file.name+'” exceeds the '+fmtBytes(max)+' per-file limit for '+planName()+'.';
    if(todayUploadBytes()+file.size>lim.daily)return 'Daily upload limit reached ('+fmtBytes(lim.daily)+' per user).';
    if(u.used+file.size>lim.storage)return 'Agency storage is full. Delete files, buy +10GB, or upgrade the plan.';
    return '';
  }
  async function addFiles(fileList){
    const files=Array.from(fileList||[]), a=account(), added=[];
    for(const file of files){
      const error=validateFile(file);if(error)throw new Error(error);
      const id='FILE-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,7).toUpperCase();
      const meta={
        id,agencyId:a.agencyId,name:file.name,size:file.size,mime:file.type||'application/octet-stream',
        category:category(file.type,file.name),uploaderId:a.staffId,uploaderName:a.name,
        uploadedAt:new Date().toISOString(),lastSharedAt:null,shareCount:0
      };
      await putBlob(id,file);
      const all=readMeta();all.unshift(meta);writeMeta(all);added.push(meta);
    }
    return added;
  }
  function markShared(id,conversationId){
    const all=readMeta(), row=all.find(f=>f.id===id&&!f.deletedAt);
    if(!row)return null;
    row.lastSharedAt=new Date().toISOString();row.shareCount=(Number(row.shareCount)||0)+1;
    row.lastConversationId=conversationId||null;writeMeta(all);return row;
  }
  function canDelete(row){
    const a=account();return row&&(row.uploaderId===a.staffId||/admin/i.test(a.role));
  }
  async function deleteFile(id){
    const all=readMeta(), row=all.find(f=>f.id===id&&!f.deletedAt);
    if(!row)throw new Error('File not found.');
    if(!canDelete(row))throw new Error('Only the uploader or Agency Admin can delete this file.');
    row.deletedAt=new Date().toISOString();row.deletedBy=account().staffId;
    writeMeta(all);await removeBlob(id);return row;
  }
  async function download(id){
    const row=readMeta().find(f=>f.id===id&&!f.deletedAt);
    if(!row)throw new Error('This attachment is no longer available.');
    const blob=await getBlob(id);
    if(!blob)throw new Error('This attachment is no longer available.');
    const url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url;a.download=row.name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),3000);
  }
  function get(id){return readMeta().find(f=>f.id===id&&!f.deletedAt)||null}

  root.YuushiAgencyFiles={
    key:META_KEY,plans:PLAN_LIMITS,account,planName,limits,rows,get,usage,fmtBytes,category,
    validateFile,addFiles,markShared,canDelete,deleteFile,download,getBlob
  };
})(window);
