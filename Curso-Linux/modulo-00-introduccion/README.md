# Módulo 00 — Introducción a Linux

## ¿Qué es Linux?

**Linux** es el kernel (núcleo del sistema operativo) creado por Linus Torvalds en 1991. Inspirado en Unix, es **libre, de código abierto y multiusuario**.

Cuando hablamos de "Linux" coloquialmente, nos referimos a una **distribución (distro)**: el kernel + utilidades GNU + gestor de paquetes + entorno de escritorio + decisiones de filosofía. Por eso técnicamente algunos dicen "GNU/Linux".

## Filosofía Unix

> 1. Hacé una cosa y hacela bien
> 2. Trabajá con texto plano siempre que puedas
> 3. Combiná programas con pipes
> 4. Preferí simplicidad a complejidad

Cada herramienta del shell es pequeña pero componible. Ese es el secreto del poder de la línea de comandos.

## Distribuciones populares

| Distro | Familia | Caso de uso típico |
|--------|---------|-------------------|
| **Ubuntu** | Debian | Principiantes, servidores, desktop |
| **Debian** | Debian | Servidores estables, base de muchas otras |
| **Linux Mint** | Ubuntu | Desktop amigable estilo Windows |
| **Fedora** | Red Hat | Workstations modernas, devs |
| **Rocky Linux** / **AlmaLinux** | RHEL | Servidores empresariales (reemplazos de CentOS) |
| **Arch Linux** | Independiente | Usuarios avanzados, rolling release |
| **Manjaro** | Arch | Arch para principiantes |
| **openSUSE** | SUSE | Estable, dos sabores (Leap/Tumbleweed) |
| **Alpine** | Independiente | Containers, sistemas mínimos |
| **NixOS** | Independiente | Reproducibilidad declarativa |

### ¿Cuál elegir para aprender?
- **Ubuntu LTS** — recomendación general
- **Debian** — si querés algo más "puro"
- **Fedora** — para tener herramientas modernas (RHEL upstream)
- **Arch** — solo si querés aprender entrañas (instalación manual = curso intensivo)

## Componentes de un sistema Linux

```
┌─────────────────────────────────┐
│  Aplicaciones (Firefox, vim)    │
├─────────────────────────────────┤
│  Shell (bash, zsh)              │
├─────────────────────────────────┤
│  Utilidades GNU (ls, grep, ...) │
├─────────────────────────────────┤
│  Bibliotecas (glibc, ...)       │
├─────────────────────────────────┤
│  Kernel Linux                   │
├─────────────────────────────────┤
│  Hardware                       │
└─────────────────────────────────┘
```

## El shell

El **shell** es el intérprete de comandos. Lee lo que escribís, ejecuta el comando, devuelve resultado.

| Shell | Notas |
|-------|-------|
| `bash` | Default en la mayoría de distros |
| `zsh` | Más features (autocompletado, plugins). Default en macOS |
| `fish` | Amigable, sintaxis ligeramente distinta |
| `dash` | Mínimo, rápido (default `/bin/sh` en Debian/Ubuntu) |

Verificá tu shell:
```bash
echo $SHELL
```

## Tu primera sesión

Abrí una terminal y probá:

```bash
whoami              # tu usuario
hostname            # nombre del equipo
pwd                 # directorio actual
ls                  # contenido del directorio
date                # fecha y hora
uname -a            # info del sistema
uptime              # cuánto lleva encendido
free -h             # memoria RAM
df -h               # uso de disco
```

## Estructura de un comando

```
comando [opciones] [argumentos]

ls -la /home/usuario
│  │   │
│  │   └── argumento
│  └────── opciones (cortas: -l -a, larga: --all)
└────────── comando
```

### Opciones cortas vs largas
```bash
ls -l --all          # equivalente a: ls -la
grep -i "Hola"       # ignore case
grep --ignore-case "Hola"
```

### Combinar opciones
```bash
ls -lah              # = -l -a -h
```

## Acceso a documentación

```bash
man ls              # manual completo (q para salir)
ls --help           # ayuda corta
info ls             # documentación extendida (GNU)
tldr ls             # ejemplos prácticos (instalable)
which ls            # ruta del binario
type ls             # qué tipo de comando es
```

## Atajos de terminal esenciales

| Atajo | Acción |
|-------|--------|
| `Ctrl+C` | Cancelar comando actual |
| `Ctrl+D` | EOF / cerrar sesión |
| `Ctrl+L` | Limpiar pantalla |
| `Ctrl+A` / `Ctrl+E` | Inicio / fin de línea |
| `Ctrl+U` / `Ctrl+K` | Borrar antes / después del cursor |
| `Ctrl+W` | Borrar palabra anterior |
| `Ctrl+R` | Buscar en historial |
| `↑` / `↓` | Navegar historial |
| `Tab` | Autocompletar |
| `Tab Tab` | Mostrar opciones |

## Configurar entorno (Windows users)

### Opción 1: WSL2 (recomendado)
```powershell
# En PowerShell como admin
wsl --install
wsl --install -d Ubuntu
```

### Opción 2: VirtualBox / VMware
Instalar Ubuntu en una máquina virtual.

### Opción 3: Dual boot
Particionar el disco. Más invasivo, no recomendado para empezar.

## Ejercicios

1. Identificar tu distribución: `lsb_release -a` o `cat /etc/os-release`
2. Ver tu kernel: `uname -r`
3. Listar procesos en ejecución: `ps aux | head`
4. Ver tu shell actual: `echo $SHELL`
5. Leer la página `man bash` y buscar la sección "BUILTIN COMMANDS"
