"""
Red Neuronal desde Cero  —  Proyecto P30 del Campus CS-FE
==========================================================
Una red  2 -> capa oculta -> 1  que aprende a clasificar puntos,
con forward, backprop y entrenamiento escritos A MANO (sin PyTorch).

  REGLA DE ORO (invariante del proyecto):
  PROHIBIDO usar autograd o frameworks de ML. El gradiente lo
  derivamos y lo escribimos nosotros. Ese es TODO el punto.
  (Permitido: numpy para el álgebra. Prohibido: torch, tensorflow,
   sklearn, o cualquier .backward() mágico.)

Lo vas completando paso a paso. Cada función tiene un TODO con el
número de paso. Mientras no la completes, lanza NotImplementedError
para que sepas qué falta. Tu guía te va a ir diciendo qué escribir.
"""

import numpy as np


# ============================================================
# PASO 2 — Los datos
# ============================================================
def generar_xor(n=200, semilla=0):
    """Genera n puntos (x, y) en el cuadrado [-1, 1] con etiqueta XOR.

    Etiqueta = 1 si x e y tienen el MISMO signo (cuadrantes opuestos
    en diagonal), 0 si tienen distinto signo. Es el problema clásico
    que una sola neurona NO puede resolver.

    Debe devolver:
        X : np.ndarray de forma (n, 2)   -> las coordenadas
        y : np.ndarray de forma (n, 1)   -> las etiquetas 0/1
    """
    # TODO (paso 2): lo escribís vos
    raise NotImplementedError("Paso 2: generar los datos XOR")


# ============================================================
# La red neuronal
# ============================================================
class RedNeuronal:
    """Red 2 -> n_ocultas (tanh) -> 1 (sigmoide)."""

    def __init__(self, n_entradas=2, n_ocultas=8, semilla=0):
        """Inicializa los pesos con valores chicos al azar y los bias en 0.

        Necesitás cuatro cosas guardadas en self:
            W1 : (n_ocultas, n_entradas)   b1 : (n_ocultas, 1)
            W2 : (1, n_ocultas)            b2 : (1, 1)
        """
        # TODO (paso 3): inicializar W1, b1, W2, b2
        raise NotImplementedError("Paso 3: inicializar los pesos")

    def forward(self, X):
        """Forward pass:  X -> capa oculta (tanh) -> salida (sigmoide).

        Guardá las activaciones intermedias en self (las va a necesitar
        backward). Devolvé la salida, de forma (n, 1), con valores 0..1.
        """
        # TODO (paso 3): forward pass
        raise NotImplementedError("Paso 3: forward pass")

    def perdida(self, y_pred, y):
        """Entropía cruzada binaria (BCE) promedio entre predicción y real.
        Acordate de sumar un epsilon chico dentro del log para no hacer log(0).
        """
        # TODO (paso 4): función de pérdida
        raise NotImplementedError("Paso 4: función de pérdida")

    def backward(self, X, y, lr):
        """Backpropagation (el corazón del proyecto).

        Calculá los gradientes a mano con la regla de la cadena y
        actualizá los pesos:  W -= lr * dW.
        Pista clave: con BCE + sigmoide, dL/dz2 se simplifica a (y_pred - y).
        """
        # TODO (paso 5): backpropagation
        raise NotImplementedError("Paso 5: backpropagation")


# ============================================================
# PASO 6 — Entrenamiento
# ============================================================
def entrenar(epocas=2000, n_ocultas=8, lr=0.1):
    """Crea la red y los datos, y repite forward + backward muchas veces,
    imprimiendo la pérdida y la precisión cada tanto para verla bajar."""
    # TODO (paso 6): el loop de entrenamiento
    raise NotImplementedError("Paso 6: entrenamiento")


if __name__ == "__main__":
    entrenar()
