"""Current Agency Dashboard regression suite. Requires the test-only quickjs package."""
import json
import unittest
from pathlib import Path
import quickjs
ROOT = Path(__file__).resolve().parents[1]
SELECTABLE = [64,65,66,67,75,76,77,96,97,98,103,104,118,149,220,231,232,234,236,250,252,253,256,288,289,290,291,292,324]
SYSTEM = [56,58,69,70,71,73,74,78,79,207]

class DashboardTests(unittest.TestCase):
 def setUp(self):
  self.c=quickjs.Context();self.c.eval('var window=globalThis;')
  for f in ['agency-dashboard-catalog.js','agency-dashboard-model.js','agency-dashboard-rules.js']:self.c.eval((ROOT/f).read_text())
  self.c.eval("var M=AgencyDashboardModel;var C={mode:'preview',features:{crmPremium:true},suppression:false};var now=new Date('2026-09-08T04:00:00Z');function run(n,rows,w={},g={},ctx=C){return M.evaluate(n,{rows,mode:'preview',complete:true},ctx,w,g,now)}")
 def js(self,s):return json.loads(self.c.eval('JSON.stringify('+s+')'))
 def test_zero_denominators_and_empty_source(self):
  self.assertIsNone(self.js('run(290,[{clicks:0,impressions:0}])')['value'])
  self.assertEqual(self.js('run(64,[])')['value'],0)
  self.assertEqual(self.js('M.evaluate(64,null,C)')['state'],'unavailable')
 def test_preview_never_used_for_connected_account(self):
  self.assertEqual(self.js("M.evaluate(64,{rows:[],complete:true,mode:'preview'},{mode:'connected',agencyId:'a',staffId:'u',permissions:{listings_view:{scope:'agency'}}})")['state'],'unavailable')
 def test_date_timezone_and_ranges(self):
  self.assertEqual(self.js("M.tokyoDay('2026-09-07T16:00:00Z')"),'2026-09-08')
  self.assertEqual(self.js("M.dateRange('custom',now,'2026-09-01','2026-09-08')"),self.js("[M.time('2026-09-01'),M.time('2026-09-09')-1]"))
  self.assertEqual(self.js("M.dateRange('custom',now,'2026-09-09','2026-09-08')"),['invalid'])

class BusinessRuleTests(unittest.TestCase):
 def setUp(self):
  self.c=quickjs.Context()
  self.c.eval("var window=globalThis;var localStorage={getItem:()=>null};")
  for f in ['catalog','model','rules','mock','data']:
   self.c.eval((ROOT/f'agency-dashboard-{f}.js').read_text())
  self.c.eval("var M=AgencyDashboardModel,R=AgencyDashboardRules,now=new Date('2026-09-08T04:00:00Z'),S=AgencyDashboardMock.create(now),C={...AgencyDashboardData.context(),suppression:false};function run(n,w={},g={}){const m=M.metrics.find(m=>m.no===n)||M.systemWidgets.find(m=>m.no===n);return M.evaluate(n,{rows:S[m.source],related:S,complete:true,history:true,mode:'preview'},C,w,g,now)}")
 def js(self,s):return json.loads(self.c.eval('JSON.stringify('+s+')'))
 def test_response_cycles_last_client_first_reply(self):
  self.assertEqual(self.js("S.responseTimes.length"),80)
  self.assertEqual(self.js("S.responseTimes.slice(0,2).map(r=>(M.time(r.replyAt)-M.time(r.inboundAt))/60000)"),[5,19])
  self.assertEqual(self.js("run(253).value"),12)
  self.assertEqual(self.js("R.responseCycles([{id:'a',inquiryId:'q',sender:'client',date:'2026-09-08T10:00:00'},{id:'b',inquiryId:'q',sender:'agency',date:'2026-09-08T10:05:00'},{id:'c',inquiryId:'q',sender:'client',date:'2026-09-08T10:10:00'},{id:'d',inquiryId:'q',sender:'client',date:'2026-09-08T10:11:00'},{id:'e',inquiryId:'q',sender:'agency',date:'2026-09-08T10:30:00'}]).map(r=>(M.time(r.replyAt)-M.time(r.inboundAt))/60000)"),[5,19])
 def test_inquiry_message_and_viewing_are_distinct(self):
  self.assertTrue(self.js("S.inquiries.every(q=>!('leadId' in q)&&q.createdByContactId===q.contactId&&q.kind==='client')"))
  self.assertEqual(self.js("run(65).value"),40)
  self.assertEqual(self.js("run(252,{dimension:''}).value"),360)
  self.assertEqual(self.js("run(250).value"),self.js("S.messageEvents.filter(m=>m.sender==='client'&&m.unread).length"))
  self.assertTrue(self.js("(()=>{const q=S.inquiries[0],v={...q,id:'v'};return R.inquiryViewing(q,[v,{...v,id:'v2'}])&&!R.inquiryViewing(q,[{...v,staffId:'other'}])&&!R.inquiryViewing(q,[{...v,propertyId:'other'}])&&!R.inquiryViewing(q,[{...v,contactId:'other'}]);})()"))
  before=self.js("run(256).value")
  self.c.eval("S.viewing.push({...S.viewing[0],id:'duplicate-appointment'})")
  self.assertEqual(self.js("run(256).value"),before)
  self.c.eval("S.inquiries=[]")
  self.assertIsNone(self.js("run(256).value"))
 def test_sales_excludes_rent_and_includes_all_sold_development_units(self):
  self.assertTrue(self.js("S.transactions.filter(t=>t.dealType==='Rental').every(t=>t.value===null)"))
  self.assertEqual(self.js("S.transactions.filter(t=>t.unitId).length"),self.js("S.projects.flatMap(p=>p.inventory).filter(u=>u.status==='Sold Out').reduce((s,u)=>s+u.quantity,0)"))
  total=self.js("run(231).value")
  self.assertEqual(total,self.js("R.closedSales(S.transactions).reduce((s,t)=>s+t.value,0)"))
  self.c.eval("S.transactions.push({...S.transactions[0],id:'RENT-CHECK',status:'closed',dealType:'Rental',value:999999999})")
  self.assertEqual(self.js("run(231).value"),total)
  self.assertEqual(self.js("run(231,{filters:{dealType:['Rental']}}).value"),0)
  self.assertEqual(self.js("run(234,{dimension:'dealType',aggregation:'sum'}).rows.map(r=>r.label)"),['Sale'])
 def test_manual_sold_listing_no_lead_days_to_close(self):
  self.assertTrue(self.js("(()=>{const t=S.transactions.find(t=>t.status==='suspended'&&t.suspensionReason==='Sold'&&!t.leadId);return !!t&&!S.leads.some(l=>l.propertyId===t.propertyId)&&run(236).drillRows.some(r=>r.id===t.propertyId)&&R.closedSales([t]).length===1})()"))
  self.assertEqual(self.js("R.soldDate({id:'p',status:'Suspended',suspensionReason:'Sold',soldAt:'2026-09-08',datePublished:'2026-09-01'},[])"),'2026-09-08')
  self.assertEqual(self.js("R.soldDate({id:'p',datePublished:'2026-09-01'},[{propertyId:'p',status:'Closed Won',soldAt:'2026-09-05'}])"),'2026-09-05')
  self.assertTrue(self.js("run(236).drillRows.every(r=>M.time(r.confirmedSoldAt)>=M.time(r.publishedDate))"))
 def test_internal_staff_attribution_and_canonical_ids(self):
  self.assertTrue(self.js("Object.values(S).flat().every(r=>!('userId' in r)&&!('ownerId' in r)&&!('agentId' in r)&&!('assignedUserId' in r))"))
  self.assertTrue(self.js("Object.values(S).flat().every(r=>['staffId','ownerStaffId','assignedStaffId','closingStaffId','acceptedStaffId'].every(k=>!r[k]||S.staff.some(s=>s.staffId===r[k]&&s.agencyId===r.agencyId)))"))
  self.assertTrue(self.js("(()=>{const a=run(324,{topN:100}),b=run(324,{topN:100,staffAttribution:'closingStaffId'});return a.value===run(231).value&&JSON.stringify(a.rows)===JSON.stringify(b.rows)})()"))
 def test_upcoming_uses_due_or_explicit_schedule(self):
  self.assertIsNone(self.js("R.scheduledAt({activityType:'calls',status:'Completed',start:'2026-10-01'})"))
  self.assertIsNone(self.js("R.scheduledAt({activityType:'emails',status:'Draft',start:'2026-10-01'})"))
  self.assertEqual(self.js("R.scheduledAt({activityType:'task',status:'Todo',start:'2026-10-01',due:'2026-09-10'})"),'2026-09-10')
  self.assertTrue(self.js("run(207,{horizon:7,topN:1000}).rows.every(r=>M.time(r.scheduledActionAt)>now.getTime()&&M.time(r.scheduledActionAt)<=now.getTime()+7*86400000)"))
  self.assertGreater(self.js("run(207,{horizon:30}).value"),self.js("run(207,{horizon:7}).value"))
 def test_conversion_rank_and_combined_arithmetic(self):
  self.c.eval("S.propertyPerformance=[{id:'a',agencyId:C.agencyId,propertyId:'p1',organic:{views:100,inquiries:10},paid:{}},{id:'b',agencyId:C.agencyId,propertyId:'p2',organic:{views:200,inquiries:10},paid:{}},{id:'c',agencyId:C.agencyId,propertyId:'p3',organic:{views:0,inquiries:0},paid:{}}]")
  self.assertEqual(self.js("run(103).rows.map(r=>[r.id,r.value])"),[['p1',10],['p2',5],['p3',None]])
  self.assertEqual(self.js("run(103,{rankField:'organic.views'}).rows[0].id"),'p2')
  self.assertEqual(self.js("run(103,{rankField:'organic.views'}).unit"),'')
  self.assertTrue(self.js("S.agreements.every(a=>a.status==='Accepted')"))

class WidgetContractTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.c=quickjs.Context();cls.c.eval("var window=globalThis;var localStorage={getItem:()=>null};")
  for f in ['catalog','model','rules','mock','data','charts']:cls.c.eval((ROOT/f'agency-dashboard-{f}.js').read_text())
  cls.c.eval("var M=AgencyDashboardModel,D=AgencyDashboardData,V=AgencyDashboardCharts,C={...D.context(),suppression:false};function run(n,w={}){const m=M.metrics.concat(M.systemWidgets).find(m=>m.no===n);return M.evaluate(n,D.read(m.source),C,w)}")
 def js(self,s):return json.loads(self.c.eval('JSON.stringify('+s+')'))
 def test_exact_selectable_and_system_registries(self):
  self.assertEqual(self.js('M.metrics.map(m=>m.no)'),SELECTABLE)
  self.assertEqual(self.js('M.systemWidgets.map(m=>m.no)'),SYSTEM)
  self.assertTrue(self.js("[57,156,157,159,271,299,300,301].every(no=>M.evaluate(no,{},C).state==='unavailable')"))
  self.assertTrue(self.js("[...M.systemWidgets.map(m=>m.no),57,156,157,159,271,299,300,301].every(no=>{try{M.widget(no);return false}catch{return true}})"))
 def test_parent_quota_contains_all_values_and_unlimited(self):
  self.assertTrue(self.js("(()=>{const r=run(74),q=D.read('entitlements').rows[0],html=V.render({systemWidget:74},r);return r.supporting.used===q.used&&r.supporting.limit===q.limit&&r.supporting.remaining===q.limit-q.used&&r.supporting.utilization===q.used/q.limit*100&&[156,157,159].every(n=>html.includes('data-supporting-field=\"'+n+'\"'))})()"))
  self.assertEqual(self.js("M.calculate(M.systemWidgets.find(m=>m.no===74),[{used:8,unlimited:true}]).supporting"),{'used':8,'limit':'Unlimited','remaining':'Unlimited','utilization':None})
 def test_subscription_and_deadline_parent_values(self):
  self.assertTrue(self.js("(()=>{const q=D.read('subscription').rows[0],r=run(58);return r.supporting.cycleEnd===q.cycleEnd&&r.supporting.autoRenewal===q.autoRenewal&&r.supporting.confirmationRequired===q.confirmationRequired})()"))
  self.assertTrue(self.js("[76,79].every(no=>run(no).supporting.reviews.every(r=>Number.isFinite(r.hoursRemaining)&&r.reviewDeadline))"))
  self.assertTrue(self.js("run(73).rows.some(n=>n.noticeSource==='subscription')&&run(73).rows.some(n=>n.noticeSource==='campaigns')"))
  self.assertIsNotNone(self.js('D.context().agentRating'))
 def test_notice_dependencies_preserve_permission_scope(self):
  self.assertTrue(self.js("(()=>{const ctx={...C,permissions:{...C.permissions,campaigns:{scope:'none',actions:{view:false}}}},r=M.evaluate(73,D.read('subscription'),ctx);return r.rows.every(n=>n.noticeSource!=='campaigns')})()"))
 def test_migration_preserves_valid_widgets_and_system_boundaries(self):
  self.assertIsNone(self.js("M.normalizeWidget({id:'old',metric:74},'custom')"))
  self.assertEqual(self.js("M.normalizeWidget({id:'old',metric:74},'subscriptions').systemWidget"),74)
  self.assertTrue(self.js("[57,156,157,159,271,299,300,301].every(no=>M.normalizeWidget({id:'old',metric:no},'overview')===null)"))
  self.assertTrue(self.js("(()=>{const w=M.normalizeWidget({id:'keep',metric:65,title:'My inquiries',staffAttribution:'closingStaffId',filters:{budgetBand:['old']}},'custom');return w.id==='keep'&&w.title==='My inquiries'&&!('staffAttribution' in w)&&!('budgetBand' in w.filters)})()"))
  self.assertTrue(self.js("M.defaults().dashboards.every(d=>d.panels.every(p=>p.widgets.every(w=>M.normalizeWidget(w,d.id))))"))
 def test_system_renderers_and_generic_ad_tables(self):
  self.assertTrue(self.js("M.systemWidgets.every(m=>{const w={systemWidget:m.no},r=run(m.no,w),html=V.render(w,r);return html&&!/NaN|undefined/.test(html)})"))
  self.assertTrue(self.js("[288,289,290,291,292].every(no=>{const m=M.metrics.find(m=>m.no===no),w={metric:no,chart:'table'},r=run(no,w);return M.charts(m,w,r).includes('table')&&V.render(w,r).includes('<table>')})"))

class RenderingAndAccessTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.c=quickjs.Context();cls.c.eval("var window=globalThis;var storage={};var localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v};")
  for f in ['catalog','model','rules','mock','data','charts']:cls.c.eval((ROOT/f'agency-dashboard-{f}.js').read_text())
  cls.c.eval("var M=AgencyDashboardModel,D=AgencyDashboardData,R=AgencyDashboardRules,V=AgencyDashboardCharts,now=new Date('2026-09-09T04:00:00Z'),S=AgencyDashboardMock.create(now),C={...D.context(),suppression:false};function run(n,w={},ctx=C){var m=M.metrics.find(m=>m.no===n);return M.evaluate(n,{rows:S[m.source],related:S,complete:true,history:true,mode:'preview'},ctx,w,{},now)}")
 def js(self,s):return json.loads(self.c.eval('JSON.stringify('+s+')'))
 def test_every_visible_metric_period_dimension_and_renderer(self):
  result=self.js("""(()=>{let calculations=0,renders=0;const bad=[];for(const m of M.metrics){for(const dimension of [undefined,'',...m.dimensions])for(const period of ['all','7d','30d','90d','month','lastMonth','ytd']){const w={metric:m.no,dimension,period,topN:5},r=run(m.no,w);calculations++;if(!['ready','empty'].includes(r.state))bad.push([m.no,dimension,period,r.state]);if(period==='all')for(const chart of M.charts(m,w,r)){renders++;if(/NaN|undefined/.test(V.render({...w,chart},r)))bad.push([m.no,chart]);}}const empty=M.evaluate(m.no,{rows:[],complete:true,history:true,mode:'preview'},C,{}, {},now);if(empty.state!=='empty')bad.push([m.no,'empty',empty.state]);}return {metrics:M.metrics.length,calculations,renders,bad}})()""")
  self.assertEqual(result['bad'],[]);print('\nCurrent scope calculation/render matrix:',result)
 def test_permission_plan_and_suppression_matrix(self):
  result=self.js("""(()=>{const bad=[];let checks=0;for(const role of ['Agency Admin','Sales Agent','Property Manager','Reception'])for(const crmPremium of [true,false])for(const suppression of [true,false]){D.setPreview({role,crmPremium,suppression});const ctx=D.context();for(const m of M.metrics){checks++;const r=run(m.no,{},ctx),gate=M.gate(m,ctx);if(gate?r.state!==gate.state:!['ready','empty'].includes(r.state))bad.push([role,m.no,r.state]);}}D.setPreview({role:'Agency Admin',crmPremium:true,suppression:false});return {checks,bad}})()""")
  self.assertEqual(result['bad'],[]);print('\nCurrent scope permission matrix:',result)
 def test_raw_view_events_are_isolated_and_not_deduplicated(self):
  self.assertTrue(self.js("S.viewEvents.length>0&&S.propertyPerformance.reduce((n,p)=>n+p.organic.views,0)===R.countViews(S.viewEvents.filter(v=>v.channel==='organic'))"))
  self.assertTrue(self.js("S.adPerformance.reduce((n,p)=>n+p.views,0)===R.countViews(S.viewEvents.filter(v=>v.channel==='paid'))"))
  self.assertEqual(self.js("R.countViews([{contactId:'c',propertyId:'p',date:'2026-09-08'},{contactId:'c',propertyId:'p',date:'2026-09-08'}])"),2)
  self.assertEqual(self.js("R.inquiryRecords([{id:'a',contactId:'c',propertyId:'p'},{id:'b',contactId:'c',propertyId:'p'}]).length"),2)
 def test_feed_is_small_explicit_category_set(self):
  self.assertTrue(self.js("S.events.every(e=>['inquiry','appraisal','viewing','offer','transaction'].includes(e.activityType))"))
  self.assertTrue(self.js("S.events.filter(e=>e.activityType==='offer').every(e=>e.status==='Accepted'&&e.date===e.acceptedAt)"))
  self.assertTrue(self.js("S.events.filter(e=>e.activityType==='viewing').every(e=>['Scheduled','Confirmed'].includes(e.status))"))
 def test_combined_is_arithmetic(self):
  self.assertEqual(self.js("M.calculate(M.metrics.find(m=>m.no===104),[{id:'a',organic:{impressions:10,views:8,clicks:4,keep:1},paid:{impressions:5,views:4,clicks:2,keep:1}},{id:'b',organic:{impressions:10,views:8,clicks:4,keep:1},paid:{impressions:8,views:6,clicks:3,keep:1}}]).rows[0]"),{'label':'impressions','organic':20,'paid':13,'value':33})

if __name__ == '__main__':
 unittest.main()
