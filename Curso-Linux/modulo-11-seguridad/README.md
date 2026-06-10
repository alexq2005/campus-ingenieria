# Módulo 11 — Seguridad

## Modelo de amenazas

Un servidor Linux típico enfrenta:
- **Acceso no autorizado** (SSH brute force, exploits)
- **Escalación de privilegios** (de usuario común a root)
- **Persistencia** (rootkits, cron jobs maliciosos)
- **Exfiltración** (robar datos)
- **Disrupción** (DDoS, fork bombs, llenar disco)

El **principio de mínimo privilegio** es la guía central: cada componente solo debe tener los permisos estrictamente necesarios.

## Hardening de SSH

`/etc/ssh/sshd_config`:
```
Port 22                                    # cambiar a uno alto reduce ruido (no es seguridad real)
PermitRootLogin no                         # ⭐ obligatorio
PasswordAuthentication no                  # ⭐ solo llaves
PubkeyAuthentication yes
PermitEmptyPasswords no
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers ana luis                        # whitelist de usuarios
AllowGroups ssh-users                      # o por grupo
X11Forwarding no
```

Aplicar:
```bash
sudo sshd -t                               # validar sintaxis
sudo systemctl reload sshd
```

> **Nunca** cierres tu sesión actual hasta haber probado que la config funciona desde otra terminal.

### Llaves modernas
```bash
ssh-keygen -t ed25519                      # ⭐ recomendado 2025
ssh-keygen -t rsa -b 4096                  # alternativa
```

## Firewall

### `ufw` (Uncomplicated Firewall, Debian/Ubuntu)
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow from 192.168.1.0/24
sudo ufw limit ssh                         # limita conexiones repetidas
sudo ufw enable
sudo ufw status verbose
```

### `firewalld` (RHEL/Fedora)
```bash
sudo firewall-cmd --state
sudo firewall-cmd --get-zones
sudo firewall-cmd --zone=public --add-service=https --permanent
sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

### `nftables` (bajo nivel, reemplazo de iptables)
```bash
sudo nft list ruleset
sudo nft -f /etc/nftables.conf
```

## fail2ban — protección contra brute force

Lee logs de SSH/web/etc. y banea IPs que fallan demasiado.

```bash
sudo apt install fail2ban
sudo systemctl enable --now fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd
sudo fail2ban-client unban 1.2.3.4
```

Config: `/etc/fail2ban/jail.local`:
```ini
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = 22
```

## SELinux — Mandatory Access Control (RHEL/Fedora)

Va más allá de los permisos UGO: el kernel impone reglas adicionales por **contexto** (tipo, rol, dominio).

```bash
getenforce                                 # Enforcing / Permissive / Disabled
sudo setenforce 0                          # cambiar a permisivo (temporal)
sudo setenforce 1                          # enforcing
sestatus
```

### Contextos
```bash
ls -Z archivo                              # ver contexto
ps -Z                                      # contextos de procesos
sudo restorecon -Rv /var/www/html          # restaurar contextos default
sudo chcon -t httpd_sys_content_t /var/www/algo
```

### Booleans (toggles)
```bash
getsebool -a | grep httpd
sudo setsebool -P httpd_can_network_connect 1
```

### Logs
```bash
sudo ausearch -m avc -ts recent
sudo sealert -a /var/log/audit/audit.log
```

## AppArmor (Debian/Ubuntu/SUSE)

Alternativa a SELinux, perfiles por aplicación.

```bash
sudo aa-status
sudo aa-enforce /etc/apparmor.d/usr.bin.firefox
sudo aa-complain /etc/apparmor.d/...        # log-only
sudo aa-disable /etc/apparmor.d/...
```

## Auditoría — `auditd`

Log de eventos del kernel: accesos a archivos, syscalls, ejecuciones.

```bash
sudo auditctl -l                            # reglas activas
sudo auditctl -w /etc/passwd -p wa -k passwd_changes
sudo ausearch -k passwd_changes
sudo aureport
```

## Actualizaciones

### Automáticas (Debian/Ubuntu)
```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

Edición fina: `/etc/apt/apt.conf.d/50unattended-upgrades`.

### RHEL/Fedora
```bash
sudo dnf install dnf-automatic
sudo systemctl enable --now dnf-automatic.timer
```

## Detección de rootkits

```bash
sudo apt install rkhunter chkrootkit
sudo rkhunter --update
sudo rkhunter --check
sudo chkrootkit
```

## Integridad de archivos — AIDE

Toma "huellas dactilares" de archivos críticos y detecta cambios.

```bash
sudo apt install aide
sudo aideinit
sudo aide --check
```

## Contraseñas seguras

### Política con PAM
`/etc/security/pwquality.conf`:
```
minlen = 12
dcredit = -1                    # al menos 1 dígito
ucredit = -1                    # al menos 1 mayúscula
lcredit = -1                    # al menos 1 minúscula
ocredit = -1                    # al menos 1 especial
maxrepeat = 3
```

### Caducidad
```bash
sudo chage -M 90 -W 7 ana       # max 90 días, advertir 7 antes
chage -l ana
```

## Permisos restrictivos por defecto

```bash
# /etc/login.defs
UMASK 027                       # archivos nuevos: 640, dirs: 750
```

Para servicios sensibles:
```bash
chmod 600 /etc/ssl/private/*.key
chmod 700 /home/ana/.ssh
```

## TLS / HTTPS

### Certificados con Let's Encrypt (`certbot`)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ejemplo.com -d www.ejemplo.com
sudo certbot renew --dry-run                # auto-renovación
```

Los certificados se renuevan automáticamente vía timer.

## Cifrado de disco

### LUKS (full disk encryption)
```bash
sudo cryptsetup luksFormat /dev/sdX
sudo cryptsetup open /dev/sdX volumen_cifrado
sudo mkfs.ext4 /dev/mapper/volumen_cifrado
sudo mount /dev/mapper/volumen_cifrado /mnt
sudo cryptsetup close volumen_cifrado
```

### Cifrado por archivo
```bash
gpg -c archivo.txt              # simétrico (passphrase)
gpg archivo.txt.gpg             # descifrar

gpg -e -r email archivo         # asimétrico
gpg -d archivo.gpg
```

## Hashes y verificación

```bash
md5sum archivo                  # md5 (débil, no usar para seguridad)
sha256sum archivo
sha512sum archivo

echo "abc" | sha256sum
sha256sum -c hashes.txt         # verificar
```

## Generar contraseñas

```bash
openssl rand -base64 24
pwgen -s 20 1
head -c 32 /dev/urandom | base64
```

## Logs de seguridad

| Archivo | Contenido |
|---------|-----------|
| `/var/log/auth.log` (Debian) | Logins, sudo, SSH |
| `/var/log/secure` (RHEL) | Idem |
| `/var/log/syslog` | General |
| `/var/log/journal/` | systemd-journal binario |
| `/var/log/audit/audit.log` | auditd |

```bash
last                            # últimos logins
lastb                           # logins fallidos (sudo)
sudo grep "Failed password" /var/log/auth.log | tail
sudo journalctl -u sshd
```

## Buenas prácticas — checklist

- [ ] No login de root vía SSH
- [ ] Solo llaves SSH (no contraseñas)
- [ ] Firewall denegando todo lo no necesario
- [ ] fail2ban activo en sshd
- [ ] Actualizaciones automáticas habilitadas
- [ ] umask >= 027
- [ ] Llaves SSH con permisos 600
- [ ] sudo en lugar de su -
- [ ] Logs persistentes y monitoreados
- [ ] Backups regulares y verificados
- [ ] HTTPS en todos los servicios web
- [ ] Sin servicios escuchando 0.0.0.0 si no hace falta
- [ ] Usuarios sin shell para servicios (`/usr/sbin/nologin`)

## Ejercicios

1. Endurecer la config de SSH y verificar que aún podés conectarte
2. Configurar `ufw` con whitelist de puertos esenciales
3. Instalar fail2ban y simular logins fallidos para ver el ban
4. Generar un certificado con certbot para un dominio (puede ser local con `--standalone`)
5. Crear un script que use `sha256sum -c` para verificar integridad de un set de archivos
