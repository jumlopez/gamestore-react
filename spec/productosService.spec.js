import {
  obtenerProductos, obtenerProductoPorId, guardarProducto, eliminarProducto, estadoStock,
} from '../src/services/productosService.js';

describe('productosService', () => {
  it('siembra el catálogo inicial', () => {
    expect(obtenerProductos().length).toBeGreaterThan(20);
  });

  it('busca por id', () => {
    expect(obtenerProductoPorId('p1').nombre).toBe('Elden Ring');
    expect(obtenerProductoPorId('xx')).toBeUndefined();
  });

  it('crea un producto nuevo', () => {
    const antes = obtenerProductos().length;
    guardarProducto({ id: 'nuevo1', nombre: 'Test', plataforma: 'pc', precio: 0, stock: 1, stockCritico: 1 });
    expect(obtenerProductos().length).toBe(antes + 1);
  });

  it('edita conservando los demás campos (imagen, género)', () => {
    guardarProducto({ id: 'p1', precio: 1 }, 'p1');
    const p = obtenerProductoPorId('p1');
    expect(p.precio).toBe(1);
    expect(p.imagen).toBeTruthy();
  });

  it('elimina', () => {
    eliminarProducto('p1');
    expect(obtenerProductoPorId('p1')).toBeUndefined();
  });

  it('clasifica el estado del stock', () => {
    expect(estadoStock({ stock: 0, stockCritico: 3 })).toBe('agotado');
    expect(estadoStock({ stock: 2, stockCritico: 3 })).toBe('critico');
    expect(estadoStock({ stock: 10, stockCritico: 3 })).toBe('disponible');
  });
});
