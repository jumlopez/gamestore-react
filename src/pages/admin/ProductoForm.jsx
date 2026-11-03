import { useMemo, useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import FormField from '../../components/atoms/FormField.jsx';
import useForm from '../../hooks/useForm.js';
import { useProductos } from '../../context/ProductsContext.jsx';
import {
  validarRequerido, validarLargo, validarPrecio, validarEnteroNoNegativo,
} from '../../utils/validaciones.js';

const MAX_IMAGEN_KB = 300; // localStorage tiene poco espacio: limitamos el tamaño

export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos, porId, guardar } = useProductos();
  const original = id ? porId(id) : null;
  const editando = !!original;
  const [imagen, setImagen] = useState(original?.imagen || '');
  const [errorImagen, setErrorImagen] = useState('');
  const [guardado, setGuardado] = useState(false);

  const validators = useMemo(() => ({
    id: (v) => {
      if (editando) return '';
      if (!validarRequerido(v) || !validarLargo(v, 3, null)) return 'Mínimo 3 caracteres.';
      if (productos.some((p) => p.id === v.trim())) return 'Ya existe un producto con ese código.';
      return '';
    },
    nombre: (v) => (!validarRequerido(v) || !validarLargo(v, null, 100) ? 'Requerido, máximo 100 caracteres.' : ''),
    descripcion: (v) => (validarLargo(v, null, 500) ? '' : 'Máximo 500 caracteres.'),
    precio: (v) => (validarPrecio(v) ? '' : 'Requerido, mínimo 0 (0 = producto gratis).'),
    plataforma: (v) => (validarRequerido(v) ? '' : 'Selecciona una categoría.'),
    stock: (v) => (validarEnteroNoNegativo(v) ? '' : 'Requerido, entero, mínimo 0.'),
    stockCritico: (v) => (v === '' || validarEnteroNoNegativo(v) ? '' : 'Debe ser un entero, mínimo 0.'),
  }), [editando, productos]);

  const { values, errors, handleChange, validarTodo } = useForm(
    original
      ? {
          id: original.id, nombre: original.nombre, descripcion: original.descripcion || '',
          precio: String(original.precio), plataforma: original.plataforma,
          stock: String(original.stock), stockCritico: String(original.stockCritico ?? ''),
          genero: original.genero || '',
        }
      : { id: '', nombre: '', descripcion: '', precio: '', plataforma: '', stock: '', stockCritico: '', genero: '' },
    validators
  );

  if (id && !original) return <Alert variant="warning">Ese producto no existe. <Link to="/admin/productos">Volver</Link></Alert>;

  const elegirImagen = (e) => {
    const archivo = e.target.files?.[0];
    setErrorImagen('');
    if (!archivo) return;
    if (archivo.size > MAX_IMAGEN_KB * 1024) {
      setErrorImagen(`La imagen pesa más de ${MAX_IMAGEN_KB} KB. Usa una más liviana.`);
      return;
    }
    const lector = new FileReader();
    lector.onload = () => setImagen(lector.result);
    lector.readAsDataURL(archivo);
  };

  const enviar = (e) => {
    e.preventDefault();
    if (!validarTodo()) return;
    const datos = {
      id: values.id.trim(),
      nombre: values.nombre.trim(),
      descripcion: values.descripcion.trim(),
      precio: Number(values.precio),
      plataforma: values.plataforma,
      stock: Number(values.stock),
      stockCritico: values.stockCritico === '' ? 0 : Number(values.stockCritico),
      genero: values.genero.trim(),
      imagen,
    };
    guardar(datos, original?.id ?? null);
    setGuardado(true);
    if (!editando) setTimeout(() => navigate('/admin/productos'), 700);
  };

  return (
    <>
      <h1 className="admin-title">{editando ? 'Editar producto' : 'Nuevo producto'}</h1>
      <Form className="form-panel form-wide" onSubmit={enviar} noValidate>
        {guardado && <Alert variant="success">Producto guardado correctamente.</Alert>}
        <FormField id="id" label="Código producto" value={values.id} onChange={handleChange}
          error={errors.id} readOnly={editando} help={editando ? 'El código no se puede cambiar.' : 'Mínimo 3 caracteres.'} />
        <FormField id="nombre" label="Nombre" maxLength={100} value={values.nombre} onChange={handleChange} error={errors.nombre} />
        <FormField id="descripcion" label="Descripción (opcional)" as="textarea" rows={4} maxLength={500}
          value={values.descripcion} onChange={handleChange} error={errors.descripcion} />
        <Row>
          <Col md={6}>
            <FormField id="precio" label="Precio" type="number" min="0" step="0.01" value={values.precio}
              onChange={handleChange} error={errors.precio} help="0 = gratis. Acepta decimales." />
          </Col>
          <Col md={6}>
            <FormField id="plataforma" label="Categoría (plataforma)" as="select" value={values.plataforma}
              onChange={handleChange} error={errors.plataforma}>
              <option value="">-- Seleccione --</option>
              <option value="pc">PC</option>
              <option value="ps5">PS5</option>
              <option value="xbox">Xbox</option>
              <option value="switch">Switch</option>
            </FormField>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormField id="stock" label="Stock" type="number" min="0" step="1" value={values.stock}
              onChange={handleChange} error={errors.stock} help="Solo enteros." />
          </Col>
          <Col md={6}>
            <FormField id="stockCritico" label="Stock crítico (opcional)" type="number" min="0" step="1"
              value={values.stockCritico} onChange={handleChange} error={errors.stockCritico}
              help="Se avisa cuando el stock llega a este nivel o menos." />
          </Col>
        </Row>
        <FormField id="genero" label="Género (opcional)" value={values.genero} onChange={handleChange} />

        <Form.Group className="mb-3" controlId="imagen">
          <Form.Label>Imagen (opcional, máx. {MAX_IMAGEN_KB} KB)</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={elegirImagen} isInvalid={!!errorImagen} />
          <Form.Control.Feedback type="invalid">{errorImagen}</Form.Control.Feedback>
          {imagen && <img src={imagen} alt="Vista previa" className="mt-2 rounded" style={{ maxHeight: 120 }} />}
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" className="flex-grow-1">Guardar producto</Button>
          <Link to="/admin/productos" className="btn btn-outline-secondary">Volver</Link>
        </div>
      </Form>
    </>
  );
}
