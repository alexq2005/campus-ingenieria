# Módulo 03 — Editores de Texto

En Linux la edición de archivos se hace constantemente desde la terminal. Saber al menos un editor CLI es **obligatorio**.

## `nano` — el editor amigable

Default en muchas distros para principiantes.

```bash
nano archivo.txt
nano +50 archivo            # abrir en línea 50
nano -w archivo             # no wrap automático (para scripts)
```

### Atajos esenciales (`^` = Ctrl)
| Atajo | Acción |
|-------|--------|
| `^O` | Guardar (Write Out) |
| `^X` | Salir |
| `^K` | Cortar línea |
| `^U` | Pegar |
| `^W` | Buscar |
| `^\` | Buscar y reemplazar |
| `^G` | Ayuda |
| `Alt+U` | Deshacer |
| `^_` | Ir a línea |

> Las opciones se muestran abajo todo el tiempo. Si dudás, ahí están.

## `vim` — el editor del poder

Vim tiene **modos**. Esa es su filosofía y su trampa.

```bash
vim archivo.txt
vim +50 archivo             # abrir en línea 50
vim -O a.txt b.txt          # split vertical
```

### Los 4 modos
| Modo | Para qué |
|------|----------|
| **Normal** | Navegar y ejecutar comandos (default al abrir) |
| **Insert** | Escribir texto |
| **Visual** | Seleccionar |
| **Command** | Ejecutar comandos largos (`:`) |

### Cambiar de modo
| Tecla | A modo |
|-------|--------|
| `i` | Insert (antes del cursor) |
| `a` | Insert (después del cursor) |
| `o` | Insert (línea nueva abajo) |
| `O` | Insert (línea nueva arriba) |
| `v` | Visual (carácter) |
| `V` | Visual (línea) |
| `Esc` | Volver a Normal |
| `:` | Command |

### Movimiento (en Normal)
| Tecla | Acción |
|-------|--------|
| `h j k l` | Izq, abajo, arriba, der |
| `w` / `b` | Palabra siguiente / anterior |
| `0` / `$` | Inicio / fin de línea |
| `gg` / `G` | Inicio / fin de archivo |
| `:42` | Ir a línea 42 |
| `Ctrl+f` / `Ctrl+b` | Página adelante / atrás |
| `%` | Saltar al paréntesis/llave que cierra |

### Edición (en Normal)
| Comando | Acción |
|---------|--------|
| `x` | Borrar carácter |
| `dd` | Borrar línea (cortar) |
| `yy` | Copiar línea (yank) |
| `p` | Pegar después |
| `P` | Pegar antes |
| `u` | Deshacer |
| `Ctrl+r` | Rehacer |
| `r<x>` | Reemplazar carácter por x |
| `cw` | Cambiar palabra |
| `dw` | Borrar palabra |
| `>>` / `<<` | Indentar derecha / izquierda |

### Buscar y reemplazar
```
/patrón                     buscar adelante (n = siguiente, N = anterior)
?patrón                     buscar atrás
:%s/viejo/nuevo/g           reemplazar en todo el archivo
:%s/viejo/nuevo/gc          confirmando uno por uno
:5,10s/viejo/nuevo/g        en líneas 5 a 10
```

### Guardar y salir
```
:w                          guardar
:w nombre                   guardar como
:q                          salir
:q!                         salir sin guardar
:wq  o  :x  o  ZZ           guardar y salir
```

### `vimtutor`
Tutorial interactivo de 30 minutos:
```bash
vimtutor
```

> **Si solo aprendés un editor de terminal en tu vida, que sea vim o uno de sus clones (neovim).** Todos los servidores Linux lo tienen.

## `neovim` (`nvim`)

Fork moderno de vim. Compatible con la mayoría de comandos y configuración (`init.lua` o `init.vim`). Recomendado para usuarios nuevos en 2025.

```bash
nvim archivo.txt
```

## `emacs`

El "anti-vim". Filosofía opuesta: en lugar de modos, todo se hace con combinaciones de teclas (mucho `Ctrl` y `Alt`).

```bash
emacs archivo.txt
emacs -nw archivo            # sin GUI (terminal)
```

### Atajos básicos
| Atajo | Acción |
|-------|--------|
| `Ctrl+x Ctrl+s` | Guardar |
| `Ctrl+x Ctrl+c` | Salir |
| `Ctrl+x Ctrl+f` | Abrir archivo |
| `Ctrl+s` | Buscar adelante |
| `Ctrl+r` | Buscar atrás |
| `Alt+%` | Reemplazar |
| `Ctrl+g` | Cancelar |

> Emacs es un sistema operativo que casualmente edita texto. Tiene cliente de email, navegador web, organizador (org-mode), etc.

## Edición no interactiva — `sed` y `awk`

Para automatizar cambios sin abrir editor:
```bash
sed -i 's/foo/bar/g' archivo
sed -i '5d' archivo                  # borra línea 5
awk '$2 > 100' archivo > filtrado    # filtra
```

## ¿Cuál elegir?

| Caso | Editor |
|------|--------|
| Edición ocasional rápida | `nano` |
| Servidor (en cualquier distro) | `vim` |
| Setup moderno con plugins | `neovim` |
| Edición programática/scripts | `sed`, `awk` |
| Si ya sabés VS Code y querés cambios rápidos en VM | montar carpeta con `sshfs` o usar Remote SSH |

## Configuración

### vim — `~/.vimrc`
```vim
set number              " números de línea
set relativenumber      " números relativos
set tabstop=4           " tab = 4 espacios
set shiftwidth=4
set expandtab           " tab inserta espacios
set autoindent
set ignorecase smartcase
syntax on
filetype plugin indent on
```

### nano — `~/.nanorc`
```
set linenumbers
set tabsize 4
set tabstospaces
set autoindent
include "/usr/share/nano/*.nanorc"   # syntax highlighting
```

## Ejercicios

1. Hacer `vimtutor` completo
2. En vim: abrir un archivo, ir a la línea 10, borrar 3 líneas, deshacer, guardar y salir
3. Crear un `~/.vimrc` con tus preferencias mínimas
4. Comparar el mismo archivo abierto en `nano` y `vim` — ¿con cuál sos más rápido?
5. Hacer un reemplazo masivo con `:%s/` en vim y verificar
