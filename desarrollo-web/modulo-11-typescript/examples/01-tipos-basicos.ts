// ============================================================
// TypeScript — Tipos básicos
// Para ejecutar: npx tsc 01-tipos-basicos.ts && node 01-tipos-basicos.js
// O usá TS Playground: https://www.typescriptlang.org/play
// ============================================================

// 1. Primitivos
const nombre: string = 'Ada';
const edad: number = 30;
const activo: boolean = true;
const nada: null = null;

// 2. Inferencia — TS deduce el tipo sin que lo escribas
const ciudad = 'Londres';   // string
const cantidad = 42;        // number

// 3. Arrays
const nums: number[] = [1, 2, 3];
const palabras: Array<string> = ['a', 'b', 'c'];

// 4. Tupla
const punto: [number, number] = [3, 4];
const [x, y] = punto;       // x: number, y: number

// 5. Object type
type Producto = {
  id: number;
  nombre: string;
  precio: number;
  descontado?: boolean;     // opcional
  readonly codigo: string;  // no se puede reasignar
};

const libro: Producto = {
  id: 1,
  nombre: 'JS the Good Parts',
  precio: 1200,
  codigo: 'BK001'
};
// libro.codigo = 'X';  // ERROR: readonly

// 6. Union types
type Estado = 'pending' | 'success' | 'error';
let req: Estado = 'pending';
req = 'success';
// req = 'foo';  // ERROR

// 7. Funciones tipadas
function sumar(a: number, b: number): number {
  return a + b;
}

const multiplicar = (a: number, b: number): number => a * b;

// 8. Parámetros opcionales y default
function saludar(nombre: string, edad?: number, greet: string = 'Hola'): string {
  return edad !== undefined ? `${greet} ${nombre} (${edad})` : `${greet} ${nombre}`;
}

// 9. Rest parameters
function concat(...strs: string[]): string {
  return strs.join(' ');
}

// 10. Función que no retorna
function log(mensaje: string): void {
  console.log(mensaje);
}

// 11. Narrowing con type guards
function procesar(valor: string | number) {
  if (typeof valor === 'string') {
    return valor.toUpperCase();   // TS sabe que es string
  }
  return valor.toFixed(2);          // TS sabe que es number
}

// 12. Arrays de objetos
const usuarios: Producto[] = [
  libro,
  { id: 2, nombre: 'Café', precio: 800, codigo: 'CF001' }
];

// 13. Map, filter, reduce tipados automáticamente
const nombres: string[] = usuarios.map(u => u.nombre);
const caros: Producto[] = usuarios.filter(u => u.precio > 1000);
const total: number = usuarios.reduce((t, u) => t + u.precio, 0);

// 14. Destructuring con tipos
const { nombre: nombreProd, precio }: Producto = libro;

console.log({ nombres, caros, total });
console.log(sumar(1, 2), multiplicar(3, 4));
console.log(saludar('Ada'), saludar('Ada', 30), saludar('Ada', 30, '¡Hi'));
console.log(procesar('hola'), procesar(3.14159));
