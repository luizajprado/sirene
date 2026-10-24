"""
Observatório · bancos de pesquisa em saúde mental (Sirene, Luiza Jesus do Prado, 2026)

- Europe PMC: artigos publicados na última semana, por tema.
- ClinicalTrials.gov: ensaios clínicos em saúde mental recrutando agora, e quem os financia.
- openFDA (FAERS): notificações de efeitos adversos de remédios psiquiátricos nos EUA. Uma vez por dia.
- PubChem: dados químicos dos mediadores e dos remédios (fórmula, massa). Só o que ainda não estiver salvo.

Notificação não é prova de que o remédio causou o efeito; o site diz isso junto dos números.
"""
import json
import os
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGORA = datetime.now(timezone.utc)
UA = "Sirene/1.0 (obra de arte de dados; github.com/luizajprado/sirene)"

TEMAS = {
    "estresse e cortisol": '(stress AND (cortisol OR "HPA axis" OR allostatic))',
    "clima, calor e ar": '(("climate change" OR heatwave OR "air pollution" OR PM2.5) AND ("mental health" OR depression OR anxiety))',
    "guerra, violência e refúgio": '((war OR "armed conflict" OR violence OR refugee*) AND (PTSD OR "mental health" OR trauma))',
    "fome e pobreza": '(("food insecurity" OR poverty OR "cash transfer*" OR debt) AND ("mental health" OR depression OR anxiety))',
    "remédios: efeitos pouco falados": '((antidepressant* OR SSRI* OR benzodiazepine* OR antipsychotic*) AND (withdrawal OR discontinuation OR fracture* OR "bone mineral density" OR "sexual dysfunction" OR "weight gain"))',
    "inflamação e mente": '((inflammation OR "interleukin-6" OR cytokine*) AND (depression OR psychosis OR anxiety))',
    "cuidado e comunidade": '(("peer support" OR "community health worker*" OR "social prescribing" OR "task-sharing") AND ("mental health" OR depression))',
}
REMEDIOS = ["sertraline", "fluoxetine", "escitalopram", "paroxetine", "venlafaxine", "bupropion",
            "quetiapine", "olanzapine", "lithium", "clonazepam", "alprazolam", "methylphenidate"]
MEDIADORES = {"ADR": "epinephrine", "NOR": "norepinephrine", "COR": "cortisol", "GLU": "glutamic acid", "SER": "serotonin",
              "MEL": "melatonin", "OXT": "oxytocin", "DOP": "dopamine", "GABA": "gamma-aminobutyric acid", "GRE": "ghrelin"}


def baixar(url, timeout=45):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())


def carregar(caminho, padrao):
    try:
        with open(caminho, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return padrao


def artigos():
    desde = (AGORA - timedelta(days=7)).strftime("%Y-%m-%d")
    ate = AGORA.strftime("%Y-%m-%d")
    out = {}
    for tema, q in TEMAS.items():
        query = f"{q} AND FIRST_PDATE:[{desde} TO {ate}] AND SRC:MED"
        d = baixar("https://www.ebi.ac.uk/europepmc/webservices/rest/search?" + urllib.parse.urlencode(
            {"query": query, "format": "json", "pageSize": 6, "sort": "FIRST_PDATE desc", "resultType": "lite"}))
        res = d.get("resultList", {}).get("result", [])
        out[tema] = {"total": d.get("hitCount", 0), "itens": [{
            "titulo": r.get("title", "").rstrip("."), "revista": r.get("journalTitle"), "data": r.get("firstPublicationDate"),
            "autores": (r.get("authorString") or "").split(",")[0] + (" et al." if "," in (r.get("authorString") or "") else ""),
            "link": f"https://europepmc.org/article/MED/{r['pmid']}" if r.get("pmid") else (f"https://doi.org/{r['doi']}" if r.get("doi") else None),
        } for r in res]}
    return out


def ensaios():
    cond = "depression OR anxiety OR PTSD OR schizophrenia OR bipolar OR suicide OR psychosis"
    base = "https://clinicaltrials.gov/api/v2/studies?"
    d = baixar(base + urllib.parse.urlencode({"query.cond": cond, "filter.overallStatus": "RECRUITING", "countTotal": "true",
                                               "pageSize": 100, "sort": "LastUpdatePostDate:desc"}), timeout=90)
    estudos = d.get("studies", [])
    industria = sum(1 for s in estudos if s.get("protocolSection", {}).get("sponsorCollaboratorsModule", {}).get("leadSponsor", {}).get("class") == "INDUSTRY")
    recentes = []
    for s in estudos[:8]:
        p = s.get("protocolSection", {})
        recentes.append({
            "id": p.get("identificationModule", {}).get("nctId"),
            "titulo": p.get("identificationModule", {}).get("briefTitle"),
            "condicoes": p.get("conditionsModule", {}).get("conditions", [])[:3],
            "intervencoes": [i.get("name") for i in p.get("armsInterventionsModule", {}).get("interventions", [])][:3],
            "patrocinador": p.get("sponsorCollaboratorsModule", {}).get("leadSponsor", {}).get("name"),
            "classe": p.get("sponsorCollaboratorsModule", {}).get("leadSponsor", {}).get("class"),
        })
    return {"total": d.get("totalCount"), "amostra": len(estudos), "industria": industria, "recentes": recentes}


def farmaco():
    base = "https://api.fda.gov/drug/event.json?"
    out = {}
    for r in REMEDIOS:
        q = f'patient.drug.openfda.generic_name:"{r}"'
        try:
            total = baixar(base + urllib.parse.urlencode({"search": q, "limit": 1}))["meta"]["results"]["total"]
            termos = baixar(base + urllib.parse.urlencode({"search": q, "count": "patient.reaction.reactionmeddrapt.exact", "limit": 1000}))["results"]
            soma = lambda *chaves: sum(x["count"] for x in termos if any(c in x["term"].lower() for c in chaves))
            out[r] = {"relatos": total, "top": [[x["term"].lower(), x["count"]] for x in termos[:12]],
                      "osso": soma("osteopor", "osteopen", "bone density", "bone loss"), "fratura": soma("fracture"),
                      "abstinencia": soma("withdrawal", "discontinuation"), "sexual": soma("sexual", "libido", "erectile", "anorgasmia")}
        except Exception as e:
            out[r] = {"erro": type(e).__name__}
    return out


def moleculas(salvas):
    nomes = {**MEDIADORES, **{r: r for r in REMEDIOS}}
    for chave, nome in nomes.items():
        if chave in salvas:
            continue
        try:
            d = baixar("https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + urllib.parse.quote(nome)
                       + "/property/MolecularFormula,MolecularWeight,XLogP,IUPACName/JSON")
            p = d["PropertyTable"]["Properties"][0]
            salvas[chave] = {"nome": nome, "cid": p.get("CID"), "formula": p.get("MolecularFormula"),
                             "massa": float(p.get("MolecularWeight")), "xlogp": p.get("XLogP"), "iupac": p.get("IUPACName")}
        except Exception:
            pass
    return salvas


def coletar():
    """Chamado pelo coletor principal. Devolve o bloco 'pesquisa' e registra o estado de cada fonte."""
    caminho = os.path.join(RAIZ, "data", "pesquisa.json")
    antes = carregar(caminho, {})
    out, fontes = dict(antes), {}
    try:
        out["artigos"] = artigos(); fontes["Europe PMC"] = "ok"
    except Exception as e:
        fontes["Europe PMC"] = f"falhou ({type(e).__name__}) · mantido o último"
    try:
        out["ensaios"] = ensaios(); fontes["ClinicalTrials.gov"] = "ok"
    except Exception as e:
        fontes["ClinicalTrials.gov"] = f"falhou ({type(e).__name__}) · mantido o último"
    ultimo_fda = antes.get("farmaco_em", "")
    if not ultimo_fda or ultimo_fda[:10] != AGORA.strftime("%Y-%m-%d"):   # uma vez por dia, para respeitar o limite da API
        try:
            out["farmaco"] = farmaco(); out["farmaco_em"] = AGORA.strftime("%Y-%m-%dT%H:%MZ"); fontes["openFDA"] = "ok"
        except Exception as e:
            fontes["openFDA"] = f"falhou ({type(e).__name__}) · mantido o último"
    else:
        fontes["openFDA"] = "ok · atualizado hoje"
    try:
        out["moleculas"] = moleculas(antes.get("moleculas", {})); fontes["PubChem"] = f"ok · {len(out['moleculas'])} moléculas"
    except Exception as e:
        fontes["PubChem"] = f"falhou ({type(e).__name__})"
    out["atualizado"] = AGORA.strftime("%Y-%m-%dT%H:%MZ")
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    return out, fontes


if __name__ == "__main__":
    o, f = coletar()
    print(json.dumps(f, ensure_ascii=False, indent=1))
