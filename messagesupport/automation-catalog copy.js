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
    E("AUTH-004", "Password changed confirmation", "AUTH", "Immediate", "X", "O", "No", "A"),
    E("AUTH-005", "Welcome onboarding message", "AUTH", "Immediate", "X", "O", "No", "D"),
    E("AUTH-006", "Social login linked", "AUTH", "Immediate", "X", "O", "No", "A"),
    E("AUTH-007", "Account reactivated", "AUTH", "Immediate", "X", "O", "No", "A"),
    E("AUTH-008", "Magic sign-in link", "AUTH", "Immediate", "X", "O", "No", "A"),

    // ---- Security (SEC) ----
    E("SEC-001", "Suspicious login detected", "SEC", "Immediate", "X", "O", "No", "C"),
    E("SEC-002", "New device sign-in alert", "SEC", "Immediate", "O", "O", "No", "C"),
    E("SEC-003", "Password changed alert", "SEC", "Immediate", "O", "X", "No", "C"),
    E("SEC-004", "Login location changed", "SEC", "Immediate", "O", "X", "No", "C"),
    E("SEC-005", "Account locked after failed attempts", "SEC", "Immediate", "X", "O", "No", "C"),
    E("SEC-006", "Account unlocked", "SEC", "Immediate", "X", "O", "No", "A"),
    E("SEC-007", "Email address changed", "SEC", "Immediate", "X", "O", "No", "C"),
    E("SEC-008", "Phone number changed", "SEC", "Immediate", "O", "O", "No", "C"),
    E("SEC-009", "Security checkup reminder", "SEC", "30 days after last review", "X", "O", "Yes", "B"),
    E("SEC-010", "Data export ready", "SEC", "Immediate", "X", "O", "Yes", "A"),

    // ---- Account (ACCT) ----
    E("ACCT-001", "Profile update confirmation", "ACCT", "Immediate", "X", "O", "Yes", "A"),
    E("ACCT-002", "Profile photo updated", "ACCT", "Immediate", "O", "X", "Yes", "A"),
    E("ACCT-003", "Identity verification submitted", "ACCT", "Immediate", "O", "O", "No", "A"),
    E("ACCT-004", "Identity verification approved", "ACCT", "Immediate", "O", "O", "No", "A"),
    E("ACCT-005", "Identity verification rejected", "ACCT", "Immediate", "O", "O", "No", "C"),
    E("ACCT-006", "Account deletion requested", "ACCT", "Immediate", "X", "O", "No", "C"),
    E("ACCT-007", "Account deletion completed", "ACCT", "Immediate", "X", "O", "No", "A"),
    E("ACCT-008", "Notification preferences updated", "ACCT", "Immediate", "O", "X", "Yes", "A"),
    E("ACCT-009", "Saved search created", "ACCT", "Immediate", "O", "X", "Yes", "A"),
    E("ACCT-010", "Saved search digest", "ACCT", "Daily digest", "O", "O", "Yes", "D"),
    E("ACCT-011", "Profile completeness reminder", "ACCT", "7 days after sign-up", "O", "O", "Yes", "B"),

    // ---- Property (PROP) ----
    E("PROP-001", "New property matches saved search", "PROP", "Immediate", "O", "O", "Yes", "D"),
    E("PROP-002", "Price drop on saved property", "PROP", "Immediate", "O", "O", "Yes", "C"),
    E("PROP-003", "Saved property status changed", "PROP", "Immediate", "O", "X", "Yes", "A"),
    E("PROP-004", "New listing in followed area", "PROP", "Immediate", "O", "O", "Yes", "D"),
    E("PROP-005", "Saved property back on market", "PROP", "Immediate", "O", "O", "Yes", "D"),
    E("PROP-006", "Viewing scheduled confirmation", "PROP", "Immediate", "O", "O", "Yes", "A"),
    E("PROP-007", "Viewing reminder", "PROP", "24 hours before viewing", "O", "O", "Yes", "B"),
    E("PROP-008", "Viewing cancelled", "PROP", "Immediate", "O", "O", "Yes", "C"),
    E("PROP-009", "Property listing approved", "PROP", "Immediate", "O", "O", "No", "A"),
    E("PROP-010", "Property listing rejected", "PROP", "Immediate", "O", "O", "No", "C"),
    E("PROP-011", "Listing expiring soon", "PROP", "7 days before expiry", "O", "O", "Yes", "B"),
    E("PROP-012", "Listing expired", "PROP", "Immediate", "O", "O", "Yes", "C"),
    E("PROP-013", "Weekly new listings digest", "PROP", "Weekly", "O", "O", "Yes", "D"),

    // ---- Messaging (MSG) ----
    E("MSG-001", "New chat message received", "MSG", "Immediate", "O", "O", "Yes", "A"),
    E("MSG-002", "New inquiry received", "MSG", "Immediate", "O", "O", "Yes", "A"),
    E("MSG-003", "Unread message reminder", "MSG", "24 hours after message", "O", "O", "Yes", "B"),
    E("MSG-004", "Inquiry replied", "MSG", "Immediate", "O", "X", "Yes", "A"),
    E("MSG-005", "Agent assigned to inquiry", "MSG", "Immediate", "O", "O", "Yes", "A"),
    E("MSG-006", "Conversation archived", "MSG", "Immediate", "O", "X", "Yes", "A"),
    E("MSG-007", "Message flagged by moderation", "MSG", "Immediate", "O", "O", "No", "C"),
    E("MSG-008", "Auto-reply outside business hours", "MSG", "Immediate", "O", "X", "Yes", "A"),
    E("MSG-009", "Inquiry follow-up nudge", "MSG", "3 days after inquiry", "O", "O", "Yes", "B"),

    // ---- Leads (LEAD) ----
    E("LEAD-001", "New lead captured", "LEAD", "Immediate", "O", "O", "Yes", "A"),
    E("LEAD-002", "Lead assigned to you", "LEAD", "Immediate", "O", "O", "Yes", "A"),
    E("LEAD-003", "Lead status changed", "LEAD", "Immediate", "O", "X", "Yes", "A"),
    E("LEAD-004", "Lead inactive reminder", "LEAD", "7 days after last contact", "O", "O", "Yes", "B"),
    E("LEAD-005", "Lead converted", "LEAD", "Immediate", "O", "O", "Yes", "A"),
    E("LEAD-006", "Hot lead alert", "LEAD", "Immediate", "O", "O", "Yes", "C"),
    E("LEAD-007", "Lead added to group", "LEAD", "Immediate", "O", "X", "Yes", "A"),
    E("LEAD-008", "Weekly lead summary", "LEAD", "Weekly", "X", "O", "Yes", "D"),
    E("LEAD-009", "Lead re-engagement", "LEAD", "30 days after last contact", "O", "O", "Yes", "D"),

    // ---- Payment (PAY) — monetization, required ----
    E("PAY-001", "Payment successful", "PAY", "Immediate", "O", "O", "No", "A"),
    E("PAY-002", "Payment failed", "PAY", "Immediate", "X", "O", "No", "C"),
    E("PAY-003", "Invoice issued", "PAY", "Immediate", "X", "O", "No", "A"),
    E("PAY-004", "Receipt available", "PAY", "Immediate", "X", "O", "No", "A"),
    E("PAY-005", "Refund processed", "PAY", "Immediate", "X", "O", "No", "A"),
    E("PAY-006", "Card expiring soon", "PAY", "7 days before expiry", "X", "O", "No", "B"),
    E("PAY-007", "Payment method updated", "PAY", "Immediate", "X", "O", "No", "A"),
    E("PAY-008", "Upcoming charge reminder", "PAY", "3 days before charge", "O", "O", "No", "B"),
    E("PAY-009", "Chargeback notice", "PAY", "Immediate", "X", "O", "No", "C"),
    E("PAY-010", "Ad spend balance low", "PAY", "Immediate", "O", "O", "No", "C"),
    E("PAY-011", "Ad campaign payment confirmed", "PAY", "Immediate", "O", "O", "No", "A"),

    // ---- Subscription (SUB) — monetization, required ----
    E("SUB-001", "Subscription activated", "SUB", "Immediate", "O", "O", "No", "A"),
    E("SUB-002", "Subscription renewed", "SUB", "Immediate", "X", "O", "No", "A"),
    E("SUB-003", "Subscription cancelled", "SUB", "Immediate", "X", "O", "No", "C"),
    E("SUB-004", "Subscription expiring soon", "SUB", "30 days before expiry", "X", "O", "No", "B"),
    E("SUB-005", "Subscription expired", "SUB", "Immediate", "O", "O", "No", "C"),
    E("SUB-006", "Plan upgraded", "SUB", "Immediate", "O", "O", "No", "A"),
    E("SUB-007", "Plan downgraded", "SUB", "Immediate", "X", "O", "No", "A"),
    E("SUB-008", "Trial ending reminder", "SUB", "3 days before trial end", "O", "O", "No", "B"),
    E("SUB-009", "Trial ended", "SUB", "Immediate", "O", "O", "No", "C"),

    // ---- Reports (REP) ----
    E("REP-001", "New report submitted against you", "REP", "Immediate", "O", "O", "No", "C"),
    E("REP-002", "Report under review", "REP", "Immediate", "O", "O", "No", "A"),
    E("REP-003", "Report resolved — no action", "REP", "Immediate", "O", "O", "No", "A"),
    E("REP-004", "Report upheld — warning issued", "REP", "Immediate", "O", "O", "No", "C"),
    E("REP-005", "Report dismissed", "REP", "Immediate", "O", "X", "No", "A"),
    E("REP-006", "Monthly moderation summary", "REP", "Monthly", "X", "O", "Yes", "D"),

    // ---- Violation (VIO) ----
    E("VIO-001", "Policy violation warning", "VIO", "Immediate", "O", "O", "No", "C"),
    E("VIO-002", "Content removed for violation", "VIO", "Immediate", "O", "O", "No", "C"),
    E("VIO-003", "Temporary suspension applied", "VIO", "Immediate", "O", "O", "No", "C"),
    E("VIO-004", "Suspension lifted", "VIO", "Immediate", "O", "O", "No", "A"),
    E("VIO-005", "Permanent ban notice", "VIO", "Immediate", "X", "O", "No", "C"),
    E("VIO-006", "Appeal received confirmation", "VIO", "Immediate", "O", "O", "No", "A"),

    // ---- Engagement (ENG) ----
    E("ENG-001", "Inactive user re-engagement", "ENG", "30 days after last visit", "O", "O", "Yes", "D"),
    E("ENG-002", "Monthly market newsletter", "ENG", "Monthly", "X", "O", "Yes", "D"),
    E("ENG-003", "Feature announcement", "ENG", "On feature release", "O", "O", "Yes", "D"),
    E("ENG-004", "Survey invitation", "ENG", "Immediate", "O", "O", "Yes", "D"),
    E("ENG-005", "Milestone celebration", "ENG", "Immediate", "O", "X", "Yes", "D"),
    E("ENG-006", "Referral invitation", "ENG", "Immediate", "O", "O", "Yes", "D"),
    E("ENG-007", "Saved property recommendation", "ENG", "Weekly", "O", "O", "Yes", "D"),
    E("ENG-008", "Win-back offer", "ENG", "60 days after churn", "X", "O", "Yes", "D"),

    // ---- Admin (ADM) ----
    E("ADM-001", "Admin broadcast announcement", "ADM", "Immediate", "O", "O", "Yes", "D"),
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
