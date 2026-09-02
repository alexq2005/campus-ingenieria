# Módulo 01 — Sistema de Archivos

## Filosofía Unix: "todo es un archivo"

En Linux, **todo se representa como archivo**: dispositivos, procesos, sockets, configuración del kernel. Esto unifica las APIs.

Por ejemplo:
- `/dev/sda` — disco duro
- `/proc/cpuinfo` — info del CPU
- `/dev/null` — agujero negro (descarta lo que escribas)
- `/dev/random` — generador de números aleatorios

## Filesystem Hierarchy Standard (FHS)

Todas las distros siguen un layout estándar a partir de `/` (raíz):

| Directorio | Contenido |
|------------|-----------|
| `/` | Raíz del sistema |
| `/bin` | Binarios esenciales (ls, cp, mv) |
| `/sbin` | Binarios de administración (mount, fdisk) |
| `/etc` | Archivos de **configuración** del sistema |
| `/home` | Directorios personales (`/home/ana`) |
| `/root` | Home del usuario root |
| `/var` | Datos variables: logs, mail, caches (`/var/log`) |
| `/tmp` | Temporales (se borra al reiniciar) |
| `/usr` | Software instalado: `/usr/bin`, `/usr/lib`, `/usr/local` |
| `/opt` | Software opcional/de terceros |
| `/dev` | Archivos de dispositivos |
| `/proc` | Sistema de archivos virtual con info de procesos |
| `/sys` | Sistema de archivos virtual con info del kernel |
| `/boot` | Kernel + bootloader (GRUB) |
| `/lib`, `/lib64` | Librerías compartidas |
| `/mnt`, `/media` | Puntos de montaje (USBs, discos externos) |
| `/srv` | Datos servidos por servicios (web, ftp) |

## Rutas absolutas vs relativas

```bash
/home/ana/docs/notas.txt    # absoluta (empieza con /)
docs/notas.txt              # relativa al directorio actual
./docs/notas.txt            # idem (. = directorio actual)
../otro/archivo             # sube un nivel (.. = padre)
~/docs/notas.txt            # ~ = home del usuario actual (~/ = $HOME/)
~ana/docs                   # home de usuario "ana"
```

### Casos especiales
| Símbolo | Significado |
|---------|-------------|
| `.` | Directorio actual |
| `..` | Directorio padre |
| `~` | Home del usuario actual |
| `-` | Directorio anterior (`cd -`) |
| `/` | Separador de path |

## Inodos

Cada archivo tiene un **inodo**: estructura que guarda metadatos (permisos, dueño, timestamps, ubicación de bloques). El nombre del archivo es solo una entrada en un directorio que apunta a un inodo.

```bash
ls -i archivo.txt          # muestra el número de inodo
stat archivo.txt           # info detallada del inodo
```

## Hard links vs symbolic links

### Hard link
Otra entrada en un directorio apuntando al **mismo inodo**:
```bash
ln origen.txt hardlink.txt
```
- Mismo contenido, mismo inodo
- Si borrás el original, el hard link sigue funcionando
- No funcionan entre sistemas de archivos distintos
- No se pueden hacer a directorios

### Symbolic link (symlink, soft link)
"Acceso directo" — un archivo especial que **apunta a otra ruta**:
```bash
ln -s /ruta/original.txt symlink.txt
```
- Si borrás el original, el symlink queda **roto**
- Funcionan entre sistemas de archivos
- Se pueden hacer a directorios
- Se ven con `ls -l`: `lrwxrwxrwx ... symlink.txt -> /ruta/original.txt`

## Tipos de archivo

`ls -l` muestra el tipo en el primer carácter:

| Carácter | Tipo |
|----------|------|
| `-` | Archivo regular |
| `d` | Directorio |
| `l` | Symlink |
| `b` | Block device (disco) |
| `c` | Character device (teclado, terminal) |
| `p` | Named pipe (FIFO) |
| `s` | Socket |

## Tamaños y unidades

```bash
ls -lh                     # human-readable: 4.5K, 2.3M, 1.2G
du -sh /home/ana           # tamaño total del directorio
du -h --max-depth=1        # subdirectorios
df -h                      # uso de disco por filesystem
ncdu                       # navegador interactivo de tamaños (instalable)
```

## Sistemas de archivos comunes

| FS | Notas |
|----|-------|
| `ext4` | Default en muchas distros; estable |
| `btrfs` | Snapshots, compresión; default en Fedora |
| `xfs` | Default en RHEL; bueno para archivos grandes |
| `zfs` | Featureful pero requiere setup |
| `tmpfs` | RAM (`/tmp` puede usarlo) |
| `vfat` / `exfat` | Para USBs compatibles con Windows |
| `ntfs` | Lectura nativa, escritura por `ntfs-3g` |

Ver tu filesystem:
```bash
df -T
mount | column -t
```

## Montar y desmontar

```bash
sudo mount /dev/sdb1 /mnt/usb
sudo umount /mnt/usb
lsblk                      # lista dispositivos en árbol
```

Para automatizar: `/etc/fstab`.

## Ejercicios

1. Listar el contenido de `/etc` y descubrir qué archivos de configuración tenés
2. Crear un symlink en tu home apuntando a `/var/log/syslog`
3. Comparar `du -sh ~` y ver qué carpetas ocupan más espacio
4. Encontrar el inodo de un archivo y crear un hard link, luego borrar el original — ¿qué pasa?
5. Ejecutar `cat /proc/cpuinfo` y leer la info del CPU
