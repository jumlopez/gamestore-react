import { Container } from 'react-bootstrap';
import BlogCard from '../components/molecules/BlogCard.jsx';
import { BLOGS } from '../data/blogs.js';

export default function Blogs() {
  return (
    <Container className="py-5" style={{ maxWidth: 900 }}>
      <h1 className="section-title">Noticias importantes</h1>
      {BLOGS.map((b) => <BlogCard key={b.id} blog={b} />)}
    </Container>
  );
}
