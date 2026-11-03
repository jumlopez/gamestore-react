/* Productos persistidos en localStorage (misma clave que la versión HTML,
   así los datos que ya tenían en el navegador siguen funcionando). */
import { PRODUCTOS_INICIALES } from '../data/productos.js';
import { leer, guardar } from './almacenamiento.js';

export const CLAVE_PRODUCTOS = 'gamestore_productos';

export function obtenerProductos() {
  const guardados = leer(CLAVE_PRODUCTOS, null);
  if (!guardados) {
    guardar(CLAVE_PRODUCTOS, PRODUCTOS_INICIALES);
    return [...PRODUCTOS_INICIALES];
  }
  return guardados;
}

export function obtenerProductoPorId(id) {
  return obtenerProductos().find((p) => p.id === id);
}

/** Crea o actualiza. idOriginal = id previo al editar (null al crear). */
export function guardarProducto(datos, idOriginal = null) {
  const productos = obtenerProductos();
  const clave = idOriginal || datos.id;
  const indice = productos.findIndex((p) => p.id === clave);
  if (indice >= 0) productos[indice] = { ...productos[indice], ...datos };
  else productos.push(datos);
  guardar(CLAVE_PRODUCTOS, productos);
  return productos;
}

export function eliminarProducto(id) {
  const productos = obtenerProductos().filter((p) => p.id !== id);
  guardar(CLAVE_PRODUCTOS, productos);
  return productos;
}

export function estadoStock(producto) {
  if (producto.stock === 0) return 'agotado';
  if (producto.stock <= producto.stockCritico) return 'critico';
  return 'disponible';
}
