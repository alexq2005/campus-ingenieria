# Problem Set 9 — Tooling

## Sección A — Setup

1. Instalá Node 20+ y verificá con `node -v` y `npm -v`.

2. Configurá Git globalmente (`user.name`, `user.email`). Generá una SSH key (`ssh-keygen -t ed25519`) y agregala a GitHub.

3. Creá un repo `mi-primer-repo` en GitHub. Clonalo localmente. Agregá un `README.md`, commit y push.

## Sección B — Vite

4. Creá un proyecto Vite (vanilla JS). Instalá `date-fns`. Hacé una página que muestre: hora actual, fecha, y cuenta regresiva hasta fin de año.

5. Modificá el proyecto anterior: instalá `nanoid` (genera IDs únicos) y un botón que agrega elementos a una lista con IDs únicos.

6. Creá un archivo `.env.local` con `VITE_API_KEY=miclave`. Imprimila en consola con `import.meta.env.VITE_API_KEY`.

## Sección C — npm scripts

7. En tu proyecto, agregá estos scripts a `package.json`:
   - `clean`: borra `dist/` y `node_modules/`.
   - `reinstall`: corre `clean` y después `install`.
   - `validate`: corre `lint`, después `build`.

## Sección D — Git

8. **Ejercicio de branching**:
   - Crear rama `feat/boton-nuevo`.
   - Hacer 3 commits en esa rama.
   - Mergearla a main (merge, no rebase).
   - Ver el historial con `git log --oneline --graph --all`.

9. **Recuperar código borrado**: hacé un commit, borrá el archivo, commiteá. Ahora recuperá el archivo de un commit anterior (`git checkout <sha> -- archivo.js`).

10. **Conflicto**: creá un conflict voluntario:
    - Rama A modifica línea 1 del README.
    - Rama B modifica línea 1 del README.
    - Mergealas. Resolvé el conflicto manualmente.

## Sección E — ESLint + Prettier

11. En tu proyecto, configurá ESLint y Prettier. Creá código con varios errores intencionales (vars sin usar, `==` en vez de `===`, comillas mezcladas). Verificá que ESLint las detecte y Prettier las arregle.

12. Configurá "Format on save" en VS Code.

## Sección F — Deploy

13. Deployá tu proyecto a **Vercel** (conectado a GitHub). Compartí el URL.

14. Deployalo también a **Netlify** y compará la experiencia.

15. (Opcional) Deployalo a **GitHub Pages** — más simple pero con limitaciones.

## Desafío

16. **GitHub Actions**: creá un workflow que corra `npm run lint` y `npm test` en cada PR. Si falla, el merge se bloquea.

17. **Monorepo**: creá una carpeta con 2 sub-proyectos (`app1`, `app2`) y usá **workspaces** de npm para compartir dependencias.

## Entregable

Link del repo en GitHub y URL del deploy. Tu primer proyecto "real".
