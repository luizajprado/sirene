// Busca os dados da Carga Alostática e calcula os índices que substituem os da bolsa. Usado pela página e pelo popup.
const SIRENE_URL = "https://luizajprado.github.io/sirene/dados.json";
const TROCAS = [
  // [padrão na página, rótulo novo, campo da Carga Alostática, chave da série, lugar ou null para a média mundial]
  [/\bIbovespa\b/gi, "Aflição São Paulo", "aflicao_coletiva", "ANSI", "São Paulo"],
  [/\bS&(?:amp;)?P\s?500\b/g, "Aflição mundial", "aflicao_coletiva", "ANSI", null],
  [/\bDow Jones\b/g, "Violência mundial", "violencia", "VIOL", null],
  [/\bNasdaq\b/gi, "Fome mundial", "fome", "FOME", null],
  [/\b(?:FTSE 100|Nikkei 225|Nikkei|DAX)\b/g, "Deslocamento mundial", "deslocamento", "DESL", null],
];

async function indicesSirene() {
  const cache = await chrome.storage.local.get(["dados", "quando"]);
  let dados = cache.dados;
  if (!dados || Date.now() - (cache.quando || 0) > 30 * 60e3) {
    try {
      dados = await (await fetch(SIRENE_URL, { cache: "no-store" })).json();
      await chrome.storage.local.set({ dados, quando: Date.now() });
    } catch (e) { if (!dados) return null; }
  }
  const media = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
  const valor = (lugares, campo, lugar) => media(lugares.filter(l => !lugar || l.nome === lugar).map(l => l[campo] && l[campo].i).filter(x => x != null));
  const serie = dados.serie || [];
  const antes = serie.length > 2 ? serie[Math.max(0, serie.length - 25)].lugares : null;
  return TROCAS.map(([re, rotulo, campo, chave, lugar]) => {
    const v = valor(dados.lugares || [], campo, lugar);
    let d = null;
    if (antes) {
      const v0 = media(Object.entries(antes).filter(([n]) => !lugar || n === lugar).map(([, r]) => r[chave]).filter(x => x != null));
      if (v0) d = (v - v0) / v0 * 100;
    }
    return { re, rotulo, v, d };
  }).filter(x => x.v != null);
}

function textoIndice(x) {
  const n = (y, c) => y.toLocaleString("pt-BR", { minimumFractionDigits: c, maximumFractionDigits: c });
  return `${x.rotulo} ${n(x.v * 100, 1)}` + (x.d == null ? "" : ` ${x.d > 0.3 ? "▲" : x.d < -0.3 ? "▼" : "■"}${n(Math.abs(x.d), 1)}%`);
}
