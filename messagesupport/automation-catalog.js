/* ============================================================================
   YUUSHI Admin — Automated Message Catalog (shared by message-center.html +
   email-center.html). 101 triggers, AUTH-001 → ADM-001.

   Each catalog entry:
     id, name (Action Content), cat, timing,
     chat:'O'|'X', email:'O'|'X', userConfig:'Yes'|'No', pattern:'A'|'B'|'C'|'D'

   Persistence: per-trigger editable state lives in localStorage key
   "yuushi.automations" as { [id]: { active, chatBody, emailSubject, emailBody } }.
   Seeded once on first load from the catalog's default drafts.
   ============================================================================ */
(function () {
  if (window.AutoStore) return; // idempotent across iframes

  const E = (id, name, cat, timing, chat, email, userConfig, pattern) => ({
    id, name, cat, timing, chat, email, userConfig, pattern,
  });

  const CATALOG = [
    // ---- Authentication (AUTH) — required account/auth flows, email channel ----
    E("AUTH-001", "Completed email registration", "AUTH", "Immediate", "X", "O", "No", "A"),
    E("AUTH-002", "Email verification link", "AUTH", "Immediate", "X", "O", "No", "A"),
    E("AUTH-003", "Password reset request", "AUTH", "Immediate", "X", "O", "No", "A"),

    // ---- Security (SEC) ----
    
    E("SEC-007", "Email address changed", "SEC", "Immediate", "X", "O", "No", "C"),
    E("SEC-008", "Phone number changed", "SEC", "Immediate", "O", "O", "No", "C"),
    E("SEC-009", "Security checkup reminder", "SEC", "30 days", "X", "O", "Yes", "B"),
    E("SEC-010", "Data export ready", "SEC", "Immediate", "X", "O", "Yes", "A"),

    // ---- Account (ACCT) ----
    E("ACCT-001", "Profile update confirmation", "ACCT", "Immediate", "X", "O", "Yes", "A"),
    E("ACCT-002", "Profile photo updated", "ACCT", "Immediate", "O", "X", "Yes", "A"),
    E("ACCT-003", "Identity verification submitted", "ACCT", "Immediate", "O", "O", "No", "A"),
  ];

  const PATTERN_DESC = {
    A: "Pattern A — Transactional confirmation, sent once when the action completes.",
    B: "Pattern B — Reminder / nudge, scheduled to follow up with the recipient.",
    C: "Pattern C — Time-sensitive alert or security / status warning.",
    D: "Pattern D — Engagement / marketing content (promotional or re-engagement).",
  };

  const CAT_LABEL = {
    AUTH: "Authentication", SEC: "Security", ACCT: "Account", PROP: "Property",
    MSG: "Messaging", LEAD: "Leads", PAY: "Payment", SUB: "Subscription",
    REP: "Reports", VIO: "Violation", ENG: "Engagement", ADM: "Admin",
  };

  const VARS = ["{full_name}", "{agent_name}", "{property_name}", "{date}", "{platform_name}"];

  // Locked ON when not user-configurable AND in an Authentication/Security/Monetization category.
  function isLocked(e) {
    return e.userConfig === "No" && ["AUTH", "SEC", "PAY", "SUB"].includes(e.cat);
  }

  // Default editable drafts derived from the trigger's name + pattern tone.
  function defaultDraft(e) {
    const greet = "Hi {full_name},";
    const sign = "— The {platform_name} team";
    const n = e.name;
    const nl = n.charAt(0).toLowerCase() + n.slice(1);
    let chat, subject, body;
    switch (e.pattern) {
      case "A":
        chat = `${greet} ${nl} is confirmed. Tap to view the details.`;
        subject = `${n} — confirmed`;
        body = `<p>${greet}</p><p>This confirms: <strong>${n}</strong>.</p><p>If you have any questions, just reply to this email.</p><p>${sign}</p>`;
        break;
      case "B":
        chat = `${greet} a quick reminder about ${nl}. Don't miss it!`;
        subject = `Reminder: ${n}`;
        body = `<p>${greet}</p><p>Just a friendly reminder regarding <strong>${n}</strong>.</p><p>Please take action before the deadline to stay on track.</p><p>${sign}</p>`;
        break;
      case "C":
        chat = `${greet} important — ${nl}. Please review right away.`;
        subject = `Action needed: ${n}`;
        body = `<p>${greet}</p><p>We're contacting you about an important update: <strong>${n}</strong>.</p><p>Please review your account on {platform_name} and take any necessary action.</p><p>${sign}</p>`;
        break;
      default: // D
        chat = `${greet} ${nl} — see what's new on {platform_name}.`;
        subject = `${n}`;
        body = `<p>${greet}</p><p><strong>${n}</strong> — discover the latest on {platform_name}, picked for you.</p><p>${sign}</p>`;
    }
    return { chatBody: chat, emailSubject: subject, emailBody: body };
  }

  function defaultActive(e) {
    if (isLocked(e)) return true; // required triggers always start ON
    // A few inactive by default to demonstrate both states.
    const off = new Set([
      "SEC-009", "ACCT-011", "PROP-013", "MSG-009", "LEAD-008",
      "SUB-008", "ENG-004", "ENG-008", "REP-006",
    ]);
    return !off.has(e.id);
  }

  const KEY = "yuushi.automations";
  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; }
  }
  function saveAll(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  function seed() {
    let store = loadAll();
    if (store && typeof store === "object" && !Array.isArray(store)) {
      // make sure every catalog id exists (forward-compatible)
      let changed = false;
      CATALOG.forEach((e) => {
        if (!store[e.id]) {
          const d = defaultDraft(e);
          store[e.id] = { active: defaultActive(e), chatBody: d.chatBody, emailSubject: d.emailSubject, emailBody: d.emailBody };
          changed = true;
        }
      });
      if (changed) saveAll(store);
      return store;
    }
    store = {};
    CATALOG.forEach((e) => {
      const d = defaultDraft(e);
      store[e.id] = { active: defaultActive(e), chatBody: d.chatBody, emailSubject: d.emailSubject, emailBody: d.emailBody };
    });
    saveAll(store);
    return store;
  }

  window.AUTOMATION_CATALOG = CATALOG;
  window.AUTO_PATTERN_DESC = PATTERN_DESC;
  window.AUTO_CAT_LABEL = CAT_LABEL;
  window.AUTO_VARS = VARS;
  window.AutoStore = {
    KEY,
    seed,
    get() { return seed(); },
    byId(id) { return CATALOG.find((e) => e.id === id); },
    state(id) { return seed()[id]; },
    isLocked,
    defaultDraft,
    setActive(id, val) { const s = seed(); if (s[id]) { s[id].active = !!val; saveAll(s); } },
    save(id, patch) { const s = seed(); if (s[id]) { Object.assign(s[id], patch); saveAll(s); } return s[id]; },
    restore(id) {
      const e = this.byId(id); if (!e) return null;
      const d = defaultDraft(e); const s = seed();
      s[id] = Object.assign({}, s[id], { chatBody: d.chatBody, emailSubject: d.emailSubject, emailBody: d.emailBody });
      saveAll(s); return s[id];
    },
  };
})();
