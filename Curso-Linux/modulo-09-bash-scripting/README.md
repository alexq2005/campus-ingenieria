# Módulo 09 — Bash Scripting

## Anatomía de un script

```bash
#!/bin/bash
# Comentario sobre qué hace el script

set -euo pipefail              # ⭐ buenas prácticas (ver abajo)

echo "Hola desde script"
```

### Ejecutar
```bash
chmod +x script.sh
./script.sh                    # usa el shebang
bash script.sh                 # ejecuta con bash explícito
sh script.sh                   # ⚠️ puede usar dash, no bash
```

### El shebang
La primera línea (`#!`) le dice al kernel qué intérprete usar:
```
#!/bin/bash
#!/usr/bin/env bash      # más portable
#!/usr/bin/env python3
```

### Modo estricto recomendado
```bash
set -e          # salir si algún comando falla
set -u          # error si se usa variable no definida
set -o pipefail # falla si cualquier comando del pipe falla
set -x          # debug: imprime cada comando antes de ejecutarlo

# Forma compacta
set -euo pipefail
```

## Variables

```bash
nombre="Ana"                   # ⚠️ sin espacios alrededor del =
edad=30
saludo="Hola $nombre"          # interpolación
saludo="Hola ${nombre}!"       # con llaves (más seguro)
echo "$saludo"

readonly PI=3.14               # constante
unset variable                 # borrar
```

### Comillas
| Tipo | Comportamiento |
|------|----------------|
| `"doble"` | Interpola `$variables` y `$(comandos)` |
| `'simple'` | Literal — todo se imprime tal cual |
| Sin comillas | Sujeto a word splitting y glob expansion (peligroso) |

```bash
echo "Hola $nombre"            # Hola Ana
echo 'Hola $nombre'            # Hola $nombre
```

> **Regla de oro**: cuando dudes, usá `"comillas dobles"`. Especialmente con paths: `"$archivo"`.

### Variables de entorno
```bash
echo $HOME $USER $PATH $PWD
export MI_VAR="valor"          # disponible para procesos hijos
```

### Argumentos
```bash
$0          # nombre del script
$1, $2, ... # primer, segundo argumento
$#          # cantidad de argumentos
$@          # todos como lista
$*          # todos como un string
$?          # exit code del último comando
$$          # PID del script
$!          # PID del último background
```

```bash
# script.sh argumento1 argumento2
echo "Script: $0"
echo "Primer: $1"
echo "Total: $#"
```

### `shift` — desplazar argumentos
```bash
while [ $# -gt 0 ]; do
    echo "$1"
    shift
done
```

## Sustitución de comandos

```bash
fecha=$(date +%Y-%m-%d)        # forma moderna
fecha=`date +%Y-%m-%d`         # forma vieja (no usar)
echo "Hoy es $fecha"

archivos_count=$(ls | wc -l)
```

## Aritmética

```bash
((suma = 5 + 3))
echo $((10 * 2))
((contador++))

# Con expr (legacy)
total=$(expr 5 + 3)
```

## Condicionales

### `if`
```bash
if [ "$edad" -ge 18 ]; then
    echo "Mayor"
elif [ "$edad" -ge 13 ]; then
    echo "Adolescente"
else
    echo "Niño"
fi
```

### `[ ]` vs `[[ ]]`
- `[ ]` es POSIX, funciona en sh; sintaxis estricta
- `[[ ]]` es de bash, más features (regex, sin word splitting)

```bash
[[ $nombre == "Ana" ]]                     # bash, recomendado
[[ $archivo == *.txt ]]                    # glob match
[[ $email =~ ^[a-z]+@[a-z]+\.[a-z]+$ ]]   # regex con =~
```

### Operadores de comparación

#### Numérica (en `[ ]` o `[[ ]]`)
| Operador | Significado |
|----------|-------------|
| `-eq` | igual |
| `-ne` | distinto |
| `-lt` | menor |
| `-le` | menor o igual |
| `-gt` | mayor |
| `-ge` | mayor o igual |

#### String
| Operador | Significado |
|----------|-------------|
| `=` o `==` | igual |
| `!=` | distinto |
| `-z` | longitud cero |
| `-n` | longitud no cero |
| `<`, `>` | orden lexicográfico (con `[[ ]]`) |

#### Archivos
| Operador | Verdadero si |
|----------|--------------|
| `-e archivo` | existe |
| `-f archivo` | es archivo regular |
| `-d archivo` | es directorio |
| `-L archivo` | es symlink |
| `-r archivo` | legible |
| `-w archivo` | escribible |
| `-x archivo` | ejecutable |
| `-s archivo` | tamaño > 0 |
| `f1 -nt f2` | f1 más nuevo que f2 |

#### Lógicos
- `&&` — y
- `||` — o
- `!` — not

```bash
if [[ -f "$archivo" && -r "$archivo" ]]; then
    echo "Existe y es legible"
fi
```

### `case`
```bash
case "$1" in
    start)
        echo "Iniciando..."
        ;;
    stop)
        echo "Deteniendo..."
        ;;
    restart|reload)
        echo "Recargando..."
        ;;
    *)
        echo "Uso: $0 {start|stop|restart}"
        exit 1
        ;;
esac
```

## Bucles

### `for`
```bash
for i in 1 2 3 4 5; do
    echo $i
done

for archivo in *.txt; do
    echo "Procesando $archivo"
done

for i in {1..10}; do            # rango
    echo $i
done

for i in {0..20..2}; do         # con paso (de 2 en 2)
    echo $i
done

for ((i=0; i<10; i++)); do      # estilo C
    echo $i
done
```

### `while`
```bash
contador=0
while [ $contador -lt 5 ]; do
    echo $contador
    ((contador++))
done

# Leer archivo línea por línea
while IFS= read -r linea; do
    echo "$linea"
done < archivo.txt

# Leer stdin
while read -r line; do
    echo ">>> $line"
done
```

### `until` — opuesto a while
```bash
until [ $contador -ge 5 ]; do
    ((contador++))
done
```

### `break` y `continue`
```bash
for i in {1..10}; do
    [[ $i == 3 ]] && continue
    [[ $i == 7 ]] && break
    echo $i
done
```

## Funciones

```bash
saludar() {
    local nombre="$1"           # local: scope a la función
    echo "Hola, $nombre"
    return 0                    # exit code (no valor)
}

saludar "Ana"

# Capturar "valor de retorno" (vía echo)
mensaje=$(saludar "Luis")
echo "Capturado: $mensaje"
```

> En bash, `return` es solo el exit code (0-255). Para devolver datos, usá `echo` y captura con `$(...)`.

### Argumentos en funciones
Igual que el script: `$1`, `$2`, `$@`, `$#`.

## Arrays

```bash
frutas=("manzana" "pera" "uva")
echo "${frutas[0]}"             # primer elemento
echo "${frutas[@]}"             # todos
echo "${#frutas[@]}"            # cantidad
frutas+=("kiwi")                # agregar

# Iterar
for f in "${frutas[@]}"; do
    echo "$f"
done
```

### Diccionarios (associative arrays, bash 4+)
```bash
declare -A persona
persona[nombre]="Ana"
persona[edad]=30
echo "${persona[nombre]}"

for clave in "${!persona[@]}"; do
    echo "$clave = ${persona[$clave]}"
done
```

## Strings

```bash
texto="Hola Mundo"
echo "${#texto}"                 # longitud
echo "${texto,,}"                # minúsculas
echo "${texto^^}"                # mayúsculas
echo "${texto:5}"                # desde índice 5
echo "${texto:0:4}"              # substring (desde 0, longitud 4)
echo "${texto/Mundo/Linux}"      # reemplazar primera
echo "${texto//o/0}"             # reemplazar todas
echo "${archivo%.txt}"           # quitar sufijo .txt
echo "${ruta##*/}"               # quitar todo hasta el último /
echo "${ruta%/*}"                # quitar el último componente
```

## I/O y redirección (recap módulo 02)

```bash
comando > out.log 2> err.log
comando &> all.log
comando | tee log.txt            # tee: escribe a archivo y a stdout
echo "linea" >> log.txt          # append
```

### Heredoc
```bash
cat <<EOF > config.txt
nombre=Ana
edad=30
EOF

cat <<'EOF'                     # comillas → no interpola
$variable literal
EOF
```

### Read del usuario
```bash
read -p "Nombre: " nombre
read -s -p "Contraseña: " pwd   # silencioso
echo
read -t 5 -p "Algo: " x         # timeout 5 segundos
```

## Trap — manejo de señales y limpieza

```bash
limpiar() {
    echo "Limpiando..."
    rm -f /tmp/temporal.$$
}
trap limpiar EXIT               # ejecutar al salir
trap "echo Interrumpido; exit 1" INT TERM
```

## Debugging

```bash
bash -x script.sh                # imprime cada línea ejecutada
bash -n script.sh                # solo verifica sintaxis
set -x                           # activar debug en runtime
set +x                           # desactivar
```

### `shellcheck` — linter (instalable)
```bash
shellcheck script.sh
```

> Usá `shellcheck` siempre. Detecta bugs sutiles antes de que rompan en producción.

## Ejercicios

1. Script que recibe un directorio y muestra los 5 archivos más grandes
2. Backup script: comprime una carpeta con timestamp y la copia a `/var/backups`
3. Script que valida un email con regex usando `[[ =~ ]]`
4. Procesador de logs: cuenta cuántas veces aparece cada IP en `auth.log`
5. CLI con subcomandos `add`, `list`, `done` simulando un gestor de tareas
