import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PriceTag from '../atoms/PriceTag.jsx';
import PlatformBadge from '../atoms/PlatformBadge.jsx';
import { useCarrito } from '../../context/CartContext.jsx';

/** Molécula: portada + plataforma + nombre + precio + botón añadir */
export default function ProductCard({ producto }) {
  const { agregar } = useCarrito();
  const agotado = producto.stock === 0;

  return (
    <Card className="product-card h-100">
      <Link to={`/producto/${producto.id}`} className="product-cover" aria-label={producto.nombre}>
        {producto.imagen ? (
          <Card.Img variant="top" src={producto.imagen} alt={producto.nombre} loading="lazy" />
        ) : (
          <div className="product-cover-empty">Sin imagen</div>
        )}
      </Link>
      <Card.Body className="d-flex flex-column gap-2">
        <PlatformBadge plataforma={producto.plataforma} />
        <Card.Title as="h3" className="product-title">
          <Link to={`/producto/${producto.id}`}>{producto.nombre}</Link>
        </Card.Title>
        <div className="d-flex align-items-center justify-content-between mt-auto">
          <PriceTag precio={producto.precio} />
          <Button
            size="sm"
            variant={agotado ? 'secondary' : 'outline-info'}
            disabled={agotado}
            onClick={() => agregar(producto.id, 1, producto.nombre)}
          >
            {agotado ? 'Agotado' : 'Añadir'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
