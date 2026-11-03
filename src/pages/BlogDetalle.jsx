import { Container, Breadcrumb } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { BLOGS } from '../data/blogs.js';
import NotFound from './NotFound.jsx';

export default function BlogDetalle() {
  const { id } = useParams();
  const blog = BLOGS.find((b) => String(b.id) === id);
  if (!blog) return <NotFound mensaje="Ese artículo no existe." />;

  return (
    <Container className="py-5 prose" style={{ maxWidth: 780 }}>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/blogs' }}>Blogs</Breadcrumb.Item>
        <Breadcrumb.Item active>Caso {blog.id}</Breadcrumb.Item>
      </Breadcrumb>
      <img src={blog.imagenDetalle} alt={blog.alt} className="blog-hero-img" />
      <h1 className="mt-4">{blog.tituloDetalle}</h1>
      {/* cuerpoHtml es texto propio del equipo (src/data/blogs.js), no contenido de usuarios */}
      <div dangerouslySetInnerHTML={{ __html: blog.cuerpoHtml }} />
    </Container>
  );
}
