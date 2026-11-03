import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function AppFooter() {
  return (
    <footer className="store-footer mt-5">
      <Container>
        <Row className="g-4 py-5">
          <Col md={5}>
            <div className="footer-brand">GameStore</div>
            <p className="text-secondary mb-0">
              Tienda de videojuegos para PC y consolas. Proyecto académico DUOC UC — DSY1104.
            </p>
          </Col>
          <Col xs={6} md={3}>
            <h4 className="footer-title">Navegación</h4>
            <ul className="list-unstyled mb-0">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </Col>
          <Col xs={6} md={4}>
            <h4 className="footer-title">Cuenta</h4>
            <ul className="list-unstyled mb-0">
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><Link to="/registro">Registrarse</Link></li>
              <li><Link to="/carrito">Mi carrito</Link></li>
            </ul>
          </Col>
        </Row>
        <div className="footer-base py-3 d-flex flex-wrap justify-content-between gap-2">
          <span>© 2026 GameStore — Proyecto académico</span>
          <span>Hecho con React y React-Bootstrap</span>
        </div>
      </Container>
    </footer>
  );
}
