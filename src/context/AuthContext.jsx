import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import * as servicio from '../services/usuariosService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // obtenerUsuarios() también siembra el admin de fábrica la primera vez
  const [sesion, setSesion] = useState(() => {
    servicio.obtenerUsuarios();
    return servicio.obtenerSesion();
  });

  const login = useCallback((correo, contrasena) => {
    const s = servicio.iniciarSesion(correo, contrasena);
    setSesion(s);
    return s;
  }, []);

  const logout = useCallback(() => {
    servicio.cerrarSesion();
    setSesion(null);
  }, []);

  const value = useMemo(
    () => ({
      sesion,
      login,
      logout,
      esAdmin: sesion?.tipoUsuario === 'administrador',
      tienePanel: ['administrador', 'vendedor'].includes(sesion?.tipoUsuario),
    }),
    [sesion, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
