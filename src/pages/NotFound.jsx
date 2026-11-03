import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound({ mensaje = 'Esta página no existe.' }) {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-4">404</h1>
      <p className="text-secondary">{mensaje}</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </Container>
  );
}
