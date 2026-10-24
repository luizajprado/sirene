#!/usr/bin/env python3
"""Sirene · coletor de dados.

Roda sozinho a cada hora no GitHub Actions. Usa só a biblioteca padrão do Python.
Busca dados públicos sobre o que pode pesar na saúde mental em cada lugar,
grava o retrato do momento e guarda o histórico.

Saídas:
  data/ultimo.json                      estado mais recente
  data/historico/AAAA-MM-DD/HHMM.json   arquivo de cada coleta
  docs/dados.js                         o que o site lê (window.SIRENE_DATA)

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


# ---------------------------------------------------------------- atenção coletiva · Wikimedia (acessos à Wikipédia)
ARTIGOS = [("en.wikipedia", "Anxiety"), ("en.wikipedia", "Panic_attack"), ("en.wikipedia", "Insomnia"),
           ("pt.wikipedia", "Ansiedade"), ("es.wikipedia", "Ansiedad")]


def wikimedia():
    fim = (AGORA - timedelta(days=1)).strftime("%Y%m%d")
    ini = (AGORA - timedelta(days=8)).strftime("%Y%m%d")
    saida = {}
    for proj, art in ARTIGOS:
        d = json.loads(baixar(
            f"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/{proj}/all-access/user/{art}/daily/{ini}00/{fim}00"))
        saida[f"{proj}/{art}"] = [[x["timestamp"][:8], x["views"]] for x in d.get("items", [])]
    return saida


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


def gdelt(lugares):
    ult = baixar("http://data.gdeltproject.org/gdeltv2/lastupdate.txt").decode().split()
    url = next(x for x in ult if x.endswith(".export.CSV.zip"))
    base_t = datetime.strptime(url.rsplit("/", 1)[1][:14], "%Y%m%d%H%M%S").replace(tzinfo=timezone.utc)
    soma = [0.0] * len(lugares)
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
                if not peso or not c[56] or not c[57]:
                    continue
                try:
                    lat, lon, men = float(c[56]), float(c[57]), int(c[31] or 1)
                except ValueError:
                    continue
                for j, p in enumerate(lugares):
                    km = km_entre(p["lat"], p["lon"], lat, lon)
                    if km > 900:
                        continue
                    soma[j] += peso * math.log1p(men) * math.exp(-((km / 300) ** 2))
                    if km < 300:
                        cont[j][c[28]] = cont[j].get(c[28], 0) + 1
    if not lidos:
        raise RuntimeError("nenhum arquivo GDELT disponível")
    NOMES = {"14": "protestos", "17": "repressão", "18": "agressões", "19": "combates", "20": "violência em massa"}
    saida = []
    for j in range(len(lugares)):
        i = 1 - math.exp(-soma[j] / (6 * lidos / 4))
        nota = ", ".join(f"{n} {NOMES[k]}" for k, n in sorted(cont[j].items(), key=lambda x: -x[1])) or "nada relatado perto"
        saida.append({"i": round(i, 3), "nota": f"última hora · {nota}"})
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
        violencia = [antigos.get(p["nome"], {}).get("violencia") for p in lugares]
        fontes["GDELT"] = f"falhou ({type(e).__name__}) · mantido o último valor"

    try:
        pais = hapi(lugares)
        fontes["HDX"] = "sem identificador · guerra, fome e deslocamento ficam em zero" if pais is None else "ok"
    except Exception as e:
        pais = None
        fontes["HDX"] = f"falhou ({type(e).__name__}) · mantido o último valor"
    antigos = {p["nome"]: p for p in anterior.get("lugares", [])}

    saida_lugares = []
    for p, m, v in zip(lugares, medidas, violencia):
        extra = (pais or {}).get(p["iso3"]) if pais is not None else {k: antigos.get(p["nome"], {}).get(k) for k in ("guerra", "fome", "deslocamento")}
        saida_lugares.append({"nome": p["nome"], "lat": p["lat"], "lon": p["lon"], "iso3": p["iso3"], "db": p.get("db"), "db_fonte": "estimado",
                              **m, "violencia": v, **{k: x for k, x in (extra or {}).items() if x}})

    alertas.sort(key=lambda a: a[0])
    inicio = alertas[0][0] if alertas else iso(AGORA - timedelta(hours=72))
    dados = {"atualizado": iso(AGORA), "inicio": inicio, "fontes": fontes, "alertas": alertas,
             "lugares": saida_lugares, "atencao": atencao, "conflitos": conflitos}

    os.makedirs(os.path.join(RAIZ, "data", "historico", AGORA.strftime("%Y-%m-%d")), exist_ok=True)
    os.makedirs(os.path.join(RAIZ, "docs"), exist_ok=True)
    texto = json.dumps(dados, ensure_ascii=False, separators=(",", ":"))
    for caminho in (os.path.join(RAIZ, "data", "ultimo.json"),
                    os.path.join(RAIZ, "data", "historico", AGORA.strftime("%Y-%m-%d"), AGORA.strftime("%H%M") + ".json")):
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(texto)
    with open(os.path.join(RAIZ, "docs", "dados.js"), "w", encoding="utf-8") as f:
        f.write("window.SIRENE_DATA = " + texto + ";\n")
    print(json.dumps(fontes, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
