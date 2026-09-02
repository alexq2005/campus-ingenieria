# Módulo 06 — Programación Orientada a Objetos

## Clases y objetos

Una **clase** es un molde; un **objeto** (instancia) es un caso concreto.

```python
class Persona:
    def __init__(self, nombre: str, edad: int):
        self.nombre = nombre
        self.edad = edad
    
    def saludar(self) -> str:
        return f"Hola, soy {self.nombre}"

ana = Persona("Ana", 30)   # crea instancia (llama __init__)
print(ana.saludar())       # 'Hola, soy Ana'
```

### `self`
Es la convención: el primer parámetro de los métodos representa la instancia. **No es palabra reservada**, podrías llamarlo distinto, pero no lo hagas.

### `__init__`
El **constructor**. Se ejecuta al crear la instancia. No devuelve nada.

## Atributos de clase vs instancia

```python
class Perro:
    especie = "Canis lupus familiaris"   # de clase (compartido)
    
    def __init__(self, nombre):
        self.nombre = nombre              # de instancia (único)

a = Perro("Rex")
b = Perro("Lupita")
a.especie    # mismo valor compartido
a.nombre     # 'Rex'
b.nombre     # 'Lupita'
```

## Métodos

### De instancia (regular)
```python
def metodo(self, ...):
    ...
```

### De clase (`@classmethod`)
Recibe la clase, no la instancia. Útil para constructores alternativos:
```python
class Fecha:
    def __init__(self, dia, mes, año):
        self.dia, self.mes, self.año = dia, mes, año
    
    @classmethod
    def desde_string(cls, texto):
        d, m, a = map(int, texto.split("/"))
        return cls(d, m, a)

f = Fecha.desde_string("15/03/2024")
```

### Estáticos (`@staticmethod`)
No reciben self ni cls. Función "pegada" a la clase por organización:
```python
class Matematica:
    @staticmethod
    def es_par(n):
        return n % 2 == 0

Matematica.es_par(4)   # True
```

## Encapsulación

Python no tiene `private` real. Convenciones:

- `_atributo` — "interno" (no toques desde afuera, pero técnicamente accesible)
- `__atributo` — name mangling (se renombra a `_ClaseNombre__atributo`)

```python
class Cuenta:
    def __init__(self):
        self._saldo = 0          # privado por convención
        self.__pin = "1234"      # privado fuerte (name mangling)
```

### Properties (getters/setters pythónicos)
```python
class Temperatura:
    def __init__(self, celsius):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, valor):
        if valor < -273.15:
            raise ValueError("Bajo el cero absoluto")
        self._celsius = valor
    
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

t = Temperatura(25)
t.celsius           # 25 (sin paréntesis — es property)
t.celsius = 30      # llama al setter
t.fahrenheit        # 86.0
```

## Herencia

```python
class Animal:
    def __init__(self, nombre):
        self.nombre = nombre
    
    def hablar(self):
        return "..."

class Perro(Animal):                    # hereda de Animal
    def hablar(self):                   # override
        return "Guau"

class Gato(Animal):
    def hablar(self):
        return "Miau"

for animal in [Perro("Rex"), Gato("Mishi")]:
    print(f"{animal.nombre}: {animal.hablar()}")
```

### `super()` para llamar al padre
```python
class Empleado(Persona):
    def __init__(self, nombre, edad, salario):
        super().__init__(nombre, edad)   # llama Persona.__init__
        self.salario = salario
```

### Herencia múltiple (con cuidado)
```python
class A: pass
class B: pass
class C(A, B): pass

# MRO (Method Resolution Order)
C.__mro__   # (C, A, B, object)
```

## Polimorfismo

Mismo método, distinto comportamiento según el tipo. Python usa **duck typing**:

> "Si camina como un pato y grazna como un pato, es un pato."

No requiere herencia explícita: si un objeto tiene los métodos esperados, sirve.

```python
def hacer_hablar(animal):
    return animal.hablar()      # funciona con cualquier objeto que tenga .hablar()
```

## Métodos especiales (dunders)

Permiten que tus objetos se comporten como built-ins:

```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    
    def __repr__(self):                # representación oficial
        return f"Vector({self.x}, {self.y})"
    
    def __str__(self):                 # para print() y str()
        return f"({self.x}, {self.y})"
    
    def __add__(self, other):          # v1 + v2
        return Vector(self.x + other.x, self.y + other.y)
    
    def __eq__(self, other):           # v1 == v2
        return self.x == other.x and self.y == other.y
    
    def __len__(self):                 # len(v)
        return int((self.x**2 + self.y**2) ** 0.5)
    
    def __getitem__(self, i):          # v[0], v[1]
        return (self.x, self.y)[i]

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2)        # (4, 6)
print(v1 == Vector(1, 2))  # True
```

| Dunder | Para qué |
|--------|----------|
| `__init__` | Constructor |
| `__repr__` | `repr(obj)` — debugging |
| `__str__` | `str(obj)` y `print()` |
| `__eq__`, `__lt__`, etc. | Operadores de comparación |
| `__add__`, `__sub__`, etc. | Operadores aritméticos |
| `__len__` | `len(obj)` |
| `__getitem__`, `__setitem__` | `obj[i]` |
| `__iter__`, `__next__` | Iteración |
| `__enter__`, `__exit__` | `with obj:` |
| `__call__` | Hace al objeto callable |

## Dataclasses (Python 3.7+)

Boilerplate-free para clases que principalmente almacenan datos:

```python
from dataclasses import dataclass, field

@dataclass
class Producto:
    nombre: str
    precio: float
    stock: int = 0
    tags: list[str] = field(default_factory=list)

p = Producto("Café", 1500, 10)
print(p)   # Producto(nombre='Café', precio=1500, stock=10, tags=[])
```

Genera automáticamente `__init__`, `__repr__`, `__eq__`.

### Variantes
```python
@dataclass(frozen=True)   # inmutable
@dataclass(slots=True)    # más eficiente en memoria (Python 3.10+)
```

## Clases abstractas (`abc`)

```python
from abc import ABC, abstractmethod

class Forma(ABC):
    @abstractmethod
    def area(self):
        pass

class Circulo(Forma):
    def __init__(self, r):
        self.r = r
    
    def area(self):
        return 3.14159 * self.r ** 2

# Forma()  # TypeError: no se puede instanciar abstracta
Circulo(5).area()
```

## Ejercicios

1. Clase `Cuenta` con depósito, retiro, saldo, e historial de transacciones
2. Jerarquía `Forma → Cuadrado, Triangulo, Circulo` con `area()` y `perimetro()`
3. Dataclass `Libro` con `__lt__` para ordenar por año de publicación
4. Clase `Pila` (stack) con `push`, `pop`, `peek`, `is_empty`, `__len__`
5. Property `edad` de `Persona` que se calcula desde `fecha_nacimiento`
