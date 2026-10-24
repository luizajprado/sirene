"""
Robô da Bolsa da Aflição · Sirene (Luiza Jesus do Prado, 2026)

Depois de cada coleta, procura o ativo de aflição que mais se moveu em 24 horas e,
se o movimento for forte, publica um boletim no Bluesky na língua do mercado,
ao lado do que a bolsa de valores fez no mesmo dia.

Só publica se existirem os secrets BSKY_HANDLE e BSKY_APP_PASSWORD (uma senha de app,
criada em Bluesky → Configurações → Privacidade e segurança → Senhas de app).
Sem eles, só mostra no log o que publicaria.

Limites: no máximo 4 publicações por dia e pelo menos 3 horas entre elas.
O estado fica em data/robo.json.
"""
import json
import os
import urllib.request
from datetime import datetime, timedelta, timezone

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGORA = datetime.now(timezone.utc)
SITE = "https://luizajprado.github.io/sirene/observatorio/"

ATIVOS = {
    "VIOL": ("violência e crise política", "msf.org"),
    "GUER": ("guerra", "msf.org"),
    "FOME": ("fome", "wfp.org"),
    "DESL": ("deslocamento forçado", "unhcr.org"),
    "ANSI": ("aflição coletiva", "findahelpline.com"),
    "ECON": ("pressão econômica", "findahelpline.com"),
    "CUID": ("cuidado (contraponto)", "reliefweb.int"),
}
MOVIMENTO_MIN = 20.0   # % em 24 h
VALOR_MIN = 0.15       # índice de 0 a 1
MAX_DIA, INTERVALO_H = 4, 3


def carregar(caminho, padrao):
    try:
        with open(caminho, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return padrao


def num(x, casas=1):
    return f"{x:.{casas}f}".replace(".", ",")


CODIGOS = {"Planalto Tibetano, China": "TIB", "Norte da Austrália": "AUN", "Okavango, Botsuana": "OKA", "Sudão do Sul": "SSD",
           "Costa do Pacífico, México": "PAC", "Vanuatu": "VAN", "Nova Escócia, Canadá": "NSC", "São Paulo": "SAO", "Nova Délhi": "DEL",
           "Lagos": "LOS", "Cairo": "CAI", "Jacarta": "JKT", "Cidade do México": "MEX", "Madri": "MAD", "Daca": "DAC", "Pequim": "PEK", "Tromsø": "TOS"}


def sigla(nome):  # os mesmos códigos do terminal
    return CODIGOS.get(nome) or "".join(c for c in nome.upper() if "A" <= c <= "Z")[:3]


def escolher(serie):
    if len(serie) < 6:
        return None
    agora, antes = serie[-1]["lugares"], serie[max(0, len(serie) - 25)]["lugares"]
    melhor = None
    for lugar, reg in agora.items():
        for k in ATIVOS:
            v, v0 = reg.get(k), (antes.get(lugar) or {}).get(k)
            if v is None or v0 is None or v0 <= 0.01 or max(v, v0) < VALOR_MIN:
                continue
            d = (v - v0) / v0 * 100
            if abs(d) >= MOVIMENTO_MIN and (melhor is None or abs(d) > abs(melhor[3])):
                melhor = (k, lugar, v, d)
    return melhor


def texto(escolha, mercado):
    k, lugar, v, d = escolha
    nome, ajuda = ATIVOS[k]
    verbo = ("dispara" if d > 50 else "sobe") if d > 0 else ("despenca" if d < -50 else "cai")
    linhas = [f"{k}.{sigla(lugar)} ({lugar}) {verbo} {num(abs(d))}% em 24 h e fecha a {num(v * 100)}. Ativo: {nome}."]
    sp = (mercado or {}).get("SP500")
    if sp and sp[1]:
        dsp = (sp[0] - sp[1]) / sp[1] * 100
        linhas.append(f"No mesmo pregão, o S&P 500 {'subiu' if dsp >= 0 else 'caiu'} {num(abs(dsp), 2)}%.")
    if k == "CUID":
        linhas.append("Cooperação também é notícia, só circula menos.")
    else:
        linhas.append(f"Para fazer cair: {ajuda}")
    linhas.append(SITE)
    t = "\n".join(linhas)
    return t if len(t) <= 300 else t[:297] + "..."


def facetas(t):
    """Torna os endereços clicáveis no Bluesky (posições em bytes UTF-8)."""
    out, b = [], t.encode("utf-8")
    for alvo in [SITE] + sorted({a for _, a in ATIVOS.values()}):
        url = alvo if alvo.startswith("http") else "https://" + alvo
        i = b.find(alvo.encode("utf-8"))
        if i >= 0 and not any(f["index"]["byteStart"] <= i < f["index"]["byteEnd"] for f in out):
            out.append({"index": {"byteStart": i, "byteEnd": i + len(alvo.encode("utf-8"))},
                        "features": [{"$type": "app.bsky.richtext.facet#link", "uri": url}]})
    return out


def xrpc(metodo, corpo, token=None):
    req = urllib.request.Request(f"https://bsky.social/xrpc/{metodo}", data=json.dumps(corpo).encode(),
                                 headers={"Content-Type": "application/json", **({"Authorization": f"Bearer {token}"} if token else {})})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def main():
    serie = carregar(os.path.join(RAIZ, "data", "serie.json"), [])
    dados = carregar(os.path.join(RAIZ, "data", "ultimo.json"), {})
    estado_c = os.path.join(RAIZ, "data", "robo.json")
    estado = carregar(estado_c, {"publicados": []})

    escolha = escolher(serie)
    if not escolha:
        print("robô: nenhum movimento forte nesta hora")
        return
    t = texto(escolha, dados.get("mercado"))
    print("robô, boletim:\n" + t)

    recentes = [p for p in estado["publicados"] if datetime.fromisoformat(p["t"]) > AGORA - timedelta(hours=24)]
    if len(recentes) >= MAX_DIA or (recentes and datetime.fromisoformat(recentes[-1]["t"]) > AGORA - timedelta(hours=INTERVALO_H)):
        print("robô: limite de publicações, fica para depois")
        return
    if any(p.get("ativo") == f"{escolha[0]}|{escolha[1]}" for p in recentes):
        print("robô: este ativo já foi noticiado nas últimas 24 h")
        return

    handle, senha = os.environ.get("BSKY_HANDLE"), os.environ.get("BSKY_APP_PASSWORD")
    if not handle or not senha:
        print("robô: sem BSKY_HANDLE e BSKY_APP_PASSWORD, nada foi publicado")
        return
    sessao = xrpc("com.atproto.server.createSession", {"identifier": handle, "password": senha})
    registro = {"$type": "app.bsky.feed.post", "text": t, "facets": facetas(t), "langs": ["pt"],
                "createdAt": AGORA.strftime("%Y-%m-%dT%H:%M:%S.000Z")}
    xrpc("com.atproto.repo.createRecord", {"repo": sessao["did"], "collection": "app.bsky.feed.post", "record": registro}, sessao["accessJwt"])
    estado["publicados"] = (recentes + [{"t": AGORA.isoformat(), "ativo": f"{escolha[0]}|{escolha[1]}", "texto": t}])[-20:]
    with open(estado_c, "w", encoding="utf-8") as f:
        json.dump(estado, f, ensure_ascii=False, indent=1)
    print("robô: publicado")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # o robô nunca derruba a coleta
        print(f"robô: falhou ({type(e).__name__}: {e})")
