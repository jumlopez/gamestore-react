import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import UserForm from '../../components/organisms/UserForm.jsx';
import { obtenerUsuarios, guardarUsuarioAdmin } from '../../services/usuariosService.js';

export default function UsuarioForm() {
  const [params] = useSearchParams();
  const correoEdicion = params.get('correo');
  const original = correoEdicion ? obtenerUsuarios().find((u) => u.correo === correoEdicion) : null;
  const [guardado, setGuardado] = useState(false);

  if (correoEdicion && !original) {
    return <Alert variant="warning">Ese usuario no existe. <Link to="/admin/usuarios">Volver</Link></Alert>;
  }

  const guardar = (datos) => {
    // En edición, si la contraseña viene vacía se conserva la anterior
    const contrasena = datos.contrasena || original?.contrasena || '';
    guardarUsuarioAdmin({ ...datos, contrasena }, original?.correo ?? null);
    setGuardado(true);
    return true;
  };

  return (
    <>
      <h1 className="admin-title">{original ? 'Editar usuario' : 'Nuevo usuario'}</h1>
      {guardado && <Alert variant="success">Usuario guardado correctamente.</Alert>}
      <UserForm modo="admin" inicial={original} onSubmit={guardar} textoBoton="Guardar usuario" />
      <p className="mt-3"><Link to="/admin/usuarios">← Volver al listado</Link></p>
    </>
  );
}
