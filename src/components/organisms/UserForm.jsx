import { useMemo } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormField from '../atoms/FormField.jsx';
import useForm from '../../hooks/useForm.js';
import { REGIONES } from '../../data/regiones.js';
import { correoExiste } from '../../services/usuariosService.js';
import {
  validarRequerido, validarLargo, validarCorreo, validarRun, validarContrasena,
} from '../../utils/validaciones.js';

const VACIO = {
  run: '', nombre: '', apellidos: '', correo: '', fechaNacimiento: '', tipoUsuario: 'cliente',
  contrasena: '', confirmar: '', region: '', comuna: '', direccion: '',
};

/**
 * Formulario único de usuario. La pauta dice que "registro de usuarios es lo
 * mismo que crear un usuario en el administrador", así que se reutiliza:
 *  - modo "registro": pide confirmar contraseña y el rol queda en "cliente".
 *  - modo "admin": deja elegir el rol; al editar, contraseña vacía = no cambiarla.
 */
export default function UserForm({ modo = 'registro', inicial = null, onSubmit, textoBoton }) {
  const editando = !!inicial;
  const esAdmin = modo === 'admin';

  const validators = useMemo(() => ({
    run: (v) => {
      if (!validarRequerido(v)) return 'El RUN es obligatorio.';
      if (!validarRun(v)) return 'RUN inválido. Sin puntos ni guion, con dígito verificador correcto.';
      return '';
    },
    nombre: (v) => (!validarRequerido(v) || !validarLargo(v, null, 50) ? 'Requerido, máximo 50 caracteres.' : ''),
    apellidos: (v) => (!validarRequerido(v) || !validarLargo(v, null, 100) ? 'Requerido, máximo 100 caracteres.' : ''),
    correo: (v) => {
      if (!validarRequerido(v) || !validarLargo(v, null, 100)) return 'Requerido, máximo 100 caracteres.';
      if (!validarCorreo(v)) return 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
      if (correoExiste(v, inicial?.correo)) return 'Ya existe una cuenta con este correo.';
      return '';
    },
    tipoUsuario: (v) => (esAdmin && !validarRequerido(v) ? 'Selecciona un tipo de usuario.' : ''),
    contrasena: (v) => {
      if (editando && v === '') return '';
      return validarContrasena(v) ? '' : 'Entre 4 y 10 caracteres.';
    },
    confirmar: (v, todos) =>
      !esAdmin && v !== todos.contrasena ? 'Las contraseñas no coinciden.' : '',
    region: (v) => (validarRequerido(v) ? '' : 'Selecciona una región.'),
    comuna: (v) => (validarRequerido(v) ? '' : 'Selecciona una comuna.'),
    direccion: (v) => (!validarRequerido(v) || !validarLargo(v, null, 300) ? 'Requerido, máximo 300 caracteres.' : ''),
  }), [editando, esAdmin, inicial]);

  const { values, errors, handleChange, setMany, validarTodo, reset } = useForm(
    inicial ? { ...VACIO, ...inicial, contrasena: '', confirmar: '' } : VACIO,
    validators
  );

  const comunas = REGIONES.find((r) => r.nombre === values.region)?.comunas ?? [];

  const cambiarRegion = (e) => {
    // al cambiar la región se reinicia la comuna
    setMany({ region: e.target.value, comuna: '' });
  };

  const enviar = (e) => {
    e.preventDefault();
    if (!validarTodo()) return;
    const { confirmar, ...datos } = values;
    const ok = onSubmit({
      ...datos,
      run: datos.run.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      direccion: datos.direccion.trim(),
      tipoUsuario: esAdmin ? datos.tipoUsuario : 'cliente',
    });
    if (ok !== false && !editando) reset(VACIO);
  };

  return (
    <Form className="form-panel form-wide" onSubmit={enviar} noValidate>
      <FormField id="run" label="RUN (sin puntos ni guion)" maxLength={9} placeholder="Ej: 190110222"
        value={values.run} onChange={handleChange} error={errors.run} />
      <Row>
        <Col md={6}><FormField id="nombre" label="Nombre" maxLength={50} value={values.nombre} onChange={handleChange} error={errors.nombre} /></Col>
        <Col md={6}><FormField id="apellidos" label="Apellidos" maxLength={100} value={values.apellidos} onChange={handleChange} error={errors.apellidos} /></Col>
      </Row>
      <FormField id="correo" label="Correo" type="email" maxLength={100} value={values.correo}
        onChange={handleChange} error={errors.correo} />
      <FormField id="fechaNacimiento" label="Fecha de nacimiento (opcional)" type="date"
        value={values.fechaNacimiento} onChange={handleChange} />

      {esAdmin && (
        <FormField id="tipoUsuario" label="Tipo de usuario" as="select" value={values.tipoUsuario}
          onChange={handleChange} error={errors.tipoUsuario}
          help="Administrador: acceso total. Vendedor: solo ve productos. Cliente: solo la tienda.">
          <option value="administrador">Administrador</option>
          <option value="vendedor">Vendedor</option>
          <option value="cliente">Cliente</option>
        </FormField>
      )}

      <Row>
        <Col md={esAdmin ? 12 : 6}>
          <FormField id="contrasena" label="Contraseña" type="password" maxLength={10}
            value={values.contrasena} onChange={handleChange} error={errors.contrasena}
            help={editando ? 'Déjala vacía para no cambiarla.' : 'Entre 4 y 10 caracteres.'} autoComplete="new-password" />
        </Col>
        {!esAdmin && (
          <Col md={6}>
            <FormField id="confirmar" label="Confirmar contraseña" type="password" maxLength={10}
              value={values.confirmar} onChange={handleChange} error={errors.confirmar} autoComplete="new-password" />
          </Col>
        )}
      </Row>

      <Row>
        <Col md={6}>
          <FormField id="region" label="Región" as="select" value={values.region} onChange={cambiarRegion} error={errors.region}>
            <option value="">-- Seleccione la región --</option>
            {REGIONES.map((r) => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
          </FormField>
        </Col>
        <Col md={6}>
          <FormField id="comuna" label="Comuna" as="select" value={values.comuna} onChange={handleChange}
            error={errors.comuna} disabled={!values.region}>
            <option value="">-- Seleccione la comuna --</option>
            {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
          </FormField>
        </Col>
      </Row>

      <FormField id="direccion" label="Dirección" maxLength={300} value={values.direccion}
        onChange={handleChange} error={errors.direccion} />

      <Button type="submit" className="w-100">{textoBoton || 'Registrar'}</Button>
    </Form>
  );
}
