// guide for the Observatório: [term, text] in pt, en, es
(function () {
const T = [
["glossário", "glossary", "glosario"],
["O Observatório lê saúde mental, ciência e dinheiro com a cara de um terminal de bolsa. A ideia é mostrar, para cada acontecimento no mundo, quem sofre, quem lucra, o que a ciência sabe e o que ajuda.",
 "The Observatory reads mental health, science and money through the look of a stock-market terminal. The idea is to show, for each event in the world, who suffers, who profits, what science knows and what helps.",
 "El Observatorio lee salud mental, ciencia y dinero con la apariencia de un terminal de bolsa. La idea es mostrar, para cada acontecimiento en el mundo, quién sufre, quién lucra, qué sabe la ciencia y qué ayuda."],
["casos", "cases", "casos"],
["Acontecimentos atuais contados como uma corrente de seis elos: o acontecimento, o efeito na saúde mental, a resposta do mercado, o que a ciência mostra (e por quê), quem é mais atingido e o que ajuda. Cada elo tem fonte.",
 "Current events told as a chain of six links: the event, the effect on mental health, the market response, what science shows (and why), who is hit hardest and what helps. Every link is sourced.",
 "Acontecimientos actuales contados como una cadena de seis eslabones: el acontecimiento, el efecto en la salud mental, la respuesta del mercado, lo que muestra la ciencia (y por qué), a quién alcanza más y lo que ayuda. Cada eslabón tiene fuente."],
["linha do tempo", "timeline", "línea de tiempo"],
["O que aconteceu, o que acontece agora e o que pode vir a curto prazo (até 6 meses), médio (até 5 anos) e longo (até 2050), em faixas: saúde mental, clima, guerra e fome, dinheiro, ciência e população. Ponto cheio: aconteceu. Ponto com halo: acontecendo. Ponto vazado: previsão ou projeção de quem a assina.",
 "What happened, what is happening and what may come in the short (up to 6 months), medium (up to 5 years) and long term (up to 2050), in lanes: mental health, climate, war and hunger, money, science and population. Solid dot: happened. Dot with halo: happening. Hollow dot: a forecast or projection by whoever signs it.",
 "Lo que pasó, lo que pasa ahora y lo que puede venir a corto plazo (hasta 6 meses), medio (hasta 5 años) y largo (hasta 2050), en franjas: salud mental, clima, guerra y hambre, dinero, ciencia y población. Punto lleno: ocurrió. Punto con halo: en curso. Punto hueco: previsión o proyección de quien la firma."],
["pregão e ativos", "floor and assets", "sesión y activos"],
["Cada linha é um ativo de aflição de um lugar, de 0 a 100. O código junta o que mede e onde: COR é o cortisol do lugar (a carga total), ANSI a aflição coletiva em buscas e posts, VIOL violência, GUER guerra, FOME fome, DESL deslocamento, ECON pressão econômica e CUID cuidado, o contraponto. COR.SAO é o cortisol de São Paulo. ▲ é piora; ▼ é alívio.",
 "Each row is an affliction asset of a place, from 0 to 100. The code combines what it measures and where: COR is the place's cortisol (total load), ANSI collective distress in searches and posts, VIOL violence, GUER war, FOME hunger, DESL displacement, ECON economic pressure and CUID care, the counterpoint. COR.SAO is São Paulo's cortisol. ▲ means worse; ▼ means relief.",
 "Cada fila es un activo de aflicción de un lugar, de 0 a 100. El código une lo que mide y dónde: COR es el cortisol del lugar (la carga total), ANSI la aflicción colectiva en búsquedas y publicaciones, VIOL violencia, GUER guerra, FOME hambre, DESL desplazamiento, ECON presión económica y CUID cuidado, el contrapunto. COR.SAO es el cortisol de São Paulo. ▲ es empeora; ▼ es alivio."],
["índices", "indices", "índices"],
["Os do dinheiro vêm do mercado: Ibovespa, S&P 500 e VIX, o índice do medo dos mercados. Os do sofrimento são médias dos lugares: cortisol global, fome e cuidado.",
 "The money ones come from the market: Ibovespa, S&P 500 and VIX, the market fear index. The suffering ones are averages across places: global cortisol, hunger and care.",
 "Los del dinero vienen del mercado: Ibovespa, S&P 500 y VIX, el índice del miedo de los mercados. Los del sufrimiento son medias de los lugares: cortisol global, hambre y cuidado."],
["boletim e robô", "newswire and bot", "boletín y bot"],
["Notas escritas na língua do mercado, cruzando dinheiro e pessoas no mesmo dia. O robô publica essas notas no Bluesky quando a bolsa mexe forte ou um ativo dispara.",
 "Notes written in the language of the market, crossing money and people on the same day. The bot posts them on Bluesky when markets move hard or an asset surges.",
 "Notas escritas en la lengua del mercado, cruzando dinero y personas el mismo día. El bot las publica en Bluesky cuando la bolsa se mueve fuerte o un activo se dispara."],
["pregão sonoro", "sound floor", "sesión sonora"],
["Cada ativo em alta soa na frequência do mediador químico que ele mobiliza; o VIX é o grave por baixo. Toca até você desligar.",
 "Each rising asset sounds at the frequency of the chemical mediator it mobilises; the VIX is the bass underneath. It plays until you turn it off.",
 "Cada activo al alza suena en la frecuencia del mediador químico que moviliza; el VIX es el grave de fondo. Suena hasta que lo apagas."],
["zona de simulação", "simulation zone", "zona de simulación"],
["Escolha respostas (renda, comida, cessar-fogo, apoio psicológico, áreas verdes) e veja como os ativos cairiam. Os pesos seguem a direção das evidências, não são previsão.",
 "Choose responses (income, food, ceasefire, psychological support, green space) and see how the assets would fall. The weights follow the direction of the evidence; they are not a forecast.",
 "Elige respuestas (ingresos, comida, alto el fuego, apoyo psicológico, áreas verdes) y mira cómo bajarían los activos. Los pesos siguen la dirección de la evidencia; no son previsión."],
["pesquisa ao vivo", "live research", "investigación en vivo"],
["Artigos científicos da semana por tema (Europe PMC) e ensaios clínicos em saúde mental recrutando agora (ClinicalTrials.gov), com quanto deles é financiado pela indústria.",
 "This week's scientific papers by topic (Europe PMC) and mental health clinical trials recruiting now (ClinicalTrials.gov), with how much of them industry funds.",
 "Artículos científicos de la semana por tema (Europe PMC) y ensayos clínicos en salud mental reclutando ahora (ClinicalTrials.gov), con cuánto de ellos financia la industria."],
["o que pouco chega ao público", "what rarely reaches the public", "lo que poco llega al público"],
["Achados verificados que quase não circulam, como antidepressivos ISRS e fraturas, explicando o mecanismo e quem é afetado. Não é para demonizar remédios: nunca pare um tratamento sem quem prescreveu.",
 "Verified findings that barely circulate, such as SSRI antidepressants and fractures, explaining the mechanism and who is affected. It is not meant to demonise medicines: never stop a treatment without the prescriber.",
 "Hallazgos verificados que casi no circulan, como antidepresivos ISRS y fracturas, explicando el mecanismo y a quién afecta. No es para demonizar medicamentos: nunca dejes un tratamiento sin quien lo recetó."],
["remédios e moléculas", "medicines and molecules", "medicamentos y moléculas"],
["Para cada remédio, a fórmula e a massa (PubChem), o som da molécula e os efeitos mais notificados à FDA (openFDA). Notificação não prova causa.",
 "For each medicine, its formula and mass (PubChem), the sound of the molecule and the effects most reported to the FDA (openFDA). A report does not prove cause.",
 "Para cada medicamento, la fórmula y la masa (PubChem), el sonido de la molécula y los efectos más notificados a la FDA (openFDA). Una notificación no prueba la causa."],
["quem recolhe", "who collects", "quién recauda"],
["As mesmas crises vistas dos dois lados: o que fizeram às mentes e quem ganhou dinheiro no mesmo período. É uma justaposição, não acusação.",
 "The same crises seen from both sides: what they did to minds and who made money in the same period. It is a juxtaposition, not an accusation.",
 "Las mismas crisis vistas desde los dos lados: lo que hicieron a las mentes y quién ganó dinero en el mismo periodo. Es una yuxtaposición, no una acusación."],
["demonstração e ao vivo", "demo and live", "demostración y en vivo"],
["Aqui os valores são de demonstração. Na versão do GitHub, uma coleta automática atualiza tudo a cada hora com dados públicos.",
 "Here the values are a demo. In the GitHub version, an automatic collection updates everything every hour with public data.",
 "Aquí los valores son de demostración. En la versión de GitHub, una recolección automática actualiza todo cada hora con datos públicos."],
];
const D = window.I18N_DICT;
for (const r of T) { D.en[r[0]] = r[1]; D.es[r[0]] = r[2]; }
const FOOT = ('Cor e som representam estados do corpo; não agem sobre ele. Nada aqui é diagnóstico ou tratamento.', 'Colour and sound represent states of the body; they do not act on it. Nothing here is diagnosis or treatment.', 'El color y el sonido representan estados del cuerpo; no actúan sobre él. Nada aquí es diagnóstico ni tratamiento.');
D.en[FOOT[0]] = FOOT[1]; D.es[FOOT[0]] = FOOT[2];
const partes = [];
for (let i = 2; i < T.length; i += 2) partes.push([T[i][0], T[i + 1][0]]);
const P = window.GLOSS["_partes"]; D.en[P[0]] = P[2]; D.es[P[0]] = P[4];
window.GUIDE = { titulo: T[0][0], intro: T[1][0], rodape: FOOT[0], groups: [{ nome: P[0], items: partes }].concat(window.GLOSS_USE([["_cod", ["cCOR","cANSI","cVIOL","cGUER","cFOME","cDESL","cECON","cCUID","cSUF"]], ["_merc", ["ativo","pregao","cotacao","ibov","sp","vix","liquidez"]], ["_cien", ["meta","obs","rct","ensaio","rr","placebo","farmaco","faers","pubchem","epmc","ctgov","isrs","irsn","benzo","antipsi","descont","tarja"]], ["_med", ["ADR","NOR","COR","GLU","IL6","SER","DOP","GABA","MEL","GRE","OXT"]], ["_conc", ["carga","hpa","psico","infl","contra"]], ["_mund", ["elnino","deslint","ipc","orgs","coleta"]], ["_som", ["massa","hz","oitava"]]])) };
})();
(function () { const D = window.I18N_DICT, G = window.GUIDE;
const row = ["conexões", "Clique em qualquer coisa (um caso, um ponto da linha do tempo, um ativo, um achado, um remédio, uma linha de quem recolhe) e abre ao lado tudo o que toca no mesmo assunto nas outras seções. Os assuntos são fios, como calor, fome ou antidepressivos; clicar num fio mostra tudo o que passa por ele. Estar no mesmo fio não quer dizer que uma coisa causou a outra.",
 "connections", "Click anything (a case, a timeline point, an asset, a finding, a medicine, a row in who collects) and everything touching the same subject in other sections opens alongside. Subjects are threads, such as heat, hunger or antidepressants; clicking a thread shows everything that runs through it. Being on the same thread does not mean one thing caused the other.",
 "conexiones", "Haz clic en cualquier cosa (un caso, un punto de la línea de tiempo, un activo, un hallazgo, un medicamento, una fila de quién recauda) y se abre al lado todo lo que toca el mismo asunto en las otras secciones. Los asuntos son hilos, como calor, hambre o antidepresivos; al hacer clic en un hilo se ve todo lo que pasa por él. Estar en el mismo hilo no quiere decir que una cosa causó la otra."];
D.en[row[0]] = row[2]; D.en[row[1]] = row[3]; D.es[row[0]] = row[4]; D.es[row[1]] = row[5];
G.groups[0].items.splice(1, 0, [row[0], row[1]]);
})();
