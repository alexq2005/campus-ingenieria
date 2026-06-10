# Módulo 08 — Redes en Linux

## Información de interfaces

### Comando moderno: `ip`
```bash
ip addr                                    # alias: ip a
ip addr show eth0
ip link                                    # interfaces (up/down)
ip route                                   # tabla de ruteo
ip neigh                                   # tabla ARP
ip -s link show eth0                       # estadísticas
```

### Comandos legacy (deprecated pero comunes)
```bash
ifconfig                                   # similar a ip addr
route                                      # similar a ip route
arp -a                                     # similar a ip neigh
netstat -tulnp                             # ahora se prefiere ss
```

> En distros modernas, `ip` y `ss` reemplazan a `ifconfig`, `route`, `netstat`. Aprendé los nuevos.

## Configurar IP

### Manualmente (no persistente)
```bash
sudo ip addr add 192.168.1.50/24 dev eth0
sudo ip link set eth0 up
sudo ip route add default via 192.168.1.1
```

### Persistente
Depende de la distro:

| Distro | Sistema |
|--------|---------|
| Ubuntu desktop | `NetworkManager` (`nmcli`, `nmtui`) |
| Ubuntu server | `netplan` (`/etc/netplan/*.yaml`) |
| Debian | `/etc/network/interfaces` |
| Fedora/RHEL | `NetworkManager` |
| Arch | `systemd-networkd` o `NetworkManager` |

#### Netplan (Ubuntu Server)
```yaml
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: false
      addresses: [192.168.1.50/24]
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [1.1.1.1, 8.8.8.8]
```

```bash
sudo netplan try                           # prueba reversible
sudo netplan apply
```

#### NetworkManager (`nmcli`)
```bash
nmcli device                               # interfaces
nmcli connection show                      # conexiones
nmcli connection up "Mi WiFi"
sudo nmcli device wifi connect "SSID" password "..."
nmtui                                      # TUI interactiva
```

## Diagnóstico de conectividad

```bash
ping 8.8.8.8                               # ICMP
ping -c 4 google.com                       # 4 paquetes
ping6 ::1                                  # IPv6

traceroute google.com                      # ruta de saltos
mtr google.com                             # combina ping + traceroute (interactivo)
```

## DNS

```bash
dig google.com                             # consulta DNS detallada
dig +short google.com
dig MX gmail.com                           # tipo de registro
dig @8.8.8.8 google.com                    # contra servidor específico

nslookup google.com                        # alternativa
host google.com                            # más simple
resolvectl status                          # systemd-resolved
```

### Configuración DNS
- `/etc/resolv.conf` — clásico (en muchas distros, generado, no editar a mano)
- `/etc/systemd/resolved.conf` — systemd-resolved
- `/etc/hosts` — overrides locales

```
# /etc/hosts
127.0.0.1       localhost
192.168.1.10    server-dev
```

## Puertos y conexiones

### `ss` — socket statistics
```bash
ss -tuln                                   # TCP/UDP, listening, numérico
ss -tulnp                                  # con proceso (requiere sudo para todos)
ss -t                                      # solo TCP
ss -t state established                    # conexiones activas
ss -tn dst :443                            # destino puerto 443
```

| Flag | Significado |
|------|-------------|
| `-t` | TCP |
| `-u` | UDP |
| `-l` | listening |
| `-n` | numérico (sin DNS reverse) |
| `-p` | con proceso |
| `-a` | all |
| `-s` | resumen |

### `netstat` (legacy)
```bash
netstat -tulnp                             # equivalente
netstat -an
```

## Transferencia HTTP — `curl` y `wget`

### `curl` — Swiss army knife
```bash
curl https://example.com                   # GET
curl -i URL                                # incluir headers
curl -I URL                                # solo headers (HEAD)
curl -L URL                                # seguir redirects
curl -o salida.html URL                    # guardar
curl -O URL                                # guardar con nombre original
curl -s URL                                # silencioso
curl -X POST -d "user=ana" URL             # POST con datos
curl -H "Authorization: Bearer TOKEN" URL  # header custom
curl -u user:pass URL                      # basic auth
curl -F "file=@local.txt" URL              # upload multipart
curl --resolve dominio:443:1.2.3.4 URL     # forzar resolución
```

### `wget`
```bash
wget URL
wget -c URL                                # continuar descarga interrumpida
wget -r URL                                # recursivo (mirror)
wget -O salida URL
wget --limit-rate=200k URL
```

## SSH — Secure Shell

Conexión remota cifrada. **Herramienta crítica de Linux**.

```bash
ssh user@host
ssh user@host -p 2222                      # puerto custom
ssh user@host comando                      # ejecutar comando remoto
ssh -i ~/.ssh/llave_custom user@host       # con llave específica
ssh -L 8080:localhost:80 user@host         # tunnel local
ssh -R 9090:localhost:3000 user@host       # tunnel remoto
ssh -D 1080 user@host                      # SOCKS proxy
ssh -X user@host                           # X11 forwarding
ssh -A user@host                           # forward agent
ssh -v user@host                           # verbose (debug)
```

### Llaves SSH
```bash
ssh-keygen -t ed25519 -C "mi-comentario"   # generar llave moderna
ssh-keygen -t rsa -b 4096                  # alternativa
ssh-copy-id user@host                       # copiar pública al server
cat ~/.ssh/id_ed25519.pub | ssh user@host "cat >> ~/.ssh/authorized_keys"
```

### Config — `~/.ssh/config`
```
Host servidor
    HostName 192.168.1.100
    User ana
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_servidor
    ServerAliveInterval 60
```

Después: `ssh servidor` (en vez de `ssh -p 2222 -i ... ana@192.168.1.100`).

### Permisos críticos
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_*
chmod 644 ~/.ssh/*.pub
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/config
```

## Transferencia de archivos

### `scp` — sobre SSH
```bash
scp local.txt user@host:/destino/
scp user@host:/origen/archivo.txt .
scp -r carpeta/ user@host:/destino/
scp -P 2222 archivo user@host:.            # puerto custom (P mayúscula!)
```

### `rsync` — sincronización inteligente
```bash
rsync -avz origen/ destino/                # archive, verbose, gzip
rsync -avz origen/ user@host:destino/      # remoto
rsync -avz --delete origen/ destino/       # espejo (borra extras)
rsync -avzP origen user@host:destino       # con barra de progreso
rsync --dry-run -avz src/ dst/             # simular
```

> Diferencia clave: `origen/` (con barra) copia el contenido; `origen` (sin barra) copia la carpeta misma.

### `sftp` — interactivo
```bash
sftp user@host
> ls
> get archivo
> put local.txt
> bye
```

## Firewall — `ufw` (Uncomplicated Firewall)

```bash
sudo ufw status
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow ssh                         # nombre de servicio
sudo ufw allow from 192.168.1.0/24 to any port 22
sudo ufw deny 8080
sudo ufw delete allow 8080
sudo ufw reset
```

Otros frontends: `firewalld` (Fedora/RHEL), `iptables`/`nftables` (bajo nivel).

## `tcpdump` — sniffer

```bash
sudo tcpdump -i eth0
sudo tcpdump -i any port 80
sudo tcpdump -i eth0 host 192.168.1.10
sudo tcpdump -w captura.pcap
sudo tcpdump -r captura.pcap
sudo tcpdump -nn -i eth0 'tcp[tcpflags] & (tcp-syn) != 0'   # SYN packets
```

> Para análisis profundo: `wireshark` (con GUI).

## Otros útiles

```bash
nc -zv host 22                             # netcat: testear puerto
nc -l 9999                                 # escuchar puerto (chat simple)
echo "hola" | nc localhost 9999

iperf3 -s                                  # servidor (medir bandwidth)
iperf3 -c host                             # cliente

speedtest-cli                              # medir velocidad de internet
```

## Ejercicios

1. Encontrar tu IP pública: `curl ifconfig.me`
2. Listar todos los puertos TCP escuchando con `ss -tlnp`
3. Generar un par de llaves SSH ed25519 y copiarlo a una VM
4. Crear `~/.ssh/config` con un alias para una conexión SSH
5. Hacer un `rsync` con `--dry-run` para sincronizar dos directorios
