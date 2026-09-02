# Ejemplo 01 — Proyecto Vite desde cero

Este NO es un proyecto Vite ya generado (no queremos commitear `node_modules`).
Es una guía paso a paso para crear uno.

## Paso 1 — Crear el proyecto

```bash
npm create vite@latest mi-primera-app
# Elegí: Vanilla → JavaScript (para este primer proyecto)
cd mi-primera-app
npm install
```

Estructura que te crea Vite:

```
mi-primera-app/
├── index.html
├── package.json
├── public/
│   └── vite.svg
├── src/
│   ├── counter.js
│   ├── javascript.svg
│   ├── main.js
│   └── style.css
└── vite.config.js   (opcional)
```

## Paso 2 — Correr el dev server

```bash
npm run dev
```

Abrí http://localhost:5173.

Modificá `src/style.css` → el navegador se actualiza **solo** (HMR).

## Paso 3 — Agregar una dependencia real

Vamos a usar `date-fns` (librería de utilidades para fechas):

```bash
npm install date-fns
```

En `src/main.js`:

```js
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

document.querySelector('#app').innerHTML = `
  <h1>Hoy es ${format(new Date(), "EEEE d 'de' MMMM", { locale: es })}</h1>
  <p>Hace ${formatDistanceToNow(new Date('2026-01-01'), { locale: es })} fue año nuevo</p>
`;
```

## Paso 4 — Build de producción

```bash
npm run build
```

Se genera `dist/` con:
- `index.html` minificado.
- `assets/index-<hash>.js` (bundle JS minificado, ES2022).
- `assets/index-<hash>.css` (CSS minificado, purgado).

```bash
npm run preview
```

Sirve `dist/` localmente para probar.

## Paso 5 — Git + GitHub

```bash
git init
git add .
git commit -m "feat: primer proyecto con Vite"
```

Creá el repo en GitHub (web) y:

```bash
git remote add origin https://github.com/TU_USUARIO/mi-primera-app.git
git branch -M main
git push -u origin main
```

## Paso 6 — Deploy a Vercel

1. Entrá a https://vercel.com (login con GitHub).
2. "Add new → Project" → seleccioná tu repo.
3. Dejá los defaults (Vite lo detecta).
4. "Deploy".

En 30 segundos tenés tu app en una URL pública, y cada push a `main` la actualiza.

## Paso 7 — ESLint + Prettier (opcional pero recomendado)

```bash
npm i -D eslint @eslint/js prettier
```

Creá `eslint.config.js`:

```js
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly'
      }
    }
  }
];
```

Creá `.prettierrc.json`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

Agregá a `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src/",
  "format": "prettier --write ."
}
```

---

¿Todo esto parece mucho? Es porque **es mucho** — pero lo hacés una vez por proyecto. Una vez armado el template, todos tus proyectos futuros parten de esto.
