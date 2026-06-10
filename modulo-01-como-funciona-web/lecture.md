# Módulo 1 — Cómo funciona la Web

> *"The Web is more a social creation than a technical one."* — Tim Berners-Lee, inventor de la World Wide Web (1989)

---

## 🎥 Multimedia de este módulo

**Visualización interactiva** — los 13 pasos de URL a píxel, animados:

<iframe
  src="../multimedia/http-request-journey.html"
  width="100%" height="820"
  style="border: 1px solid #334155; border-radius: 10px;"
  loading="lazy"
  title="HTTP Request Journey — visualización interactiva"></iframe>

> Si el iframe no renderiza en tu visor de Markdown, abrí directamente [`multimedia/http-request-journey.html`](../multimedia/http-request-journey.html).

**Videos recomendados** — 3 charlas curadas para este módulo:
[📺 Ver playlist del módulo 01 →](../multimedia/videos.html#m1)

---

## 1.1 Una breve historia

- **1969** — ARPANET conecta 4 universidades. Nace Internet.
- **1989** — Tim Berners-Lee, en el CERN, propone la **World Wide Web**: un sistema de documentos hipervinculados sobre Internet.
- **1991** — Primera página web. `info.cern.ch`.
- **1993** — Mosaic, el primer navegador gráfico popular.
- **1995** — Brendan Eich crea JavaScript en **10 días** en Netscape.
- **1998** — Nace Google.
- **2004** — Ajax populariza la idea de aplicaciones dinámicas sin recargar la página.
- **2008** — HTML5 + V8 + Chrome.
- **2013** — React.
- **Hoy** — La Web es la plataforma de software más grande del mundo.

Entender este contexto te ayuda a comprender por qué el ecosistema es como es: acumulación de décadas de decisiones, parches y compatibilidad hacia atrás.

## 1.2 Internet ≠ Web

- **Internet**: red física de computadoras conectadas por cables, fibra, Wi-Fi, satélites.
- **Web (WWW)**: **un servicio** que corre sobre Internet, basado en **HTTP** y **documentos HTML enlazados**.

Email, FTP, SSH también corren sobre Internet, pero no son "la Web".

## 1.3 El modelo cliente-servidor

```
 ┌──────────┐      HTTP Request       ┌──────────┐
 │          │ ──────────────────────> │          │
 │ CLIENTE  │                         │ SERVIDOR │
 │(navegador)│ <─────────────────────  │          │
 │          │      HTTP Response      │          │
 └──────────┘                         └──────────┘
```

- **Cliente**: el navegador (o una app). Pide recursos.
- **Servidor**: una computadora con un programa escuchando en un puerto. Entrega recursos.

Tu navegador es el cliente más sofisticado jamás construido: es un intérprete de HTML, un motor CSS, una VM de JavaScript, un cliente HTTP, un sandbox de seguridad y un compositor gráfico — **todo en uno**.

## 1.4 DNS: el listín telefónico de Internet

Cuando escribís `google.com` en la barra, pasa esto:

1. El navegador pregunta: "¿Cuál es la IP de `google.com`?"
2. Consulta al **DNS resolver** (usualmente tu ISP o 1.1.1.1 de Cloudflare).
3. Si no está cacheado, se hace un árbol de consultas: root → TLD (`.com`) → nameserver de Google.
4. Responde: `142.250.190.14`.
5. Ahora el navegador puede abrir una conexión a esa IP.

## 1.5 El ciclo completo: de URL a píxel

Cuando escribís `https://ejemplo.com/sobre` y presionás Enter:

```
1. Parse de URL       → protocolo=https, host=ejemplo.com, path=/sobre
2. DNS lookup         → 93.184.216.34
3. TCP handshake      → SYN, SYN-ACK, ACK (3 viajes)
4. TLS handshake      → intercambio de claves, verificación de certificado
5. HTTP Request       → GET /sobre HTTP/2
6. Server processing  → la app genera HTML
7. HTTP Response      → 200 OK + HTML
8. Parse de HTML      → construye el DOM
9. Parse de CSS       → construye el CSSOM
10. Ejecución de JS   → modifica DOM/CSSOM
11. Layout            → calcula posiciones y tamaños
12. Paint             → pinta píxeles
13. Composite         → combina capas y muestra en pantalla
```

Todo esto en ~500 ms para una página bien optimizada. Cada paso es optimizable — y entenderlos es lo que distingue a un frontend junior de un senior.

## 1.6 HTTP: el protocolo de la Web

**HTTP** (HyperText Transfer Protocol) es el lenguaje con el que clientes y servidores hablan. Es **texto plano** (salvo HTTP/2 y HTTP/3 que son binarios), basado en **request/response**, y **stateless** (el servidor no recuerda pedidos anteriores — por eso existen cookies y tokens).

### Anatomía de un request

```http
GET /sobre HTTP/1.1
Host: ejemplo.com
User-Agent: Mozilla/5.0
Accept: text/html
Cookie: session_id=abc123

```

### Anatomía de una response

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1547
Cache-Control: max-age=3600

<!DOCTYPE html>
<html>...</html>
```

### Métodos HTTP (verbos)

| Método | Semántica | Idempotente | Tiene body |
|--------|-----------|-------------|------------|
| `GET` | Leer un recurso | ✅ | No |
| `POST` | Crear un recurso | ❌ | Sí |
| `PUT` | Reemplazar un recurso | ✅ | Sí |
| `PATCH` | Modificar parcialmente | ❌ | Sí |
| `DELETE` | Borrar un recurso | ✅ | No |

**Idempotente** = ejecutarlo N veces produce el mismo efecto que ejecutarlo 1 vez. `GET` 100 veces no cambia nada; `POST` 100 veces crea 100 recursos.

### Códigos de estado

| Rango | Significado | Ejemplos |
|-------|-------------|----------|
| `1xx` | Informativo | `100 Continue` |
| `2xx` | Éxito | `200 OK`, `201 Created`, `204 No Content` |
| `3xx` | Redirección | `301 Moved Permanently`, `304 Not Modified` |
| `4xx` | Error del cliente | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `429 Too Many Requests` |
| `5xx` | Error del servidor | `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable` |

Memorizá **404, 500, 301 y 401**. Son los que más vas a ver.

## 1.7 HTTPS y seguridad

`HTTPS` = HTTP sobre TLS (antes SSL). **Cifra la comunicación** entre cliente y servidor.

Sin HTTPS, cualquier intermediario (tu ISP, un hotspot malicioso, un gobierno) puede **leer** y **modificar** tu tráfico. Con HTTPS, obtiene solo datos cifrados inútiles.

En 2026 no existe excusa para servir HTTP puro. Navegadores marcan HTTP como "No seguro".

## 1.8 El render pipeline del navegador

Este es **el** diagrama que debés memorizar:

```
   HTML  ──────► DOM  ─────┐
                           ├──► Render Tree ──► Layout ──► Paint ──► Composite
   CSS   ──────► CSSOM ────┘
   
   JS    ──────► puede modificar DOM y CSSOM en cualquier momento
```

- **DOM** (Document Object Model): árbol de objetos que representa el HTML.
- **CSSOM** (CSS Object Model): árbol de reglas CSS computadas.
- **Render Tree**: DOM + CSSOM, sin nodos invisibles (`display: none`, `<head>`, etc.).
- **Layout**: calcular posiciones y tamaños (aka *reflow*).
- **Paint**: llenar píxeles.
- **Composite**: combinar capas (GPU).

**Por qué importa:** modificar el DOM o ciertos estilos CSS dispara re-layout y re-paint. Un frontend performante **minimiza** esos ciclos.

## 1.9 Las tres capas de la separación de responsabilidades

```
┌─────────────────────────────────────┐
│  JavaScript  →  comportamiento      │
├─────────────────────────────────────┤
│  CSS         →  presentación        │
├─────────────────────────────────────┤
│  HTML        →  estructura          │
└─────────────────────────────────────┘
```

**Regla de oro:** cada capa debe funcionar (al menos parcialmente) sin las otras.
- HTML sin CSS y sin JS debe ser legible. ← **Progressive enhancement**
- CSS debe ser un plus, no un requisito para acceder al contenido.
- JS debe mejorar la experiencia, no ser indispensable para leer.

## 1.10 DevTools: tu microscopio

Abrí cualquier página, click derecho → "Inspeccionar". Pestañas clave:

- **Elements**: el DOM en vivo. Podés editarlo.
- **Console**: ejecutar JavaScript, leer logs/errores.
- **Network**: ver cada request HTTP, timing, headers, payload.
- **Application**: cookies, localStorage, service workers.
- **Performance**: grabar y analizar el render pipeline.
- **Lighthouse**: auditoría automática de performance, a11y, SEO.

En este curso vas a vivir en DevTools.

---

## 🧑‍🎓 Worked Example — pensando como profesional

> **Ejercicio**: explicá qué pasa cuando abrís `https://tienda.com/producto/42` y por qué tarda "un tiempito".

**Mi pensamiento en voz alta:**

1. *Antes de explicar, ¿qué sé?* El navegador tiene que resolver `tienda.com` a IP, establecer conexión, pedir `/producto/42`, recibir HTML, parsear, descargar recursos, pintar. Ese es el esqueleto.

2. *¿Qué parte es realmente lenta?* Depende:
   - Si es la **primera** visita → DNS (~50ms) + TCP handshake (~100ms) + TLS (~200ms) + HTTP response (~variable). Suma base ~400ms antes de ver HTML.
   - Si ya visitaste el sitio → DNS y TLS pueden estar cacheados → mucho más rápido.

3. *Después del HTML, ¿qué más bloquea?*
   - CSS bloquea el render (sin CSS, el navegador no pinta).
   - `<script>` sin `defer`/`async` bloquea el parser.
   - Fuentes en `woff2` pueden flashear (FOUT/FOIT).

4. *Conclusión práctica*: la página se siente lenta si el **LCP** (Largest Contentful Paint) pasa de 2.5s. Las optimizaciones que más mueven la aguja son:
   - Servir desde CDN (bajar RTT).
   - Precargar fuentes y hero image.
   - `defer` en los scripts.
   - Usar HTTP/2 o HTTP/3 (multiplexa requests).

Este tipo de análisis "de la capa física a la experiencia" es lo que un frontend senior hace intuitivamente. Leer teoría + medir con DevTools + deployar + observar métricas reales → eso construye la intuición.

## 🧠 Checkpoint Quiz

Poné a prueba tu comprensión antes de seguir. Respondé mentalmente, luego expandí.

<details>
<summary><strong>1. ¿Qué pasa si mi DNS está caído pero la IP del servidor funciona?</strong></summary>

El navegador no puede resolver el nombre del dominio → falla antes de intentar conectarse. Workaround manual: `curl --resolve tienda.com:443:1.2.3.4 https://tienda.com`, o editar `/etc/hosts` (Linux/Mac) / `C:\Windows\System32\drivers\etc\hosts` (Windows).
</details>

<details>
<summary><strong>2. ¿Cuál es la diferencia entre 301 y 302?</strong></summary>

`301 Moved Permanently` → el cliente **debe** actualizar su caché/bookmarks a la nueva URL.
`302 Found` (Temporary Redirect) → redirección temporal, no guardar.

Google trata 301 como "transferir el SEO a la nueva URL"; 302 como "el viejo sigue siendo el canónico".
</details>

<details>
<summary><strong>3. ¿Por qué HTTPS es "más lento" que HTTP la primera vez?</strong></summary>

Porque HTTPS = HTTP + TLS handshake. El handshake TLS 1.3 requiere 1 round-trip extra (o 0-RTT si hay session resumption). En TLS 1.2 eran 2 round-trips.

Después del handshake, la transferencia es casi idéntica (el overhead de cifrado es mínimo en CPUs modernas con AES-NI).
</details>

<details>
<summary><strong>4. ¿Qué dispara un re-layout vs solo un paint?</strong></summary>

Re-layout (costoso): cambiar `width`, `height`, `top`, `left`, `padding`, `margin`, insertar/quitar elementos, cambiar texto.

Solo paint (medio): `background`, `color`, `box-shadow`, `outline`.

Solo composite (barato, GPU): `transform`, `opacity`.

**Regla de oro**: animá solo `transform` y `opacity`.
</details>

<details>
<summary><strong>5. ¿Qué significa que HTTP es "stateless"?</strong></summary>

Cada request es independiente; el servidor no "recuerda" nada entre requests por sí solo. Para simular estado usamos cookies, tokens (JWT), sesiones server-side, o localStorage en el cliente.

Es una feature, no un bug: permite que cualquier servidor del cluster atienda cualquier request (escalabilidad horizontal).
</details>

---

## Resumen ejecutivo

- La Web es un servicio sobre Internet, basado en HTTP + HTML.
- Cliente (navegador) y servidor se comunican con requests/responses.
- El navegador convierte HTML + CSS + JS en píxeles a través del **render pipeline**.
- DevTools es la herramienta de diagnóstico más importante que tenés.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-inspeccionar-request.html` — tu primer HTML; abrilo en el navegador y observalo en Network.
- `02-demo-render-pipeline.html` — visualizá cuándo ocurre layout vs paint.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

## Further reading

- MDN — *An overview of HTTP*: https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
- High Performance Browser Networking (gratis online): https://hpbn.co/
- *How Browsers Work* (Tali Garsiel): https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/

---

**Siguiente módulo:** [`02 — HTML`](../modulo-02-html/)
