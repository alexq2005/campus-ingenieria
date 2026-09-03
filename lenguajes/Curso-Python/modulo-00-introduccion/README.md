# Módulo 00 — Introducción a Python

## ¿Qué es Python?

Python es un lenguaje de programación **interpretado**, **multiparadigma** y **de tipado dinámico** creado por Guido van Rossum en 1991. Su filosofía prioriza la legibilidad: el código Python se parece a pseudocódigo bien escrito.

### Características clave

| Característica | Significado |
|----------------|-------------|
| **Interpretado** | No compilás a binario — un intérprete ejecuta el código línea por línea |
| **Tipado dinámico** | Las variables no declaran tipo; el tipo se infiere en runtime |
| **Tipado fuerte** | No mezcla tipos arbitrariamente: `"3" + 1` es error, no `"31"` |
| **Multiparadigma** | Soporta procedural, orientado a objetos y funcional |
| **Batteries included** | Biblioteca estándar enorme (red, archivos, criptografía, etc.) |
| **Indentación obligatoria** | Los bloques se definen por sangría, no por `{}` |

## ¿Para qué se usa?

- **Ciencia de datos y ML**: pandas, numpy, scikit-learn, PyTorch
- **Web backend**: Django, Flask, FastAPI
- **Automatización y scripting**: tareas DevOps, parsing de archivos
- **Educación**: el lenguaje #1 enseñado en universidades
- **Finanzas y trading**: bots algorítmicos, análisis cuantitativo

## Instalación

### Windows
1. Descargar instalador de [python.org](https://www.python.org/downloads/)
2. **MARCAR** "Add Python to PATH" durante la instalación
3. Verificar: `python --version`

### macOS
```bash
brew install python@3.12
```

### Linux (Debian/Ubuntu)
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

## Primer programa

Crear `hola.py`:

```python
print("Hola, mundo")
```

Ejecutar:
```bash
python hola.py
```

## El intérprete interactivo (REPL)

```bash
$ python
>>> 2 + 2
4
>>> "hola".upper()
'HOLA'
>>> exit()
```

El REPL es ideal para experimentar. **Úsalo constantemente** mientras aprendés.

## Editor recomendado

**VS Code** con la extensión oficial de Python:
- Resaltado de sintaxis
- Autocompletado
- Linter (Pylint o Ruff)
- Debugger integrado

## El Zen de Python

```python
import this
```

Imprime los 19 principios de diseño del lenguaje. Vale la pena leerlos cada cierto tiempo.

## Versiones

- **Python 2.x** — discontinuado en 2020. **No usar**.
- **Python 3.12+** — mínimo recomendado hoy
- **Python 3.14** — última estable (verificado: septiembre 2026)

## Ejercicios

1. Instalar Python 3.12+ y verificar la versión
2. Ejecutar el REPL y calcular `(15 * 23) - 47`
3. Escribir un script `saludo.py` que imprima tu nombre y edad
4. Leer la salida de `import this` y elegir tu principio favorito
