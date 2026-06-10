# Soluciones — PS4: CSS Layout

## Sección A — Flexbox

### 1. Navbar responsive

```html
<nav class="navbar">
  <a class="logo" href="/">Mi<span>Logo</span></a>
  <ul class="menu">
    <li><a href="/">Inicio</a></li>
    <li><a href="/productos">Productos</a></li>
    <li><a href="/contacto">Contacto</a></li>
  </ul>
  <a class="btn" href="/login">Login</a>
</nav>

<style>
  .navbar {
    display: flex; align-items: center; gap: 1rem;
    padding: 1rem 1.5rem; background: #0f172a; color: white;
  }
  .menu {
    display: flex; gap: 1.5rem; list-style: none; padding: 0; margin: 0;
    flex: 1; justify-content: center;
  }
  .menu a { color: white; text-decoration: none; }
  .btn { background: #0ea5e9; padding: 0.5rem 1rem; border-radius: 6px; }

  @media (max-width: 640px) {
    .navbar { flex-wrap: wrap; }
    .menu {
      flex-basis: 100%;
      flex-direction: column;
      gap: 0.5rem;
      order: 3;
    }
  }
</style>
```

Patrón clave: `flex-basis: 100%` + `order` para reordenar en mobile sin duplicar HTML.

### 2. Cards con alto parejo + botón al fondo

```css
.cards { display: flex; gap: 1rem; }
.card {
  flex: 1;                     /* todas el mismo ancho */
  display: flex;
  flex-direction: column;      /* contenido en columna */
  padding: 1rem;
  background: white;
  border-radius: 8px;
}
.card-body { flex: 1; }        /* empuja el botón al fondo */
.card .btn { margin-top: auto; }  /* alternativa: auto margin */
```

**Trampa**: si usás `height: 100%` en las cards no funciona; hay que dejar que flex iguale con `align-items: stretch` (default).

### 3. Centrado perfecto (4 líneas)

```css
body { margin: 0; }
.centro {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}
```

## Sección B — Grid

### 4. Calendario 7×5

```html
<div class="calendar">
  <div class="day-header">L</div>
  <div class="day-header">M</div>
  <div class="day-header">X</div>
  <div class="day-header">J</div>
  <div class="day-header">V</div>
  <div class="day-header">S</div>
  <div class="day-header">D</div>
  <!-- 35 celdas con JS o hard-codeadas -->
</div>

<style>
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  .day-header { font-weight: bold; text-align: center; padding: 0.5rem; }
  .day { aspect-ratio: 1; background: #f1f5f9; display: grid; place-items: center; border-radius: 4px; }
</style>

<script>
  // Generar 35 días dinámicamente
  const cal = document.querySelector('.calendar');
  for (let i = 1; i <= 35; i++) {
    const d = document.createElement('div');
    d.className = 'day';
    d.textContent = i <= 30 ? i : '';
    cal.appendChild(d);
  }
</script>
```

### 5. Dashboard con grid-template-areas

```css
.dashboard {
  display: grid;
  grid-template-areas:
    "nav header header"
    "nav main   aside"
    "nav footer footer";
  grid-template-columns: 200px 1fr 240px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 0.5rem;
}
.nav    { grid-area: nav; }
.header { grid-area: header; }
.main   { grid-area: main; }
.aside  { grid-area: aside; }
.footer { grid-area: footer; }

@media (max-width: 768px) {
  .dashboard {
    grid-template-areas:
      "nav"
      "main"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
  /* drawer: la nav se oculta y se muestra con un botón */
}
```

### 6. Galería masonry-ish

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}
.gallery img { width: 100%; aspect-ratio: 1; object-fit: cover; }
.gallery img:nth-child(3n+1) { grid-column: span 2; }
```

**Nota**: esto NO es masonry real (filas desiguales). Para masonry real: `grid-template-rows: masonry` (experimental) o usar una lib como `masonry-layout`.

## Sección C — Responsive

### 7. CV responsive

Estructura clave:

```css
/* Mobile first — base */
.cv-header { display: flex; flex-direction: column; align-items: center; }

/* Tablet 640+ */
@media (min-width: 640px) {
  .cv-header { flex-direction: row; gap: 1.5rem; }
}

/* Desktop 1024+ — 2 columnas de contenido */
@media (min-width: 1024px) {
  .cv-content {
    display: grid;
    grid-template-columns: 2fr 1fr;  /* experiencia más ancha */
    gap: 2rem;
  }
}
```

### 8. Dark mode toggle

```html
<button id="toggle">🌓</button>

<script>
  const saved = localStorage.getItem('theme');
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  document.getElementById('toggle').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
</script>
```

## Sección D — Patterns

### 9. Sidebar intrínseca (Every Layout)

```css
.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
.sidebar {
  flex-basis: 240px;
  flex-grow: 1;
}
.main {
  flex-basis: 0;
  flex-grow: 999;          /* crece mucho más que sidebar */
  min-inline-size: 50%;    /* fuerza a saltar de línea si < 50% */
}
```

Sin media queries. Cuando el viewport es angosto, `min-inline-size: 50%` fuerza a `main` a envolver → sidebar termina arriba.

### 10. Cluster

```css
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tag {
  background: #f1f5f9;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.85em;
}
```

## Desafío

### 12. Holy Grail en 10 líneas

```css
body { min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto; margin: 0; }
main { display: grid; grid-template-columns: 200px 1fr 200px; gap: 1rem; padding: 1rem; }
```

Son 2 líneas de selectores, con 2 `display: grid` anidados.

### 13. Container queries

```css
.card { container-type: inline-size; }

.card-inner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@container (min-width: 400px) {
  .card-inner {
    flex-direction: row;
    align-items: center;
  }
  .card-image { flex: 0 0 40%; }
}
```

**Magia**: la misma card se reorganiza según el espacio de su *contenedor*, no del viewport. Poné 2 cards — una en sidebar angosta y otra en main ancho — y cada una se layout-ea distinto.

---

**Patrones aprendidos en este PS**:
- `flex: 1` para iguales; `flex-basis + flex-grow` para intrínsecos
- `grid-template-areas` es leíble
- `repeat(auto-fit, minmax())` es magia responsive
- Mobile-first + `min-width` queries
- Container queries para componentes reutilizables
