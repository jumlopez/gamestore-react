/* validaciones.js — mismas reglas que la versión HTML, ahora como módulo.
   Son funciones puras (no tocan el DOM), por eso se prueban fácil con Jasmine. */

export const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

export function validarRequerido(valor) {
  return String(valor ?? '').trim().length > 0;
}

export function validarLargo(valor, min, max) {
  const largo = String(valor ?? '').trim().length;
  if (min !== null && min !== undefined && largo < min) return false;
  if (max !== null && max !== undefined && largo > max) return false;
  return true;
}

export function validarCorreo(valor) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patron.test(valor)) return false;
  const dominio = valor.split('@')[1]?.toLowerCase();
  return DOMINIOS_PERMITIDOS.includes(dominio);
}

/** RUN chileno sin puntos ni guion (ej: 19011022K) con dígito verificador módulo 11 */
export function validarRun(valor) {
  const run = String(valor ?? '').trim().toUpperCase();
  if (!/^[0-9]{6,8}[0-9K]$/.test(run)) return false;

  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado;
  if (resto === 11) dvEsperado = '0';
  else if (resto === 10) dvEsperado = 'K';
  else dvEsperado = String(resto);

  return dv === dvEsperado;
}

/** Contraseña: requerida, entre 4 y 10 caracteres */
export function validarContrasena(valor) {
  return validarRequerido(valor) && validarLargo(valor, 4, 10);
}

export function validarEnteroNoNegativo(valor) {
  if (valor === '' || valor === null || valor === undefined) return false;
  const n = Number(valor);
  return Number.isInteger(n) && n >= 0;
}

export function validarPrecio(valor) {
  if (valor === '' || valor === null || valor === undefined) return false;
  const n = Number(valor);
  return !Number.isNaN(n) && n >= 0;
}

export function formatearPrecio(numero) {
  if (Number(numero) === 0) return 'GRATIS';
  return '$' + Number(numero).toLocaleString('es-CL');
}
