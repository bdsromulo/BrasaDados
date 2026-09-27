"""Extract the checked national series and 2025 UF snapshot from FBSP Anuário 2026.

Usage: python scripts/parse-fbsp.py data/official-files/anuario_fbsp_2026.pdf
Prints JSON to stdout. Fails closed when the expected edition or table changes.
"""
import json
import re
import sys
from pypdf import PdfReader

reader = PdfReader(sys.argv[1])
if len(reader.pages) < 159:
    raise ValueError("Anuário 2026 incompleto")
rate = reader.pages[29].extract_text()
ranking = reader.pages[27].extract_text()
fem = reader.pages[158].extract_text()
if "Taxas por 100 mil habitantes" not in rate or "Gráfico 35" not in fem:
    raise ValueError("Tabelas FBSP 2026 não encontradas")

line = next((x for x in rate.splitlines() if x.startswith("Brasil ")), "")
# Text extraction separates the digits of two cells in this PDF; visual inspection
# of page 30 confirms 2020=24,1 and 2025=19,1.
line = line.replace("24, 1", "24,1").replace("1 9,1", "19,1")
values = [float(x.replace(",", ".")) for x in re.findall(r"\d+,\d+", line)]
if len(values) != 14 or values[0] != 27.7 or values[-1] != 19.1:
    raise ValueError("Série de taxas MVI inesperada")
mvi = [[str(2012 + i), value] for i, value in enumerate(values)]

states = [
    ("AC", "Acre"), ("AL", "Alagoas"), ("AP", "Amapá"),
    ("AM", "Amazonas"), ("BA", "Bahia"), ("CE", "Ceará"),
    ("DF", "Distrito Federal"), ("ES", "Espírito Santo"),
    ("GO", "Goiás"), ("MA", "Maranhão"), ("MT", "Mato Grosso"),
    ("MS", "Mato Grosso do Sul"), ("MG", "Minas Gerais"),
    ("PA", "Pará"), ("PB", "Paraíba"), ("PR", "Paraná"),
    ("PE", "Pernambuco"), ("PI", "Piauí"), ("RJ", "Rio de Janeiro"),
    ("RN", "Rio Grande do Norte"), ("RS", "Rio Grande do Sul"),
    ("RO", "Rondônia"), ("RR", "Roraima"), ("SC", "Santa Catarina"),
    ("SP", "São Paulo"), ("SE", "Sergipe"), ("TO", "Tocantins"),
]
rank = []
for uf, name in states:
    text = next((x[len(name):].strip() for x in ranking.splitlines() if x.startswith(name + " ")), "")
    text = re.sub(r"^\(\d+\)\s+", "", text)
    match = re.match(r"[\d.]+\s+[\d.]+\s+\d+,\d+\s+(\d+,\d+)", text)
    if not match:
        raise ValueError(f"Taxa estadual ausente: {uf}")
    rank.append({"uf": uf, "nome": name, "valor": float(match.group(1).replace(",", "."))})
if len(rank) != 27 or rank[0]["valor"] != 21.6 or rank[-1]["valor"] != 19.3:
    raise ValueError("Ranking de UFs inesperado")

graph = fem.split("Gráfico 35", 1)[1].split("Fonte:", 1)[0]
row = re.search(r"\n929\s+1\.075\s+1\.229\s+1\.330\s+1\.354\s+1\.347\s+1\.455\s+1\.475\s+1\.504\s+1\.571", graph)
if not row:
    raise ValueError("Série de feminicídios da edição 2026 alterada")
feminicides = [[str(2016+i),int(x.replace(".", ""))] for i,x in enumerate(row.group().split())]
if len(feminicides) != 10 or feminicides[-1][1] != 1571:
    raise ValueError("Série de feminicídios incompleta")

sys.stdout.reconfigure(encoding="utf-8")
print(json.dumps({"mvi": mvi, "states": rank, "feminicides": feminicides}, ensure_ascii=False, indent=2))
