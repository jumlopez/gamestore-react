import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

function Menu({ onNavigate }) {
  const { sesion, esAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const salir = () => {
    logout();
    navigate('/login');
  };
  return (
    <>
      <Nav className="flex-column admin-menu" onClick={onNavigate}>
        <Nav.Link as={NavLink} to="/admin" end>Inicio</Nav.Link>
        <Nav.Link as={NavLink} to="/admin/productos">Productos</Nav.Link>
        {/* El vendedor no ve "Usuarios" (según la pauta) */}
        {esAdmin && <Nav.Link as={NavLink} to="/admin/usuarios">Usuarios</Nav.Link>}
        <Nav.Link as={Link} to="/" className="mt-3 border-top pt-3">Volver a la tienda</Nav.Link>
      </Nav>
      <div className="admin-user mt-4 pt-3 border-top">
        <div className="text-secondary small mb-2">{sesion.nombre} · {sesion.tipoUsuario}</div>
        <button type="button" className="btn btn-link p-0" onClick={salir}>Cerrar sesión</button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="admin-shell">
      {/* Barra superior solo en pantallas chicas */}
      <Navbar className="d-lg-none admin-topbar" variant="dark">
        <Container fluid>
          <Navbar.Brand>GameStore <small className="text-secondary">/ admin</small></Navbar.Brand>
          <button className="btn btn-outline-light btn-sm" onClick={() => setAbierto(true)} aria-label="Abrir menú">
            Menú
          </button>
        </Container>
      </Navbar>
      <Offcanvas show={abierto} onHide={() => setAbierto(false)} className="admin-offcanvas">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>GameStore / admin</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body><Menu onNavigate={() => setAbierto(false)} /></Offcanvas.Body>
      </Offcanvas>

      <aside className="admin-sidebar d-none d-lg-block">
        <div className="admin-brand">GameStore <small className="text-secondary">/ admin</small></div>
        <Menu />
      </aside>
      <section className="admin-main"><Outlet /></section>
    </div>
  );
}
