# Módulo S-03 — Testing Strategy

> *"Tests aren't about coverage. They're about confidence to refactor."* — Kent C. Dodds

---

## S3.0 Por qué este módulo

La diferencia entre "tengo tests" y "tengo una estrategia de testing" es lo que separa mid de senior.

Un junior escribe tests porque "hay que tener cobertura". Un senior define **qué** testea, **cómo**, **a qué nivel**, **cuánto** invierte vs el riesgo.

Este módulo te da el framework mental para tomar esas decisiones.

---

## S3.1 La pirámide de testing (clásica vs moderna)

### Clásica (Mike Cohn, 2009)

```
              /\
             /E2E\        ← pocos, lentos, frágiles
            /------\
           /  INT   \     ← más, medio velocidad
          /----------\
         /    UNIT    \   ← muchos, rápidos, baratos
        /--------------\
```

### Moderna (Kent Dodds, 2018) — "Testing Trophy"

```
              /\
             /E2E\        ← críticos del usuario
            /------\
           / INTEG  \     ← donde más valor
          /----------\
         /    UNIT    \   ← lógica pura
        /--------------\
       /     STATIC     \  ← TS, ESLint
      /------------------\
```

La diferencia: **integration tests son la inversión más valiosa** en frontend moderno. Más reales que unit, más rápidos que E2E.

---

## S3.2 Los 5 niveles de tests (en orden de costo)

### 1. Static analysis
Tipos (TypeScript), linting (ESLint), formato (Prettier). **Ya es testing** — encuentra bugs antes de runtime.

```ts
// Sin TS: este bug pasa a prod
function total(items) {
  return items.reduce((t, i) => t + i.precio, 0);
  // si algún item.precio es undefined → NaN
}

// Con TS strict + noUncheckedIndexedAccess
function total(items: Item[]): number {
  return items.reduce((t, i) => t + i.precio, 0);
  // TS te obliga a manejar items vacío, precio opcional, etc.
}
```

**Costo**: bajo (corre al guardar). **Valor**: alto.

### 2. Unit tests
Una función pura, una clase, un hook custom. Aislado de IO, DOM, red.

```ts
// utils/cart.test.ts
import { describe, it, expect } from 'vitest';
import { cart } from './cart';

describe('cart', () => {
  it('agrega un item nuevo con cantidad 1', () => {
    const c = { items: [] };
    expect(cart.add(c, { productId: 'p1' })).toEqual({
      items: [{ productId: 'p1', quantity: 1 }]
    });
  });

  it('si el item ya existe, incrementa cantidad', () => {
    const c = { items: [{ productId: 'p1', quantity: 2 }] };
    expect(cart.add(c, { productId: 'p1' }).items[0].quantity).toBe(3);
  });
});
```

**Cuándo aplica**: lógica pura (cálculos, validaciones, transformaciones, reducers).
**Cuándo NO**: cosas que solo tienen sentido con DOM/red/eventos.

### 3. Integration tests
Componentes interactuando con sus dependencias mockeadas mínimamente.

```tsx
// Login.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from './Login';

describe('<Login />', () => {
  it('al submit con credenciales válidas, llama a onLogin', async () => {
    const onLogin = vi.fn();
    const user = userEvent.setup();
    render(<Login onLogin={onLogin} />);

    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(onLogin).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret123' });
  });

  it('muestra error si email es inválido', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={vi.fn()} />);
    await user.type(screen.getByLabelText(/email/i), 'no-es-email');
    await user.tab();
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });
});
```

**Esto es donde más valor sacás** en React. Testea **comportamiento desde la perspectiva del usuario**, no implementación.

### 4. E2E tests (end-to-end)
Browser real, app real, backend real (o mock). Playwright o Cypress.

```ts
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('completar compra end-to-end', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Productos' }).click();
  await page.getByRole('button', { name: /agregar/i }).first().click();
  await page.getByRole('link', { name: /carrito/i }).click();
  await page.getByRole('button', { name: /comprar/i }).click();
  await page.getByLabel(/tarjeta/i).fill('4242424242424242');
  await page.getByRole('button', { name: /confirmar/i }).click();
  await expect(page.getByText(/orden #/i)).toBeVisible();
});
```

**Cuándo**: flujos críticos de negocio (checkout, signup, login). NO para todo.
**Costo alto**: lentos, frágiles, requieren infra.

### 5. Visual regression tests
Screenshot comparison. Storybook + Chromatic, o Playwright snapshots.

```ts
test('visual: home', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('home.png');
});
```

**Cuándo**: librería de componentes, design system. Captura cambios visuales no detectables por unit tests.

---

## S3.3 Qué testear vs qué no testear

### ✅ Testear con prioridad
- **Lógica de negocio** (cálculos, reglas, transformaciones)
- **Edge cases** que costaron tiempo descubrir (regression tests)
- **Caminos críticos del usuario** (signup, payment, primary CTA)
- **Componentes reutilizables** del design system
- **Custom hooks** con lógica no trivial
- **Validaciones de formulario**

### ❌ Probablemente NO necesitás testear
- Componentes de presentación pura (`<Avatar />` que solo muestra una imagen)
- Wrappers triviales sobre librerías externas
- CSS / estilos (visual regression sí, unit no)
- Markup HTML básico
- Funciones del framework (no testees React, ya está testeado)

### 🤔 Zona gris (decidir por contexto)
- Routing — útil testear que ciertas rutas resuelven a ciertas páginas, no más.
- Errores de red — sí los handlers, no fetch en sí.
- Componentes "wrapper" — depende de la lógica que añaden.

**Heurística senior**: ¿este test va a fallar cuando la feature se rompa? Si la respuesta es "tal vez" o "probablemente sí", vale. Si es "solo si refactor de implementación", no vale.

---

## S3.4 Stack moderno 2026

```
Vitest                 — runner (sucesor de Jest, integra con Vite)
React Testing Library  — render + queries por accessibility
@testing-library/user-event  — simulación de interacciones reales
Playwright             — E2E
Storybook              — desarrollo aislado de componentes
Chromatic              — visual regression
MSW (Mock Service Worker) — mock de fetch a nivel red
```

### Setup mínimo de un proyecto

```bash
npm i -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
npm i -D @playwright/test  # E2E
npm i -D msw  # mocks de red
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: { reporter: ['text', 'html'] },
  },
});
```

`src/tests/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);
```

---

## S3.5 React Testing Library — filosofía

> "The more your tests resemble the way your software is used, the more confidence they can give you." — Kent C. Dodds

### Queries: el orden que delata seniority

Priorizá en este orden:
1. `getByRole(...)` — semántica accesible
2. `getByLabelText(...)` — formularios
3. `getByPlaceholderText(...)` — fallback
4. `getByText(...)` — contenido visible
5. `getByDisplayValue(...)` — valores de form
6. `getByAltText(...)` — imágenes
7. `getByTitle(...)` — tooltips
8. `getByTestId(...)` — **último recurso**

```tsx
// ❌ Junior
const btn = container.querySelector('.submit-button');

// ⚠️ Mid
const btn = screen.getByTestId('submit-btn');

// ✅ Senior
const btn = screen.getByRole('button', { name: /enviar/i });
```

El último gana porque:
- Si cambia la clase, no rompe.
- Si cambia el data-testid, no rompe.
- Si cambia el texto del botón, **debería** romper (es un cambio real de UX).
- Si pierde accesibilidad (no tiene rol button), **rompe** — y eso es un bug real.

### get vs query vs find

- `getByX` — debe existir, throw si no.
- `queryByX` — devuelve null si no existe (para asserts negativos).
- `findByX` — async, espera hasta que aparezca (con timeout).

```ts
// Esperar a que aparezca después de un fetch
expect(await screen.findByText(/datos cargados/i)).toBeInTheDocument();

// Verificar que NO está
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
```

### user-event vs fireEvent

`fireEvent.click(btn)` dispara solo un evento. `userEvent.click(btn)` simula la **secuencia completa** que un usuario real hace: pointerdown, mousedown, focus, pointerup, mouseup, click.

**Siempre usá `userEvent`**. Es más realista, encuentra más bugs.

---

## S3.6 Mocking — niveles y cuándo

### Nivel 1: Stub de funciones
```ts
const fn = vi.fn();
fn.mockReturnValue(42);
```

### Nivel 2: Mock de módulos
```ts
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Ada' })
}));
```

### Nivel 3: MSW (Mock Service Worker)
Intercepta fetch a nivel de red. Tu código real corre, solo el "servidor" es fake.

```ts
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Mocked User' });
  }),
];

// tests/setup.ts
import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';

export const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Por qué MSW gana**: tu código de producción no cambia. Si refactor del fetch a otro lugar, el test sigue funcionando. Captura más bugs reales.

---

## S3.7 Patrones avanzados

### Test factories

Repetís `{ id: 1, name: 'X', email: 'x@y.com', ... }` en 30 tests. Una factory:

```ts
// tests/factories.ts
let id = 0;
export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: ++id,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}

// Uso
const admin = makeUser({ role: 'admin' });
```

### Custom render con providers

```tsx
// tests/render.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
    options
  );
}
```

Después en tests: `renderWithProviders(<MiComponente />)` — sin repetir setup.

### Snapshot tests (con cuidado)

```ts
expect(component).toMatchSnapshot();
```

⚠️ **Trampa de juniors**: snapshots gigantes que se actualizan automáticamente sin pensar. Aprueban cualquier cambio.

✅ **Senior**: usá inline snapshots para fragments pequeños:
```ts
expect(formatPrice(1234.56)).toMatchInlineSnapshot(`"$1,234.56"`);
```

### Property-based testing

Para lógica matemática o transformaciones:
```ts
import fc from 'fast-check';

test('reverse(reverse(x)) === x', () => {
  fc.assert(
    fc.property(fc.array(fc.string()), (arr) => {
      expect(arr.reverse().reverse()).toEqual(arr);
    })
  );
});
```

Genera 100 inputs random — encuentra edge cases que vos no pensabas.

---

## S3.8 Mutation testing — el siguiente nivel

> "100% line coverage no significa que tus tests sean buenos."

Mutation testing introduce bugs **a propósito** en tu código y verifica si tus tests los detectan. Stryker es el estándar.

```bash
npm i -D @stryker-mutator/core @stryker-mutator/vitest-runner
```

Si tenés:
```ts
function isAdult(age: number) { return age >= 18; }

test('mayor de 18 es adulto', () => {
  expect(isAdult(20)).toBe(true);
});
```

Stryker muta `>=` a `>` y corre el test. **Pasa** porque 20 > 18 también es true. Test inútil para edge case 18.

**Mutation score &gt; 80%** es buen indicador de tests robustos. **&gt;90% es excepcional**.

---

## S3.9 E2E con Playwright

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    { name: 'mobile',   use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
  },
});
```

### Patterns clave

**Page Object Pattern**:
```ts
// e2e/pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}
  async goto() { await this.page.goto('/login'); }
  async login(email: string, pwd: string) {
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/contraseña/i).fill(pwd);
    await this.page.getByRole('button', { name: /ingresar/i }).click();
  }
}

// test
test('login válido lleva al dashboard', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('a@b.com', 'pwd');
  await expect(page).toHaveURL('/dashboard');
});
```

**Auth setup global** (no logueás en cada test):
```ts
// auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'admin@test.com');
  await page.fill('#password', 'admin');
  await page.click('button[type=submit]');
  await page.context().storageState({ path: 'auth.json' });
});

// playwright.config.ts
projects: [
  { name: 'setup', testMatch: /auth\.setup\.ts/ },
  { name: 'authenticated', dependencies: ['setup'], use: { storageState: 'auth.json' } },
]
```

---

## S3.10 La estrategia: cuántos tests de cada tipo

No hay regla universal, pero un benchmark razonable:

```
Tipo                  | % de tu test suite | % del valor
─────────────────────────────────────────────────────────
Static (TS + ESLint)  | n/a (gratis)       | 30%
Unit                  | 30-40%             | 20%
Integration           | 50-60%             | 40%  ← inversión clave
E2E                   | 5-10%              | 10%
```

**Regla**: si solo podés escribir 1 test, escribí el integration test del happy path crítico. Cubre lo más importante con menos esfuerzo.

---

## 🧑‍🎓 Worked Example — qué tests escribir para una feature de "favoritos"

> Te piden agregar la feature: "usuario puede marcar productos como favoritos, persiste en backend".

**Mi proceso (los 5 niveles):**

### 1. Static — ¿qué tipos refuerzan correctness?

```ts
type Favorite = { userId: string; productId: string; createdAt: Date };
type FavoritesService = {
  list(userId: string): Promise<Favorite[]>;
  add(userId: string, productId: string): Promise<void>;
  remove(userId: string, productId: string): Promise<void>;
  isFavorite(userId: string, productId: string): Promise<boolean>;
};
```

Con TS strict, ya prevenimos:
- Llamar `add(productId, userId)` (orden invertido).
- Olvidarnos de `await`.
- Acceder a campos inexistentes.

### 2. Unit — lógica pura

¿Hay alguna lógica pura? Sí: ordenar favoritos por `createdAt`, filtrar duplicados, validar ID format.

```ts
test('sortByDate ordena de más reciente a más viejo', () => { ... });
test('dedupe quita duplicados conservando el más viejo', () => { ... });
```

### 3. Integration — el componente

```tsx
test('al click en favorito, llama al servicio y muestra el corazón lleno', async () => {
  const service = { add: vi.fn(), remove: vi.fn(), isFavorite: vi.fn().mockResolvedValue(false) };
  const user = userEvent.setup();

  renderWithProviders(<FavoriteButton productId="p1" service={service} />);

  const btn = await screen.findByRole('button', { name: /agregar a favoritos/i });
  await user.click(btn);

  expect(service.add).toHaveBeenCalledWith('p1');
  expect(await screen.findByRole('button', { name: /quitar de favoritos/i })).toBeInTheDocument();
});

test('rollback si el add falla', async () => {
  const service = { add: vi.fn().mockRejectedValue(new Error('Network')), ... };
  // verificar que el corazón vuelve a vacío y se muestra error
});
```

### 4. E2E — el flujo crítico

```ts
test('usuario marca y desmarca favoritos, se persisten', async ({ page }) => {
  await page.goto('/products/p1');
  await page.getByRole('button', { name: /agregar a favoritos/i }).click();
  await page.goto('/favorites');
  await expect(page.getByText('Producto P1')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Producto P1')).toBeVisible();  // persistió
});
```

### 5. Visual

Storybook story de `<FavoriteButton />` con 4 estados: empty, hovering, filled, loading. Chromatic captura screenshots — si cambia visualmente sin querer, el PR lo flagea.

**Total**: ~5 unit + 4 integration + 1 E2E + 4 stories. Cobertura estratégica, no ciega.

---

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Por qué <code>getByRole('button')</code> es mejor que <code>getByTestId('submit-btn')</code>?</strong></summary>

`getByRole` testea **lo que el usuario percibe** (el rol semántico). Si el botón pierde accesibilidad (era `<button>` y ahora es `<div onclick>`), el test rompe — y eso es un bug real.

`getByTestId` testea implementación. Si renombrás el data-testid, el test rompe pero la UX está intacta — falsa alarma.

Regla: testeá comportamiento, no implementación.
</details>

<details>
<summary><strong>2. ¿Cuándo usar mock de módulo vs MSW?</strong></summary>

- **Mock de módulo** (`vi.mock`): cuando querés controlar el output de UNA función específica del código.
- **MSW**: cuando querés mockear HTTP a nivel red — más realista, captura bugs de serialización, headers, etc.

Para tests de integration de componentes que hacen fetch, MSW es generalmente mejor porque tu código real (incluyendo TanStack Query, fetch, etc.) corre.
</details>

<details>
<summary><strong>3. ¿Por qué 100% de cobertura puede ser engañoso?</strong></summary>

Coverage mide **líneas ejecutadas**, no si los tests **detectan bugs**. Podés tener 100% sin assertions útiles.

Mutation testing (Stryker) es la métrica real: introduce bugs y verifica detección. Un mutation score de 60% con 100% coverage significa que muchos tests no afirman lo que importa.
</details>

<details>
<summary><strong>4. Te dan un budget de "1 test" por feature. ¿Cuál escribís?</strong></summary>

**Integration test del happy path crítico**.

Cubre la mayor parte del valor: flow real del usuario, render + interacción + assertion del resultado.

Unit: solo si hay lógica matemática compleja aparte.
E2E: solo para checkout/auth/CTA principal de la app.
</details>

<details>
<summary><strong>5. ¿Por qué snapshots gigantes son anti-patrón?</strong></summary>

Tendencia humana: cuando un snapshot grande falla, lo "actualizás" sin leer el diff. Apruebás cambios sin verificar.

Solución: **inline snapshots pequeños y específicos** (`toMatchInlineSnapshot`), o no usar snapshots y assertear comportamiento explícito (`expect(screen.getByText(...))...`).

Snapshots útiles: outputs deterministicos pequeños (formatters, parsers, configs serializadas).
</details>

---

## Resumen ejecutivo

- **Testing es estrategia**, no cobertura. Decidí qué testear basado en riesgo y valor.
- **Pyramid moderna**: integration tests son la inversión más rentable.
- **React Testing Library**: testeá comportamiento, no implementación. Queries por role.
- **MSW** &gt; module mocks para integration.
- **Playwright** para E2E críticos. NO para todo.
- **Mutation testing** revela tests débiles que coverage no muestra.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-testing-pyramid-explorer.html` — interactivo, mostrá qué tipo de test usar para cada situación.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`S-04 — Seguridad & Auth`](../modulo-04-seguridad-auth/)
