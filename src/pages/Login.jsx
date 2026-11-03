import { useState, useMemo } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormField from '../components/atoms/FormField.jsx';
import useForm from '../hooks/useForm.js';
import { useAuth } from '../context/AuthContext.jsx';
import { validarRequerido, validarLargo, validarCorreo } from '../utils/validaciones.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorLogin, setErrorLogin] = useState('');
  const [bienvenida, setBienvenida] = useState('');

  const validators = useMemo(() => ({
    correo: (v) => {
      if (!validarRequerido(v)) return 'El correo es obligatorio.';
      if (!validarLargo(v, null, 100)) return 'Máximo 100 caracteres.';
      if (!validarCorreo(v)) return 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
      return '';
    },
    contrasena: (v) => {
      if (!validarRequerido(v)) return 'La contraseña es obligatoria.';
      if (!validarLargo(v, 4, 10)) return 'Debe tener entre 4 y 10 caracteres.';
      return '';
    },
  }), []);

  const { values, errors, handleChange, validarTodo } = useForm({ correo: '', contrasena: '' }, validators);

  const enviar = (e) => {
    e.preventDefault();
    setErrorLogin('');
    if (!validarTodo()) return;
    const sesion = login(values.correo, values.contrasena);
    if (!sesion) {
      setErrorLogin('Correo o contraseña incorrectos.');
      return;
    }
    setBienvenida(`Bienvenido, ${sesion.nombre}. Redirigiendo…`);
    const panel = ['administrador', 'vendedor'].includes(sesion.tipoUsuario);
    const destino = location.state?.desde || (panel ? '/admin' : '/');
    setTimeout(() => navigate(destino, { replace: true }), 700);
  };

  return (
    <Container className="auth-wrap py-5">
      <h1 className="text-center mb-4">GameStore</h1>
      <Form className="form-panel" onSubmit={enviar} noValidate>
        {bienvenida && <Alert variant="success">{bienvenida}</Alert>}
        {errorLogin && <Alert variant="danger">{errorLogin}</Alert>}
        <FormField id="correo" label="Correo" type="email" maxLength={100}
          value={values.correo} onChange={handleChange} error={errors.correo} autoComplete="email" />
        <FormField id="contrasena" label="Contraseña" type="password" maxLength={10}
          value={values.contrasena} onChange={handleChange} error={errors.contrasena} autoComplete="current-password" />
        <Button type="submit" className="w-100">Iniciar sesión</Button>
      </Form>
      <p className="text-center mt-3">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
      <p className="text-center small text-secondary">Admin de prueba: admin@duoc.cl / admin123</p>
    </Container>
  );
}
