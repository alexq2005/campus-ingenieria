# Módulo 00 — Introducción a React

> ⏱ ~40 min · Sin pre-requisitos técnicos de React

📖 **[Leer la lección completa (lecture.html)](./lecture.html)**

## Qué cubre

Antes de escribir una línea de JSX: qué es React, por qué existe, su mental model y cuándo (no) usarlo.

## Conceptos clave

- React es una **librería de UI** (no un framework). Solo la capa de view.
- **UI = f(state)**: la UI es función pura del estado. Cambia el estado → React reconcilia.
- **Virtual DOM**: representación JS del DOM; React aplica solo los cambios mínimos.
- Historia: jQuery → Angular/Backbone → React (2013) → Hooks (2018) → RSC (2024) → React 19.
- Alternativas: Vue, Svelte, Solid, Qwik, Astro. React no es siempre la respuesta correcta.
- Stack moderno 2026: Vite + React 19 + TS + Tailwind + TanStack Query + Zustand.

## Cuándo NO usar React

Sitios estáticos (Astro/Hugo ganan), apps que deben correr sin JS, cuando el bundle size es crítico (Svelte gana).

## Recursos

- [react.dev](https://react.dev) — docs oficiales
- [Overreacted (Dan Abramov)](https://overreacted.io)

**Siguiente:** [M01 — Setup + Primer Componente](../m01-setup-y-primer-componente/)
