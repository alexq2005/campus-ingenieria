# Módulo 04 — Control de Flujo

## Indentación

Python usa **indentación significativa**. No hay `{}`. Todos los bloques se delimitan con sangría consistente (4 espacios — convención PEP 8).

```python
if condicion:
    hacer_esto()       # dentro del if
    y_esto()           # dentro del if
hacer_otra_cosa()      # fuera del if
```

> **Mezclar tabs y espacios = error**. Configurá tu editor para insertar 4 espacios al pulsar Tab.

## Condicionales `if / elif / else`

```python
edad = 18

if edad < 13:
    categoria = "niño"
elif edad < 18:
    categoria = "adolescente"
elif edad < 65:
    categoria = "adulto"
else:
    categoria = "mayor"
```

### Operador ternario
```python
estado = "mayor" if edad >= 18 else "menor"
```

### `match / case` (Python 3.10+)
Pattern matching, equivalente avanzado a switch:

```python
def describir(x):
    match x:
        case 0:
            return "cero"
        case int() if x > 0:
            return "positivo"
        case int():
            return "negativo"
        case [a, b]:
            return f"par {a}, {b}"
        case {"tipo": "circulo", "radio": r}:
            return f"círculo de radio {r}"
        case _:
            return "desconocido"
```

## Bucle `for`

Itera sobre cualquier **iterable** (lista, tupla, dict, str, range, generador, archivo, etc.):

```python
for fruta in ["manzana", "pera", "uva"]:
    print(fruta)

for i in range(5):           # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 10, 2):    # 2, 4, 6, 8 (start, stop, step)
    print(i)

for letra in "hola":
    print(letra)

for clave, valor in {"a": 1, "b": 2}.items():
    print(f"{clave}={valor}")
```

### `enumerate` — índice + valor
```python
for i, fruta in enumerate(frutas):
    print(f"{i}: {fruta}")

for i, fruta in enumerate(frutas, start=1):
    print(f"{i}: {fruta}")  # arranca en 1
```

### `zip` — iterar varios al mismo tiempo
```python
nombres = ["Ana", "Luis", "Eva"]
edades = [30, 25, 40]
for nombre, edad in zip(nombres, edades):
    print(f"{nombre} tiene {edad}")
```

## Bucle `while`

```python
contador = 0
while contador < 5:
    print(contador)
    contador += 1
```

> **Cuidado**: si la condición nunca se hace falsa, **bucle infinito**. Asegurate que algo dentro modifique la condición.

### `while True` con `break`
Patrón común para bucles "hasta que se cumpla algo":
```python
while True:
    respuesta = input("¿Salir? (s/n): ")
    if respuesta == "s":
        break
```

## `break` y `continue`

```python
for i in range(10):
    if i == 3:
        continue        # salta esta iteración
    if i == 7:
        break           # sale del bucle
    print(i)
# Imprime: 0 1 2 4 5 6
```

## `else` en bucles

Se ejecuta si el bucle terminó **sin break**:

```python
for n in [2, 4, 6, 8]:
    if n % 2 != 0:
        print("Hay un impar")
        break
else:
    print("Todos pares")  # se ejecuta solo si no hubo break
```

## Comprehensions (forma compacta de bucles)

### List
```python
cuadrados = [x**2 for x in range(10)]
pares = [x for x in range(20) if x % 2 == 0]
combinados = [(x, y) for x in [1,2,3] for y in ["a","b"]]
```

### Dict
```python
cuadrados = {n: n**2 for n in range(5)}
filtrado = {k: v for k, v in datos.items() if v > 0}
```

### Set
```python
unicos = {x % 3 for x in range(20)}
```

### Generator (lazy, no construye lista en memoria)
```python
suma = sum(x**2 for x in range(1_000_000))   # eficiente en memoria
```

> **Regla**: si la comprehension tiene más de 1 `if` o 2 `for`, escribilo como bucle normal — **legibilidad > brevedad**.

## `pass` — placeholder

Cuando necesitás un bloque sintácticamente pero todavía no escribiste el código:
```python
def funcion_pendiente():
    pass

if edad < 18:
    pass  # TODO: validar consentimiento
```

## Ejercicios

1. FizzBuzz: del 1 al 100, imprimir "Fizz" si es múltiplo de 3, "Buzz" si es múltiplo de 5, "FizzBuzz" si ambos
2. Calcular el factorial de un número con un bucle `for`
3. Pedir números al usuario hasta que escriba "fin", luego mostrar la suma
4. Imprimir una pirámide de asteriscos de altura `n`
5. Encontrar el número primo más cercano (mayor) a un valor dado
