#!/usr/bin/env bash
# Backup script — comprime un directorio con timestamp.
# Uso: ./backup.sh <directorio_origen> [destino]

set -euo pipefail

# --- Validación de argumentos ---
if [[ $# -lt 1 ]]; then
    echo "Uso: $0 <directorio_origen> [destino]" >&2
    exit 1
fi

ORIGEN="${1%/}"   # quita barra final si la hay
DESTINO="${2:-$HOME/backups}"

if [[ ! -d "$ORIGEN" ]]; then
    echo "Error: '$ORIGEN' no es un directorio válido" >&2
    exit 1
fi

# --- Preparación ---
mkdir -p "$DESTINO"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
NOMBRE=$(basename "$ORIGEN")
ARCHIVO="$DESTINO/${NOMBRE}-${TIMESTAMP}.tar.gz"

# --- Cleanup en caso de interrupción ---
limpiar() {
    if [[ -f "$ARCHIVO" && ! -s "$ARCHIVO" ]]; then
        echo "Backup interrumpido, eliminando archivo parcial..." >&2
        rm -f "$ARCHIVO"
    fi
}
trap limpiar INT TERM

# --- Backup ---
echo "📦 Comprimiendo '$ORIGEN' → '$ARCHIVO'"
tar -czf "$ARCHIVO" -C "$(dirname "$ORIGEN")" "$NOMBRE"

# --- Reporte ---
TAMANO=$(du -h "$ARCHIVO" | cut -f1)
echo "✅ Backup creado: $ARCHIVO ($TAMANO)"

# --- Rotación: mantener últimos 7 ---
cd "$DESTINO"
mapfile -t VIEJOS < <(ls -1t "${NOMBRE}-"*.tar.gz 2>/dev/null | tail -n +8)
for f in "${VIEJOS[@]}"; do
    echo "🗑️  Eliminando viejo: $f"
    rm -f "$f"
done
