import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function BlogCard({ blog }) {
  return (
    <article className="blog-card mb-4">
      <Row className="g-0 align-items-stretch">
        <Col md={5}>
          <img src={blog.imagen} alt={blog.alt} className="blog-card-img" loading="lazy" />
        </Col>
        <Col md={7} className="p-4 d-flex flex-column gap-2">
          <h3 className="h5">{blog.titulo}</h3>
          <p className="text-secondary mb-2">{blog.resumen}</p>
          <Link to={`/blogs/${blog.id}`} className="mt-auto fw-semibold">Ver caso →</Link>
        </Col>
      </Row>
    </article>
  );
}
