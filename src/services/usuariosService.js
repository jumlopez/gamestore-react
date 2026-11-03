/* Usuarios y sesión simulados con localStorage (mismas claves que la versión HTML). */
import { leer, guardar, borrar } from './almacenamiento.js';

export const CLAVE_USUARIOS = 'gamestore_usuarios';
export const CLAVE_SESION = 'gamestore_sesion';

export const ADMIN_POR_DEFECTO = {
  run: '111111111',
  nombre: 'Admin',
  apellidos: 'GameStore',
  correo: 'admin@duoc.cl',
  contrasena: 'admin123',
  tipoUsuario: 'administrador',
  region: '',
  comuna: '',
  direccion: '',
};

export function obtenerUsuarios() {
  const usuarios = leer(CLAVE_USUARIOS, []);
  // Siembra el administrador de fábrica si no existe
  if (!usuarios.some((u) => u.correo === ADMIN_POR_DEFECTO.correo)) {
    usuarios.push(ADMIN_POR_DEFECTO);
    guardar(CLAVE_USUARIOS, usuarios);
  }
  return usuarios;
}

export function correoExiste(correo, excepto = null) {
  return obtenerUsuarios().some(
    (u) => u.correo.toLowerCase() === correo.toLowerCase() && u.correo !== excepto
  );
}

export function registrarUsuario(datos) {
  const usuarios = obtenerUsuarios();
  usuarios.push({ ...datos, tipoUsuario: datos.tipoUsuario || 'cliente' });
  guardar(CLAVE_USUARIOS, usuarios);
}

/** Crea o actualiza (si se pasa correoOriginal, reemplaza a ese usuario) */
export function guardarUsuarioAdmin(datos, correoOriginal = null) {
  const usuarios = obtenerUsuarios();
  const clave = correoOriginal || datos.correo;
  const indice = usuarios.findIndex((u) => u.correo === clave);
  if (indice >= 0) usuarios[indice] = datos;
  else usuarios.push(datos);
  guardar(CLAVE_USUARIOS, usuarios);
}

export function eliminarUsuario(correo) {
  guardar(CLAVE_USUARIOS, obtenerUsuarios().filter((u) => u.correo !== correo));
}

export function iniciarSesion(correo, contrasena) {
  const usuario = obtenerUsuarios().find(
    (u) => u.correo.toLowerCase() === correo.toLowerCase() && u.contrasena === contrasena
  );
  if (!usuario) return null;
  const sesion = { correo: usuario.correo, nombre: usuario.nombre, tipoUsuario: usuario.tipoUsuario };
  guardar(CLAVE_SESION, sesion);
  return sesion;
}

export function obtenerSesion() {
  return leer(CLAVE_SESION, null);
}

export function cerrarSesion() {
  borrar(CLAVE_SESION);
}
