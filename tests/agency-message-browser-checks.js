(async()=>{
const backup={...localStorage},session={...sessionStorage},frames=[],out=[];
const check=(name,ok)=>{if(!ok)throw Error(name);out.push(name)};
async function page(path){const f=document.createElement('iframe');frames.push(f);document.body.append(f);await new Promise(r=>{f.onload=r;f.src=path;setTimeout(r,6000);});return {w:f.contentWindow,d:f.contentDocument};}
try{
sessionStorage.setItem('yuushi.activePortal','agency');
localStorage.removeItem('yuushi.agencyRoles');
localStorage.setItem('yuushi.agencySignedInStaff',JSON.stringify({roleId:'admin',role:'Agency Admin',agencyId:'AG-QA',staffId:'ADMIN-QA'}));
const record={id:'INQ-PERM-QA',conversationId:'INQ-PERM-QA',customerId:'CLIENT-PERM-QA',customerName:'QA Customer',propertyId:'PROP-QA',agencyId:'AG-QA',assignedStaffId:'STAFF-QA',msgs:[{sender:'them',text:'Private QA conversation',time:'Now'}]};
localStorage.setItem('yuushi.agencyEnquiryAssignments',JSON.stringify([record]));
let {w,d}=await page('/_agent-portal/admin-messages.html?conversationId='+record.id);
check('Agency Admin can read staff/customer conversation',d.getElementById('messages').textContent.includes('Private QA conversation'));
check('Agency Admin default cannot reply',d.getElementById('composerInput').disabled);
d.getElementById('composerInput').value='Blocked reply';w.sendMessage();check('Direct send call is blocked without Reply permission',JSON.parse(localStorage.getItem('yuushi.agencyEnquiryAssignments'))[0].msgs.length===1);
const roles=w.YuushiAgencyPermissions.load();
let campaign=await page('/_agent-portal/message-center.html');campaign.w.openBuilder(null);campaign.w.eval('currentStep=5');campaign.w.renderStep();check('Message Center dynamically rendered send controls are disabled without Reply',campaign.d.querySelector('button[onclick="launchCampaign()"]').disabled);
roles.find(r=>r.id==='admin').perms.inquiries.actions.reply=true;w.YuushiAgencyPermissions.save(roles);w.renderHeader();check('Explicit role Reply permission enables composer',!d.getElementById('composerInput').disabled);d.getElementById('composerInput').value='Permitted reply';w.sendMessage();check('Explicit Reply persists message',JSON.parse(localStorage.getItem('yuushi.agencyEnquiryAssignments'))[0].msgs.length===2);
roles.find(r=>r.id==='admin').perms.inquiries.actions.reply=false;w.YuushiAgencyPermissions.save(roles);w.dispatchEvent(new w.StorageEvent('storage',{key:w.YuushiAgencyPermissions.key}));check('Reply revocation disables an already open composer',d.getElementById('composerInput').disabled);
roles.find(r=>r.id==='admin').perms.inquiries.actions.reply=true;
roles.find(r=>r.id==='sales').perms.inquiries.actions.view=false;w.YuushiAgencyPermissions.save(roles);localStorage.setItem('yuushi.agencySignedInStaff',JSON.stringify({roleId:'sales',staffId:'STAFF-QA',agencyId:'AG-QA'}));
({w,d}=await page('/_agent-portal/admin-messages.html?conversationId='+record.id));check('Staff without View cannot open assigned conversation',!d.body.textContent.includes('Private QA conversation')&&d.getElementById('composerInput').disabled);
w.sendMessage();const deniedCampaign=await page('/_agent-portal/message-center.html');check('Staff without message permission cannot open Message Center',deniedCampaign.d.body.textContent.includes('not permitted for this role'));
check('Denied staff direct send cannot mutate thread',JSON.parse(localStorage.getItem('yuushi.agencyEnquiryAssignments'))[0].msgs.length===2);
localStorage.setItem('yuushi.agencySignedInStaff',JSON.stringify({role:'Platform Admin',roleId:'admin',agencyId:'AG-QA'}));
({w,d}=await page('/_agent-portal/admin-messages.html?conversationId='+record.id));check('Platform actor cannot open Agency conversation',!d.body.textContent.includes('Private QA conversation'));
({w,d}=await page('/messagesupport/admin-messages.html?conversationId='+record.id));check('Platform Message Center rejects normal conversation deep link',d.body.textContent.includes('not accessible to Platform users')&&!d.body.textContent.includes('Private QA conversation'));
({w,d}=await page('/messagesupport/admin-messages.html'));check('Platform support UI only displays direct support messages',w.eval('dataset()').every(c=>c.conversationContext==='platform-support')&&d.getElementById('messages').textContent.includes('YUUSHI Support'));
sessionStorage.setItem('yuushi.activePortal','agency');localStorage.removeItem('yuushi.agencySignedInStaff');
({w,d}=await page('/_agent-portal/role-and-permission.html'));check('Role editor uses shared persisted message matrix',w.eval('roles').find(r=>r.id==='admin').perms.inquiries.actions.reply===true&&w.eval('sections.inquiries[0].actions').includes('view'));
for(const path of ['/_agent-portal/admin-messages.html','/messagesupport/admin-messages.html','/messagesupport/email-center.html','/messagesupport/email-center%20copy.html','/contentmanagement/cms-homepage-management.html','/contentmanagement/category-search-management.html']){
 ({w,d}=await page(path));check('No retired property state controls: '+path,!Array.from(d.querySelectorAll('option,input')).some(e=>/^members[ _-]?only$/i.test(e.value))&&!d.body.innerText.includes('Members only'));
}
return out;
}finally{frames.forEach(f=>f.remove());localStorage.clear();Object.entries(backup).forEach(([k,v])=>localStorage.setItem(k,v));sessionStorage.clear();Object.entries(session).forEach(([k,v])=>sessionStorage.setItem(k,v));}
})()
