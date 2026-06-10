# Módulo 13 — Proyectos Integradores

Tres proyectos prácticos que combinan los módulos anteriores. Cada uno simula un escenario real de sysadmin/devops.

## Proyecto 1 — Servidor Web seguro con Nginx

**Objetivo**: levantar un servidor Nginx en una VM Ubuntu, con HTTPS, firewall, fail2ban y backups automatizados.

### Pasos

1. **Preparar el sistema**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y nginx ufw fail2ban certbot python3-certbot-nginx
   ```

2. **Crear usuario de servicio sin shell**
   ```bash
   sudo useradd --system --no-create-home --shell /usr/sbin/nologin webadmin
   ```

3. **Configurar firewall**
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

4. **Hardening de SSH** (`/etc/ssh/sshd_config`):
   ```
   PermitRootLogin no
   PasswordAuthentication no
   PubkeyAuthentication yes
   ```

5. **Sitio web básico** (`/etc/nginx/sites-available/midominio`):
   ```nginx
   server {
       listen 80;
       server_name midominio.com www.midominio.com;
       root /var/www/midominio;
       index index.html;
       location / { try_files $uri $uri/ =404; }
   }
   ```
   ```bash
   sudo ln -s /etc/nginx/sites-available/midominio /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

6. **HTTPS con Let's Encrypt**
   ```bash
   sudo certbot --nginx -d midominio.com -d www.midominio.com
   ```

7. **fail2ban para SSH y Nginx**
   ```bash
   sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
   # Habilitar [sshd] y [nginx-http-auth]
   sudo systemctl enable --now fail2ban
   ```

8. **Backups con timer systemd**
   - `/usr/local/bin/backup-www.sh` (script de tar)
   - `/etc/systemd/system/backup-www.service` y `.timer`

### Conceptos aplicados
- Módulos 04 (permisos), 06 (usuarios), 08 (redes/SSH)
- Módulo 10 (systemd timers)
- Módulo 11 (seguridad, TLS, firewall, fail2ban)
- Módulo 12 (backup, logrotate)

---

## Proyecto 2 — Herramienta CLI de administración

**Objetivo**: script bash que reúne información del sistema en un reporte: usuarios, servicios, disco, red, top procesos.

### Requisitos
- Output legible (con headers de sección)
- Opciones `--all`, `--quick`, `--save FILE`
- Salida también disponible como JSON con `--json`
- Códigos de exit correctos
- Compatible con bash 4+ y `set -euo pipefail`

### Esqueleto
Ver `scripts/sys-report.sh` por una implementación de referencia.

### Conceptos aplicados
- Módulo 05 (procesos: ps, top)
- Módulo 09 (bash scripting completo)
- Módulo 12 (df, dmesg, journalctl)

---

## Proyecto 3 — Despliegue de una app Python

**Objetivo**: tomar una app Python (Flask/FastAPI) y desplegarla como un servicio systemd con reverse proxy Nginx, logs centralizados, y restart automático.

### Pasos

1. **Crear usuario dedicado**
   ```bash
   sudo useradd --system --create-home --home-dir /opt/miapp --shell /usr/sbin/nologin miapp
   ```

2. **Estructura de la app**
   ```
   /opt/miapp/
   ├── .venv/
   ├── app.py
   └── requirements.txt
   ```

3. **Instalar deps en venv**
   ```bash
   sudo -u miapp python3 -m venv /opt/miapp/.venv
   sudo -u miapp /opt/miapp/.venv/bin/pip install fastapi uvicorn
   ```

4. **Service unit** (`/etc/systemd/system/miapp.service`):
   ```ini
   [Unit]
   Description=Mi App FastAPI
   After=network.target

   [Service]
   Type=simple
   User=miapp
   Group=miapp
   WorkingDirectory=/opt/miapp
   ExecStart=/opt/miapp/.venv/bin/uvicorn app:app --host 127.0.0.1 --port 8000
   Restart=on-failure
   RestartSec=5s
   StandardOutput=journal
   StandardError=journal
   NoNewPrivileges=true
   ProtectSystem=strict
   ProtectHome=true
   PrivateTmp=true
   ReadWritePaths=/opt/miapp/data

   [Install]
   WantedBy=multi-user.target
   ```

5. **Habilitar y verificar**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now miapp
   sudo systemctl status miapp
   journalctl -u miapp -f
   ```

6. **Reverse proxy con Nginx** (`/etc/nginx/sites-available/miapp`):
   ```nginx
   server {
       listen 80;
       server_name miapp.example.com;
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

7. **HTTPS**
   ```bash
   sudo certbot --nginx -d miapp.example.com
   ```

8. **Verificación**
   - Tirar el proceso a propósito (`sudo systemctl kill miapp`) y confirmar que `Restart=on-failure` lo levanta
   - Ver logs: `journalctl -u miapp --since "5 min ago"`
   - `ss -tlnp | grep 8000` para verificar que escucha en localhost

### Conceptos aplicados
- Todo el curso

---

## Próximos pasos — caminos de especialización

| Camino | Tecnologías |
|--------|------------|
| **DevOps** | Docker, Kubernetes, Terraform, Ansible, CI/CD (GitLab, GitHub Actions) |
| **SRE** | Prometheus, Grafana, ELK, OpenTelemetry, SLOs |
| **Cloud** | AWS, GCP, Azure — sus consolas + CLIs |
| **Seguridad** | OSCP, SELinux profundo, threat hunting, hardening avanzado |
| **Networking** | BGP, VPN, MPLS, IPv6 a fondo |
| **Storage** | Ceph, ZFS, NAS/SAN, distributed FS |
| **Kernel** | Driver development, eBPF, performance tuning |

## Recursos recomendados

- **Libro**: *The Linux Command Line* — William Shotts (gratis online)
- **Libro**: *How Linux Works* — Brian Ward
- **Libro**: *UNIX and Linux System Administration Handbook* — Nemeth et al.
- **Web**: [Arch Wiki](https://wiki.archlinux.org/) — referencia técnica de calidad
- **Web**: [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- **Práctica**: [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) — wargames CLI
- **Práctica**: [Linux Journey](https://linuxjourney.com/)
- **Certificación**: LFCS (Linux Foundation), RHCSA (Red Hat), LPIC

## Filosofía final

> "Sé conservador en lo que hacés, liberal en lo que aceptás de los demás." — Postel's Law
> 
> "La administración de sistemas es 90% prevenir desastres y 10% recuperarse de los que ocurrieron igual."

Tres principios para llevarte:

1. **Backups**: si no probaste restaurarlo, no tenés backup
2. **Reproducibilidad**: si no podés re-armarlo en una hora desde cero, sos rehén de tu servidor
3. **Documentación**: tu yo del futuro va a olvidar todo. Escribí runbooks para cada cosa rara
