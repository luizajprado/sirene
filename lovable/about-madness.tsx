import { Link } from "@tanstack/react-router";

import { ProjectPrev } from "@/components/project-prev";
import { Chapter, PosterVideo, ProjectHero } from "@/components/projects/section-kit";
import type { Project } from "@/data/projects";
import { useI18n, type Lang } from "@/lib/i18n";
import hero from "@/assets/madness-capa-sirene.jpg.asset.json";
import labAgora from "@/assets/madness-lab-agora.jpg.asset.json";
import labCimatica from "@/assets/madness-cimatica-mandala.jpg.asset.json";
import nebulosas from "@/assets/madness-nebulosas-estudos.jpg.asset.json";
import obsCasos from "@/assets/madness-observatorio-casos.jpg.asset.json";
import obsMapa from "@/assets/madness-observatorio-mapa.jpg.asset.json";
import obsConexoes from "@/assets/madness-observatorio-conexoes.jpg.asset.json";
import mandala from "@/assets/madness-mandala-do-inconsciente.jpg.asset.json";
import sireneSala from "@/assets/madness-sirene-sala.jpg.asset.json";
import sireneChao from "@/assets/madness-sirene-mandala-chao.jpg.asset.json";
import sireneTromso from "@/assets/madness-sirene-tromso.jpg.asset.json";
import sireneElevacao from "@/assets/madness-sirene-elevacao.jpg.asset.json";
import sireneVideo from "@/assets/madness-sirene-video.mp4.asset.json";
import mappingVideo from "@/assets/madness-mapping.mp4.asset.json";
import mappingPoster from "@/assets/madness-mapping-poster.jpg.asset.json";

type L = Record<Lang, string>;
type Img = { src: string; alt: string };
type Extra = "workLinks" | "sireneVideo" | "mappingVideo" | null;
type Ch = { key: string; title: L; texts: Record<Lang, string[]>; images: Img[]; extra: Extra };

const title: L = {
  en: "What Is Madness?",
  pt: "O que é a loucura?",
  es: "¿Qué es la locura?",
};

const lead: L = {
  en: "An investigation into suffering, power and the conditions of existence. What do we call madness? Where does the individual end and the world that makes them ill begin?",
  pt: "Uma investigação sobre o sofrimento, o poder e as condições de existência. O que chamamos de loucura? Onde termina o indivíduo e começa o mundo que o adoece?",
  es: "Una investigación sobre el sufrimiento, el poder y las condiciones de existencia. ¿Qué llamamos locura? ¿Dónde termina el individuo y empieza el mundo que lo enferma?",
};

const meta: L = {
  en: "Research · data\nLight & sound\nIn development since 2023",
  pt: "Pesquisa · dados\nLuz e som\nEm desenvolvimento desde 2023",
  es: "Investigación · datos\nLuz y sonido\nEn desarrollo desde 2023",
};

const ch: Ch[] = [
  {
    key: "investigation",
    title: { en: "The investigation", pt: "A investigação", es: "La investigación" },
    texts: {
      en: ["What Is Madness? is an artistic, scientific and technological investigation into the relations between mental health, conditions of existence and structures of power. It starts from the hypothesis that psychological suffering cannot be understood only as an individual phenomenon, separate from the social, political, economic, historical and environmental conditions in which life takes place.", "Human experience is crossed by forces we cannot always perceive directly: violence, hunger, war, precarity, racism, exclusion, isolation, climate change and material insecurity. These conditions do not only organise society. They also run through bodies, nervous systems, processes of adaptation and the possibilities of existing.", "By bringing together environmental and social data, neuroscience, biochemistry, image, light and sound, the project seeks to make some of these relations perceptible. Science provides instruments to observe what escapes immediate experience; art creates other ways to experience, interpret and question these phenomena.", "The research also turns to the history of psychiatry and to the practices of confinement that turned certain differences, behaviours and forms of suffering into grounds for exclusion. In dialogue with the anti-asylum movement, the Brazilian Psychiatric Reform and decolonial thought, the project asks who has the power to define normality, which lives are considered legitimate and which historical conditions make certain populations more vulnerable to suffering and to institutional violence.", "The question is no longer only what happens inside a person, but also what happens around them, to them and through them.", "From this perspective, madness is not presented as a universal, fixed category independent of context, but as a field of dispute between subjective experience, scientific knowledge, social conventions and relations of power. This does not mean reducing mental disorders to social conditions, but investigating how biological, environmental and historical factors combine in the production of suffering.", "The project unfolds into data visualisation systems, generative compositions, light and sound installations, mandalas, objects and interventions in public space. These works turn information into sensory experience and create correspondences between scales: from the molecular to the bodily, from the individual to the collective, from the territory to the planet.", "By moving the investigation from the clinic to the gallery and the street, the project also moves the question itself. The city is no longer only the setting where life happens; it becomes an active part of the conditions that shape it.", "What is madness? What do we call normality? And what happens when we examine not only those who fall ill, but also the world they are forced to live in?"],
      pt: ["O que é a loucura? é uma investigação artística, científica e tecnológica sobre as relações entre saúde mental, condições de existência e estruturas de poder. Parte da hipótese de que o sofrimento psíquico não pode ser compreendido apenas como fenômeno individual, separado das condições sociais, políticas, econômicas, históricas e ambientais em que a vida acontece.", "A experiência humana é atravessada por forças que nem sempre se percebem diretamente: violência, fome, guerra, precariedade, racismo, exclusão, isolamento, mudanças climáticas e insegurança material. Essas condições não organizam só a sociedade. Elas atravessam também os corpos, os sistemas nervosos, os processos de adaptação e as possibilidades de existir.", "Ao aproximar dados ambientais e sociais, neurociência, bioquímica, imagem, luz e som, o projeto busca tornar perceptíveis algumas dessas relações. A ciência dá instrumentos para observar o que escapa à experiência imediata; a arte cria outras formas de experimentar, interpretar e questionar esses fenômenos.", "A pesquisa se volta também à história da psiquiatria e às práticas de confinamento que transformaram diferenças, comportamentos e formas de sofrimento em justificativa para a exclusão. Em diálogo com a luta antimanicomial, a Reforma Psiquiátrica brasileira e o pensamento decolonial, o projeto pergunta quem tem o poder de definir a normalidade, quais vidas são consideradas legítimas e quais condições históricas tornam certas populações mais vulneráveis ao sofrimento e à violência institucional.", "A questão deixa de ser apenas o que acontece dentro de uma pessoa e passa a incluir o que acontece ao redor dela, sobre ela e através dela.", "Nessa perspectiva, a loucura não aparece como categoria universal, fixa e independente do contexto, mas como campo de disputa entre experiência subjetiva, conhecimento científico, convenções sociais e relações de poder. Isso não significa reduzir os transtornos mentais às condições sociais, e sim investigar como fatores biológicos, ambientais e históricos se articulam na produção do sofrimento.", "O projeto se desdobra em sistemas de visualização de dados, composições generativas, instalações de luz e som, mandalas, objetos e intervenções no espaço público. Essas obras transformam informação em experiência sensorial e criam correspondências entre escalas: do molecular ao corporal, do individual ao coletivo, do território ao planeta.", "Ao levar a investigação do espaço clínico para a galeria e para a rua, o projeto desloca também a própria pergunta. A cidade deixa de ser só o cenário onde a vida acontece e passa a ser parte ativa das condições que a constituem.", "O que é a loucura? O que chamamos de normalidade? E o que acontece quando examinamos não só quem adoece, mas também o mundo em que essas pessoas são obrigadas a viver?"],
      es: ["¿Qué es la locura? es una investigación artística, científica y tecnológica sobre las relaciones entre salud mental, condiciones de existencia y estructuras de poder. Parte de la hipótesis de que el sufrimiento psíquico no puede comprenderse solo como un fenómeno individual, separado de las condiciones sociales, políticas, económicas, históricas y ambientales en las que transcurre la vida.", "La experiencia humana está atravesada por fuerzas que no siempre se perciben directamente: violencia, hambre, guerra, precariedad, racismo, exclusión, aislamiento, cambio climático e inseguridad material. Estas condiciones no organizan solo la sociedad. También atraviesan los cuerpos, los sistemas nerviosos, los procesos de adaptación y las posibilidades de existir.", "Al acercar datos ambientales y sociales, neurociencia, bioquímica, imagen, luz y sonido, el proyecto busca hacer perceptibles algunas de estas relaciones. La ciencia da instrumentos para observar lo que escapa a la experiencia inmediata; el arte crea otras formas de experimentar, interpretar y cuestionar estos fenómenos.", "La investigación se vuelve también hacia la historia de la psiquiatría y las prácticas de encierro que convirtieron diferencias, comportamientos y formas de sufrimiento en justificación para la exclusión. En diálogo con la lucha antimanicomial, la Reforma Psiquiátrica brasileña y el pensamiento decolonial, el proyecto pregunta quién tiene el poder de definir la normalidad, qué vidas se consideran legítimas y qué condiciones históricas hacen a ciertas poblaciones más vulnerables al sufrimiento y a la violencia institucional.", "La cuestión deja de ser solo lo que ocurre dentro de una persona y pasa a incluir lo que ocurre a su alrededor, sobre ella y a través de ella.", "Desde esta perspectiva, la locura no aparece como una categoría universal, fija e independiente del contexto, sino como un campo de disputa entre experiencia subjetiva, conocimiento científico, convenciones sociales y relaciones de poder. Esto no significa reducir los trastornos mentales a las condiciones sociales, sino investigar cómo se articulan factores biológicos, ambientales e históricos en la producción del sufrimiento.", "El proyecto se despliega en sistemas de visualización de datos, composiciones generativas, instalaciones de luz y sonido, mandalas, objetos e intervenciones en el espacio público. Estas obras transforman información en experiencia sensorial y crean correspondencias entre escalas: de lo molecular a lo corporal, de lo individual a lo colectivo, del territorio al planeta.", "Al llevar la investigación del espacio clínico a la galería y a la calle, el proyecto desplaza también la propia pregunta. La ciudad deja de ser solo el escenario donde ocurre la vida y pasa a ser parte activa de las condiciones que la constituyen.", "¿Qué es la locura? ¿Qué llamamos normalidad? ¿Y qué ocurre cuando examinamos no solo a quienes enferman, sino también el mundo en el que se ven obligados a vivir?"],
    },
    images: [],
    extra: null,
  },
  {
    key: "axes",
    title: { en: "Five axes", pt: "Cinco eixos", es: "Cinco ejes" },
    texts: {
      en: ["The project is organised around five connected axes, so that it does not become a collection of separate subjects.", "1. The body as territory. The body is not an isolated unit: it is a biological system in permanent relation with its environment. Stress, adaptation, metabolism and the nervous system are the entry point to investigate how the conditions of existence affect physiology. In the project: the Allostatic Load lab, which links each factor to mediators of stress and care.", "2. The making of normality. Who defines what is normal, pathological or deviant? The history of the asylum, medicalisation and systems of classification show how knowledge about mental health is also shaped by institutional interests, inequality and exclusion. In the project: the critique of the asylum and the Masks, in dialogue with Frantz Fanon.", "3. The geography of suffering. Different territories produce different exposure to violence, precarity and environmental risk. Data make it possible to investigate these inequalities without treating suffering as a private failure of those who live it. In the project: the Observatory, which reads each event by place, and Sirene, which changes with the city where it is shown.", "4. Translating the invisible. Data, substances, frequencies and statistical relations become image, light, sound and movement. Visualisation is not only scientific illustration: it is a language for producing other forms of perception. In the project: cymatics, the light of Sirene and the Mandala of the Unconscious, in dialogue with Nise da Silveira.", "5. Returning to public space. By leaving the gallery and occupying the city, the research turns a question that seems individual into a collective one. Public space becomes a place where experience, knowledge and social responsibility meet. In the project: the projection-mapped videos and urban interventions, such as at the Minhocão."],
      pt: ["O projeto se organiza em cinco eixos que se conectam, sem virar uma coleção de assuntos independentes.", "1. O corpo como território. O corpo não é uma unidade isolada: é um sistema biológico em relação permanente com o ambiente. Estresse, adaptação, metabolismo e sistema nervoso são a entrada para investigar como as condições de existência repercutem na fisiologia. No projeto: o laboratório Carga Alostática, que liga cada fator a mediadores do estresse e do cuidado.", "2. A fabricação da normalidade. Quem define o que é normal, patológico ou desviante? A história manicomial, a medicalização e os mecanismos de classificação mostram como o conhecimento sobre saúde mental também é atravessado por interesses institucionais, desigualdades e exclusão. No projeto: a crítica ao manicômio e as Máscaras, em diálogo com Frantz Fanon.", "3. A geografia do sofrimento. Territórios diferentes produzem exposições diferentes à violência, à precariedade e aos riscos ambientais. Os dados permitem investigar essas desigualdades sem tratar o sofrimento como falha privada de quem o vive. No projeto: o Observatório, que lê cada acontecimento por lugar, e a Sirene, que muda conforme a cidade onde está.", "4. A tradução do invisível. Dados, substâncias, frequências e relações estatísticas viram imagem, luz, som e movimento. A visualização não é só ilustração científica: é linguagem para produzir outras formas de percepção. No projeto: a cimática, a luz da Sirene e a Mandala do Inconsciente, em diálogo com Nise da Silveira.", "5. A devolução ao espaço público. Ao sair da galeria e ocupar a cidade, a pesquisa transforma uma questão que parece individual em pergunta coletiva. O espaço público vira lugar de confronto entre experiência, conhecimento e responsabilidade social. No projeto: os vídeos em mapping e as intervenções urbanas, como no Minhocão."],
      es: ["El proyecto se organiza en cinco ejes conectados, sin convertirse en una colección de temas independientes.", "1. El cuerpo como territorio. El cuerpo no es una unidad aislada: es un sistema biológico en relación permanente con el ambiente. Estrés, adaptación, metabolismo y sistema nervioso son la entrada para investigar cómo las condiciones de existencia repercuten en la fisiología. En el proyecto: el laboratorio Carga Alostática, que vincula cada factor a mediadores del estrés y del cuidado.", "2. La fabricación de la normalidad. ¿Quién define lo que es normal, patológico o desviado? La historia manicomial, la medicalización y los mecanismos de clasificación muestran cómo el conocimiento sobre salud mental también está atravesado por intereses institucionales, desigualdades y exclusión. En el proyecto: la crítica al manicomio y las Máscaras, en diálogo con Frantz Fanon.", "3. La geografía del sufrimiento. Territorios distintos producen exposiciones distintas a la violencia, la precariedad y los riesgos ambientales. Los datos permiten investigar estas desigualdades sin tratar el sufrimiento como una falla privada de quien lo vive. En el proyecto: el Observatorio, que lee cada acontecimiento por lugar, y la Sirene, que cambia según la ciudad donde está.", "4. La traducción de lo invisible. Datos, sustancias, frecuencias y relaciones estadísticas se convierten en imagen, luz, sonido y movimiento. La visualización no es solo ilustración científica: es lenguaje para producir otras formas de percepción. En el proyecto: la cimática, la luz de la Sirene y el Mandala del Inconsciente, en diálogo con Nise da Silveira.", "5. La devolución al espacio público. Al salir de la galería y ocupar la ciudad, la investigación convierte una cuestión que parece individual en una pregunta colectiva. El espacio público se vuelve lugar de confrontación entre experiencia, conocimiento y responsabilidad social. En el proyecto: los videos en mapping y las intervenciones urbanas, como en el Minhocão."],
    },
    images: [],
    extra: "workLinks",
  },
  {
    key: "asylum",
    title: { en: "The asylum", pt: "O manicômio", es: "El manicomio" },
    texts: {
      en: ["For centuries the asylum was where society sent the people it did not want to see. In History of Madness (1961), Michel Foucault shows the poor, the unemployed and the 'mad' locked up together. In Brazil, at the Colônia hospital in Barbacena, at least 60,000 people died between the 1930s and the 1980s, and about 70% of those interned had no diagnosis of mental illness (Daniela Arbex, Holocausto Brasileiro, 2013).", "The label 'mad' has been used to set apart the poor, Black people, gender dissidents, migrants and those who disobey. The project turns the question around: not 'what is wrong with this person?' but 'what was done to them, and where do they live?'. Locking up the individual hides the cause. The project stands with the anti-asylum movement and Brazil's Psychiatric Reform (Law 10.216/2001)."],
      pt: ["Por séculos, o manicômio foi o lugar para onde a sociedade mandou quem ela não queria ver. Em História da loucura (1961), Michel Foucault mostra pobres, desempregados e 'loucos' trancados juntos. No Brasil, no Hospital Colônia de Barbacena, pelo menos 60 mil pessoas morreram entre os anos 1930 e 1980, e cerca de 70% das internadas não tinham diagnóstico de doença mental (Daniela Arbex, Holocausto Brasileiro, 2013).", "A categoria 'louco' serviu para separar quem é pobre, preto, dissidente de gênero, migrante ou quem desobedece. O projeto inverte a pergunta: em vez de 'o que há de errado com essa pessoa?', pergunta 'o que foi feito com ela e onde ela vive?'. Trancar o indivíduo esconde a causa. O projeto se alinha à luta antimanicomial e à Reforma Psiquiátrica brasileira (Lei 10.216/2001)."],
      es: ["Durante siglos, el manicomio fue el lugar adonde la sociedad enviaba a quienes no quería ver. En Historia de la locura (1961), Michel Foucault muestra a pobres, desempleados y 'locos' encerrados juntos. En Brasil, en el Hospital Colônia de Barbacena, al menos 60.000 personas murieron entre los años 1930 y 1980, y cerca del 70% de las internadas no tenía diagnóstico de enfermedad mental (Daniela Arbex, Holocausto Brasileiro, 2013).", "La categoría 'loco' sirvió para separar a quien es pobre, negro, disidente de género, migrante o a quien desobedece. El proyecto invierte la pregunta: en lugar de '¿qué le pasa a esta persona?', pregunta '¿qué le hicieron y dónde vive?'. Encerrar al individuo esconde la causa. El proyecto se alinea con la lucha antimanicomial y la Reforma Psiquiátrica brasileña (Ley 10.216/2001)."],
    },
    images: [],
    extra: null,
  },
  {
    key: "mandala-mask",
    title: { en: "Mandala and mask", pt: "Mandala e máscara", es: "Mandala y máscara" },
    texts: {
      en: ["Two psychiatrists of the same period worked against the asylum. At Engenho de Dentro, in Rio de Janeiro, Nise da Silveira studied the mandalas painted by patients and founded the Museum of Images of the Unconscious. The mandalas in this project speak to that work: the form that comes from within.", "At the Blida hospital, in Algeria, Frantz Fanon showed that colonialism makes people ill. In Black Skin, White Masks (1952), the mask is the identity imposed by racism. Here the mask stands for the label imposed from outside, and the light shows what actually weighs on each place."],
      pt: ["Dois psiquiatras da mesma época trabalharam contra o manicômio. No Engenho de Dentro, no Rio de Janeiro, Nise da Silveira estudou as mandalas pintadas pelos pacientes e criou o Museu de Imagens do Inconsciente. As mandalas deste projeto dialogam com esse trabalho: a forma que vem de dentro.", "No hospital de Blida, na Argélia, Frantz Fanon mostrou que o colonialismo adoece. Em Pele negra, máscaras brancas (1952), a máscara é a identidade imposta pelo racismo. Aqui, a máscara representa a categoria imposta de fora, e a luz mostra o que de fato pesa sobre cada lugar."],
      es: ["Dos psiquiatras de la misma época trabajaron contra el manicomio. En Engenho de Dentro, en Río de Janeiro, Nise da Silveira estudió los mandalas pintados por los pacientes y fundó el Museo de Imágenes del Inconsciente. Los mandalas de este proyecto dialogan con ese trabajo: la forma que viene de dentro.", "En el hospital de Blida, en Argelia, Frantz Fanon mostró que el colonialismo enferma. En Piel negra, máscaras blancas (1952), la máscara es la identidad impuesta por el racismo. Aquí, la máscara representa la categoría impuesta desde fuera, y la luz muestra lo que de verdad pesa sobre cada lugar."],
    },
    images: [],
    extra: null,
  },
  {
    key: "social-hacker",
    title: { en: "Antecedent: Social Hacker", pt: "Antecedente: Social Hacker", es: "Antecedente: Social Hacker" },
    texts: {
      en: ["What Is Madness? continues Social Hacker (2019), which investigates the invisible protocols of social life, the codes, permissions and exploits of belonging, through stereograms, agricultural landscapes and systems seen from above.", "The project keeps that view from above: each place is read as a system that can make people ill, and the territory becomes the axis of the geography of suffering. Images: Social Hacker stereograms, 2019."],
      pt: ["O que é a loucura? continua Social Hacker (2019), que investiga os protocolos invisíveis da vida social, os códigos, permissões e brechas do pertencimento, por meio de estereogramas, paisagens agrícolas e sistemas vistos de cima.", "O projeto mantém esse olhar de cima: cada lugar é lido como um sistema que pode adoecer as pessoas, e o território vira o eixo da geografia do sofrimento. Imagens: estereogramas de Social Hacker, 2019."],
      es: ["¿Qué es la locura? continúa Social Hacker (2019), que investiga los protocolos invisibles de la vida social, los códigos, permisos y brechas de la pertenencia, mediante estereogramas, paisajes agrícolas y sistemas vistos desde arriba.", "El proyecto mantiene esa mirada desde arriba: cada lugar se lee como un sistema que puede enfermar a las personas, y el territorio se convierte en el eje de la geografía del sufrimiento. Imágenes: estereogramas de Social Hacker, 2019."],
    },
    images: [
      { src: "https://images.squarespace-cdn.com/content/v1/6842089013f5565b7d1e650d/0cd2a244-cedf-4ea1-8339-d1d1d68a0534/stereogram+jpg.jpg", alt: "Social Hacker, stereogram, 2019" },
      { src: "https://images.squarespace-cdn.com/content/v1/6842089013f5565b7d1e650d/c1a55a91-5092-45df-905e-513f69f035e3/stereogram+%2810%29.jpg", alt: "Social Hacker, stereogram, 2019" },
      { src: "https://images.squarespace-cdn.com/content/v1/6842089013f5565b7d1e650d/a0fedb88-9290-4f0b-9f43-7ea3f62bc8f1/stereogram+%287%29.jpg", alt: "Social Hacker, stereogram, 2019" },
      { src: "https://images.squarespace-cdn.com/content/v1/6842089013f5565b7d1e650d/b1d7f50c-5975-4b87-ad4d-6ef1e5aee526/stereogram+%288%29.jpg", alt: "Social Hacker, stereogram, 2019" },
    ],
    extra: null,
  },
  {
    key: "lab",
    title: { en: "Allostatic Load, the lab", pt: "Carga Alostática, o laboratório", es: "Carga Alostática, el laboratorio" },
    texts: {
      en: ["Allostatic load is the wear the body accumulates from adapting again and again to stress (McEwen and Stellar, 1993). The lab applies the idea to places. It follows 17 places and the whole world, from South Sudan to Tromsø, with open data from scientific sources and international agencies: disasters, heat, air, conflict, hunger, displacement, money, and care as a counterpoint.", "Each factor is linked to the substances the body releases in response, such as cortisol, noradrenaline, oxytocin and GABA. Each substance has a fixed colour, and its molecular mass becomes a frequency. The result is a living figure, a cymatic figure, a mandala and a continuous sound for each place."],
      pt: ["Carga alostática é o desgaste que o corpo acumula ao se adaptar repetidamente ao estresse (McEwen e Stellar, 1993). O laboratório aplica a ideia a lugares. Acompanha 17 lugares e o mundo todo, do Sudão do Sul a Tromsø, com dados abertos de fontes científicas e de organismos internacionais: desastres, calor, ar, conflito, fome, deslocamento, dinheiro e, como contraponto, o cuidado.", "Cada fator é ligado às substâncias que o corpo libera diante dele, como cortisol, noradrenalina, ocitocina e GABA. Cada substância tem uma cor fixa, e a massa da molécula vira frequência. O resultado é uma figura viva, uma figura de cimática, uma mandala e um som contínuo para cada lugar."],
      es: ["La carga alostática es el desgaste que el cuerpo acumula al adaptarse una y otra vez al estrés (McEwen y Stellar, 1993). El laboratorio aplica la idea a lugares. Sigue 17 lugares y el mundo entero, de Sudán del Sur a Tromsø, con datos abiertos de fuentes científicas y organismos internacionales: desastres, calor, aire, conflicto, hambre, desplazamiento, dinero y, como contrapunto, el cuidado.", "Cada factor se vincula a las sustancias que el cuerpo libera ante él, como cortisol, noradrenalina, oxitocina y GABA. Cada sustancia tiene un color fijo, y la masa de la molécula se convierte en frecuencia. El resultado es una figura viva, una figura cimática, un mandala y un sonido continuo para cada lugar."],
    },
    images: [
      { src: labAgora.url, alt: "Allostatic Load lab interface" },
      { src: labCimatica.url, alt: "Cymatic figure and mandala in the Allostatic Load lab" },
    ],
    extra: null,
  },
  {
    key: "observatory",
    title: { en: "Observatory", pt: "Observatório", es: "Observatorio" },
    texts: {
      en: ["A research panel that links each event to who suffers, who profits, what science shows and what helps. It has a timeline up to 2050, indices of affliction by place, live research collected every day, little-known effects of psychiatric medicines, and a map where clicking any item shows everything connected to it."],
      pt: ["Um painel de pesquisa que liga cada acontecimento a quem sofre, quem lucra, o que a ciência mostra e o que ajuda. Tem linha do tempo até 2050, índices de aflição por lugar, pesquisa ao vivo coletada todo dia, efeitos pouco divulgados de remédios psiquiátricos e um mapa em que clicar em qualquer item mostra tudo o que se liga a ele."],
      es: ["Un panel de investigación que vincula cada acontecimiento con quién sufre, quién gana, qué muestra la ciencia y qué ayuda. Tiene una línea de tiempo hasta 2050, índices de aflicción por lugar, investigación en vivo recogida cada día, efectos poco difundidos de medicamentos psiquiátricos y un mapa donde, al hacer clic en cualquier elemento, se ve todo lo que se conecta con él."],
    },
    images: [
      { src: obsCasos.url, alt: "Observatory: cases in six columns" },
      { src: obsMapa.url, alt: "Observatory: map" },
      { src: obsConexoes.url, alt: "Observatory: connections" },
    ],
    extra: null,
  },
  {
    key: "mandala",
    title: { en: "Mandala of the Unconscious", pt: "Mandala do Inconsciente", es: "Mandala del Inconsciente" },
    texts: {
      en: ["A personal work. A person gives it their own search history, or types words, and it draws a mandala of 19 substances in colour, form and sound. Nothing leaves the browser. In intention mode, the person writes how they want to feel, and the mandala moves slowly from their current chemistry to the one they asked for. It is a representation, not a treatment."],
      pt: ["Uma obra pessoal. A pessoa entrega o próprio histórico de buscas, ou escreve palavras, e a obra desenha uma mandala de 19 substâncias em cor, forma e som. Nada sai do navegador. No modo de intenção, a pessoa escreve como quer se sentir, e a mandala vai aos poucos da química atual para a que ela pediu. É uma representação, não um tratamento."],
      es: ["Una obra personal. La persona entrega su propio historial de búsquedas, o escribe palabras, y la obra dibuja un mandala de 19 sustancias en color, forma y sonido. Nada sale del navegador. En el modo de intención, la persona escribe cómo quiere sentirse, y el mandala pasa poco a poco de la química actual a la que pidió. Es una representación, no un tratamiento."],
    },
    images: [{ src: mandala.url, alt: "Mandala of the Unconscious" }],
    extra: null,
  },
  {
    key: "sirene",
    title: { en: "Sirene", pt: "Sirene", es: "Sirene" },
    texts: {
      en: ["A light and sound object for galleries: a 2.70 m column of light in which the colours of the substances blend into each other, and a mandala of light on the floor that keeps changing with the data. The sound is a continuous chord with no alarm, because a siren sound can trigger people.", "The room counts too: the city's data, anonymous sensors (CO₂, temperature, noise level without recording, presence) and visitors who say, by QR code, how they arrived and how they want to leave. No phone is identified and nothing is stored. Images: 3D simulation."],
      pt: ["Um objeto luminoso e sonoro para galeria: uma coluna de luz de 2,70 m em que as cores das substâncias se misturam, e uma mandala de luz no chão que vai mudando com os dados. O som é um acorde contínuo, sem alarme, porque um som de sirene pode gerar gatilhos.", "A sala também entra na conta: os dados da cidade, sensores anônimos (CO₂, temperatura, nível de ruído sem gravação, presença) e quem participa pelo QR code, dizendo como chegou e como quer sair. Nenhum celular é identificado e nada é guardado. Imagens: simulação 3D."],
      es: ["Un objeto luminoso y sonoro para galerías: una columna de luz de 2,70 m en la que los colores de las sustancias se mezclan, y un mandala de luz en el suelo que va cambiando con los datos. El sonido es un acorde continuo, sin alarma, porque un sonido de sirena puede generar detonantes.", "La sala también cuenta: los datos de la ciudad, sensores anónimos (CO₂, temperatura, nivel de ruido sin grabación, presencia) y quienes participan por código QR, diciendo cómo llegaron y cómo quieren salir. Ningún teléfono se identifica y nada se guarda. Imágenes: simulación 3D."],
    },
    images: [
      { src: sireneSala.url, alt: "Sirene in the gallery room, 3D simulation" },
      { src: sireneChao.url, alt: "Sirene light mandala on the floor, 3D simulation" },
      { src: sireneTromso.url, alt: "Sirene showing Tromsø data, 3D simulation" },
      { src: sireneElevacao.url, alt: "Sirene elevation, 3D simulation" },
    ],
    extra: "sireneVideo",
  },
  {
    key: "nebulae",
    title: { en: "Nebulae: atlas and installation", pt: "Nebulosas: atlas e instalação", es: "Nebulosas: atlas e instalación" },
    texts: {
      en: ["The nebulae leave the lab and become fixed, physical works chosen by the artist: print, light and projection.", "Atlas. A fixed series of 5 to 7 large-format prints or lightboxes. Each image carries the name of a place and the date it was generated. It is neither updated nor sold as a series: it is a record, like the plates of an atlas, tied to the geography of suffering axis.", "Nebula, a light installation. Light passes through a shallow tank of water or through textured or dichroic glass panels and projects clouds and filaments onto the ceiling or wall. A speaker fixed to the tank plays the frequencies of the place's substances, and the water vibrates with them; with glass, the panels turn slowly. The stimulus can also come from the people in the room: breath, pulse or Sirene's anonymous presence and noise sensors. Materials and dimensions will be defined in a prototype.", "Masks. The nebula projected onto the masks: the mask is the label imposed from outside, and the light shows what weighs on each place.", "Mapping. The nebula as the background of the projection-mapped videos, with the project's question."],
      pt: ["As nebulosas saem do laboratório e viram obras fixas e físicas, escolhidas pela artista: impressão, luz e projeção.", "Atlas. Série fixa de 5 a 7 impressões em grande formato ou caixas de luz. Cada imagem leva o nome de um lugar e a data em que foi gerada. Não é atualizada nem vendida em série: é um registro, como as pranchas de um atlas, ligado ao eixo da geografia do sofrimento.", "Nebulosa, instalação de luz. A luz atravessa um tanque raso de água ou placas de vidro texturizado ou dicroico e projeta nuvens e filamentos no teto ou na parede. Um alto-falante preso ao tanque toca as frequências das substâncias do lugar, e a água vibra com elas; no vidro, as placas giram devagar. O estímulo também pode vir de quem está na sala: respiração, pulso ou os sensores anônimos de presença e ruído da Sirene. Materiais e medidas serão definidos em protótipo.", "Máscaras. A nebulosa projetada sobre as máscaras: a máscara é a categoria imposta de fora, e a luz mostra o que pesa sobre cada lugar.", "Mapping. A nebulosa como fundo dos vídeos em mapping, com a pergunta do projeto."],
      es: ["Las nebulosas salen del laboratorio y se convierten en obras fijas y físicas, elegidas por la artista: impresión, luz y proyección.", "Atlas. Serie fija de 5 a 7 impresiones en gran formato o cajas de luz. Cada imagen lleva el nombre de un lugar y la fecha en que se generó. No se actualiza ni se vende en serie: es un registro, como las láminas de un atlas, ligado al eje de la geografía del sufrimiento.", "Nebulosa, instalación de luz. La luz atraviesa un tanque poco profundo de agua o placas de vidrio texturizado o dicroico y proyecta nubes y filamentos en el techo o la pared. Un altavoz fijado al tanque toca las frecuencias de las sustancias del lugar, y el agua vibra con ellas; con vidrio, las placas giran despacio. El estímulo también puede venir de quienes están en la sala: respiración, pulso o los sensores anónimos de presencia y ruido de la Sirene. Materiales y medidas se definirán en un prototipo.", "Máscaras. La nebulosa proyectada sobre las máscaras: la máscara es la categoría impuesta desde fuera, y la luz muestra lo que pesa sobre cada lugar.", "Mapping. La nebulosa como fondo de los videos en mapping, con la pregunta del proyecto."],
    },
    images: [{ src: nebulosas.url, alt: "Studies for the Atlas: nebulae generated by the lab" }],
    extra: null,
  },
  {
    key: "mapping",
    title: { en: "Mapping and the street", pt: "Mapping e rua", es: "Mapping y calle" },
    texts: {
      en: ["Projection-mapped videos made from the images the data generate (mandalas, cymatics, the nebulae as background) and from the project's question, for façades, blank building walls and Sirene itself. The first study shows the question in white letters over blue liquid forms.", "The question leaves the gallery for the street: 'What is madness? What is sanity?', in places people pass through in São Paulo, such as the Minhocão (Elevado Presidente João Goulart), the elevated highway that closes to cars and becomes a leisure space at night and on weekends. Formats: projection mapping on the building walls along it, posters and banners with a QR code to the lab, and a version of Sirene in public space. The interventions depend on permits from the City of São Paulo and the building owners."],
      pt: ["Vídeos de projeção mapeada feitos com as imagens geradas pelos dados (mandalas, cimática, as nebulosas como fundo) e com a pergunta do projeto, para fachadas, empenas de prédios e a própria Sirene. O primeiro estudo mostra a pergunta em letras brancas sobre formas líquidas em azul.", "A pergunta sai da galeria e vai para a rua: 'O que é a loucura? O que é a sanidade?', em lugares de passagem de São Paulo como o Minhocão (Elevado Presidente João Goulart), que fecha para carros e vira espaço de lazer à noite e nos fins de semana. Formatos: projeção mapeada nas empenas dos prédios ao longo do elevado, lambe-lambes e faixas com um QR code que leva ao laboratório, e uma versão da Sirene em espaço público. As intervenções dependem de autorização da Prefeitura de São Paulo e dos donos dos imóveis."],
      es: ["Videos de proyección mapeada hechos con las imágenes que generan los datos (mandalas, cimática, as nebulosas como fundo) y con la pregunta del proyecto, para fachadas, medianeras de edificios y la propia Sirene. El primer estudio muestra la pregunta en letras blancas sobre formas líquidas en azul.", "La pregunta sale de la galería a la calle: '¿Qué es la locura? ¿Qué es la cordura?', en lugares de paso de São Paulo como el Minhocão (Elevado Presidente João Goulart), la vía elevada que se cierra a los coches y se convierte en espacio de ocio por la noche y los fines de semana. Formatos: proyección mapeada en las medianeras de los edificios a lo largo de la vía, carteles y pancartas con un código QR que lleva al laboratorio, y una versión de la Sirene en el espacio público. Las intervenciones dependen de permisos del Ayuntamiento de São Paulo y de los propietarios de los edificios."],
    },
    images: [],
    extra: "mappingVideo",
  },
  {
    key: "data",
    title: { en: "Where the data come from", pt: "De onde vêm os dados", es: "De dónde vienen los datos" },
    texts: {
      en: ["All data are open and public, from international agencies, scientific institutions and recognised databases, aggregated by place. No source identifies people.", "Disasters: GDACS (UN and European Commission), USGS. Heat and air: Open-Meteo, Copernicus CAMS. Conflict and cooperation: GDELT, UCDP (Uppsala University). Hunger, war, displacement: HDX HAPI (UN OCHA) with ACLED, IPC, IOM, UNHCR. Economic indicators: World Bank, FRED. Distress and hope: Wikipedia pageviews and public Bluesky posts, counts only. Science: Europe PMC, ClinicalTrials.gov. Medicines: openFDA. Molecular mass: PubChem (NIH)."],
      pt: ["Todos os dados são abertos e públicos, de organismos internacionais, instituições científicas e bases reconhecidas, agregados por lugar. Nenhuma fonte identifica pessoas.", "Desastres: GDACS (ONU e Comissão Europeia), USGS. Calor e ar: Open-Meteo, Copernicus CAMS. Conflito e cooperação: GDELT, UCDP (Universidade de Uppsala). Fome, guerra, deslocamento: HDX HAPI (OCHA, ONU) com ACLED, IPC, OIM, ACNUR. Indicadores econômicos: Banco Mundial, FRED. Aflição e esperança: acessos à Wikipedia e posts públicos do Bluesky, só contagens. Ciência: Europe PMC, ClinicalTrials.gov. Remédios: openFDA. Massa das moléculas: PubChem (NIH)."],
      es: ["Todos los datos son abiertos y públicos, de organismos internacionales, instituciones científicas y bases reconocidas, agregados por lugar. Ninguna fuente identifica a personas.", "Desastres: GDACS (ONU y Comisión Europea), USGS. Calor y aire: Open-Meteo, Copernicus CAMS. Conflicto y cooperación: GDELT, UCDP (Universidad de Uppsala). Hambre, guerra, desplazamiento: HDX HAPI (OCHA, ONU) con ACLED, IPC, OIM, ACNUR. Indicadores económicos: Banco Mundial, FRED. Aflicción y esperanza: visitas a Wikipedia y publicaciones públicas de Bluesky, solo recuentos. Ciencia: Europe PMC, ClinicalTrials.gov. Medicamentos: openFDA. Masa de las moléculas: PubChem (NIH)."],
    },
    images: [],
    extra: null,
  },
  {
    key: "bulletin",
    title: { en: "Weekly bulletin", pt: "Boletim semanal", es: "Boletín semanal" },
    texts: {
      en: ["Every Monday the project closes the week in a numbered bulletin: one image, one sound track and one data page. The image is sold directly by the artist and the track is released on streaming platforms; part of the income goes to institutions that care for the causes the work shows, with public monthly accounts.", "The works are free, open, without login, in three languages, with open code."],
      pt: ["Toda segunda-feira, o projeto fecha a semana num boletim numerado: uma imagem, uma faixa de som e uma página de dados. A imagem é vendida diretamente pela artista e a faixa sai nas plataformas de streaming; parte da renda vai para instituições que cuidam das causas que a obra mostra, com prestação de contas mensal e pública.", "As obras são gratuitas, abertas, sem login, em três línguas e com código aberto."],
      es: ["Cada lunes, el proyecto cierra la semana en un boletín numerado: una imagen, una pista de sonido y una página de datos. La imagen la vende directamente la artista y la pista se publica en plataformas de streaming; parte de los ingresos va a instituciones que cuidan las causas que muestra la obra, con rendición de cuentas mensual y pública.", "Las obras son gratuitas, abiertas, sin registro, en tres idiomas y con código abierto."],
    },
    images: [],
    extra: "workLinks",
  },
];

const links: { label: L; href: string }[] = [
  {
    label: { en: "Open the lab", pt: "Abrir o laboratório", es: "Abrir el laboratorio" },
    href: "https://luizajprado.github.io/sirene/",
  },
  {
    label: { en: "Observatory", pt: "Observatório", es: "Observatorio" },
    href: "https://luizajprado.github.io/sirene/observatorio/",
  },
  {
    label: {
      en: "Mandala of the Unconscious",
      pt: "Mandala do Inconsciente",
      es: "Mandala del Inconsciente",
    },
    href: "https://luizajprado.github.io/sirene/mandala/",
  },
];

export function AboutMadnessProject({ project, next }: { project: Project; next: Project }) {
  const { lang, t } = useI18n();

  return (
    <>
      <ProjectHero
        title={title[lang]}
        kicker="Allostatic Load · Observatory · Mandala of the Unconscious · Sirene · Nebulae · Mapping · Street"
        year={project.year || "2026"}
        meta={meta[lang]}
        lead={lead[lang]}
        image={hero.url}
      />

      {ch.map((c, i) => {
        const images = c.images;
        const single = images.length === 1 ? images[0] : undefined;
        return (
          <div key={c.key}>
            <Chapter
              index={String(i + 1).padStart(2, "0")}
              title={c.title[lang]}
              texts={c.texts[lang]}
              leadImage={single}
              images={single ? [] : images}
            />
            {c.extra === "sireneVideo" ? (
              <section className="px-6 pb-16 md:px-12 md:pb-24">
                <div className="mx-auto max-w-[1500px]">
                  <PosterVideo
                    title="Sirene"
                    src={sireneVideo.url}
                    poster={sireneChao.url}
                    open
                  />
                </div>
              </section>
            ) : null}
            {c.extra === "mappingVideo" ? (
              <section className="px-6 pb-16 md:px-12 md:pb-24">
                <div className="mx-auto max-w-[1500px]">
                  <PosterVideo
                    title={c.title[lang]}
                    src={mappingVideo.url}
                    poster={mappingPoster.url}
                    open
                  />
                </div>
              </section>
            ) : null}
            {c.extra === "workLinks" ? (
              <section className="px-6 pb-16 md:px-12 md:pb-24">
                <div className="mx-auto grid max-w-[1500px] grid-cols-12 gap-8">
                  <div className="col-span-12 flex flex-wrap gap-x-8 gap-y-3 md:col-span-8 md:col-start-5">
                    {links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] uppercase tracking-[0.28em] text-bone/60 transition-colors hover:text-bone"
                      >
                        {l.label[lang]} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        );
      })}

      <ProjectPrev slug={project.slug} />

      <Link
        to="/work/$slug"
        params={{ slug: next.slug }}
        className="group flex flex-wrap items-baseline justify-between gap-4 border-t border-bone/12 px-6 py-16 md:px-12 md:py-24"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/40">
          {t("nextProject")}
        </span>
        <span className="font-display text-[clamp(2rem,6vw,4.5rem)] font-light leading-none text-bone/80 transition-all duration-500 group-hover:translate-x-3 group-hover:text-bone">
          {next.title}
        </span>
      </Link>
    </>
  );
}
