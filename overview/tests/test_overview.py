"""Run: PYTHONPATH=/tmp/overview-js-runtime python3 -m unittest discover -s overview/tests -v
QuickJS is a test-only Python dependency; production pages use native browser JavaScript.
"""
import json
import unittest
from pathlib import Path
from html.parser import HTMLParser
import quickjs

ROOT = Path(__file__).resolve().parents[1]
BOOT = r'''
var window=globalThis;
if(!Array.prototype.at) Array.prototype.at=function(i){return this[i<0?this.length+i:i]};
if(!String.prototype.replaceAll) String.prototype.replaceAll=function(a,b){return this.split(a).join(b)};
if(!Object.hasOwn) Object.hasOwn=function(o,k){return Object.prototype.hasOwnProperty.call(o,k)};
var Intl={DateTimeFormat:function(locale,opts){return {format:function(){return '2026-09-07'}}},NumberFormat:function(){return {format:function(n){return String(n)}}}};
var console={log:function(){},warn:function(){},error:function(e){throw e}};
'''
DOM = r'''
const elementMap=new Map();
function element(id){
  if(elementMap.has(id))return elementMap.get(id);
  const el={id,value:'',textContent:'',hidden:false,disabled:false,options:[],dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},
    addEventListener(type,fn){this['on'+type]=fn},showModal(){this.open=true},close(){this.open=false},scrollIntoView(){},click(){if(this.onclick)this.onclick({preventDefault(){}})},querySelectorAll(){return []}};
  let html='';
  Object.defineProperty(el,'innerHTML',{get(){return html},set(s){html=s;const tags=[...s.matchAll(/<(input|select|div|form|button|dialog|main|p|h2)[^>]*\bid="([^"]+)"[^>]*>/g)];for(const m of tags){const node=element(m[2]);node.multiple=m[0].includes('multiple');const value=m[0].match(/\bvalue="([^"]*)"/);if(value)node.value=value[1];}
    for(const m of s.matchAll(/<select[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const node=element(m[1]);node.options=[...m[2].matchAll(/<option([^>]*)>([^<]*)<\/option>/g)].map((x,i)=>({value:x[1].match(/value="([^"]*)"/)?.[1]??x[2],selected:x[1].includes('selected')||i===0&&!node.multiple}));node.value=node.options.find(o=>o.selected)?.value||'';}
    if(id!=='overviewApp' && s.includes('<option')){el.options=[...s.matchAll(/<option([^>]*)>([^<]*)<\/option>/g)].map(x=>({value:x[1].match(/value="([^"]*)"/)?.[1]??x[2],selected:x[1].includes('selected')}));}
  }});
  Object.defineProperty(el,'selectedOptions',{get(){return el.options.filter(o=>o.selected)}});
  elementMap.set(id,el);return el;
}
var document={body:{dataset:{overviewPage:PAGE},classList:{add(){},remove(){}}},getElementById:element,querySelectorAll(){return []},handlers:{},addEventListener(type,fn){this.handlers[type]=fn},createElement(){return {click(){globalThis.lastDownload={name:this.download,url:this.href}}}}};
var location={hash:''};var savedStorage={};var localStorage={getItem(key){return savedStorage[key]??null},setItem(key,value){savedStorage[key]=value}};
var Blob=function(parts){this.parts=parts};var URL={createObjectURL(blob){globalThis.lastCSV=blob.parts.join('');return 'blob:test'},revokeObjectURL(){}};
var setTimeout=function(){return 1},clearTimeout=function(){},requestAnimationFrame=function(fn){fn()};
'''

class OverviewTests(unittest.TestCase):
    def context(self):
        ctx=quickjs.Context()
        ctx.eval(BOOT)
        ctx.eval(r'''
var savedStorage={};
var localStorage={
  getItem(key){return Object.prototype.hasOwnProperty.call(savedStorage,key)?savedStorage[key]:null},
  setItem(key,value){savedStorage[key]=String(value)},
  removeItem(key){delete savedStorage[key]}
};
var savedSession={};
var sessionStorage={
  getItem(key){return Object.prototype.hasOwnProperty.call(savedSession,key)?savedSession[key]:null},
  setItem(key,value){savedSession[key]=String(value)},
  removeItem(key){delete savedSession[key]}
};
''')
        seed = {
          'yuushi.client.account': {'id':'C-1','fullName':'Client One','registeredAt':'2026-08-01','status':'Active'},
          'yuushi.admin.agencyDirectory': [
            {'id':'A-PENDING','company':'Pending Agency','registeredAt':'2026-08-20','status':'Pending','plan':'Free'},
            {'id':'A-2','company':'Active Agency','registeredAt':'2026-07-01','status':'Active','plan':'Gold'}
          ],
          'yuushi.adminSupportThreads': [
            {'id':'SUP-1','recipient':'YUUSHI Admin','status':'unresponded'}
          ],
          'yuushi.subscriptionRecords': [
            {'agencyId':'A-2','status':'Active','recurring':True,'start':'2026-01-01','end':None,'billingCycle':'Annual','fee':120000}
          ],
          'yuushi.agencyEnquiryAssignments': [
            {'id':'INQ-1','conversationId':'CONV-1','customerId':'C-1','agencyId':'A-2','propertyId':'P-1','country':'Japan',
             'createdAt':'2026-09-06T09:00:00Z',
             'messages':[{'sender':'Client','sentAt':'2026-09-06T09:00:00Z','businessHours':True},
                         {'sender':'Agency','sentAt':'2026-09-06T09:10:00Z'}]}
          ],
          'yuushi.c07.propertyReports': {
            'R-1': {'id':'R-1','propertyId':'P-1','reason':'incorrect_information','status':'awaiting_agency_response'},
            'R-2': {'id':'R-2','propertyId':'P-1','reason':'property_already_sold','status':'dismissed','dismissReason':'duplicate'}
          },
          'yuushi.analytics.propertySnapshots': [
            {'id':'P-1','agentId':'A-2','agencyId':'A-2','transaction':'For Sale','subtype':'Apartment','prefecture':'Tokyo','city':'Shinjuku','price':50000000,'floorArea':60,'age':5,'createdAt':'2026-08-01','endedAt':None,'suspensionReason':None},
            {'id':'P-2','agentId':'A-2','agencyId':'A-2','transaction':'For Rent','subtype':'Apartment','prefecture':'Tokyo','city':'Shibuya','price':180000,'floorArea':45,'age':8,'createdAt':'2026-08-15','endedAt':'2026-09-01','suspensionDate':'2026-09-01','suspensionReason':'seller-withdrew'}
          ],
          'yuushi.transactionVerificationRecords': [
            {'transactionId':'TX-1','agencyId':'A-2','propertyId':'P-1','soldDate':'2026-09-05','verificationStatus':'Pending Client Confirmation'}
          ],
          'yuushi-cms-v1': {
            'plans':[{'name':'Gold','price':10000,'status':'Active'}],
            'features':[],'addons':[],'slots':[],
            'bookings':[{'id':'AD-1','account':'Active Agency','status':'Pending Review'}],
            'transactions':[]
          },
          'yuushi.analytics.events.v1': [
            {'eventId':'E-1','type':'session_started','occurredAt':'2026-09-07T00:00:00Z','sessionId':'S-1','accountId':'C-1','accountType':'Customer','portal':'Client','anonymousVisitorId':'AN-1'},
            {'eventId':'E-2','type':'session_ended','occurredAt':'2026-09-07T00:20:00Z','sessionId':'S-1','accountId':'C-1','accountType':'Customer','portal':'Client','anonymousVisitorId':'AN-1'},
            {'eventId':'E-3','type':'session_started','occurredAt':'2026-09-07T01:00:00Z','sessionId':'S-G','accountId':None,'accountType':'Guest','portal':'Client','anonymousVisitorId':'AN-G'},
            {'eventId':'E-4','type':'page_view','occurredAt':'2026-09-07T01:00:01Z','sessionId':'S-G','accountId':None,'accountType':'Guest','portal':'Client','anonymousVisitorId':'AN-G','page':'/'},
            {'eventId':'E-5','type':'inquiry_created','occurredAt':'2026-09-06T09:00:00Z','accountId':'C-1','accountType':'Customer','portal':'Client','propertyId':'P-1','agencyId':'A-2'},
            {'eventId':'E-6','type':'account_status_changed','occurredAt':'2026-09-02T10:00:00Z','withdrawnAt':'2026-09-02T10:00:00Z','accountId':'C-W','accountType':'Customer','oldStatus':'Active','newStatus':'Withdrawn','withdrawalReasonCode':'found_property_elsewhere'}
          ]
        }
        for key, value in seed.items():
            ctx.eval("localStorage.setItem("+json.dumps(key)+","+json.dumps(json.dumps(value))+")")
        ctx.eval((ROOT.parent/'analytics-platform.js').read_text())
        for name in ['overview-spec.js','overview-data.js','overview-model.js','overview-charts.js']:
            ctx.eval((ROOT/name).read_text())
        return ctx


    def test_business_account_scope_and_queues(self):
        ctx=self.context()
        self.assertTrue(ctx.eval("OverviewDemo.data.agencies.every(a=>a.type==='Agency')"))
        self.assertEqual(ctx.eval("OverviewModel.pendingAgencies()"),1)
        self.assertEqual(ctx.eval("OverviewModel.unrespondedMessages()"),1)
        self.assertEqual(ctx.eval("OverviewModel.unrespondedMessages([{recipient:'Agency',status:'unresponded'}])"),0)
        self.assertEqual(ctx.eval("OverviewModel.pendingAgencies([{type:'Staff',status:'Pending'}])"),0)
        self.assertEqual(ctx.eval("""(()=>{const a={id:'A',type:'Agency',registeredAt:'2026-01-01',logins:['2026-09-07']};return OverviewModel.activity([a,a,{...a,id:'B',type:'Admin'},{...a,id:'C',type:'Support'},{...a,id:'D',type:'Staff'}],'2026-09-07',30)})()"""),1)
        self.assertEqual(ctx.eval("OverviewDemo.data.reports.filter(r=>['awaiting_agency_response','pending_admin_review'].includes(r.status)).length"),1)

    def test_mrr_monthly_equivalent_and_active_only(self):
        ctx=self.context()
        ctx.eval("var sub={agencyId:'A-2',status:'Active',recurring:true,start:'2020-01-01',end:null,billingCycle:'Annual',fee:120000}")
        self.assertEqual(ctx.eval("OverviewModel.mrr('2026-09-07',[sub])"),10000)
        self.assertEqual(ctx.eval("OverviewModel.mrr('2026-09-07',[sub,{...sub,billingCycle:'Monthly',fee:5000},{...sub,status:'Cancelled'},{...sub,recurring:false},{...sub,start:'2027-01-01'},{...sub,end:'2026-09-07'}])"),15000)
    def test_operational_export_uses_corrected_queues(self):
        ctx=self.app_context('reports')
        ctx.eval("document.handlers.click({target:{closest(){return {dataset:{export:'report-operations'}}}}})")
        csv=ctx.eval('lastCSV')
        self.assertIn('Unresponded Messages',csv)
        self.assertIn('Pending Agency Reviews',csv)
        self.assertNotIn('Unresponded Inquiries',csv)
        self.assertNotIn('Pending Agent Reviews',csv)

    def test_target_validation_and_progress(self):
        ctx=self.app_context('kpi')
        ctx.eval("var t={metric:'users',start:'2026-09-07',end:'2026-09-07',value:2}")
        self.assertTrue(ctx.eval("OverviewModel.validateTarget(t)"))
        self.assertTrue(ctx.eval("OverviewModel.validateTarget({...t,metric:'subscription',value:1.5})"))
        self.assertTrue(ctx.eval("[ {...t,start:''},{...t,end:''},{...t,end:'2026-09-06'},{...t,value:0},{...t,value:-1},{...t,value:Infinity},{...t,value:NaN},{...t,value:1.5},{...t,metric:'invented'},{...t,start:'2026-02-30'} ].every(t=>!OverviewModel.validateTarget(t))"))
        ctx.eval("document.getElementById('targetSettings').click()")
        html=ctx.eval("document.getElementById('dialogBody').innerHTML")
        for label in ['Target Metric','Start Date','End Date','Target Value']:self.assertIn(label,html)
        for label in ['Daily','Monthly','Yearly']:self.assertNotIn(label,html)
        ctx.eval("document.getElementById('targetMetric').value='totalRevenue';document.getElementById('targetValue').value='100';document.getElementById('targetForm').onsubmit({preventDefault(){}})")
        self.assertEqual(len(json.loads(ctx.eval("savedStorage['yuushi.overview.targets']"))),1)
        self.assertIn('%',ctx.eval("document.getElementById('targetCards').innerHTML"))
        self.assertEqual(ctx.eval('OverviewModel.ratio(25,100)'),25)

    def test_all_javascript_parses(self):
        ctx=quickjs.Context()
        for path in ROOT.glob('*.js'):
            with self.subTest(path=path.name):
                ctx.eval('new Function('+json.dumps(path.read_text())+')')


    def test_withdrawal_and_inactivity_boundaries(self):
        ctx=self.context()
        actual=json.loads(ctx.eval('''JSON.stringify((()=>{
          const M=OverviewModel;
          const base={type:'Client',registeredAt:'2025-01-01',logins:['2026-06-09'],withdrawnAt:null};
          const users=[base,{...base,logins:['2026-06-10','2026-09-07']},{...base,logins:['2026-06-09','2026-09-07']}];
          return {stats:M.withdrawalStats(users,'2026-09-01','2026-09-07'),stock:M.inactiveCount(users,'2026-09-07')};
        })())'''))
        self.assertEqual(actual['stats'],{'withdrawals':1})
        self.assertEqual(actual['stock'],1)
        self.assertEqual(ctx.eval("OverviewDemo.data.analyticsEvents.filter(e=>e.type==='account_status_changed'&&e.newStatus==='Withdrawn').length"),1)
    def test_inactivity_history_not_only_latest_login(self):
        ctx=self.context()
        value=json.loads(ctx.eval('''JSON.stringify(OverviewModel.inactivityEvents({registeredAt:'2025-01-01',logins:['2025-01-02','2025-05-01','2025-09-01'],withdrawnAt:null},'2025-12-31'))'''))
        self.assertEqual(value,['2025-04-02','2025-07-30','2025-11-30'])

    def test_error_log_window_and_exclusions(self):
        ctx=self.context()
        value=ctx.eval('''(()=>{const now=Date.parse('2026-09-07T12:00:00Z');const base={severity:'ERROR',source:'server',kind:'system',timestamp:'2026-09-07T11:00:00Z'};const logs=[base,{...base,severity:'WARN'},{...base,severity:'FATAL'},{...base,severity:'INFO'},{...base,source:'frontend'},{...base,kind:'validation'},{...base,timestamp:'2026-09-06T12:00:00Z'},{...base,timestamp:'2026-09-07T13:00:00Z'}];return OverviewModel.errorLogs(logs,now).length})()''')
        self.assertEqual(value,3)

    def test_fraud_settings_unique_unhandled_flags(self):
        ctx=self.context()
        result=ctx.eval("OverviewModel.fraudCount([{id:'1',alertId:'a',status:'unhandled'},{id:'1',alertId:'a',status:'unhandled'},{id:'2',alertId:'b',status:'unhandled'},{id:'3',alertId:'a',status:'handled'},{id:'4',alertId:'not-fraud',status:'unhandled'}],{a:true,b:false,'not-fraud':true},[{id:'a',fraud:true},{id:'b',fraud:true},{id:'not-fraud',fraud:false}])")
        self.assertEqual(result,1)

    def test_payment_categories_include_unknown_in_other(self):
        ctx=self.context()
        values=json.loads(ctx.eval("JSON.stringify(OverviewModel.paymentBreakdown([{id:'1',category:'Card declined',status:'unresolved'},{id:'1',category:'Card declined',status:'unresolved'},{id:'2',category:'New gateway reason',status:'unresolved'},{id:'3',category:'Card expired',status:'resolved'}]))"))
        self.assertEqual(len(values),5)
        self.assertEqual(sum(v['count'] for v in values),2)
        self.assertEqual(values[-1]['count'],1)

    def test_system_issues_contract_and_safe_breakdown(self):
        ctx=self.context()
        value=json.loads(ctx.eval("""JSON.stringify((()=>{const now=Date.parse('2026-09-07T12:00:00Z'),base={occurredAt:'2026-09-07T11:00:00Z',source:'server',kind:'system',occurrenceCount:2};return OverviewModel.systemIssueSummary([{...base,severity:'CRITICAL'},{...base,severity:'ERROR',occurrenceCount:3},{...base,severity:'WARN',occurrenceCount:4},{...base,severity:'INFO',occurrenceCount:99},{...base,severity:'ERROR',kind:'validation',occurrenceCount:99}],now)})())"""))
        self.assertEqual({k:value[k] for k in ['total','critical','error','warning']},{'total':9,'critical':2,'error':3,'warning':4})

    def test_response_cycles_use_last_client_and_first_agency_messages(self):
        ctx=self.context()
        cycles=json.loads(ctx.eval("""JSON.stringify(OverviewModel.responseCycles([{id:'C1',messages:[{sender:'Client',sentAt:'2026-09-07T00:00:00Z',businessHours:true},{sender:'Client',sentAt:'2026-09-07T00:05:00Z',businessHours:false},{sender:'Agency',sentAt:'2026-09-07T00:20:00Z'},{sender:'Agency',sentAt:'2026-09-07T00:22:00Z'},{sender:'Client',sentAt:'2026-09-07T01:00:00Z',businessHours:true},{sender:'Agency',sentAt:'2026-09-07T01:10:00Z'}]}]))"""))
        self.assertEqual([(c['responseMinutes'],c['businessHours']) for c in cycles],[(15,False),(10,True)])

    def test_paid_ad_metrics_never_reuse_organic_counters(self):
        ctx=self.context()
        value=json.loads(ctx.eval("""JSON.stringify(OverviewModel.adPerformance([
          {impressions:99,views:88,clicks:77,inquiries:66,adImpressions:10,adViews:8,adClicks:4,adInquiries:2},
          {impressions:50,views:40,clicks:30,inquiries:20,adImpressions:5,adViews:4,adClicks:1,adInquiries:1}
        ]))"""))
        self.assertEqual(value['adImpressions'],15)
        self.assertEqual(value['adViews'],12)
        self.assertEqual(value['adClicks'],5)
        self.assertEqual(value['adInquiries'],3)
        self.assertAlmostEqual(value['adCtr'],100/3)
        self.assertEqual(value['adCvr'],60)
        self.assertFalse(ctx.eval("YuushiAnalytics.overviewMetricStatus('r115').ready"))


    def test_finalized_admin_srs_metric_contracts(self):
        ctx=self.context()
        self.assertEqual(ctx.eval("OverviewSpec.metrics.find(s=>s.id==='r74').title"),'Ad Spend per Agency')
        self.assertTrue(ctx.eval("['r57','r58','r59','r60','r72','r74','r82','r83','r84','r125','r142'].every(id=>OverviewSpec.metrics.find(s=>s.id===id).calculation.trim())"))
        self.assertTrue(ctx.eval("OverviewSpec.metrics.find(s=>s.id==='r60').calculation.includes('LAST Client message')&&OverviewSpec.metrics.find(s=>s.id==='r60').calculation.includes('FIRST following Agency reply')"))
        self.assertTrue(ctx.eval("OverviewSpec.metrics.find(s=>s.id==='r125').calculation.includes('never combined into a weighted score')"))


    def test_property_attribute_popularity_ranking(self):
        ctx=self.context()
        self.assertFalse(ctx.eval("YuushiAnalytics.overviewMetricStatus('r125').ready"))
        ctx.eval("var popularityFilters={start:'2026-08-01',end:'2026-09-07',unit:'Monthly',transaction:'All',membership:'All',breakdown:'structure'}")
        self.assertTrue(ctx.eval("OverviewModel.metric({id:'r125'},popularityFilters).unavailable"))
        label=ctx.eval("OverviewModel.result([{label:'x',impressions:1}],['impressions']).columns[0].label")
        self.assertEqual(label,'Standard Listing Impressions (IMP)')
        app=self.app_context('market')
        html=app.eval("document.getElementById('metric-r125').outerHTML")
        self.assertIn('Source not ready',html)

    def test_every_in_scope_analytics_metric_renders_and_filters(self):
        ctx=self.context()
        ctx.eval("var f={start:'2026-08-09',end:'2026-09-07',unit:'Monthly',transaction:'All',membership:'All'}")
        values=json.loads(ctx.eval('''JSON.stringify(OverviewSpec.metrics.filter(s=>!s.outOfScope&&s.definition&&((s.row>=35&&s.row<=137)||[28,29,30,31,32].includes(s.row))).map(s=>{let r;try{r=OverviewModel.metric(s,f)}catch(e){return {id:s.id,error:String(e)}}return {id:s.id,unavailable:!!r.unavailable,columns:r.columns.length,rows:r.rows.length}}))'''))
        self.assertGreater(len(values),70)
        self.assertFalse(any(v.get('error') for v in values))
        self.assertTrue(any(v.get('unavailable') for v in values))
        self.assertTrue(all(v.get('unavailable') or v.get('columns',0)>0 for v in values))
        self.assertTrue(ctx.eval("OverviewModel.filteredFacts({...f,transaction:'For Rent',prefectures:['Tokyo']}).every(r=>{const p=OverviewDemo.data.properties.find(p=>p.id===r.propertyId);return !p||p.transaction==='For Rent'&&p.prefecture==='Tokyo'})"))
        self.assertEqual(ctx.eval("OverviewModel.filteredFacts({...f,prefectures:['Not in data']}).length"),0)

    def test_metric_calculation_is_merged_into_description(self):
        ctx=self.app_context('properties')
        html=ctx.eval("document.getElementById('mainContent').innerHTML")
        self.assertIn('Source not ready',html)
        self.assertIn('Requires analytics instrumentation / operational data source.',html)
        self.assertFalse(ctx.eval("YuushiAnalytics.overviewMetricStatus('r31').ready"))
    def test_scope_and_fraud_source(self):
        ctx=self.context()
        self.assertEqual(ctx.eval('OverviewSpec.metrics.filter(s=>s.outOfScope).length'),51)
        self.assertEqual(ctx.eval('OverviewSpec.alerts.filter(a=>a.fraud).length'),6)
        self.assertFalse(ctx.eval("OverviewSpec.metrics.find(s=>s.id==='r75').outOfScope"))
        self.assertFalse(ctx.eval("OverviewSpec.metrics.find(s=>s.id==='r84').outOfScope"))


    def test_chat_counts_reconcile_and_guest_activity_is_separate(self):
        ctx=self.context()
        ctx.eval("var f={start:'2026-08-01',end:'2026-09-07',unit:'Monthly',transaction:'All',membership:'All'}")
        user_count=ctx.eval("OverviewModel.sum(OverviewModel.metric({id:'r58'},{...f,breakdown:'customerId'}).rows,'messagesUser')")
        agency_count=ctx.eval("OverviewModel.sum(OverviewModel.metric({id:'r59'},f).rows,'messagesAgent')")
        self.assertEqual(user_count,1)
        self.assertEqual(agency_count,1)
        keys=json.loads(ctx.eval("JSON.stringify(OverviewModel.metric({id:'r44'},{...f,membership:'Non-Members'}).columns.map(c=>c.key))"))
        self.assertEqual(keys,['guestDau','guestWau','guestMau'])

    def test_capacity_option_periods_and_price_units(self):
        ctx=self.context()
        ctx.eval("var f={start:'2026-08-01',end:'2026-09-07',unit:'Monthly',transaction:'All',membership:'All'}")
        for metric_id in ['r72','r76','r103']:
            self.assertTrue(ctx.eval("OverviewModel.metric({id:"+json.dumps(metric_id)+"},f).unavailable"))
        self.assertEqual(ctx.eval("OverviewCharts.number(null,'%')"),'—')
    def app_context(self,page):
        ctx=self.context()
        ctx.eval('var PAGE='+json.dumps(page))
        ctx.eval(DOM)
        ctx.eval((ROOT/'overview-app.js').read_text())
        return ctx


    def test_report_export_and_schedule_persistence(self):
        ctx=self.app_context('reports')
        ctx.eval("document.getElementById('buildReport').click();document.handlers.click({target:{closest(){return {dataset:{export:'custom'}}}}})")
        self.assertIn('export prepared for demo',ctx.eval("document.getElementById('toast').textContent"))
        ctx.eval("document.getElementById('shortcutName').value='Tokyo review';document.getElementById('saveShortcut').click()")
        self.assertIn('Tokyo review',ctx.eval("savedStorage['yuushi.overview.reportShortcuts']"))
        ctx.eval("document.getElementById('scheduleRecipients').value='one@example.com, two@example.com';document.getElementById('scheduleForm').onsubmit({preventDefault(){}})")
        schedule=json.loads(ctx.eval("savedStorage['yuushi.overview.reportSchedules']"))[0]
        self.assertEqual(schedule['recipients'],['one@example.com','two@example.com'])
        self.assertIn('start',schedule['filters'])
        self.assertIn('Reports by Report Reason',ctx.eval("document.getElementById('mainContent').innerHTML"))
        self.assertIn('Dismissed Reports by Dismiss Reason',ctx.eval("document.getElementById('mainContent').innerHTML"))
    def test_fraud_toggle_updates_saved_settings(self):
        ctx=self.app_context('kpi')
        ctx.eval("document.getElementById('fraudSettings').click();const form=document.getElementById('fraudForm');form.onsubmit({preventDefault(){},target:{elements:Object.fromEntries(OverviewSpec.alerts.filter(a=>a.fraud).map(a=>[a.id,{checked:false}]))}})")
        settings=json.loads(ctx.eval("savedStorage['yuushi.overview.fraudKpi']"))
        self.assertEqual(len(settings),6)
        self.assertFalse(any(settings.values()))


    def test_kpi_measure_change_keeps_twelve_month_window(self):
        ctx=self.app_context('kpi')
        status=ctx.eval("YuushiAnalytics.overviewMetricStatus('r28').ready")
        self.assertFalse(status)
        html=ctx.eval("document.getElementById('metric-r28').outerHTML")
        self.assertIn('Source not ready',html)

    def test_funnel_series_toggle(self):
        ctx=self.app_context('users')
        html=ctx.eval("document.getElementById('metric-r54').outerHTML")
        self.assertIn('Source not ready',html)
        self.assertFalse(ctx.eval("YuushiAnalytics.overviewMetricStatus('r54').ready"))
    def test_page_assets_and_navigation_exist(self):
        class Links(HTMLParser):
            def __init__(self):super().__init__();self.links=[]
            def handle_starttag(self,tag,attrs):
                attrs=dict(attrs)
                if tag in ['link','script']:self.links.append(attrs.get('src') or attrs.get('href'))
        for path in ROOT.glob('*-dashboard.html'):
            parser=Links();parser.feed(path.read_text())
            for link in parser.links:
                if link and not link.startswith(('http:', 'https:')):
                    self.assertTrue((path.parent/link).exists(),str(path)+': '+link)
        for url in ['messagesupport/admin-messages.html','property/property-report-management.html','monetisation ads/05-booking-approvals.html','usermanagement/agent-management.html']:
            self.assertTrue((ROOT.parent/url).exists(),url)

    def test_every_page_initializes(self):
        for page in ['kpi','content','users','agents','properties','ads','market','cross','league','marketing','reports','financial','sales']:
            with self.subTest(page=page):
                ctx=self.context()
                ctx.eval('var PAGE='+json.dumps(page))
                ctx.eval(DOM)
                ctx.eval((ROOT/'overview-app.js').read_text())
                html=ctx.eval("document.getElementById('mainContent').innerHTML")
                self.assertGreater(len(html),100)
                self.assertNotIn('could not be calculated',html)

if __name__=='__main__':unittest.main()
