// app.js — entry point; combina named + default imports

import { PRODUCTOS, formatearPrecio } from './productos.js';
import Carrito from './carrito.js';

const productosEl = document.getElementById('productos');
const listaEl = document.getElementById('lista');
const totalEl = document.getElementById('total');

const carrito = new Carrito();

// Render de productos (una sola vez)
function renderProductos() {
  productosEl.replaceChildren(
    ...PRODUCTOS.map(p => {
      const card = document.createElement('article');
      card.className = 'prod';
      card.innerHTML = `
        <strong></strong>
        <span class="precio"></span>
        <button>Agregar</button>
      `;
      card.querySelector('strong').textContent = p.nombre;
      card.querySelector('.precio').textContent = formatearPrecio(p.precio);
      card.querySelector('button').addEventListener('click', () => carrito.agregar(p));
      return card;
    })
  );
}

// Render del carrito (reactivo — se redibuja en cada cambio)
function renderCarrito() {
  const items = carrito.items;

  if (items.length === 0) {
    listaEl.innerHTML = '<li style="color:#94a3b8;">Vacío</li>';
  } else {
    listaEl.replaceChildren(
      ...items.map(({ producto, cantidad }) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span></span>
          <span>
            <button data-id="${producto.id}" style="background:#fee2e2;color:#b91c1c;border:0;padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer;">✕</button>
          </span>
        `;
        li.querySelector('span').textContent = `${producto.nombre} × ${cantidad} = ${formatearPrecio(producto.precio * cantidad)}`;
        return li;
      })
    );
  }

  totalEl.textContent = `Total: ${formatearPrecio(carrito.total)}`;
}

// Delegation para quitar
listaEl.addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (id) carrito.quitar(Number(id));
});

carrito.onChange(renderCarrito);

renderProductos();
renderCarrito();
