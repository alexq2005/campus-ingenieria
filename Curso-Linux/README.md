# Curso Completo de Linux

Curso estructurado en 14 módulos, de usuario novato a administrador competente, con foco en línea de comandos y scripting.

## Contenido

| # | Módulo | Tema |
|---|--------|------|
| 00 | `modulo-00-introduccion` | Historia, distribuciones, el shell |
| 01 | `modulo-01-sistema-archivos` | Jerarquía FHS, rutas, inodos |
| 02 | `modulo-02-comandos-basicos` | ls, cd, cp, mv, rm, find, grep |
| 03 | `modulo-03-editores` | nano, vim, emacs |
| 04 | `modulo-04-permisos` | chmod, chown, umask, ACL |
| 05 | `modulo-05-procesos` | ps, top, kill, jobs, signals |
| 06 | `modulo-06-usuarios-grupos` | useradd, sudo, /etc/passwd |
| 07 | `modulo-07-paquetes` | apt, dnf, pacman, snap |
| 08 | `modulo-08-redes` | ip, ss, netstat, curl, ssh |
| 09 | `modulo-09-bash-scripting` | Variables, condicionales, funciones, traps |
| 10 | `modulo-10-systemd` | systemctl, journalctl, units |
| 11 | `modulo-11-seguridad` | firewalls, SELinux, hardening |
| 12 | `modulo-12-administracion` | cron, logs, backup, monitoreo |
| 13 | `modulo-13-proyectos` | 3 proyectos integradores |

## Cómo usar este curso

1. Cada módulo tiene un archivo `.md` con teoría y una carpeta `scripts/` con shell scripts.
2. Lee la teoría → ejecuta los comandos en una terminal real → resuelve los ejercicios.
3. **Usa una VM o WSL2** si estás en Windows. No practiques administración en tu sistema host.

## Requisitos

- Una distribución Linux (Ubuntu/Debian recomendado para principiantes, Arch/Fedora para intermedios)
- Acceso a terminal con bash o zsh
- Privilegios sudo en al menos algunos ejercicios

## Distribuciones recomendadas para practicar

| Caso | Distro |
|------|--------|
| Principiante | Ubuntu 22.04 LTS o Linux Mint |
| Servidor | Debian 12 o Ubuntu Server |
| Aprender a fondo | Arch Linux (instalación manual) |
| Empresa/RHEL | Fedora o Rocky Linux |
| Windows host | WSL2 con Ubuntu |

## Filosofía Unix

> "Hacé una cosa y hacela bien. Combiná programas pequeños mediante pipes."

Cada herramienta del curso resuelve un problema acotado; el poder está en componerlas.
