# Módulo 11 — Concurrencia y Paralelismo

## Conceptos

| Término | Significado |
|---------|-------------|
| **Concurrencia** | Múltiples tareas progresan, no necesariamente al mismo tiempo |
| **Paralelismo** | Múltiples tareas ejecutan simultáneamente (requiere múltiples cores) |
| **I/O-bound** | Tarea esperando red, disco, etc. |
| **CPU-bound** | Tarea procesando intensivamente |

### El GIL (Global Interpreter Lock)
CPython usa un lock global que **impide ejecutar bytecode Python en paralelo** dentro de un mismo proceso. Implicación práctica:

| Tarea | Mejor herramienta |
|-------|-------------------|
| I/O-bound (HTTP, DB, archivos) | `threading` o `asyncio` |
| CPU-bound (cálculos pesados) | `multiprocessing` |

> Python 3.13 introdujo un GIL opcional desactivable. En 3.11/3.12 sigue siendo el default.

## `threading` — concurrencia para I/O

```python
import threading
import time
import requests

URLS = ["https://example.com"] * 10

def descargar(url):
    response = requests.get(url)
    print(f"{url}: {response.status_code}")

# Secuencial
inicio = time.time()
for url in URLS:
    descargar(url)
print(f"Secuencial: {time.time()-inicio:.2f}s")

# Concurrente
inicio = time.time()
threads = [threading.Thread(target=descargar, args=(url,)) for url in URLS]
for t in threads: t.start()
for t in threads: t.join()
print(f"Threads: {time.time()-inicio:.2f}s")
```

### Sincronización
```python
contador = 0
lock = threading.Lock()

def incrementar():
    global contador
    with lock:
        contador += 1     # protegido contra race conditions
```

## `concurrent.futures` (alto nivel, recomendado)

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# I/O-bound
with ThreadPoolExecutor(max_workers=10) as ex:
    resultados = list(ex.map(descargar, URLS))

# CPU-bound
def procesar(x):
    return sum(i*i for i in range(x))

with ProcessPoolExecutor() as ex:
    resultados = list(ex.map(procesar, [10**6] * 8))
```

### `submit` para control fino
```python
with ThreadPoolExecutor() as ex:
    futures = [ex.submit(descargar, url) for url in URLS]
    for f in futures:
        try:
            r = f.result(timeout=10)
        except Exception as e:
            print(f"Falló: {e}")
```

## `multiprocessing` — paralelismo real

```python
import multiprocessing as mp

def trabajo(x):
    return x ** 2

if __name__ == "__main__":
    with mp.Pool(processes=4) as pool:
        resultados = pool.map(trabajo, range(20))
    print(resultados)
```

### Compartir datos
- **Queue** y **Pipe** para mensajes
- **Value** y **Array** para memoria compartida
- **Manager** para objetos compartidos complejos

```python
from multiprocessing import Process, Queue

def productor(q):
    for i in range(5):
        q.put(i)
    q.put(None)

def consumidor(q):
    while (item := q.get()) is not None:
        print(item)

if __name__ == "__main__":
    q = Queue()
    Process(target=productor, args=(q,)).start()
    Process(target=consumidor, args=(q,)).start()
```

## `asyncio` — concurrencia con un solo thread

Modelo de concurrencia cooperativa con `async/await`. Ideal para miles de conexiones I/O concurrentes.

```python
import asyncio

async def saludar(nombre, segundos):
    print(f"Hola {nombre}")
    await asyncio.sleep(segundos)
    print(f"Adiós {nombre}")

async def main():
    await asyncio.gather(
        saludar("Ana", 2),
        saludar("Luis", 1),
        saludar("Eva", 3),
    )

asyncio.run(main())
```

### Async HTTP con `aiohttp`
```python
import aiohttp
import asyncio

async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main(urls):
    async with aiohttp.ClientSession() as session:
        return await asyncio.gather(*(fetch(session, u) for u in urls))

resultados = asyncio.run(main(URLS))
```

### Reglas del asyncio
1. Solo podés usar `await` dentro de funciones `async def`
2. Una corutina **no se ejecuta** hasta que la `await`-eás o la pasás a `asyncio.run`
3. **Nunca uses I/O bloqueante** dentro de async (rompe el loop)
4. Para CPU-bound dentro de async: `loop.run_in_executor()`

## Comparativa

| Herramienta | Cuándo usar |
|-------------|-------------|
| `threading` | I/O simple, código existente sincrónico |
| `concurrent.futures` | API de alto nivel para I/O o CPU |
| `multiprocessing` | CPU-bound real |
| `asyncio` | Miles de conexiones I/O simultáneas, código nuevo |

## Errores comunes

1. **Race condition**: dos threads modificando el mismo estado sin lock
2. **Deadlock**: dos locks esperándose mutuamente
3. **Async dentro de sync**: olvidar `await` → corutina nunca se ejecuta
4. **Llamar I/O bloqueante en asyncio** → bloquea TODO el loop

## Ejercicios

1. Descargar 50 URLs con `ThreadPoolExecutor` y comparar tiempo vs secuencial
2. Cálculo CPU-bound (factorial de 1M) con `ProcessPoolExecutor` vs un solo proceso
3. Web scraper async con `aiohttp` y `asyncio.gather`
4. Productor-consumidor con `asyncio.Queue`
5. Detectar race condition en código sin lock y arreglarla
