// Glossary page: a full-screen page in every lab, opened by the "glossário" button beside the language switcher
// or by the address ending in #glossario. Content: window.GUIDE = { titulo, intro, groups: [{ nome, items: [[termo, texto]] }] }
// in Portuguese; the translator swaps it.
(() => {
  const G = window.GUIDE; if (!G) return;
  const LBL = { pt: "glossário", en: "glossary", es: "glosario" }, CLOSE = { pt: "voltar", en: "back", es: "volver" };
  const lang = () => (document.documentElement.lang || "pt").slice(0, 2);
  const css = document.createElement("style");
  css.textContent = `
  .gd-btn{background:none;border:0;border-right:1px solid #2C2820;color:#E8B86A;padding:8px 10px;min-height:32px;cursor:pointer;font:inherit;letter-spacing:inherit;margin-right:2px}
  .gd-btn:hover{color:#EDE6D8}.gd-btn:focus-visible{outline:2px solid #EDE6D8}
  .gd{position:fixed;inset:0;z-index:2147483001;background:#0A0907;overflow-y:auto;color:#D9D1C3;font:400 14px/1.65 "IBM Plex Mono",ui-monospace,Menlo,monospace}
  .gd[hidden]{display:none!important}
  .gd-in{max-width:1080px;margin:0 auto;padding:40px 32px 80px;box-sizing:border-box}
  .gd-top{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;border-bottom:1px solid #2C2820;padding-bottom:22px;margin-bottom:8px}
  .gd h1{margin:0 0 10px;font-size:30px;line-height:1.1;letter-spacing:.02em;color:#EDE6D8;font-weight:600}
  .gd-top p{margin:0;max-width:68ch;color:#BDB3A5}
  .gd-x{flex:none;background:none;border:1px solid #2C2820;color:#E8B86A;font:inherit;padding:8px 14px;cursor:pointer;min-height:36px}
  .gd-x:hover{color:#EDE6D8;border-color:#5A5246}.gd-x:focus-visible{outline:2px solid #EDE6D8}
  .gd-nav{display:flex;flex-direction:row;border:0;width:auto;position:static;flex-wrap:wrap;gap:6px 18px;padding:14px 0 6px;font-size:12px;letter-spacing:.1em;text-transform:uppercase}
  .gd-nav a{color:#A0968A;text-decoration:none}.gd-nav a:hover{color:#E8B86A}
  .gd section{padding-top:30px}
  .gd h2{margin:0 0 14px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#E8B86A;font-weight:600;border-bottom:1px solid #1F1C17;padding-bottom:8px}
  .gd dl{margin:0;display:grid;grid-template-columns:minmax(150px,240px) 1fr;gap:14px 28px}
  .gd dt{color:#EDE6D8;font-weight:600}.gd dd{margin:0;color:#BDB3A5;max-width:72ch}
  .gd-foot{margin-top:40px;padding-top:16px;border-top:1px solid #2C2820;color:#7D7468;font-size:12px}
  @media (max-width:560px){.gd-in{padding:24px 16px 64px}.gd h1{font-size:24px}.gd dl{grid-template-columns:1fr;gap:2px}.gd dd{margin-bottom:14px}}`;
  document.head.append(css);
  const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; };
  const ov = el("div", "gd"); ov.hidden = true; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", G.titulo);
  const inn = el("div", "gd-in"), top = el("div", "gd-top"), head = el("div");
  const x = el("button", "gd-x"); x.type = "button"; x.setAttribute("data-noi18n", "");
  head.append(el("h1", null, G.titulo), el("p", null, G.intro || "")); top.append(head, x);
  const nav = el("div", "gd-nav"); nav.setAttribute("role", "navigation"); inn.append(top, nav);
  G.groups.forEach((g, i) => {
    const id = "gd-s" + i, a = el("a", null, g.nome); a.href = "#" + id;
    a.addEventListener("click", e => { e.preventDefault(); document.getElementById(id).scrollIntoView({ behavior: "smooth" }); });
    nav.append(a);
    const sec = el("section"); sec.id = id; sec.append(el("h2", null, g.nome));
    const dl = el("dl"); for (const [t, d] of g.items) dl.append(el("dt", null, t), el("dd", null, d));
    sec.append(dl); inn.append(sec);
  });
  if (G.rodape) inn.append(el("p", "gd-foot", G.rodape));
  ov.append(inn);
  let last = null;
  const open = () => { last = document.activeElement; ov.hidden = false; ov.scrollTop = 0; x.focus(); if (location.hash !== "#glossario") history.replaceState(null, "", "#glossario"); };
  const close = () => { ov.hidden = true; if (location.hash === "#glossario") history.replaceState(null, "", location.pathname + location.search); if (last) last.focus(); };
  x.addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !ov.hidden) { e.stopPropagation(); close(); } }, true);
  // keys typed on the glossary page do not drive the page underneath (the lab uses 1 to 5 and space)
  ov.addEventListener("keydown", e => { if (e.key !== "Escape" && e.key !== "Tab") e.stopPropagation(); });
  addEventListener("hashchange", () => { if (location.hash === "#glossario" && ov.hidden) open(); });
  const btn = el("button", "gd-btn"); btn.type = "button"; btn.setAttribute("aria-haspopup", "dialog");
  btn.addEventListener("click", open);
  const narrow = matchMedia("(max-width: 560px)");
  const label = () => { const l = LBL[lang()] ? lang() : "pt"; btn.textContent = narrow.matches ? "?" : LBL[l]; btn.setAttribute("aria-label", LBL[l]); btn.title = LBL[l]; x.textContent = CLOSE[l]; };
  narrow.addEventListener("change", label);
  new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  const mount = () => {
    document.body.append(ov);
    const sw = document.querySelector("[data-i18n-btn]");
    if (sw) sw.parentElement.prepend(btn);
    else { btn.style.cssText = "position:fixed;top:12px;right:12px;z-index:2147483000;background:rgba(8,8,7,.82);border:1px solid #2C2820"; document.body.append(btn); }
    label();
    if (location.hash === "#glossario" || window.__h0 === "#glossario") open();
  };
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
