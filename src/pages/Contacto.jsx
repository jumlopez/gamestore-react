import { useMemo, useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import FormField from '../components/atoms/FormField.jsx';
import useForm from '../hooks/useForm.js';
import { validarRequerido, validarLargo, validarCorreo } from '../utils/validaciones.js';

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);

  const validators = useMemo(() => ({
    nombre: (v) => (!validarRequerido(v) || !validarLargo(v, null, 100) ? 'Requerido, máximo 100 caracteres.' : ''),
    // Correo opcional, pero si se escribe debe ser válido
    correo: (v) => (v === '' || (validarLargo(v, null, 100) && validarCorreo(v)) ? '' : 'Correo inválido o dominio no permitido.'),
    comentario: (v) => (!validarRequerido(v) || !validarLargo(v, null, 500) ? 'Requerido, máximo 500 caracteres.' : ''),
  }), []);

  const { values, errors, handleChange, validarTodo, reset } = useForm(
    { nombre: '', correo: '', comentario: '' }, validators
  );

  const enviar = (e) => {
    e.preventDefault();
    setEnviado(false);
    if (!validarTodo()) return;
    setEnviado(true);
    reset();
  };

  return (
    <Container className="auth-wrap py-5">
      <h1 className="text-center">Contacto</h1>
      <p className="text-center text-secondary mb-4">¿Dudas, sugerencias o problemas con un pedido? Escríbenos.</p>
      <Form className="form-panel" onSubmit={enviar} noValidate>
        {enviado && <Alert variant="success">Mensaje enviado. Te responderemos pronto.</Alert>}
        <FormField id="nombre" label="Nombre completo" maxLength={100} value={values.nombre} onChange={handleChange} error={errors.nombre} />
        <FormField id="correo" label="Correo (opcional)" type="email" maxLength={100} value={values.correo} onChange={handleChange} error={errors.correo} />
        <FormField id="comentario" label="Comentario" as="textarea" rows={5} maxLength={500}
          value={values.comentario} onChange={handleChange} error={errors.comentario}
          help={`${values.comentario.length}/500`} />
        <Button type="submit" className="w-100">Enviar mensaje</Button>
      </Form>
    </Container>
  );
}
