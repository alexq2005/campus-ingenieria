# Módulo 0 — Bienvenida, setup y metodología

> *"The computer is the most remarkable tool that we've ever come up with. It's the equivalent of a bicycle for our minds."* — Steve Jobs

---

## 0.1 ¿Por qué este curso?

Hay dos tipos de desarrolladores frontend:

1. Los que copian y pegan de Stack Overflow sin saber qué hace el código.
2. Los que entienden la plataforma web — sus capas, sus trade-offs, su historia — y por eso escriben código que **dura**, **performa** y **escala**.

Este curso te prepara para ser del segundo tipo.

## 0.2 ¿Qué es "frontend"?

**Frontend** es todo lo que el usuario ve y toca en su navegador o dispositivo. Es la capa de presentación e interacción de un sistema.

Tres lenguajes fundamentales — y **nada** te exime de dominarlos:

| Lenguaje | Responsabilidad | Analogía |
|----------|----------------|----------|
| **HTML** | Estructura y semántica del contenido | El esqueleto |
| **CSS** | Presentación visual y layout | La piel y la ropa |
| **JavaScript** | Comportamiento e interactividad | Los músculos y el sistema nervioso |

Frameworks como React, Vue o Svelte **se compilan** a estos tres. Si no dominás la base, los frameworks se convierten en una caja negra.

## 0.3 Setup del entorno

### 1. Navegador

Instalá **Google Chrome** o **Firefox Developer Edition**. Ambos tienen DevTools excepcionales.

### 2. Editor de código

**VS Code** — gratis, open source, con ecosistema enorme. Descargalo en https://code.visualstudio.com/.

Extensiones recomendadas para empezar:
- `Live Server` (Ritwick Dey) — sirve HTML con auto-reload.
- `Prettier - Code formatter` — formateo automático.
- `ESLint` (lo usaremos desde el módulo 9).

### 3. Terminal

- Windows: usá **Git Bash** o **PowerShell**.
- macOS / Linux: el terminal del sistema.

### 4. Git + GitHub

- Descargá Git: https://git-scm.com/
- Creá una cuenta en https://github.com (tu CV técnico).

### 5. Node.js (para el módulo 9 en adelante)

- Descargá la versión **LTS** (20+) desde https://nodejs.org/
- Verificá: `node --version` y `npm --version` en la terminal.

## 0.4 Cómo abordar cada módulo

```
┌──────────────────────────────────────────────────┐
│  1. Leer el lecture completo (30–60 min)         │
│  2. Correr los ejemplos, modificarlos (30 min)   │
│  3. Resolver los ejercicios solo (1–2 hs)        │
│  4. Comparar con la solución (si hay)            │
│  5. Explicárselo a alguien (o a vos mismo)       │
└──────────────────────────────────────────────────┘
```

## 0.5 Mentalidad

- **Leé la documentación.** MDN Web Docs (https://developer.mozilla.org) es la biblia del frontend.
- **Los errores son amigos.** Cada error es información; leelo, no lo ignores.
- **Google/Stack Overflow son aliados, no muletas.** Preguntá *después* de pensar 10 minutos, no antes.
- **Construí.** El único atajo es tipear código.

---

**Siguiente módulo:** [`01 — Cómo funciona la Web`](../modulo-01-como-funciona-web/)
