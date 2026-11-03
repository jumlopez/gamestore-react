import { useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserForm from '../components/organisms/UserForm.jsx';
import { registrarUsuario } from '../services/usuariosService.js';

export default function Registro() {
  const [creado, setCreado] = useState(false);

  const guardar = (datos) => {
    registrarUsuario(datos);
    setCreado(true);
    return true;
  };

  return (
    <Container className="auth-wrap auth-wide py-5">
      <h1 className="text-center mb-4">Registro de usuario</h1>
      {creado && (
        <Alert variant="success">
          Cuenta creada correctamente. Ya puedes <Link to="/login">iniciar sesión</Link>.
        </Alert>
      )}
      <UserForm modo="registro" onSubmit={guardar} textoBoton="Registrar" />
    </Container>
  );
}
