const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const store=new Map(),session=new Map();const storage=m=>({getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)});
const c={localStorage:storage(store),sessionStorage:storage(session)};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('_agent-portal/agency-permissions.js','utf8'),c);
const P=c.YuushiAgencyPermissions,r={id:'INQ-QA',agencyId:'AG-QA',assignedStaffId:'STAFF-QA',msgs:[{text:'Private inquiry'}]},admin={agencyId:'AG-QA',roleId:'admin',role:'Agency Admin'},staff={agencyId:'AG-QA',roleId:'sales',staffId:'STAFF-QA'};
assert(P.can(r,'view',admin));assert(!P.can(r,'reply',admin));assert(P.can(r,'view',staff));assert(P.can(r,'reply',staff));assert(!P.can({...r,assignedStaffId:'OTHER'},'view',staff));assert(!P.can({...r,agencyId:'OTHER'},'view',admin));
const roles=P.load();roles.find(x=>x.id==='admin').perms.inquiries.actions.reply=true;P.save(roles);assert(P.can(r,'reply',admin));
roles.find(x=>x.id==='sales').perms.inquiries.actions.view=false;P.save(roles);assert(!P.can(r,'view',staff));assert(!P.can(r,'reply',staff));assert(!P.can(r,'view',{...staff,roleId:'unknown'}));
for(const role of ['Platform Admin','Platform Staff']){assert(!P.can(r,'view',{...admin,role}));assert(!P.can(r,'reply',{...admin,role}));}
c.localStorage.setItem('yuushi.agencyEnquiryAssignments',JSON.stringify([r]));assert(P.conversation(r.id,admin));assert(!P.conversation(r.id,staff));session.set('yuushi.activePortal','platform');assert(!P.conversation(r.id,admin));session.clear();
c.localStorage.setItem('yuushi.agencyStaffAccess',JSON.stringify({'STAFF-QA':{status:'Suspended'}}));assert(!P.can(r,'reply',staff));
console.log('PASS: Agency Admin read-only/explicit Reply, role-controlled staff access, own/agency scope, Platform denial and shared conversation lookup.');
