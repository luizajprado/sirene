// guide for Carga Alostática: [term, text] in pt, en, es
(function () {
const T = [
["glossário", "glossary", "glosario"],
["Carga Alostática é um laboratório que transforma cada lugar do mundo em imagem e som a partir do que pesa na saúde mental de quem vive ali. Ele não mede pessoas: lê dados públicos de lugares.",
 "Allostatic Load is a laboratory that turns each place in the world into image and sound from what weighs on the mental health of the people who live there. It does not measure people: it reads public data about places.",
 "Carga Alostática es un laboratorio que transforma cada lugar del mundo en imagen y sonido a partir de lo que pesa en la salud mental de quien vive allí. No mide personas: lee datos públicos de lugares."],
["carga alostática", "allostatic load", "carga alostática"],
["O desgaste que o corpo acumula quando precisa se adaptar ao estresse por muito tempo (conceito de Bruce McEwen). Aqui, é o peso somado dos fatores de um lugar.",
 "The wear the body builds up when it has to adapt to stress for a long time (Bruce McEwen's concept). Here, it is the combined weight of a place's factors.",
 "El desgaste que el cuerpo acumula cuando tiene que adaptarse al estrés durante mucho tiempo (concepto de Bruce McEwen). Aquí, es el peso sumado de los factores de un lugar."],
["fatores", "factors", "factores"],
["O que pesa num lugar: desastres próximos (terremoto, incêndio, tempestade), calor, poluição do ar, ruído, luz e escuridão, guerra, violência, fome, deslocamento forçado e pressão econômica. Cuidado e esperança entram como contraponto e aliviam a carga.",
 "What weighs on a place: nearby disasters (earthquake, wildfire, storm), heat, air pollution, noise, light and darkness, war, violence, hunger, forced displacement and economic pressure. Care and hope come in as counterpoint and ease the load.",
 "Lo que pesa en un lugar: desastres cercanos (terremoto, incendio, tormenta), calor, contaminación del aire, ruido, luz y oscuridad, guerra, violencia, hambre, desplazamiento forzado y presión económica. El cuidado y la esperanza entran como contrapunto y alivian la carga."],
["mediadores", "mediators", "mediadores"],
["Substâncias do corpo que respondem ao ambiente: hormônios do estresse (cortisol, adrenalina, CRH), neurotransmissores (serotonina, dopamina, GABA, glutamato, acetilcolina, histamina), sinais de inflamação (interleucina-6, substância P) e de vínculo e alívio (ocitocina, beta-endorfina, anandamida). Cada fator puxa alguns deles, seguindo a literatura de psicobiologia do estresse.",
 "Substances in the body that respond to the environment: stress hormones (cortisol, adrenaline, CRH), neurotransmitters (serotonin, dopamine, GABA, glutamate, acetylcholine, histamine), signals of inflammation (interleukin-6, substance P) and of bonding and relief (oxytocin, beta-endorphin, anandamide). Each factor pulls on some of them, following the psychobiology-of-stress literature.",
 "Sustancias del cuerpo que responden al ambiente: hormonas del estrés (cortisol, adrenalina, CRH), neurotransmisores (serotonina, dopamina, GABA, glutamato, acetilcolina, histamina), señales de inflamación (interleucina-6, sustancia P) y de vínculo y alivio (oxitocina, beta-endorfina, anandamida). Cada factor activa algunos de ellos, siguiendo la literatura de psicobiología del estrés."],
["cor e Hz", "colour and Hz", "color y Hz"],
["Cada mediador tem uma cor fixa e uma frequência. A frequência vem da massa molecular, levada por oitavas até o som audível. A imagem mistura as cores dos mediadores que mais pesam no lugar; o som toca as frequências deles ao mesmo tempo.",
 "Each mediator has a fixed colour and a frequency. The frequency comes from its molecular mass, folded by octaves into audible sound. The image blends the colours of the mediators that weigh most on the place; the sound plays their frequencies together.",
 "Cada mediador tiene un color fijo y una frecuencia. La frecuencia viene de la masa molecular, llevada por octavas hasta el sonido audible. La imagen mezcla los colores de los mediadores que más pesan en el lugar; el sonido toca sus frecuencias a la vez."],
["agora", "now", "ahora"],
["Um único organismo cresce sobre o mapa do mundo onde há alertas reais de desastre (GDACS). Ele nunca recomeça, guarda cicatrizes dos alertas e desacelera do lado do planeta onde é noite.",
 "A single organism grows over the world map where there are real disaster alerts (GDACS). It never restarts, keeps scars from the alerts and slows down on the side of the planet where it is night.",
 "Un único organismo crece sobre el mapa del mundo donde hay alertas reales de desastre (GDACS). Nunca reinicia, guarda cicatrices de las alertas y desacelera en el lado del planeta donde es de noche."],
["figuras", "figures", "figuras"],
["Cada lugar vira uma figura em movimento, em dois motores: a nebulosa (nuvem de cor) e a rede (reação-difusão). A lista ao lado ordena os lugares do maior peso para o menor.",
 "Each place becomes a moving figure, in two engines: the nebula (a cloud of colour) and the network (reaction-diffusion). The list alongside orders places from heaviest to lightest.",
 "Cada lugar se vuelve una figura en movimiento, en dos motores: la nebulosa (nube de color) y la red (reacción-difusión). La lista al lado ordena los lugares del mayor peso al menor."],
["reprise 72 h", "replay 72 h", "repetición 72 h"],
["Os alertas das últimas 72 horas passam de novo, acelerados, na ordem em que aconteceram.",
 "The alerts of the last 72 hours play again, sped up, in the order they happened.",
 "Las alertas de las últimas 72 horas pasan de nuevo, aceleradas, en el orden en que ocurrieron."],
["retrato e som", "portrait and sound", "retrato y sonido"],
["O lugar como tinta na água: os mediadores soltam cor que se espalha e se dissipa. Ao lado, a cimática (figuras de Chladni) desenha as mesmas frequências, e o som do lugar toca sem parar até você desligar. O retrato também pode ser lido como partitura.",
 "The place as ink in water: the mediators release colour that spreads and fades. Alongside, the cymatics (Chladni figures) draw the same frequencies, and the place's sound plays until you turn it off. The portrait can also be read as a score.",
 "El lugar como tinta en el agua: los mediadores sueltan color que se esparce y se disipa. Al lado, la cimática (figuras de Chladni) dibuja las mismas frecuencias, y el sonido del lugar suena sin parar hasta que lo apagas. El retrato también puede leerse como partitura."],
["cimática", "cymatics", "cimática"],
["Numa placa que vibra, a areia se junta nos pontos parados e desenha linhas. Cada frequência vira um desses desenhos, e eles se somam.",
 "On a vibrating plate, sand gathers at the still points and draws lines. Each frequency becomes one of these drawings, and they add up.",
 "En una placa que vibra, la arena se junta en los puntos quietos y dibuja líneas. Cada frecuencia se vuelve uno de esos dibujos, y se suman."],
["buscar lugar e lugares de risco", "place search and risk places", "buscar lugar y lugares de riesgo"],
["Você pode buscar qualquer cidade, região ou país. Os lugares em destaque não são escolhidos à mão: são ordenados pela carga calculada e, quando a coleta automática roda, entram os países de maior risco humanitário no índice INFORM.",
 "You can search any city, region or country. The highlighted places are not hand-picked: they are ordered by computed load, and when the automatic collection runs, the countries with the highest humanitarian risk on the INFORM index come in.",
 "Puedes buscar cualquier ciudad, región o país. Los lugares destacados no se eligen a mano: se ordenan por la carga calculada y, cuando corre la recolección automática, entran los países de mayor riesgo humanitario en el índice INFORM."],
["método", "method", "método"],
["O modelo matemático (Gray-Scott, reação-difusão), as regras que traduzem dados em forma, cor e som, e a tabela com os dados brutos.",
 "The mathematical model (Gray-Scott, reaction-diffusion), the rules that turn data into form, colour and sound, and the table of raw data.",
 "El modelo matemático (Gray-Scott, reacción-difusión), las reglas que traducen datos en forma, color y sonido, y la tabla con los datos brutos."],
["limites", "limits", "límites"],
["As ligações entre fatores e mediadores descrevem tendências em populações. Nada aqui mede o corpo de ninguém nem faz diagnóstico.",
 "The links between factors and mediators describe trends in populations. Nothing here measures anyone's body or makes a diagnosis.",
 "Las relaciones entre factores y mediadores describen tendencias en poblaciones. Nada aquí mide el cuerpo de nadie ni hace diagnóstico."],
];
const D = window.I18N_DICT;
for (const r of T) { D.en[r[0]] = r[1]; D.es[r[0]] = r[2]; }
const FOOT = ('Cor e som representam estados do corpo; não agem sobre ele. Nada aqui é diagnóstico ou tratamento.', 'Colour and sound represent states of the body; they do not act on it. Nothing here is diagnosis or treatment.', 'El color y el sonido representan estados del cuerpo; no actúan sobre él. Nada aquí es diagnóstico ni tratamiento.');
D.en[FOOT[0]] = FOOT[1]; D.es[FOOT[0]] = FOOT[2];
const partes = [];
for (let i = 2; i < T.length; i += 2) partes.push([T[i][0], T[i + 1][0]]);
const P = window.GLOSS["_partes"]; D.en[P[0]] = P[2]; D.es[P[0]] = P[4];
window.GUIDE = { titulo: T[0][0], intro: T[1][0], rodape: FOOT[0], groups: [{ nome: P[0], items: partes }].concat(window.GLOSS_USE([["_med", ["ADR","NOR","COR","CRH","GLU","IL6","SUBP","HIS","ACH","SER","DOP","GABA","MEL","GRE","OXT","AVP","END","ANA"]], ["_conc", ["carga","alostase","hpa","psico","neuro","horm","infl","circ","fator","contra"]], ["_som", ["massa","hz","oitava","cima","rd","nebu","tinta","partitura","comp"]], ["_dados", ["gdacs","eqwftc","inform","pm","db","ipc","meteo","utc","coleta"]]])) };
})();
