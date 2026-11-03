import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/organisms/HeroCarousel.jsx';
import ProductGrid from '../components/organisms/ProductGrid.jsx';
import { useProductos } from '../context/ProductsContext.jsx';

export default function Home() {
  const { productos } = useProductos();
  const destacados = productos.filter((p) => p.stock > 0).slice(0, 8);

  return (
    <>
      <section className="hero-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <h1 className="hero-title">Tu próxima partida <span>empieza acá</span></h1>
              <p className="lead text-secondary">
                Catálogo curado para PC, PlayStation, Xbox y Switch. Sin relleno,
                solo los juegos que vale la pena tener.
              </p>
              <Link to="/productos" className="btn btn-primary btn-lg">Ver catálogo</Link>
            </Col>
            <Col lg={7}><HeroCarousel /></Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <h2 className="section-title">Destacados de la semana</h2>
        <ProductGrid productos={destacados} />
      </Container>
    </>
  );
}
