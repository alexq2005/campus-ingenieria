# Cheatsheets — referencia rápida

## HTML — elementos más usados

```html
<!-- Estructura -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>
</head>
<body></body>
</html>

<!-- Semántica -->
<header> <nav> <main> <article> <section> <aside> <footer>
<h1>..<h6>
<p> <strong> <em> <code> <pre> <blockquote>
<ul><li>  <ol><li>  <dl><dt><dd>
<figure><img><figcaption>
<time datetime="2026-04-23">
```

## CSS — reset + box-sizing

```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
body { line-height: 1.6; -webkit-font-smoothing: antialiased; }
img, picture, video { max-width: 100%; display: block; }
```

## Flexbox en 5 líneas

```css
.contenedor {
  display: flex;
  flex-direction: row;       /* o column */
  justify-content: center;    /* eje principal */
  align-items: center;        /* eje cruzado */
  gap: 1rem;
}
```

## Grid responsive en 3 líneas

```css
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
```

## Centrado perfecto

```css
.centro {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}
```

## Media queries

```css
@media (min-width: 768px)  { /* tablet+ */ }
@media (prefers-color-scheme: dark) { /* dark */ }
@media (prefers-reduced-motion: reduce) { /* reduce motion */ }
```

## JavaScript — árray essentials

```js
arr.map(x => x * 2)
arr.filter(x => x > 0)
arr.reduce((a, b) => a + b, 0)
arr.find(x => x.id === 1)
arr.some(x => x)
arr.every(x => x)
arr.includes(5)
arr.flat()

[...new Set(arr)]              // desduplicar
Object.fromEntries(map)
```

## Destructuring

```js
const [a, b, ...rest] = arr;
const { x, y = 0, z: renamed } = obj;
```

## Fetch moderno

```js
const r = await fetch(url);
if (!r.ok) throw new Error(`HTTP ${r.status}`);
const data = await r.json();
```

## Async paralelo

```js
const [a, b, c] = await Promise.all([f1(), f2(), f3()]);
```

## React hooks esenciales

```jsx
const [n, setN] = useState(0);
useEffect(() => { /* ... */ }, [dep]);
const ref = useRef(null);
const memo = useMemo(() => calc(x), [x]);
const cb = useCallback(() => {}, [dep]);
const { value } = useContext(MyContext);
const [state, dispatch] = useReducer(reducer, initial);
```

## TypeScript básico

```ts
type User = { id: number; nombre: string; edad?: number };
const users: User[] = [];
type Status = 'idle' | 'loading' | 'error';
function get<T>(arr: T[]): T | undefined { return arr[0]; }
type UserPartial = Partial<User>;
type UserNombre = Pick<User, 'nombre'>;
```

## Git — comandos diarios

```bash
git status
git add .
git commit -m "feat: algo"
git push
git pull
git checkout -b feat/rama
git merge feat/rama
git log --oneline --graph
```

## Conventional commits

```
feat:     nueva feature
fix:      bug fix
chore:    tareas de mantenimiento
docs:     documentación
style:    formato
refactor: refactor sin cambio de funcionalidad
test:     tests
perf:     performance
```

## npm

```bash
npm init -y
npm install paquete              # dependencia
npm install -D paquete            # dev dependency
npm run script-name
npm outdated
npm update
npx paquete                        # ejecutar sin instalar global
```

## Lighthouse targets (mobile)

| Categoría | Objetivo |
|-----------|----------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |

## Web Vitals (2026)

| Métrica | Bueno | Malo |
|---------|-------|------|
| LCP | ≤ 2.5s | > 4s |
| INP | ≤ 200ms | > 500ms |
| CLS | ≤ 0.1 | > 0.25 |

## Accesibilidad — checklist rápida

- [ ] `<html lang="es">`.
- [ ] `<title>` por página.
- [ ] Un solo `<h1>`, sin saltos de nivel.
- [ ] `alt` en todas las imágenes.
- [ ] `<label>` en cada input.
- [ ] Contraste ≥ 4.5:1.
- [ ] Foco visible (`:focus-visible`).
- [ ] Navegable por teclado.
- [ ] `prefers-reduced-motion` respetado.
