/* ============================================================================
   YUUSHI shared Property Card renderer
   ----------------------------------------------------------------------------
   Drop-in card for any property grid. Include once per page:
     <script src="property-card.js"></script>          (root-level files)
     <script src="../property-card.js"></script>       (files in a subfolder)
   Then render:
     container.innerHTML = list.map(p => renderPropertyCard(p)).join('');

   p = {
     id, title, price, priceUnit, location, grossReturn, agent,
     type,                         // "Residential" | "Commercial" | "Land" | "Apartment" | "House" | "New Dev …"
     beds, baths, parking, area, units,   // any subset; only the provided ones show
     badge,                        // optional top-left ribbon (e.g. status / "New Dev")
     desc,
     onClick                       // optional JS expression string for the card click
   }
   - The hero illustration is chosen deterministically from the 3 built-ins by a
     hash of `id` (stable "random" per property).
   - The type chip icon is chosen from {Residential, Commercial, Land} by `type`.
   ========================================================================== */
(function () {
  if (window.renderPropertyCard) return; // include-once guard

  /* ---- 3 built-in hero illustrations (no external images) ---- */
  var SVGS = [
    // 1 — Glass / condominium tower
    '<svg class="ypc-photo-svg" viewBox="0 0 430 348" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="ypcSky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2e6e9e"/><stop offset="45%" stop-color="#4f90bc"/><stop offset="100%" stop-color="#7ab8d8"/></linearGradient></defs><rect width="430" height="348" fill="#141c24"/><rect x="0" y="78" width="295" height="218" fill="url(#ypcSky1)"/><ellipse cx="160" cy="104" rx="68" ry="23" fill="rgba(255,255,255,.42)"/><ellipse cx="210" cy="95" rx="46" ry="17" fill="rgba(255,255,255,.35)"/><ellipse cx="60" cy="112" rx="40" ry="15" fill="rgba(255,255,255,.28)"/><ellipse cx="265" cy="98" rx="34" ry="13" fill="rgba(255,255,255,.30)"/><polygon points="0,0 430,0 430,52 310,80 0,84" fill="#10161d"/><polygon points="0,80 310,76 430,50 430,60 310,88 0,92" fill="#0a1018"/><rect x="0" y="80" width="296" height="3" fill="#0e141c"/><rect x="0" y="118" width="296" height="2" fill="#0e141c"/><rect x="0" y="155" width="296" height="2" fill="#0e141c"/><rect x="0" y="192" width="296" height="2" fill="#0e141c"/><rect x="0" y="229" width="296" height="2" fill="#0e141c"/><rect x="0" y="266" width="296" height="2" fill="#0e141c"/><rect x="0" y="294" width="296" height="3" fill="#0e141c"/><line x1="0" y1="80" x2="0" y2="295" stroke="#0e141c" stroke-width="3"/><line x1="56" y1="80" x2="54" y2="295" stroke="#0e141c" stroke-width="2"/><line x1="112" y1="80" x2="109" y2="295" stroke="#0e141c" stroke-width="2"/><line x1="168" y1="80" x2="165" y2="295" stroke="#0e141c" stroke-width="2"/><line x1="224" y1="80" x2="221" y2="295" stroke="#0e141c" stroke-width="2"/><line x1="296" y1="80" x2="294" y2="295" stroke="#0e141c" stroke-width="2.5"/><rect x="290" y="48" width="140" height="300" fill="#bea878"/><rect x="304" y="58" width="38" height="52" fill="#78aec8" rx="1"/><rect x="304" y="120" width="38" height="52" fill="#78aec8" rx="1"/><rect x="304" y="182" width="38" height="52" fill="#78aec8" rx="1"/><rect x="304" y="244" width="38" height="52" fill="#78aec8" rx="1"/><rect x="358" y="58" width="38" height="52" fill="#78aec8" rx="1"/><rect x="358" y="120" width="38" height="52" fill="#78aec8" rx="1"/><rect x="358" y="182" width="38" height="52" fill="#78aec8" rx="1"/><rect x="358" y="244" width="38" height="52" fill="#78aec8" rx="1"/><rect x="322" y="58" width="3" height="52" fill="#9c7038"/><rect x="376" y="58" width="3" height="52" fill="#9c7038"/><rect x="286" y="44" width="8" height="306" fill="#0a1018"/><rect x="0" y="78" width="4" height="272" fill="#0a1018"/></svg>',
    // 2 — Classical / stone facade
    '<svg class="ypc-photo-svg" viewBox="0 0 430 348" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><rect width="430" height="348" fill="#b09060"/><polygon points="240,0 430,0 430,200 240,140" fill="#7ab0cc"/><ellipse cx="340" cy="55" rx="68" ry="24" fill="rgba(255,255,255,.55)"/><ellipse cx="396" cy="38" rx="46" ry="17" fill="rgba(255,255,255,.44)"/><rect x="0" y="0" width="175" height="348" fill="#3c2c18"/><rect x="12" y="32" width="44" height="62" fill="#2a1c0a" rx="1"/><rect x="66" y="32" width="44" height="62" fill="#2a1c0a" rx="1"/><rect x="120" y="32" width="44" height="62" fill="#2a1c0a" rx="1"/><rect x="12" y="118" width="44" height="62" fill="#2a1c0a" rx="1"/><rect x="66" y="118" width="44" height="62" fill="#2a1c0a" rx="1"/><rect x="120" y="118" width="44" height="62" fill="#2a1c0a" rx="1"/><rect x="12" y="204" width="44" height="62" fill="#2a1c0a" rx="1"/><rect x="66" y="204" width="44" height="62" fill="#2a1c0a" rx="1"/><rect x="120" y="204" width="44" height="62" fill="#2a1c0a" rx="1"/><rect x="155" y="0" width="24" height="348" fill="rgba(0,0,0,.28)"/><rect x="175" y="0" width="255" height="348" fill="#c8ae72"/><rect x="215" y="0" width="90" height="348" fill="rgba(255,255,255,.08)"/><rect x="175" y="0" width="255" height="54" fill="#d8bc7a"/><rect x="175" y="50" width="255" height="6" fill="#a88840"/><rect x="186" y="66" width="52" height="78" fill="#5a7890" rx="1"/><rect x="260" y="66" width="52" height="78" fill="#5a7890" rx="1"/><rect x="334" y="66" width="52" height="78" fill="#5a7890" rx="1"/><rect x="240" y="60" width="16" height="88" fill="#c4a868"/><rect x="314" y="60" width="16" height="88" fill="#c4a868"/><rect x="175" y="150" width="255" height="18" fill="#b89858"/><rect x="186" y="176" width="52" height="78" fill="#5a7890" rx="1"/><rect x="260" y="176" width="52" height="78" fill="#5a7890" rx="1"/><rect x="334" y="176" width="52" height="78" fill="#5a7890" rx="1"/><rect x="240" y="170" width="16" height="88" fill="#c4a868"/><rect x="314" y="170" width="16" height="88" fill="#c4a868"/><rect x="186" y="268" width="52" height="80" fill="#5a7890" rx="1"/><rect x="260" y="268" width="52" height="80" fill="#5a7890" rx="1"/><rect x="334" y="268" width="52" height="80" fill="#5a7890" rx="1"/><rect x="174" y="0" width="4" height="348" fill="rgba(0,0,0,.3)"/></svg>',
    // 3 — Blue geometric / seaside
    '<svg class="ypc-photo-svg" viewBox="0 0 430 348" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="ypcPsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7060a8"/><stop offset="60%" stop-color="#a888c8"/><stop offset="100%" stop-color="#c8a8d8"/></linearGradient><linearGradient id="ypcBlueL" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3a5a90"/><stop offset="100%" stop-color="#1e3a68"/></linearGradient><linearGradient id="ypcBlueR" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a3060"/><stop offset="100%" stop-color="#0e2048"/></linearGradient></defs><rect width="430" height="348" fill="url(#ypcPsky)"/><polygon points="0,348 0,130 215,38 430,130 430,348" fill="url(#ypcBlueL)"/><polygon points="215,38 430,130 430,348 215,240" fill="url(#ypcBlueR)"/><line x1="0" y1="175" x2="215" y2="107" stroke="#4a6aa0" stroke-width="1.5"/><line x1="0" y1="222" x2="215" y2="154" stroke="#4a6aa0" stroke-width="1.5"/><line x1="0" y1="270" x2="215" y2="201" stroke="#4a6aa0" stroke-width="1.5"/><line x1="43" y1="348" x2="43" y2="119" stroke="#4a6aa0" stroke-width="1.2"/><line x1="86" y1="348" x2="86" y2="104" stroke="#4a6aa0" stroke-width="1.2"/><line x1="129" y1="348" x2="129" y2="88" stroke="#4a6aa0" stroke-width="1.2"/><line x1="172" y1="348" x2="172" y2="68" stroke="#4a6aa0" stroke-width="1.2"/><line x1="215" y1="107" x2="430" y2="175" stroke="#2a4070" stroke-width="1.5"/><line x1="215" y1="154" x2="430" y2="222" stroke="#2a4070" stroke-width="1.5"/><line x1="215" y1="201" x2="430" y2="270" stroke="#2a4070" stroke-width="1.5"/><line x1="280" y1="348" x2="280" y2="103" stroke="#2a4070" stroke-width="1.2"/><line x1="344" y1="348" x2="344" y2="120" stroke="#2a4070" stroke-width="1.2"/><line x1="408" y1="348" x2="408" y2="136" stroke="#2a4070" stroke-width="1.2"/><line x1="215" y1="38" x2="215" y2="348" stroke="rgba(255,255,255,.18)" stroke-width="3"/><line x1="-5" y1="210" x2="310" y2="68" stroke="rgba(255,255,255,.22)" stroke-width="14" stroke-linecap="round"/><line x1="-5" y1="210" x2="310" y2="68" stroke="#fff" stroke-width="7" stroke-linecap="round"/><line x1="155" y1="130" x2="270" y2="210" stroke="#fff" stroke-width="6" stroke-linecap="round"/><line x1="200" y1="50" x2="435" y2="148" stroke="#fff" stroke-width="6" stroke-linecap="round"/><line x1="310" y1="68" x2="435" y2="260" stroke="#fff" stroke-width="5" stroke-linecap="round"/><line x1="0" y1="260" x2="160" y2="310" stroke="rgba(255,255,255,.75)" stroke-width="4" stroke-linecap="round"/><circle cx="310" cy="68" r="8" fill="white"/><circle cx="155" cy="130" r="7" fill="white"/><circle cx="200" cy="50" r="6" fill="white"/><circle cx="270" cy="210" r="6" fill="white"/></svg>'
  ];

  /* ---- agent avatar (generic) ---- */
  var AVATAR =
    '<svg width="46" height="46" viewBox="0 0 46 46"><circle cx="23" cy="23" r="23" fill="#c8824a"/><ellipse cx="23" cy="40" rx="14" ry="10" fill="#d4883c"/><ellipse cx="23" cy="13" rx="14" ry="4.5" fill="#7a4820"/><ellipse cx="23" cy="9" rx="10" ry="6" fill="#9a5828"/><circle cx="23" cy="21" r="8.5" fill="#d4904e"/><ellipse cx="23" cy="14" rx="8" ry="5" fill="#7a4820"/><circle cx="20" cy="20" r="1.2" fill="#5a2e10"/><circle cx="26" cy="20" r="1.2" fill="#5a2e10"/><path d="M19.5 23.5 Q23 26.5 26.5 23.5" fill="none" stroke="#b06030" stroke-width="1.4" stroke-linecap="round"/></svg>';

  /* ---- icon set ---- */
  function ico(p) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
      p +
      "</svg>"
    );
  }
  var ICONS = {
    Residential: ico(
      '<rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 21V11a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v10"/><path d="M2 11l10-7 10 7"/>'
    ),
    Commercial: ico(
      '<rect x="4" y="2" width="16" height="20" rx="1"/><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="14" x2="20" y2="14"/><rect x="7" y="4" width="3" height="3"/><rect x="14" y="4" width="3" height="3"/><rect x="7" y="10" width="3" height="3"/><rect x="14" y="10" width="3" height="3"/><rect x="10" y="18" width="4" height="4"/>'
    ),
    Land: ico('<path d="M2 20h20"/><path d="M2 20L7 12l4 4 4-6 4 3 3-2"/><circle cx="19" cy="6" r="2"/>'),
    beds: ico(
      '<path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7"/><path d="M2 13h20"/><rect x="5" y="9" width="5" height="4" rx="0.5"/><rect x="14" y="9" width="5" height="4" rx="0.5"/>'
    ),
    baths: ico('<path d="M8 6a2 2 0 0 1 4 0v5H5V9a3 3 0 0 1 3-3z"/><path d="M5 11h14v3a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-3z"/>'),
    parking: ico(
      '<path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><path d="M2 11a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5H2v-5z"/><line x1="6" y1="16" x2="6" y2="18"/><line x1="18" y1="16" x2="18" y2="18"/>'
    ),
    area: ico('<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h4M3 15h4"/><path d="M9 3v4M15 3v4"/><path d="M17 21v-4M21 17h-4"/>'),
    units: ico(
      '<rect x="2" y="2" width="5" height="5" rx="0.5"/><rect x="9" y="2" width="5" height="5" rx="0.5"/><rect x="16" y="2" width="5" height="5" rx="0.5"/><rect x="2" y="9" width="5" height="5" rx="0.5"/><rect x="9" y="9" width="5" height="5" rx="0.5"/><rect x="16" y="9" width="5" height="5" rx="0.5"/><rect x="2" y="16" width="5" height="5" rx="0.5"/><rect x="9" y="16" width="5" height="5" rx="0.5"/><rect x="16" y="16" width="5" height="5" rx="0.5"/>'
    )
  };

  var HEART =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  var ARROW_L =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
  var ARROW_R =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
  var PIN =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function hash(s) {
    s = String(s == null ? "" : s);
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }
  function typeKey(t) {
    t = String(t || "").toLowerCase();
    if (/land/.test(t)) return "Land";
    if (/commercial|office|tower|whole building|shop|retail|store/.test(t)) return "Commercial";
    return "Residential"; // apartment / house / condo / new dev / default
  }

  function injectCss() {
    if (document.getElementById("ypc-style")) return;
    var css =
      ".ypc-card{width:100%;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 8px 28px rgba(0,0,0,.14);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;cursor:pointer;transition:transform .12s,box-shadow .15s}" +
      ".ypc-card:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(0,0,0,.2)}" +
      ".ypc-photo{position:relative;aspect-ratio:430/300;overflow:hidden;background:#141c24}" +
      ".ypc-photo-svg{position:absolute;inset:0;width:100%;height:100%}" +
      ".ypc-ov{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.86) 0%,rgba(0,0,0,.42) 36%,rgba(0,0,0,.08) 60%,transparent 78%)}" +
      ".ypc-pt{position:absolute;top:12px;left:12px;right:12px;display:flex;align-items:center;justify-content:space-between;z-index:4}" +
      ".ypc-agent{display:flex;align-items:center;gap:8px;min-width:0}" +
      ".ypc-av{width:40px;height:40px;border-radius:50%;border:2px solid rgba(255,255,255,.72);overflow:hidden;flex-shrink:0}" +
      ".ypc-av svg{width:100%;height:100%;display:block}" +
      ".ypc-an{color:#fff;font-size:13.5px;font-weight:500;text-shadow:0 1px 4px rgba(0,0,0,.45);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
      ".ypc-heart{width:40px;height:40px;background:rgba(255,255,255,.95);border:none;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.18)}" +
      ".ypc-badge{position:absolute;top:60px;left:14px;z-index:4;background:rgba(43,33,24,.82);color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px}" +
      ".ypc-badge.nd{background:#8B7340}" +
      ".ypc-nav{position:absolute;top:46%;transform:translateY(-50%);width:38px;height:50px;background:rgba(255,255,255,.92);border:none;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.16);z-index:4}" +
      ".ypc-nav.prev{left:12px}.ypc-nav.next{right:12px}" +
      ".ypc-pb{position:absolute;bottom:28px;left:14px;right:14px;z-index:4}" +
      ".ypc-r1{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px}" +
      ".ypc-title{font-size:18px;font-weight:700;color:#fff;line-height:1.2;text-shadow:0 1px 5px rgba(0,0,0,.4);flex:1}" +
      ".ypc-prc{flex-shrink:0;text-align:right}" +
      ".ypc-pa{font-size:18px;font-weight:700;color:#fff;text-shadow:0 1px 5px rgba(0,0,0,.4);white-space:nowrap}" +
      ".ypc-pm{font-size:11.5px;color:rgba(255,255,255,.82);text-align:right;margin-top:1px}" +
      ".ypc-r2{display:flex;align-items:center;justify-content:space-between;gap:8px}" +
      ".ypc-loc{display:flex;align-items:center;gap:5px;color:rgba(255,255,255,.9);font-size:12.5px}" +
      ".ypc-gr{color:rgba(255,255,255,.9);font-size:12.5px}.ypc-gr b{font-weight:700}" +
      ".ypc-dots{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:4}" +
      ".ypc-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.3);border:1.2px solid rgba(255,255,255,.44)}.ypc-dot.on{background:#fff;border-color:#fff}" +
      ".ypc-cb{padding:12px 14px 14px}" +
      ".ypc-amen{display:flex;align-items:center;gap:14px;margin-bottom:9px;overflow-x:auto;scrollbar-width:none}" +
      ".ypc-amen::-webkit-scrollbar{display:none}" +
      ".ypc-am{display:flex;align-items:center;gap:5px;color:#8B7340;font-size:13px;font-weight:500;white-space:nowrap;flex-shrink:0}" +
      ".ypc-am svg{width:19px;height:19px;flex-shrink:0}" +
      ".ypc-desc{font-size:12.5px;color:#666;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}";
    var st = document.createElement("style");
    st.id = "ypc-style";
    st.textContent = css;
    document.head.appendChild(st);
  }

  function renderPropertyCard(p) {
    injectCss();
    p = p || {};
    var svg = SVGS[hash(p.id || p.title) % SVGS.length];
    var tk = typeKey(p.type);
    var typeLabel = p.type || tk;

    // amenities row: type chip first, then any provided specs
    var amen = '<div class="ypc-am">' + ICONS[tk] + "<span>" + esc(typeLabel) + "</span></div>";
    if (p.beds != null && p.beds !== "") amen += '<div class="ypc-am">' + ICONS.beds + "<span>" + esc(p.beds) + "</span></div>";
    if (p.baths != null && p.baths !== "") amen += '<div class="ypc-am">' + ICONS.baths + "<span>" + esc(p.baths) + "</span></div>";
    if (p.parking != null && p.parking !== "") amen += '<div class="ypc-am">' + ICONS.parking + "<span>" + esc(p.parking) + "</span></div>";
    if (p.units != null && p.units !== "") amen += '<div class="ypc-am">' + ICONS.units + "<span>" + esc(p.units) + " units</span></div>";
    if (p.area != null && p.area !== "") amen += '<div class="ypc-am">' + ICONS.area + "<span>" + esc(p.area) + " m²</span></div>";

    var badge = p.badge
      ? '<div class="ypc-badge ' + (/new\s*dev/i.test(p.badge) ? "nd" : "") + '">' + esc(p.badge) + "</div>"
      : "";
    var gr = p.grossReturn ? '<div class="ypc-gr">Gross Return:&nbsp;<b>' + esc(p.grossReturn) + "</b></div>" : "";
    var pm = p.priceUnit ? '<div class="ypc-pm">' + esc(p.priceUnit) + "</div>" : "";
    var onclick = p.onClick ? ' onclick="' + p.onClick + '"' : "";

    return (
      '<div class="ypc-card"' + onclick + ">" +
        '<div class="ypc-photo">' +
          svg +
          '<div class="ypc-ov"></div>' +
          '<div class="ypc-pt"><div class="ypc-agent"><div class="ypc-av">' + AVATAR + "</div>" +
            (p.agent ? '<span class="ypc-an">' + esc(p.agent) + "</span>" : "") +
          '</div><button type="button" class="ypc-heart" onclick="event.stopPropagation()">' + HEART + "</button></div>" +
          badge +
          '<button type="button" class="ypc-nav prev" onclick="event.stopPropagation()">' + ARROW_L + "</button>" +
          '<button type="button" class="ypc-nav next" onclick="event.stopPropagation()">' + ARROW_R + "</button>" +
          '<div class="ypc-pb"><div class="ypc-r1"><h2 class="ypc-title">' + esc(p.title || "Untitled") + "</h2>" +
            '<div class="ypc-prc"><div class="ypc-pa">' + esc(p.price || "") + "</div>" + pm + "</div></div>" +
            '<div class="ypc-r2"><div class="ypc-loc">' + PIN + esc(p.location || "") + "</div>" + gr + "</div></div>" +
          '<div class="ypc-dots"><span class="ypc-dot"></span><span class="ypc-dot on"></span><span class="ypc-dot"></span><span class="ypc-dot"></span></div>' +
        "</div>" +
        '<div class="ypc-cb"><div class="ypc-amen">' + amen + "</div>" +
          '<p class="ypc-desc">' + esc(p.desc || "Discover a selection of remarkable real estate projects that redefine luxury living and modern convenience.") + "</p>" +
        "</div>" +
      "</div>"
    );
  }

  window.renderPropertyCard = renderPropertyCard;
})();
