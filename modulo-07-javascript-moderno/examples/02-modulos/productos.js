// productos.js — named exports

export const PRODUCTOS = [
  { id: 1, nombre: 'Libro JS', precio: 1200 },
  { id: 2, nombre: 'Café premium', precio: 800 },
  { id: 3, nombre: 'Taza', precio: 600 },
  { id: 4, nombre: 'Sticker pack', precio: 250 },
  { id: 5, nombre: 'Cuaderno A5', precio: 900 },
  { id: 6, nombre: 'Lápiz HB', precio: 150 },
];

export function formatearPrecio(n) {
  return `$${n.toLocaleString('es-AR')}`;
}
