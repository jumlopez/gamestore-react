import {
  obtenerUsuarios, registrarUsuario, iniciarSesion, obtenerSesion, cerrarSesion,
  correoExiste, guardarUsuarioAdmin, eliminarUsuario, ADMIN_POR_DEFECTO,
} from '../src/services/usuariosService.js';

describe('usuariosService', () => {
  const cliente = {
    run: '19011022K', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com',
    contrasena: 'clave1', region: '', comuna: '', direccion: 'Calle 1',
  };

  it('siembra el administrador de fábrica', () => {
    const admin = obtenerUsuarios().find((u) => u.correo === ADMIN_POR_DEFECTO.correo);
    expect(admin.tipoUsuario).toBe('administrador');
  });

  it('registra clientes con rol "cliente" por defecto', () => {
    registrarUsuario(cliente);
    expect(obtenerUsuarios().find((u) => u.correo === cliente.correo).tipoUsuario).toBe('cliente');
  });

  it('detecta correos repetidos sin distinguir mayúsculas', () => {
    registrarUsuario(cliente);
    expect(correoExiste('ANA@gmail.com')).toBeTrue();
    expect(correoExiste('otra@gmail.com')).toBeFalse();
  });

  it('inicia sesión con credenciales correctas y la guarda', () => {
    const sesion = iniciarSesion('admin@duoc.cl', 'admin123');
    expect(sesion.tipoUsuario).toBe('administrador');
    expect(obtenerSesion().correo).toBe('admin@duoc.cl');
  });

  it('rechaza credenciales incorrectas', () => {
    expect(iniciarSesion('admin@duoc.cl', 'mala')).toBeNull();
    expect(obtenerSesion()).toBeNull();
  });

  it('cierra la sesión', () => {
    iniciarSesion('admin@duoc.cl', 'admin123');
    cerrarSesion();
    expect(obtenerSesion()).toBeNull();
  });

  it('el admin puede crear un vendedor, cambiarlo y eliminarlo', () => {
    guardarUsuarioAdmin({ ...cliente, tipoUsuario: 'vendedor' });
    expect(iniciarSesion(cliente.correo, cliente.contrasena).tipoUsuario).toBe('vendedor');
    guardarUsuarioAdmin({ ...cliente, tipoUsuario: 'cliente' }, cliente.correo);
    expect(obtenerUsuarios().find((u) => u.correo === cliente.correo).tipoUsuario).toBe('cliente');
    eliminarUsuario(cliente.correo);
    expect(correoExiste(cliente.correo)).toBeFalse();
  });
});
