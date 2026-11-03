import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCarrito } from '../../context/CartContext.jsx';

export default function AppNavbar() {
  const { sesion, logout, tienePanel } = useAuth();
  const { cantidadTotal } = useCarrito();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" sticky="top" className="store-navbar" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <img src="img/nav-icon.png" alt="" width="32" height="32" />
          GameStore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blogs">Blogs</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
          </Nav>
          <Nav className="align-items-lg-center gap-lg-2">
            {sesion ? (
              <>
                <Navbar.Text>Hola, {sesion.nombre}</Navbar.Text>
                {tienePanel && <Nav.Link as={NavLink} to="/admin">Panel admin</Nav.Link>}
                <Nav.Link as="button" className="btn btn-link" onClick={salir}>Cerrar sesión</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Iniciar sesión</Nav.Link>
                <Nav.Link as={NavLink} to="/registro">Registrarse</Nav.Link>
              </>
            )}
            <Nav.Link as={NavLink} to="/carrito" className="cart-link">
              Carrito <Badge pill bg="danger">{cantidadTotal}</Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
