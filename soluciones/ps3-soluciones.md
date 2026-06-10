# Soluciones — PS3: CSS fundamentos

## Sección A — Especificidad

### 1. Calcular especificidad

| # | Selector | a,b,c,d | Puntos totales |
|---|----------|---------|----------------|
| 1 | `p` | 0,0,0,1 | 1 |
| 2 | `.btn` | 0,0,1,0 | 10 |
| 3 | `#header` | 0,1,0,0 | 100 |
| 4 | `ul li a` | 0,0,0,3 | 3 |
| 5 | `nav .link:hover` | 0,0,2,1 | 21 |
| 6 | `#main article.post h2` | 0,1,1,2 | 112 |
| 7 | `a[href^="https"]` | 0,0,1,1 | 11 |
| 8 | `input:not([type="submit"])` | 0,0,1,1 | 11 |

(El selector dentro de `:not()` cuenta, pero `:not()` en sí no suma.)

**Ordenados de menor a mayor**:
`p` (1) < `ul li a` (3) < `.btn` (10) < `a[href^="https"]` = `input:not([type="submit"])` (11) < `nav .link:hover` (21) < `#header` (100) < `#main article.post h2` (112).

---

## Sección B — Debugging

### 9. ¿Por qué sigue siendo negro?

```css
h1.titulo { color: blue; }    /* 0,0,1,1 = 11 */
#pagina h1 { color: black; }  /* 0,1,0,1 = 101 */
```

`#pagina h1` tiene más especificidad (tiene un ID) — por eso gana. Arreglarlo **sin `!important`**:

**Opciones**:

```css
/* Opción A: aumentar especificidad */
#pagina h1.titulo { color: blue; }        /* 0,1,1,1 = 111 */

/* Opción B: refactor — eliminar el ID del selector */
.page-titulo { color: blue; }             /* aplicar clase directamente al h1 */

/* Opción C (moderna): @layer para controlar precedencia */
@layer base, overrides;
@layer base { #pagina h1 { color: black; } }
@layer overrides { h1.titulo { color: blue; } } /* gana por el layer */
```

**La mejor**: la B. Refactor. Los IDs en CSS son cadenas de deuda técnica.

### 10. Button hover que no funciona

```css
button:hover { background: red !important; }
button { background: blue; }
```

En realidad esto **sí funciona** en un test aislado. Si no funciona en tu caso es porque:

1. Hay otra regla más específica en otro archivo CSS (ej: `.card button { background: green; }`).
2. Hay un stylesheet externo cargado después.
3. Frameworks como Bootstrap/Tailwind tienen sus propios hovers que ganan.

**Método de diagnóstico**:
- DevTools → Elements → Styles.
- Mirá todas las reglas aplicadas al botón (tacha las perdedoras con línea).
- Hover con DevTools "Force element state :hover".

**Evitar `!important`** — si lo necesitás, es síntoma de un problema de arquitectura CSS más profundo.

---

## Sección C — Box model

### 11. Cálculos de box model

Elemento: `width: 300px; padding: 16px; border: 2px; margin: 24px`.

**Con `box-sizing: content-box`** (default):
- `content` = 300 px
- `padding` = 16 × 2 = 32 px
- `border` = 2 × 2 = 4 px
- **Caja total** = 300 + 32 + 4 = **336 px**
- `margin` = 24 × 2 = 48 px
- **Espacio horizontal ocupado** = 336 + 48 = **384 px**

**Con `box-sizing: border-box`**:
- `content` = 300 − 32 − 4 = 264 px
- `padding` = 32 px
- `border` = 4 px
- **Caja total** = **300 px** (tal como pedías)
- **Espacio horizontal ocupado** = 300 + 48 = **348 px**

### 12. ¿Por qué `margin: 0 auto` funciona en block y no en inline?

- Elementos **block** por default ocupan todo el ancho disponible. Con `width` definido, queda espacio a los lados. `margin: auto` reparte ese espacio sobrante entre izquierda y derecha por igual → centrado.
- Elementos **inline** no tienen ancho computable (ocupan solo lo que su contenido necesita). No hay "espacio sobrante" que repartir. Además, `width`/`height` son ignorados en inline.

Solución para centrar inline:
```css
.contenedor { text-align: center; }    /* centra hijos inline */
/* o convertir a inline-block / flex item */
```

---

## Sección D — Construcción (ejemplo de tarjeta de perfil)

### 13. Tarjeta de perfil

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tarjeta de perfil</title>
  <style>
    :root {
      --primary: #0ea5e9;
      --text: #0f172a;
      --muted: #64748b;
      --surface: #ffffff;
      --border: #e2e8f0;
      --shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    [data-theme="dark"], 
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        --text: #f1f5f9;
        --muted: #94a3b8;
        --surface: #1e293b;
        --border: #334155;
        --shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
    }

    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: system-ui, sans-serif;
      background: color-mix(in srgb, var(--surface) 60%, #cbd5e1);
      color: var(--text);
      min-height: 100vh;
      display: grid;
      place-items: center;
      margin: 0;
      padding: 1rem;
    }

    .tarjeta {
      max-width: 320px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: var(--shadow);
      text-align: center;
    }

    .tarjeta img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid var(--primary);
    }

    .tarjeta h2 { margin: 0.8rem 0 0.2rem; }
    .tarjeta p  { color: var(--muted); margin: 0; }

    .botones {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.2rem;
    }
    .btn {
      flex: 1;
      padding: 0.6rem;
      border: 0;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.15s, transform 0.1s;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: #0284c7; transform: translateY(-1px); }
    .btn-ghost { background: transparent; color: var(--text); border: 1px solid var(--border); }
    .btn-ghost:hover { background: var(--border); transform: translateY(-1px); }
  </style>
</head>
<body>
  <article class="tarjeta">
    <img src="https://i.pravatar.cc/240" alt="Foto de perfil de Ada Lovelace">
    <h2>Ada Lovelace</h2>
    <p>Frontend Developer</p>
    <div class="botones">
      <button class="btn btn-primary">Seguir</button>
      <button class="btn btn-ghost">Mensaje</button>
    </div>
  </article>
</body>
</html>
```

### 14. Tipografía fluida

```css
h1 { font-size: clamp(1.8rem, 4vw + 1rem, 3rem); line-height: 1.2; }
h2 { font-size: clamp(1.4rem, 3vw + 0.8rem, 2.25rem); line-height: 1.2; }
p  { font-size: 1rem; max-width: 65ch; line-height: 1.6; }
```

Probá redimensionar la ventana — los headings cambian suavemente.

---

## Sección E — Selectores

### 15. Selectores CSS

```css
/* Inputs inválidos no vacíos */
input:invalid:not(:placeholder-shown) { border-color: red; }

/* Primer li de cada ul */
ul > li:first-child { font-weight: bold; }

/* Pares de la lista */
li:nth-child(even) { background: #f0f0f0; }

/* Links que abren PDFs */
a[href$=".pdf"]::after { content: " 📄"; }

/* h2 con img como hijo directo */
h2:has(> img) { /* CSS :has() soportado en navegadores modernos 2023+ */ }

/* Enlaces externos */
a[href^="http"]:not([href*="midominio.com"]) { }
```

---

## Desafío

### 16. Like button animado (CSS-only)

```html
<input type="checkbox" id="like" class="like-toggle" hidden>
<label for="like" class="like-btn" aria-label="Me gusta">
  <svg viewBox="0 0 24 24" width="32" height="32">
    <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>
  </svg>
</label>

<style>
  .like-btn svg {
    fill: none;
    stroke: #94a3b8;
    stroke-width: 2;
    transition: transform 0.2s, fill 0.3s, stroke 0.3s;
    cursor: pointer;
  }
  .like-btn:hover svg { transform: scale(1.15); }
  .like-toggle:checked + .like-btn svg {
    fill: #ef4444;
    stroke: #ef4444;
    animation: pop 0.4s ease;
  }
  @keyframes pop {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.4); }
  }
</style>
```

### 17. Dropdown CSS-only

```html
<div class="dropdown">
  <button>Menú</button>
  <ul>
    <li><a href="#">Perfil</a></li>
    <li><a href="#">Ajustes</a></li>
    <li><a href="#">Cerrar sesión</a></li>
  </ul>
</div>

<style>
  .dropdown { position: relative; display: inline-block; }
  .dropdown ul {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 0.5rem 0;
    min-width: 150px;
    list-style: none;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  /* Muestra al hover O cuando algún hijo recibe foco (teclado) */
  .dropdown:hover ul,
  .dropdown:focus-within ul {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  .dropdown a {
    display: block;
    padding: 0.5rem 1rem;
    color: #0f172a;
    text-decoration: none;
  }
  .dropdown a:hover { background: #f1f5f9; }
</style>
```

Clave: `:focus-within` lo hace accesible por teclado (Tab abre el menú, porque un link adentro recibe foco).
