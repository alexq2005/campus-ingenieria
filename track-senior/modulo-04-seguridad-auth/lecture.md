# Módulo S-04 — Seguridad & Auth

> *"Security is not a feature you add at the end. It's a property of how you build."*

---

## S4.0 Por qué este módulo

El frontend es **territorio enemigo**: el código corre en máquinas que no controlás. Cualquier validación, secret, o lógica que pongas en el cliente, el atacante la ve y la modifica.

Senior piensa en seguridad **desde el diseño**, no como capa final. Este módulo te da el modelo mental + los patrones para no caer en los errores clásicos.

---

## S4.1 Modelo mental: el cliente NO es trusted

Repetí esto hasta que sea instinto:

> Toda lógica de seguridad que importa, vive en el servidor.
> El cliente solo provee UX (validar para feedback, no para autorizar).

Implicaciones:
- Validás email en el form (UX) → el server re-valida (autorizar).
- Ocultás un botón "Borrar" si no es admin (UX) → el endpoint verifica permisos (autorizar).
- Hashás contraseña en el cliente (no — perdés tiempo) → el server las hashea con bcrypt/argon2.
- Guardás token en localStorage → cualquier XSS lo roba. Mejor en httpOnly cookie.

Cada vez que pongas una verificación en el cliente, preguntate: **¿qué pasa si el atacante la salta?**

---

## S4.2 OWASP Top 10 — versión frontend

OWASP publica los top riesgos de web apps. Acá los más relevantes para frontend:

### 1. Broken Access Control
Mostrar un botón solo si `user.role === 'admin'` no protege nada. El endpoint del backend **debe** verificar.

```tsx
// ✅ UX correcto (oculta botón)
{user.isAdmin && <button onClick={deleteUser}>Borrar</button>}

// ❌ Si tu endpoint /api/users/:id (DELETE) no chequea permisos,
//   el atacante hace el fetch directo y borra usuarios.
```

### 2. Injection (XSS)
**El big one en frontend**. Ya lo vimos en módulo 6 base. Re-revisión senior:

#### XSS Reflejado
```js
// URL: /search?q=<script>alert('xss')</script>
function SearchPage() {
  const q = new URLSearchParams(location.search).get('q');
  return <div dangerouslySetInnerHTML={{ __html: q }} />;  // ❌ XSS
}
```

#### XSS Stored
Comentario en una app que guarda `<script>` en DB y lo renderiza con innerHTML.

#### XSS DOM-based
Solo en cliente: manipular DOM con input no sanitizado.

**Defensas**:
- Default seguro: `textContent` / React JSX (auto-escapa)
- Si DEBÉS renderizar HTML: sanitizá con [DOMPurify](https://github.com/cure53/DOMPurify)
- **Content Security Policy** (próxima sección)

```ts
import DOMPurify from 'dompurify';
const safe = DOMPurify.sanitize(userHtml);
```

### 3. Cross-Site Request Forgery (CSRF)
Atacante hace que el browser del usuario haga un request a tu API usando sus cookies de auth.

**Defensa moderna**: cookies con `SameSite=Lax` (default en Chrome desde 2020) o `Strict`. Y CSRF tokens en formularios sensibles.

### 4. Insecure Direct Object References (IDOR)
URL: `/api/orders/123` — si cambio a `/api/orders/124` y veo la orden de otro usuario, hay IDOR. **Bug del backend**, pero el frontend puede ayudar a no exponer IDs predecibles (usar UUIDs en vez de incrementales).

### 5. Sensitive Data Exposure
- Logs con tokens (cuidado con `console.log(headers)`).
- Storage local con datos sensibles.
- Errores 500 que muestran stack traces en producción.

### 6. Security Misconfiguration
Headers HTTP faltantes, CORS demasiado permisivo, debug mode en prod.

---

## S4.3 Content Security Policy (CSP)

CSP es la **defensa más subutilizada** contra XSS. Le decís al browser: "solo cargá scripts de estos orígenes".

### CSP básico (header del servidor)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.miapp.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-ancestors 'none';
```

Con esto:
- `<script src="evil.com/x.js">` → bloqueado.
- Inline scripts bloqueados (a menos que uses `'unsafe-inline'` — evitalo).
- `<iframe>` no puede embebernos.

### CSP estricto (lo que un senior implementa)

Sin `'unsafe-inline'`, sin `'unsafe-eval'`, con **nonces** o **hashes** para inline scripts necesarios:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-RANDOM_STRING';
  style-src 'self' 'sha256-HASH_OF_INLINE_STYLE';
```

```html
<script nonce="RANDOM_STRING">/* ok porque tiene el nonce */</script>
<script>/* bloqueado, sin nonce */</script>
```

El nonce se genera nuevo en cada request (server-side).

### Reportar violaciones

```
Content-Security-Policy-Report-Only: ...; report-uri /csp-report
```

Modo "report-only": no bloquea, solo te avisa qué se hubiera bloqueado. Ideal para deploy gradual.

### Generar CSP para tu app

Herramienta: [https://csp-evaluator.withgoogle.com/](https://csp-evaluator.withgoogle.com/)

---

## S4.4 Subresource Integrity (SRI)

Cuando cargás un script desde CDN, ¿qué pasa si el CDN se hackea y sirve código malicioso?

**SRI**: incluís un hash del script esperado. El browser verifica antes de ejecutar.

```html
<script
  src="https://cdn.jsdelivr.net/npm/marked@13.0.0/marked.min.js"
  integrity="sha384-FoHa2wzqhZbS6ZW6QhGKf9AXlJ/+EQVQ+Y6PqRzfFhq2N7ApD2+OxA9Vy7TC1V6n"
  crossorigin="anonymous"></script>
```

Si `marked.min.js` cambia (aunque sea 1 byte), el browser lo bloquea.

Generá el hash:
```bash
curl -s https://cdn.jsdelivr.net/npm/marked@13.0.0/marked.min.js | openssl dgst -sha384 -binary | openssl base64 -A
```

---

## S4.5 Otros headers de seguridad

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  → Forza HTTPS en futuras visitas (HSTS)

X-Content-Type-Options: nosniff
  → No adivines el content-type. Confiá en el header.

X-Frame-Options: DENY
  → No te embebas en iframes (anti-clickjacking)
  (frame-ancestors en CSP es la versión moderna)

Referrer-Policy: strict-origin-when-cross-origin
  → No mandes el referrer completo a sitios externos

Permissions-Policy: camera=(), microphone=(), geolocation=(self)
  → Restringí qué APIs puede usar la página
```

Audit con: [https://securityheaders.com](https://securityheaders.com)

---

## S4.6 Autenticación: el zoo de opciones

### 1. Sesiones server-side (clásico)
- Login → server crea session ID, lo manda en cookie httpOnly.
- Cliente no maneja nada.
- Cookie SameSite=Lax + HTTPS = seguro.
- **Estado en el server** (DB, Redis).

**Cuándo**: apps tradicionales con UI server-rendered.

### 2. JWT (JSON Web Tokens)
- Login → server firma un token con sus claims (`userId`, `role`, `exp`).
- Cliente lo guarda y lo manda en `Authorization: Bearer <token>`.
- Server **verifica la firma** sin necesidad de DB.
- Stateless.

```ts
// JWT payload típico
{
  "sub": "user-123",
  "name": "Ada",
  "role": "admin",
  "iat": 1714000000,  // issued at
  "exp": 1714003600   // expira en 1h
}
```

**Cuándo**: APIs (mobile + web), microservicios.

**Trampas**:
- ⚠️ Si guardás JWT en localStorage, cualquier XSS lo roba.
- ⚠️ Si el JWT no expira pronto, no podés revocarlo (no hay sesión server-side).
- ⚠️ Si pesa mucho (claims grandes), consume bandwidth en cada request.

### 3. JWT + Refresh Token (la solución moderna)
- Access token corto (5-15 min), guardado en memoria.
- Refresh token largo (días/semanas), guardado en cookie httpOnly.
- Cuando access expira, cliente pide nuevo con refresh.
- Si detectás reuso del refresh → invalidás todo (rotation).

```
Login → { accessToken (15 min), refreshToken (cookie httpOnly, 30 días) }
Request → Authorization: Bearer <accessToken>
401 (token expiró) → POST /refresh con cookie → nuevo accessToken
```

### 4. OAuth 2.0 / OIDC ("Login con Google")
- Usuario te da permiso de actuar a su nombre.
- 4 actores: User, Client (tu app), Auth Server (Google), Resource Server (API).
- Flow recomendado en 2026: **Authorization Code + PKCE**.

```
1. User → click "Login con Google" en tu app
2. Tu app → redirect a Google con: client_id, redirect_uri, code_challenge, scope
3. User → autoriza en Google
4. Google → redirect a tu app con: code
5. Tu app → POST a Google con: code + code_verifier (proof)
6. Google → access token + id token (JWT con info del user)
```

**PKCE**: previene que un atacante intercepte el code y lo use. SIEMPRE PKCE en SPAs.

Librerías: [oidc-client-ts](https://github.com/authts/oidc-client-ts), [Auth.js](https://authjs.dev) (Next.js).

### 5. Auth-as-a-Service
- [Clerk](https://clerk.com), [Auth0](https://auth0.com), [Supabase Auth](https://supabase.com), [Firebase Auth](https://firebase.google.com).
- Te dan login UI, social providers, MFA, password reset, todo. Pagás por usuarios activos.

**Recomendación senior**: si la auth no es tu diferencial, usá un servicio. Construir auth bien es **mucho** más trabajo del que parece.

---

## S4.7 Dónde guardar el access token (la decisión clave)

| Lugar | XSS roba? | CSRF? | Veredicto |
|-------|:---:|:---:|-----------|
| **localStorage** | ✅ sí | No | ❌ inseguro contra XSS |
| **sessionStorage** | ✅ sí | No | ❌ idem |
| **Cookie httpOnly** | ❌ no | ⚠️ si SameSite=None | ✅ + SameSite=Lax + CSRF token |
| **Memoria (variable JS)** | ❌ no | No | ✅ pero se pierde al recargar |
| **Service Worker scope** | ❌ no | No | ✅ avanzado, complejo |

**Patrón senior recomendado**:
- **Refresh token** → cookie httpOnly + SameSite=Strict.
- **Access token** → solo en memoria (variable JS o React state).
- Al recargar página → /refresh para conseguir nuevo access desde el refresh.

Esto es lo que hacen apps como Notion, Linear, Vercel.

---

## S4.8 RBAC vs ABAC — modelos de autorización

### RBAC (Role-Based Access Control)
Usuarios → Roles → Permisos.

```ts
const ROLES = {
  admin:  ['*'],
  editor: ['articles:read', 'articles:write'],
  reader: ['articles:read'],
};

function can(user, action) {
  const perms = ROLES[user.role];
  return perms.includes('*') || perms.includes(action);
}
```

**Cuándo**: roles claros y estables. Mayoría de SaaS.

### ABAC (Attribute-Based Access Control)
Permisos basados en atributos del user, recurso, acción y contexto.

```ts
function can(user, action, resource) {
  if (action === 'edit' && resource.ownerId === user.id) return true;
  if (action === 'edit' && user.role === 'admin') return true;
  if (action === 'edit' && resource.team === user.team && user.role === 'editor') return true;
  return false;
}
```

**Cuándo**: lógica compleja con contexto (multi-tenant, ownership).

Librerías: [CASL](https://casl.js.org/), [Oso](https://www.osohq.com/).

---

## S4.9 Patrones para el frontend específicamente

### Protected routes en React Router

```tsx
function ProtectedRoute({ children, requireRole }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireRole && user.role !== requireRole) return <Navigate to="/403" />;
  return children;
}

<Route path="/admin" element={
  <ProtectedRoute requireRole="admin">
    <AdminPage />
  </ProtectedRoute>
} />
```

### Conditional rendering por permiso

```tsx
function Can({ I: action, this: resource, children }) {
  const { can } = useAuth();
  return can(action, resource) ? <>{children}</> : null;
}

<Can I="edit" this={article}>
  <EditButton />
</Can>
```

### Interceptor para refrescar token

```ts
// Con axios o fetch wrapper
let isRefreshing = false;
let waiters = [];

async function fetchWithAuth(url, options = {}) {
  const r = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${getAccessToken()}` }
  });

  if (r.status !== 401) return r;

  if (isRefreshing) {
    await new Promise(resolve => waiters.push(resolve));
  } else {
    isRefreshing = true;
    await refreshAccessToken();
    waiters.forEach(w => w());
    waiters = [];
    isRefreshing = false;
  }

  // Retry con el nuevo token
  return fetchWithAuth(url, options);
}
```

Patrón crítico: **lock + queue** para que múltiples requests no disparen N refreshes simultáneos.

---

## S4.10 Threats específicos a SPAs

### Token theft via XSS
Mitigación: cookies httpOnly + CSP estricto.

### Open redirect
```
URL: /login?redirect=https://evil.com
Tu código: window.location = redirect
```
Defensa: validar que el redirect sea una URL relativa o un dominio de tu allowlist.

### Reverse tabnabbing
`<a target="_blank">` sin `rel="noopener"` → la página abierta puede manipular `window.opener.location`.
Defensa: SIEMPRE `rel="noopener noreferrer"` (o usar `<a target="_blank">` que en HTML5 reciente lo aplica por default).

### Clickjacking
Tu app embebida en iframe de evil.com con UI invisible que captura clicks.
Defensa: `Content-Security-Policy: frame-ancestors 'none'` o `X-Frame-Options: DENY`.

### Prototype pollution
`Object.assign({}, JSON.parse(userInput))` con `{ "__proto__": { "isAdmin": true } }` puede pollute el prototype global.
Defensa: usar `Object.create(null)`, librerías validadas, JSON schemas.

---

## 🧑‍🎓 Worked Example — auth flow para una app SaaS nueva

> Te piden diseñar la auth para una app multi-tenant (cada org tiene sus users + datos aislados). Web + mobile.

**Mi proceso (decisiones de senior):**

### 1. Backend
- JWT con refresh tokens.
- Access token: 15 min, contiene `userId`, `orgId`, `role`.
- Refresh token: 30 días, rotation en cada uso.
- Login con email/password + opcional MFA TOTP.
- "Login con Google" via OAuth (después).

### 2. Storage en frontend
- Access token → memoria (Zustand store sin persist).
- Refresh token → cookie httpOnly + SameSite=Lax + Secure (HTTPS).
- En carga de la app: hacer `/refresh` para tener access fresco.

### 3. Headers
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-XXX'; ...
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 4. Authz (RBAC)
```ts
type Role = 'owner' | 'admin' | 'member' | 'viewer';
const PERMS: Record<Role, string[]> = {
  owner:  ['*'],
  admin:  ['users:*', 'projects:*', 'billing:read'],
  member: ['projects:read', 'projects:write', 'tasks:*'],
  viewer: ['projects:read', 'tasks:read'],
};
```

Backend: middleware que valida en cada endpoint. Frontend: `<Can />` component para esconder UI.

### 5. Defensas adicionales
- Rate limiting: 5 intentos de login por IP / 15 min.
- Email verification antes de loguear.
- Audit log: quién hizo qué, cuándo.
- Password reset con tokens single-use que expiran en 1h.
- Logout invalida refresh token (lo blacklist en Redis).

### 6. Mobile
- Misma API + JWT.
- Refresh token en SecureStore (Keychain iOS / Keystore Android).
- Biometrics para reauth rápida.

### 7. Plan de despliegue
- Día 1: implementar email/password + sessions.
- Día 2: cambiar a JWT + refresh.
- Día 3: agregar MFA.
- Mes 1: agregar OAuth providers.
- Mes 2: SSO (SAML) si clientes enterprise lo piden.

Esa decisión documentada en un ADR es lo que un senior arma en su primer mes en el trabajo.

---

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Por qué guardar JWT en localStorage es inseguro?</strong></summary>

Cualquier XSS (script malicioso ejecutado en tu página) puede leer localStorage y robar el token. Una vez robado, el atacante hace requests autenticados como tu usuario.

Defensa: cookies httpOnly (no leíbles desde JS) + access token en memoria.
</details>

<details>
<summary><strong>2. ¿Qué hace <code>Content-Security-Policy</code>?</strong></summary>

Le dice al browser de qué orígenes puede cargar scripts, estilos, imágenes, fonts, conexiones, frames, etc. Si algo no matchea la policy, se bloquea.

Es la defensa **más efectiva** contra XSS — incluso si un atacante inyecta script, el browser no lo ejecuta porque viene de un origen no permitido.
</details>

<details>
<summary><strong>3. ¿Qué problema resuelve PKCE en OAuth?</strong></summary>

En SPAs no hay "client secret" (cualquier código JS está expuesto). PKCE reemplaza el secret con un challenge dinámico:

1. Cliente genera `code_verifier` (random) y manda su hash (`code_challenge`).
2. En el token exchange, manda el `code_verifier` original.
3. El server verifica que el hash coincide.

Previene que un atacante intercepte el authorization code y lo intercambie por un token.
</details>

<details>
<summary><strong>4. ¿Cuál es la diferencia entre RBAC y ABAC?</strong></summary>

- **RBAC**: User → Role → Permissions. Estático, simple.
- **ABAC**: Permisos basados en atributos del user, recurso, contexto. Dinámico, expresivo.

RBAC: "los admins pueden borrar usuarios".
ABAC: "los admins pueden borrar usuarios DE SU MISMO TEAM excepto otros admins".

ABAC para multi-tenancy + ownership. RBAC para casos simples.
</details>

<details>
<summary><strong>5. Tu API devuelve 401 en mitad de un flujo. ¿Qué hace una buena UX/seguridad?</strong></summary>

1. Interceptor detecta el 401.
2. Si NO está refreshing: dispara `/refresh` con el refresh token.
3. Si está refreshing: encolar el request.
4. Cuando el refresh termina: reintenta los requests encolados con el nuevo access.
5. Si el refresh falla: redirect a /login con el redirect_to actual.

Patrón crítico: lock + queue para no hacer 50 refreshes paralelos.
</details>

<details>
<summary><strong>6. ¿Por qué validar input en el cliente NO es seguridad?</strong></summary>

El atacante controla el cliente. Puede modificar tu JS, abrir DevTools, o usar curl directamente para hacer requests sin pasar por tu form.

Validación cliente = UX (feedback rápido al usuario).
Validación servidor = seguridad (autorización real).

Toda regla que importe debe duplicarse en el backend. Sin excepciones.
</details>

---

## Resumen ejecutivo

- **El cliente NO es trusted**. Toda lógica de seguridad real, en el server.
- **CSP estricto** + **SRI** son tus mejores defensas contra XSS / supply chain.
- **JWT + refresh rotation** es el patrón moderno. Access en memoria, refresh en cookie httpOnly.
- **OAuth 2.0 + PKCE** para SPAs.
- **RBAC** simple por default, **ABAC** si necesitás expresividad.
- **Headers de seguridad** son one-liners gratis.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-csp-builder.html` — armá un CSP interactivamente y ve qué bloquea.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`S-05 — Observability & DevOps`](../modulo-05-observability-devops/)
