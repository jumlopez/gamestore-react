// Jasmine corre en Node, que no tiene localStorage: lo simulamos en memoria
// y lo limpiamos antes de cada prueba para que no se contaminen entre sí.
const almacen = new Map();
globalThis.localStorage = {
  getItem: (k) => (almacen.has(k) ? almacen.get(k) : null),
  setItem: (k, v) => almacen.set(k, String(v)),
  removeItem: (k) => almacen.delete(k),
  clear: () => almacen.clear(),
};

beforeEach(() => localStorage.clear());
