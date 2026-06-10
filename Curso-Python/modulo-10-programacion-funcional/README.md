# Módulo 10 — Programación Funcional

Python soporta paradigma funcional sin ser un lenguaje funcional puro. Las herramientas clave son: funciones de orden superior, lambdas, comprehensions, generadores, y módulos `functools`/`itertools`.

## Conceptos clave

- **Funciones puras**: misma entrada → misma salida, sin side effects
- **Inmutabilidad**: no modificar argumentos
- **Composición**: combinar funciones simples para resolver problemas complejos

## Funciones de orden superior

### `map(fn, iterable)` — aplica fn a cada elemento
```python
nums = [1, 2, 3, 4]
list(map(lambda x: x ** 2, nums))      # [1, 4, 9, 16]

# Equivalente con comprehension (más pythónico):
[x ** 2 for x in nums]
```

### `filter(predicado, iterable)` — filtra
```python
list(filter(lambda x: x % 2 == 0, nums))   # [2, 4]

# Equivalente
[x for x in nums if x % 2 == 0]
```

### `reduce(fn, iterable, init)` — acumula
```python
from functools import reduce

reduce(lambda a, b: a + b, [1, 2, 3, 4], 0)   # 10
reduce(lambda a, b: a * b, [1, 2, 3, 4], 1)   # 24
```

> Para sumas y productos usá `sum()` y `math.prod()`. Reservá `reduce` para operaciones acumulativas no-built-in.

### `sorted` con `key`
```python
palabras = ["pera", "kiwi", "manzana"]
sorted(palabras, key=len)                # por longitud
sorted(palabras, key=str.lower)           # case-insensitive
sorted(personas, key=lambda p: p.edad, reverse=True)
```

### `any` y `all`
```python
any(x > 0 for x in [-1, -2, 3])     # True (al menos uno)
all(x > 0 for x in [1, 2, 3])       # True (todos)
all([])                              # True (vacuamente verdadero)
```

## Generadores

Producen valores **bajo demanda** (lazy), no construyen toda la secuencia en memoria.

### Generator function (`yield`)
```python
def contar(hasta):
    n = 0
    while n < hasta:
        yield n
        n += 1

for x in contar(5):
    print(x)
```

### Generator expression
```python
suma = sum(x**2 for x in range(10**6))   # eficiente

# Comparación
[x**2 for x in range(10**6)]              # construye lista de 1M elementos
(x**2 for x in range(10**6))              # generador, memoria O(1)
```

### Ventajas
- **Memoria O(1)** para iterables grandes
- **Lazy evaluation** — no calcula lo que no se consume
- Permite trabajar con **streams infinitos**

```python
def naturales():
    n = 1
    while True:
        yield n
        n += 1

from itertools import islice
list(islice(naturales(), 10))   # primeros 10
```

## `functools`

### `@cache` y `@lru_cache` — memoización
```python
from functools import cache, lru_cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)

fib(100)   # instantáneo gracias al cache
```

### `partial` — aplicación parcial
```python
from functools import partial

def potencia(base, exp):
    return base ** exp

cuadrado = partial(potencia, exp=2)
cuadrado(5)   # 25
```

### `reduce` — visto arriba

## `itertools` — herramientas para iterables

```python
import itertools as it

# Infinitos
it.count(10, 2)                  # 10, 12, 14, ...
it.cycle("abc")                  # a, b, c, a, b, c, ...
it.repeat("x", 3)                # x, x, x

# Combinatorias
list(it.permutations([1,2,3], 2))    # [(1,2),(1,3),(2,1),(2,3),(3,1),(3,2)]
list(it.combinations([1,2,3], 2))    # [(1,2),(1,3),(2,3)]
list(it.product([1,2], "ab"))        # [(1,'a'),(1,'b'),(2,'a'),(2,'b')]

# Útiles
list(it.chain([1,2], [3,4], [5]))    # [1,2,3,4,5]
list(it.zip_longest([1,2,3], "ab", fillvalue="-"))  # [(1,'a'),(2,'b'),(3,'-')]
list(it.islice(it.count(), 5, 10))   # primeros 5..10
list(it.takewhile(lambda x: x<5, [1,2,3,6,4]))  # [1,2,3]
list(it.dropwhile(lambda x: x<5, [1,2,3,6,4]))  # [6,4]
list(it.groupby([1,1,2,3,3,3]))       # agrupa contiguos
```

## Composición de funciones

```python
def compose(*fns):
    def composed(x):
        for fn in reversed(fns):
            x = fn(x)
        return x
    return composed

procesar = compose(str.upper, str.strip, lambda s: s + "!")
procesar("  hola  ")   # 'HOLA!'
```

## Inmutabilidad

```python
# En vez de modificar
lista.append(x)              # mutación

# Crear nueva versión
nueva = lista + [x]          # inmutable
nueva = [*lista, x]          # idem
nuevo_dict = {**dict_orig, "k": "v"}
```

## Pipeline pattern

```python
def pipeline(data, *steps):
    for step in steps:
        data = step(data)
    return data

resultado = pipeline(
    "  Hola Mundo  ",
    str.strip,
    str.lower,
    lambda s: s.replace(" ", "_"),
)
# 'hola_mundo'
```

## Ejercicios

1. Reescribir un bucle `for` con acumulador como `reduce`
2. Generator infinito de números primos (criba lazy)
3. Memoizar manualmente Fibonacci sin usar `@cache`
4. Pipeline que recibe lista de strings y devuelve los únicos en mayúsculas, ordenados por longitud
5. Usar `itertools.groupby` para agrupar registros consecutivos por una clave
