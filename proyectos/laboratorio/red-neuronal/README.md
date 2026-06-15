# 🧠 Red Neuronal desde Cero (P30 — versión que construís vos)

Proyecto del **Campus CS-FE**. Acá construís a mano una red neuronal que
aprende, sin PyTorch ni TensorFlow — solo NumPy y matemática. La versión
JS de demostración está en `../../demos/red-neuronal-app.html` (úsala solo
como referencia si te trabás; la idea es escribir esto vos).

## Regla de oro (invariante del proyecto)
> **Prohibido** usar autograd o frameworks de ML. El gradiente lo escribimos
> nosotros. Si lo resolviéramos con `loss.backward()`, no aprenderías nada.
> Permitido: NumPy para el álgebra.

## Cómo trabajar

El entorno virtual con NumPy y matplotlib **ya está creado** (`venv/`).

**Activarlo** (PowerShell, desde esta carpeta):
```powershell
.\venv\Scripts\Activate.ps1
```
> Si PowerShell bloquea el script, corré una vez:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
> o, sin activar, usá directamente `.\venv\Scripts\python.exe red.py`

**Correr el programa** (mientras lo completás, te va a avisar qué paso falta):
```powershell
python red.py
```

## Plan en pasos (lo hacemos juntos)

- [x] **Paso 1 — Setup.** Carpeta, venv, NumPy/matplotlib, esqueleto. ✅ (este andamiaje)
- [ ] **Paso 2 — Datos.** `generar_xor()` — los puntos a clasificar.
- [ ] **Paso 3 — Forward.** `__init__` (pesos) + `forward()` (predicción).
- [ ] **Paso 4 — Pérdida.** `perdida()` — medir cuánto se equivoca.
- [ ] **Paso 5 — Backprop.** `backward()` — el corazón: gradientes a mano. ⭐
- [ ] **Paso 6 — Entrenar.** `entrenar()` — el loop; ver la pérdida bajar.
- [ ] **Paso 7 — Ver.** Graficar la frontera de decisión con matplotlib.
- [ ] **Paso 8 — Experimentos.** Comprobar que 1 neurona no puede con XOR y 8 sí.

## La arquitectura que vas a construir

```
entrada (x, y)        capa oculta (tanh)        salida (sigmoide)
   2 valores   --W1,b1-->   n neuronas   --W2,b2-->   1 probabilidad
                                                       (0 = clase A, 1 = clase B)
```

Cada método de `RedNeuronal` mapea a un paso. Mientras no lo completes,
lanza `NotImplementedError` diciéndote qué falta. Vamos uno por uno.
