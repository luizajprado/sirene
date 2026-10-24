# Carga Alostática

**O que é a loucura?** Obra de dados, imagem e som de Luiza Jesus do Prado (2026).

Para cada lugar do mundo, a Carga Alostática junta o que pode pesar na saúde mental de quem vive ali (guerra, violência e crise política, fome, deslocamento forçado, desastres, calor, poluição do ar, ruído, luz e escuridão) e converte esses fatores nos mediadores biológicos do estresse que eles mobilizam: adrenalina, noradrenalina, cortisol, glutamato, interleucina-6, serotonina, grelina, melatonina, ocitocina GABA e dopamina. O contraponto (ajuda, cooperação, esperança) entra na mesma química, pela ocitocina, GABA, serotonina e dopamina. Cada mediador tem uma cor, e o seu som vem da massa molecular levada por oitavas até a faixa audível. As imagens e os sons mudam o tempo todo, conforme os dados.

As correspondências entre fatores e mediadores simplificam a literatura de psicobiologia do estresse. Elas descrevem tendências em populações, nunca a medida do corpo de alguém. A obra não faz diagnóstico.

## Como funciona

1. **Coleta automática.** A cada hora, o GitHub roda `coletor/coletar.py`, que busca dados públicos e grava:
   - `data/ultimo.json`: o retrato mais recente;
   - `data/historico/AAAA-MM-DD/HHMM.json`: o arquivo de cada coleta, aberto para quem quiser estudar;
   - `data/serie.json`: as últimas 48 coletas, para variações e tendências;
   - `docs/dados.js` e `docs/dados.json`: o que o site e a extensão leem.
2. **Site.** A pasta `docs/` é publicada pelo GitHub Pages. As imagens e os sons são gerados no navegador de cada pessoa, a partir do arquivo de dados mais recente.
3. **Falhas.** Se uma fonte não responder, o coletor mantém o último valor bom e registra a falha. O site mostra o estado de cada fonte.

## Observatório

Obra paralela, em `docs/observatorio/`: saúde mental, ciência e dinheiro lidos no mesmo dia. Fica em `https://luizajprado.github.io/sirene/observatorio/`.

- **Onde pesa mais:** os lugares da Carga Alostática, do maior peso para o menor, com os mediadores, a resposta que ajuda e quem trabalha nisso. Os países de maior risco humanitário entram sozinhos, pelo índice INFORM (precisa do secret `HAPI_EMAIL`).
- **Bancos de pesquisa ao vivo** (`coletor/pesquisa.py`): artigos da semana por tema (Europe PMC), ensaios clínicos em saúde mental recrutando e quem os financia (ClinicalTrials.gov), notificações de efeitos adversos de remédios psiquiátricos (openFDA, uma vez por dia) e dados químicos das moléculas (PubChem).
- **O que pouco chega ao público:** achados com fonte, como ISRS e fraturas, sintomas ao parar antidepressivos, disfunção sexual persistente, benzodiazepínicos e dependência. Sempre com o aviso de não mudar remédio sem quem prescreveu.
- **Bolsa da Aflição:** S&P 500, Ibovespa e VIX ao lado de quem lucrou nas crises que pesam na saúde mental.
- **Zona de simulação** e **som contínuo**.

Sai do site de duas formas:

- **Robô no Bluesky** (`coletor/robo.py`): se um índice de um lugar se move 20% ou mais em 24 horas, publica uma nota curta com a resposta que ajuda. No máximo 4 por dia. Para ligar, crie uma conta para o robô, gere uma senha de app (Configurações → Privacidade e segurança → Senhas de app) e cadastre os secrets `BSKY_HANDLE` e `BSKY_APP_PASSWORD`.
- **Extensão de navegador** (`extensao/`): troca, nas páginas de notícia, "Ibovespa", "S&P 500" e outros pelos índices do dia. Instruções em `extensao/LEIAME.md`.

## Fontes

| Fator | Fonte | Situação |
|---|---|---|
| Terremotos | USGS · domínio público | real, automático |
| Ciclones, inundações, incêndios | GDACS (ONU e Comissão Europeia) | real, automático |
| Calor | Open-Meteo · CC BY 4.0 | real, automático |
| Poluição do ar (PM2,5, NO₂, ozônio) | Open-Meteo Air Quality (dados Copernicus CAMS) · CC BY 4.0 | real, automático |
| Luz do dia e noite | calculado (astronomia) | real |
| Aflição coletiva e esperança: o que se procura | Wikipédia, acessos por idioma (aflição × cuidado, ontem comparado à semana) | real, automático; o Google não oferece acesso livre às buscas |
| Aflição coletiva e esperança: o que se escreve | Bluesky, postagens públicas (só contagens de palavras, nada é guardado) | real, automático |
| Contraponto: ajuda humanitária, acordos, cooperação | GDELT | real, automático |
| Pressão econômica (inflação, desemprego, por país) | Banco Mundial | real, automático (anual) |
| Medo dos mercados (VIX) | FRED, Federal Reserve de St. Louis | real, automático (diário); camada mundial pequena |
| S&P 500 e Ibovespa (Observatório) | FRED e Stooq | real, automático (diário) |
| Lugares de maior risco humanitário | INFORM Risk via HDX HAPI · capitais pelo Banco Mundial | precisa do secret `HAPI_EMAIL` |
| Artigos científicos da semana | Europe PMC (inclui PubMed) | real, automático |
| Ensaios clínicos recrutando | ClinicalTrials.gov | real, automático |
| Notificações de efeitos adversos | openFDA (FAERS) · notificação não prova causa | real, automático (diário) |
| Dados químicos das moléculas | PubChem | real, automático |
| Ruído | estimativa por lugar | estimado; mapas de ruído oficiais existem só para algumas regiões |
| Violência e crise política (protestos, repressão, agressões, combates) | GDELT · aberto, a cada 15 min | real, automático; mede o que a imprensa relata |
| Guerra (mortes em conflitos, por país) | HDX HAPI (OCHA/ONU), dados ACLED | precisa do secret `HAPI_EMAIL` |
| Fome (população em fase IPC 3 ou pior, por país) | HDX HAPI, dados IPC | precisa do secret `HAPI_EMAIL` |
| Deslocamento interno (por país) | HDX HAPI, dados IOM e ACNUR | precisa do secret `HAPI_EMAIL` |
| Conflito armado georreferenciado | UCDP (Uppsala) | opcional, precisa de chave |

## Configuração (uma vez)

1. Envie esta pasta para um repositório no GitHub.
2. **Settings → Pages:** *Deploy from a branch*, branch `main`, pasta `/docs`. O site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`. Em conta gratuita, o repositório precisa ser público para o Pages funcionar.
3. **Actions:** abra a aba *Actions*, entre em *coletar dados* e clique em *Run workflow* para a primeira coleta. Depois, ela roda sozinha a cada hora.
4. **Guerra, fome e deslocamento:** em *Settings → Secrets and variables → Actions → New repository secret*, crie `HAPI_EMAIL` com o seu e-mail. O coletor usa esse e-mail só para gerar o identificador gratuito da API humanitária da ONU (HDX HAPI).
5. **Conflito georreferenciado (opcional):** peça uma chave em ucdp.uu.se/apidocs e cadastre como `UCDP_TOKEN`.

## Lugares

A lista fica em `coletor/lugares.json`. Para incluir um lugar, acrescente nome, latitude, longitude e uma estimativa de ruído em dB.

## Licenças

- Código: MIT (veja `LICENSE`).
- Imagens e sons gerados: a definir pela artista (sugestão: CC BY-NC 4.0).
- Dados: seguem a licença de cada fonte; citar sempre as fontes acima.

A obra não faz diagnóstico e não classifica pessoas. Usa apenas dados agregados por lugar.
