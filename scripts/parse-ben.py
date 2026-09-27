"""Extract the comparable Brazilian electricity-mix values in BEN 2026.

Requires pypdf. This intentionally reads only the total electricity supply bars
on printed page 35, excluding the differently defined centralized-generation bar.
"""

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader


pdf = Path(sys.argv[1] if len(sys.argv) > 1 else "data/official-files/ben_sintese_2026.pdf")
text = PdfReader(str(pdf)).pages[34].extract_text(extraction_mode="layout")
if "BEN 2026" not in text or "Ano base 2025" not in text:
    raise ValueError("Edição do BEN inesperada")
values = {}
for line in text.splitlines():
    match = re.match(r"^\s*Brasil \((202[345])\)\D+?(\d{2},\d)%", line)
    if match:
        year, value = match.groups()
        if year in values:
            raise ValueError(f"Ano duplicado: {year}")
        values[year] = float(value.replace(",", "."))
if values != {"2023": 89.2, "2024": 88.2, "2025": 86.8}:
    raise ValueError(f"Valores ou estrutura do BEN 2026 inesperados: {values}")
output = Path("data/official-files/ben-series.json")
output.write_text(json.dumps([[year, values[year]] for year in sorted(values)], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(output)
