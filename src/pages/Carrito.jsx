import { useState } from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PriceTag from '../components/atoms/PriceTag.jsx';
import { useCarrito } from '../context/CartContext.jsx';
import { useProductos } from '../context/ProductsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Carrito() {
  const { carrito, cambiar, quitar, vaciar } = useCarrito();
  const { porId, guardar } = useProductos();
  const { sesion } = useAuth();
  const navigate = useNavigate();
  const [compraOk, setCompraOk] = useState(false);

  const lineas = carrito
    .map((item) => ({ ...item, producto: porId(item.id) }))
    .filter((l) => l.producto);
  const total = lineas.reduce((t, l) => t + l.producto.precio * l.cantidad, 0);

  // Pago SIMULADO: exige sesión, descuenta stock y vacía el carrito
  const pagar = () => {
    if (!sesion) {
      navigate('/login', { state: { desde: '/carrito' } });
      return;
    }
    lineas.forEach((l) =>
      guardar({ ...l.producto, stock: Math.max(0, l.producto.stock - l.cantidad) }, l.producto.id)
    );
    vaciar();
    setCompraOk(true);
  };

  return (
    <Container className="py-5">
      <h1 className="section-title">Mi carrito de compras</h1>

      {compraOk && (
        <Alert variant="success" dismissible onClose={() => setCompraOk(false)}>
          ¡Compra simulada realizada! Descontamos el stock de los juegos comprados.
        </Alert>
      )}

      {lineas.length === 0 ? (
        <p className="text-secondary">
          Tu carrito está vacío. <Link to="/productos">Ver catálogo</Link>
        </p>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            {lineas.map(({ producto, cantidad }) => (
              <div className="cart-line" key={producto.id}>
                <img src={producto.imagen} alt="" className="cart-thumb" />
                <div className="flex-grow-1">
                  <Link to={`/producto/${producto.id}`} className="fw-semibold">{producto.nombre}</Link>
                  <div className="small text-secondary"><PriceTag precio={producto.precio} /> c/u</div>
                </div>
                <div className="qty-control">
                  <Button size="sm" variant="outline-secondary" aria-label="Quitar uno" onClick={() => cambiar(producto.id, -1)}>−</Button>
                  <span aria-live="polite">{cantidad}</span>
                  <Button size="sm" variant="outline-secondary" aria-label="Agregar uno" disabled={cantidad >= producto.stock} onClick={() => cambiar(producto.id, 1)}>+</Button>
                </div>
                <div className="text-end cart-subtotal">
                  <PriceTag precio={producto.precio * cantidad} />
                  <div><Button variant="link" size="sm" className="p-0 text-danger" onClick={() => quitar(producto.id)}>Eliminar</Button></div>
                </div>
              </div>
            ))}
          </Col>
          <Col lg={4}>
            <Card className="summary-card">
              <Card.Body>
                <h2 className="h5">Resumen</h2>
                <div className="d-flex justify-content-between fs-4 fw-bold my-3">
                  <span>Total</span><PriceTag precio={total} />
                </div>
                <Button className="w-100" onClick={pagar}>Pagar</Button>
                <p className="small text-secondary mt-3 mb-0">
                  El pago es solo de referencia para esta entrega — no procesa transacciones reales.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
