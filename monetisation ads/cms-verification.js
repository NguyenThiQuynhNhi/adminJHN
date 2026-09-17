/* Run in the review browser via: await runCMSVerification(). Uses isolated iframe fixtures. */
async function runCMSVerification(){
 const results=[];const saved=localStorage.getItem('yuushi-cms-v1');
 const check=(name,ok)=>{results.push({name,passed:!!ok});if(!ok)throw Error(name)};
 async function page(n){localStorage.removeItem('yuushi-cms-v1');const f=document.createElement('iframe');f.style='width:1280px;height:900px';document.body.append(f);f.src=files[n-1]+'.html';await new Promise(r=>f.onload=r);return f;}
 let f;
 try{
 for(let n=1;n<=10;n++){f=await page(n);check('Screen '+n+' renders',f.contentDocument.querySelector('#app').innerText.length>50);check('Screen '+n+' no document overflow',f.contentDocument.documentElement.scrollWidth<=1280);f.remove()}
 f=await page(1);let w=f.contentWindow;
 check('Plan review and persistence',w.eval(`(()=>{editPlan('P4');$('#editForm [name=price]').value=29000;$('#editForm').requestSubmit();let ok=$('#confirm').open&&$('#confirm').innerText.includes('182 affected subscribers');confirmAction();editPlan('P4');return ok&&$('#editForm [name=price]').value==='29000'})()`));
 check('Supportal category required',w.eval(`(()=>{closeEditor(true);editPlan('P6');$('#planCategory').value='';return !$('#editForm').checkValidity()})()`));
 check('Retire keeps existing subscribers',w.eval(`(()=>{closeEditor(true);retirePlan('P4');confirmAction();return db.plans.find(p=>p.id==='P4').status==='Retired'&&db.plans.find(p=>p.id==='P4').subscribers===182})()`));
 check('Feature registry creates applicable quota',w.eval(`(()=>{editFeature();$('#editForm [name=name]').value='Saved searches';$('#editForm [name=type]').value='quota';$('#editForm [name=unit]').value='searches';$('#editForm').requestSubmit();confirmAction();return db.features.some(x=>x.name==='Saved searches'&&x.type==='quota')})()`));f.remove();
 f=await page(3);w=f.contentWindow;
 check('Add-on list/editor consistent',w.eval(`(()=>{editAddon('A7');return +$('#editForm [name=price0]').value===db.addons.find(a=>a.id==='A7').variants[0].price})()`));
 check('Duplicate variant rejected',w.eval(`(()=>{addVariant();$('#editForm [name=months1]').value=1;$('#editForm').requestSubmit();return $('#formError').innerText.includes('unique')})()`));f.remove();
 f=await page(4);w=f.contentWindow;
 check('All eight ad products',w.eval('new Set(db.slots.map(s=>s.product)).size===8'));
 check('Sold range rejected',w.eval(`(()=>{editSlot('S12');$('#editForm [name=start]').value='2026-09-20';$('#editForm [name=end]').value='2026-09-30';$('#editForm').requestSubmit();return $('#formError').innerText.includes('reserved')})()`));
 check('Future calendar persists',w.eval(`(()=>{closeEditor(true);editSlot('S0');$('#editForm').requestSubmit();confirmAction();return db.slots[0].ranges.length===1})()`));f.remove();
 f=await page(5);w=f.contentWindow;
 check('Creative asset loaded',await w.eval(`(async()=>{bookingDetail('AD-10245');const i=$('#editor img');await i.decode();return i.naturalWidth>0})()`));
 check('Other rejection requires text',w.eval(`(()=>{rejectBooking('AD-10245');$('#rejectReason').value='Other';confirmAction();return $('#confirmError').innerText.includes('explain')})()`));
 check('Rejection releases authorization',w.eval(`(()=>{$('#otherReason textarea').value='Destination content is incomplete';confirmAction();return db.bookings[0].status==='Rejected'&&db.transactions.some(t=>t.object==='AD-10245'&&t.event==='Release')})()`));
 check('Approval retains locked price/end and writes ledger',w.eval(`(()=>{approveBooking('AD-10248');confirmAction();return db.bookings[1].end==='2026-11-20'&&db.transactions.some(t=>t.object==='AD-10248'&&t.event==='Capture'&&t.amount===58800)})()`));f.remove();
 f=await page(6);w=f.contentWindow;
 check('Recommendation scheduled on owning plan',w.eval(`(()=>{recommendationDetail('R0');approveRecommendation('R0');confirmAction();return db.plans.find(p=>p.id==='P4').scheduledPrice.price===30800&&db.recommendations[0].status==='Approved'})()`));
 check('Homepage uses historical comparison',w.eval(`(()=>{recommendationDetail('R3');return $('#editor').innerText.includes('None — self-historical only')})()`));f.remove();
 f=await page(7);w=f.contentWindow;
 check('Revenue excludes authorizations',w.eval(`db.transactions.filter(t=>recognized(t)).reduce((a,t)=>a+t.amount,0)===217000`));
 check('Date filter empty state',w.eval(`(()=>{view.from='2027-01-01';view.to='2027-01-31';renderRows();return $('#rows').innerText.includes('No matching records')&&$('#rows').innerText.includes('¥0')})()`));f.remove();
 f=await page(9);w=f.contentWindow;
 check('Audit actor filtering',w.eval(`(()=>{view.actor='Nobody';renderRows();return $('#rows').innerText.includes('No matching records')})()`));f.remove();
 f=await page(10);w=f.contentWindow;
 check('Performance reveal requires typed confirmation',w.eval(`(()=>{visibilityReview();confirmAction();return db.settings.visible===false&&$('#confirm').open})()`));
 check('Performance reveal saves',w.eval(`(()=>{$('#confirm [name=confirmWord]').value='CONFIRM';confirmAction();return db.settings.visible===true})()`));
 check('Transactions filter actual rows',w.eval(`(()=>{view.tab='transactions';view.status='Failed';render();return $('#rows tbody').rows.length===2})()`));
 check('Non-zero reconciliation has real detail',w.eval(`(()=>{db.transactions.push({id:'TEST-ORPHAN',event:'Authorization',status:'Pending',object:'MISSING',account:'Test'});incidentDetail('Orphaned authorization');return $('#editor').innerText.includes('TEST-ORPHAN')})()`));f.remove();
 }catch(e){results.push({error:e.message});f?.remove()}finally{if(saved===null)localStorage.removeItem('yuushi-cms-v1');else localStorage.setItem('yuushi-cms-v1',saved)}return results;
}
