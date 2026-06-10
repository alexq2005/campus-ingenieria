"""Proyecto 1: Gestor de Tareas CLI.

Uso:
    python proyecto_tareas.py add "Comprar pan"
    python proyecto_tareas.py list
    python proyecto_tareas.py done 1
    python proyecto_tareas.py rm 1
    python proyecto_tareas.py clear
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path

ARCHIVO = Path.home() / ".tareas.json"


@dataclass
class Tarea:
    id: int
    descripcion: str
    completada: bool = False
    creada: str = field(default_factory=lambda: datetime.now().isoformat())


def cargar() -> list[Tarea]:
    if not ARCHIVO.exists():
        return []
    try:
        data = json.loads(ARCHIVO.read_text(encoding="utf-8"))
        return [Tarea(**t) for t in data]
    except (json.JSONDecodeError, TypeError):
        print("⚠️  Archivo corrupto, empezando de cero", file=sys.stderr)
        return []


def guardar(tareas: list[Tarea]) -> None:
    ARCHIVO.write_text(
        json.dumps([asdict(t) for t in tareas], indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def cmd_add(args: argparse.Namespace) -> None:
    tareas = cargar()
    nuevo_id = max((t.id for t in tareas), default=0) + 1
    tareas.append(Tarea(id=nuevo_id, descripcion=args.descripcion))
    guardar(tareas)
    print(f"✓ Tarea #{nuevo_id} agregada")


def cmd_list(args: argparse.Namespace) -> None:
    tareas = cargar()
    if not tareas:
        print("(sin tareas)")
        return
    for t in tareas:
        marca = "[x]" if t.completada else "[ ]"
        print(f"{t.id:>3}  {marca} {t.descripcion}")


def cmd_done(args: argparse.Namespace) -> None:
    tareas = cargar()
    for t in tareas:
        if t.id == args.id:
            t.completada = True
            guardar(tareas)
            print(f"✓ Tarea #{args.id} completada")
            return
    sys.exit(f"Tarea #{args.id} no existe")


def cmd_rm(args: argparse.Namespace) -> None:
    tareas = cargar()
    nuevas = [t for t in tareas if t.id != args.id]
    if len(nuevas) == len(tareas):
        sys.exit(f"Tarea #{args.id} no existe")
    guardar(nuevas)
    print(f"✓ Tarea #{args.id} eliminada")


def cmd_clear(args: argparse.Namespace) -> None:
    guardar([])
    print("✓ Todas las tareas eliminadas")


def main() -> None:
    parser = argparse.ArgumentParser(prog="tareas", description="Gestor de tareas CLI")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_add = sub.add_parser("add", help="Agregar una tarea")
    p_add.add_argument("descripcion")
    p_add.set_defaults(func=cmd_add)

    p_list = sub.add_parser("list", help="Listar tareas")
    p_list.set_defaults(func=cmd_list)

    p_done = sub.add_parser("done", help="Marcar como completada")
    p_done.add_argument("id", type=int)
    p_done.set_defaults(func=cmd_done)

    p_rm = sub.add_parser("rm", help="Eliminar tarea")
    p_rm.add_argument("id", type=int)
    p_rm.set_defaults(func=cmd_rm)

    p_clear = sub.add_parser("clear", help="Eliminar todas")
    p_clear.set_defaults(func=cmd_clear)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
