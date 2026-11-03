import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import * as servicio from '../services/productosService.js';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState(() => servicio.obtenerProductos());

  const guardar = useCallback((datos, idOriginal = null) => {
    setProductos(servicio.guardarProducto(datos, idOriginal));
  }, []);

  const eliminar = useCallback((id) => setProductos(servicio.eliminarProducto(id)), []);
  const refrescar = useCallback(() => setProductos(servicio.obtenerProductos()), []);
  const porId = useCallback((id) => productos.find((p) => p.id === id), [productos]);

  const value = useMemo(
    () => ({ productos, guardar, eliminar, refrescar, porId }),
    [productos, guardar, eliminar, refrescar, porId]
  );
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export const useProductos = () => useContext(ProductsContext);
