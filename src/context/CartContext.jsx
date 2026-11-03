import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import * as servicio from '../services/carritoService.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(() => servicio.leerCarrito());
  const [aviso, setAviso] = useState(null); // { texto, variante }

  const notificar = useCallback((texto, variante = 'success') => setAviso({ texto, variante }), []);
  const cerrarAviso = useCallback(() => setAviso(null), []);

  const resolver = useCallback(
    (resultado, textoOk) => {
      setCarrito(resultado.carrito);
      if (!resultado.ok) notificar(resultado.error, 'danger');
      else if (textoOk) notificar(textoOk, 'success');
      return resultado.ok;
    },
    [notificar]
  );

  const agregar = useCallback(
    (id, cantidad = 1, nombre = 'Producto') =>
      resolver(servicio.agregarAlCarrito(id, cantidad), `${nombre} añadido al carrito`),
    [resolver]
  );
  const cambiar = useCallback((id, delta) => resolver(servicio.cambiarCantidad(id, delta)), [resolver]);
  const quitar = useCallback((id) => setCarrito(servicio.quitarDelCarrito(id)), []);
  const vaciar = useCallback(() => setCarrito(servicio.vaciarCarrito()), []);

  const value = useMemo(
    () => ({
      carrito, agregar, cambiar, quitar, vaciar,
      cantidadTotal: servicio.totalItems(carrito),
      aviso, notificar, cerrarAviso,
    }),
    [carrito, agregar, cambiar, quitar, vaciar, aviso, notificar, cerrarAviso]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCarrito = () => useContext(CartContext);
