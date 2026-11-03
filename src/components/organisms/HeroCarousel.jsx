import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useProductos } from '../../context/ProductsContext.jsx';

/** Carrusel de portadas: cada lámina lleva a la página de venta del juego */
export default function HeroCarousel() {
  const { productos } = useProductos();
  const juegos = productos.filter((p) => p.imagen).slice(0, 8);

  return (
    <Carousel className="hero-carousel" interval={4500} pause="hover" indicators>
      {juegos.map((j) => (
        <Carousel.Item key={j.id}>
          <Link to={`/producto/${j.id}`} aria-label={j.nombre}>
            <img className="d-block w-100 hero-slide" src={j.imagen} alt={j.nombre} />
          </Link>
          <Carousel.Caption className="hero-caption">
            <h3>{j.nombre}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
