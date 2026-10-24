  // ---------- connections: everything on the page shares threads; selecting one item shows the rest ----------
  const FIOS = { calor: "calor e clima", fome: "fome", guerra: "guerra e violência", desl: "deslocamento", dinheiro: "dinheiro e preços",
    epidemia: "epidemias", antidep: "antidepressivos", ossos: "ossos e fraturas", parar: "parar remédios", sexual: "efeitos sexuais",
    benzo: "calmantes", antipsi: "antipsicóticos", ar: "ar e poluição", cuidado: "o que ajuda", jovens: "jovens", idosos: "idosos",
    estresse: "estresse e cortisol", inflam: "inflamação", sono: "sono", trauma: "trauma" };
  const SECS = { caso: ["casos", "hCase"], ev: ["linha do tempo", "hTl"], ativo: ["pregão", "hBoard"], tema: ["pesquisa ao vivo", "hRes"],
    achado: ["o que pouco chega ao público", "hHid"], remedio: ["remédios e moléculas", "hDrug"], quem: ["quem recolhe", "hWho"] };
  const T_CASO = { elnino: "calor fome antidep antipsi sono dinheiro cuidado", sudao: "guerra fome desl trauma jovens dinheiro cuidado",
    ormuz: "guerra dinheiro estresse cuidado", ebola: "epidemia trauma sono cuidado", pandemia: "epidemia antidep ossos jovens dinheiro cuidado" };
  const T_EV = { "Pandemia de COVID-19": "epidemia jovens estresse", "Antidepressivos para jovens": "antidep jovens ossos dinheiro epidemia",
    "Guerra na Ucrânia": "guerra trauma desl", "Choque de energia": "dinheiro guerra estresse", "Crise de alimentos": "fome dinheiro",
    "Guerras em Gaza e no Sudão": "guerra desl fome trauma", "Parar antidepressivo tem sintomas": "antidep parar", "Armas em recorde": "guerra dinheiro",
    "Ajuda alimentar encolhe": "fome dinheiro cuidado", "Super El Niño": "calor fome", "Guerra no Irã e crise de Ormuz": "guerra dinheiro",
    "Ebola Bundibugyo na RDC": "epidemia trauma", "Sudão à beira da fome extrema": "guerra fome desl", "13 focos de fome": "fome guerra",
    "Calor acima do normal": "calor antipsi sono", "Fome pode piorar nos focos": "fome", "O custo que se repete todo ano": "dinheiro estresse",
    "1 em cada 6 terá 60 anos ou mais": "idosos ossos antidep", "250 mil mortes a mais por ano": "calor fome", "216 milhões de migrantes do clima": "desl calor",
    "2,1 bilhões com 60 anos ou mais": "idosos ossos" };
  const T_LANE = { mente: "estresse", clima: "calor", conflito: "guerra", dinheiro: "dinheiro", ciencia: "antidep", gente: "idosos" };
  const T_ATIVO = { COR: "estresse", FOME: "fome", ANSI: "estresse sono", VIOL: "guerra trauma", GUER: "guerra trauma desl", DESL: "desl trauma", ECON: "dinheiro estresse", CUID: "cuidado" };
  const T_TEMA = ["estresse", "calor ar", "guerra desl trauma", "fome dinheiro", "antidep ossos parar sexual benzo antipsi", "inflam ar", "cuidado"];
  const T_ACHADO = ["antidep ossos idosos jovens", "antidep parar", "antidep sexual", "antidep estresse", "benzo parar", "antipsi", "ar inflam", "fome", "cuidado ossos antidep"];
  const T_REM = { sertraline: "antidep ossos parar sexual", fluoxetine: "antidep ossos parar sexual jovens", escitalopram: "antidep ossos parar sexual", paroxetine: "antidep ossos parar sexual",
    venlafaxine: "antidep parar sexual", bupropion: "antidep", quetiapine: "antipsi calor", olanzapine: "antipsi calor", lithium: "calor", clonazepam: "benzo parar", alprazolam: "benzo parar", methylphenidate: "jovens calor" };
  const T_QUEM = ["guerra dinheiro trauma", "dinheiro guerra estresse", "fome dinheiro", "epidemia antidep dinheiro"];
  const sp = s => s.split(" ");
  function linkItems() {
    const out = [];
    for (const [k, c] of Object.entries(CASES)) out.push({ id: "caso:" + k, sec: "caso", nome: c.nome, tags: sp(T_CASO[k] || "") });
    [...EVENTS, ...liveEvents()].forEach((e, i) => out.push({ id: "ev:" + i, sec: "ev", nome: e.t, tags: sp(T_EV[e.t] || T_LANE[e.lane] || "") }));
    for (const k of Object.keys(ASSETS)) out.push({ id: "ativo:" + k, sec: "ativo", nome: `${k} · ${ASSETS[k].curto || ASSETS[k].nome}`, tags: sp(T_ATIVO[k] || "") });
    TOPICS.forEach((t, i) => out.push({ id: "tema:" + i, sec: "tema", nome: t, tags: sp(T_TEMA[i] || "") }));
    HIDDEN.forEach((h, i) => out.push({ id: "achado:" + i, sec: "achado", nome: h[0], tags: sp(T_ACHADO[i] || "") }));
    for (const [k, d] of Object.entries(DRUGS)) out.push({ id: "remedio:" + k, sec: "remedio", nome: d[0], tags: sp(T_REM[k] || "") });
    document.querySelectorAll("#whoRows tr").forEach((tr, i) => out.push({ id: "quem:" + i, sec: "quem", nome: tr.cells[0].textContent, tags: sp(T_QUEM[i] || "") }));
    return out.filter(x => x.tags[0]);
  }
  function linkGo(id) {
    const [sec, k] = id.split(":");
    if (sec === "caso") { selCase = k; renderCases(); }
    else if (sec === "ev") { selEv = +k; renderTimeline(); }
    else if (sec === "ativo") { const q = Q.filter(x => x.k === k).sort((a, b) => b.v - a.v)[0]; if (q) select(q.sym); }
    else if (sec === "tema") { selTopic = TOPICS[+k]; renderResearch(); }
    else if (sec === "remedio") { selDrug = k; renderDrugs(); }
    linkDecorate();
    const el = document.querySelector(`[data-link="${id}"]`) || document.getElementById(SECS[sec][1]);
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.remove("lk-flash"); void el.offsetWidth; el.classList.add("lk-flash");
  }
  // mark every selectable thing with its id, after each render
  function linkDecorate() {
    const set = (sel, f) => document.querySelectorAll(sel).forEach((el, i) => { const id = f(el, i); if (id && el.dataset.link !== id) el.dataset.link = id; });
    set("#caseTabs button", el => "caso:" + el.dataset.c);
    set("#tl .ev", el => "ev:" + el.dataset.i);
    set("#board tr", el => el.dataset.sym ? "ativo:" + el.dataset.sym.split(".")[0] : null);
    set("#topicTabs button", el => "tema:" + TOPICS.indexOf(el.dataset.t));
    set("#hidden article", (el, i) => { if (!el.hasAttribute("tabindex")) { el.tabIndex = 0; el.setAttribute("role", "button"); } return "achado:" + i; });
    set("#drugTabs button", el => "remedio:" + el.dataset.d);
    set("#whoRows tr", (el, i) => { if (!el.hasAttribute("tabindex")) { el.tabIndex = 0; el.setAttribute("role", "button"); } return "quem:" + i; });
    if (LK.cur) document.querySelectorAll("[data-link]").forEach(el => el.classList.toggle("lk", LK.rel.has(el.dataset.link) && el.dataset.link !== LK.cur));
  }
  const LK = { cur: null, rel: new Set(), tag: null };
  const lkBox = document.getElementById("links");
  function linkOpen(id, tag) {
    const items = linkItems(), me = id ? items.find(x => x.id === id) : null;
    if (id && !me) return;
    const want = tag ? [tag] : me.tags;
    const rel = items.filter(x => x.id !== id).map(x => ({ x, n: x.tags.filter(t => want.includes(t)).length })).filter(r => r.n).sort((a, b) => b.n - a.n);
    LK.cur = id; LK.tag = tag || null; LK.rel = new Set(rel.map(r => r.x.id));
    const groups = {}; for (const r of rel) (groups[r.x.sec] = groups[r.x.sec] || []).push(r);
    const head = me ? `<span class="lk-k">${SECS[me.sec][0]}</span><h3>${esc(me.nome)}</h3>` : `<span class="lk-k">fio</span><h3>${FIOS[tag]}</h3>`;
    lkBox.innerHTML = `<div class="lk-top"><span class="lk-t">CONEXÕES</span><button type="button" class="chipbtn" id="lkClose">fechar</button></div>${head}
      <div class="lk-tags">${want.map(t => `<button type="button" class="chipbtn" data-tag="${t}" aria-pressed="${t === tag}">${FIOS[t]}</button>`).join("")}</div>
      ${rel.length ? Object.keys(SECS).filter(s => groups[s]).map(s => `<section><span class="lk-k">${SECS[s][0]}</span><ul>${groups[s].map(r => `<li><button type="button" class="lk-go" data-go="${r.x.id}">${esc(r.x.nome)}</button><span>${r.x.tags.filter(t => want.includes(t)).map(t => FIOS[t]).join(" · ")}</span></li>`).join("")}</ul></section>`).join("")
        : `<p class="lk-none">Nada mais na página toca neste fio por enquanto.</p>`}
      <p class="lk-none">Um fio liga coisas que tratam do mesmo assunto. Estar no mesmo fio não quer dizer que uma causou a outra.</p>`;
    lkBox.hidden = false; document.body.classList.add("lk-open");
    linkDecorate();
  }
  function linkClose() { LK.cur = null; LK.rel = new Set(); lkBox.hidden = true; document.body.classList.remove("lk-open"); document.querySelectorAll(".lk").forEach(el => el.classList.remove("lk")); }
  lkBox.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.id === "lkClose") return linkClose();
    if (b.dataset.tag) return linkOpen(LK.tag === b.dataset.tag ? LK.cur : null, LK.tag === b.dataset.tag ? null : b.dataset.tag) || (LK.cur === null && !LK.tag && linkClose());
    if (b.dataset.go) { const id = b.dataset.go; linkGo(id); linkOpen(id); }
  });
  // any click on a selectable thing opens its connections (the page's own handlers still run first)
  document.addEventListener("click", e => { if (e.target.closest("#links")) return; const el = e.target.closest("[data-link]"); if (el) setTimeout(() => linkOpen(el.dataset.link), 0); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !lkBox.hidden) return linkClose();
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches('[data-link][role="button"]')) { e.preventDefault(); linkOpen(e.target.dataset.link); }
  });
  new MutationObserver(() => { clearTimeout(LK.t); LK.t = setTimeout(linkDecorate, 30); }).observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
