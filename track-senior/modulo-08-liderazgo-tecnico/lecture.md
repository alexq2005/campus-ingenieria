# Módulo S-08 — Liderazgo Técnico

> *"Senior engineers don't just write code. They multiply the team's output."*

---

## S8.0 Por qué este módulo cierra el track

Los 7 módulos anteriores te dieron **vocabulario y modelos mentales** de senior. Este te da el **comportamiento** de senior — el cómo te movés en un equipo.

La diferencia más grande entre senior y mid no es técnica. Es:
- **Comunicación**: explicar trade-offs, escribir RFCs claros, dar feedback constructivo.
- **Decisiones documentadas**: ADRs, postmortems, design docs.
- **Multiplicación**: code reviews que enseñan, mentoring estructurado.
- **Influencia sin autoridad**: convencés con argumentos, no con jerarquía.

Si no desarrollás esto, tu seniority queda capada. Es el techo invisible de muchos buenos developers.

---

## S8.1 Architecture Decision Records (ADRs)

ADRs documentan **decisiones técnicas importantes** y por qué se tomaron. Se versionan en el repo junto al código.

### ¿Por qué importan?

Sin ADRs:
- En 6 meses nadie recuerda por qué eligieron Zustand sobre Redux.
- Devs nuevos preguntan "¿por qué no usamos X?" cada semana.
- Decisiones se deshacen sin saber el contexto original.

Con ADRs:
- "Eso lo decidimos en ADR-014. Si querés cambiarlo, primero refutá esos argumentos."

### Formato (Michael Nygard, el clásico)

```markdown
# ADR-014: Adoptar Zustand para client state

## Status
Aceptado · 2026-03-15

## Contexto
Tenemos useState esparcido en 30+ componentes con prop drilling profundo.
Necesitamos client state global para: theme, user, cart, modals.

## Opciones consideradas

### Opción 1: Context API (status quo)
+ Built-in, sin deps
- Re-renders excesivos cuando el value cambia
- API verbosa para múltiples slices

### Opción 2: Redux Toolkit
+ Tooling maduro, time-travel debugging
+ Convención clara para equipo grande
- Boilerplate alto (~30 líneas vs 5)
- Curva de aprendizaje
- Overkill para nuestro tamaño (8 devs)

### Opción 3: Zustand
+ API mínima
+ Sin provider
+ Selectores granulares automático
- Menos features que Redux (pero no las necesitamos)
- DevTools menos powerful

## Decisión
Opción 3: Zustand.

## Consecuencias
+ Reducción de boilerplate ~80% vs Redux
+ Onboarding más rápido (API simple)
+ Performance mejor que Context monolítico

- Equipo debe aprender Zustand (1-2 días)
- Si crecemos a 30+ devs, podríamos necesitar migrar (riesgo aceptable)

## Plan
- Sprint 1: migrar theme + user state.
- Sprint 2: migrar cart.
- Sprint 3: deprecar contexts viejos.

## Referencias
- Issue #234
- Spike branch: `spike/state-mgmt-comparison`
```

### Reglas para buenos ADRs

1. **Cortos** (1-2 páginas máx). Si necesita más, dividir en varios ADRs.
2. **Inmutables**. Si cambia la decisión, escribís un ADR nuevo que lo "supersede".
3. **En el repo** (`docs/adr/`), versionados con git.
4. **Numerados** secuencialmente (ADR-001, ADR-002).
5. **Status claro**: Proposed → Accepted → Deprecated → Superseded.

### Cuándo escribir un ADR

- Elección de framework, librería principal.
- Patrón arquitectónico (FSD, Hexagonal, MF).
- Decisión irreversible o cara de revertir.
- Trade-off no obvio que generó debate en el equipo.

NO para:
- "Decidimos llamar a esta variable `cart` en vez de `basket`".
- Decisiones que cualquier dev puede cambiar trivialmente.

### Templates útiles

- [Michael Nygard's ADR template](https://github.com/joelparkerhenderson/architecture-decision-record/blob/main/locales/en/templates/decision-record-template-by-michael-nygard/index.md)
- [Y-statements](https://medium.com/olzzio/y-statements-10eb07b5a177): formato de 1 línea para decisiones simples.

---

## S8.2 RFCs (Request for Comments)

Mientras un ADR documenta una decisión TOMADA, un RFC propone una decisión por TOMAR. Es un mecanismo de discusión estructurada.

### Formato típico

```markdown
# RFC-007: Migrar de REST a GraphQL para apps internas

## Author: @ada · Status: Draft · Date: 2026-04-20

## Resumen
1-2 párrafos. ¿Qué proponés? ¿Por qué importa?

## Motivación
Detalle del problema actual. Datos, métricas, ejemplos.

## Diseño propuesto
Cómo se vería la solución. Diagramas, código de ejemplo.

## Alternativas consideradas
- Opción A: ...
- Opción B: ...
- Hacer nada: ...

## Drawbacks
Honesto: qué perdés con esta propuesta.

## Migración
Plan paso a paso. Backwards compatibility. Timeline.

## Open questions
- ¿Cómo manejamos clientes mobile que no soportan GraphQL?
- ¿Quién mantiene el schema?

## Discussion
(comments del equipo, decisiones tentativas)
```

### Proceso típico

1. Author escribe RFC en draft.
2. Pull request al repo de RFCs.
3. Equipo comenta inline durante 1-2 semanas.
4. Author itera basado en feedback.
5. Reviewers (tech leads, architect) marcan "approved" o "rejected".
6. Si approved → ADR + plan de implementación.

### RFC vs ADR

- RFC = "Propongo X. ¿Qué opinan?"
- ADR = "Decidimos X. Esto es por qué."

Algunos equipos solo usan ADRs (decisión + razón en uno). Otros separan ambos. Para empresas grandes, separar funciona mejor.

---

## S8.3 Code review como herramienta de mentoring

Code review NO es solo "encontrar bugs". Es:
- Compartir conocimiento.
- Enseñar mejores prácticas.
- Mantener consistencia del codebase.
- Distribuir ownership.

### Anti-patrones de mid-level reviewers

❌ **"LGTM 👍"** sin leer.
❌ **Nitpicks pedantes**: "agregá un punto al final del comentario" en comentarios sin valor.
❌ **Tono agresivo**: "esto está mal" en vez de "¿consideraste X?"
❌ **Bikeshedding**: discusiones largas sobre trivialidades, ignorando lo importante.
❌ **Re-escribir el PR del otro** en vez de explicar.

### Patrones de senior reviewers

✅ **Clasificá tu comentario**: 
- `[blocker]` — esto debe arreglarse antes de mergear.
- `[suggestion]` — esto sería mejor pero no bloquea.
- `[nit]` — opinión cosmética, ignorala si querés.
- `[question]` — solo entender.
- `[praise]` — algo que está muy bien hecho.

```
[suggestion] ¿Probaste con `useMemo` acá? El cálculo se ejecuta en cada render.
Si la lista crece, podría ser cuello de botella. Ejemplo:
const total = useMemo(() => items.reduce(...), [items]);
```

✅ **Explicá el por qué**, no solo el qué.

```
❌ "Cambiá esto a useState".
✅ "Sugiero useState acá: useReducer agrega complejidad para 1 boolean.
   Regla mental: useReducer cuando hay 3+ estados relacionados."
```

✅ **Pedí cambios pequeños**. Si el PR es 1000 líneas, está mal antes de empezar.

✅ **Apreciá lo bueno**. "Me gusta cómo extrajiste el hook acá, mucho más leíble que antes."

✅ **Asincronía respetuosa**. Code review no es chat — el author puede tardar en responder. Sin presión.

### El primer review de un PR

1. Lee la **descripción**: ¿qué problema resuelve? ¿hay screenshot/video?
2. Lee los **tests**: te dicen el comportamiento esperado.
3. Lee el **código** en orden top-down (entry points primero).
4. Tu primer comentario: **una pregunta o algo positivo**, no una crítica.

### Cuándo NO comentar

- Pregunta de estilo cubierta por linter/Prettier.
- Algo que vos haces distinto pero no es objetivamente mejor.
- "Yo lo haría así" sin razón técnica.

---

## S8.4 Mentoring — multiplicar tu impacto

Mentor 1 junior → tu impacto se duplica. Mentor 5 → quintuplicas.

### Modos de mentoring

#### 1. Pair programming
Dirigís sin agarrar el teclado. Vos preguntás, el junior teclea.

Reglas:
- "¿Qué hace este código?" → fuerza explicar mentalmente.
- "¿Qué probarías primero?" → debugging paso a paso.
- "¿Qué pasa si X?" → edge cases.
- Si se traba 5+ min, das el next step.

#### 2. Code review pedagógico
Comentarios que enseñan, no solo corrigen.

```
[suggestion + learning] Acá usaste `forEach` para construir un array.
La forma idiomática moderna es `.map()`:

  arr.map(item => item.id)

Por qué importa: declarás intent (transformar), no instrucción (loop). 
Más fácil de leer. También es lo que TanStack Query, Redux Toolkit, etc esperan.

Lectura: https://eloquentjavascript.net/05_higher_order.html
```

#### 3. Office hours
1 hora semanal donde juniors traen sus dudas. Sin agenda fija.

#### 4. Learning path documentation
"Acá está el roadmap para entender nuestro stack. Tarda ~2 semanas":
- Semana 1: leé los ADRs 1-15.
- Semana 2: hacé X tutorial.
- Después: pickear issue con label `good-first-issue`.

### Anti-patrones de mentoring

❌ **Resolver por ellos**. "Dame el teclado, lo arreglo en 2 min". El junior aprende cero.
❌ **Sermonear**. 30 min de monólogo en vez de preguntas.
❌ **Esperar gratitud**. El feedback positivo del junior es nice, pero el reward real es ver al equipo crecer.
❌ **Solo mentorear el 1:1**. El review público también es mentoring (todo el equipo aprende).

### Métrica de éxito

¿Tu mentee resuelve problemas similares **sin vos** después de 3 meses? Sí = funcionó. No = ajustá tu approach.

---

## S8.5 Postmortems blameless

Cuando algo se rompe en producción, la oportunidad es aprender — no buscar culpables.

### Estructura

```markdown
# Postmortem: Outage del checkout — 2026-04-15

## Resumen
30 min de downtime del checkout entre 14:00 y 14:30 UTC.
Impacto: ~340 usuarios sin poder pagar, ~$15k en revenue perdido.

## Timeline
- 13:55 — Deploy de cart-service v2.3.0
- 14:00 — Sentry empieza a recibir spike de errores
- 14:08 — Alert PagerDuty
- 14:10 — On-call (Maria) acknowledged
- 14:15 — Identificado: deploy reciente como sospechoso
- 14:20 — Rollback a v2.2.0 iniciado
- 14:25 — Errores bajan a 0
- 14:30 — Servicio totalmente recuperado

## Root cause
El deploy v2.3.0 cambió la signature de `getOrder()` 
de devolver `{order}` a devolver `order` directamente.
La app principal seguía esperando `{order}`, causando TypeError.

## ¿Por qué los tests no lo agarraron?
- Tests del cart-service mockeaban el response como `{order}`.
- Tests integration del checkout usaban data fixture, no llamaban al cart.
- No teníamos contract testing entre servicios.

## ¿Por qué tardamos 15 min en identificar?
- Sentry no tenía deploy markers, no se vio la correlación obvia.
- El log del deploy estaba en otro tool (CircleCI), no integrado.

## Acciones (con owner y deadline)
- [ ] Pact contract testing entre cart-service y main app — @ada — sprint 47
- [ ] Sentry deploy markers automáticos — @luis — esta semana
- [ ] Runbook: "errores en checkout" con primer paso "check recent deploys" — @maria — esta semana
- [ ] Schema versioning explícito en API responses — @ada — sprint 48

## ¿Qué hicimos bien?
- Alert llegó rápido (8 min).
- Rollback fue trivial gracias a que el deploy era atomic.
- Comunicación interna clara durante el incident.

## Notas
Maria estaba on-call por primera vez. Manejó el incident con calm.
```

### Reglas duras

1. **Blameless**. NO mencionás "X commiteó esto" como acusación.
2. **Foco en sistema**, no en personas. La pregunta no es "¿quién?" sino "¿qué fallback debería existir?"
3. **Acciones con owner y deadline**. Sin esto, son aspiraciones.
4. **Compartido públicamente** (al menos al equipo entero).
5. **Acciones se trackean** hasta completarse.

### El "5 whys"

Para llegar al root cause, preguntá "por qué?" 5 veces.

```
1. ¿Por qué se rompió checkout? Porque `getOrder()` devolvió shape inesperado.
2. ¿Por qué cambió el shape? Porque cart-service v2.3.0 lo cambió.
3. ¿Por qué no se detectó en CI? Porque no hay contract tests entre servicios.
4. ¿Por qué no hay contract tests? Porque no era prioridad cuando armamos CI.
5. ¿Por qué no era prioridad? Porque pensábamos que tests unit del cart bastaban.

Root cause real: gap en testing strategy de microservicios.
Acción: introducir contract testing.
```

---

## S8.6 Influencia sin autoridad

Senior no tiene poder formal sobre nadie. Tu influencia viene de:

### 1. Track record
Si en los últimos 6 meses tus decisiones funcionaron, te van a escuchar más. Si fallaron, menos.

### 2. Datos, no opiniones
"Creo que esto será más rápido" → débil.
"Hicimos un benchmark, X es 3x más rápido que Y. Acá el repo." → fuerte.

### 3. Empatía con el contexto
Antes de proponer cambio, entendé por qué está como está. Quizás hay razón que no ves.

### 4. Pequeñas victorias
No proponés rewrite completo en mes 1. Proponés mejora pequeña, la implementás bien, ganás credibilidad. Después podés proponer más grande.

### 5. Saber cuándo NO insistir
A veces tenés razón pero el equipo no está listo. Documentás tu posición (ADR) y dejás pasar. Cuando vuelva el problema, decís "ya lo había advertido en ADR-X" — sin tono "te lo dije".

### Cómo proponer cambio en code review

❌ "Esto está mal, hay que cambiarlo a X."
✅ "¿Consideraste X? En mi experiencia tiene Y ventajas en este caso. Pasos a probar: [lista]."

❌ Insistir 5 veces en el mismo PR.
✅ Proponer 1 vez con argumento claro. Si rechazan, escalá a discusión async (issue/RFC) en vez de bloquear el PR.

---

## S8.7 Comunicación: técnica vs ejecutiva

Hablás distinto a:

### Tu equipo técnico (técnica)
- Detalles, code, trade-offs implementación.
- "Migrar a tRPC reduce boilerplate del API client en 60%, pero acopla deploys."

### Product / Diseño (semi-técnica)
- Beneficios + costos en términos de timeline + UX.
- "La feature X tarda 3 sprints más si la hacemos accesible. Sin a11y, 2 sprints. ¿Qué priorizamos?"

### Ejecutivos (ejecutiva)
- Riesgo, costo, impacto. Sin jerga.
- "Si no migramos en Q3, en Q4 perdemos competitividad porque los nuevos features no escalan."

### Anti-patrón senior tarde-de-carrera

Hablar siempre técnico. El equipo de product no entiende, no logras buy-in. Los proyectos importantes no se aprueban.

Aprender a "traducir" tu visión a cada audiencia es lo que diferencia senior de staff/principal.

---

## S8.8 Onboarding como senior

Cuando empezás en un equipo nuevo, los primeros 90 días definen tu reputación.

### Días 1-30: aprender
- **No** propongas cambios grandes.
- Leé los ADRs/RFCs históricos. Entendé la cultura.
- Pickear bugs/features chicas para conocer el codebase.
- Pregunta tonta = aceptable. Decisión apresurada = costoso.
- Identificá quiénes son los influencers reales del equipo (no necesariamente los managers).

### Días 30-60: contribuir
- Empezar con PRs medianos.
- Code reviews activos pero no agresivos.
- Identificar 2-3 mejoras pequeñas a proponer.

### Días 60-90: liderar (si aplica)
- Proponer mejora arquitectónica con ADR.
- Mentorear a alguien más nuevo.
- Tomá ownership de un área del sistema.

### Anti-patrón: "Hot take Charlie"
Persona que llega y en semana 2 dice "hay que rewrite todo en Rust". Pierde credibilidad antes de tener track record.

---

## S8.9 Decir "no" con elegancia

Skill crítica de senior. Casos típicos:

### Producto pide feature que romperá performance
❌ "No se puede."
✅ "Podemos hacerla. Acá los costos: bundle +200KB, LCP +0.8s. Si igual la priorizan, agreguemos a la conversación: ¿qué removemos para mantener performance budget?"

### Junior quiere mergear código que no entiende
❌ "Lo voy a rechazar."
✅ "Antes de aprobar, ¿podemos hacer pair? Quiero entender el reasoning. Si me lo explicás bien, mergeo. Si vos no lo entendés, mejor lo refactorizamos juntos."

### Manager presiona deadline imposible
❌ "Imposible." o "OK, vemos." (con resignación).
✅ "Hagamos el plan: feature completa = 3 semanas. Si lo necesitamos en 1, podemos: (a) recortar scope a X, (b) saltar tests críticos pero generamos deuda, (c) traer un dev externo. Cuál preferís?"

Pone el costo en la mesa. La decisión es del manager, pero informada.

### Refactor que no agrega valor
❌ "Yo no lo veo necesario."
✅ "Entiendo el deseo. ¿Cuál es el problema concreto que resuelve? Sin un dolor real, prefiero invertir el tiempo en X que sí está bloqueando."

---

## S8.10 La mentalidad senior

Un senior no es alguien que sabe más. Es alguien que:

### Asume ownership completo
"Esto está en producción y se rompió. No es bug del backend, no es de QA, no es de PM. Es del equipo. Yo soy parte del equipo. Voy a ayudar a arreglarlo y prevenirlo."

### Optimiza para el equipo, no para sí mismo
- Documenta para que otros puedan continuar.
- Code review enseñando.
- Decisiones que escalan, no las cool/elegantes solo para vos.

### Acepta complejidad cuando vale, evita cuando no
- "Sería elegante" no es razón para complejizar.
- "Vamos a necesitarlo" sin evidencia → YAGNI.
- Cuando la complejidad SÍ vale, la justificás explícitamente.

### Comparte el crédito, asume responsabilidad
- "Lo logramos como equipo, gracias a Y" en victorias.
- "Yo me equivoqué en X" en errores.

### Sabe lo que NO sabe
Pregunta sin miedo. Lee docs cuando no está seguro. Acepta cuando alguien junior tiene razón.

---

## 🧑‍🎓 Worked Example — primeras 6 semanas en un equipo nuevo

> Te contratan como senior frontend. Empezás lunes. ¿Qué hacés?

**Mi plan:**

### Semana 1
- 1:1 con cada miembro del equipo (15 min). Preguntá: "¿qué te frustra del codebase actual?"
- Leer 5 ADRs más recientes.
- Pickear 1 bug `good-first-issue`. Pasarlo de la mano (PR).
- Tomar notas: cosas que te parecen raras, sin compartir aún.

### Semana 2
- Otro PR pequeño.
- Empezar a participar en code reviews. Solo `[question]` y `[praise]` por ahora.
- Mapear arquitectura mental del codebase. Hacer un diagrama.

### Semana 3
- PR mediano (feature chica completa).
- Code reviews con `[suggestion]` ocasional.
- Identificar 2-3 mejoras potenciales (nada de "rewrite todo").

### Semana 4
- Proponer 1 mejora pequeña con ADR. Ej: "agregar typecheck en CI". Bajo riesgo, alto valor.
- Ofrecer ayuda en algo que ves struggle al equipo.

### Semana 5-6
- Si la propuesta de semana 4 funcionó: proponer algo más ambicioso.
- Empezar a liderar discusiones técnicas (no decisiones aún).
- Identificar a quién mentorear si hay un junior interesado.

### Después
- Tomá ownership de 1 área específica.
- Empezá a escribir RFCs para cambios más grandes.
- Compartí knowledge: tech talk interno, blog post, docs.

**Lo que NO hacés**:
- Semana 1 mandar un mensaje al CEO con tu rewrite plan.
- Semana 2 dar feedback negativo a alguien sin confianza ganada.
- Semana 3 imponer el patrón que usabas en tu trabajo anterior.

Esos son los anti-patrones que hacen que un "senior" pierda credibilidad rápido.

---

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Qué es un ADR y cuándo escribirlo?</strong></summary>

Architecture Decision Record. Documenta una decisión técnica importante: contexto, opciones, decisión, consecuencias.

Cuándo: elección de framework, patrón arquitectónico, decisión cara de revertir, trade-off no obvio.

NO para: decisiones triviales que cualquier dev puede cambiar.

Beneficio: en 6 meses, el equipo recuerda POR QUÉ algo es como es. Previene re-litigation.
</details>

<details>
<summary><strong>2. ¿Diferencia entre RFC y ADR?</strong></summary>

- **RFC**: propone una decisión por tomar. "Qué opinan?". Iteración con feedback.
- **ADR**: documenta una decisión TOMADA. "Esto se decidió y por qué".

Algunos equipos solo usan ADRs (más simple). Otros separan ambos (más explícito el proceso de discusión).
</details>

<details>
<summary><strong>3. ¿Qué hace un buen comentario de code review?</strong></summary>

- **Clasificado**: `[blocker]`, `[suggestion]`, `[nit]`, `[question]`, `[praise]`.
- **Explica el por qué**, no solo el qué.
- **Tono respetuoso**: "¿consideraste X?" en vez de "esto está mal".
- **Educativo**: cuando aplica, link o ejemplo.
- **Selectivo**: no comentes cada nit, enfocate en lo importante.

Anti-patrón: re-escribir el PR del autor en vez de explicar.
</details>

<details>
<summary><strong>4. ¿Qué hace blameless un postmortem?</strong></summary>

Foco en **sistema**, no en personas. La pregunta no es "¿quién hizo X?" sino "¿qué hubiéramos necesitado para que X no fuera posible?"

Reglas:
- No nombrar individualmente como acusación.
- Cada falla es una falla del sistema (procesos, tests, monitoring).
- Acciones de prevención, no "tener más cuidado".

Por qué importa: si culpás, la gente esconde errores. Sin postmortems honestos, no hay aprendizaje.
</details>

<details>
<summary><strong>5. ¿Por qué "decir no" es habilidad senior?</strong></summary>

Mid dice "no" defensivamente o se rinde y dice "sí" a todo. Senior negocia con datos:

- Pone los costos del "sí" en la mesa.
- Ofrece alternativas con trade-offs explícitos.
- Deja la decisión final en quien corresponde, pero informada.

Resultado: stakeholders confían más en él porque saben que sus estimaciones son honestas. Y puede defender priorización del equipo cuando otros piden imposibles.
</details>

<details>
<summary><strong>6. ¿Por qué los primeros 90 días en un equipo nuevo son críticos?</strong></summary>

Definen tu reputación. Los anti-patrones (proponer rewrite la semana 1, imponer patrones del trabajo anterior, dar feedback negativo sin confianza ganada) te queman credibilidad.

Plan saludable:
- Días 1-30: aprender, observar, contribuir chico.
- Días 30-60: empezar a opinar, proponer mejoras pequeñas.
- Días 60-90: liderar áreas específicas si hay tracción.

La paciencia paga. Apuro genera resentimiento.
</details>

---

## Resumen ejecutivo

- **ADRs y RFCs** son tu memoria técnica. Sin ellos, el equipo re-litiga las mismas decisiones.
- **Code review pedagógico** multiplica tu impacto: cada review es mentoring público.
- **Mentoring** convierte tu impacto individual en impacto de equipo.
- **Postmortems blameless** convierten incidents en aprendizaje sistémico.
- **Influencia sin autoridad**: track record + datos + empatía + paciencia.
- **Mentalidad senior**: ownership total, optimizar para equipo, decir "no" con argumentos.

Este es el último módulo del track. Ahora viene la parte que solo vos podés hacer: aplicar todo en código real, con un equipo real, durante años.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

🎓 **Fin del Track Senior.** Si llegaste acá, completaste 8 módulos densos. Ahora a aplicar.
