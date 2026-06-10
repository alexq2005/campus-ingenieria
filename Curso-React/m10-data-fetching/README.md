# Módulo 10 — Data Fetching con TanStack Query

> ⏱ ~60 min · Pre-req: M06, M08

📖 **[Leer la lección (lecture.html)](./lecture.html)**

## Qué cubre

Por qué useEffect+fetch no escala en producción, y cómo TanStack Query resuelve cache, retry, dedup y mutations.

## Conceptos clave

- **Problema de useEffect+fetch**: sin cache, sin dedup, sin retry, sin refetch al refocus.
- `useQuery({ queryKey, queryFn })` — fetch declarativo con cache automático.
- **queryKey** es array; misma key = cache compartido entre componentes (no doble fetch).
- `enabled` para queries dependientes.
- `useMutation` para POST/PUT/DELETE + `invalidateQueries` en onSuccess.
- **Optimistic updates**: onMutate (snapshot + cambio) → onError (rollback) → onSettled (invalidate).
- `isLoading` (primer fetch) vs `isFetching` (cualquier fetch).
- `staleTime` controla cuándo refetch en background.
- `useInfiniteQuery` para infinite scroll.

## Separación crítica

- **Server state** (datos del backend) → TanStack Query / SWR.
- **Client state** (UI local) → useState / Zustand. NUNCA mezclar.

## Alternativa

SWR (de Vercel): más simple, más liviana.

**Siguiente:** [M11 — Estado Global](../m11-estado-global/)
