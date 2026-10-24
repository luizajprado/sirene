// Three languages without touching the page's own code: every Portuguese text node (and placeholder, aria-label,
// title) is swapped for its English or Spanish version, including text the page writes later. Numbers are kept:
// "carga 0,62" matches the template "carga {#}". Composed sentences fall back to phrase-by-phrase replacement.
(() => {
  const D = window.I18N_DICT || { en: {}, es: {} }, F = window.I18N_FRAG || { en: [], es: [] };
  const NUM = /\d+(?:[.,:]\d+)*/g, LANGS = ["pt", "en", "es"], LABEL = { pt: "PT", en: "EN", es: "ES" };
  const pick = () => {
    let q = null; try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
    let s = null; try { s = localStorage.getItem("lang"); } catch (e) {}
    const n = (navigator.language || "pt").slice(0, 2).toLowerCase();
    return [q, s, n].find(x => LANGS.includes(x)) || "pt";
  };
  let lang = pick();
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const fragRe = {};
  for (const l of ["en", "es"]) fragRe[l] = (F[l] || []).slice().sort((a, b) => b[0].length - a[0].length)
    .map(([pt, tr]) => [new RegExp(`(?<![\\p{L}\\p{N}])${esc(pt)}(?![\\p{L}\\p{N}])`, "gu"), tr]);
  const fixNum = n => lang !== "en" ? n : /^\d{1,3}(\.\d{3})+$/.test(n) ? n.replace(/\./g, ",") : /^\d+,\d+$/.test(n) ? n.replace(",", ".") : n;
  function whole(x, d) {
    if (d[x] != null) return d[x];
    const nums = x.match(NUM); if (!nums) return null;
    const v = d[x.replace(NUM, "{#}")]; if (v == null) return null;
    let i = 0; return v.replace(/\{#\}/g, () => fixNum(nums[i++] ?? ""));
  }
  function tr(src) {
    const t = src.trim(); if (!t || lang === "pt") return null;
    const d = D[lang] || {};
    let out = null;
    if (d[t] != null) out = d[t];
    else {
      const nums = t.match(NUM);
      if (nums) { const v = d[t.replace(NUM, "{#}")]; if (v != null) { let i = 0; out = v.replace(/\{#\}/g, () => fixNum(nums[i++] ?? "")); } }
    }
    if (out == null && /, | · /.test(t)) {   // composed labels: "title, status" or "a · b"
      const parts = t.split(/(, | · )/); let hit = false;
      const res = parts.map((x, i) => { if (i % 2) return x; const y = whole(x, d); if (y != null) { hit = true; return y; } return x; });
      if (hit) {   // the parts left over still get phrase-by-phrase treatment
        out = res.map((x, i) => { if (i % 2 || whole(parts[i], d) != null) return x; let s = x; for (const [re, rep] of fragRe[lang]) s = s.replace(re, rep); return s; }).join("");
      }
    }
    if (out == null) {
      let s = t; for (const [re, rep] of fragRe[lang]) s = s.replace(re, rep);
      if (lang === "en") s = s.replace(/(?<![\d.,])\d{1,3}(?:\.\d{3})+(?:,\d+)?(?![\d.])|(?<![\d.,])\d+,\d+(?![\d,])/g, n => n.replace(/\./g, "§").replace(",", ".").replace(/§/g, ","));   // 1.234,5 → 1,234.5
      if (s !== t) out = s;
    }
    return out == null ? null : src.replace(t, out);
  }
  const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "CODE", "NOSCRIPT"]);
  function doText(n) {
    const pe = n.parentElement; if (!pe || SKIP.has(pe.tagName) || pe.closest("[data-noi18n]")) return;
    if (n.__tr === undefined || n.nodeValue !== n.__tr) n.__pt = n.nodeValue;
    const out = lang === "pt" ? n.__pt : (tr(n.__pt) ?? n.__pt);
    n.__tr = out; if (n.nodeValue !== out) n.nodeValue = out;
  }
  const ATTRS = ["placeholder", "aria-label", "title"];
  function doAttrs(el) {
    if (el.closest && el.closest("[data-noi18n]")) return;
    el.__pa = el.__pa || {}; el.__ta = el.__ta || {};
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue; const v = el.getAttribute(a);
      if (el.__ta[a] === undefined || v !== el.__ta[a]) el.__pa[a] = v;
      const out = lang === "pt" ? el.__pa[a] : (tr(el.__pa[a]) ?? el.__pa[a]);
      el.__ta[a] = out; if (v !== out) el.setAttribute(a, out);
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1) return;
    if (ATTRS.some(a => root.hasAttribute(a))) doAttrs(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    while (w.nextNode()) { const n = w.currentNode; if (n.nodeType === 3) doText(n); else if (ATTRS.some(a => n.hasAttribute(a))) doAttrs(n); }
  }
  let titlePt = null;
  function all() {
    if (titlePt === null || (document.title !== titleTr)) titlePt = document.title;
    titleTr = lang === "pt" ? titlePt : (tr(titlePt) ?? titlePt); document.title = titleTr;
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
    walk(document.body);
    document.querySelectorAll("[data-i18n-btn]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.i18nBtn === lang)));
  }
  let titleTr = null;
  new MutationObserver(ms => {
    for (const m of ms) {
      if (m.type === "childList") m.addedNodes.forEach(walk);
      else if (m.type === "characterData") doText(m.target);
      else if (m.type === "attributes") doAttrs(m.target);
    }
  }).observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  // the switcher
  const pos = window.I18N_POS || "bottom:12px;left:12px";
  const box = document.createElement("div"); box.setAttribute("data-noi18n", ""); box.setAttribute("role", "group"); box.setAttribute("aria-label", "Idioma · Language · Idioma");
  box.style.cssText = `position:fixed;${pos};z-index:2147483000;display:flex;gap:2px;background:rgba(8,8,7,.82);border:1px solid #2C2820;padding:3px;font:500 11px/1 "IBM Plex Mono",ui-monospace,Menlo,monospace;letter-spacing:.08em;backdrop-filter:blur(6px)`;
  for (const l of LANGS) {
    const b = document.createElement("button"); b.type = "button"; b.dataset.i18nBtn = l; b.textContent = LABEL[l];
    b.style.cssText = "background:none;border:0;color:#BDB3A5;padding:8px 9px;min-width:36px;min-height:32px;cursor:pointer;font:inherit;letter-spacing:inherit";
    b.addEventListener("click", () => { lang = l; try { localStorage.setItem("lang", l); } catch (e) {} all(); });
    box.append(b);
  }
  const st = document.createElement("style"); st.textContent = `[data-i18n-btn][aria-pressed="true"]{color:#0A0907!important;background:#E8B86A!important}[data-i18n-btn]:focus-visible{outline:2px solid #EDE6D8}`;
  document.head.append(st);
  const start = () => { document.body.append(box); all(); };
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
