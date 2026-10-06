/* Shared Agency Role & Permission matrix. Normal customer conversations never grant Platform access. */
(function(root){
'use strict';
      const sections = {
        listings: [
          {
            key: "listings_view",
            name: "Property listings",
            desc: "See and search property listings. Own means records where the staff member is Responsible Staff; Created By is audit information only.",
            hasScope: true,
            actions: ["create", "edit", "delete", "publish"],
          },
          {
            key: "listings_drafts",
            name: "Listing drafts",
            desc: "Save and reopen incomplete listing drafts. Own follows Responsible Staff, not Created By.",
            hasScope: true,
            actions: ["create", "edit", "delete"],
          },
          {
            key: "new_dev",
            name: "New development projects",
            desc: "Manage new-development project records and floor plans. Own follows Responsible Staff, not Created By.",
            hasScope: true,
            actions: ["create", "edit", "delete"],
          },
        ],
        inquiries: [
          {
            key: "inquiries",
            name: "Inquiries from clients",
            desc: "View and reply are separate permissions. Agency Admin can view agency conversations; replying requires explicit Reply permission. Own means currently assigned inquiries.",
            hasScope: true,
            actions: ["view", "reply", "assign", "close"],
          },
          {
            key: "leads",
            name: "Lead group / saved searches",
            desc: "Manage saved client Leads and saved-search groupings. Own follows Assigned To, not Created By.",
            hasScope: true,
            actions: ["create", "edit", "delete", "assign", "close"],
          },
          {
            key: "appraisals",
            name: "Appraisal requests",
            desc: "Receive and respond to property valuation requests from sellers.",
            hasScope: true,
            actions: ["accept", "quote", "close"],
          },
        ],
        analytics: [
          {
            key: "analytics",
            name: "Dashboard",
            desc: "View agency-level Dashboard metrics. Dashboard does not use Own/Agency data scope.",
            hasScope: false,
            actions: ["view", "export"],
          },
          {
            key: "rev_reports",
            name: "Sales value & billing reports",
            desc: "Sales pipeline reports, closed deals, monthly sales value and billing.",
            hasScope: true,
            actions: ["export"],
          },
        ],
        ads: [
          {
            key: "ad_sponsored",
            name: "Sponsored listing slots",
            desc: "Boost listings into ranked positions in search results.",
            hasScope: true,
            actions: ["create", "edit", "cancel"],
          },
          {
            key: "ad_banner",
            name: "Banner & featured ads",
            desc: "Purchase home / category banner placements.",
            hasScope: true,
            actions: ["create", "edit", "cancel"],
          },
          {
            key: "ad_appraisal",
            name: "Appraisal budget",
            desc: "Set and adjust the monthly appraisal CPL budget.",
            hasScope: true,
            actions: ["edit"],
          },
        ],
        admin: [
          {
            key: "staff",
            name: "Staff management",
            desc: "Add, edit, remove staff. Reset their passwords. Force sign-out.",
            hasScope: false,
            actions: ["view", "create", "edit", "remove"],
          },
          {
            key: "roles",
            name: "Roles & permissions",
            desc: "Manage roles and the permission matrix on this page.",
            hasScope: false,
            actions: ["view", "create", "edit", "delete"],
          },
          {
            key: "agency_profile",
            name: "Agency profile",
            desc: "Edit the agency-wide profile, branches, languages, etc.",
            hasScope: false,
            actions: ["view", "edit"],
          },
          {
            key: "billing",
            name: "Billing & plan",
            desc: "View invoices, change plan, manage payment method.",
            hasScope: false,
            actions: ["view", "edit"],
          },
        ],
      };

      // All actions across all features (for header)
      const actionsBySection = {
        listings: ["create", "edit", "delete", "publish"],
        inquiries: [
          "view",
          "reply",
          "assign",
          "close",
          "create",
          "edit",
          "delete",
          "accept",
          "quote",
        ],
        analytics: ["view", "export"],
        ads: ["create", "edit", "cancel"],
        admin: ["view", "create", "edit", "remove", "delete"],
      };

      const actionLabels = {
        view: "View",
        create: "Create",
        edit: "Edit",
        delete: "Delete",
        publish: "Publish",
        reply: "Reply",
        assign: "Assign",
        close: "Close",
        accept: "Accept",
        quote: "Quote",
        export: "Export",
        cancel: "Cancel",
        remove: "Remove",
      };

      // ============ ROLES ============
      const roles = [
        {
          id: "admin",
          name: "Agency Admin",
          desc: "Agency-wide access; customer conversations are read-only unless an explicit message action is granted. Manages staff, billing, and agency profile. Additional admins are staff; the single original Root Admin account cannot be transferred.",
          system: false,
          members: 2,
          perms: fullAccess(),
        },
        {
          id: "sales",
          name: "Sales Agent",
          desc: "Manages own listings, inquiries, and appraisals.",
          system: false,
          members: 7,
          perms: salesAccess(),
        },
        {
          id: "pmgr",
          name: "Property Manager",
          desc: "Manages assigned properties and inquiries across the agency.",
          system: false,
          members: 2,
          perms: pmgrAccess(),
        },
        {
          id: "reception",
          name: "Reception",
          desc: "Read-only access to listings and inquiries.",
          system: false,
          members: 1,
          perms: receptionAccess(),
        },
      ];

      function fullAccess() {
        const p = {};
        Object.keys(sections).forEach((s) =>
          sections[s].forEach((f) => {
            p[f.key] = { scope: f.hasScope ? "agency" : null, actions: {} };
            f.actions.forEach((a) => (p[f.key].actions[a] = true));
          }),
        );
        p.inquiries.actions = {view:true, reply:true, assign:true, close:true};
        return p;
      }
      function salesAccess() {
        const p = {};
        // Listings: own scope, can create/edit/delete/publish own
        ["listings_view", "listings_drafts"].forEach((k) => {
          p[k] = {
            scope: "own",
            actions: { create: true, edit: true, delete: true, publish: true },
          };
        });
        p["new_dev"] = {
          scope: "agency",
          actions: { create: false, edit: false, delete: false },
        };
        // Inquiries: own
        p["inquiries"] = {
          scope: "own",
          actions: { view: true, reply: true, assign: false, close: true },
        };
        p["leads"] = {
          scope: "own",
          actions: { create: true, edit: true, delete: true, assign: false, close: true },
        };
        p["appraisals"] = {
          scope: "own",
          actions: { accept: true, quote: true, close: true },
        };
        // Dashboard access is binary; metrics remain agency-level.
        p["analytics"] = { scope: null, actions: { view: true, export: true } };
        p["rev_reports"] = { scope: "own", actions: { export: false } };
        // Ads: own (sponsored / banner for own listings)
        p["ad_sponsored"] = {
          scope: "own",
          actions: { create: true, edit: true, cancel: true },
        };
        p["ad_banner"] = {
          scope: "none",
          actions: { create: false, edit: false, cancel: false },
        };
        p["ad_appraisal"] = { scope: "none", actions: { edit: false } };
        // Admin: no access except view agency profile read-only
        p["staff"] = {
          scope: null,
          actions: { view: false, create: false, edit: false, remove: false },
        };
        p["roles"] = {
          scope: null,
          actions: { view: false, create: false, edit: false, delete: false },
        };
        p["agency_profile"] = {
          scope: null,
          actions: { view: true, edit: false },
        };
        p["billing"] = { scope: null, actions: { view: false, edit: false } };
        return p;
      }
      function pmgrAccess() {
        const p = {};
        ["listings_view", "listings_drafts"].forEach((k) => {
          p[k] = {
            scope: "agency",
            actions: { create: true, edit: true, delete: false, publish: true },
          };
        });
        p["new_dev"] = {
          scope: "agency",
          actions: { create: true, edit: true, delete: false },
        };
        p["inquiries"] = {
          scope: "agency",
          actions: { view: true, reply: true, assign: true, close: true },
        };
        p["leads"] = {
          scope: "agency",
          actions: { create: true, edit: true, delete: true },
        };
        p["appraisals"] = {
          scope: "agency",
          actions: { accept: true, quote: true, close: true },
        };
        p["analytics"] = { scope: null, actions: { view: true, export: true } };
        p["rev_reports"] = { scope: "agency", actions: { export: true } };
        p["ad_sponsored"] = {
          scope: "agency",
          actions: { create: false, edit: false, cancel: false },
        };
        p["ad_banner"] = {
          scope: "none",
          actions: { create: false, edit: false, cancel: false },
        };
        p["ad_appraisal"] = { scope: "none", actions: { edit: false } };
        p["staff"] = {
          scope: null,
          actions: { view: true, create: false, edit: false, remove: false },
        };
        p["roles"] = {
          scope: null,
          actions: { view: true, create: false, edit: false, delete: false },
        };
        p["agency_profile"] = {
          scope: null,
          actions: { view: true, edit: false },
        };
        p["billing"] = { scope: null, actions: { view: false, edit: false } };
        return p;
      }
      function receptionAccess() {
        const p = {};
        ["listings_view", "listings_drafts"].forEach((k) => {
          p[k] = {
            scope: "agency",
            actions: {
              create: false,
              edit: false,
              delete: false,
              publish: false,
            },
          };
        });
        p["new_dev"] = {
          scope: "agency",
          actions: { create: false, edit: false, delete: false },
        };
        p["inquiries"] = {
          scope: "agency",
          actions: { view: true, reply: false, assign: true, close: false },
        };
        p["leads"] = {
          scope: "none",
          actions: { create: false, edit: false, delete: false },
        };
        p["appraisals"] = {
          scope: "agency",
          actions: { accept: false, quote: false, close: false },
        };
        p["analytics"] = { scope: null, actions: { view: false, export: false } };
        p["rev_reports"] = { scope: "none", actions: { export: false } };
        p["ad_sponsored"] = {
          scope: "none",
          actions: { create: false, edit: false, cancel: false },
        };
        p["ad_banner"] = {
          scope: "none",
          actions: { create: false, edit: false, cancel: false },
        };
        p["ad_appraisal"] = { scope: "none", actions: { edit: false } };
        p["staff"] = {
          scope: null,
          actions: { view: false, create: false, edit: false, remove: false },
        };
        p["roles"] = {
          scope: null,
          actions: { view: false, create: false, edit: false, delete: false },
        };
        p["agency_profile"] = {
          scope: null,
          actions: { view: true, edit: false },
        };
        p["billing"] = { scope: null, actions: { view: false, edit: false } };
        return p;
      }


const key='yuushi.agencyRoles';
function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f;}catch(e){return f;}}
function load(){return read(key,JSON.parse(JSON.stringify(roles)));}
function save(rows){localStorage.setItem(key,JSON.stringify(rows));}
function actor(){return read('yuushi.agencySignedInStaff',{staffId:'STF-0001',roleId:'admin',role:'Agency Admin',agencyId:'AG-00000001'});}
function platform(a){let portal='';try{portal=sessionStorage.getItem('yuushi.activePortal')||'';}catch(e){}return portal==='platform'||/platform|yuushi admin|support/i.test([a.role,a.accountType,a.portal].join(' '));}
function role(a){return load().find(r=>r.id===a.roleId||r.id===a.role||r.name===a.role);}
function isAdmin(a=actor()){return !platform(a)&&(a.role==='Agency Admin'||a.role==='Root Admin'||role(a)?.id==='admin');}
function can(record,action='view',a=actor()){
 if(!a||platform(a)||a.status==='Suspended'||a.status==='suspended')return false;
 const agencyId=a.agencyId||'AG-00000001';
 if(!record||record.agencyId!==agencyId)return false;
 const suspended=read('yuushi.agencyStaffAccess',{})[a.staffId||a.id];
 if(suspended?.status==='Suspended')return false;
 if(action==='view'&&isAdmin(a))return true;
 if(action!=='view'&&!can(record,'view',a))return false;
 const p=role(a)?.perms?.inquiries;
 if(!p||!p.actions?.[action]||p.scope==='none')return false;
 return p.scope==='agency'||p.scope==='own'&&(record.assignedStaffId||record.assigneeId||record.agentId)===(a.staffId||a.id);
}
function conversation(id,a=actor()){const rows=read('yuushi.agencyEnquiryAssignments',[]);const r=rows.find(r=>r.id===id||r.conversationId===id);return can(r,'view',a)?r:null;}
root.YuushiAgencyPermissions={key,sections,actionsBySection,actionLabels,load,save,actor,role,isAdmin,platform,can,conversation};
})(window);
