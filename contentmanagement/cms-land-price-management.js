// Popular Neighbourhoods and Land Prices — fixed MLIT Area Guide configuration.
(() => {
  const root = document.getElementById("cms-land-data");
  if (!root) return;
  const $ = (id) => root.querySelector("#" + id);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fmt = (v) => Math.round(Number(v) || 0).toLocaleString("en-US");
  const TSUBO = 3.305785;
  const PERIOD = "2026 Q2";
  const RETRIEVED = "2026-09-15";
  const MARKET_TREND_DATASETS_KEY = "yuushi.cms.marketTrend.datasets";
  const MARKET_TREND_VISIBLE_KEY = "yuushi.cms.marketTrend.visible";
  const LEGACY_TOGGLES_KEY = "yuushi.cmsHome.toggles";
  const memory = {};
  const get = (k, d) => Object.prototype.hasOwnProperty.call(memory, k) ? memory[k] : d;
  const set = (k, v) => { memory[k] = v; };

  function toast(message, kind = "ok") {
    const el = document.createElement("div");
    el.className = "toast " + kind;
    el.innerHTML = `<i class="fas fa-${kind === "err" ? "circle-exclamation" : "circle-check"}"></i> ${esc(message)}`;
    $("landDataToastWrap").appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
  function closeModal(id) { $(id)?.classList.remove("open"); }
  function openModal(id) { $(id)?.classList.add("open"); }

  const seed = {
    Tokyo: {
      areas: ["Shibuya","Shinjuku","Minato","Chiyoda","Setagaya","Meguro","Kita","Chuo","Taito","Bunkyo"],
      stations: ["Tokyo Station","Shinjuku Station","Shibuya Station","Ikebukuro Station","Ueno Station","Shinagawa Station","Akihabara Station","Ginza Station","Roppongi Station","Nakano Station"]
    },
    Osaka: {
      areas: ["Namba","Umeda","Tennoji","Kita","Chuo","Nishi","Naniwa","Fukushima","Yodogawa","Higashinari"],
      stations: ["Osaka Station","Namba Station","Shin-Osaka Station","Tennoji Station","Umeda Station","Kyobashi Station","Tsuruhashi Station","Nakatsu Station","Fukushima Station","Nipponbashi Station"]
    },
    Yokohama: {
      areas: ["Minato Mirai","Naka","Nishi","Kohoku","Tsurumi","Isogo","Kanazawa","Totsuka","Aoba","Kanagawa"],
      stations: ["Yokohama Station","Sakuragicho Station","Kannai Station","Shin-Yokohama Station","Tsurumi Station","Totsuka Station","Kamiooka Station","Hiyoshi Station","Kikuna Station","Higashi-Kanagawa Station"]
    },
    Nagoya: {
      areas: ["Naka","Nakamura","Higashi","Chikusa","Showa","Mizuho","Atsuta","Minato","Moriyama","Meito"],
      stations: ["Nagoya Station","Sakae Station","Kanayama Station","Fushimi Station","Motoyama Station","Ozone Station","Chikusa Station","Imaike Station","Atsuta-Jingumae Station","Kachigawa Station"]
    },
    Sapporo: {
      areas: ["Chuo","Kita","Higashi","Shiroishi","Toyohira","Nishi","Atsubetsu","Minami","Teine","Kiyota"],
      stations: ["Sapporo Station","Odori Station","Susukino Station","Shin-Sapporo Station","Kikusui Station","Maruyama-koen Station","Kotoni Station","Shiroishi Station","Nakanoshima Station","Fukuzumi Station"]
    },
    Fukuoka: {
      areas: ["Tenjin","Hakata","Chuo","Sawara","Minami","Higashi","Nishi","Jonan","Hakozaki","Momochi"],
      stations: ["Hakata Station","Tenjin Station","Tenjin-Minami Station","Gion Station","Nishitetsu Fukuoka Station","Yakuin Station","Fukuoka Airport Station","Nanakuma Station","Hashimoto Station","Meinohama Station"]
    }
  };
  ["Kawasaki","Kobe","Kyoto","Saitama","Hiroshima","Sendai","Chiba","Kitakyushu","Niigata","Hamamatsu","Kumamoto","Sagamihara","Shizuoka","Okayama"].forEach(name => {
    seed[name] = {
      areas: Array.from({length:10}, (_, i) => `${name} Area ${i + 1}`),
      stations: Array.from({length:10}, (_, i) => `${name} Station ${i + 1}`)
    };
  });
  const cities = [], areas = [], stations = [], defaultPn = [], defaultLp = [];
  Object.entries(seed).forEach(([name, values], ci) => {
    const cityId = `city-${ci + 1}`;
    cities.push({id: cityId, name});
    values.areas.forEach((item, i) => areas.push({id:`area-${cityId}-${i + 1}`, cityId, name:item}));
    values.stations.forEach((item, i) => stations.push({id:`st-${cityId}-${i + 1}`, cityId, name:item, mlitStationId:`MLIT-ST-${ci + 1}-${i + 1}`}));
    if (ci < 6) {
      values.areas.slice(0, 3).forEach((_, i) => defaultPn.push({id:`pna-${cityId}-${i + 1}`, cityId, areaId:`area-${cityId}-${i + 1}`}));
      values.stations.slice(0, 5).forEach((_, i) => defaultLp.push({id:`lpa-${cityId}-${i + 1}`, cityId, stationId:`st-${cityId}-${i + 1}`}));
    }
  });
  let pnAssign = get("landata.pn.assign", defaultPn);
  let lpAssign = get("landata.lp.assign", defaultLp);
  let lpActiveCity = null;
  let assignSection = null;
  const cityById = id => cities.find(x => x.id === id);
  const areaById = id => areas.find(x => x.id === id);
  const stationById = id => stations.find(x => x.id === id);

  function seededNumber(key, min, max) {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return min + (h % (max - min + 1));
  }
  function mlitBenchmark(key) {
    const n = seededNumber(key + "-n", 14, 78);
    const previousYearN = seededNumber(key + "-previous-n", 24, 72);
    const median = seededNumber(key + "-median", 420000, 1300000);
    const spread = seededNumber(key + "-spread", 55000, 170000);
    const yoy = seededNumber(key + "-yoy", -850, 950) / 100;
    return {n, previousYearN, median, q1:median - spread, q3:median + spread, yoy};
  }
  const scope = `<div class="fixed-scope"><strong>Fixed Area Guide scope</strong><span>MLIT Type: 中古マンション等</span><span>Exclusive Floor Area: 30–80 m²</span><span>Building Age: within 40 years at the transaction period</span><span>Metric: Median Price per m²</span></div>`;
  const metadata = `<div class="benchmark-meta"><span><strong>Source:</strong> MLIT Real Estate Information Library (Real Estate Transaction Price Information)</span><span><strong>Target Period:</strong> ${PERIOD}</span><span><strong>Retrieval Date:</strong> ${RETRIEVED}</span></div><div class="benchmark-disclaimer">This information is a reference figure only and does not indicate the appropriate price of any individual property.</div>`;
  const band = row => `¥${fmt(row.q1)}–¥${fmt(row.q3)}`;
  function yoy(row) {
    if (row.n < 30 || row.previousYearN < 30) return '<span class="muted-value">—</span>';
    const up = row.yoy >= 0;
    return `<span class="${up ? "change-up" : "change-down"}">${up ? "↑ +" : "↓ -"}${Math.abs(row.yoy).toFixed(2)}%</span>`;
  }
  function persist() { set("landata.pn.assign", pnAssign); set("landata.lp.assign", lpAssign); }
  function removePnAssignment(id) { pnAssign = pnAssign.filter(x => x.id !== id); persist(); renderAll(); toast("Area removed from city."); }
  function removeLpAssignment(id) { lpAssign = lpAssign.filter(x => x.id !== id); persist(); renderAll(); toast("Station removed from city."); }
  function clearCityAssignments(section, cityId) {
    const label = section === "pn" ? "areas" : "stations";
    if (!confirm(`Remove all ${label} assigned to ${cityById(cityId)?.name || "this city"}?`)) return;
    if (section === "pn") pnAssign = pnAssign.filter(x => x.cityId !== cityId);
    else { lpAssign = lpAssign.filter(x => x.cityId !== cityId); if (lpActiveCity === cityId) lpActiveCity = null; }
    persist(); renderAll(); toast("City display configuration updated.");
  }

  function fillCity(locked) {
    $("assign-city-select").value = locked || "";
    $("assign-city-search").value = locked ? cityById(locked)?.name || "" : "";
    $("assign-city-dropdown").style.display = "none";
  }
  function positionDropdown() {
    const rect = $("assign-city-search").getBoundingClientRect();
    Object.assign($("assign-city-dropdown").style, {left:rect.left+"px", top:rect.bottom+4+"px", width:rect.width+"px"});
  }
  function onCitySearchInput() {
    const q = $("assign-city-search").value.trim().toLowerCase();
    const matches = (q ? cities.filter(c => c.name.toLowerCase().includes(q)) : cities).slice(0, 80);
    $("assign-city-dropdown").innerHTML = matches.map(c => `<div class="city-search-option" onmousedown="event.preventDefault();cmsLandData.selectAssignCity('${c.id}','${esc(c.name)}')">${esc(c.name)}</div>`).join("") || '<div class="city-search-empty">No matching city.</div>';
    positionDropdown(); $("assign-city-dropdown").style.display = "";
  }
  function selectAssignCity(id, name) {
    $("assign-city-select").value = id; $("assign-city-search").value = name;
    $("assign-city-dropdown").style.display = "none"; onAssignCityChange();
  }
  function openAssignModal(section) {
    assignSection = section;
    $("assign-modal-title").textContent = section === "pn" ? "Assign Areas to a City" : "Assign Stations to a City";
    $("assign-modal-subtitle").textContent = section === "pn" ? "Pick a city, then check the areas to add." : "Pick a city, then check the stations to add.";
    $("assign-items-label").textContent = section === "pn" ? "Areas" : "Stations";
    fillCity(); $("assign-items-block").style.display = "none"; $("assign-empty-hint").style.display = "none"; openModal("modal-assign");
  }
  function openAssignModalForCity(section, cityId) { openAssignModal(section); fillCity(cityId); onAssignCityChange(); }
  function onAssignCityChange() {
    const cityId = $("assign-city-select").value;
    if (!cityId) return;
    const pool = (assignSection === "pn" ? areas : stations).filter(x => x.cityId === cityId);
    const assigned = new Set(assignSection === "pn" ? pnAssign.filter(x => x.cityId === cityId).map(x => x.areaId) : lpAssign.filter(x => x.cityId === cityId).map(x => x.stationId));
    const available = pool.filter(x => !assigned.has(x.id));
    $("assign-items-body").innerHTML = available.map(item => `<label class="item-list-row"><input type="checkbox" value="${item.id}"><span>${esc(item.name)}</span>${assignSection === "lp" ? `<small>MLIT station ID: ${esc(item.mlitStationId)}</small>` : ""}</label>`).join("") || '<div class="item-list-empty">Everything is already assigned to this city.</div>';
    $("assign-items-block").style.display = available.length ? "" : "none";
    $("assign-empty-hint").style.display = available.length ? "none" : "";
  }
  function confirmAssign() {
    const cityId = $("assign-city-select").value;
    const chosen = [...$("assign-items-body").querySelectorAll('input[type="checkbox"]:checked')].map(x => x.value);
    if (!cityId) return toast("Select a city.", "err");
    if (!chosen.length) return toast("Select at least one item.", "err");
    chosen.forEach((id, i) => {
      if (assignSection === "pn") pnAssign.push({id:`pna-${Date.now()}-${i}`, cityId, areaId:id});
      else lpAssign.push({id:`lpa-${Date.now()}-${i}`, cityId, stationId:id});
    });
    persist(); closeModal("modal-assign"); renderAll(); toast("Display configuration updated.");
  }

  function pnRows(cityId) {
    return pnAssign.filter(x => x.cityId === cityId).map(x => {
      const area = areaById(x.areaId);
      return area ? {area:area.name, assignId:x.id, ...mlitBenchmark(`area-${x.areaId}-${PERIOD}`)} : null;
    }).filter(Boolean);
  }
  function renderPn() {
    const visible = cities.filter(c => pnAssign.some(x => x.cityId === c.id));
    $("pn-preview").innerHTML = visible.map(city => `<div class="city-card"><div class="city-card-head"><span>${esc(city.name)}</span><span class="city-card-head-actions"><button class="icon-btn" title="Edit areas" onclick="cmsLandData.openAssignModalForCity('pn','${city.id}')"><i class="fas fa-pen"></i></button><button class="icon-btn icon-btn--danger" title="Remove all areas" onclick="cmsLandData.clearCityAssignments('pn','${city.id}')"><i class="fas fa-trash"></i></button></span></div><table class="area-table"><thead><tr><th>Area Name</th><th>Median / m²</th><th>Q1–Q3 band</th><th>YoY</th><th>n</th><th></th></tr></thead><tbody>${pnRows(city.id).map(row => `<tr><td class="link-cell">${esc(row.area)}</td>${row.n >= 20 ? `<td>¥${fmt(row.median)}</td><td>${band(row)}</td>` : '<td colspan="2" class="muted-value">Benchmark not displayed (n &lt; 20)</td>'}<td>${yoy(row)}</td><td>${row.n}</td><td><button class="icon-btn icon-btn--danger" title="Remove area" onclick="cmsLandData.removePnAssignment('${row.assignId}')"><i class="fas fa-trash"></i></button></td></tr>`).join("")}</tbody></table></div>`).join("") || '<div class="empty-preview">No cities assigned yet.</div>';
  }
  function lpRows(cityId) {
    return lpAssign.filter(x => x.cityId === cityId).map(x => {
      const station = stationById(x.stationId);
      return station ? {station:station.name, assignId:x.id, ...mlitBenchmark(`station-${station.mlitStationId}-${PERIOD}`)} : null;
    }).filter(row => row && row.n >= 20).sort((a,b) => b.median - a.median).map((row,i) => ({...row, rank:i+1}));
  }
  function renderTabs() {
    const enabled = cities.filter(c => lpAssign.some(x => x.cityId === c.id));
    if (!enabled.some(c => c.id === lpActiveCity)) lpActiveCity = enabled[0]?.id || null;
    $("lp-tabs").innerHTML = enabled.map(c => `<button class="land-tab ${c.id === lpActiveCity ? "active" : ""}" onclick="cmsLandData.setLpTab('${c.id}')">${esc(c.name)}</button>`).join("");
  }
  function renderLp() {
    if (!lpActiveCity) { $("lp-preview").innerHTML = '<div class="empty-preview">No cities assigned yet.</div>'; return; }
    const city = cityById(lpActiveCity), rows = lpRows(lpActiveCity);
    $("lp-preview").innerHTML = `<div class="city-card-head lp-city-head"><span>${esc(city.name)}</span><span class="city-card-head-actions"><button class="icon-btn" title="Edit stations" onclick="cmsLandData.openAssignModalForCity('lp','${city.id}')"><i class="fas fa-pen"></i></button><button class="icon-btn icon-btn--danger" title="Remove all stations" onclick="cmsLandData.clearCityAssignments('lp','${city.id}')"><i class="fas fa-trash"></i></button></span></div><div class="table-wrap"><table class="tbl"><thead><tr><th>Rank</th><th>Station Name</th><th>Median Price per m²</th><th>Median Price per Tsubo</th><th>Q1–Q3 Price Band</th><th>YoY Change</th><th>Transaction Count (n)</th><th></th></tr></thead><tbody>${rows.map(row => `<tr><td class="rank-cell">${row.rank}</td><td>${esc(row.station)}</td><td>¥${fmt(row.median)}</td><td>¥${fmt(row.median * TSUBO)}</td><td>${band(row)}</td><td>${yoy(row)}</td><td>${row.n}</td><td><button class="icon-btn icon-btn--danger" title="Remove station" onclick="cmsLandData.removeLpAssignment('${row.assignId}')"><i class="fas fa-trash"></i></button></td></tr>`).join("") || '<tr><td colspan="8" class="empty-preview">No assigned station meets n ≥ 20. Insufficient stations are excluded from ranking.</td></tr>'}</tbody></table></div>`;
  }
  function setLpTab(id) { lpActiveCity = id; renderTabs(); renderLp(); }
  function renderAll() { renderPn(); renderTabs(); renderLp(); }

  // Property Detail Market Trend is a separate CSV feature. Its final schema is
  // pending, so this mock validates structure only and keeps mapping per dataset.
  const municipalities = [
    {municipalityCode:"13101", name:"Chiyoda-ku"},
    {municipalityCode:"13103", name:"Minato-ku"},
    {municipalityCode:"13113", name:"Shibuya-ku"},
    {municipalityCode:"14109", name:"Yokohama-shi Kohoku-ku"},
    {municipalityCode:"14104", name:"Yokohama-shi Naka-ku"},
    {municipalityCode:"27127", name:"Osaka-shi Kita-ku"},
  ];
  const storageGet = (key, fallback) => { try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch (_) { return fallback; } };
  const storageSet = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  let marketDatasets = storageGet(MARKET_TREND_DATASETS_KEY, []);
  let activeDatasetId = null;
  let replacingDatasetId = null;
  const saveMarketDatasets = () => storageSet(MARKET_TREND_DATASETS_KEY, marketDatasets);
  function parseCsvLine(line) {
    const values = []; let current = ""; let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"' && quoted && line[index + 1] === '"') { current += '"'; index += 1; }
      else if (char === '"') quoted = !quoted;
      else if (char === "," && !quoted) { values.push(current.trim()); current = ""; }
      else current += char;
    }
    values.push(current.trim()); return values;
  }
  function validateMarketCsv(text) {
    const lines = String(text).replace(/^\uFEFF/, "").split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) return {valid:false, message:"The CSV must contain a header row and at least one data row."};
    const headers = parseCsvLine(lines[0]);
    if (!headers.length || headers.some(header => !header)) return {valid:false, message:"The CSV header contains an empty column name."};
    if (new Set(headers.map(header => header.toLowerCase())).size !== headers.length) return {valid:false, message:"The CSV header contains duplicate column names."};
    return {valid:true, headers};
  }
  function nextDatasetId() {
    const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    return `MT-${date}-${String(marketDatasets.filter(dataset => dataset.id.startsWith(`MT-${date}`)).length + 1).padStart(3, "0")}`;
  }
  function renderMarketDatasets() {
    const body = $("market-dataset-body"); if (!body) return;
    body.innerHTML = marketDatasets.length ? marketDatasets.map(dataset => `<tr><td>${esc(dataset.name)}</td><td><code>${esc(dataset.id)}</code></td><td>${esc(dataset.uploadedAt)}</td><td><span class="badge badge-success">${esc(dataset.validationStatus)}</span></td><td>${dataset.mappings.length}</td><td class="dataset-actions"><button class="btn btn-secondary" onclick="cmsLandData.openMarketMapping('${esc(dataset.id)}')">Manage mapping</button><button class="icon-btn" title="Replace dataset CSV" onclick="cmsLandData.replaceMarketDataset('${esc(dataset.id)}')"><i class="fas fa-rotate"></i></button><button class="icon-btn icon-btn--danger" title="Delete dataset" onclick="cmsLandData.deleteMarketDataset('${esc(dataset.id)}')"><i class="fas fa-trash"></i></button></td></tr>`).join("") : '<tr><td colspan="6" class="empty-preview">No Market Trend datasets uploaded.</td></tr>';
  }
  function onMarketCsvSelected(event) {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = validateMarketCsv(reader.result);
      if (!result.valid) { toast(result.message, "err"); event.target.value = ""; replacingDatasetId = null; return; }
      const existing = marketDatasets.find(dataset => dataset.id === replacingDatasetId);
      if (existing) {
        existing.name = file.name.replace(/\.csv$/i, ""); existing.fileName = file.name; existing.uploadedAt = new Date().toISOString().slice(0, 10); existing.validationStatus = "Valid structure"; existing.headers = result.headers;
        toast("Market Trend dataset replaced. Existing mappings were preserved.");
      } else {
        marketDatasets.push({id:nextDatasetId(), name:file.name.replace(/\.csv$/i, ""), fileName:file.name, uploadedAt:new Date().toISOString().slice(0, 10), validationStatus:"Valid structure", headers:result.headers, mappings:[]});
        toast("Market Trend dataset uploaded and structurally validated.");
      }
      replacingDatasetId = null; event.target.value = ""; saveMarketDatasets(); renderMarketDatasets();
    };
    reader.onerror = () => { toast("The CSV could not be read.", "err"); replacingDatasetId = null; event.target.value = ""; };
    reader.readAsText(file);
  }
  function replaceMarketDataset(id) { replacingDatasetId = id; $("market-trend-csv-file").click(); }
  function deleteMarketDataset(id) {
    const dataset = marketDatasets.find(item => item.id === id); if (!dataset) return;
    if (!confirm(`Delete Market Trend dataset "${dataset.name}" and its dataset-specific mappings?`)) return;
    marketDatasets = marketDatasets.filter(item => item.id !== id); saveMarketDatasets(); renderMarketDatasets(); toast("Market Trend dataset deleted.");
  }
  function renderMarketMappings() {
    const dataset = marketDatasets.find(item => item.id === activeDatasetId); if (!dataset) return;
    $("market-mapping-dataset-name").textContent = `${dataset.name} · ${dataset.id}`;
    $("market-mapping-body").innerHTML = dataset.mappings.length ? dataset.mappings.map(mapping => `<tr><td>${esc(mapping.city)}</td><td><code>${esc(mapping.municipalityCode)}</code></td><td>${esc(mapping.areaGroup)}</td><td><button class="icon-btn icon-btn--danger" onclick="cmsLandData.removeMarketMapping('${esc(mapping.municipalityCode)}')"><i class="fas fa-trash"></i></button></td></tr>`).join("") : '<tr><td colspan="4" class="empty-preview">No mappings for this dataset.</td></tr>';
  }
  function openMarketMapping(id) { activeDatasetId = id; $("market-mapping-area-group").value = ""; renderMarketMappings(); openModal("modal-market-mapping"); }
  function addMarketMapping() {
    const dataset = marketDatasets.find(item => item.id === activeDatasetId); const code = $("market-mapping-municipality").value; const areaGroup = $("market-mapping-area-group").value.trim(); const municipality = municipalities.find(item => item.municipalityCode === code);
    if (!dataset || !municipality || !areaGroup) return toast("Select a City/Ward and enter a Custom Area Group.", "err");
    const existing = dataset.mappings.find(mapping => mapping.municipalityCode === code);
    if (existing) existing.areaGroup = areaGroup; else dataset.mappings.push({municipalityCode:code, city:municipality.name, areaGroup});
    saveMarketDatasets(); $("market-mapping-area-group").value = ""; renderMarketMappings(); renderMarketDatasets(); toast("Dataset mapping saved.");
  }
  function removeMarketMapping(code) {
    const dataset = marketDatasets.find(item => item.id === activeDatasetId); if (!dataset) return;
    dataset.mappings = dataset.mappings.filter(mapping => mapping.municipalityCode !== code); saveMarketDatasets(); renderMarketMappings(); renderMarketDatasets();
  }
  function initializeMarketConfiguration() {
    const legacyToggles = storageGet(LEGACY_TOGGLES_KEY, {});
    if ($("toggle-price") && typeof legacyToggles["toggle-price"] === "boolean") $("toggle-price").checked = legacyToggles["toggle-price"];
    $("toggle-price")?.addEventListener("change", event => { const values = storageGet(LEGACY_TOGGLES_KEY, {}); values["toggle-price"] = event.target.checked; storageSet(LEGACY_TOGGLES_KEY, values); });
    if ($("toggle-market-trend")) {
      $("toggle-market-trend").checked = storageGet(MARKET_TREND_VISIBLE_KEY, false) === true;
      $("toggle-market-trend").addEventListener("change", event => storageSet(MARKET_TREND_VISIBLE_KEY, event.target.checked));
    }
    if ($("market-mapping-municipality")) $("market-mapping-municipality").innerHTML = municipalities.map(item => `<option value="${item.municipalityCode}">${esc(item.name)} (${item.municipalityCode})</option>`).join("");
    $("market-trend-csv-file")?.addEventListener("change", onMarketCsvSelected);
    renderMarketDatasets();
  }

  window.cmsLandData = {closeModal, openAssignModal, openAssignModalForCity, onCitySearchInput, selectAssignCity, onAssignCityChange, confirmAssign, clearCityAssignments, removePnAssignment, removeLpAssignment, setLpTab, replaceMarketDataset, deleteMarketDataset, openMarketMapping, addMarketMapping, removeMarketMapping};
  root.querySelectorAll(".mlit-scope-slot").forEach(el => { el.innerHTML = scope; });
  root.querySelectorAll(".benchmark-meta-slot").forEach(el => { el.innerHTML = metadata; });
  root.querySelectorAll(".modal-backdrop").forEach(el => el.addEventListener("click", e => { if (e.target === el) el.classList.remove("open"); }));
  document.addEventListener("click", e => { if (!e.target.closest(".city-search-wrap") && $("assign-city-dropdown")) $("assign-city-dropdown").style.display = "none"; });
  window.addEventListener("resize", () => { if ($("assign-city-dropdown")?.style.display !== "none") positionDropdown(); });
  initializeMarketConfiguration();
  renderAll();
})();
