  // ---------- the connections as a picture: a round map, sections on the rim, threads in the middle ----------
  const MAP = { sel: null, fio: null };
  const FIO_COL = Object.fromEntries(Object.keys(FIOS).map((k, i, a) => [k, `hsl(${Math.round(i / a.length * 360 + 18)} 72% 62%)`]));
  function renderMap() {
    const items = linkItems(), secs = Object.keys(SECS).filter(s => items.some(x => x.sec === s));
    const S = 900, cx = S / 2, cy = S / 2, R1 = 330, R0 = 128, gap = 0.09, used = Object.keys(FIOS).filter(f => items.some(x => x.tags.includes(f)));
    const total = items.length, span = Math.PI * 2 - gap * secs.length;
    const pos = {}; let a = -Math.PI / 2 + gap / 2; const arcs = [];
    for (const s of secs) {
      const its = items.filter(x => x.sec === s), a0 = a;
      its.forEach((x, i) => { const t = a + (i + 0.5) / its.length * (span * its.length / total); pos[x.id] = [cx + Math.cos(t) * R1, cy + Math.sin(t) * R1, t]; });
      a += span * its.length / total; arcs.push([s, a0, a]); a += gap;
    }
    const fpos = {}; used.forEach((f, i) => { const t = -Math.PI / 2 + (i + 0.5) / used.length * Math.PI * 2; fpos[f] = [cx + Math.cos(t) * R0, cy + Math.sin(t) * R0, t]; });
    const selItem = MAP.sel && items.find(x => x.id === MAP.sel), want = selItem ? selItem.tags : MAP.fio ? [MAP.fio] : null;
    const rel = new Set(want ? items.filter(x => x.tags.some(t => want.includes(t))).map(x => x.id) : []);
    const arcPath = (r, b0, b1) => { const p0 = [cx + Math.cos(b0) * r, cy + Math.sin(b0) * r], p1 = [cx + Math.cos(b1) * r, cy + Math.sin(b1) * r]; return `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 ${b1 - b0 > Math.PI ? 1 : 0} 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`; };
    let g = `<svg viewBox="0 0 ${S} ${S}" role="img" aria-label="Mapa das conexões: seções na borda, fios no centro">`;
    g += `<circle cx="${cx}" cy="${cy}" r="${R1 + 46}" fill="none" stroke="#211D17"/><circle cx="${cx}" cy="${cy}" r="${R0 + 34}" fill="none" stroke="#211D17" stroke-dasharray="2 5"/>`;
    // section arcs and names on the rim
    arcs.forEach(([s, b0, b1], i) => {
      g += `<path d="${arcPath(R1 + 14, b0, b1)}" fill="none" stroke="#5E574B" stroke-width="2"/>`;
      const id = "marc" + i, mid = (b0 + b1) / 2, flip = mid > 0 && mid < Math.PI;
      g += `<path id="${id}" d="${flip ? arcPath(R1 + 40, b1, b0).replace(" 0 1 ", " 0 0 ") : arcPath(R1 + 30, b0, b1)}" fill="none"/>`;
      g += `<text font-size="13" fill="#B8AE9E" letter-spacing="1.5"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${SECS[s][0].toUpperCase()}</textPath></text>`;
    });
    // threads: curves from each item to each of its fios
    const edges = [];
    for (const x of items) for (const f of x.tags) if (fpos[f]) {
      const p = pos[x.id], q = fpos[f], on = want ? (rel.has(x.id) && want.includes(f)) : false;
      const mx = cx + (p[0] + q[0] - 2 * cx) * 0.18, my = cy + (p[1] + q[1] - 2 * cy) * 0.18;
      edges.push([on, `<path d="M${p[0].toFixed(1)} ${p[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}" fill="none" stroke="${FIO_COL[f]}" stroke-width="${on ? 2 : 1}" opacity="${want ? (on ? 0.9 : 0.05) : 0.22}"/>`]);
    }
    g += edges.filter(e => !e[0]).map(e => e[1]).join("") + edges.filter(e => e[0]).map(e => e[1]).join("");
    // items on the rim
    for (const x of items) {
      const [px, py, t] = pos[x.id], me = x.id === MAP.sel, on = rel.has(x.id), dim = want && !on && !me;
      g += `<g class="mn" tabindex="0" role="button" data-map="${x.id}" aria-label="${esc(x.nome)}"><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${me ? 8 : on ? 6 : 4.5}" fill="${me ? "#FFB547" : on ? "#F2E9D8" : "#8A8172"}" opacity="${dim ? 0.3 : 1}"/><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="12" fill="transparent"/></g>`;
      if (me || (on && rel.size <= 26)) {
        const out = t > Math.PI / 2 && t < Math.PI * 1.5, lx = px + Math.cos(t) * 12, ly = py + Math.sin(t) * 12, deg = t * 180 / Math.PI + (out ? 180 : 0);
        g += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="${me ? 13 : 11}" fill="${me ? "#FFB547" : "#EDE6D8"}" text-anchor="${out ? "end" : "start"}" dominant-baseline="middle" transform="rotate(${deg.toFixed(1)} ${lx.toFixed(1)} ${ly.toFixed(1)})" pointer-events="none">${esc(x.nome.length > 34 ? x.nome.slice(0, 33) + "…" : x.nome)}</text>`;
      }
    }
    // the threads in the middle
    for (const f of used) {
      const [fx, fy] = fpos[f], on = want && want.includes(f), dim = want && !on;
      const n = items.filter(x => x.tags.includes(f)).length;
      g += `<g class="mf" tabindex="0" role="button" data-fio="${f}" aria-label="${FIOS[f]}"><circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="${5 + Math.sqrt(n) * 2.2}" fill="${FIO_COL[f]}" opacity="${dim ? 0.25 : 0.95}"/>`;
      const out = fx < cx; g += `<text x="${(fx + (out ? -1 : 1) * (10 + Math.sqrt(n) * 2.2)).toFixed(1)}" y="${fy.toFixed(1)}" font-size="12" fill="${dim ? "#5E574B" : "#EDE6D8"}" text-anchor="${out ? "end" : "start"}" dominant-baseline="middle">${FIOS[f]}</text></g>`;
    }
    g += "</svg>";
    document.getElementById("cmap").innerHTML = g;
    const info = document.getElementById("cmapInfo");
    if (selItem) info.innerHTML = `<span class="lk-k">${SECS[selItem.sec][0]}</span><h3>${esc(selItem.nome)}</h3><p>Liga-se a ${rel.size - 1} outras coisas da página por ${selItem.tags.length} ${selItem.tags.length === 1 ? "fio" : "fios"}: ${selItem.tags.map(t => `<b style="color:${FIO_COL[t]}">${FIOS[t]}</b>`).join(", ")}.</p>`;
    else if (MAP.fio) info.innerHTML = `<span class="lk-k">fio</span><h3 style="color:${FIO_COL[MAP.fio]}">${FIOS[MAP.fio]}</h3><p>${rel.size} coisas da página passam por este fio.</p>`;
    else info.innerHTML = `<p>Cada ponto na borda é uma coisa da página: um caso, um ponto da linha do tempo, um ativo, um achado, um remédio. No centro ficam os fios, os assuntos que elas têm em comum. Clique num ponto ou num fio para acender o que se liga a ele.</p>`;
  }
  document.getElementById("cmap").addEventListener("click", e => {
    const n = e.target.closest("[data-map]"), f = e.target.closest("[data-fio]");
    if (n) { MAP.sel = MAP.sel === n.dataset.map ? null : n.dataset.map; MAP.fio = null; renderMap(); if (MAP.sel) linkOpen(MAP.sel); }
    else if (f) { MAP.fio = MAP.fio === f.dataset.fio ? null : f.dataset.fio; MAP.sel = null; renderMap(); if (MAP.fio) linkOpen(null, MAP.fio); }
    else { MAP.sel = MAP.fio = null; renderMap(); }
  });
  document.getElementById("cmap").addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.closest("[data-map],[data-fio]")) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent("click", { bubbles: true })); } });
  // selecting something anywhere on the page lights it on the map too
  const _open = linkOpen; linkOpen = function (id, tag) { if (id) { MAP.sel = id; MAP.fio = null; } else if (tag) { MAP.fio = tag; MAP.sel = null; } renderMap(); return _open(id, tag); };
