import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StockBadge from '../../components/atoms/StockBadge.jsx';
import { useProductos } from '../../context/ProductsContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { obtenerUsuarios } from '../../services/usuariosService.js';
import { BLOGS } from '../../data/blogs.js';

function Metrica({ titulo, valor, tono }) {
  return (
    <Card className="metric-card h-100">
      <Card.Body>
        <div className="text-secondary small">{titulo}</div>
        <div className={`metric-value ${tono || ''}`}>{valor}</div>
      </Card.Body>
    </Card>
  );
}

export default function Dashboard() {
  const { sesion, esAdmin } = useAuth();
  const { productos } = useProductos();

  const criticos = productos.filter((p) => p.stock <= p.stockCritico);
  const unidades = productos.reduce((t, p) => t + p.stock, 0);

  return (
    <>
      <h1 className="admin-title">¡Hola, {sesion.nombre}!</h1>
      <Row xs={1} sm={2} xl={4} className="g-3 mb-4">
        <Col><Metrica titulo="Productos" valor={productos.length} /></Col>
        <Col><Metrica titulo="Unidades en stock" valor={unidades} /></Col>
        <Col><Metrica titulo="Stock crítico" valor={criticos.length} tono={criticos.length ? 'text-danger' : ''} /></Col>
        <Col>
          {esAdmin
            ? <Metrica titulo="Usuarios" valor={obtenerUsuarios().length} />
            : <Metrica titulo="Publicaciones de blog" valor={BLOGS.length} />}
        </Col>
      </Row>

      <h2 className="h5 mb-3">Productos con stock crítico o agotado</h2>
      {criticos.length === 0 ? (
        <p className="text-secondary">Todo el inventario está sobre el nivel crítico.</p>
      ) : (
        <div className="table-panel">
          <Table responsive hover className="mb-0 align-middle">
            <thead><tr><th>Producto</th><th>Plataforma</th><th>Stock</th><th>Crítico</th><th>Estado</th></tr></thead>
            <tbody>
              {criticos.map((p) => (
                <tr key={p.id}>
                  <td><Link to={`/producto/${p.id}`}>{p.nombre}</Link></td>
                  <td>{p.plataforma.toUpperCase()}</td>
                  <td>{p.stock}</td>
                  <td>{p.stockCritico}</td>
                  <td><StockBadge producto={p} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}
