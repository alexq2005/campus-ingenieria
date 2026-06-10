# Módulo 10 — systemd

## ¿Qué es systemd?

`systemd` es el **sistema de inicio (init) y manager de servicios** moderno en Linux. Reemplazó a SysVinit/Upstart en casi todas las distros mayores.

Responsable de:
- Arrancar el sistema (PID 1)
- Lanzar y supervisar servicios (daemons)
- Gestionar logs (`journald`)
- Tareas programadas (`timers`, alternativa a cron)
- Mountpoints, sockets, devices, etc.

## `systemctl` — comando principal

### Estado y control de servicios
```bash
systemctl status nginx                     # estado actual
sudo systemctl start nginx                 # iniciar
sudo systemctl stop nginx                  # detener
sudo systemctl restart nginx               # reiniciar
sudo systemctl reload nginx                # recargar config sin reiniciar
sudo systemctl reload-or-restart nginx     # reload si soporta, si no restart

sudo systemctl enable nginx                # habilitar al arranque
sudo systemctl disable nginx               # deshabilitar
sudo systemctl enable --now nginx          # habilitar y arrancar a la vez
sudo systemctl mask nginx                  # bloquea (no se puede arrancar)
sudo systemctl unmask nginx                # desbloquea

systemctl is-active nginx
systemctl is-enabled nginx
systemctl is-failed nginx
```

### Listar
```bash
systemctl                                  # todas las units cargadas
systemctl list-units --type=service        # solo servicios
systemctl list-units --state=failed        # los que fallaron
systemctl list-unit-files                  # todas (instaladas)
systemctl list-unit-files --state=enabled
```

## Tipos de unit

| Tipo | Extensión | Para qué |
|------|-----------|----------|
| `service` | `.service` | Daemon/proceso |
| `socket` | `.socket` | Activación bajo demanda por socket |
| `timer` | `.timer` | Tareas programadas |
| `target` | `.target` | Grupo de units (similar a runlevel) |
| `mount` | `.mount` | Punto de montaje |
| `path` | `.path` | Activación al cambiar archivos |
| `slice` | `.slice` | Grupo de cgroups |
| `device` | `.device` | Hardware |

## Anatomía de un `.service`

```ini
[Unit]
Description=Mi App
After=network.target
Requires=postgresql.service

[Service]
Type=simple
User=appuser
Group=appgroup
WorkingDirectory=/opt/miapp
Environment="ENV=production"
EnvironmentFile=/etc/miapp/env
ExecStart=/usr/bin/python3 /opt/miapp/main.py
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
RestartSec=5s
StandardOutput=journal
StandardError=journal

# Hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
ReadWritePaths=/var/lib/miapp

[Install]
WantedBy=multi-user.target
```

### Secciones
| Sección | Para qué |
|---------|----------|
| `[Unit]` | Metadata, dependencias |
| `[Service]` | Cómo correr (solo `.service`) |
| `[Install]` | Cómo se instala con `enable` |

### Tipos de servicio (`Type=`)
| Tipo | Comportamiento |
|------|----------------|
| `simple` | Default — el proceso es el servicio |
| `forking` | Proceso clásico que se daemoniza (forks) |
| `oneshot` | Ejecuta y termina (con `RemainAfterExit=yes` queda "active") |
| `notify` | El servicio notifica via `sd_notify()` |
| `idle` | Espera hasta que otros jobs terminen |

### Restart policies
| Valor | Cuándo reiniciar |
|-------|-----------------|
| `no` | Nunca |
| `on-success` | Si exit 0 |
| `on-failure` | Si exit != 0 o señal |
| `on-abnormal` | Solo señales o timeout |
| `always` | Siempre |

## Crear un servicio

```bash
sudo nano /etc/systemd/system/miapp.service
sudo systemctl daemon-reload                # leer cambios
sudo systemctl enable --now miapp
sudo systemctl status miapp
```

Para servicios de usuario (sin sudo):
```bash
mkdir -p ~/.config/systemd/user/
nano ~/.config/systemd/user/miapp.service
systemctl --user daemon-reload
systemctl --user enable --now miapp
```

## Targets (similar a runlevels)

| Target | Equivalente SysV | Descripción |
|--------|------------------|-------------|
| `poweroff.target` | 0 | Apagar |
| `rescue.target` | 1 | Single-user |
| `multi-user.target` | 3 | Multiusuario sin GUI |
| `graphical.target` | 5 | Multiusuario con GUI |
| `reboot.target` | 6 | Reiniciar |

```bash
systemctl get-default                      # target default
sudo systemctl set-default multi-user.target
sudo systemctl isolate rescue.target       # cambiar al vuelo (peligroso)
```

## journald — el log del sistema

`journalctl` consulta los logs centralizados:

```bash
journalctl                                 # todos los logs
journalctl -u nginx                        # de un servicio
journalctl -u nginx -f                     # follow (tail -f)
journalctl -u nginx --since "1 hour ago"
journalctl -u nginx --since today
journalctl -u nginx --since "2024-03-15 10:00" --until "2024-03-15 12:00"
journalctl -p err                          # priority error o más grave
journalctl -p err -p warning
journalctl -k                              # solo kernel (dmesg)
journalctl -b                              # boot actual
journalctl -b -1                           # boot anterior
journalctl --list-boots
journalctl _PID=1234                       # de un proceso
journalctl --disk-usage
journalctl --vacuum-time=2weeks            # limpiar viejos
journalctl --vacuum-size=500M
```

### Niveles de prioridad
| Num | Nombre | Uso |
|-----|--------|-----|
| 0 | emerg | Sistema inservible |
| 1 | alert | Acción inmediata |
| 2 | crit | Crítico |
| 3 | err | Error |
| 4 | warning | Advertencia |
| 5 | notice | Normal pero significativo |
| 6 | info | Informativo |
| 7 | debug | Debug |

### Configuración persistente
```ini
# /etc/systemd/journald.conf
[Journal]
Storage=persistent
SystemMaxUse=2G
MaxRetentionSec=1month
```

```bash
sudo systemctl restart systemd-journald
```

## Timers — alternativa moderna a cron

### Definición
```ini
# /etc/systemd/system/backup.timer
[Unit]
Description=Backup diario

[Timer]
OnCalendar=daily
OnCalendar=*-*-* 02:30:00      # alternativa: cron-style
Persistent=true                 # ejecuta si se perdió la última corrida
RandomizedDelaySec=10min

[Install]
WantedBy=timers.target
```

```ini
# /etc/systemd/system/backup.service
[Unit]
Description=Backup ejecutable

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

```bash
sudo systemctl enable --now backup.timer
systemctl list-timers                      # ver próximas ejecuciones
```

### Sintaxis `OnCalendar`
| Expresión | Cuándo |
|-----------|--------|
| `hourly` | Cada hora en `:00` |
| `daily` | Cada día a `00:00` |
| `weekly` | Lunes `00:00` |
| `monthly` | Día 1 `00:00` |
| `*-*-* 02:30:00` | Diario 02:30 |
| `Mon..Fri 09:00` | Lunes a viernes 09:00 |
| `*:0/15` | Cada 15 minutos |

Validar:
```bash
systemd-analyze calendar "Mon..Fri 09:00"
```

## Otros comandos útiles

```bash
systemctl reboot                           # reiniciar
systemctl poweroff                         # apagar
systemctl suspend                          # suspender
systemctl hibernate                        # hibernar

systemd-analyze                            # tiempo de boot
systemd-analyze blame                      # qué tardó más
systemd-analyze plot > boot.svg            # gráfico de boot
systemd-analyze critical-chain

systemctl edit miapp                       # crear override sin tocar el original
systemctl cat miapp                        # ver el archivo final efectivo
systemctl show miapp                       # propiedades calculadas

systemd-cgtop                              # top de cgroups
```

## Ejercicios

1. Crear un `.service` que corra un script Python en arranque
2. Ver el tiempo de boot con `systemd-analyze blame`
3. Convertir una entrada de cron a un timer `.timer`
4. Configurar el journal para que persista al reiniciar
5. Crear un servicio de usuario que corra una aplicación sin sudo
