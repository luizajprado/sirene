// Troca os nomes dos índices da bolsa, no texto da página, pelos índices de aflição da Carga Alostática.
(async () => {
  const { ligada = true } = await chrome.storage.local.get("ligada");
  if (!ligada) return;
  const indices = await indicesSirene();
  if (!indices || !indices.length) return;
  const pular = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "NOSCRIPT", "CODE"]);

  function trocar(no) {
    if (no.nodeType !== Node.TEXT_NODE || !no.parentElement || pular.has(no.parentElement.tagName) || no.parentElement.closest("[data-sirene]")) return;
    const t = no.nodeValue;
    const acertos = indices.filter(x => { x.re.lastIndex = 0; return x.re.test(t); });
    if (!acertos.length) return;
    const frag = document.createDocumentFragment();
    let resto = t;
    while (resto) {
      let primeiro = null;
      for (const x of acertos) { x.re.lastIndex = 0; const m = x.re.exec(resto); if (m && (!primeiro || m.index < primeiro.m.index)) primeiro = { x, m }; }
      if (!primeiro) { frag.append(resto); break; }
      frag.append(resto.slice(0, primeiro.m.index));
      const s = document.createElement("span");
      s.dataset.sirene = "1";
      s.textContent = textoIndice(primeiro.x);
      s.title = `Onde estava "${primeiro.m[0]}". Observatório · Carga Alostática, Luiza Jesus do Prado. Dados públicos agregados por lugar, não medem ninguém.`;
      s.style.cssText = "background:#FFB547;color:#0A0907;padding:0 .2em;font-family:ui-monospace,Menlo,monospace;font-size:.92em;";
      frag.append(s);
      resto = resto.slice(primeiro.m.index + primeiro.m[0].length);
    }
    no.replaceWith(frag);
  }
  function varrer(raiz) {
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    const nos = []; while (w.nextNode()) nos.push(w.currentNode);
    nos.forEach(trocar);
  }
  varrer(document.body);
  let pendente = null;
  new MutationObserver(ms => {
    if (pendente) return;
    pendente = setTimeout(() => { pendente = null; ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 ? varrer(n) : trocar(n))); }, 400);
  }).observe(document.body, { childList: true, subtree: true });
})();
