# Módulo 04 — Permisos y Propiedad

## Modelo de permisos Unix

Cada archivo tiene **3 conjuntos de permisos** (read, write, execute) para **3 categorías**:

| Categoría | Símbolo | Significado |
|-----------|---------|-------------|
| **User** (owner) | `u` | El dueño del archivo |
| **Group** | `g` | Miembros del grupo del archivo |
| **Others** | `o` | Todos los demás |

Y `a` (`all`) abarca los tres.

## Lectura de `ls -l`

```
-rwxr-xr--  1  ana  devs  1234  Mar 15 10:30  script.sh
```

- `-` tipo de archivo (`-` regular, `d` directorio, `l` symlink)
- `rwx` permisos del **user** (dueño)
- `r-x` permisos del **grupo**
- `r--` permisos de **others**
- `1` número de hard links
- `ana` dueño
- `devs` grupo
- `1234` tamaño en bytes
- fecha de modificación y nombre

| Permiso | Archivo regular | Directorio |
|---------|----------------|------------|
| `r` | Leer contenido | Listar contenido (`ls`) |
| `w` | Modificar contenido | Crear/eliminar archivos dentro |
| `x` | Ejecutar | Entrar (`cd`) y acceder a archivos |

> **Importante**: para borrar un archivo necesitás `w` y `x` en el **directorio que lo contiene**, no en el archivo.

## Notación octal

Cada permiso es un bit:
- `r = 4`
- `w = 2`
- `x = 1`

Se suman por categoría:

| Octal | Binario | Permisos |
|-------|---------|----------|
| `7` | `111` | `rwx` |
| `6` | `110` | `rw-` |
| `5` | `101` | `r-x` |
| `4` | `100` | `r--` |
| `0` | `000` | `---` |

Ejemplos comunes:

| Octal | Permisos | Uso típico |
|-------|----------|------------|
| `755` | `rwxr-xr-x` | Scripts ejecutables, directorios |
| `644` | `rw-r--r--` | Archivos de texto, código |
| `600` | `rw-------` | Llaves SSH, configs sensibles |
| `700` | `rwx------` | Directorios privados |
| `777` | `rwxrwxrwx` | Casi nunca correcto |

## `chmod` — cambiar permisos

### Notación octal
```bash
chmod 755 script.sh
chmod 644 archivo.txt
chmod -R 755 carpeta/
```

### Notación simbólica
```bash
chmod u+x script.sh
chmod u-w archivo
chmod g+rw archivo
chmod o-r archivo
chmod a+x script.sh
chmod ug=rw,o=r archivo
```

| Operador | Acción |
|----------|--------|
| `+` | Agregar |
| `-` | Quitar |
| `=` | Asignar exacto |

## `chown` — cambiar dueño

```bash
sudo chown ana archivo
sudo chown ana:devs archivo
sudo chown :devs archivo
sudo chown -R ana:devs carpeta/
```

## `umask` — permisos default

`umask` define qué permisos se **quitan** a archivos nuevos. Default típico:

| `umask` | Archivos | Directorios |
|---------|----------|-------------|
| `022` | `644` | `755` |
| `027` | `640` | `750` |
| `077` | `600` | `700` |

```bash
umask
umask 022
```

## Permisos especiales

### setuid (`s` en user)
El proceso corre con permisos del **dueño** del archivo, no del que lo ejecuta. Ejemplo: `/usr/bin/passwd` tiene setuid root para escribir en `/etc/shadow`.

```bash
chmod u+s archivo
chmod 4755 archivo
```

### setgid (`s` en group)
En directorios, archivos creados heredan el grupo del directorio:

```bash
chmod g+s carpeta_compartida
chmod 2755 carpeta
```

### sticky bit (`t` en others)
En directorios, solo el **dueño del archivo** puede eliminarlo. Lo usa `/tmp`:

```bash
chmod +t carpeta
chmod 1777 carpeta
```

## ACL — control fino

```bash
getfacl archivo
setfacl -m u:luis:rw archivo
setfacl -m g:devs:r archivo
setfacl -x u:luis archivo
setfacl -b archivo
setfacl -d -m u:luis:rwx carpeta
```

`ls -l` muestra `+` al final cuando hay ACL extra.

## Atributos extendidos — `chattr`

```bash
sudo chattr +i archivo
sudo chattr +a log.txt
sudo chattr -i archivo
lsattr archivo
```

## Casos típicos

### Script ejecutable
```bash
chmod +x script.sh
./script.sh
```

### Llaves SSH
```bash
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 700 ~/.ssh
```

### Carpeta compartida por equipo
```bash
sudo mkdir /srv/proyecto
sudo chgrp devs /srv/proyecto
sudo chmod 2775 /srv/proyecto
```

## sudo y root

```bash
sudo comando
sudo -i
sudo -u ana comando
```

Editar `/etc/sudoers` con `visudo`.

## Ejercicios

1. Crear `hola.sh` con `echo "hola"`, hacerlo ejecutable
2. Dar permisos `640` con notación octal y luego simbólica
3. Crear carpeta compartida con setgid para un grupo
4. Verificar permisos de tus llaves SSH
5. Probar `chattr +i` y verificar que ni `sudo rm` lo elimina
