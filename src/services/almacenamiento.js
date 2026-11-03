/* Pequeño envoltorio de localStorage: si el JSON está dañado o el
   navegador lo bloquea, devuelve el valor por defecto en vez de romper. */
export function leer(clave, porDefecto) {
  try {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : porDefecto;
  } catch {
    return porDefecto;
  }
}

export function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function borrar(clave) {
  localStorage.removeItem(clave);
}
