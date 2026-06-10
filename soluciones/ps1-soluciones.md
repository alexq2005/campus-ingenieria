# Soluciones — PS1: Cómo funciona la Web

## Sección A — Comprensión

### 1. Internet vs Web

- **Internet**: red física global de computadoras conectadas (cables, fibra, Wi-Fi, satélites). Existe desde 1969 (ARPANET).
- **Web (WWW)**: un servicio que corre **sobre** Internet, basado en HTTP + HTML + URLs. Existe desde 1989.
- Otros servicios sobre Internet: email (SMTP), FTP, SSH, BitTorrent, gaming, streaming (RTMP/HLS).

**Analogía**: Internet son las rutas y autopistas; la Web es un sistema de correos específico que usa esas rutas.

### 2. Los 13 pasos del ciclo URL → píxel (qué puede fallar)

| Paso | Qué puede salir mal |
|------|---------------------|
| 1. Parse URL | URL malformada, protocolo no soportado |
| 2. DNS lookup | Dominio no existe, DNS caído, cache envenenado |
| 3. TCP handshake | Firewall bloquea, paquetes perdidos, timeout |
| 4. TLS handshake | Certificado expirado, CN no matchea, versión TLS obsoleta |
| 5. HTTP Request | Headers demasiado grandes, método no soportado |
| 6. Server processing | Bug, DB caída, 500 error, timeout |
| 7. HTTP Response | 4xx, 5xx, conexión cerrada a mitad |
| 8. Parse HTML | HTML malformado (navegador es tolerante, pero igual degrada) |
| 9. Parse CSS | Sintaxis inválida (se ignora la regla), imports lentos |
| 10. Ejecución JS | Error de sintaxis, excepción no atrapada, bloqueo |
| 11. Layout | Layouts contradictorios, recalculo excesivo |
| 12. Paint | Demasiadas capas, GPU saturada |
| 13. Composite | Texturas muy grandes para la VRAM |

### 3. ¿Por qué HTTP es "stateless"?

Cada request HTTP es **independiente** — el servidor no recuerda nada del request anterior por sí solo. Esto simplifica el protocolo y permite escalar (cualquier servidor puede atender cualquier request).

**Mecanismos para simular estado:**
- **Cookies**: el servidor manda un `Set-Cookie` y el navegador lo reenvía en cada request subsiguiente.
- **Sesiones**: combinación de cookie + estado en el servidor (DB/Redis).
- **JWT / tokens**: el cliente manda un token firmado en `Authorization: Bearer ...`.
- **Query string / URL**: `/buscar?q=react&page=2` incluye estado en la URL.
- **localStorage / sessionStorage**: estado del lado del cliente.

### 4. Códigos de estado

| Código | Significado |
|--------|-------------|
| **200** | OK — todo bien |
| **204** | No Content — éxito sin body (ej: DELETE exitoso) |
| **301** | Moved Permanently — redirección permanente |
| **304** | Not Modified — el cliente puede usar su caché |
| **400** | Bad Request — request malformado |
| **401** | Unauthorized — no autenticado |
| **403** | Forbidden — autenticado pero sin permiso |
| **404** | Not Found — recurso no existe |
| **429** | Too Many Requests — rate limit |
| **500** | Internal Server Error — bug en el servidor |
| **502** | Bad Gateway — un proxy recibió respuesta inválida del upstream |

### 5. Layout vs Paint vs Composite

- **Layout (reflow)**: calcular la posición y tamaño de cada elemento en la página. Dispara cascada (cambio en un elemento puede afectar hermanos, padres, hijos). **Caro**.
- **Paint**: llenar píxeles (colores, bordes, sombras, texto) en capas. **Menos caro**.
- **Composite**: combinar las capas pintadas usando la GPU. **Barato**, paralelizable.

**Qué dispara cada uno**:
- Cambiar `width`, `height`, `top`, `left`, agregar/quitar elementos → Layout + Paint + Composite.
- Cambiar `background`, `color`, `box-shadow` → Paint + Composite.
- Cambiar `transform`, `opacity` → **solo** Composite (GPU, súper rápido).

**Por eso animás con `transform` y `opacity`**.

---

## Sección B — DevTools

### 6. MDN analysis

Respuestas varían (MDN cambia), pero deberías ver aproximadamente:

- **~30–60 requests** (HTML inicial + CSS + JS + imágenes + fuentes).
- El más pesado suele ser un JS bundle o una imagen (varía entre 200 KB y 1 MB).
- El HTML inicial tarda típicamente **50–300 ms** (depende de tu conexión).
- `Content-Type` del HTML: `text/html; charset=utf-8`.

### 7. "Hackear" MDN en DevTools

Inspecciona el `<h1>`, doble click en el texto, cambialo. La razón por la que **no** es un hackeo real: solo modificaste el DOM **en memoria, en tu navegador**. El servidor de MDN no se enteró. Cuando recargás, el navegador descarga el HTML original del servidor.

**Hackeo real** implicaría modificar lo que MDN sirve a **otros usuarios** — eso requiere comprometer su servidor, lo que es ilegal y penalizado.

---

## Sección C — Experimento

### 8. Performance profile

Con 5 clicks en "Cambiar width":
- Verás ~5 franjas moradas (Layout) y verdes (Paint). Tiempo total típico: **15–50 ms** total.

Con 5 clicks en "Cambiar transform":
- Solo ves franjas de Composite. Tiempo total: **<5 ms**.

**Conclusión (3 líneas)**:
> `width` dispara re-layout, que es la operación más costosa del pipeline: el navegador debe recalcular posiciones de todos los elementos afectados y repintar cada capa. `transform` solo modifica una matriz en la GPU durante la composición. Para animaciones fluidas a 60fps (16.6ms por frame), siempre usar `transform`/`opacity`.

---

## Desafíos

### 9. Traceroute

`tracert google.com` (Windows) o `traceroute google.com` (Unix) muestra entre **8–15 saltos** típicamente:

```
  1   <1 ms   tu router doméstico (192.168.x.x)
  2   10 ms   tu ISP (gateway)
  3   15 ms   nodo regional del ISP
  4   20 ms   nodo internacional
  5–8        backbone de Internet
  9   25 ms   primer nodo de Google
  10  26 ms   google.com (destino)
```

Cada `*` significa que el router no respondió (algunos bloquean ICMP por seguridad).

### 10. CURL manual

```bash
curl -v https://example.com
```

Output incluye:

```
* Connected to example.com (93.184.216.34) port 443
* SSL connection using TLSv1.3                        ← handshake TLS
> GET / HTTP/1.1                                       ← tu request
> Host: example.com
> User-Agent: curl/8.x
< HTTP/2 200                                           ← response status
< content-type: text/html; charset=UTF-8               ← response headers
< ...
<!doctype html>                                        ← response body
<html>...
```

Las líneas con `*` son de `curl` informándote. Las `>` son lo que enviaste. Las `<` son lo que te devolvieron.
