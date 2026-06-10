# Problem Set S-03 — Testing Strategy

## Sección A — Análisis crítico

1. Tomá un componente real de tu portfolio (o uno open source) que **no tenga tests**. Listá:
   - 5 cosas que SÍ deberías testear y por qué.
   - 3 cosas que probablemente NO valga la pena testear y por qué.
   - El nivel ideal para cada test (unit / integration / E2E / static).

2. Audit de un test suite existente (puede ser de un proyecto open source). Para 10 tests al azar:
   - ¿Testea comportamiento o implementación?
   - ¿Rompería si refactorizás sin cambiar el comportamiento?
   - ¿Detectaría si la feature realmente se rompe?

## Sección B — Setup

3. En un proyecto Vite + React + TS, configurá:
   - Vitest + React Testing Library + jsdom
   - MSW para mock de fetch
   - Playwright con 3 browsers (chromium, firefox, webkit)
   - GitHub Actions que corre lint + test + build en cada PR

4. Configurá **coverage** con `@vitest/coverage-v8`. Generá el reporte HTML.

## Sección C — Unit tests

5. Implementá y testeá una función `calcularDescuento(items, codigo)`:
   - Códigos válidos: `BIENVENIDO10` (10%), `VIP25` (25%), `BLACKFRIDAY50` (50%, solo en noviembre).
   - `BLACKFRIDAY50` solo aplica si la fecha actual está en noviembre.
   - Tests deben cubrir: códigos válidos, inválidos, mayúsculas/minúsculas, fecha de BLACKFRIDAY50.
   - Bonus: usá **fake timers** de Vitest para testear el caso de noviembre.

6. Testeá un reducer complejo (el del carrito del PS S-02 ej. 3). Cubrí:
   - Cada acción individualmente (10+ tests).
   - Edge cases: aplicar cupón con carrito vacío, remover item inexistente.
   - Inmutabilidad: el state previo no debe mutarse.

## Sección D — Integration tests con React Testing Library

7. Componente `<SearchBox onSearch debounceMs />` con debounce. Testeá:
   - Llama `onSearch` UNA vez después de tipear y esperar el debounce.
   - NO llama si el usuario sigue tipeando.
   - Llama con el último valor, no intermedios.
   - Pista: usá `vi.useFakeTimers()` + `vi.advanceTimersByTime()`.

8. `<UserProfile userId />` que hace fetch a `/api/users/:id`. Con MSW, testeá:
   - Renderiza loading inicial.
   - Renderiza datos cuando llega la respuesta.
   - Renderiza error si HTTP 500.
   - Renderiza empty state si HTTP 404.
   - Refetch al cambiar `userId`.

9. Custom hook `useFavorites(userId)`. Test con `renderHook` de RTL:
   - Devuelve lista inicial vacía.
   - `add(productId)` agrega y persiste.
   - `remove(productId)` quita.
   - `isFavorite(productId)` devuelve boolean correcto.

## Sección E — E2E con Playwright

10. Setup completo con **auth.json** que loguea una vez y reusa la sesión en todos los tests.

11. **Page Object** para `<LoginPage>` y `<DashboardPage>`. Tests:
    - Login válido lleva al dashboard.
    - Login inválido muestra error.
    - Tab key navega entre campos en el orden correcto.
    - Escape cierra el modal de "olvidé contraseña".

12. **Visual regression** con `expect(page).toHaveScreenshot()`. Capturá:
    - Home en desktop + mobile.
    - Form de login en estado inicial + con errores.
    - Card del producto en hover + active.

## Sección F — Mocking estratégico

13. Refactorizá un test que usa `vi.mock('./api')` para usar **MSW** en su lugar. Comentá las diferencias:
    - ¿Qué tests se vuelven más realistas?
    - ¿Hay algún caso donde el mock de módulo sigue siendo mejor?

14. **Test factory**:
    - Implementá `makeUser(overrides)`, `makeProduct(overrides)`, `makeOrder(overrides)`.
    - Que cada uno tenga IDs únicos auto-incrementales.
    - Bonus: agregá variantes (`makeAdmin()`, `makeProductOnSale()`) usando spread.

## Sección G — Mutation testing

15. Setup Stryker (`@stryker-mutator/core` + `@stryker-mutator/vitest-runner`). Corré la mutation en tu carpeta `src/utils/`.

16. Identificá los tests más "débiles" (mutaciones que sobreviven). Mejoralos hasta llevar el mutation score &gt; 80%.

## Sección H — Property-based testing

17. Con `fast-check`, escribí 3 propiedades para validar:
    - `JSON.parse(JSON.stringify(x))` es deep-equal a `x` para cualquier objeto serializable.
    - `arr.reverse().reverse()` siempre es igual al array original (cualquier tipo).
    - `cart.add(c, item)` siempre incrementa `cart.totalItems` en exactamente la cantidad del item.

## Desafío

18. **Test suite completo de un componente complejo**: tomá un `<DataTable>` con sort, filter, pagination, selección múltiple, y CSV export. Diseñá una test suite con:
    - Static (TS strict)
    - 10+ unit tests para utilidades de sort/filter
    - 15+ integration tests para interacción
    - 3-5 E2E para flujos críticos
    - 5+ visual snapshots
    - Mutation score &gt; 80% en utilidades

    Documentá en un README qué decisiones tomaste y por qué.

19. **CI con coverage gate**: configurá GitHub Actions que **falle** si:
    - Algún test falla.
    - Coverage cae &lt; 75% (líneas, ramas).
    - Mutation score &lt; 70%.
    - Lighthouse Performance &lt; 90 (Playwright + lighthouse).

    El mejor regalo para tu equipo.

## Entregable

Repo `cs-fe-senior-s03-testing` con:
- DataTable con su test suite completa (ej. 18).
- Workflow CI/CD con coverage + mutation gates (ej. 19).
- README documentando las decisiones de testing.

Esto es lo que un senior arma al empezar un proyecto nuevo.
