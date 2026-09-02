# Problem Set 1 — Cómo funciona la Web

> *"Teach yourself by failing, then succeeding."*

## Sección A — Comprensión (escritas)

1. Explicá en tus propias palabras la diferencia entre **Internet** y **Web**.
2. Listá los 13 pasos del ciclo "de URL a píxel" (sección 1.5 del lecture). Para cada paso, decí **qué puede salir mal**.
3. ¿Por qué HTTP se llama "stateless"? ¿Qué mecanismos usamos para "simular estado" entre requests?
4. Dado un código de estado, respondé qué significa sin buscarlo: `200`, `204`, `301`, `304`, `400`, `401`, `403`, `404`, `429`, `500`, `502`.
5. Explicá la diferencia entre **Layout**, **Paint** y **Composite** en el render pipeline.

## Sección B — DevTools

6. Abrí `https://developer.mozilla.org` en una pestaña nueva. En la pestaña **Network** de DevTools:
   - ¿Cuántos requests hizo la página?
   - ¿Cuál fue el más pesado en bytes?
   - ¿Cuánto tardó el primero (el documento HTML) en completarse?
   - ¿Qué valor tiene el header `Content-Type` de ese primer request?

7. En la pestaña **Elements**, inspeccioná el `<h1>` principal. Modificalo en vivo a "Hackeé MDN" (solo visualmente en tu navegador — nada se guarda en el servidor). Confirmá que recargar la página revierte el cambio. Escribí por qué esto **no** es un hackeo real.

## Sección C — Experimento práctico

8. Abrí [`examples/02-demo-render-pipeline.html`](./examples/02-demo-render-pipeline.html). Con la pestaña **Performance** grabando:
   - Cliqueá "Cambiar width" 5 veces. Parar grabación. ¿Cuánto tiempo total de Layout se ve?
   - Repetir con "Cambiar transform" 5 veces. ¿Y ahora?
   - Escribí una conclusión de 3 líneas sobre por qué animar con `transform` es más eficiente.

## Desafío (opcional)

9. **Traceroute visual**: usá la terminal y ejecutá `tracert google.com` (Windows) o `traceroute google.com` (macOS/Linux). Contá cuántos "saltos" (routers) hay entre vos y Google. Cada línea es una computadora intermedia en el camino de tu request.

10. **CURL manual**: instalá `curl` (ya viene con Git Bash). Ejecutá:
    ```bash
    curl -v https://example.com
    ```
    Identificá en el output:
    - La línea que muestra el handshake TLS.
    - El request HTTP que envió `curl`.
    - El response del servidor (status + headers + body).

## Entregable

Escribí tus respuestas en un archivo `ps1.md` local. No tenés que compartirlo — es para vos. Pero **escribilo**; pensar escribiendo es pensar mejor.
