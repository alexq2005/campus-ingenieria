# Módulo 02 — Operadores y Expresiones

## Operadores aritméticos

| Operador | Significado | Ejemplo | Resultado |
|----------|-------------|---------|-----------|
| `+` | Suma | `5 + 3` | `8` |
| `-` | Resta | `5 - 3` | `2` |
| `*` | Multiplicación | `5 * 3` | `15` |
| `/` | División real | `5 / 2` | `2.5` |
| `//` | División entera | `5 // 2` | `2` |
| `%` | Módulo (resto) | `5 % 2` | `1` |
| `**` | Potencia | `2 ** 10` | `1024` |

> **Nota**: `/` siempre devuelve `float`, incluso `4 / 2 == 2.0`.

## Operadores de comparación

Devuelven `bool`:

| Operador | Significado |
|----------|-------------|
| `==` | Igual a |
| `!=` | Distinto a |
| `<` | Menor que |
| `>` | Mayor que |
| `<=` | Menor o igual |
| `>=` | Mayor o igual |

```python
3 == 3.0      # True (compara valor, no tipo)
3 == "3"      # False (tipos distintos)
"a" < "b"     # True (orden lexicográfico)
[1,2] < [1,3] # True (compara elemento a elemento)
```

### Comparación encadenada
```python
edad = 25
if 18 <= edad < 65:
    print("Edad laboral")
```

## Operadores lógicos

| Operador | Significado |
|----------|-------------|
| `and` | Y lógico |
| `or` | O lógico |
| `not` | Negación |

### Short-circuit evaluation
- `and` devuelve el primer falsy o el último valor
- `or` devuelve el primer truthy o el último valor

```python
True and "hola"   # 'hola'
False and "hola"  # False
None or "default" # 'default' (patrón común para defaults)
0 or 42           # 42
```

## Operador walrus `:=` (Python 3.8+)

Asigna y devuelve en una expresión:

```python
# Sin walrus
linea = input()
while linea != "fin":
    print(linea)
    linea = input()

# Con walrus
while (linea := input()) != "fin":
    print(linea)
```

## Operadores de identidad y pertenencia

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

a == b    # True (mismo contenido)
a is b    # False (objetos distintos)
a is c    # True (misma referencia)
a is None # patrón estándar para chequeo None

3 in a        # True
4 in a        # False
"o" in "hola" # True
```

> **Regla**: usá `is` solo con `None`, `True`, `False`. Para igualdad de valor, `==`.

## Operadores bitwise

| Operador | Significado |
|----------|-------------|
| `&` | AND bit a bit |
| `\|` | OR bit a bit |
| `^` | XOR bit a bit |
| `~` | NOT bit a bit |
| `<<` | Shift izquierda |
| `>>` | Shift derecha |

```python
0b1100 & 0b1010    # 0b1000 = 8
0b1100 | 0b1010    # 0b1110 = 14
0b1100 ^ 0b1010    # 0b0110 = 6
1 << 4             # 16 (potencia de 2)
```

## Operadores de asignación compuesta

```python
x = 10
x += 5    # x = x + 5
x -= 2    # x = x - 2
x *= 3    # x = x * 3
x //= 2   # x = x // 2
x **= 2   # x = x ** 2
x %= 7    # x = x % 7
```

## Precedencia (de mayor a menor)

1. `()` — paréntesis
2. `**` — exponenciación
3. `+x`, `-x`, `~x` — unarios
4. `*`, `/`, `//`, `%`
5. `+`, `-`
6. `<<`, `>>`
7. `&`
8. `^`
9. `\|`
10. `==`, `!=`, `<`, `>`, `<=`, `>=`, `is`, `in`
11. `not`
12. `and`
13. `or`

> **Regla**: cuando dudes, **usá paréntesis**. La claridad vale más que la brevedad.

## Ejercicios

1. Calcular si un año es bisiesto: `(año % 4 == 0 and año % 100 != 0) or año % 400 == 0`
2. Dado `n = 17`, decir si es par o impar usando `%`
3. Convertir Celsius a Fahrenheit con `f = c * 9/5 + 32`
4. Usar walrus para leer entradas hasta que el usuario escriba "salir"
5. Verificar si una letra está en una lista usando `in`
