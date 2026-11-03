import { Row, Col } from 'react-bootstrap';
import ProductCard from '../molecules/ProductCard.jsx';

export default function ProductGrid({ productos, vacio = 'No hay productos para mostrar.' }) {
  if (productos.length === 0) return <p className="text-secondary py-4">{vacio}</p>;
  return (
    <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
      {productos.map((p) => (
        <Col key={p.id}><ProductCard producto={p} /></Col>
      ))}
    </Row>
  );
}
