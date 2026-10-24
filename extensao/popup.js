(async () => {
  const caixa = document.getElementById("ligada");
  const { ligada = true } = await chrome.storage.local.get("ligada");
  caixa.checked = ligada;
  caixa.addEventListener("change", () => chrome.storage.local.set({ ligada: caixa.checked }));
  const indices = await indicesSirene();
  const lista = document.getElementById("lista");
  lista.textContent = "";
  if (!indices) { lista.innerHTML = "<li>sem conexão com a Carga Alostática</li>"; return; }
  for (const x of indices) { const li = document.createElement("li"); li.textContent = textoIndice(x); lista.append(li); }
})();
