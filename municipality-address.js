(function (global) {
  "use strict";

  // Mock municipality master. City/Ward is one display value; code is the identity key.
  const MUNICIPALITIES_BY_PREFECTURE = {
    Tokyo: [
      ["13113", "Shibuya-ku", ["Shibuya"]], ["13104", "Shinjuku-ku", ["Shinjuku"]],
      ["13103", "Minato-ku", ["Minato"]], ["13112", "Setagaya-ku", ["Setagaya"]],
      ["13102", "Chuo-ku", ["Chuo"]], ["13110", "Meguro-ku", ["Meguro"]],
      ["13105", "Bunkyo-ku", ["Bunkyo"]], ["13108", "Koto-ku", ["Koto"]],
      ["13109", "Shinagawa-ku", ["Shinagawa"]], ["13115", "Suginami-ku", ["Suginami"]],
      ["13106", "Taito-ku", ["Taito"]], ["13123", "Edogawa-ku", ["Edogawa"]],
    ],
    Osaka: [
      ["27128", "Osaka-shi Chuo-ku", ["Osaka", "Chuo", "Namba"]],
      ["27127", "Osaka-shi Kita-ku", ["Kita"]], ["27141", "Sakai-shi Sakai-ku", ["Sakai"]],
      ["27203", "Toyonaka-shi", ["Toyonaka"]], ["27227", "Higashiosaka-shi", ["Higashi-Osaka"]],
      ["27205", "Suita-shi", ["Suita"]], ["27210", "Hirakata-shi", ["Hirakata"]],
    ],
    Kanagawa: [
      ["14109", "Yokohama-shi Kohoku-ku", ["Yokohama"]],
      ["14104", "Yokohama-shi Naka-ku", []], ["14103", "Yokohama-shi Nishi-ku", []],
      ["14133", "Kawasaki-shi Nakahara-ku", ["Kawasaki"]],
      ["14152", "Sagamihara-shi Chuo-ku", ["Sagamihara"]],
      ["14201", "Yokosuka-shi", ["Yokosuka"]], ["14205", "Fujisawa-shi", ["Fujisawa"]],
    ],
    Kyoto: [["26104", "Kyoto-shi Nakagyo-ku", ["Kyoto", "Nakagyo"]], ["26204", "Uji-shi", ["Uji"]], ["26206", "Kameoka-shi", ["Kameoka"]]],
    Hokkaido: [["01101", "Sapporo-shi Chuo-ku", ["Sapporo"]], ["01202", "Hakodate-shi", ["Hakodate"]], ["01204", "Asahikawa-shi", ["Asahikawa"]]],
    Fukuoka: [["40132", "Fukuoka-shi Hakata-ku", ["Fukuoka", "Hakata"]], ["40106", "Kitakyushu-shi Kokurakita-ku", ["Kitakyushu"]], ["40203", "Kurume-shi", ["Kurume"]]],
    Saitama: [["11103", "Saitama-shi Omiya-ku", ["Saitama"]], ["11203", "Kawaguchi-shi", ["Kawaguchi"]], ["11208", "Tokorozawa-shi", ["Tokorozawa"]], ["11201", "Kawagoe-shi", ["Kawagoe"]]],
    Chiba: [["12101", "Chiba-shi Chuo-ku", ["Chiba"]], ["12204", "Funabashi-shi", ["Funabashi"]], ["12207", "Matsudo-shi", ["Matsudo"]], ["12203", "Ichikawa-shi", ["Ichikawa"]]],
    Aichi: [["23106", "Nagoya-shi Naka-ku", ["Nagoya"]], ["23211", "Toyota-shi", ["Toyota"]], ["23201", "Toyohashi-shi", ["Toyohashi"]], ["23202", "Okazaki-shi", ["Okazaki"]]],
    Hyogo: [["28110", "Kobe-shi Chuo-ku", ["Kobe"]], ["28201", "Himeji-shi", ["Himeji"]], ["28204", "Nishinomiya-shi", ["Nishinomiya"]], ["28202", "Amagasaki-shi", ["Amagasaki"]]],
    Ibaraki: [["08220", "Tsukuba-shi", ["Tsukuba"]]],
  };

  Object.keys(MUNICIPALITIES_BY_PREFECTURE).forEach((prefecture) => {
    MUNICIPALITIES_BY_PREFECTURE[prefecture] = MUNICIPALITIES_BY_PREFECTURE[prefecture].map(
      ([code, name, legacy]) => ({ code, name, legacy }),
    );
  });

  const namesByPrefecture = Object.fromEntries(
    Object.entries(MUNICIPALITIES_BY_PREFECTURE).map(([prefecture, rows]) => [prefecture, rows.map((row) => row.name)]),
  );

  function records(prefecture) {
    return MUNICIPALITIES_BY_PREFECTURE[prefecture] || [];
  }

  function find(prefecture, city, code, postCode, address) {
    const rows = records(prefecture);
    if (code) {
      const exactCode = rows.find((row) => row.code === String(code));
      if (exactCode) return exactCode;
    }
    if (!city && recordAddress(address)) {
      const addressText = recordAddress(address);
      return rows.find((row) => [row.name].concat(row.legacy).some((value) => value && addressText.includes(value))) || null;
    }
    if (!city) return null;
    const exactName = rows.find((row) => row.name === city);
    if (exactName) return exactName;
    if (prefecture === "Kanagawa" && city === "Yokohama") {
      const postal = String(postCode || "").replace(/\D/g, "");
      if (postal.startsWith("231")) return rows.find((row) => row.code === "14104") || null;
      if (postal.startsWith("220")) return rows.find((row) => row.code === "14103") || null;
    }
    return rows.find((row) => row.legacy.includes(city)) || null;
  }

  function recordAddress(value) {
    return typeof value === "string" ? value : "";
  }

  function normalizeMunicipality(record) {
    if (!record || typeof record !== "object") return record;
    let match = find(record.prefecture, record.city, record.municipalityCode, record.postCode, record.address);
    if (!match && !record.city && record.address) {
      const rows = records(record.prefecture);
      match = rows.find((row) => [row.name].concat(row.legacy).some((value) => value && record.address.includes(value))) || null;
    }
    if (match) {
      record.city = match.name;
      record.municipalityCode = match.code;
    }
    return record;
  }

  function normalizeAll(rows) {
    (Array.isArray(rows) ? rows : []).forEach(normalizeMunicipality);
    return rows;
  }

  function setMunicipality(record, prefecture, municipalityCode) {
    const match = records(prefecture).find((row) => row.code === String(municipalityCode || ""));
    record.prefecture = prefecture || "";
    record.city = match ? match.name : "";
    record.municipalityCode = match ? match.code : "";
    return record;
  }

  function reconcile(record) {
    if (!record || typeof record !== "object") return record;
    const match = find(record.prefecture, record.city, record.municipalityCode, record.postCode, record.address);
    if (!match) {
      record.city = "";
      record.municipalityCode = "";
      return record;
    }
    record.city = match.name;
    record.municipalityCode = match.code;
    return record;
  }

  function sameMunicipality(a, b) {
    return !!(a && b && a.municipalityCode && b.municipalityCode && String(a.municipalityCode) === String(b.municipalityCode));
  }

  function filterValue(prefecture, cityOrCode) {
    const match = find(prefecture, cityOrCode, cityOrCode);
    return match ? `${prefecture}|${match.code}` : "";
  }

  function migrateFilterValues(values) {
    return (Array.isArray(values) ? values : []).map((value) => {
      const [prefecture, cityOrCode] = String(value).split("|");
      return filterValue(prefecture, cityOrCode) || value;
    });
  }

  function mlitKey(record) {
    return normalizeMunicipality(record)?.municipalityCode || "";
  }

  global.MUNICIPALITIES_BY_PREFECTURE = MUNICIPALITIES_BY_PREFECTURE;
  global.YuushiMunicipality = { records, namesByPrefecture, find, normalizeMunicipality, normalizeAll, setMunicipality, reconcile, sameMunicipality, filterValue, migrateFilterValues, mlitKey };
})(window);
