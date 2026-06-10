# Módulo 12 — Performance y Testing

> ⏱ ~70 min · Pre-req: M07, M08

📖 **[Leer la lección (lecture.html)](./lecture.html)**

## Qué cubre

Optimización (memo, code splitting, virtualización) y testing (Vitest + Testing Library).

## Performance

- **Regla de oro**: medí antes de optimizar (React Profiler). No memoices "por las dudas".
- **React.memo**: evita re-render si props no cambian. Combinar con useMemo/useCallback en el padre.
- **Code splitting**: `lazy(() => import('./X'))` + Suspense. Reduce bundle inicial.
- **Virtualización**: listas >100 items con TanStack Virtual / react-window.
- Imágenes (`loading="lazy"`, WebP), fonts (`font-display: swap`), tree-shaking.
- React Compiler (RC 2026): memoiza automáticamente.

## Testing

- Stack: **Vitest** + **Testing Library** + MSW + Playwright (E2E).
- Filosofía: "test how users use the app". Buscar por **role/text**, no por className.
- Prioridad de queries: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`.
- `userEvent` para simular interacciones. `vi.fn()` para mocks.
- **Pirámide**: muchos unit, medio integration, pocos E2E.

**Siguiente:** [M13 — TypeScript + Next.js 15](../m13-typescript-y-nextjs/)
