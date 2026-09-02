# Módulo 08 — Archivos e I/O

## Abrir y cerrar archivos

### Forma manual (no recomendada)
```python
f = open("datos.txt", "r")
contenido = f.read()
f.close()              # ⚠️ si hay excepción antes, no se cierra
```

### Forma correcta — `with`
```python
with open("datos.txt", "r", encoding="utf-8") as f:
    contenido = f.read()
# se cierra automáticamente, incluso si hay excepción
```

> **Siempre especificar `encoding="utf-8"`** — en Windows el default es cp1252, que falla con caracteres no-ASCII.

## Modos de apertura

| Modo | Significado |
|------|-------------|
| `r` | Lectura (default) — falla si no existe |
| `w` | Escritura — **trunca** el archivo |
| `a` | Append — agrega al final |
| `x` | Exclusivo — falla si ya existe |
| `r+` | Lectura y escritura |
| `b` | Binario (combinar: `rb`, `wb`) |
| `t` | Texto (default) |

## Leer

```python
with open("datos.txt", encoding="utf-8") as f:
    todo = f.read()                  # todo como string
    
with open("datos.txt", encoding="utf-8") as f:
    primera_linea = f.readline()     # una sola línea
    segunda_linea = f.readline()
    
with open("datos.txt", encoding="utf-8") as f:
    lineas = f.readlines()           # lista de líneas
    
with open("datos.txt", encoding="utf-8") as f:
    for linea in f:                  # iteración línea por línea (recomendado para archivos grandes)
        print(linea.rstrip())
```

## Escribir

```python
with open("salida.txt", "w", encoding="utf-8") as f:
    f.write("Primera línea\n")
    f.write("Segunda línea\n")
    f.writelines(["a\n", "b\n", "c\n"])

# Append
with open("log.txt", "a", encoding="utf-8") as f:
    f.write(f"{datetime.now()}: evento\n")
```

## Archivos binarios

```python
with open("imagen.jpg", "rb") as f:
    bytes_data = f.read()

with open("copia.jpg", "wb") as f:
    f.write(bytes_data)
```

## Pathlib (forma moderna)

`pathlib` reemplaza a `os.path` con una API orientada a objetos:

```python
from pathlib import Path

p = Path("datos") / "archivos" / "input.txt"
p.exists()              # True/False
p.is_file()
p.is_dir()
p.suffix                # '.txt'
p.stem                  # 'input'
p.name                  # 'input.txt'
p.parent                # Path('datos/archivos')
p.absolute()
p.read_text(encoding="utf-8")
p.write_text("contenido", encoding="utf-8")
p.read_bytes()
p.write_bytes(b"...")

# Crear directorios
Path("logs").mkdir(exist_ok=True)
Path("a/b/c").mkdir(parents=True, exist_ok=True)

# Listar
for archivo in Path(".").iterdir():
    print(archivo)

for archivo in Path(".").glob("*.py"):
    print(archivo)

for archivo in Path(".").rglob("*.py"):    # recursivo
    print(archivo)

# Eliminar
Path("temp.txt").unlink(missing_ok=True)   # archivo
Path("vacio").rmdir()                       # directorio vacío
```

## JSON

```python
import json

datos = {"nombre": "Ana", "edad": 30, "tags": ["a", "b"]}

# Escribir
with open("usuario.json", "w", encoding="utf-8") as f:
    json.dump(datos, f, indent=2, ensure_ascii=False)

# Leer
with open("usuario.json", encoding="utf-8") as f:
    leido = json.load(f)

# String <-> dict
texto = json.dumps(datos, indent=2)
de_texto = json.loads(texto)
```

### Tipos compatibles JSON
`dict`, `list`, `tuple`, `str`, `int`, `float`, `bool`, `None`. Tipos custom requieren `default=` en `dump`.

## CSV

```python
import csv

# Leer
with open("personas.csv", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    for fila in reader:
        print(fila)

# Leer como dict (con header)
with open("personas.csv", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    for fila in reader:
        print(fila["nombre"], fila["edad"])

# Escribir
with open("salida.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["nombre", "edad"])
    writer.writerows([("Ana", 30), ("Luis", 25)])

# Escribir con dict
with open("salida.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["nombre", "edad"])
    writer.writeheader()
    writer.writerow({"nombre": "Ana", "edad": 30})
```

> `newline=""` es importante en Windows para evitar líneas en blanco extras.

## Otros formatos

| Formato | Módulo | Notas |
|---------|--------|-------|
| YAML | `pyyaml` (externo) | `pip install pyyaml` |
| TOML | `tomllib` (3.11+, lectura) / `tomli-w` (escritura) | Config moderna |
| XML | `xml.etree.ElementTree` | Built-in |
| Excel | `openpyxl` (externo) | `.xlsx` |
| Pickle | `pickle` | Solo Python — no usar con datos no confiables |

## Streams estándar

```python
import sys

sys.stdin           # entrada
sys.stdout          # salida normal
sys.stderr          # errores

print("error", file=sys.stderr)

# Leer todo de stdin (típico para pipes)
datos = sys.stdin.read()
```

## Argumentos de línea de comandos

```python
import sys

# Forma simple
script, *argumentos = sys.argv

# Forma robusta
import argparse
parser = argparse.ArgumentParser(description="Procesa archivos")
parser.add_argument("input", help="Archivo de entrada")
parser.add_argument("--output", default="salida.txt")
parser.add_argument("--verbose", "-v", action="store_true")
args = parser.parse_args()
print(args.input, args.output, args.verbose)
```

## Ejercicios

1. Leer un `.txt` y contar palabras, líneas y caracteres
2. Convertir un CSV a JSON
3. Buscar todos los `.py` recursivamente y reportar los más grandes
4. Crear un logger que escriba a archivo con timestamp
5. Script que reciba `--input` y `--output` con argparse y haga conversión de mayúsculas
