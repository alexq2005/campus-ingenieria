# Problem Set S-08 — Liderazgo Técnico

> Este PS es **diferente** a los anteriores. No hay código que ejecutar. Son ejercicios de comunicación, decisión, escritura.
>
> Estas habilidades NO se aprenden leyendo — se desarrollan **practicando con stakes reales**. Hacé estos ejercicios en tu trabajo o proyecto open source, no en el vacío.

## Sección A — ADRs

1. **Tu primer ADR real**:
   - Identificá una decisión técnica reciente en tu trabajo o proyecto.
   - Escribí el ADR retroactivo: contexto, opciones, decisión, consecuencias.
   - Compartilo con tu equipo. Pedí feedback.
   - Mejoralo.

2. **Audit de ADRs públicos**: leé al menos 5 ADRs reales:
   - [Spotify ADRs](https://github.com/spotify/backstage/tree/master/docs/architecture-decisions)
   - [Open source projects](https://adr.github.io/)
   - Identificá qué los hace buenos: claridad, brevedad, opciones consideradas.

3. **Template propio**: customizá el template de ADR para tu equipo. Considerá:
   - ¿Necesitás campo "Status"?
   - ¿"Stakeholders consultados" tiene sentido en tu org?
   - ¿"Métricas de éxito" para verificar si la decisión funcionó?

## Sección B — RFCs

4. **Escribí un RFC** para una propuesta real:
   - Migrar de X a Y.
   - Adoptar una nueva librería.
   - Refactor arquitectónico.
   
   Compartilo con el equipo. Iterá basado en comments durante 1 semana.

5. **Lee RFCs públicos** de proyectos open source:
   - [Rust RFCs](https://rust-lang.github.io/rfcs/)
   - [TC39 proposals](https://github.com/tc39/proposals)
   - Identificá: cómo manejan disagreement, qué hace que un RFC progrese.

## Sección C — Code review

6. **Self-audit de tus reviews recientes**:
   - Mirá tus últimos 10 comentarios en code reviews.
   - ¿Cuántos eran `[blocker]` legítimos?
   - ¿Cuántos eran nits sin valor?
   - ¿Cuántos enseñaron algo?
   - ¿Tono fue respetuoso siempre?

7. **Categorizá tus comentarios** los próximos 2 semanas:
   - `[blocker]`, `[suggestion]`, `[nit]`, `[question]`, `[praise]`.
   - Apuntá a tener al menos 1 `[praise]` por PR.
   - Si tenés más `[nit]` que `[suggestion]`, estás siendo pedante.

8. **PR template**:
   - Diseñá un template para tu equipo. Debe forzar:
     - ¿Qué problema resuelve?
     - Screenshot/video si afecta UI.
     - Cómo testeaste.
     - Riesgos de deploy.
   - Implementalo (`.github/PULL_REQUEST_TEMPLATE.md`).

## Sección D — Mentoring

9. **Identificá un mentee**:
   - Junior en tu equipo (o open source).
   - Acordá meet-up semanal de 30 min.
   - Definí goals: "en 3 meses, X domina Y skill".

10. **Pair programming session**:
    - Sesión de 1h donde el junior tipea, vos guiás con preguntas.
    - Reglas: no agarrás teclado, no resolvés por él.
    - Después: feedback constructivo en 5 min.

11. **Documento "Onboarding al equipo"**:
    - Roadmap para nuevo dev: semana 1, 2, 3.
    - Recursos clave (ADRs importantes, docs internas).
    - Kit de iniciación: issues `good-first-issue`.
    - Quién consultar para qué.

## Sección E — Postmortems

12. **Postmortem real**:
    - Recordá un incident reciente (en trabajo o proyecto).
    - Escribí el postmortem completo blameless.
    - Acciones con owner + deadline.
    - Compartilo (al menos al equipo).

13. **5 whys retroactivo**:
    - Tomá un bug que arreglaste recientemente.
    - Apliquá 5 whys hasta llegar al root cause sistémico.
    - ¿Qué cambio en proceso hubiera prevenido la clase entera de bug?

14. **Análisis de un postmortem público**:
    - Leé un postmortem famoso (GitHub 2018, AWS S3 2017, Cloudflare 2019).
    - Identificá:
      - ¿Qué hicieron bien en el manejo del incident?
      - ¿Cómo es el tono? ¿Blameless?
      - ¿Las acciones de prevención son específicas o vagas?

## Sección F — Comunicación

15. **Escribí 3 versiones de la misma propuesta** (audiencia distinta):
    - Para tu equipo técnico (detalle full).
    - Para product manager (beneficios + costos en timeline).
    - Para CEO/CTO (riesgo + impacto sin jerga).
    
    Compará lo que cambia en cada versión.

16. **Tech talk interno**:
    - Tema técnico que dominás.
    - 30 min, audiencia mixta (técnica + no técnica).
    - Outline → slides → ensayo → presentación.
    - Pedí feedback honesto.

17. **Blog post técnico**:
    - Algo que aprendiste recientemente (~1500 palabras).
    - Publicar en dev.to, Medium, blog propio.
    - Goal: explicarlo bien a tu yo de hace 6 meses.

## Sección G — Influencia y decisiones

18. **Decir "no" estructurado**:
    - Próxima vez que alguien te pida algo poco realista, NO digas "imposible".
    - Aplicá el patrón: "Sí podemos. Costos: A, B, C. Si igual lo priorizan, ¿qué removemos para X?"
    - Documentá la conversación: ¿qué funcionó? ¿cómo respondieron?

19. **Identificá tu zona de influencia actual**:
    - ¿En qué decisiones técnicas te consultan?
    - ¿En cuáles deberían pero no lo hacen?
    - ¿Por qué no? (track record, comunicación, posición)
    - Plan para expandir: 1 cosa concreta a hacer en los próximos 30 días.

## Sección H — Mentalidad

20. **Self-audit "ownership"**:
    - En las últimas 4 semanas, identificá 3 momentos donde dijiste/pensaste "ese no es mi problema".
    - Para cada uno: ¿qué hubieras hecho con mentalidad de ownership total?
    - ¿Cuál fue la consecuencia real de no tomar ownership?

21. **Carta a tu yo de hace 2 años**:
    - Escribí ~1 página: ¿qué hiciste mal? ¿Qué desearías haber sabido?
    - Goal: identificar tus propios anti-patrones.

## Desafío final

22. **Onboarding plan completo** para un dev nuevo a un proyecto tuyo:
    - Días 1-7: setup + primer PR.
    - Días 8-30: aprender la arquitectura.
    - Días 31-60: contribuir features completas.
    - Días 60-90: liderar área pequeña.
    - Recursos para cada fase.
    - Métricas de éxito.

23. **Tech radar de tu equipo**:
    - Identificá 20+ tecnologías/prácticas en uso o consideradas.
    - Categorizalas: Adopt, Trial, Assess, Hold (formato ThoughtWorks).
    - Documentá razón de cada categoría.
    - Compartí con el equipo, generá discusión.

24. **3-month plan de mejora del equipo**:
    - Identificá las 3 cosas más dolorosas en tu equipo (con datos).
    - Para cada una: hipótesis de causa + plan de mejora + métricas de éxito.
    - Presentalo al manager. Negociá tiempo para implementar.
    - Trackeá si funcionó.

## Entregable

NO es código. Es:
- 1 ADR escrito y compartido (ej. 1).
- 1 RFC propuesto (ej. 4).
- 1 postmortem real o análisis (ej. 12-14).
- 1 blog post o tech talk (ej. 16-17).
- Onboarding plan para tu proyecto (ej. 22).

Si hacés esto bien, en 1 año tu carrera cambió de nivel. Garantizado.

---

## 🎓 Cierre del Track Senior

Completaste los 8 módulos. Ahora:

1. **Aplicá**. Estos conocimientos sin práctica real son inertes.
2. **Construí** proyectos donde puedas ejercer estos patrones.
3. **Mentoreá** a alguien — explicar fija aprendizaje.
4. **Documentá** tus decisiones — tu yo del futuro lo agradece.
5. **Buscá feedback** activo — la única forma de calibrar tu nivel.

El curso termina. Tu camino de senior empieza.
