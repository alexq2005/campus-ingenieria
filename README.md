# CS-FE Campus

**Cinco cursos completos de Ciencias de la Computación — estilo Harvard CS50**

> *"This is CS-FE — and this is your first step toward software."*

Campus con 5 cursos hermanos que comparten metodología y rigor, más un campus extendido de Ingeniería en Sistemas:

| Curso | Módulos | Foco |
|-------|---------|------|
| 🌐 [**Frontend (CS-FE)**](#-curso-1--desarrollo-web-frontend) | 14 + 8 senior | HTML, CSS, JS, React, TypeScript, performance, A11y |
| 🐍 [**Python**](./Curso-Python/) | 14 | De cero hasta async, POO, biblioteca estándar y proyectos |
| 🐧 [**Linux**](./Curso-Linux/) | 14 | Shell, permisos, procesos, redes, bash, systemd, seguridad |
| ⚛️ [**React**](./Curso-React/) | 15 | JSX, hooks, estado, Next.js 15, RSC, TanStack Query |
| 🔌 [**Computación Física**](./Curso-Computacion-Fisica/) | 10 | Electrónica, microcontroladores, sensores, DSP, control, FPGA |
| 🎓 [**Ingeniería en Sistemas**](../Curso%20ingenieria%20sistemas/) | 40+ | Matemática, arquitectura, SO, redes, bases de datos, IA |

> 🔗 **Computación Física e Ingeniería en Sistemas se complementan**: el software y el hardware se referencian mutuamente. Ver el [Mapa de Complementariedad](./Curso-Computacion-Fisica/mapa-complementariedad.html).

Punto de entrada visual: [**`index.html`**](./index.html) — abrí ese archivo en tu navegador y vas a ver el portal de los 3 cursos.

---

## Filosofía común

Estos no son tutoriales. Son **cursos universitarios** diseñados con el rigor de Harvard CS50 y CS50W: entendemos el *por qué* antes de memorizar el *cómo*. Cada módulo tiene:

- **Teoría** con contexto histórico, modelos mentales y trade-offs.
- **Ejemplos ejecutables** comentados.
- **Ejercicios graduados** al final de cada módulo.
- **Proyectos integradores** al final del curso.

Cada curso termina con **proyectos production-grade** que combinan todo el contenido.

---

## Requisitos previos

- Saber usar una computadora (abrir carpetas, instalar programas).
- Curiosidad y paciencia. **No** se requiere experiencia previa en programación.
- Un navegador moderno (Chrome, Firefox, Edge, Safari).
- Un editor de texto — recomiendo [VS Code](https://code.visualstudio.com/).
- Node.js 20+ (lo instalaremos en el módulo 9).

---

## 🌐 Curso 1 — Desarrollo Web Frontend

**Syllabus de 14 módulos**

| Semana | Módulo | Tema | Lecture | Problem Set |
|-------:|--------|------|---------|-------------|
| 0 | [`00`](./modulo-00-sillabus/) | Syllabus y setup del entorno | — | Setup |
| 1 | [`01`](./modulo-01-como-funciona-web/) | Cómo funciona la Web (HTTP, DNS, render pipeline) | ✅ | PS1 |
| 2 | [`02`](./modulo-02-html/) | HTML — Semántica y estructura del documento | ✅ | PS2 |
| 3 | [`03`](./modulo-03-css/) | CSS — Cascada, especificidad, selectores, box model | ✅ | PS3 |
| 4 | [`04`](./modulo-04-css-layout/) | CSS Layout — Flexbox, Grid, responsive design | ✅ | PS4 |
| 5 | [`05`](./modulo-05-javascript-fundamentos/) | JavaScript — Fundamentos del lenguaje | ✅ | PS5 |
| 6 | [`06`](./modulo-06-dom-eventos/) | DOM, Eventos y programación interactiva | ✅ | PS6 |
| 7 | [`07`](./modulo-07-javascript-moderno/) | JavaScript moderno — ES6+, módulos, clases | ✅ | PS7 |
| 8 | [`08`](./modulo-08-async-apis/) | Asincronía, Promises, async/await, Fetch API | ✅ | PS8 |
| 9 | [`09`](./modulo-09-tooling/) | Tooling — npm, Vite, Git, ESLint, Prettier | ✅ | PS9 |
| 10 | [`10`](./modulo-10-react/) | React — Componentes, hooks, estado, routing | ✅ | PS10 |
| 11 | [`11`](./modulo-11-typescript/) | TypeScript — Tipado estático para JS | ✅ | PS11 |
| 12 | [`12`](./modulo-12-performance-a11y-seo/) | Performance, Accesibilidad (WCAG), SEO | ✅ | PS12 |
| 13 | [`13`](./modulo-13-proyecto-final/) | **Proyecto final** | — | Capstone |

---

## 🐍 Curso 2 — Python

**Syllabus de 14 módulos** · ver índice completo en [`Curso-Python/`](./Curso-Python/)

| # | Módulo | Tema |
|--:|--------|------|
| 00 | [Introducción](./Curso-Python/modulo-00-introduccion/) | Instalación, REPL, Zen of Python |
| 01 | [Variables y tipos](./Curso-Python/modulo-01-variables-y-tipos/) | int, float, str, bool, f-strings |
| 02 | [Operadores](./Curso-Python/modulo-02-operadores/) | Aritméticos, lógicos, walrus |
| 03 | [Estructuras de datos](./Curso-Python/modulo-03-estructuras-de-datos/) | list, tuple, set, dict, Counter |
| 04 | [Control de flujo](./Curso-Python/modulo-04-control-de-flujo/) | if, for, while, match/case |
| 05 | [Funciones](./Curso-Python/modulo-05-funciones/) | def, lambda, decoradores, closures |
| 06 | [POO](./Curso-Python/modulo-06-poo/) | Clases, herencia, dataclasses, ABC |
| 07 | [Manejo de errores](./Curso-Python/modulo-07-manejo-de-errores/) | try/except, custom, context managers |
| 08 | [Archivos e I/O](./Curso-Python/modulo-08-archivos-io/) | open, pathlib, JSON, CSV, argparse |
| 09 | [Módulos y paquetes](./Curso-Python/modulo-09-modulos-y-paquetes/) | import, venv, pip, pyproject.toml |
| 10 | [Programación funcional](./Curso-Python/modulo-10-programacion-funcional/) | map, filter, generadores, itertools |
| 11 | [Concurrencia](./Curso-Python/modulo-11-concurrencia/) | threading, asyncio, multiprocessing |
| 12 | [Biblioteca estándar](./Curso-Python/modulo-12-biblioteca-estandar/) | os, datetime, re, logging, subprocess |
| 13 | [**Proyectos**](./Curso-Python/modulo-13-proyectos/) | Tareas CLI · Web scraper · API REST |

---

## 🐧 Curso 3 — Linux

**Syllabus de 14 módulos** · ver índice completo en [`Curso-Linux/`](./Curso-Linux/)

| # | Módulo | Tema |
|--:|--------|------|
| 00 | [Introducción](./Curso-Linux/modulo-00-introduccion/) | Distros, filosofía Unix, el shell |
| 01 | [Sistema de archivos](./Curso-Linux/modulo-01-sistema-archivos/) | FHS, inodos, links, mount |
| 02 | [Comandos básicos](./Curso-Linux/modulo-02-comandos-basicos/) | ls, find, grep, pipes, awk, sed |
| 03 | [Editores](./Curso-Linux/modulo-03-editores/) | nano, vim (4 modos), emacs |
| 04 | [Permisos](./Curso-Linux/modulo-04-permisos/) | chmod, chown, setuid, ACL |
| 05 | [Procesos](./Curso-Linux/modulo-05-procesos/) | ps, top, kill, señales, tmux |
| 06 | [Usuarios y grupos](./Curso-Linux/modulo-06-usuarios-grupos/) | useradd, sudo, ssh keys |
| 07 | [Paquetes](./Curso-Linux/modulo-07-paquetes/) | apt, dnf, pacman, flatpak |
| 08 | [Redes](./Curso-Linux/modulo-08-redes/) | ip, ss, ssh, rsync, ufw |
| 09 | [Bash scripting](./Curso-Linux/modulo-09-bash-scripting/) | set -euo, condicionales, traps |
| 10 | [systemd](./Curso-Linux/modulo-10-systemd/) | systemctl, units, timers, journal |
| 11 | [Seguridad](./Curso-Linux/modulo-11-seguridad/) | Hardening, fail2ban, SELinux, TLS |
| 12 | [Administración](./Curso-Linux/modulo-12-administracion/) | cron, logrotate, LVM, backups |
| 13 | [**Proyectos**](./Curso-Linux/modulo-13-proyectos/) | Nginx + HTTPS · sys-report · Deploy app |

---

## Cómo estudiar estos cursos

1. **Lee el lecture completo** antes de tocar código. Evita el copy-paste mental.
2. **Escribe los ejemplos a mano.** Sí, a mano. El cerebro aprende distinto cuando tipea.
3. **Resuelve los ejercicios sin ver la solución.** Falla, frustrate, vuelve a intentar. Así se aprende.
4. **Explica en voz alta** lo que acabás de aprender (técnica Feynman). Si no lo podés explicar, no lo entendiste.
5. **Construí algo propio** cada semana. Un mini-proyecto, un clon, un experimento.

---

## Evaluación (si te autoimpones disciplina)

- 60% problem sets (12 PS × 5%)
- 40% proyecto final

Aprobación: >= 70%. No te mientas — si copiaste, no aprendiste.

---

## Código de honor

> *"You are welcome to discuss the course's material with others in order to better understand it, but the work you ultimately turn in must be your own."*
> — CS50 Academic Honesty

---

## Licencia

MIT. Usá este material libremente. Si lo compartís, citá la fuente.

— Prof. Claude, Frontend Faculty
