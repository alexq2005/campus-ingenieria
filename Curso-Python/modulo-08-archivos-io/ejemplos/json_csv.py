"""Ejemplo: leer CSV, transformar y escribir JSON."""

import csv
import json
from pathlib import Path

CSV_DEMO = """nombre,edad,ciudad
Ana,30,Buenos Aires
Luis,25,Córdoba
Eva,40,Rosario
"""


def main() -> None:
    base = Path(__file__).parent
    csv_path = base / "personas.csv"
    json_path = base / "personas.json"

    csv_path.write_text(CSV_DEMO, encoding="utf-8")

    personas: list[dict] = []
    with csv_path.open(encoding="utf-8", newline="") as f:
        for fila in csv.DictReader(f):
            fila["edad"] = int(fila["edad"])
            personas.append(fila)

    json_path.write_text(
        json.dumps(personas, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print(f"Convertidas {len(personas)} personas → {json_path}")


if __name__ == "__main__":
    main()
