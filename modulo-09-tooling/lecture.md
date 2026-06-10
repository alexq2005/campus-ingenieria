# Módulo 9 — Tooling: npm, Vite, Git, ESLint, Prettier

> *"A programmer is only as good as their tools."*

---

## 🎥 Multimedia

**Videos recomendados** — Vite, Git/GitHub, workflow moderno:
[📺 Playlist del módulo 09 →](../multimedia/videos.html#m9)

**Starter template listo para usar** (Vite + React + TS + Vitest + CI):
[📦 Ver starter-template](../modulo-13-proyecto-final/starter-template/README.md)

---

## 9.1 ¿Por qué usar tooling?

Hasta ahora escribimos HTML+CSS+JS "puros". Funciona para apps chicas. Para proyectos reales necesitamos:

- **Gestión de dependencias** (usar librerías de terceros) → npm.
- **Build/bundling** (convertir muchos archivos ES modules en un bundle optimizado) → Vite.
- **Control de versiones** → Git + GitHub.
- **Linting y formateo** → ESLint + Prettier.
- **Testing** → Vitest o Jest.

## 9.2 Node.js y npm

**Node.js** es un runtime de JavaScript que corre fuera del navegador (creado en 2009 por Ryan Dahl). **npm** es el gestor de paquetes que viene con Node.

### Instalación

Descargá Node LTS (20+) desde https://nodejs.org.

```bash
node --version    # v20.x o superior
npm  --version    # 10.x
```

### Inicializar un proyecto

```bash
mkdir mi-app
cd mi-app
npm init -y        # crea package.json con defaults
```

`package.json` es el **manifiesto** del proyecto:

```json
{
  "name": "mi-app",
  "version": "1.0.0",
  "type": "module",            // usa ES modules
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "eslint": "^9.0.0"
  }
}
```

### Instalar dependencias

```bash
npm install react react-dom    # dependencias de producción
npm install -D vite eslint      # dependencias de desarrollo (-D o --save-dev)
npm install                     # instala TODO lo declarado en package.json
npm install paquete@1.2.3       # versión específica
npm uninstall paquete
```

Node crea:
- `node_modules/` — carpeta enorme con las dependencias. **No se commitea**.
- `package-lock.json` — lockfile con las versiones exactas. **Sí se commitea**.

### Semver (versionado semántico)

```
MAJOR.MINOR.PATCH  →  2.5.7
```

- **MAJOR** (2 → 3): rompe la API. Migrar con cuidado.
- **MINOR** (5 → 6): features nuevas, compatible hacia atrás.
- **PATCH** (7 → 8): bug fixes, compatible.

Rangos en `package.json`:
- `^2.5.7` → cualquier 2.x.x `>= 2.5.7` (default).
- `~2.5.7` → cualquier 2.5.x `>= 2.5.7`.
- `2.5.7` → exactamente esa.
- `*` → la más reciente (peligroso).

### Scripts

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "test": "vitest",
  "lint": "eslint src/"
}
```

Se corren con `npm run <script>`. (Los "oficiales" `start`, `test`, `install` no requieren `run`.)

### npx

`npx` ejecuta un paquete sin instalarlo globalmente:

```bash
npx create-vite@latest mi-app
npx serve .
```

## 9.3 Vite — dev server y bundler moderno

**Vite** (Evan You, creador de Vue) es la herramienta de build más usada en 2026 para frontend.

Por qué Vite y no Webpack/Parcel/Create-React-App:
- **Arranque instantáneo**: usa ESM nativo del navegador en dev.
- **HMR** (Hot Module Replacement) casi instantáneo.
- **Build de producción** con Rollup (optimizado).
- **Soporta** React, Vue, Svelte, TS, CSS modules, PostCSS, TailwindCSS.

### Crear un proyecto

```bash
npm create vite@latest mi-app
# Elegís framework: Vanilla, React, Vue, Svelte, TS, etc.
cd mi-app
npm install
npm run dev
```

Estructura típica:

```
mi-app/
├── index.html           # entry point (en la raíz, no en src/)
├── package.json
├── vite.config.js
├── public/              # archivos estáticos (se copian sin procesar)
│   └── favicon.svg
└── src/
    ├── main.js          # entry JS
    ├── style.css
    └── components/
```

### Scripts por defecto

```bash
npm run dev        # dev server (localhost:5173)
npm run build      # output en dist/ listo para producción
npm run preview    # sirve dist/ para probar antes de deploy
```

### Imports especiales que Vite entiende

```js
import './style.css';               // CSS: se inyecta en el HTML
import logo from './logo.svg';       // imagen → URL
import data from './datos.json';     // JSON → objeto
import logoUrl from './logo.png?url'; // URL explícita
import logoRaw from './logo.svg?raw'; // contenido como string
```

### Variables de entorno

```bash
# .env
VITE_API_URL=https://api.example.com
```

```js
console.log(import.meta.env.VITE_API_URL);
// Solo variables con prefijo VITE_ son accesibles en el cliente.
```

## 9.4 Git — control de versiones

### Configuración inicial

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global init.defaultBranch main
```

### Flujo básico

```bash
git init                          # inicializar repo
git status                        # ver estado
git add archivo.js                # agregar al staging
git add .                         # agregar todo
git commit -m "feat: agregar login"
git log                           # historial
git diff                          # cambios no staged
git diff --staged                 # cambios staged
```

### `.gitignore` mínimo

```
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
```

### Remotos (GitHub)

```bash
git remote add origin https://github.com/usuario/repo.git
git push -u origin main           # primera vez
git push                          # subsiguientes
git pull                          # traer cambios
git clone <url>                   # clonar un repo
```

### Branches

```bash
git branch                        # listar
git checkout -b feat/nueva        # crear y cambiar
git switch main                   # cambiar (moderno)
git merge feat/nueva              # mergear
git branch -d feat/nueva          # borrar
```

### Conventional commits (recomendado)

```
feat:     nueva feature
fix:      bug fix
chore:    tareas de mantenimiento
docs:     documentación
style:    formato (sin cambio de lógica)
refactor: refactor
test:     tests
perf:     performance
```

Ejemplo: `feat(auth): agregar login con Google`.

### Deshacer cosas

```bash
git restore archivo.js            # descartar cambios no staged
git restore --staged archivo.js   # sacar del staging
git reset --soft HEAD~1           # deshacer último commit, mantener cambios
git reset --hard HEAD~1           # deshacer último commit + cambios (PELIGRO)
git revert <sha>                  # crea un commit inverso (seguro)
```

## 9.5 GitHub

- Creá una cuenta en https://github.com.
- Subí tus proyectos.
- Tu perfil = tu CV técnico.

### Pull Requests (PRs)

El flujo "enterprise":
1. Creás una branch (`feat/login`).
2. Commits.
3. Push a GitHub.
4. Abrís un PR hacia `main`.
5. Review + CI + merge.

### GitHub Pages

Deploy gratis de sitios estáticos:
1. En repo Settings → Pages.
2. Source: `main` branch, carpeta `/` o `/docs`.
3. Tu sitio en `https://usuario.github.io/repo`.

### GitHub Actions

Automatización:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm test
```

## 9.6 ESLint — linter

Detecta errores y malas prácticas antes de que corras el código.

```bash
npm i -D eslint
npx eslint --init
```

Configuración ejemplo (`eslint.config.js`):

```js
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { window: 'readonly', document: 'readonly' }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
    }
  }
];
```

```bash
npm run lint         # ver errores
npm run lint -- --fix  # arreglar automático los que pueda
```

## 9.7 Prettier — formateo automático

Elimina discusiones sobre estilo: Prettier decide por vos.

```bash
npm i -D prettier
```

`.prettierrc.json`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

```bash
npx prettier --write .
```

Integralo con VS Code (extensión "Prettier — Code formatter") + "Format on save" en settings.

## 9.8 Editor (VS Code)

Extensiones imprescindibles:
- **ESLint** (Microsoft)
- **Prettier — Code formatter**
- **Live Server** (para HTML suelto)
- **GitLens**
- **Error Lens** (ves errores inline)
- **Auto Rename Tag**
- **Path Intellisense**
- Para React: **ES7+ React/Redux/React-Native snippets**.

`.vscode/settings.json` (por proyecto):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }
}
```

## 9.9 Testing (introducción)

```bash
npm i -D vitest
```

`src/utils.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { sumar } from './utils.js';

describe('sumar', () => {
  it('suma dos números', () => {
    expect(sumar(2, 3)).toBe(5);
  });
  it('funciona con negativos', () => {
    expect(sumar(-1, 1)).toBe(0);
  });
});
```

```bash
npm test
```

Profundizamos en el proyecto final (módulo 13).

## 9.10 Deployment

Opciones gratuitas para frontend:

| Servicio | Para qué |
|----------|----------|
| **Vercel** | Framework agnostic, excelente para Next/React |
| **Netlify** | Similar a Vercel, muy bueno para estáticos |
| **GitHub Pages** | Gratis, ideal para proyectos pequeños |
| **Cloudflare Pages** | Muy rápido, red global |

Flujo típico:
1. `npm run build` → genera `dist/`.
2. Conectás tu repo de GitHub en Vercel/Netlify.
3. Cada push a `main` → deploy automático.
4. Cada PR → preview URL único.

---

## 🧑‍🎓 Worked Example

> **Ejercicio**: "Heredaste un proyecto sin `README.md`. El build falla. ¿Cómo arrancás?"

**Mi checklist (esto me salvó decenas de veces):**

1. **Leer `package.json`.** Me dice:
   - Versión de Node esperada (`"engines.node"`).
   - Scripts disponibles (`"scripts"` → ¿hay `dev`, `build`, `test`?).
   - Dependencias — ¿están cerradas con `^`, `~`, o versión fija?

2. **Verificar Node.** `node -v`. Si hay `.nvmrc`, `nvm use`. Si no, usar la misma mayor que aparece en package.json.

3. **Borrar y reinstalar.** `rm -rf node_modules package-lock.json && npm install`. 80% de los builds rotos son dependencias corruptas o conflicts con `npm install --force`.

4. **Leer `package-lock.json` o `yarn.lock`.** Si hay conflictos de merge sin resolver (`<<<<<<<`), explica por qué no compila.

5. **Buscar archivos de config**: `tsconfig.json`, `vite.config.js`, `.env.example`. Si hay `.env.example` pero no `.env`, copialo: `cp .env.example .env.local`.

6. **Correr el script de dev.** Si falla, leer el error **completo** (no solo la primera línea). Los errors de Vite/TS son verbosos pero precisos.

7. **Si sigue fallando**: `git log --oneline -20` — a veces hay un commit reciente "WIP" que rompió algo. O `git status` muestra archivos no-commiteados sospechosos.

**Nunca haceras primero**: `npm install --legacy-peer-deps` o `--force`. Esas flags esconden problemas reales; úsalas como último recurso y documentá por qué.

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Diferencia entre <code>npm install</code> y <code>npm ci</code>?</strong></summary>

- `npm install` → lee `package.json`, puede actualizar `package-lock.json`, puede instalar versiones más nuevas según los rangos (`^`).
- `npm ci` → borra `node_modules`, instala **exactamente** lo que dice `package-lock.json`. Falla si el lock no coincide con el package.json.

**En CI usá `npm ci`** — es más rápido, determinístico, y falla ruidosamente si alguien olvidó commitear el lockfile.
</details>

<details>
<summary><strong>2. ¿Qué es un "peer dependency"?</strong></summary>

Una dep que el paquete **necesita pero no instala** — asume que la app huésped ya la tiene.

Ejemplo: `react-router-dom` declara `react` como peer dep. No trae React adentro — usa el tuyo. Así evitás dos copias de React (que romperían hooks).

Si instalás un paquete y te falta una peer dep, npm te avisa con warning.
</details>

<details>
<summary><strong>3. ¿Por qué Vite es más rápido que Webpack en dev?</strong></summary>

Webpack bundlea toda tu app antes de servirla. Vite usa **ESM nativo del navegador**: sirve los archivos uno por uno cuando el browser los pide.

Para dev: Vite inicia en <1s aun con apps grandes. Webpack puede tardar 30s+.

Para prod: ambos bundlean (Vite usa Rollup internamente). Ahí ya no hay diferencia gigante.
</details>

<details>
<summary><strong>4. ¿Qué hace <code>git rebase -i HEAD~3</code>?</strong></summary>

Abre un editor donde podés **reescribir los últimos 3 commits**: reordenar, fusionar (squash), renombrar, eliminar.

Útil para limpiar historia **local** antes de hacer push. ⚠️ Nunca rebases commits que ya pusheaste (reescribirías historia pública y romperías el repo de otros).

Flag interactivo (`-i`): abre editor. Sin `-i`: rebase directo.
</details>

<details>
<summary><strong>5. ¿Qué va en <code>dependencies</code> vs <code>devDependencies</code>?</strong></summary>

- `dependencies` → lo que necesita tu **app en producción**. Ej: `react`, `date-fns`, `zustand`.
- `devDependencies` → lo que solo necesitás en **desarrollo/build**. Ej: `vite`, `eslint`, `typescript`, `vitest`.

En producción (con `NODE_ENV=production`) o en deploys como Vercel que bundlean todo, esta distinción importa menos. Pero en librerías (paquetes que publicás a npm), es crítico: nadie quiere instalar tu linter al usar tu librería.
</details>

---

## Resumen ejecutivo

- `npm init` + `npm install` — básicos.
- Vite es **la** elección en 2026 para frontend.
- Git + GitHub para todo, siempre.
- `.gitignore` con `node_modules/` y `.env`.
- ESLint + Prettier por defecto.
- Conventional commits.
- Deploy gratis con Vercel/Netlify.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-proyecto-vite/` — proyecto Vite inicializado + README con pasos.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`10 — React`](../modulo-10-react/)
