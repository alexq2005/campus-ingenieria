# Módulo 07 — Gestión de Paquetes

## Concepto

Un **paquete** es una unidad instalable: binarios + librerías + config + metadata + dependencias. El **gestor de paquetes** maneja:

- Instalación, actualización, eliminación
- Resolución de dependencias
- Verificación de integridad
- Repositorios (fuentes de paquetes)

Cada familia de distros tiene el suyo:

| Familia | Formato | Gestor de bajo nivel | Gestor de alto nivel |
|---------|---------|---------------------|---------------------|
| Debian/Ubuntu | `.deb` | `dpkg` | `apt`, `apt-get` |
| RHEL/Fedora | `.rpm` | `rpm` | `dnf` (antes `yum`) |
| Arch | tarball + PKGBUILD | `pacman` | `pacman` |
| openSUSE | `.rpm` | `rpm` | `zypper` |
| Alpine | `.apk` | `apk` | `apk` |

## APT (Debian / Ubuntu)

### Comandos esenciales
```bash
sudo apt update                            # refresca lista de paquetes
sudo apt upgrade                           # actualiza instalados
sudo apt full-upgrade                      # con cambios estructurales
sudo apt dist-upgrade                      # legacy, similar a full-upgrade

sudo apt install paquete
sudo apt install paquete1 paquete2
sudo apt install ./local.deb               # archivo local (resuelve deps)

sudo apt remove paquete                    # mantiene config
sudo apt purge paquete                     # elimina también config
sudo apt autoremove                        # quita deps huérfanas

apt search palabra                         # buscar
apt show paquete                           # info detallada
apt list --installed
apt list --upgradable
apt-cache depends paquete                  # dependencias
apt-cache rdepends paquete                 # quién depende de él
```

### `apt` vs `apt-get`
- `apt` — interfaz moderna y amigable, recomendado para uso interactivo
- `apt-get` — más estable para scripts (output parseable)

### Repositorios
```
/etc/apt/sources.list                      # principal
/etc/apt/sources.list.d/*.list             # adicionales
```

Agregar repositorio:
```bash
sudo add-apt-repository ppa:user/ppa-name
sudo apt update
```

### `dpkg` — bajo nivel
```bash
sudo dpkg -i paquete.deb                  # instalar (NO resuelve deps)
sudo dpkg -r paquete                      # remove
sudo dpkg -P paquete                      # purge
dpkg -l                                   # listar instalados
dpkg -L paquete                           # archivos del paquete
dpkg -S /ruta/archivo                     # ¿qué paquete instaló esto?
dpkg --configure -a                       # reconfigurar paquetes rotos
```

## DNF (Fedora / RHEL / Rocky)

```bash
sudo dnf check-update
sudo dnf upgrade
sudo dnf install paquete
sudo dnf remove paquete
sudo dnf autoremove
sudo dnf clean all

dnf search palabra
dnf info paquete
dnf list installed
dnf provides /ruta                         # qué paquete trae este archivo
dnf history                                # historial (rollback posible!)
sudo dnf history undo 12                   # rollback
sudo dnf groupinstall "Development Tools"
```

### Repos (`.repo` files en `/etc/yum.repos.d/`)
```bash
sudo dnf config-manager --add-repo URL
sudo dnf config-manager --enable repo-name
```

## Pacman (Arch)

```bash
sudo pacman -Syu                           # update + upgrade (rolling)
sudo pacman -S paquete                     # install
sudo pacman -R paquete                     # remove
sudo pacman -Rs paquete                    # remove con deps no usadas
sudo pacman -Rns paquete                   # también borra config
sudo pacman -Ss palabra                    # buscar en repos
sudo pacman -Qs palabra                    # buscar en instalados
pacman -Qi paquete                         # info
pacman -Ql paquete                         # archivos
pacman -Qo /ruta                           # qué paquete trae el archivo
sudo pacman -Sc                            # limpiar cache viejo
sudo pacman -Scc                           # limpiar todo el cache
```

### AUR — Arch User Repository
Paquetes mantenidos por la comunidad. Helpers:
```bash
yay -S paquete-aur
paru -S paquete-aur
```

## Zypper (openSUSE)

```bash
sudo zypper refresh
sudo zypper update
sudo zypper install paquete
sudo zypper remove paquete
sudo zypper search palabra
sudo zypper info paquete
```

## APK (Alpine)

```bash
sudo apk update
sudo apk upgrade
sudo apk add paquete
sudo apk del paquete
apk search palabra
apk info paquete
```

## Snap (universal)

Paquetes containerizados, distros-agnósticos. Auto-actualizan.

```bash
sudo snap install paquete
sudo snap install --classic codigo         # acceso completo al sistema
sudo snap remove paquete
snap list
snap find palabra
sudo snap refresh
```

## Flatpak (universal, popular en desktop)

```bash
flatpak install flathub org.gimp.GIMP
flatpak run org.gimp.GIMP
flatpak update
flatpak list
flatpak remove org.gimp.GIMP
```

Setup inicial:
```bash
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

## AppImage

Ejecutables portables, no requieren instalación:
```bash
chmod +x app.AppImage
./app.AppImage
```

## Compilar desde fuente

Cuando un paquete no está disponible o querés una versión específica:

```bash
wget https://ejemplo.com/programa-1.0.tar.gz
tar xzf programa-1.0.tar.gz
cd programa-1.0/
./configure --prefix=/usr/local
make -j$(nproc)
sudo make install
```

> **Riesgo**: `make install` no es trackeado por el gestor de paquetes. Considera `checkinstall` (Debian) o crear un paquete propio.

## Lenguajes de programación — gestores propios

Tienen su ecosistema separado del sistema:

| Lenguaje | Gestor | Notas |
|----------|--------|-------|
| Python | `pip`, `pipx`, `uv`, `poetry` | Usá venv siempre |
| Node | `npm`, `yarn`, `pnpm` | `package.json` |
| Ruby | `gem`, `bundler` | `Gemfile` |
| Rust | `cargo` | `Cargo.toml` |
| Go | `go mod` | `go.mod` |
| Java | `maven`, `gradle` | |

> **Regla**: instalar dependencias de proyecto **siempre dentro del proyecto** (venv, node_modules, etc.), nunca globalmente.

## Buenas prácticas

1. **`apt update` antes de instalar** — siempre
2. **Leer qué se va a instalar** antes de aceptar — `apt` lo muestra
3. **No mezclar fuentes**: usar repos oficiales > PPAs > snap/flatpak > compilar
4. **Limpiar cache periódicamente**: `apt autoremove && apt clean`
5. **Hacer backup del listado**: `dpkg --get-selections > paquetes.txt` antes de cambios mayores

## Ejercicios

1. Instalar `htop` y `ncdu` en tu distro
2. Buscar qué paquete provee el comando `gcc`
3. Listar las 10 dependencias del paquete `python3`
4. Hacer una actualización completa del sistema
5. Buscar archivos huérfanos: `apt autoremove --dry-run` o equivalente
