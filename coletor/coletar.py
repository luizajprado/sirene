#!/usr/bin/env python3
"""Sirene · coletor de dados.

Roda sozinho a cada hora no GitHub Actions. Usa só a biblioteca padrão do Python.
Busca dados públicos sobre o que pode pesar na saúde mental em cada lugar,
grava o retrato do momento e guarda o histórico.

Saídas:
  data/ultimo.json                      estado mais recente
  data/historico/AAAA-MM-DD/HHMM.json   arquivo de cada coleta
  data/serie.json                       as últimas 48 coletas, para variações e tendências
  docs/dados.js                         o que o site lê (window.SIRENE_DATA)
  docs/dados.json                       o mesmo, em JSON, para a extensão de navegador

Se uma fonte falhar, o coletor mantém o último valor bom e registra a falha em "fontes".
"""
import io
import json
import math
import os
import urllib.parse
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Sirene/1.0 (obra de arte de dados, codigo aberto; ver README)"
AGORA = datetime.now(timezone.utc).replace(second=0, microsecond=0)
JANELA_H = 96  # alertas mais antigos que isso saem da obra (a memória visual dura ~3 dias)


def baixar(url, headers=None, timeout=45):
    req = urllib.request.Request(url, headers={"User-Agent": UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def iso(dt):
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")


def recente(ts):
    try:
        t = datetime.strptime(ts, "%Y-%m-%dT%H:%MZ").replace(tzinfo=timezone.utc)
        return AGORA - t <= timedelta(hours=JANELA_H)
    except Exception:
        return False


# ---------------------------------------------------------------- terremotos · USGS (domínio público)
def usgs():
    d = json.loads(baixar("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"))
    saida = []
    for f in d.get("features", []):
        p = f.get("properties", {})
        lon, lat = f["geometry"]["coordinates"][:2]
        mag = p.get("mag") or 0
        t = datetime.fromtimestamp(p["time"] / 1000, timezone.utc)
        if mag < 5 or AGORA - t > timedelta(hours=JANELA_H):
            continue
        nivel = "Red" if (p.get("alert") in ("red", "orange") or mag >= 7) else "Green"
        lugar = (p.get("place") or "").split(" of ")[-1].strip() or "oceano"
        saida.append([iso(t), "EQ", nivel, lugar, round(lat, 2), round(lon, 2), round(mag, 1), None])
    return saida


# ---------------------------------------------------------------- ciclones, inundações, incêndios · GDACS
NS = {"gdacs": "http://www.gdacs.org", "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#"}
NIVEL_PT = {"Red": "vermelho", "Orange": "laranja", "Green": "verde"}


def gdacs():
    raiz = ET.fromstring(baixar("https://www.gdacs.org/xml/rss.xml"))
    saida = []
    for it in raiz.iter("item"):
        try:
            tipo = (it.findtext("gdacs:eventtype", "", NS) or "").upper()
            if tipo not in ("TC", "FL", "WF"):
                continue  # terremotos vêm do USGS; secas e vulcões ainda não entram na obra
            nivel = (it.findtext("gdacs:alertlevel", "Green", NS) or "Green").capitalize()
            lat = float(it.findtext("geo:Point/geo:lat", None, NS))
            lon = float(it.findtext("geo:Point/geo:long", None, NS))
            t = parsedate_to_datetime(it.findtext("gdacs:fromdate", "", NS))
            if AGORA - t > timedelta(hours=JANELA_H):
                continue
            pais = (it.findtext("gdacs:country", "", NS) or "").strip() or "mar"
            sev = it.find("gdacs:severity", NS)
            valor = float(sev.get("value")) if sev is not None and sev.get("value") else 0.0
            if tipo == "FL":
                # inundação usa o canal da água (azul); a intensidade vem do nível do alerta
                intens = {"Red": 180, "Orange": 140}.get(nivel, 90)
                saida.append([iso(t), "TC", nivel, pais, round(lat, 2), round(lon, 2), intens, f"inundação · alerta {NIVEL_PT.get(nivel, nivel)}"])
            else:
                saida.append([iso(t), tipo, nivel, pais, round(lat, 2), round(lon, 2), round(valor, 1), None])
        except Exception:
            continue
    return saida


# ---------------------------------------------------------------- calor e ar · Open-Meteo (CC BY 4.0)
def open_meteo(lugares):
    lats = ",".join(str(p["lat"]) for p in lugares)
    lons = ",".join(str(p["lon"]) for p in lugares)
    clima = json.loads(baixar(
        f"https://api.open-meteo.com/v1/forecast?latitude={lats}&longitude={lons}"
        "&current=temperature_2m,apparent_temperature,relative_humidity_2m,is_day&timezone=UTC"))
    ar = json.loads(baixar(
        f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lats}&longitude={lons}"
        "&current=pm2_5,pm10,nitrogen_dioxide,ozone&timezone=UTC"))
    clima = clima if isinstance(clima, list) else [clima]
    ar = ar if isinstance(ar, list) else [ar]
    saida = []
    for c, a in zip(clima, ar):
        cc, aa = c.get("current", {}), a.get("current", {})
        saida.append({
            "T": cc.get("temperature_2m"), "sensacao": cc.get("apparent_temperature"),
            "umidade": cc.get("relative_humidity_2m"), "dia": cc.get("is_day"),
            "pm": aa.get("pm2_5"), "pm10": aa.get("pm10"), "no2": aa.get("nitrogen_dioxide"), "ozonio": aa.get("ozone"),
        })
    return saida


# ---------------------------------------------------------------- o que as pessoas procuram · Wikipédia, por idioma
# O Google não oferece acesso livre às buscas; os acessos à Wikipédia são o melhor indicador aberto do que se procura.
# Compara o último dia com a média da semana anterior, para temas de aflição e de cuidado. Os títulos em outros
# idiomas são obtidos a partir do inglês pelos links entre idiomas da própria Wikipédia.
AFLICAO = ["Anxiety", "Panic_attack", "Insomnia", "Depression_(mood)", "Loneliness", "Fear", "War", "Famine"]
CUIDADO = ["Hope", "Gratitude", "Solidarity", "Love", "Friendship", "Meditation", "Happiness", "Mutual_aid_(organization_theory)"]
IDIOMAS = ["en", "pt", "es", "ar", "hi", "id", "bn", "zh", "no"]


def titulos(art):
    d = json.loads(baixar(f"https://en.wikipedia.org/w/api.php?action=query&titles={art}&prop=langlinks&lllimit=500&format=json&redirects=1"))
    pg = next(iter(d["query"]["pages"].values()))
    out = {"en": art}
    for ll in pg.get("langlinks", []):
        if ll["lang"] in IDIOMAS:
            out[ll["lang"]] = ll["*"].replace(" ", "_")
    return out


def wikimedia():
    fim = (AGORA - timedelta(days=1)).strftime("%Y%m%d")
    ini = (AGORA - timedelta(days=8)).strftime("%Y%m%d")
    por_lingua = {}
    for grupo, lista in (("aflicao", AFLICAO), ("cuidado", CUIDADO)):
        for art in lista:
            try:
                t = titulos(art)
            except Exception:
                t = {"en": art}
            for lang, tit in t.items():
                try:
                    d = json.loads(baixar(
                        f"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/{lang}.wikipedia/all-access/user/{urllib.parse.quote(tit, safe='')}/daily/{ini}00/{fim}00"))
                except Exception:
                    continue
                v = [x["views"] for x in d.get("items", [])]
                if len(v) < 3:
                    continue
                r = por_lingua.setdefault(lang, {"aflicao": [0, 0], "cuidado": [0, 0]})
                r[grupo][0] += v[-1]
                r[grupo][1] += sum(v[:-1]) / len(v[:-1])
    if not por_lingua:
        raise RuntimeError("nenhum acesso lido da Wikipédia")
    saida = {}
    for lang, r in por_lingua.items():
        q = {g: (a / b if b else 1.0) for g, (a, b) in r.items()}
        saida[lang] = {"aflicao": round(q["aflicao"], 3), "cuidado": round(q["cuidado"], 3),
                       "acessos_aflicao": r["aflicao"][0], "acessos_cuidado": r["cuidado"][0]}
    return saida


# ---------------------------------------------------------------- o que as pessoas escrevem · Bluesky (rede aberta)
# Escuta por alguns minutos as postagens públicas do Bluesky e conta, por idioma, palavras de aflição e de cuidado.
# Só contagens: nenhum texto, nome ou conta é guardado.
PALAVRAS = {
    "en": {"aflicao": ["anxiety", "anxious", "panic", "depressed", "depression", "lonely", "insomnia", "hopeless", "scared", "afraid", "war", "hunger"],
           "cuidado": ["hope", "grateful", "gratitude", "love", "peace", "solidarity", "joy", "calm", "together", "kindness", "care"]},
    "pt": {"aflicao": ["ansiedade", "ansiosa", "ansioso", "pânico", "depressão", "sozinha", "sozinho", "insônia", "medo", "guerra", "fome"],
           "cuidado": ["esperança", "gratidão", "amor", "paz", "solidariedade", "alegria", "calma", "juntos", "juntas", "cuidado", "afeto"]},
    "es": {"aflicao": ["ansiedad", "ansioso", "ansiosa", "pánico", "depresión", "soledad", "insomnio", "miedo", "guerra", "hambre"],
           "cuidado": ["esperanza", "gratitud", "amor", "paz", "solidaridad", "alegría", "calma", "juntos", "cuidado", "cariño"]},
}


def bluesky(segundos=120):
    from websockets.sync.client import connect
    import re
    cont = {l: {"aflicao": 0, "cuidado": 0, "posts": 0} for l in PALAVRAS}
    padroes = {l: {g: re.compile(r"\b(" + "|".join(map(re.escape, ws)) + r")\b", re.I) for g, ws in grupos.items()} for l, grupos in PALAVRAS.items()}
    fim = datetime.now(timezone.utc) + timedelta(seconds=segundos)
    with connect("wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post", open_timeout=20) as ws:
        while datetime.now(timezone.utc) < fim:
            try:
                m = json.loads(ws.recv(timeout=10))
            except TimeoutError:
                continue
            rec = (m.get("commit") or {}).get("record") or {}
            texto = rec.get("text") or ""
            for l in (rec.get("langs") or [])[:1]:
                l = l.split("-")[0]
                if l in cont:
                    cont[l]["posts"] += 1
                    for g, rx in padroes[l].items():
                        if rx.search(texto):
                            cont[l][g] += 1
    return {l: {**c, "aflicao_por_mil": round(1000 * c["aflicao"] / c["posts"], 1) if c["posts"] else None,
                "cuidado_por_mil": round(1000 * c["cuidado"] / c["posts"], 1) if c["posts"] else None} for l, c in cont.items()}


# ---------------------------------------------------------------- conflito armado · UCDP (precisa de chave)
def ucdp():
    tok = os.environ.get("UCDP_TOKEN")
    if not tok:
        return None
    ver = os.environ.get("UCDP_VERSION", "26.0.9")
    d = json.loads(baixar(f"https://ucdpapi.pcr.uu.se/api/gedevents/{ver}?pagesize=1000", {"x-ucdp-access-token": tok}))
    saida = []
    for r in d.get("Result", []):
        try:
            saida.append([round(float(r["latitude"]), 2), round(float(r["longitude"]), 2), int(r.get("best") or 0), r.get("date_start")])
        except Exception:
            continue
    return saida


def km_entre(a1, o1, a2, o2):
    r = math.pi / 180
    x = math.sin((a2 - a1) * r / 2) ** 2 + math.cos(a1 * r) * math.cos(a2 * r) * math.sin((o2 - o1) * r / 2) ** 2
    return 12742 * math.asin(math.sqrt(x))


# ---------------------------------------------------------------- violência e crise política · GDELT (aberto, a cada 15 min)
# Códigos CAMEO (raiz): 14 protesto · 17 coerção e repressão · 18 agressão · 19 combate · 20 violência em massa.
# Mede o que a imprensa mundial relata, não tudo o que acontece; locais com menos cobertura aparecem menos.
GDELT_PESO = {"14": 0.3, "17": 0.6, "18": 0.8, "19": 0.9, "20": 1.0}
# Contraponto: 03 intenção de cooperar · 04 diálogo · 05 cooperação diplomática · 06 cooperação material · 07 ajuda · 08 concessão (ex.: cessar-fogo)
GDELT_CUIDADO = {"03": 0.3, "04": 0.2, "05": 0.4, "06": 0.7, "07": 1.0, "08": 0.6}


def gdelt(lugares):
    ult = baixar("http://data.gdeltproject.org/gdeltv2/lastupdate.txt").decode().split()
    url = next(x for x in ult if x.endswith(".export.CSV.zip"))
    base_t = datetime.strptime(url.rsplit("/", 1)[1][:14], "%Y%m%d%H%M%S").replace(tzinfo=timezone.utc)
    soma = [0.0] * len(lugares)
    cuid = [0.0] * len(lugares)
    ccont = [dict() for _ in lugares]
    cont = [dict() for _ in lugares]
    lidos = 0
    for k in range(4):  # a última hora: quatro arquivos de 15 minutos
        t = base_t - timedelta(minutes=15 * k)
        try:
            z = zipfile.ZipFile(io.BytesIO(baixar(f"http://data.gdeltproject.org/gdeltv2/{t.strftime('%Y%m%d%H%M%S')}.export.CSV.zip", timeout=90)))
        except Exception:
            continue
        lidos += 1
        with z.open(z.namelist()[0]) as f:
            for linha in io.TextIOWrapper(f, encoding="utf-8", errors="replace"):
                c = linha.rstrip("\n").split("\t")
                if len(c) < 58:
                    continue
                peso = GDELT_PESO.get(c[28])
                pcuid = GDELT_CUIDADO.get(c[28])
                if not (peso or pcuid) or not c[56] or not c[57]:
                    continue
                try:
                    lat, lon, men = float(c[56]), float(c[57]), int(c[31] or 1)
                except ValueError:
                    continue
                for j, p in enumerate(lugares):
                    km = km_entre(p["lat"], p["lon"], lat, lon)
                    if km > 900:
                        continue
                    w = math.log1p(men) * math.exp(-((km / 300) ** 2))
                    if peso:
                        soma[j] += peso * w
                        if km < 300:
                            cont[j][c[28]] = cont[j].get(c[28], 0) + 1
                    else:
                        cuid[j] += pcuid * w
                        if km < 300:
                            ccont[j][c[28]] = ccont[j].get(c[28], 0) + 1
    if not lidos:
        raise RuntimeError("nenhum arquivo GDELT disponível")
    NOMES = {"14": "protestos", "17": "repressão", "18": "agressões", "19": "combates", "20": "violência em massa"}
    CNOMES = {"03": "intenções de cooperar", "04": "diálogos", "05": "acordos", "06": "cooperação material", "07": "ajuda humanitária", "08": "concessões e cessar-fogo"}
    saida = []
    for j in range(len(lugares)):
        i = 1 - math.exp(-soma[j] / (6 * lidos / 4))
        ic = 1 - math.exp(-cuid[j] / (10 * lidos / 4))
        nota = ", ".join(f"{n} {NOMES[k]}" for k, n in sorted(cont[j].items(), key=lambda x: -x[1])) or "nada relatado perto"
        cnota = ", ".join(f"{n} {CNOMES[k]}" for k, n in sorted(ccont[j].items(), key=lambda x: -x[1])[:3]) or "nada relatado perto"
        saida.append({"i": round(i, 3), "nota": f"última hora · {nota}", "cuidado": {"i": round(ic, 3), "nota": f"última hora · {cnota}"}})
    return saida


# ---------------------------------------------------------------- guerra, fome e deslocamento · HDX HAPI (OCHA/ONU)
# Precisa de um identificador gratuito. Cadastre o secret HAPI_EMAIL (seu e-mail) ou HAPI_APP_IDENTIFIER no GitHub.
# Dados por país: guerra (ACLED, mortes no mês mais recente), fome (IPC, fração da população em fase 3 ou pior),
# deslocamento interno (IOM/ACNUR, pessoas). Os caminhos são lidos da especificação da API, para resistir a mudanças.
def hapi(lugares):
    base = "https://hapi.humdata.org"
    ident = os.environ.get("HAPI_APP_IDENTIFIER")
    email = os.environ.get("HAPI_EMAIL")
    if not ident and email:
        d = json.loads(baixar(f"{base}/api/v1/encode_identifier?application=sirene&email={urllib.parse.quote(email)}"))
        ident = d.get("encoded_app_identifier") or d.get("encoded_identifier") or next(iter(d.values()), None)
    if not ident:
        return None
    paths = list(json.loads(baixar(f"{base}/openapi.json")).get("paths", {}))

    def achar(*chaves):
        return next((p for p in paths if all(c in p for c in chaves)), None)

    p_conf, p_food, p_idp = achar("conflict-event"), achar("food-security"), achar("idps")

    def linhas(path, iso):
        d = json.loads(baixar(f"{base}{path}?location_code={iso}&output_format=json&limit=10000&app_identifier={urllib.parse.quote(ident)}", timeout=90))
        return d.get("data", []) if isinstance(d, dict) else d

    def recorte(rows):
        if not rows:
            return [], None
        nivel = min(r.get("admin_level", 0) or 0 for r in rows)
        rows = [r for r in rows if (r.get("admin_level", 0) or 0) == nivel]
        ult = max(str(r.get("reference_period_start", "")) for r in rows)
        return [r for r in rows if str(r.get("reference_period_start", "")) == ult], ult[:10]

    por_pais = {}
    for iso in sorted({p["iso3"] for p in lugares}):
        r = {}
        try:
            rows, per = recorte(linhas(p_conf, iso)) if p_conf else ([], None)
            if rows:
                mortes = sum(int(x.get("fatalities") or 0) for x in rows)
                r["guerra"] = {"i": round(min(1, math.log10(1 + mortes) / 4), 3), "nota": f"{mortes} mortes em conflitos no país (mês de {per})"}
        except Exception:
            pass
        try:
            rows = linhas(p_food, iso) if p_food else []
            rows = [x for x in rows if str(x.get("ipc_type", "current")).lower().startswith("current")] or rows
            rows, per = recorte([x for x in rows if str(x.get("ipc_phase")) == "3+"])
            if rows:
                frac = max(float(x.get("population_fraction_in_phase") or 0) for x in rows)
                r["fome"] = {"i": round(min(1, frac / 0.4), 3), "nota": f"{round(frac * 100)}% da população analisada em fase IPC 3 ou pior ({per})"}
        except Exception:
            pass
        try:
            rows, per = recorte(linhas(p_idp, iso)) if p_idp else ([], None)
            if rows:
                n = sum(int(x.get("population") or 0) for x in rows)
                r["deslocamento"] = {"i": round(min(1, math.log10(1 + n) / 7), 3), "nota": f"{n:,} deslocados internos no país ({per})".replace(",", ".")}
        except Exception:
            pass
        por_pais[iso] = r
    return por_pais


# ---------------------------------------------------------------- pressão econômica · Banco Mundial (inflação, desemprego) e FRED (VIX)
# Inflação anual (FP.CPI.TOTL.ZG) e desemprego (SL.UEM.TOTL.ZS, estimativa OIT) por país, último ano disponível.
# VIX: volatilidade esperada da bolsa americana, o "índice do medo" dos mercados; entra como camada mundial pequena.
def economia(lugares):
    isos = ";".join(sorted({p["iso3"] for p in lugares}))
    out = {}
    for ind, nome in (("FP.CPI.TOTL.ZG", "inflacao"), ("SL.UEM.TOTL.ZS", "desemprego")):
        d = json.loads(baixar(f"https://api.worldbank.org/v2/country/{isos}/indicator/{ind}?format=json&mrnev=1&per_page=500"))
        for r in (d[1] if isinstance(d, list) and len(d) > 1 and d[1] else []):
            if r.get("value") is not None:
                out.setdefault(r["countryiso3code"], {})[nome] = [round(float(r["value"]), 1), r.get("date")]
    vix = None
    try:
        linhas = baixar("https://fred.stlouisfed.org/graph/fredgraph.csv?id=VIXCLS").decode().strip().splitlines()
        for ln in reversed(linhas[1:]):
            data, val = ln.split(",")[:2]
            if val not in (".", ""):
                vix = [float(val), data]
                break
    except Exception:
        pass
    return out, vix


# ---------------------------------------------------------------- bolsa de valores · FRED (S&P 500, VIX) e Stooq (Ibovespa)
# Usado pela Bolsa da Aflição, que põe o dinheiro e o sofrimento lado a lado. Guarda [último, anterior, data].
def _dois_ultimos(linhas, col):
    vals = []
    for ln in reversed(linhas[1:]):
        partes = ln.split(",")
        if len(partes) > col and partes[col] not in (".", "", "null"):
            vals.append((float(partes[col]), partes[0]))
            if len(vals) == 2:
                break
    return [round(vals[0][0], 2), round(vals[1][0], 2), vals[0][1]] if len(vals) == 2 else None


def mercado():
    out = {}
    for chave, serie in (("SP500", "SP500"), ("VIX", "VIXCLS")):
        try:
            out[chave] = _dois_ultimos(baixar(f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={serie}").decode().strip().splitlines(), 1)
        except Exception:
            pass
    try:  # Stooq: Date,Open,High,Low,Close,Volume; fechamento na coluna 4
        out["IBOV"] = _dois_ultimos(baixar("https://stooq.com/q/d/l/?s=%5Ebvp&i=d").decode().strip().splitlines(), 4)
    except Exception:
        pass
    return {k: v for k, v in out.items() if v}


# ---------------------------------------------------------------- execução
def carregar(caminho, padrao):
    try:
        with open(caminho, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return padrao


def main():
    lugares = carregar(os.path.join(RAIZ, "coletor", "lugares.json"), [])
    anterior = carregar(os.path.join(RAIZ, "data", "ultimo.json"), {})
    fontes, alertas = {}, []

    for nome, fn in (("USGS", usgs), ("GDACS", gdacs)):
        try:
            novos = fn()
            alertas += novos
            fontes[nome] = f"ok · {len(novos)} eventos"
        except Exception as e:
            fontes[nome] = f"falhou ({type(e).__name__}) · mantido o último valor"
            tipos = ("EQ",) if nome == "USGS" else ("TC", "WF")
            alertas += [a for a in anterior.get("alertas", []) if a[1] in tipos and recente(a[0])]

    try:
        medidas = open_meteo(lugares)
        fontes["Open-Meteo"] = "ok"
    except Exception as e:
        fontes["Open-Meteo"] = f"falhou ({type(e).__name__}) · mantido o último valor"
        antigos = {p["nome"]: p for p in anterior.get("lugares", [])}
        medidas = [{k: antigos.get(p["nome"], {}).get(k) for k in ("T", "sensacao", "umidade", "dia", "pm", "pm10", "no2", "ozonio")} for p in lugares]

    try:
        atencao = wikimedia()
        fontes["Wikimedia"] = "ok"
    except Exception as e:
        atencao = anterior.get("atencao", {})
        fontes["Wikimedia"] = f"falhou ({type(e).__name__}) · mantido o último valor"

    try:
        econ, vix = economia(lugares)
        fontes["Banco Mundial"] = f"ok · {len(econ)} países"
        fontes["FRED (VIX)"] = f"ok · {vix[0]} em {vix[1]}" if vix else "sem valor"
    except Exception as e:
        econ, vix = None, anterior.get("vix")
        fontes["Banco Mundial"] = f"falhou ({type(e).__name__}) · mantido o último valor"

    try:
        redes = bluesky()
        fontes["Bluesky"] = "ok · " + ", ".join(f"{l}: {c['posts']} posts" for l, c in redes.items())
    except Exception as e:
        redes = anterior.get("redes", {})
        fontes["Bluesky"] = f"falhou ({type(e).__name__}) · mantido o último valor"

    try:
        conflitos = ucdp()
        fontes["UCDP"] = "sem chave · conflito fica em zero" if conflitos is None else f"ok · {len(conflitos)} eventos"
    except Exception as e:
        conflitos = anterior.get("conflitos")
        fontes["UCDP"] = f"falhou ({type(e).__name__}) · mantido o último valor"

    try:
        violencia = gdelt(lugares)
        fontes["GDELT"] = "ok"
    except Exception as e:
        antigos = {p["nome"]: p for p in anterior.get("lugares", [])}
        violencia = [dict(antigos.get(p["nome"], {}).get("violencia") or {}, cuidado=antigos.get(p["nome"], {}).get("cuidado")) or None for p in lugares]
        fontes["GDELT"] = f"falhou ({type(e).__name__}) · mantido o último valor"

    try:
        pais = hapi(lugares)
        fontes["HDX"] = "sem identificador · guerra, fome e deslocamento ficam em zero" if pais is None else "ok"
    except Exception as e:
        pais = None
        fontes["HDX"] = f"falhou ({type(e).__name__}) · mantido o último valor"
    antigos = {p["nome"]: p for p in anterior.get("lugares", [])}

    merc = mercado()
    fontes["Bolsas (FRED, Stooq)"] = ("ok · " + ", ".join(merc)) if merc else "falhou · mantido o último valor"
    merc = {**(anterior.get("mercado") or {}), **merc}

    saida_lugares = []
    for p, m, v in zip(lugares, medidas, violencia):
        extra = (pais or {}).get(p["iso3"]) if pais is not None else {k: antigos.get(p["nome"], {}).get(k) for k in ("guerra", "fome", "deslocamento")}
        cuid = (v or {}).pop("cuidado", None) if isinstance(v, dict) else None
        lang = p.get("lingua", "en")
        wk = (atencao or {}).get(lang) or (atencao or {}).get("en") or {}
        rd = (redes or {}).get(lang) or {}
        afl_i = min(1, max(0, (wk.get("aflicao", 1) - 0.85) / 0.5)) if wk else None
        esp_i = min(1, max(0, (wk.get("cuidado", 1) - 0.85) / 0.5)) if wk else None
        if rd.get("posts"):
            afl_i = min(1, (afl_i or 0) * 0.6 + min(1, (rd["aflicao_por_mil"] or 0) / 60) * 0.4)
            esp_i = min(1, (esp_i or 0) * 0.6 + min(1, (rd["cuidado_por_mil"] or 0) / 60) * 0.4)
        atn = None if afl_i is None else {"i": round(afl_i, 3), "nota": f"Wikipédia ({lang}) ontem × semana: {wk.get('aflicao', 1):.2f}" + (f" · Bluesky: {rd['aflicao_por_mil']} por mil posts" if rd.get("posts") else "")}
        esp = None if esp_i is None else {"i": round(esp_i, 3), "nota": f"Wikipédia ({lang}) ontem × semana: {wk.get('cuidado', 1):.2f}" + (f" · Bluesky: {rd['cuidado_por_mil']} por mil posts" if rd.get("posts") else "")}
        if econ is not None:
            ec = econ.get(p["iso3"], {})
            inf, des = (ec.get("inflacao") or [None])[0], (ec.get("desemprego") or [None])[0]
            vv = vix[0] if vix else None
            ei = 0.5 * min(1, max(0, (inf or 0) / 25)) + 0.3 * min(1, (des or 0) / 20) + 0.2 * min(1, max(0, ((vv or 15) - 15) / 25))
            partes = ([f"inflação {inf}% ({ec['inflacao'][1]})"] if inf is not None else []) + ([f"desemprego {des}%"] if des is not None else []) + ([f"VIX {vv}"] if vv else [])
            economica = {"i": round(ei, 3), "nota": " · ".join(partes) or "sem dados"}
        else:
            economica = antigos.get(p["nome"], {}).get("economia")
        saida_lugares.append({"nome": p["nome"], "lat": p["lat"], "lon": p["lon"], "iso3": p["iso3"], "lingua": lang, "economia": economica, "db": p.get("db"), "db_fonte": "estimado",
                              **m, "violencia": v, "cuidado": cuid, "aflicao_coletiva": atn, "esperanca": esp, **{k: x for k, x in (extra or {}).items() if x}})

    alertas.sort(key=lambda a: a[0])
    inicio = alertas[0][0] if alertas else iso(AGORA - timedelta(hours=72))
    # série das últimas 48 coletas: valores de cada fator por lugar, para a variação em 24 h e as tendências da Bolsa da Aflição
    chaves = {"VIOL": "violencia", "GUER": "guerra", "FOME": "fome", "DESL": "deslocamento", "ANSI": "aflicao_coletiva", "ECON": "economia", "CUID": "cuidado"}
    foto = {"t": iso(AGORA), "lugares": {}}
    for L in saida_lugares:
        reg = {"T": L.get("T"), "pm": L.get("pm")}
        for k, campo in chaves.items():
            x = L.get(campo)
            if isinstance(x, dict) and x.get("i") is not None:
                reg[k] = x["i"]
        foto["lugares"][L["nome"]] = reg
    serie = [s for s in carregar(os.path.join(RAIZ, "data", "serie.json"), []) if s.get("t") != foto["t"]]
    serie = (serie + [foto])[-48:]

    dados = {"atualizado": iso(AGORA), "inicio": inicio, "fontes": fontes, "alertas": alertas,
             "lugares": saida_lugares, "atencao": atencao, "redes": redes, "vix": vix, "conflitos": conflitos,
             "mercado": merc, "serie": serie}

    os.makedirs(os.path.join(RAIZ, "data", "historico", AGORA.strftime("%Y-%m-%d")), exist_ok=True)
    os.makedirs(os.path.join(RAIZ, "docs"), exist_ok=True)
    texto = json.dumps(dados, ensure_ascii=False, separators=(",", ":"))
    with open(os.path.join(RAIZ, "data", "ultimo.json"), "w", encoding="utf-8") as f:
        f.write(texto)
    with open(os.path.join(RAIZ, "data", "historico", AGORA.strftime("%Y-%m-%d"), AGORA.strftime("%H%M") + ".json"), "w", encoding="utf-8") as f:
        json.dump({k: v for k, v in dados.items() if k != "serie"}, f, ensure_ascii=False, separators=(",", ":"))  # a série já está em data/serie.json
    with open(os.path.join(RAIZ, "data", "serie.json"), "w", encoding="utf-8") as f:
        json.dump(serie, f, ensure_ascii=False, separators=(",", ":"))
    with open(os.path.join(RAIZ, "docs", "dados.js"), "w", encoding="utf-8") as f:
        f.write("window.SIRENE_DATA = " + texto + ";\n")
    with open(os.path.join(RAIZ, "docs", "dados.json"), "w", encoding="utf-8") as f:  # para a extensão de navegador e para quem quiser os dados
        f.write(texto)
    print(json.dumps(fontes, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
