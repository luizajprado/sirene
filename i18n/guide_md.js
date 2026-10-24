// guide for the Mandala do Inconsciente: [term, text] in pt, en, es
(function () {
const T = [
["glossário", "glossary", "glosario"],
["A Mandala do Inconsciente é uma obra pessoal: ela transforma o que você procura na internet em uma mandala de cor, forma e som. Tudo acontece no seu navegador e nada é enviado.",
 "The Mandala of the Unconscious is a personal work: it turns what you search for online into a mandala of colour, form and sound. Everything happens in your browser and nothing is sent.",
 "La Mandala del Inconsciente es una obra personal: transforma lo que buscas en internet en una mandala de color, forma y sonido. Todo ocurre en tu navegador y nada se envía."],
["de onde vêm as buscas", "where the searches come from", "de dónde vienen las búsquedas"],
["Do seu histórico de buscas exportado do Google (Takeout) ou de palavras que você escreve, uma por linha.",
 "From your search history exported from Google (Takeout) or from words you write, one per line.",
 "De tu historial de búsquedas exportado de Google (Takeout) o de palabras que escribes, una por línea."],
["temas", "themes", "temas"],
["Cada palavra é comparada a 10 temas: medo e alerta, sono, tristeza e luto, trabalho e dinheiro, corpo e dor, comida e fome, violência e notícias, vínculo e amor, desejo e projeto, calma e cuidado. A barra mostra quanto de cada tema apareceu.",
 "Each word is matched against 10 themes: fear and alarm, sleep, sadness and grief, work and money, body and pain, food and hunger, violence and news, bond and love, desire and plans, calm and care. The bar shows how much of each theme appeared.",
 "Cada palabra se compara con 10 temas: miedo y alerta, sueño, tristeza y duelo, trabajo y dinero, cuerpo y dolor, comida y hambre, violencia y noticias, vínculo y amor, deseo y proyecto, calma y cuidado. La barra muestra cuánto de cada tema apareció."],
["neurotransmissores", "neurotransmitters", "neurotransmisores"],
["Cada tema puxa substâncias do corpo ligadas a ele: medo puxa noradrenalina e cortisol; vínculo, ocitocina; calma, GABA; desejo, dopamina. Elas decidem a mandala.",
 "Each theme pulls on substances in the body linked to it: fear pulls noradrenaline and cortisol; bond, oxytocin; calm, GABA; desire, dopamine. They decide the mandala.",
 "Cada tema activa sustancias del cuerpo ligadas a él: el miedo activa noradrenalina y cortisol; el vínculo, oxitocina; la calma, GABA; el deseo, dopamina. Ellas deciden la mandala."],
["anéis, pétalas e eixos", "rings, petals and axes", "anillos, pétalos y ejes"],
["Cada anel (até 8) é um neurotransmissor, com a cor dele e o som na frequência tirada da massa molecular. Quanto mais pesa, mais forte o anel; as pétalas dependem da frequência e dos eixos. O número de eixos de simetria vem da variedade de temas.",
 "Each ring (up to 8) is a neurotransmitter, in its colour and sounding at the frequency taken from its molecular mass. The more it weighs, the stronger the ring; the petals depend on the frequency and the axes. The number of symmetry axes comes from the variety of themes.",
 "Cada anillo (hasta 8) es un neurotransmisor, con su color y su sonido en la frecuencia sacada de la masa molecular. Cuanto más pesa, más fuerte el anillo; los pétalos dependen de la frecuencia y de los ejes. El número de ejes de simetría viene de la variedad de temas."],
["de madrugada", "late at night", "de madrugada"],
["Quando o arquivo tem horário, a parte das buscas feitas entre 0 h e 5 h puxa noradrenalina e baixa a melatonina, porque buscar de madrugada aparece junto com ansiedade e depressão nos estudos.",
 "When the file has times, the share of searches made between midnight and 5 am pulls noradrenaline up and melatonin down, because late-night searching shows up alongside anxiety and depression in the studies.",
 "Cuando el archivo tiene horario, la parte de búsquedas hechas entre las 0 h y las 5 h sube la noradrenalina y baja la melatonina, porque buscar de madrugada aparece junto a la ansiedad y la depresión en los estudios."],
["como quero me sentir", "how I want to feel", "cómo quiero sentirme"],
["Escolha ou escreva um estado, como calma, foco ou menos tesão, e o tempo da viagem. A mandala vai do seu estado de agora até esse, e o som de agora se cruza com o do destino. Esconder menu deixa só a mandala na tela (tecla H; Esc volta).",
 "Choose or write a state, such as calm, focus or less arousal, and the length of the journey. The mandala moves from your current state to that one, and the sound of now crosses into the sound of the destination. Hide menu leaves only the mandala on screen (H key; Esc brings it back).",
 "Elige o escribe un estado, como calma, enfoque o menos deseo, y el tiempo del viaje. La mandala va de tu estado de ahora hasta ese, y el sonido de ahora se cruza con el del destino. Ocultar menú deja solo la mandala en pantalla (tecla H; Esc vuelve)."],
["ouvir e modular", "listen and modulate", "escuchar y modular"],
["Ouvir liga o som contínuo da mandala. Modular faz a mandala respirar devagar com você, e em cerca de três minutos a carga cai e o cuidado cresce na forma e no som.",
 "Listen turns on the mandala's continuous sound. Modulate makes the mandala breathe slowly with you, and over about three minutes the load falls and care grows in form and sound.",
 "Escuchar enciende el sonido continuo de la mandala. Modular hace que la mandala respire despacio contigo, y en unos tres minutos la carga baja y el cuidado crece en la forma y el sonido."],
["outros sinais", "other signals", "otras señales"],
["Opcionais: horas de sono, tensão no corpo, contato com quem te faz bem, movimento, ruído do ambiente (microfone) e ar e calor de onde você está (localização). Só são usados se você permitir.",
 "Optional: hours of sleep, tension in the body, contact with people who do you good, movement, ambient noise (microphone) and air and heat where you are (location). They are only used if you allow them.",
 "Opcionales: horas de sueño, tensión en el cuerpo, contacto con quien te hace bien, movimiento, ruido del ambiente (micrófono) y aire y calor de donde estás (ubicación). Solo se usan si lo permites."],
["guardar e arquivo", "save and archive", "guardar y archivo"],
["Guardar salva só a imagem, neste navegador. As buscas nunca são guardadas.",
 "Save keeps only the image, in this browser. Searches are never stored.",
 "Guardar salva solo la imagen, en este navegador. Las búsquedas nunca se guardan."],
["base científica", "scientific basis", "base científica"],
["Estudos da Universidade de Rochester (Zhang et al. e Zaman et al.) com estudantes mostraram que o ritmo e os temas das buscas acompanham ansiedade e depressão. A mandala usa isso como forma e som, não como diagnóstico.",
 "University of Rochester studies (Zhang et al. and Zaman et al.) with students showed that the rhythm and themes of searches track anxiety and depression. The mandala uses this as form and sound, not as a diagnosis.",
 "Estudios de la Universidad de Rochester (Zhang et al. y Zaman et al.) con estudiantes mostraron que el ritmo y los temas de las búsquedas acompañan la ansiedad y la depresión. La mandala usa esto como forma y sonido, no como diagnóstico."],
];
const D = window.I18N_DICT;
for (const r of T) { D.en[r[0]] = r[1]; D.es[r[0]] = r[2]; }
const FOOT = ('Cor e som representam estados do corpo; não agem sobre ele. Nada aqui é diagnóstico ou tratamento.', 'Colour and sound represent states of the body; they do not act on it. Nothing here is diagnosis or treatment.', 'El color y el sonido representan estados del cuerpo; no actúan sobre él. Nada aquí es diagnóstico ni tratamiento.');
D.en[FOOT[0]] = FOOT[1]; D.es[FOOT[0]] = FOOT[2];
const partes = [];
for (let i = 2; i < T.length; i += 2) partes.push([T[i][0], T[i + 1][0]]);
const P = window.GLOSS["_partes"]; D.en[P[0]] = P[2]; D.es[P[0]] = P[4];
window.GUIDE = { titulo: T[0][0], intro: T[1][0], rodape: FOOT[0], groups: [{ nome: P[0], items: partes }].concat(window.GLOSS_USE([["_md", ["takeout","tema","anel","petala","eixo","madru","modular","intencao","cruz"]], ["_med", ["ADR","NOR","COR","CRH","GLU","IL6","SUBP","HIS","ACH","SER","DOP","GABA","MEL","GRE","OXT","AVP","END","ANA","PRL"]], ["_conc", ["neuro","horm","hpa","circ"]], ["_som", ["massa","hz","oitava"]]])) };
})();
