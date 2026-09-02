# Módulo 06 — Usuarios y Grupos

## Modelo

Linux es **multiusuario**. Cada usuario tiene:
- **Username** y **UID** (User ID)
- Uno o más **grupos** (cada uno con **GID**)
- Un **home** y un **shell** asignados
- Una contraseña hasheada

Convención de UIDs:
| Rango | Uso |
|-------|-----|
| `0` | root |
| `1-999` | Usuarios de sistema (servicios, daemons) |
| `1000+` | Usuarios humanos |

## Archivos clave

### `/etc/passwd`
Una línea por usuario. **Lectura pública** (no contiene contraseñas reales):
```
ana:x:1000:1000:Ana Pérez,,,:/home/ana:/bin/bash
│   │ │    │    │           │         │
│   │ │    │    │           │         shell
│   │ │    │    │           home
│   │ │    │    GECOS (info)
│   │ │    GID primario
│   │ UID
│   x = ver /etc/shadow
username
```

### `/etc/shadow`
Contraseñas hasheadas. **Solo root** puede leer:
```
ana:$6$abc...:19000:0:99999:7:::
│   │         │     │ │     │
│   hash      │     │ │     warn antes de expirar
│   (formato $algo$salt$hash)
│             │     │ vida máxima
│             │     min antes de poder cambiar
│             días desde 1970 del último cambio
username
```

Algoritmos de hash (`$id$`):
- `$1$` MD5 (inseguro)
- `$5$` SHA-256
- `$6$` SHA-512 (default moderno)
- `$y$` yescrypt (más nuevo)

### `/etc/group`
```
devs:x:1001:ana,luis,eva
│    │ │    │
│    │ │    miembros (separados por coma)
│    │ GID
│    x (no usado típicamente)
nombre del grupo
```

### `/etc/gshadow`
Contraseñas de grupos (raras de usar).

## Crear y eliminar usuarios

```bash
sudo useradd ana                          # mínimo (no crea home)
sudo useradd -m ana                       # con home
sudo useradd -m -s /bin/bash ana          # especificar shell
sudo useradd -m -G devs,docker ana        # con grupos suplementarios
sudo passwd ana                           # asignar contraseña

sudo adduser ana                          # ⭐ wrapper interactivo (Debian/Ubuntu)
```

`adduser` es más amigable: pregunta nombre, contraseña, etc. y crea home con skeleton (`/etc/skel`).

### Eliminar
```bash
sudo userdel ana                          # eliminar usuario
sudo userdel -r ana                       # también borrar home y mail
sudo deluser --remove-home ana            # Debian/Ubuntu
```

## Modificar usuarios

```bash
sudo usermod -aG docker ana               # AGREGAR a grupo (cuidado con -a)
sudo usermod -G devs,docker ana           # ⚠️ REEMPLAZA grupos suplementarios
sudo usermod -L ana                       # bloquear contraseña
sudo usermod -U ana                       # desbloquear
sudo usermod -s /bin/zsh ana              # cambiar shell
sudo usermod -d /nuevo/home -m ana        # mover home
sudo usermod -e 2025-12-31 ana            # fecha de expiración
sudo chage -l ana                         # ver info de aging
```

> **Trampa típica**: `usermod -G grupo ana` sin `-a` te BORRA todos los grupos suplementarios anteriores. Usá siempre `-aG` cuando agregás.

## Cambiar contraseña

```bash
passwd                                     # tu propia (interactivo)
sudo passwd ana                            # de otro usuario
sudo passwd -l ana                         # bloquear
sudo passwd -u ana                         # desbloquear
sudo passwd -e ana                         # forzar cambio en próximo login
```

## Grupos

```bash
sudo groupadd devs
sudo groupadd -g 1500 devs                # con GID específico
sudo groupdel devs
sudo groupmod -n nuevos viejos            # renombrar

groups                                     # tus grupos
groups ana                                 # los de ana
id                                         # tu UID, GID y grupos
id ana                                     # los de ana
```

### Cambiar grupo de archivos
```bash
sudo chgrp devs archivo
newgrp devs                                # cambiar GID activo en la sesión
```

## El comando `su` — Switch User

```bash
su                                         # convertirse en root (pide contraseña)
su -                                       # como root con su entorno completo
su ana                                     # convertirse en ana
su - ana                                   # ana con su entorno
exit                                       # volver
```

## El comando `sudo`

Permite ejecutar comandos como otro usuario (usualmente root) **sin compartir contraseña**.

```bash
sudo comando
sudo -i                                    # shell interactivo de root
sudo -u ana comando                        # como ana
sudo -l                                    # qué puedo hacer con sudo
sudo !!                                    # repetir el último con sudo
```

### Configuración — `/etc/sudoers`

**Editar SIEMPRE con `visudo`** (valida sintaxis antes de guardar):
```bash
sudo visudo
```

Sintaxis:
```
# usuario   host=(usuarios)   comandos
root        ALL=(ALL:ALL) ALL
%sudo       ALL=(ALL:ALL) ALL              # %grupo
ana         ALL=(ALL) NOPASSWD: /usr/bin/systemctl
```

Archivos modulares en `/etc/sudoers.d/`:
```bash
sudo visudo -f /etc/sudoers.d/ana-deploys
```

> El archivo debe terminar sin extensión y permisos `0440`.

### Logs de sudo
Cada `sudo` se loguea en `/var/log/auth.log` (Debian) o `/var/log/secure` (RHEL).

## Sesiones activas — `who` y `w`

```bash
who                                        # quiénes están logueados
w                                          # más detalle (carga, idle, comando)
last                                       # historial de logins
last -F | head                             # con fechas completas
lastb                                      # logins fallidos (root)
finger ana                                 # info detallada (instalable)
whoami                                     # tu username
logname                                    # username del login original
```

## Skeleton de home — `/etc/skel`

Cuando se crea un usuario con `useradd -m`, se copia el contenido de `/etc/skel/` a su home. Es el lugar para configurar defaults globales (`.bashrc`, `.profile`, etc.).

## Cuotas de disco

```bash
# Habilitar en /etc/fstab: añadir usrquota,grpquota
sudo quotacheck -avug
sudo quotaon -av
sudo edquota -u ana                        # editar cuotas
quota -u ana                               # ver
```

## Buenas prácticas

1. **Nunca compartir cuentas**. Cada humano = un usuario
2. **Deshabilitar root login por SSH**: `PermitRootLogin no` en `/etc/ssh/sshd_config`
3. **Usar `sudo`**, no `su -`, para auditoría
4. **Política de contraseñas**: instalar `libpam-pwquality` y configurar `/etc/security/pwquality.conf`
5. **Bloquear cuentas inactivas**: `chage -E` para expiración

## Ejercicios

1. Crear usuario `desarrollador` con home, shell `/bin/bash`, en grupo `devs`
2. Verificar su entrada en `/etc/passwd` y `/etc/shadow`
3. Forzar que cambie la contraseña en el próximo login
4. Configurar sudo sin contraseña para un comando específico (ej: `systemctl restart nginx`)
5. Ver los últimos 10 logins con `last` y los fallidos con `lastb`
