# Módulo 09 — Módulos y Paquetes

## Módulo

Cualquier archivo `.py` es un **módulo**. Lo importás en otro código:

```python
# math_utils.py
PI = 3.14159

def area_circulo(r):
    return PI * r ** 2
```

```python
# main.py
import math_utils

print(math_utils.PI)
print(math_utils.area_circulo(5))
```

## Formas de importar

```python
import math                           # módulo completo
import math as m                      # con alias
from math import pi, sqrt             # nombres específicos
from math import sqrt as raiz         # con alias
from math import *                    # ⚠️ ANTI-PATRÓN: contamina namespace
```

> **No usar `from x import *`** excepto en `__init__.py` con `__all__` explícito.

## El módulo principal — `__name__`

Cada módulo tiene `__name__`. Cuando se ejecuta directamente, vale `"__main__"`. Cuando se importa, vale el nombre del módulo:

```python
# script.py
def main():
    print("Ejecutando")

if __name__ == "__main__":
    main()
```

Esto permite que un archivo sea **importable y ejecutable** sin efectos colaterales.

## Búsqueda de módulos

Python busca módulos en `sys.path`, en este orden:
1. Directorio del script actual
2. `PYTHONPATH` (variable de entorno)
3. Directorios de la instalación
4. `site-packages` (donde pip instala paquetes)

```python
import sys
print(sys.path)
```

## Paquetes

Un **paquete** es un directorio con un `__init__.py` que agrupa varios módulos:

```
mi_paquete/
├── __init__.py
├── modulo_a.py
├── modulo_b.py
└── subpaquete/
    ├── __init__.py
    └── modulo_c.py
```

```python
from mi_paquete import modulo_a
from mi_paquete.subpaquete import modulo_c
```

### `__init__.py`
Se ejecuta al importar el paquete. Útil para:
- Exponer una API pública con `__all__`
- Re-exportar símbolos importantes

```python
# mi_paquete/__init__.py
from .modulo_a import funcion_publica
from .modulo_b import ClasePrincipal

__all__ = ["funcion_publica", "ClasePrincipal"]
__version__ = "1.0.0"
```

### Imports relativos
Dentro de un paquete:
```python
from . import modulo_b           # mismo paquete
from .modulo_b import x
from ..otro import y             # paquete padre
```

## Entornos virtuales

Cada proyecto debe tener su **virtualenv** para aislar dependencias:

```bash
# Crear
python -m venv .venv

# Activar
# Linux/macOS:
source .venv/bin/activate
# Windows (cmd):
.venv\Scripts\activate.bat
# Windows (PowerShell):
.venv\Scripts\Activate.ps1

# Verificar
which python      # debería apuntar al venv

# Desactivar
deactivate
```

## pip — gestor de paquetes

```bash
pip install requests                  # última versión
pip install "requests>=2.28,<3"       # rango
pip install -r requirements.txt       # desde archivo
pip install -e .                      # paquete local en modo editable
pip uninstall requests
pip list                              # paquetes instalados
pip show requests                     # info detallada
pip freeze > requirements.txt         # exporta versiones exactas
```

### `requirements.txt`
```
requests==2.31.0
pandas>=2.0,<3.0
fastapi
```

> **Recomendado**: usar `pip-compile` (de pip-tools) o `uv` para lockfiles deterministas.

## Estructura de proyecto recomendada

```
mi_proyecto/
├── pyproject.toml              # metadata moderna (PEP 621)
├── README.md
├── .gitignore
├── .venv/                      # no commitear
├── src/
│   └── mi_paquete/
│       ├── __init__.py
│       └── ...
├── tests/
│   ├── __init__.py
│   └── test_*.py
└── requirements.txt
```

### `pyproject.toml` mínimo
```toml
[project]
name = "mi-paquete"
version = "0.1.0"
description = "..."
requires-python = ">=3.11"
dependencies = [
    "requests>=2.28",
]

[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"
```

## Herramientas modernas

| Herramienta | Para qué |
|-------------|----------|
| `uv` | Reemplazo ultrarrápido de pip+venv (Astral) |
| `poetry` | Gestor de dependencias y packaging |
| `pdm` | Alternativa a poetry |
| `ruff` | Linter + formatter ultrarrápido |
| `mypy` | Type checker estático |
| `pytest` | Framework de testing |

### uv — el reemplazo moderno (recomendado 2025)
```bash
uv venv                    # crea venv
uv pip install requests    # instala
uv pip compile reqs.in -o reqs.txt
```

## Ejercicios

1. Crear un paquete `calculadora/` con módulos `aritmetica.py` y `geometria.py`
2. Configurar un venv para un nuevo proyecto y instalar `requests`
3. Generar un `requirements.txt` con `pip freeze`
4. Reorganizar un script monolítico en 3 módulos separados
5. Crear un `pyproject.toml` válido para un proyecto pequeño
