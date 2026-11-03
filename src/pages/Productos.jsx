import { useMemo, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ProductGrid from '../components/organisms/ProductGrid.jsx';
import { useProductos } from '../context/ProductsContext.jsx';

const PLATAFORMAS = [
  { valor: 'pc', nombre: 'PC' },
  { valor: 'ps5', nombre: 'PS5' },
  { valor: 'xbox', nombre: 'Xbox' },
  { valor: 'switch', nombre: 'Switch' },
];

export default function Productos() {
  const { productos } = useProductos();
  const [activas, setActivas] = useState(PLATAFORMAS.map((p) => p.valor));
  const [busqueda, setBusqueda] = useState('');

  const alternar = (valor) =>
    setActivas((prev) => (prev.includes(valor) ? prev.filter((v) => v !== valor) : [...prev, valor]));

  const visibles = useMemo(
    () =>
      productos.filter(
        (p) =>
          activas.includes(p.plataforma) &&
          p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
      ),
    [productos, activas, busqueda]
  );

  return (
    <Container className="py-5">
      <h1 className="section-title">Catálogo</h1>
      <Row className="g-4">
        <Col lg={3}>
          <aside className="filter-panel">
            <Form.Group className="mb-4" controlId="busqueda">
              <Form.Label className="fw-semibold">Buscar</Form.Label>
              <Form.Control
                type="search"
                placeholder="Nombre del juego"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </Form.Group>
            <h2 className="h6 fw-semibold">Plataforma</h2>
            {PLATAFORMAS.map((p) => (
              <Form.Check
                key={p.valor}
                id={`plat-${p.valor}`}
                type="checkbox"
                label={p.nombre}
                checked={activas.includes(p.valor)}
                onChange={() => alternar(p.valor)}
              />
            ))}
          </aside>
        </Col>
        <Col lg={9}>
          <p className="text-secondary">{visibles.length} juegos</p>
          <ProductGrid productos={visibles} vacio="Ningún juego coincide con los filtros." />
        </Col>
      </Row>
    </Container>
  );
}
