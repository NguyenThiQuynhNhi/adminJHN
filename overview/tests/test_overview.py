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
        for name in ['overview-spec.js','overview-data.js','overview-model.js','overview-charts.js']:
            ctx.eval((ROOT/name).read_text())
        return ctx

    def test_all_javascript_parses(self):
        ctx=quickjs.Context()
        for path in ROOT.glob('*.js'):
            with self.subTest(path=path.name):
                ctx.eval('new Function('+json.dumps(path.read_text())+')')

    def test_withdrawal_and_inactivity_boundaries(self):
        ctx=self.context()
        actual=json.loads(ctx.eval('''JSON.stringify((()=>{
          const M=OverviewModel;
          const base={type:'Customer',registeredAt:'2025-01-01',logins:['2026-06-09'],withdrawnAt:null,withdrawalReason:''};
          const users=[base,{...base,withdrawnAt:'2026-09-02',withdrawalReason:'Moved away'},{...base,withdrawnAt:'2026-09-03',withdrawalReason:''},{...base,logins:['2026-06-10','2026-09-07']},{...base,logins:['2026-06-09','2026-09-07']}];
          return {events:M.inactivityEvents(base,'2026-09-07'),stats:M.withdrawalStats(users,'2026-09-01','2026-09-07'),stock:M.inactiveCount(users,'2026-09-07')};
        })())'''))
        self.assertIn('2026-09-07',actual['events'])
        self.assertEqual(actual['stats'],{'withdrawals':1,'newlyInactive':1})
        self.assertEqual(actual['stock'],1)

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
        result=ctx.eval("OverviewModel.fraudCount([{id:'1',alertId:'a',status:'unhandled'},{id:'1',alertId:'a',status:'unhandled'},{id:'2',alertId:'b',status:'unhandled'},{id:'3',alertId:'a',status:'handled'}],{a:true,b:false})")
        self.assertEqual(result,1)

    def test_payment_categories_include_unknown_in_other(self):
        ctx=self.context()
        values=json.loads(ctx.eval("JSON.stringify(OverviewModel.paymentBreakdown([{id:'1',category:'Card declined',status:'unresolved'},{id:'1',category:'Card declined',status:'unresolved'},{id:'2',category:'New gateway reason',status:'unresolved'},{id:'3',category:'Card expired',status:'resolved'}]))"))
        self.assertEqual(len(values),5)
        self.assertEqual(sum(v['count'] for v in values),2)
        self.assertEqual(values[-1]['count'],1)

    def test_every_in_scope_analytics_metric_renders_and_filters(self):
        ctx=self.context()
        ctx.eval("var f={start:'2026-08-09',end:'2026-09-07',unit:'Monthly',transaction:'All',membership:'All'}")
        values=json.loads(ctx.eval('''JSON.stringify(OverviewSpec.metrics.filter(s=>!s.outOfScope&&s.definition&&((s.row>=35&&s.row<=137)||[28,29,30,31,32].includes(s.row))).map(s=>{const r=OverviewModel.metric(s,f);return {id:s.id,rows:r.rows.length,html:OverviewCharts.render(r).length,columns:r.columns.length}}))'''))
        self.assertGreater(len(values),70)
        self.assertTrue(all(v['html'] and v['columns'] for v in values))
        self.assertTrue(ctx.eval("OverviewModel.filteredFacts({...f,transaction:'For Rent',prefectures:['Tokyo']}).every(r=>{const p=OverviewDemo.data.properties.find(p=>p.id===r.propertyId);return p.transaction==='For Rent'&&p.prefecture==='Tokyo'})"))
        self.assertEqual(ctx.eval("OverviewModel.filteredFacts({...f,prefectures:['Not in data']}).length"),0)

    def test_scope_and_fraud_source(self):
        ctx=self.context()
        self.assertEqual(ctx.eval('OverviewSpec.metrics.filter(s=>s.outOfScope).length'),51)
        self.assertEqual(ctx.eval('OverviewSpec.alerts.filter(a=>a.fraud).length'),6)
        self.assertFalse(ctx.eval("OverviewSpec.metrics.find(s=>s.id==='r75').outOfScope"))
        self.assertFalse(ctx.eval("OverviewSpec.metrics.find(s=>s.id==='r84').outOfScope"))

    def test_chat_counts_reconcile_and_guest_activity_is_separate(self):
        ctx=self.context()
        ctx.eval("var f={start:'2026-08-01',end:'2026-09-07',unit:'Monthly',transaction:'All',membership:'All'}")
        counts=json.loads(ctx.eval("""JSON.stringify(['r57','r58','r58'].map((id,i)=>OverviewModel.sum(OverviewModel.metric({id},{...f,breakdown:i===2?'customerId':'country'}).rows,'messagesUser')))"""))
        self.assertGreater(counts[0],0)
        self.assertEqual(len(set(counts)),1)
        keys=json.loads(ctx.eval("JSON.stringify(OverviewModel.metric({id:'r44'},{...f,membership:'Non-Members'}).columns.map(c=>c.key))"))
        self.assertEqual(keys,['guestDau','guestWau','guestMau'])

    def test_capacity_option_periods_and_price_units(self):
        ctx=self.context()
        ctx.eval("var f={start:'2026-08-01',end:'2026-09-07',unit:'Monthly',transaction:'All',membership:'All'}")
        self.assertTrue(ctx.eval("OverviewModel.metric({id:'r72'},f).rows.every(r=>r.atCapacityRate>=0&&r.atCapacityRate<=100)"))
        self.assertTrue(ctx.eval("OverviewModel.metric({id:'r76'},f).rows.every(r=>/^2026-(08|09) · /.test(r.label)&&r.purchasers<=r.purchases)"))
        self.assertEqual(ctx.eval("OverviewModel.metric({id:'r103'},{...f,transaction:'For Rent'}).columns.find(c=>c.key==='perSqm').unit"),'JPY/m²/month')
        self.assertEqual(ctx.eval("OverviewModel.metric({id:'r103'},f).kind"),'table')
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
        self.assertIn('Impressions',ctx.eval('lastCSV'))
        self.assertTrue(ctx.eval("lastDownload.name.startsWith('custom-')"))
        ctx.eval("document.getElementById('shortcutName').value='Tokyo review';document.getElementById('saveShortcut').click()")
        self.assertIn('Tokyo review',ctx.eval("savedStorage['yuushi.overview.reportShortcuts']"))
        ctx.eval("document.getElementById('scheduleRecipients').value='one@example.com, two@example.com';document.getElementById('scheduleForm').onsubmit({preventDefault(){}})")
        schedule=json.loads(ctx.eval("savedStorage['yuushi.overview.reportSchedules']"))[0]
        self.assertEqual(schedule['recipients'],['one@example.com','two@example.com'])
        self.assertIn('start',schedule['filters'])
        ctx.eval("document.handlers.click({target:{closest(){return {dataset:{export:'report-anonymized'}}}}})")
        csv=ctx.eval('lastCSV')
        for excluded in ['CU-','AG-','@','Customer ','Agency ','IP address']:
            self.assertNotIn(excluded,csv)
        ctx.eval("document.handlers.click({target:{closest(){return {dataset:{export:'report-revenue'}}}}})")
        self.assertIn('Month-on-month change',ctx.eval('lastCSV'))

    def test_fraud_toggle_updates_saved_settings(self):
        ctx=self.app_context('kpi')
        ctx.eval("document.getElementById('fraudSettings').click();const form=document.getElementById('fraudForm');form.onsubmit({preventDefault(){},target:{elements:Object.fromEntries(OverviewSpec.alerts.filter(a=>a.fraud).map(a=>[a.id,{checked:false}]))}})")
        settings=json.loads(ctx.eval("savedStorage['yuushi.overview.fraudKpi']"))
        self.assertEqual(len(settings),6)
        self.assertFalse(any(settings.values()))

    def test_kpi_measure_change_keeps_twelve_month_window(self):
        ctx=self.app_context('kpi')
        ctx.eval("document.handlers.change({target:{dataset:{measure:'r28'},value:'subscription'}})")
        html=ctx.eval("document.getElementById('metric-r28').outerHTML")
        self.assertIn('2025-10',html)
        self.assertIn('12 rows',html)

    def test_funnel_series_toggle(self):
        ctx=self.app_context('users')
        ctx.eval("['sessions','clicks','saves','inquiries','deals'].forEach(value=>document.handlers.change({target:{dataset:{series:'r54'},value,checked:false}}))")
        self.assertIn('Select a funnel series',ctx.eval("document.getElementById('metric-r54').outerHTML"))
        ctx.eval("document.handlers.change({target:{dataset:{series:'r54'},value:'deals',checked:true}})")
        self.assertNotIn('Select a funnel series',ctx.eval("document.getElementById('metric-r54').outerHTML"))

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
        for url in ['messagesupport/admin-messages.html','property/property-report-management.html','monetisation ads/admin-booking-approvals.html','usermanagement/agent-management.html']:
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
