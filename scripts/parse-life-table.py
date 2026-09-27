"""Extract Table 1 of IBGE TCMB 2024 without inferring missing years.

Usage: python scripts/parse-life-table.py data/official-files/tcmb_2024.pdf
Writes JSON to stdout. The exact edition and table structure are validated.
Requires pypdf; this script does not fetch or publish data.
"""
import json
import re
import sys
from pypdf import PdfReader

reader = PdfReader(sys.argv[1])
page = next((p.extract_text() for p in reader.pages if 'Tabela 1 - Expectativa de vida ao nascer' in p.extract_text()), '')
if not page or '1940/2024' not in page:
    raise ValueError('Expected TCMB 2024, Table 1. Review a new edition separately.')
rows = re.findall(r'^\s*(\d{4})\s+(\d+,\d+)\s+(\d+,\d+)\s+(\d+,\d+)\s+(\d+,\d+)\s*$', page, re.M)
if len(rows) != 14 or rows[0][0] != '1940' or rows[-1][0] != '2024':
    raise ValueError('Unexpected row count or coverage; refusing partial extraction.')
series = [{'id': code, 'nome': name, 'dados': [[row[0], float(row[column].replace(',', '.'))] for row in rows]} for column, code, name in [(1, 'total', 'Total'), (2, 'homens', 'Homens'), (3, 'mulheres', 'Mulheres')]]
sys.stdout.reconfigure(encoding='utf-8')
print(json.dumps(series, ensure_ascii=False, indent=2))
