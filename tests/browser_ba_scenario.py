"""BA regression checks. Serve repository on 8766 and use a dedicated Chrome on CDP 9227.
Uses Python standard library only; browser suites restore local/session mock state.
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
  elif length==127:length=struct.unpack('!Q',self.read(8))[0]
  if length>20_000_000:raise RuntimeError('Unexpected WebSocket frame size: '+str(length)+' header '+h.hex())
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

from pathlib import Path
c=CDP();c.s.settimeout(60);c.call('Runtime.enable');c.call('Page.enable');c.call('Network.enable');c.call('Network.setCacheDisabled',{'cacheDisabled':True})
c.call('Page.navigate',{'url':'http://127.0.0.1:8766/_agent-portal/staff-management.html?baqa=1'})
c.wait("document.readyState==='complete'&&typeof YuushiBA!=='undefined'")
root=Path(__file__).resolve().parent
for suite in sys.argv[1:] or ['ba-browser-checks.js','export-browser-checks.js','agency-message-browser-checks.js']:
 result=c.js((root/suite).read_text())
 print(suite,result)
