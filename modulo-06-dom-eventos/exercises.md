# Problem Set 6 — DOM y eventos

## Sección A — Selección y manipulación

1. En una página con un `<ul>` de 5 `<li>`, escribí JS que:
   - Pinte el primer `<li>` de azul.
   - Pinte el último de rojo.
   - Pinte los pares de amarillo.
   - Agregue la clase `.long` a cualquier `<li>` con más de 10 caracteres.

2. Dado:
```html
<ul class="cards">
  <li class="card" data-id="1" data-priority="3">Tarea A</li>
  <li class="card" data-id="2" data-priority="1">Tarea B</li>
  <li class="card" data-id="3" data-priority="2">Tarea C</li>
</ul>
```
Ordená visualmente las `<li>` por `data-priority` ascendente, sin cambiar el HTML original (modificá el DOM en memoria).

## Sección B — Eventos

3. **Contador click** con tres botones: +1, -1, reset. Mostrar el valor. Bonus: cambiar color rojo si es negativo, verde si > 0.

4. **Modal**: un botón "Abrir" que muestre un modal con un botón "Cerrar". Además se cierra con la tecla `Escape` o al cliquear fuera del modal. Pensá delegation y `e.target`.

5. **Validación en vivo**: un input email que muestra "✅ válido" o "❌ inválido" debajo mientras el usuario tipea (usá `e.target.validity.valid`).

## Sección C — Event delegation

6. Galería de 12 imágenes. Al hacer click en cualquier imagen, mostrar esa imagen en grande en un área fija. **Un solo listener** en el contenedor de la galería.

7. Tabla de 100 filas generadas por JS. Cada fila tiene un botón "Eliminar" y una casilla "Seleccionar". Manejá todo con **1 listener en la tabla**. Mostrá cuántas filas están seleccionadas en la parte superior.

## Sección D — Formularios y storage

8. **Formulario que se autosalva**: un formulario con 4 campos. Mientras el usuario tipea, guardar en `localStorage`. Al recargar, rellenar los campos con lo guardado. Botón "Limpiar".

9. **App de notas**: crear, editar, borrar notas. Persisten en `localStorage`. Cada nota tiene título y contenido. Mostrar fecha de creación (usá `toLocaleDateString`).

## Sección E — Patrones

10. Implementá tu propio `debounce(fn, ms)` y `throttle(fn, ms)` desde cero. Probalos con el evento `mousemove` mostrando la posición — compará los disparos.

11. **Ordenable por click**: una tabla de 5 columnas. Al hacer click en un `<th>`, ordenar las filas por esa columna. Segundo click, ordenar descendente. Indicador visual de columna activa (ej: flecha ▲/▼).

12. **Drag & drop entre listas**: dos `<ul>`. Podés arrastrar `<li>` entre ellas. Guardá el estado en `localStorage` para que persista al recargar. (Usá la HTML5 Drag & Drop API: `dragstart`, `dragover`, `drop`.)

## Sección F — Pequeñas apps completas

13. **Carrito de compras**:
    - Lista de productos con botón "Agregar".
    - Sidebar con items en el carrito (cantidad, subtotal, botón quitar).
    - Total en tiempo real.
    - Persistencia en `localStorage`.

14. **Quiz**:
    - 10 preguntas multiple choice.
    - Marca correcta/incorrecta al instante con color.
    - Puntaje final + % aprobado.
    - Botón "Reiniciar".

15. **Simón (memoria de colores)**:
    - 4 botones de colores.
    - La máquina muestra una secuencia creciente.
    - El usuario la repite. Si acierta, se agrega un color.
    - Si falla, game over con puntaje.

## Desafío

16. **Virtual DOM mini**: implementá una función `renderLista(arr)` que solo actualice los elementos `<li>` que cambiaron respecto al render anterior. Usá `key` (id) para identificarlos. Esto es el core conceptual de React.

17. **Reactividad a mano**: implementá un objeto observable:
```js
const state = observable({ nombre: 'Ada' });
bindText('#titulo', state, 'nombre');
state.nombre = 'Lin';   // el <h1> se actualiza solo
```

## Entregable

Una carpeta `ps6/` con al menos 5 archivos HTML. Bonus: deployá a GitHub Pages y compartí los links.
