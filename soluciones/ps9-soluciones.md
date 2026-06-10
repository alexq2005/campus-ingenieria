# Soluciones — PS9: Tooling

## Sección A — Setup

### 1. Verificar Node + npm

```bash
node --version     # v20.x.x o superior
npm --version      # 10.x.x
```

Si no los ves: reinstalá Node LTS desde https://nodejs.org y abrí una terminal NUEVA.

### 2. Configurar Git + SSH

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global init.defaultBranch main
git config --global pull.rebase false  # evita warnings

# SSH key
ssh-keygen -t ed25519 -C "tu@email.com"
# Enter x3 (usa defaults)

# Mostrar la clave pública para pegar en GitHub
cat ~/.ssh/id_ed25519.pub

# Verificar conexión
ssh -T git@github.com
```

En GitHub: Settings → SSH and GPG keys → New SSH key. Pegá la clave pública.

### 3. Crear repo + primer push

```bash
# En GitHub: crear "mi-primer-repo" (vacío, sin README)

# Local
mkdir mi-primer-repo && cd mi-primer-repo
echo "# Mi primer repo" > README.md
git init
git add README.md
git commit -m "chore: initial commit"
git branch -M main
git remote add origin git@github.com:TU_USUARIO/mi-primer-repo.git
git push -u origin main
```

## Sección B — Vite

### 4. Proyecto Vite + date-fns

```bash
npm create vite@latest cuenta-regresiva -- --template vanilla
cd cuenta-regresiva
npm install
npm install date-fns
```

`src/main.js`:
```js
import './style.css';
import { differenceInDays, differenceInHours, format } from 'date-fns';
import { es } from 'date-fns/locale';

const finAno = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);

function render() {
  const ahora = new Date();
  document.querySelector('#app').innerHTML = `
    <h1>${format(ahora, "EEEE d 'de' MMMM", { locale: es })}</h1>
    <p>Hora: ${format(ahora, 'HH:mm:ss')}</p>
    <p><strong>${differenceInDays(finAno, ahora)}</strong> días para fin de año</p>
    <p>${differenceInHours(finAno, ahora) % 24} horas extra</p>
  `;
}
setInterval(render, 1000);
render();
```

```bash
npm run dev
# Abrir http://localhost:5173
```

### 5. nanoid para IDs únicos

```bash
npm install nanoid
```

```js
import { nanoid } from 'nanoid';

const items = [];
document.querySelector('#btn').addEventListener('click', () => {
  items.push({ id: nanoid(), creado: Date.now() });
  console.log(items);
});
```

### 6. .env

`.env.local`:
```
VITE_API_KEY=supersecreta123
```

`src/main.js`:
```js
console.log(import.meta.env.VITE_API_KEY);  // 'supersecreta123'
```

⚠️ Solo variables con prefijo `VITE_` son accesibles en el cliente. **Nunca** pongas secretos reales ahí — cualquiera puede verlos en el bundle.

## Sección C — npm scripts

### 7. Scripts útiles

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist node_modules",
    "reinstall": "npm run clean && npm install",
    "validate": "npm run lint && npm run build"
  }
}
```

Para cross-platform (Windows + Unix), usá `rimraf`:
```bash
npm i -D rimraf
```
```json
"clean": "rimraf dist node_modules"
```

## Sección D — Git

### 8. Branching

```bash
git checkout -b feat/boton-nuevo

# Tres commits
echo "cambio 1" >> archivo.md && git commit -am "feat: primer cambio"
echo "cambio 2" >> archivo.md && git commit -am "feat: segundo cambio"
echo "cambio 3" >> archivo.md && git commit -am "feat: tercer cambio"

# Merge a main
git checkout main
git merge feat/boton-nuevo

# Ver historial
git log --oneline --graph --all
# * abc1234 (main, feat/boton-nuevo) feat: tercer cambio
# * def5678 feat: segundo cambio
# * 789abcd feat: primer cambio
```

### 9. Recuperar archivo borrado

```bash
# Ver historial del archivo
git log -- archivo.js

# Recuperar de un commit específico
git checkout <sha> -- archivo.js

# Si fue borrado pero el commit aún no se hizo:
git restore archivo.js
```

### 10. Resolver conflicto

```bash
# Terminal 1 (rama A)
git checkout -b feat/a
# Cambiar línea 1 de README.md → "Hola desde A"
git commit -am "feat: mensaje A"

git checkout main

# Terminal 2 (rama B)
git checkout -b feat/b
# Cambiar línea 1 → "Hola desde B"
git commit -am "feat: mensaje B"

git checkout main
git merge feat/a      # OK
git merge feat/b      # CONFLICTO
```

Editar el archivo manualmente:
```
<<<<<<< HEAD
Hola desde A
=======
Hola desde B
>>>>>>> feat/b
```

Decidir qué quedar, borrar los marcadores, guardar, y:
```bash
git add README.md
git commit           # con el mensaje default "Merge branch 'feat/b'"
```

## Sección E — ESLint + Prettier

### 11. Setup

```bash
npm i -D eslint @eslint/js prettier
```

`eslint.config.js`:
```js
import js from '@eslint/js';
export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { window: 'readonly', document: 'readonly', console: 'readonly' }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always']
    }
  }
];
```

`.prettierrc.json`:
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

Código con errores intencionales:
```js
var x = 1           // prefer-const + no falta punto y coma en Prettier
x == "1"            // eqeqeq
function unused() {} // no-unused-vars
console.log('hola') // no-console
```

```bash
npm run lint             # ver errores
npm run lint -- --fix    # arreglar los automatizables
npx prettier --write .   # formatear todo
```

### 12. Format on save en VS Code

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Sección F — Deploy

### 13. Vercel

```bash
npm i -g vercel
cd tu-proyecto
vercel          # seguir prompts interactivos
vercel --prod   # deploy de producción
```

O: entrar a https://vercel.com/new, login con GitHub, importar repo, deploy.

### 14. Netlify

Opción 1 — Netlify Drop (más fácil):
1. `npm run build`
2. Ir a https://app.netlify.com/drop
3. Arrastrar la carpeta `dist/`

Opción 2 — Conectar Git:
1. https://app.netlify.com/start
2. Autorizar GitHub → seleccionar repo.
3. Build command: `npm run build`. Publish directory: `dist`.

### 15. GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

En GitHub: Settings → Pages → Source: "GitHub Actions".

⚠️ Para Vite en GitHub Pages necesitás configurar `base: '/nombre-repo/'` en `vite.config.js`.

## Desafío

### 16. GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

En GitHub: Settings → Branches → Add rule para `main` → check "Require status checks to pass before merging" → seleccionar el workflow `CI`.

### 17. Monorepo con workspaces

```
mi-monorepo/
├── package.json            ← root
└── packages/
    ├── app1/
    │   └── package.json
    └── app2/
        └── package.json
```

`package.json` (raíz):
```json
{
  "name": "mi-monorepo",
  "private": true,
  "workspaces": ["packages/*"]
}
```

```bash
npm install                       # instala para todos
npm run dev --workspace=app1      # corre solo app1
npm install lodash -w app1        # instala solo en app1
```

---

**Patrones aprendidos**:
- SSH keys > HTTPS para GitHub (no pide password siempre)
- `npm ci` > `npm install` en CI (usa exactamente el lockfile)
- `.env.local` NO se commitea; `.env.example` sí (template)
- Vercel/Netlify detectan Vite automáticamente
- `actions/setup-node@v4` con `cache: 'npm'` acelera CI x5
