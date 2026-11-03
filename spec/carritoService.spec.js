import {
  agregarAlCarrito, cambiarCantidad, quitarDelCarrito, leerCarrito,
  totalItems, totalPrecio, vaciarCarrito,
} from '../src/services/carritoService.js';
import { obtenerProductos, guardarProducto } from '../src/services/productosService.js';

describe('carritoService', () => {
  let conStock;   // producto con stock suficiente
  let agotado;    // producto sin stock

  beforeEach(() => {
    const productos = obtenerProductos();
    conStock = productos.find((p) => p.stock >= 3);
    agotado = productos.find((p) => p.stock === 0);
  });

  it('agrega un producto y lo guarda', () => {
    const r = agregarAlCarrito(conStock.id, 1);
    expect(r.ok).toBeTrue();
    expect(leerCarrito()).toEqual([{ id: conStock.id, cantidad: 1 }]);
  });

  it('suma cantidades del mismo producto', () => {
    agregarAlCarrito(conStock.id, 1);
    agregarAlCarrito(conStock.id, 2);
    expect(leerCarrito()[0].cantidad).toBe(3);
  });

  it('no deja superar el stock disponible', () => {
    const r = agregarAlCarrito(conStock.id, conStock.stock + 1);
    expect(r.ok).toBeFalse();
    expect(r.error).toContain('stock');
    expect(leerCarrito().length).toBe(0);
  });

  it('no deja agregar un producto agotado', () => {
    const r = agregarAlCarrito(agotado.id, 1);
    expect(r.ok).toBeFalse();
  });

  it('rechaza un id que no existe', () => {
    expect(agregarAlCarrito('no-existe', 1).ok).toBeFalse();
  });

  it('cambiarCantidad sube, baja y elimina al llegar a 0', () => {
    agregarAlCarrito(conStock.id, 1);
    expect(cambiarCantidad(conStock.id, 1).ok).toBeTrue();
    expect(leerCarrito()[0].cantidad).toBe(2);
    cambiarCantidad(conStock.id, -1);
    cambiarCantidad(conStock.id, -1);
    expect(leerCarrito().length).toBe(0);
  });

  it('cambiarCantidad respeta el tope de stock', () => {
    guardarProducto({ ...conStock, stock: 2 });
    agregarAlCarrito(conStock.id, 2);
    const r = cambiarCantidad(conStock.id, 1);
    expect(r.ok).toBeFalse();
    expect(leerCarrito()[0].cantidad).toBe(2);
  });

  it('calcula totales de unidades y de precio', () => {
    agregarAlCarrito(conStock.id, 2);
    expect(totalItems(leerCarrito())).toBe(2);
    expect(totalPrecio(leerCarrito())).toBe(conStock.precio * 2);
  });

  it('quita y vacía', () => {
    agregarAlCarrito(conStock.id, 1);
    expect(quitarDelCarrito(conStock.id)).toEqual([]);
    agregarAlCarrito(conStock.id, 1);
    expect(vaciarCarrito()).toEqual([]);
  });
});
