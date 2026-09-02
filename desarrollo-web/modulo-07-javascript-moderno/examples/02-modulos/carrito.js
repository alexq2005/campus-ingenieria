// carrito.js — export default de una clase + named exports

export default class Carrito {
  #items = new Map();  // id → { producto, cantidad }
  #listeners = new Set();

  agregar(producto) {
    const actual = this.#items.get(producto.id);
    if (actual) {
      actual.cantidad += 1;
    } else {
      this.#items.set(producto.id, { producto, cantidad: 1 });
    }
    this.#emit();
  }

  quitar(id) {
    this.#items.delete(id);
    this.#emit();
  }

  vaciar() {
    this.#items.clear();
    this.#emit();
  }

  get items() {
    return [...this.#items.values()];
  }

  get total() {
    return this.items.reduce((t, { producto, cantidad }) => t + producto.precio * cantidad, 0);
  }

  // Pub/sub mínimo
  onChange(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);  // unsubscribe
  }

  #emit() {
    this.#listeners.forEach(fn => fn(this));
  }
}
