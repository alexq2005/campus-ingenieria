"""Ejemplos de variables y tipos primitivos."""

# Tipos primitivos
nombre: str = "Ana"
edad: int = 30
altura: float = 1.65
activo: bool = True
saldo: float | None = None  # union type, Python 3.10+

print(f"{nombre=}, {type(nombre).__name__=}")
print(f"{edad=}, {type(edad).__name__=}")
print(f"{altura=}, {type(altura).__name__=}")
print(f"{activo=}, {type(activo).__name__=}")

# Conversión
texto_numero = "123"
numero = int(texto_numero)
print(f"'{texto_numero}' como int: {numero}")
print(f"{numero} como str: '{str(numero)}'")

# Falsy values
for valor in [0, "", None, [], {}, "hola", 42, [1]]:
    print(f"bool({valor!r}) = {bool(valor)}")

# F-strings con formato
pi = 3.14159
print(f"PI con 2 decimales: {pi:.2f}")
print(f"PI con 4 decimales: {pi:.4f}")
print(f"Número grande: {1234567:,}")
print(f"Porcentaje: {0.875:.1%}")
print(f"Padding: '{42:>10}'")  # alineado derecha
print(f"Padding: '{42:<10}'")  # alineado izquierda
print(f"Padding: '{42:^10}'")  # centrado
