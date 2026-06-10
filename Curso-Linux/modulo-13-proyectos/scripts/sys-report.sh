#!/usr/bin/env bash
# sys-report.sh — Reporte rápido del sistema
# Proyecto 2 del curso de Linux.
#
# Uso:
#   ./sys-report.sh                 # reporte estándar
#   ./sys-report.sh --quick         # solo lo crítico
#   ./sys-report.sh --all           # todo, incluyendo servicios fallidos
#   ./sys-report.sh --save out.txt  # guardar a archivo
#   ./sys-report.sh --json          # salida en JSON

set -euo pipefail

# --- Defaults ---
MODE="standard"
SAVE_FILE=""
JSON=false

# --- Parsing de argumentos ---
while [[ $# -gt 0 ]]; do
    case "$1" in
        --quick)   MODE="quick"; shift ;;
        --all)     MODE="all"; shift ;;
        --save)    SAVE_FILE="$2"; shift 2 ;;
        --json)    JSON=true; shift ;;
        -h|--help)
            grep '^#' "$0" | sed 's/^# \{0,1\}//'
            exit 0
            ;;
        *)
            echo "Opción desconocida: $1" >&2
            exit 1
            ;;
    esac
done

# --- Helpers ---
header() {
    echo
    echo "═══ $1 ═══"
}

# --- Recolección de datos ---
HOSTNAME_VAL=$(hostname)
KERNEL_VAL=$(uname -r)
UPTIME_VAL=$(uptime -p 2>/dev/null || uptime)
LOAD_VAL=$(awk '{print $1, $2, $3}' /proc/loadavg)
CORES_VAL=$(nproc)
MEM_TOTAL=$(free -h | awk '/^Mem:/ {print $2}')
MEM_USED=$(free -h | awk '/^Mem:/ {print $3}')
DISK_ROOT=$(df -h / | awk 'NR==2 {print $3 " / " $2 " (" $5 ")"}')
USERS_NOW=$(who | wc -l)

# --- Salida JSON ---
if $JSON; then
    cat <<EOF
{
  "hostname": "$HOSTNAME_VAL",
  "kernel": "$KERNEL_VAL",
  "uptime": "$UPTIME_VAL",
  "load_avg": "$LOAD_VAL",
  "cores": $CORES_VAL,
  "memory": {"total": "$MEM_TOTAL", "used": "$MEM_USED"},
  "disk_root": "$DISK_ROOT",
  "users_logged_in": $USERS_NOW,
  "timestamp": "$(date -Iseconds)"
}
EOF
    exit 0
fi

# --- Salida en texto, posiblemente redirigida ---
{
    header "Sistema"
    echo "Hostname:  $HOSTNAME_VAL"
    echo "Kernel:    $KERNEL_VAL"
    echo "Uptime:    $UPTIME_VAL"
    echo "Load avg:  $LOAD_VAL  (sobre $CORES_VAL cores)"

    header "Memoria"
    free -h

    header "Disco"
    df -h --output=source,size,used,avail,pcent,target | grep -vE '^tmpfs|^devtmpfs'

    header "Usuarios conectados"
    who || true

    if [[ "$MODE" != "quick" ]]; then
        header "Top 5 procesos por CPU"
        ps -eo pid,user,pcpu,pmem,comm --sort=-pcpu | head -n 6

        header "Top 5 procesos por memoria"
        ps -eo pid,user,pcpu,pmem,comm --sort=-pmem | head -n 6

        header "Puertos escuchando"
        ss -tlnp 2>/dev/null | head -n 20 || netstat -tlnp 2>/dev/null | head -n 20
    fi

    if [[ "$MODE" == "all" ]]; then
        header "Servicios fallidos"
        systemctl --failed --no-legend || true

        header "Últimos errores del kernel"
        sudo dmesg --level=err,warn 2>/dev/null | tail -n 10 || \
            echo "(requiere sudo para leer dmesg)"

        header "Últimos logins"
        last -n 10
    fi
} | { [[ -n "$SAVE_FILE" ]] && tee "$SAVE_FILE" || cat; }

if [[ -n "$SAVE_FILE" ]]; then
    echo
    echo "✓ Reporte guardado en: $SAVE_FILE"
fi
