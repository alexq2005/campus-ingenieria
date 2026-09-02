# Problem Set 10 — React

## Sección A — Componentes y props

1. Construí un componente `<Boton variante="primary|danger|ghost" size="sm|md|lg" onClick icon?>`. Probá reutilizarlo 6 veces con distintas props.

2. Componente `<Rating value={3.5} max={5} />` que muestre estrellas llenas/medias/vacías. No es input — solo display.

3. Componente `<Avatar src? name iniciales? size />`: si hay `src` muestra imagen; si no, muestra iniciales sobre fondo de color único basado en el nombre.

## Sección B — useState

4. **Contador con historial**: además de `+1` / `-1`, mantené un array con todos los valores que pasó el contador. Mostralos como tags.

5. **Temperatura**: dos inputs (Celsius y Fahrenheit). Cambiar uno actualiza el otro. (Patrón: **lifting state up**.)

6. **Formulario de registro**: 4 campos con validación. Mostrar errores debajo de cada campo. Deshabilitar el botón si hay errores.

## Sección C — useEffect

7. **Hora en vivo**: mostrá la hora actualizada cada segundo. Cleanup del interval correctamente.

8. **Event listener global**: detectá cuando se presiona `Escape` y ejecutá una acción. Cleanup necesario.

9. **Fetch de GitHub user**: input de username + fetch a `api.github.com/users/{user}`. Mostrá avatar, bio, followers. Loading y error states.

## Sección D — Custom hooks

10. Implementá `useToggle(initial)` que devuelva `[value, toggle, setTrue, setFalse]`.

11. Implementá `useDebounce(value, ms)` que devuelva el valor debounced. Usalo en un input de búsqueda.

12. Implementá `useOnlineStatus()` que devuelva `true/false` según `navigator.onLine` y los eventos `online`/`offline`.

13. Implementá `useMediaQuery(query)` que reaccione a breakpoints (`useMediaQuery('(min-width: 768px)')`).

## Sección E — React Router

14. App con 4 rutas: `/`, `/about`, `/productos`, `/productos/:id`. NavBar con `<Link>`s. La ruta `/productos/:id` muestra el ID.

15. **Protected route**: una ruta `/admin` solo accesible si `isAuth === true`. Si no, redirigir a `/login`.

## Sección F — Apps medianas

16. **Buscador de películas** (OMDb, TMDB o similar): input con debounce → listado de resultados → click en una card → detalle. Paginación.

17. **Pokédex**: listado paginado de pokémon (PokéAPI). Filtro por tipo. Detalle con stats, evoluciones, movimientos.

18. **Gestor de notas**: CRUD completo con React Router (`/notas`, `/notas/nueva`, `/notas/:id`, `/notas/:id/editar`). Persistencia en localStorage.

## Sección G — Estado global

19. Migrá la lista de productos/carrito del módulo 7 a React con **Context API**. `CarritoProvider` envuelve la app; componentes acceden vía `useCarrito()` custom hook.

20. Reimplementá el mismo carrito con **Zustand**. Comparalo con Context — ¿cuál es menos boilerplate?

## Desafío

21. **Trello-lite**: Kanban con 3 columnas (TODO, Doing, Done). Drag & drop entre columnas. Persistencia.

22. **Chat en vivo** con WebSocket (podés usar un server público de testing, ej `wss://echo.websocket.org`): enviar mensajes y recibir los echos. Scroll automático al último mensaje.

## Entregable

Crear proyecto Vite + React (`npm create vite@latest ... --template react`). Implementar al menos 3 de los ejercicios medianos (E/F/G). Deploy a Vercel.
