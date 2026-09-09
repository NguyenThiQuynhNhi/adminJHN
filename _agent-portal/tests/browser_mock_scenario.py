"""Browser smoke test. Serve repository on 8766 and start a dedicated Chrome on CDP 9227.
Uses Python standard library only; see the current handoff for commands.
"""
import socket,urllib.request,urllib.parse,json,os,struct,base64,time,sys
class CDP:
 def __init__(self):
  tabs=json.load(urllib.request.urlopen('http://127.0.0.1:9227/json'))
  u=urllib.parse.urlparse(next(x for x in tabs if x['type']=='page')['webSocketDebuggerUrl'])
  self.s=socket.create_connection((u.hostname,u.port),10);self.s.settimeout(20);self.n=0;self.events=[]
  key=base64.b64encode(os.urandom(16)).decode()
  self.s.sendall(f'GET {u.path} HTTP/1.1\r\nHost: {u.hostname}:{u.port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\nOrigin: http://localhost:9227\r\n\r\n'.encode())
  data=b''
  while b'\r\n\r\n' not in data:data+=self.s.recv(1)
  assert b'101 ' in data,data
 def read(self,n):
  b=b''
  while len(b)<n:
   chunk=self.s.recv(n-len(b))
   if not chunk:raise ConnectionError('Chrome disconnected')
   b+=chunk
  return b
 def recv(self):
  h=self.read(2);length=h[1]&127
  if length==126:length=struct.unpack('!H',self.read(2))[0]
  if length==127:length=struct.unpack('!Q',self.read(8))[0]
  return json.loads(self.read(length))
 def call(self,method,params=None):
  self.n+=1;payload=json.dumps({'id':self.n,'method':method,'params':params or {}}).encode();mask=os.urandom(4);n=len(payload)
  head=bytes([129,128+n]) if n<126 else bytes([129,254])+struct.pack('!H',n) if n<65536 else bytes([129,255])+struct.pack('!Q',n)
  self.s.sendall(head+mask+bytes(v^mask[i%4] for i,v in enumerate(payload)))
  while True:
   r=self.recv()
   if r.get('id')==self.n:
    if 'error' in r:raise RuntimeError(r['error'])
    return r.get('result',{})
   self.events.append(r)
 def js(self,expr):
  r=self.call('Runtime.evaluate',{'expression':expr,'returnByValue':True,'awaitPromise':True})
  if 'exceptionDetails' in r:raise RuntimeError(r['exceptionDetails'])
  return r.get('result',{}).get('value')
 def wait(self,expr):
  for i in range(350):
   try:
    if self.js(expr):return
   except RuntimeError as e:
    if "navigated or closed" not in str(e) and "Cannot find context" not in str(e):raise
   time.sleep(.1)
  raise AssertionError('Timeout: '+expr)
c=CDP();c.call('Runtime.enable');c.call('Page.enable')
c.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
passed=[]
c.call('Network.enable');c.call('Network.setCacheDisabled',{'cacheDisabled':True})
def check(name,test):
 assert test,name
 passed.append(name);print('PASS',name,flush=True)
def click(action):c.js(f"document.querySelector('[data-action=\"{action}\"]').click()")
def value(id,v,change=False):
 c.js(f"document.getElementById({json.dumps(id)}).value={json.dumps(v)}")
 if change:c.js(f"document.getElementById({json.dumps(id)}).dispatchEvent(new Event('change',{{bubbles:true}}))")
def submit():c.js("document.getElementById('dashboardForm').requestSubmit()")
def ready():
 time.sleep(.15);c.wait("document.readyState==='complete'&&!!document.querySelector('main')&&!document.body.innerText.includes('Loading source…')")
c.call('Page.navigate',{'url':'http://127.0.0.1:8766/_agent-portal/dashboard.html?qa=cleanup#overview'});ready()
backup=c.js("Object.fromEntries(['yuushi.agency.dashboard.mock.v2','yuushi.agency.dashboard.preview','yuushi.ads.performanceSuppressed'].map(k=>[k,localStorage.getItem(k)]))")
try:
 c.js("localStorage.removeItem('yuushi.agency.dashboard.mock.v2');AgencyDashboardData.setPreview({role:'Agency Admin',crmPremium:true,suppression:false})")
 c.call('Page.reload');ready()
 check('Overview defaults render',c.js("document.querySelectorAll('.widget').length===7"))
 matrix=c.js("""(()=>{const M=AgencyDashboardModel,D=AgencyDashboardData,V=AgencyDashboardCharts,ctx=D.context(),bad=[];let renders=0;const host=document.createElement('div');for(const m of M.metrics)for(const dimension of [undefined,'',...m.dimensions]){const w={metric:m.no,dimension},r=M.evaluate(m.no,D.read(m.source),ctx,w);for(const chart of M.charts(m,w,r)){renders++;host.innerHTML=V.render({...w,chart},r);if(/NaN|undefined/.test(host.innerText)||!host.childElementCount||!['ready','empty'].includes(r.state))bad.push([m.no,dimension,chart,r.state]);}}return {metrics:M.metrics.length,renders,bad}})()""")
 check('Every retained metric and offered renderer produces valid DOM',not matrix['bad']);print('SCOPE DOM MATRIX',json.dumps(matrix),flush=True)
 click('add-dashboard');value('editName','Scope review');submit();ready()
 click('add-panel');value('editName','Client activity');submit();ready()
 click('add-widget');value('widgetSource','inquiries',True);value('widgetMetric','65',True)
 check('Scalar count hides Top N and unrelated business settings',c.js("document.getElementById('topWrap').hidden&&!document.querySelector('#widgetStaffAttribution,#widgetAgeBands,#widgetBudgetBands,#widgetThreshold')&&document.getElementById('horizonWrap').hidden"))
 check('Date comparison is available for dated scalar',c.js("!document.getElementById('periodWrap').hidden&&!document.getElementById('compareWrap').hidden"))
 value('widgetPeriod','custom',True);check('Custom date endpoints shown only for custom period',c.js("!document.getElementById('startWrap').hidden&&!document.getElementById('endWrap').hidden"))
 value('widgetPeriod','all',True);submit();ready();check('New Inquiry widget calculates stored contexts',c.js("document.querySelector('.kpi-value').innerText==='40'"))
 click('edit-widget');value('widgetTitle','Client inquiries');submit();ready();click('save')
 c.call('Page.reload');ready();check('Builder changes survive reload',c.js("document.querySelector('.widget h3').innerText==='Client inquiries'"))
 click('duplicate-widget');ready();check('Duplicate widget',c.js("document.querySelectorAll('.widget').length===2"))
 c.js('window.confirm=()=>true');click('remove-widget');ready();check('Remove widget',c.js("document.querySelectorAll('.widget').length===1"))
 # Exports still re-evaluate current approved metrics.
 c.js("window.qaExport=null;AgencyDashboardExport.download=(rows,name,type)=>{window.qaExport={rows,name,type}}")
 click('export-csv');c.wait('!!window.qaExport');check('Export recalculates approved metric',c.js("qaExport.type==='csv'&&JSON.stringify(qaExport.rows).includes('40')"))
 click('drill');c.wait("document.getElementById('dashboardDialog').open")
 check('Details remain usable without generic Title/Record columns',c.js("document.querySelectorAll('#dashboardDialog tbody tr').length>0&&![...document.querySelectorAll('#dashboardDialog th')].some(e=>/^(Title|Record)$/i.test(e.innerText))"));click('close-dialog')
 click('save')
 # Existing saved layout migration: preserve valid dashboards/panels/widgets, remove rejected ones.
 c.js("(()=>{const k='yuushi.agency.dashboard.mock.v2',cfg=JSON.parse(localStorage.getItem(k)),d=cfg.dashboards.find(d=>d.name==='Scope review');d.panels[0].widgets.push({id:'unapproved',metric:-1,title:'Invalid stored widget',ageBands:[0,30],budgetBands:[0,100],staffAttribution:'closingStaffId'});Object.assign(d.panels[0].widgets[0],{staffAttribution:'closingStaffId',ageBands:[0,20],filters:{budgetBand:['0–100']}});localStorage.setItem(k,JSON.stringify(cfg));})()")
 c.call('Page.reload');ready();click('save')
 check('Scope migration preserves layout and removes rejected widgets/config only',c.js("(()=>{const d=JSON.parse(localStorage.getItem('yuushi.agency.dashboard.mock.v2')).dashboards.find(d=>d.name==='Scope review');return d.panels[0].name==='Client activity'&&d.panels[0].widgets.length===1&&!('staffAttribution' in d.panels[0].widgets[0])&&!('budgetBand' in d.panels[0].widgets[0].filters)})()"))
 click('add-widget')
 selector=c.js("""(()=>{const source=document.getElementById('widgetSource'),ids=[];for(const value of [...source.options].map(o=>o.value)){source.value=value;source.dispatchEvent(new Event('change',{bubbles:true}));ids.push(...[...document.getElementById('widgetMetric').options].map(o=>Number(o.value)));}return [...new Set(ids)].sort((a,b)=>a-b)})()""")
 check('Actual Add Widget selector contains exactly the 29 approved metrics',selector==[64,65,66,67,75,76,77,96,97,98,103,104,118,149,220,231,232,234,236,250,252,253,256,288,289,290,291,292,324])
 check('System/supporting IDs absent from Add Widget',not set(selector)&{56,57,58,69,70,71,73,74,78,79,156,157,159,207,271,299,300,301})
 value('widgetSource','transactions',True);value('widgetMetric','324',True)
 check('Sales attribution remains internal',c.js("!document.querySelector('#attributionWrap,#widgetStaffAttribution')"))
 check('Grouped sales shows relevant Top N and hides scalar comparison',c.js("!document.getElementById('topWrap').hidden&&document.getElementById('compareWrap').hidden"));click('close-dialog')
 click('add-widget');value('widgetSource','viewing',True);value('widgetMetric','66',True)
 check('Approved future metric retains Upcoming window',c.js("!document.getElementById('horizonWrap').hidden"));click('close-dialog')
 click('add-widget');value('widgetSource','adPerformance',True);value('widgetMetric','288',True)
 check('Generic Table is available for Ad Impressions',c.js("[...document.getElementById('widgetChart').options].some(o=>o.value==='table')"));value('widgetChart','table');submit();ready();click('save')
 check('Ad table renders actual approved metric',c.js("[...document.querySelectorAll('.widget')].some(w=>w.innerText.includes('Ad Impressions')&&w.querySelector('table'))"))
 c.js("document.querySelector('[data-action=switch][data-id=subscriptions]').click()");ready()
 check('Ads system dashboard retains curated parents without standalone sub-values',c.js("document.querySelectorAll('.widget').length===8"))
 check('Quota supporting values render within one parent card',c.js("(()=>{const card=document.querySelector('[data-system-widget=\"74\"]');return !!card&&[156,157,159].every(n=>card.querySelector('[data-supporting-field=\"'+n+'\"]'))&&card.innerText.includes('Remaining')})()"))
 check('Plan fields render inside Current Plan/Tier',c.js("(()=>{const card=document.querySelector('[data-system-widget=\"58\"]');return !!card&&[299,300,301].every(n=>card.querySelector('[data-supporting-field=\"'+n+'\"]'))})()"))
 check('Review deadline supports count, snapshot and alerts',c.js("(()=>{const articles=[...document.querySelectorAll('.widget')],pending=articles.find(a=>a.querySelector('h3').innerText==='Pending Review'),snapshot=articles.find(a=>a.querySelector('h3').innerText==='Advertising Snapshot'),alerts=document.querySelector('[data-system-widget=\"73\"]');return !!pending.querySelector('[data-supporting-field=\"271\"]')&&snapshot.innerText.includes('Review Deadline')&&!!alerts.querySelector('[data-supporting-field=\"271\"]')&&!!alerts.querySelector('[data-supporting-field=\"301\"]')})()"))
 check('Agent Rating is a header supporting field',c.js("!!document.querySelector('.workspace-top [data-supporting-field=\"57\"]')"))
 c.js("document.querySelector('[data-system-widget=\"74\"]').closest('article').querySelector('[data-action=edit-widget]').click()")
 check('System presentation settings have no metric or source selector',c.js("!document.getElementById('widgetMetric')&&!document.getElementById('widgetSource')&&!!document.getElementById('widgetTitle')"));click('close-dialog')
 # Exercise legacy migration on system dashboards and custom dashboards.
 c.js("(()=>{const k='yuushi.agency.dashboard.mock.v2',cfg=JSON.parse(localStorage.getItem(k)),d=cfg.dashboards.find(d=>d.id==='subscriptions');for(const p of d.panels)for(const w of p.widgets)if(w.systemWidget){w.metric=w.systemWidget;delete w.systemWidget;}d.panels[0].widgets.push(...[156,157,159,271,299,300,301].map(metric=>({id:'old-'+metric,metric})));const custom=cfg.dashboards.find(d=>d.name==='Scope review');custom.panels[0].widgets.push({id:'old-custom-quota',metric:74},{id:'old-custom-plan',metric:58});localStorage.setItem(k,JSON.stringify(cfg))})()")
 c.call('Page.reload');ready();click('save')
 check('Legacy system references migrate; independent supporting widgets disappear',c.js("(()=>{const cfg=JSON.parse(localStorage.getItem('yuushi.agency.dashboard.mock.v2')),sys=cfg.dashboards.find(d=>d.id==='subscriptions'),custom=cfg.dashboards.find(d=>d.name==='Scope review');return sys.panels.flatMap(p=>p.widgets).length===8&&sys.panels.flatMap(p=>p.widgets).some(w=>w.systemWidget===74)&&custom.panels.flatMap(p=>p.widgets).every(w=>AgencyDashboardModel.metrics.some(m=>m.no===w.metric))})()"))
 click('dashboard-settings');click('duplicate-dashboard');ready()
 check('Duplicating a system dashboard cannot create custom system-only widgets',c.js("document.querySelectorAll('.widget').length===3&&!document.querySelector('[data-system-widget]')"));click('save')
 c.js("document.getElementById('previewSuppression').click()");ready();click('add-widget')
 check('Suppression still hides advertising performance source',c.js("![...document.getElementById('widgetSource').options].some(o=>o.value==='adPerformance')"));click('close-dialog')
 c.js("document.getElementById('previewSuppression').click()");ready();click('save')
 c.js("document.querySelector('[data-action=switch][data-id=subscriptions]').click()");ready()
 c.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
 check('System parent cards have no mobile page overflow',c.js("document.documentElement.scrollWidth<=390"))
 c.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
finally:
 c.js('Object.entries('+json.dumps(backup)+').forEach(([k,v])=>v===null?localStorage.removeItem(k):localStorage.setItem(k,v))')
 c.call('Page.reload')
check('No uncaught application JavaScript errors',not [e for e in c.events if e.get('method')=='Runtime.exceptionThrown'])
print('BROWSER CHECKS PASSED',len(passed),flush=True)
