import { useState } from 'react';
import { Container, Row, Col, Button, Form, Breadcrumb } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import PlatformBadge from '../components/atoms/PlatformBadge.jsx';
import PriceTag from '../components/atoms/PriceTag.jsx';
import StockBadge from '../components/atoms/StockBadge.jsx';
import ProductGrid from '../components/organisms/ProductGrid.jsx';
import { useProductos } from '../context/ProductsContext.jsx';
import { useCarrito } from '../context/CartContext.jsx';
import NotFound from './NotFound.jsx';

export default function DetalleProducto() {
  const { id } = useParams();
  const { productos, porId } = useProductos();
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const producto = porId(id);

  if (!producto) return <NotFound mensaje="Ese juego no existe." />;

  const relacionados = productos
    .filter((p) => p.plataforma === producto.plataforma && p.id !== producto.id)
    .slice(0, 4);
  const agotado = producto.stock === 0;

  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/productos' }}>Productos</Breadcrumb.Item>
        <Breadcrumb.Item active>{producto.nombre}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="g-5">
        <Col md={5}>
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} className="detail-cover" />
          ) : (
            <div className="detail-cover product-cover-empty">Sin imagen</div>
          )}
        </Col>
        <Col md={7}>
          <div className="d-flex gap-2 align-items-center mb-2">
            <PlatformBadge plataforma={producto.plataforma} />
            {producto.genero && <span className="text-secondary small">{producto.genero}</span>}
          </div>
          <h1 className="mb-3">{producto.nombre}</h1>
          <p className="text-secondary">{producto.descripcion}</p>
          <div className="detail-price my-3"><PriceTag precio={producto.precio} /></div>
          <div className="mb-3"><StockBadge producto={producto} /> <span className="text-secondary small ms-2">{producto.stock} unidades</span></div>

          <Form.Group className="d-flex align-items-center gap-3 mb-3" controlId="cantidad">
            <Form.Label className="mb-0">Cantidad</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max={Math.max(producto.stock, 1)}
              value={cantidad}
              disabled={agotado}
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value, 10) || 1))}
              style={{ width: 90 }}
            />
          </Form.Group>
          <Button size="lg" disabled={agotado} onClick={() => agregar(producto.id, cantidad, producto.nombre)}>
            {agotado ? 'Agotado' : 'Añadir al carrito'}
          </Button>
        </Col>
      </Row>

      {relacionados.length > 0 && (
        <section className="mt-5">
          <h2 className="h4 mb-3">Más para {producto.plataforma.toUpperCase()}</h2>
          <ProductGrid productos={relacionados} />
        </section>
      )}
    </Container>
  );
}
