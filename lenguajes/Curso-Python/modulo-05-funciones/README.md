# Módulo 05 — Funciones

Una función agrupa código reutilizable bajo un nombre.

## Definición básica

```python
def saludar(nombre):
    return f"Hola, {nombre}"

mensaje = saludar("Ana")
```

### Type hints (recomendado)
```python
def saludar(nombre: str) -> str:
    return f"Hola, {nombre}"
```

### Docstrings
```python
def area_circulo(radio: float) -> float:
    """Calcula el área de un círculo dado su radio.
    
    Args:
        radio: Radio del círculo (debe ser positivo)
    Returns:
        Área en unidades cuadradas
    """
    return 3.14159 * radio ** 2

help(area_circulo)  # muestra el docstring
```

## Parámetros

### Posicionales
```python
def restar(a, b):
    return a - b

restar(10, 3)   # 7
```

### Con valor por defecto
```python
def saludar(nombre, idioma="es"):
    if idioma == "es":
        return f"Hola, {nombre}"
    return f"Hello, {nombre}"

saludar("Ana")              # 'Hola, Ana'
saludar("Ana", "en")        # 'Hello, Ana'
```

> **Cuidado con defaults mutables**:
> ```python
> def malo(x, lista=[]):     # ⚠️ ANTI-PATRÓN
>     lista.append(x)
>     return lista
> 
> malo(1)   # [1]
> malo(2)   # [1, 2]  ← persistió entre llamadas
> 
> def bueno(x, lista=None):
>     if lista is None:
>         lista = []
>     lista.append(x)
>     return lista
> ```

### Por nombre (keyword arguments)
```python
saludar(nombre="Ana", idioma="en")
```

### `*args` — número variable de posicionales
```python
def sumar(*numeros):
    return sum(numeros)

sumar(1, 2, 3, 4)   # 10
```

### `**kwargs` — número variable de keyword
```python
def crear_usuario(**datos):
    print(datos)

crear_usuario(nombre="Ana", edad=30, ciudad="BA")
# {'nombre': 'Ana', 'edad': 30, 'ciudad': 'BA'}
```

### Combinación
```python
def funcion(pos1, pos2, /, normal, *args, kw_only, **kwargs):
    pass
# pos1, pos2: solo posicionales (antes del /)
# normal: posicional o por nombre
# *args: extras posicionales
# kw_only: solo por nombre (después de *args)
# **kwargs: extras por nombre
```

### Unpacking en llamadas
```python
args = [1, 2, 3]
kwargs = {"sep": "-", "end": "!\n"}
print(*args, **kwargs)   # 1-2-3!
```

## Scope (alcance)

```python
x = 10  # global

def funcion():
    y = 5            # local
    print(x)         # accede a global (lectura)
    # x = 99         # ERROR: lo trataría como local sin global

def modifica_global():
    global x
    x = 99           # ahora sí modifica el global
```

### Closures
```python
def crear_contador():
    n = 0
    def incrementar():
        nonlocal n
        n += 1
        return n
    return incrementar

c = crear_contador()
c()  # 1
c()  # 2
```

## Funciones lambda (anónimas)

Funciones cortas de una sola expresión:
```python
cuadrado = lambda x: x ** 2
suma = lambda a, b: a + b

# Útiles como argumento a funciones de orden superior
sorted([3, 1, 2], key=lambda x: -x)   # [3, 2, 1]
```

> **Regla**: si la lambda hace algo no trivial, escribila como `def`. Las lambdas anónimas son para casos donde un nombre estorbaría más que ayudar.

## Funciones como objetos de primera clase

```python
def aplicar(funcion, valor):
    return funcion(valor)

aplicar(lambda x: x * 2, 5)   # 10

# Lista de funciones
operaciones = [abs, str, lambda x: x + 1]
for op in operaciones:
    print(op(-5))
```

## Decoradores

Funciones que reciben/devuelven funciones, modificando comportamiento sin tocar el código original:

```python
import time

def cronometro(fn):
    def wrapper(*args, **kwargs):
        inicio = time.time()
        resultado = fn(*args, **kwargs)
        print(f"{fn.__name__} tomó {time.time() - inicio:.4f}s")
        return resultado
    return wrapper

@cronometro
def calcular_pesado():
    sum(i**2 for i in range(10**6))

calcular_pesado()
# calcular_pesado tomó 0.0823s
```

### `functools.wraps` para preservar metadata
```python
from functools import wraps

def mi_decorador(fn):
    @wraps(fn)              # preserva nombre, docstring, etc.
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper
```

### Decoradores con argumentos
```python
def repetir(veces):
    def decorador(fn):
        def wrapper(*args, **kwargs):
            for _ in range(veces):
                fn(*args, **kwargs)
        return wrapper
    return decorador

@repetir(3)
def saludar():
    print("hola")
```

## Buenas prácticas

1. **Una función = una responsabilidad** (Single Responsibility Principle)
2. **Nombres descriptivos** en verbo: `calcular_total`, no `ct`
3. **Pocos parámetros**: si tenés más de 4-5, pensá en una clase o un dict
4. **Funciones puras** cuando puedas: misma entrada → misma salida, sin side effects
5. **Docstrings** en funciones públicas

## Ejercicios

1. Función que recibe una lista y devuelve `(min, max, promedio)`
2. Decorador `@cache` que memoize resultados (sin usar `functools`)
3. Función con `*args` y `**kwargs` que loguea todos sus argumentos
4. Closure que genera IDs únicos incrementales
5. Función recursiva para Fibonacci, comparar performance con/sin memoización
