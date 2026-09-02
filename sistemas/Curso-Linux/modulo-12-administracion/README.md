# Módulo 12 — Administración Avanzada

## cron — tareas programadas (clásico)

`cron` ejecuta comandos en horarios definidos.

### Sintaxis del crontab
```
┌─────── minuto (0-59)
│ ┌───── hora (0-23)
│ │ ┌─── día del mes (1-31)
│ │ │ ┌─ mes (1-12)
│ │ │ │ ┌ día de la semana (0-7, 0 y 7 = domingo)
│ │ │ │ │
* * * * * comando
```

### Ejemplos
```
*/5 * * * *       /script.sh           # cada 5 minutos
0 */2 * * *       /script.sh           # cada 2 horas en :00
30 2 * * *        /backup.sh           # diario 02:30
0 9 * * 1-5       /aviso.sh            # lunes a viernes 09:00
0 0 1 * *         /mensual.sh          # primer día del mes
0 0 * * 0         /domingo.sh          # cada domingo a medianoche
@reboot           /script.sh           # al arrancar
@hourly           /script.sh           # cada hora
@daily            /script.sh           # diario
@weekly           /script.sh
@monthly          /script.sh
```

### Comandos
```bash
crontab -e                      # editar crontab del usuario actual
crontab -l                      # listar
crontab -r                      # eliminar (¡cuidado!)
sudo crontab -e -u ana          # de otro usuario

# Variables comunes en crontab
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
SHELL=/bin/bash
MAILTO=root@example.com
```

### Crontabs del sistema
```
/etc/crontab                    # crontab principal del sistema
/etc/cron.d/                    # archivos sueltos
/etc/cron.hourly/               # scripts ejecutados cada hora
/etc/cron.daily/                # diarios
/etc/cron.weekly/
/etc/cron.monthly/
```

> **Trampa típica**: cron tiene `PATH` mínimo. Si tu script usa `python3` y funciona en shell, en cron puede fallar. Solución: usar **rutas absolutas** o setear `PATH=` al inicio del crontab.

## anacron — para máquinas que no están encendidas siempre

A diferencia de cron, ejecuta tareas que se hayan perdido cuando la máquina vuelve. Útil en laptops.

`/etc/anacrontab`:
```
1       5       cron.daily      run-parts /etc/cron.daily
7       10      cron.weekly     run-parts /etc/cron.weekly
```

## Logs — diagnóstico

### Logs tradicionales
| Archivo | Contenido |
|---------|-----------|
| `/var/log/syslog` | General (Debian/Ubuntu) |
| `/var/log/messages` | General (RHEL/Fedora) |
| `/var/log/auth.log` | Autenticación (Debian) |
| `/var/log/secure` | Autenticación (RHEL) |
| `/var/log/kern.log` | Kernel |
| `/var/log/dmesg` | Boot del kernel |
| `/var/log/dpkg.log` | Paquetes instalados (Debian) |
| `/var/log/apt/history.log` | Historial de apt |
| `/var/log/yum.log`/`dnf.log` | Idem en RHEL |
| `/var/log/cron` | Logs de cron |
| `/var/log/nginx/`, `/var/log/apache2/` | Servicios |

### `dmesg` — buffer del kernel
```bash
dmesg                                       # ⚠️ en distros modernas requiere sudo
sudo dmesg
sudo dmesg -T                               # con timestamps legibles
sudo dmesg --follow                         # en vivo
sudo dmesg --level=err,warn                 # solo errores y warnings
```

### `journalctl` (recap módulo 10)
```bash
journalctl -xe                              # últimos errores con explicación
journalctl --disk-usage
sudo journalctl --vacuum-time=2weeks
```

## Rotación de logs — `logrotate`

Evita que los logs llenen el disco. Config:

```
/etc/logrotate.conf
/etc/logrotate.d/*              # un archivo por servicio
```

Ejemplo:
```
/var/log/miapp/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 miapp adm
    sharedscripts
    postrotate
        systemctl reload miapp >/dev/null 2>&1 || true
    endscript
}
```

| Directiva | Significado |
|-----------|-------------|
| `daily/weekly/monthly` | Frecuencia |
| `rotate N` | Mantener N versiones |
| `compress` | gzip de los rotados |
| `delaycompress` | No comprimir el más reciente |
| `missingok` | No fallar si no existe |
| `notifempty` | No rotar si está vacío |
| `create MODE OWNER GROUP` | Crear nuevo con esos atributos |
| `postrotate ... endscript` | Comandos después de rotar |

```bash
sudo logrotate -d /etc/logrotate.conf       # debug (no hace nada)
sudo logrotate -f /etc/logrotate.conf       # forzar ahora
```

## Discos y filesystems

### Información
```bash
lsblk                                       # árbol de bloques
lsblk -f                                    # con filesystems
fdisk -l                                    # tabla de particiones (sudo)
parted -l                                   # alternativa moderna
df -h                                       # uso por filesystem
df -i                                       # inodos
du -sh /var/*                               # uso por carpeta
ncdu /                                      # navegador interactivo (instalable)
blkid                                       # UUIDs y tipos
```

### Particionar
```bash
sudo fdisk /dev/sdb                         # interactivo
sudo parted /dev/sdb                         # alternativa
sudo cfdisk /dev/sdb                         # TUI cómoda
```

### Crear filesystem
```bash
sudo mkfs.ext4 /dev/sdb1
sudo mkfs.xfs /dev/sdb1
sudo mkfs.btrfs /dev/sdb1
sudo mkfs.vfat -F32 /dev/sdb1               # FAT32 (USBs)
```

### Montar
```bash
sudo mount /dev/sdb1 /mnt/datos
sudo mount -t ntfs /dev/sdb1 /mnt/datos
sudo umount /mnt/datos
mount | column -t                           # listar montajes activos
findmnt
```

### Persistente — `/etc/fstab`
```
UUID=abc-def-...   /datos   ext4   defaults,nofail   0   2
```

| Campo | Significado |
|-------|-------------|
| 1 | Dispositivo (UUID recomendado) |
| 2 | Punto de montaje |
| 3 | Tipo de FS |
| 4 | Opciones |
| 5 | Dump (0=no) |
| 6 | fsck order (0=no, 1=root, 2=otros) |

```bash
sudo mount -a                               # montar todo lo de fstab
```

> **Cuidado**: una entrada mal en fstab puede dejar el sistema sin arrancar. Probar siempre con `mount -a` antes de reiniciar.

## LVM — Logical Volume Manager

Capa de abstracción sobre discos: permite redimensionar, hacer snapshots, etc.

```
PV (Physical Volume)  → /dev/sdb1
   │
VG (Volume Group)     → grupo de PVs
   │
LV (Logical Volume)   → "partición" lógica
```

```bash
sudo pvcreate /dev/sdb1 /dev/sdc1
sudo vgcreate datos /dev/sdb1 /dev/sdc1
sudo lvcreate -L 10G -n web datos
sudo mkfs.ext4 /dev/datos/web
sudo mount /dev/datos/web /var/www

# Redimensionar
sudo lvextend -L +5G /dev/datos/web
sudo resize2fs /dev/datos/web

# Info
pvs / pvdisplay
vgs / vgdisplay
lvs / lvdisplay
```

## RAID por software — `mdadm`

```bash
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc
sudo mdadm --detail /dev/md0
cat /proc/mdstat
```

## Backups

### `tar` — clásico
```bash
tar -czf backup-$(date +%F).tar.gz /home/ana
tar -xzf backup.tar.gz
tar --exclude='node_modules' -czf code.tar.gz proyecto/
```

### `rsync` — incremental
```bash
rsync -avz --delete /datos/ /backup/datos/
rsync -avz --link-dest=/backup/ayer/ /datos/ /backup/hoy/   # snapshots con hardlinks
```

### `borg` / `restic` — modernos, deduplican y cifran
```bash
borg init --encryption=repokey /backup/borg
borg create /backup/borg::"hostname-{now}" /home /etc
borg list /backup/borg
borg prune --keep-daily=7 --keep-weekly=4 --keep-monthly=6 /backup/borg
```

### Snapshots con btrfs/zfs
```bash
sudo btrfs subvolume snapshot /datos /datos/.snap-$(date +%F)
```

## Monitoreo

### CPU, memoria, I/O
```bash
top, htop, btop                             # interactivo
vmstat 1                                    # virtual memory cada 1s
iostat -x 1                                 # I/O detallado
mpstat -P ALL 1                             # CPU por core
sar -u 1 5                                  # histórico (sysstat)
glances                                     # all-in-one
```

### Red
```bash
iftop                                       # bandwidth por conexión
nload                                       # gráfico simple
nethogs                                     # por proceso
ss -s                                       # stats de sockets
```

### Disco I/O
```bash
iotop                                       # top de I/O por proceso
```

### Métricas con stack moderno
- **Prometheus** (recolección) + **Grafana** (visualización)
- **node_exporter** para métricas de sistema
- **netdata** — instalable, dashboard out-of-the-box

## Mantenimiento de filesystem

```bash
sudo fsck /dev/sdb1                         # check (desmontado)
sudo fsck -y /dev/sdb1                      # auto-fix
sudo tune2fs -l /dev/sdb1                   # info ext
sudo e2fsck -f /dev/sdb1                    # force check ext
```

## Espacio en disco — diagnóstico rápido

```bash
df -h                                        # ¿qué FS está lleno?
du -sh /* 2>/dev/null | sort -h             # qué carpeta de raíz pesa más
sudo du -sh /var/* | sort -h
sudo du -ah /var | sort -h | tail -20       # archivos más grandes
ncdu /                                       # navegador interactivo

# Limpieza rápida
sudo journalctl --vacuum-time=2weeks
sudo apt autoremove && sudo apt clean
docker system prune -a                       # si usás docker
sudo find /var/log -name "*.gz" -mtime +30 -delete
```

## Carga del sistema

```bash
uptime                                       # load average
# load = procesos en run-queue + waiting I/O, promediado
# 1.0 en un sistema de 4 cores = 25% de uso
```

> **Regla**: load > nº de cores **sostenido** = sistema saturado.

## Troubleshooting general — checklist

Cuando algo no anda:

1. `systemctl status servicio` — ¿está corriendo?
2. `journalctl -u servicio -n 100` — ¿hay errores recientes?
3. `dmesg | tail` — ¿el kernel se quejó?
4. `df -h` y `df -i` — ¿hay disco/inodos disponibles?
5. `free -h` — ¿queda RAM?
6. `top` / `htop` — ¿algún proceso está volado?
7. `ss -tlnp` — ¿el puerto está escuchando?
8. `tail -f /var/log/...` del servicio
9. `strace -p PID` — ¿qué está haciendo el proceso?

## Ejercicios

1. Crear un cron que corra un script de backup todos los domingos a las 03:00
2. Configurar logrotate para los logs de un servicio custom
3. Crear, montar y agregar a `/etc/fstab` un volumen LVM de 5GB
4. Encontrar los 10 archivos más grandes en `/var` con `du` y `sort`
5. Investigar la causa de un alto `load average` simulando carga (`stress -c 4`)
