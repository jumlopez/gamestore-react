/* Carrito en localStorage. Regla de negocio: nunca se pueden pedir más
   unidades de las que hay en stock. Cada función devuelve el resultado
   en vez de usar alert(), así la interfaz decide cómo avisar. */
import { leer, guardar } from './almacenamiento.js';
import { obtenerProductoPorId } from './productosService.js';

export const CLAVE_CARRITO = 'gamestore_carrito';

export function leerCarrito() {
  return leer(CLAVE_CARRITO, []);
}

export function agregarAlCarrito(idProducto, cantidad = 1) {
  const producto = obtenerProductoPorId(idProducto);
  if (!producto) return { ok: false, error: 'Producto no encontrado.', carrito: leerCarrito() };

  const carrito = leerCarrito();
  const existente = carrito.find((i) => i.id === idProducto);
  const nueva = (existente ? existente.cantidad : 0) + cantidad;

  if (nueva > producto.stock) {
    return {
      ok: false,
      error: `No hay stock suficiente. Solo quedan ${producto.stock} unidades de ${producto.nombre}.`,
      carrito,
    };
  }

  if (existente) existente.cantidad = nueva;
  else carrito.push({ id: idProducto, cantidad });
  guardar(CLAVE_CARRITO, carrito);
  return { ok: true, carrito };
}

export function quitarDelCarrito(idProducto) {
  const carrito = leerCarrito().filter((i) => i.id !== idProducto);
  guardar(CLAVE_CARRITO, carrito);
  return carrito;
}

export function cambiarCantidad(idProducto, delta) {
  const carrito = leerCarrito();
  const item = carrito.find((i) => i.id === idProducto);
  if (!item) return { ok: false, error: 'El producto no está en el carrito.', carrito };

  const producto = obtenerProductoPorId(idProducto);
  if (delta > 0 && producto && item.cantidad + delta > producto.stock) {
    return { ok: false, error: `Solo quedan ${producto.stock} unidades de ${producto.nombre}.`, carrito };
  }

  item.cantidad += delta;
  if (item.cantidad <= 0) return { ok: true, carrito: quitarDelCarrito(idProducto) };
  guardar(CLAVE_CARRITO, carrito);
  return { ok: true, carrito };
}

export function vaciarCarrito() {
  guardar(CLAVE_CARRITO, []);
  return [];
}

export function totalItems(carrito) {
  return carrito.reduce((t, i) => t + i.cantidad, 0);
}

export function totalPrecio(carrito) {
  return carrito.reduce((t, i) => {
    const p = obtenerProductoPorId(i.id);
    return t + (p ? p.precio * i.cantidad : 0);
  }, 0);
}
