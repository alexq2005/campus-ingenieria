# Problem Set 11 — TypeScript

## Sección A — Tipos básicos

1. Definí un `type Libro` con `titulo`, `autor`, `año`, `paginas`, `etiquetas` (array de strings), `disponible` (bool), `editor` (opcional). Creá 3 libros. Tipá una función `buscarPorEtiqueta(libros: Libro[], tag: string): Libro[]`.

2. Tipá una union `type Forma = Circulo | Cuadrado | Triangulo`. Cada una tiene un campo `tipo` discriminante. Escribí una función `area(f: Forma): number` usando `switch` con narrowing.

3. Implementá la función `primero` así:
```ts
function primero<T>(arr: T[]): T | undefined { ... }
```
y confirmá que el tipo del retorno se infiere correctamente con `primero([1,2,3])` (debería ser `number | undefined`).

## Sección B — Utility types

4. Dado `type User = { id: number; nombre: string; email: string; password: string }`, escribí:
   - `UserPublic` — sin `password` (usá `Omit`).
   - `UserCreate` — sin `id` pero con todo lo demás.
   - `UserUpdate` — todo opcional salvo `id`.

5. Dado una función `const fn = (x: number, y: string) => ({ x, y })`, obtené:
   - El tipo de sus parámetros con `Parameters<typeof fn>`.
   - El tipo de su retorno con `ReturnType<typeof fn>`.

## Sección C — Generics

6. Implementá `Pair<A, B>` como un tipo genérico `{ first: A; second: B }`. Usalo con distintos tipos.

7. Implementá una función `agrupar<T, K extends keyof T>(items: T[], key: K): Record<string, T[]>`.

8. Implementá `Lazy<T>` — una clase genérica que recibe una fábrica `() => T`, la ejecuta la primera vez que pedís `.value`, y cachea el resultado.

## Sección D — Discriminated unions

9. Creá el tipo `RequestState<T>` con variantes `idle`, `loading`, `success` con `data`, `error` con `message`. Escribí una función que renderice cada caso a un string.

10. Creá un tipo `Action` con variantes para un reducer de TODO: `{ type: 'ADD', texto: string }`, `{ type: 'REMOVE', id: number }`, `{ type: 'TOGGLE', id: number }`. Implementá el reducer con narrowing exhaustivo.

## Sección E — React + TS

11. Convertí el TODO app del módulo 10 (React vanilla) a TypeScript. Tipá:
    - El tipo `Todo`.
    - Props de cada componente.
    - El custom hook `useLocalStorage<T>`.

12. Creá un componente `<Select<T> options items onChange value />` **genérico** — que trabaje con cualquier tipo. Usa render props o generics en la firma.

## Sección F — Type gymnastics

13. Implementá `DeepReadonly<T>` que haga readonly todas las propiedades de un objeto, recursivamente.

14. Implementá `DeepPartial<T>` igual pero con opcionales recursivos.

15. Implementá `Paths<T>` que genere todas las rutas de un objeto anidado como string literals: `Paths<{ a: { b: { c: 1 } } }>` = `'a' | 'a.b' | 'a.b.c'`.

## Desafío

16. Tipá completamente la API de `fetch` con un helper:
```ts
api.get<User[]>('/users')
   .post<User, CreateUserDto>('/users', body)
   .delete<void>('/users/42');
```

17. **Expresión algebraica tipada**: `type Expr = Number | Add | Mul` que permita construir árboles de expresiones y evaluarlos con narrowing.

## Entregable

Proyecto Vite + React + TS con strict mode activado. Todo el código tipado (cero `any`, cero `@ts-ignore`).
