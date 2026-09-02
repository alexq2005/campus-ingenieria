# Módulo 02 — Comandos Básicos

## Navegación

```bash
pwd                        # imprime el directorio actual
cd /home/ana               # cambia de directorio
cd ~                       # va al home
cd                         # idem (sin args = home)
cd -                       # vuelve al directorio anterior
cd ..                      # sube un nivel
```

## Listar archivos — `ls`

```bash
ls                         # contenido del directorio actual
ls /etc                    # de otro directorio
ls -l                      # formato largo (permisos, tamaño, fecha)
ls -a                      # incluye ocultos (empiezan con .)
ls -h                      # tamaños human-readable
ls -t                      # ordena por fecha (más reciente primero)
ls -S                      # ordena por tamaño
ls -r                      # invierte orden
ls -R                      # recursivo
ls -lah                    # combinación frecuente
ls *.py                    # solo archivos .py (glob)
ls **/*.py                 # recursivo (con globstar habilitado)
```

## Crear y eliminar

```bash
mkdir nueva                       # crea directorio
mkdir -p a/b/c                    # crea anidados (no falla si existe)
touch archivo.txt                 # crea archivo vacío (o actualiza timestamp)
rmdir vacio                       # elimina directorio vacío
rm archivo                        # elimina archivo
rm -r directorio                  # elimina recursivamente
rm -f archivo                     # fuerza, no pregunta
rm -rf directorio                 # ⚠️ peligroso — sin red de seguridad
rm -i archivo                     # interactivo, pregunta antes
```

> **NUNCA** ejecutar `rm -rf /` ni `rm -rf ~` sin entender exactamente qué hace. Es irreversible.

## Copiar y mover

```bash
cp origen destino
cp -r dir1 dir2                   # recursivo
cp -i archivo destino             # interactivo
cp -p archivo destino             # preserva permisos y timestamps
cp -v *.txt backup/               # verbose
cp -u src/ dst/                   # solo si más nuevo

mv viejo nuevo                    # renombrar o mover
mv -i viejo nuevo                 # confirma si va a sobrescribir
```

## Ver contenido

```bash
cat archivo                       # imprime todo
cat -n archivo                    # con números de línea
cat a b c                         # concatena varios
cat a b > c                       # redirección

less archivo                      # paginador interactivo (q para salir)
more archivo                      # más simple, menos features
head archivo                      # primeras 10 líneas
head -n 20 archivo                # primeras 20
tail archivo                      # últimas 10 líneas
tail -n 50 archivo                # últimas 50
tail -f /var/log/syslog           # follow: muestra nuevas líneas en tiempo real

wc archivo                        # líneas, palabras, bytes
wc -l archivo                     # solo líneas
```

## Buscar archivos — `find`

Recursivo y poderoso:

```bash
find . -name "*.py"                       # archivos .py
find /home -type f -name "*.log"          # solo archivos
find /home -type d -name "node_modules"   # solo directorios
find . -size +10M                         # >10MB
find . -size +1G                          # >1GB
find . -mtime -7                          # modificados en últimos 7 días
find . -newer referencia.txt              # más nuevos que un archivo
find . -name "*.tmp" -delete              # eliminar
find . -name "*.log" -exec gzip {} \;     # ejecutar comando por cada match
find . -name "*.py" | xargs wc -l         # combinar con xargs
find . -empty                             # archivos vacíos
find / -user ana                          # del usuario ana
```

## `locate` — búsqueda rápida (con base de datos)

```bash
sudo updatedb                     # actualiza la DB
locate nombre                     # busca en la DB (mucho más rápido que find)
```

## `grep` — buscar texto

```bash
grep "patrón" archivo                     # líneas con patrón
grep -i "patrón" archivo                  # ignore case
grep -r "TODO" .                          # recursivo
grep -n "patrón" archivo                  # con número de línea
grep -v "patrón" archivo                  # invertir: líneas que NO matchean
grep -c "patrón" archivo                  # contar matches
grep -l "patrón" *.py                     # solo nombres de archivos que matchean
grep -E "regex"                           # regex extendida
grep -P "regex"                           # PCRE (Perl-compatible)
grep -A 3 "patrón"                        # 3 líneas después
grep -B 3 "patrón"                        # 3 líneas antes
grep -C 3 "patrón"                        # 3 antes y después (contexto)
```

### Alternativas modernas
- `ripgrep` (`rg`) — más rápido y respeta `.gitignore`
- `ag` (the silver searcher) — similar

## Pipes y redirección

### Redirección
```bash
comando > archivo            # stdout a archivo (sobrescribe)
comando >> archivo           # stdout a archivo (append)
comando 2> errores.log       # stderr a archivo
comando &> all.log           # stdout + stderr juntos (bash)
comando > out 2> err         # cada uno por separado
comando < entrada.txt        # stdin desde archivo
comando > /dev/null          # descartar salida
comando 2>&1                 # stderr al mismo lugar que stdout
```

### Pipes
```bash
comando1 | comando2          # salida de 1 → entrada de 2
ls -la | grep ".py"
cat archivo | sort | uniq | wc -l
ps aux | grep python | grep -v grep
```

## `sort` y `uniq`

```bash
sort archivo                 # alfabético
sort -n                      # numérico
sort -r                      # reverso
sort -k 2                    # por segunda columna
sort -t ',' -k 2             # delimitador coma, columna 2

uniq archivo                 # elimina duplicados consecutivos
sort archivo | uniq          # elimina duplicados (requiere ordenar primero)
sort archivo | uniq -c       # con conteo
sort archivo | uniq -d       # solo duplicados
```

## `cut`, `awk`, `sed` — manipulación de texto

### `cut`
```bash
cut -d ',' -f 1,3 archivo.csv     # columnas 1 y 3 (delimitador coma)
cut -c 1-10 archivo                # caracteres 1 a 10
```

### `awk` — procesador de texto poderoso
```bash
awk '{print $1}' archivo                    # primera columna
awk '{print $1, $3}' archivo                # 1 y 3
awk -F ',' '{print $2}' archivo.csv         # delimitador coma
awk '$3 > 100 {print $1}' archivo            # filtro condicional
awk '{sum+=$1} END {print sum}'             # suma de la primera columna
```

### `sed` — stream editor
```bash
sed 's/viejo/nuevo/' archivo                # reemplaza primera ocurrencia por línea
sed 's/viejo/nuevo/g' archivo               # global (todas)
sed 's/viejo/nuevo/gi'                      # global + ignore case
sed -i 's/x/y/g' archivo                    # in-place (modifica el archivo)
sed -n '10,20p' archivo                     # imprime líneas 10-20
sed '5d' archivo                            # elimina línea 5
```

## Comprimir y descomprimir

```bash
# tar (.tar)
tar -cvf archivo.tar carpeta/        # crear
tar -xvf archivo.tar                  # extraer
tar -tvf archivo.tar                  # listar contenido

# gzip (.tar.gz / .tgz)
tar -czvf archivo.tar.gz carpeta/
tar -xzvf archivo.tar.gz

# bzip2 (.tar.bz2)
tar -cjvf archivo.tar.bz2 carpeta/
tar -xjvf archivo.tar.bz2

# zip
zip -r archivo.zip carpeta/
unzip archivo.zip

# gzip individual
gzip archivo                          # → archivo.gz
gunzip archivo.gz
```

## Otros útiles

```bash
echo "hola"                # imprime
echo $HOME                 # variable
printf "%s = %d\n" "x" 5   # formato (más control)

date                       # fecha/hora actual
date +"%Y-%m-%d"           # con formato
date -d "yesterday"        # fecha relativa
cal                        # calendario

history                    # historial de comandos
!!                         # último comando
!42                        # comando #42 del historial
!grep                      # último que empezó con grep

clear                      # limpia pantalla (Ctrl+L)
reset                      # resetea terminal rota

xargs                      # convierte stdin en argumentos
ls *.txt | xargs rm        # elimina todos los .txt
echo "1 2 3" | xargs -n 1  # uno por línea
```

## Ejercicios

1. Encontrar todos los archivos `.log` mayores a 10MB en `/var`
2. Contar cuántas líneas tiene un archivo Python combinando `wc` y `cat`
3. Mostrar las 10 IPs más frecuentes en `/var/log/auth.log` (combiná `grep`, `awk`, `sort`, `uniq`)
4. Reemplazar todas las ocurrencias de "foo" por "bar" en archivos `.txt` de un directorio (in-place)
5. Crear un alias para `ls -lah` llamado `ll` y ponerlo en `~/.bashrc`
