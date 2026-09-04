# 🎓 Campus de Ingeniería

> Un campus de programación completo, estilo **Harvard CS50** — pero en español, gratis y **offline**.

**10 cursos · 172 lecciones · 49 proyectos · sin servidor · sin build · sin internet**

Diez cursos que van **de cero a empleable** — del primer `<div>` a entrenar una red neuronal y escribir Rust para un microcontrolador. Todo en **HTML estático**: se abre directo en el navegador, sin instalar nada.

---

## 🚀 Cómo usar

1. **Descargá** el repo (botón verde *Code → Download ZIP*, o `git clone`).
2. Abrí **`index.html`** en cualquier navegador (doble clic).
3. Listo. Funciona desde `file://` — sin servidor, sin build, sin conexión.

```bash
git clone https://github.com/alexq2005/campus-ingenieria.git
cd campus-ingenieria
# abrí index.html en tu navegador
```

---

## 📚 Los 10 cursos

| # | Curso | Contenido | Entrar |
|---|-------|-----------|--------|
| 1 | 🌐 **Frontend** | HTML, CSS, JS, DOM, async, React, TypeScript, performance | [Abrir](desarrollo-web/modulo-00-sillabus/lecture.html) |
| 2 | 🐍 **Python** | Tipos, POO, errores, concurrencia, stdlib, **NumPy** | [Abrir](lenguajes/Curso-Python/index.html) |
| 3 | 🐧 **Linux** | Filesystem, permisos, procesos, redes, bash, systemd | [Abrir](sistemas/Curso-Linux/index.html) |
| 4 | ⚛️ **React** | Hooks, Router, TanStack Query, Zustand, Next.js | [Abrir](desarrollo-web/Curso-React/index.html) |
| 5 | ⚡ **Computación Física** | Del bit al voltaje: lógica, microcontroladores, sensores, IoT | [Abrir](sistemas/Curso-Computacion-Fisica/index.html) |
| 6 | 📱 **React Native** | Apps de celular con Expo: de componentes nativos a publicación | [Abrir](desarrollo-web/Curso-React-Native/index.html) |
| 7 | 📊 **Datos & ML** | NumPy → pandas → scikit-learn → PyTorch | [Abrir](datos-ia/Curso-Datos-ML/index.html) |
| 8 | 🐹 **Go** | Sintaxis, goroutines/channels, API REST — el lenguaje de la nube | [Abrir](lenguajes/Curso-Go/index.html) |
| 9 | 🦀 **Rust** | Ownership, borrowing, lifetimes, traits, concurrencia, embebido | [Abrir](lenguajes/Curso-Rust/index.html) |
| 10 | 🛡️ **Ciberseguridad** | Amenazas, criptografía, OWASP, redes, hardening, DevSecOps, respuesta a incidentes | [Abrir](sistemas/Curso-Ciberseguridad/index.html) |

---

## 🛠️ Más allá de las lecciones

- **[🗺️ Ruta de aprendizaje](ruta-aprendizaje.html)** — el camino visual de cero a empleable, conectando los 10 cursos.
- **[🧪 Galería de proyectos](proyectos/index.html)** — 49 proyectos de dificultad creciente: del Tic-Tac-Toe a un robot con PID, fullstack, IoT, IA e impacto social.
- **MVPs jugables** (corren de verdad en el navegador):
  - [⭕ Tic-Tac-Toe con IA imbatible](proyectos/demos/tic-tac-toe-app.html)
  - [📝 Notas Markdown](proyectos/demos/notas-markdown-app.html)
  - [🔗 Acortador de URLs](proyectos/demos/url-shortener-app.html)
  - [🧠 Red Neuronal que entrenás en vivo](proyectos/demos/red-neuronal-app.html)
- **Buscador + seguimiento de progreso** — en la portada (`index.html`).
- **Track Senior** — patrones, arquitectura, state machines, testing, observabilidad y liderazgo técnico.

---

## ✨ Qué lo hace distinto

- **Offline** — el contenido, los quizzes y los simuladores funcionan desde `file://`, sin servidor ni conexión. Lo único que pide internet son el coloreado de sintaxis (si no carga, el código igual se lee) y 5 demos de React.
- **Cero build** — es HTML, CSS y JS plano. No hay `npm install`. La única librería que hace falta para leer, `marked`, viene incluida en `assets/vendor/`.
- **Aprender construyendo** — cada curso termina en proyectos reales.
- **Interactivo** — quiz autoevaluable en **las 172 lecciones**, checkpoints con respuesta revelable, simuladores (Ley de Ohm, PID, FFT, gradient descent…) y MVPs que corren de verdad.
- **Puente hardware ↔ software** — Computación Física conecta la informática con la electrónica (Arduino/ESP32), y Rust llega hasta el microcontrolador.

---

## 🧭 Cómo estudiar

1. **Leé el lecture completo** antes de tocar código.
2. **Escribí los ejemplos a mano** — el cerebro aprende distinto cuando tipea.
3. **Resolvé los ejercicios sin ver la solución.** Fallá, frustrate, reintentá.
4. **Explicá en voz alta** lo que aprendiste (técnica Feynman).
5. **Construí algo propio** cada semana.

---

## 📂 Estructura

```
index.html                  ← portada del campus (empezá acá)
ruta-aprendizaje.html       ← roadmap visual
desarrollo-web/             ← Frontend (modulo-00..13) · React · React Native
lenguajes/                  ← Python · Go · Rust
sistemas/                   ← Linux · Computación Física (electrónica) · Ciberseguridad
datos-ia/                   ← Datos & ML
proyectos/                  ← galería de 49 proyectos + demos jugables
track-senior/               ← track de nivel senior
multimedia/                 ← visualizaciones interactivas
```

---

## 📄 Licencia

MIT — usá este material libremente. Si lo compartís, citá la fuente.

*Hecho con cariño para que cualquiera pueda aprender a programar, sin barreras.*
