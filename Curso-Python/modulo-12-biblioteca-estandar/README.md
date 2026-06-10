# Módulo 12 — Biblioteca Estándar Esencial

Python viene con "baterías incluidas". Un tour rápido por los módulos más útiles.

## `os` y `sys`

```python
import os
import sys

# Variables de entorno
os.environ.get("HOME", "/home/default")
os.environ["MI_VAR"] = "valor"

# Sistema de archivos
os.getcwd()                        # directorio actual
os.chdir("/tmp")
os.listdir(".")
os.makedirs("a/b/c", exist_ok=True)
os.remove("archivo.txt")

# Procesos
os.system("ls")                    # ⚠️ inseguro con input de usuario; preferir subprocess
os.getpid()
os.cpu_count()

# sys
sys.argv                           # argumentos de línea de comandos
sys.platform                       # 'win32', 'linux', 'darwin'
sys.exit(1)                        # termina con código
sys.path                           # paths donde busca módulos
```

## `pathlib` (visto en módulo 08, pero crítico)

```python
from pathlib import Path
Path.home()
Path.cwd()
```

## `datetime`

```python
from datetime import datetime, date, time, timedelta, timezone

ahora = datetime.now()
hoy = date.today()
utc = datetime.now(timezone.utc)

# Crear
fecha = datetime(2024, 3, 15, 10, 30, 0)

# Aritmética
manana = ahora + timedelta(days=1)
hace_un_mes = ahora - timedelta(days=30)

# Formato
ahora.strftime("%Y-%m-%d %H:%M:%S")
parsed = datetime.strptime("2024-03-15", "%Y-%m-%d")

# ISO
ahora.isoformat()
datetime.fromisoformat("2024-03-15T10:30:00")
```

### Tabla de format codes
| Código | Significado | Ejemplo |
|--------|-------------|---------|
| `%Y` | Año (4 dígitos) | 2024 |
| `%m` | Mes (01-12) | 03 |
| `%d` | Día (01-31) | 15 |
| `%H` | Hora (00-23) | 14 |
| `%M` | Minuto | 30 |
| `%S` | Segundo | 45 |
| `%A` | Día semana | Friday |
| `%B` | Mes completo | March |

## `re` — expresiones regulares

```python
import re

# Match
re.match(r"\d+", "123abc")          # match al inicio
re.search(r"\d+", "abc123")         # match en cualquier posición
re.findall(r"\d+", "a1 b22 c333")  # ['1', '22', '333']

# Captura de grupos
m = re.search(r"(\w+)@(\w+)", "ana@example.com")
m.group(0)   # 'ana@example'
m.group(1)   # 'ana'
m.group(2)   # 'example'

# Sustitución
re.sub(r"\s+", "_", "hola   mundo")   # 'hola_mundo'

# Compilar para reutilizar
patron = re.compile(r"\d{4}-\d{2}-\d{2}")
patron.findall("2024-03-15 y 2025-01-01")
```

### Cheatsheet de regex
```
.        cualquier carácter (excepto \n)
\d \D    dígito / no dígito
\w \W    palabra / no palabra
\s \S    espacio / no espacio
^ $      inicio / fin de línea
*        0 o más
+        1 o más
?        0 o 1
{n,m}    entre n y m
[abc]    cualquiera de a, b, c
[^abc]   ninguno de
(...)    grupo de captura
(?:...)  grupo sin captura
```

## `collections`

```python
from collections import Counter, defaultdict, deque, OrderedDict, namedtuple

# Counter
Counter("mississippi")           # {'i': 4, 's': 4, 'p': 2, 'm': 1}

# defaultdict
grupos = defaultdict(list)
grupos["frutas"].append("manzana")   # no falla si no existe la clave

# deque (cola eficiente)
d = deque([1,2,3], maxlen=5)
d.appendleft(0)
d.append(4)

# namedtuple
Punto = namedtuple("Punto", ["x", "y"])
p = Punto(3, 4)
```

## `json`, `csv`, `pickle`

(Visto en módulo 08)

## `random`

```python
import random

random.random()                  # float [0.0, 1.0)
random.uniform(1, 10)            # float [1, 10]
random.randint(1, 6)             # int [1, 6] inclusive
random.choice(["a", "b", "c"])
random.choices(lista, k=3)       # con reposición
random.sample(lista, k=3)        # sin reposición
random.shuffle(lista)            # in-place

random.seed(42)                  # reproducibilidad
```

> Para criptografía usá `secrets`, no `random`.

## `secrets`

```python
import secrets
secrets.token_hex(16)            # token aleatorio criptográficamente seguro
secrets.token_urlsafe(32)
secrets.choice(["a", "b", "c"])
secrets.compare_digest(a, b)     # comparación constant-time
```

## `math` y `statistics`

```python
import math
math.pi, math.e, math.tau, math.inf, math.nan
math.sqrt(16)
math.floor(3.7), math.ceil(3.2)
math.gcd(12, 18)
math.factorial(10)
math.log(100, 10)
math.sin(math.pi/2)

import statistics
statistics.mean([1,2,3,4])         # 2.5
statistics.median([1,2,3,4,5])     # 3
statistics.stdev([1,2,3,4,5])      # desviación estándar
```

## `subprocess` — ejecutar comandos

```python
import subprocess

# Forma moderna y segura
result = subprocess.run(
    ["ls", "-la"],
    capture_output=True,
    text=True,
    check=True,                  # lanza CalledProcessError si falla
)
print(result.stdout)
print(result.returncode)
```

> **Nunca uses `shell=True` con input de usuario** — riesgo de inyección.

## `argparse` — CLI parsing

```python
import argparse

parser = argparse.ArgumentParser(description="Mi script")
parser.add_argument("input", help="archivo de entrada")
parser.add_argument("--output", "-o", default="out.txt")
parser.add_argument("--verbose", "-v", action="store_true")
parser.add_argument("--workers", type=int, default=4)
parser.add_argument("--mode", choices=["fast", "slow"], required=True)

args = parser.parse_args()
print(args.input, args.output, args.workers)
```

## `logging`

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler(),
    ],
)

log = logging.getLogger(__name__)

log.debug("detalle interno")
log.info("evento normal")
log.warning("algo raro")
log.error("error")
log.critical("fallo grave")
log.exception("incluye traceback")    # solo dentro de except
```

## `urllib` y `http`

```python
from urllib.request import urlopen
from urllib.parse import urlparse, urlencode

with urlopen("https://example.com") as r:
    html = r.read().decode("utf-8")
```

> Para HTTP serio usá `requests` (externo) o `httpx`.

## `unittest` (testing built-in)

```python
import unittest

class TestSuma(unittest.TestCase):
    def test_basica(self):
        self.assertEqual(2 + 2, 4)
    
    def test_excepcion(self):
        with self.assertRaises(ZeroDivisionError):
            1 / 0

if __name__ == "__main__":
    unittest.main()
```

> Para testing moderno preferí `pytest` (externo).

## Otros módulos útiles

| Módulo | Para qué |
|--------|----------|
| `hashlib` | SHA, MD5, etc. |
| `base64` | Codificación base64 |
| `gzip`, `zipfile`, `tarfile` | Compresión |
| `socket` | Networking de bajo nivel |
| `sqlite3` | Base de datos SQLite (built-in) |
| `tempfile` | Archivos temporales seguros |
| `shutil` | Copiar/mover archivos y directorios |
| `time` | Tiempo, sleep |
| `dataclasses` | Clases de datos boilerplate-free |
| `enum` | Enumeraciones |
| `typing` | Type hints avanzados |

## Ejercicios

1. Script que lea logs y extraiga IPs únicas con `re`
2. CLI con `argparse` que reciba archivo y modo (json/csv/yaml)
3. Backup de un directorio a `.zip` con `shutil` y `zipfile`
4. Script que loguee a archivo con rotación cada 1MB usando `logging.handlers.RotatingFileHandler`
5. Convertir lista de timestamps Unix a formato ISO con `datetime`
