import { useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StockBadge from '../../components/atoms/StockBadge.jsx';
import PriceTag from '../../components/atoms/PriceTag.jsx';
import { useProductos } from '../../context/ProductsContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminProductos() {
  const { productos, eliminar } = useProductos();
  const { esAdmin } = useAuth(); // el vendedor solo puede ver
  const [filtro, setFiltro] = useState('');
  const [porEliminar, setPorEliminar] = useState(null);

  const q = filtro.trim().toLowerCase();
  const lista = productos.filter(
    (p) => !q || [p.id, p.nombre, p.plataforma].some((v) => String(v).toLowerCase().includes(q))
  );

  return (
    <>
      <div className="admin-head">
        <h1 className="admin-title mb-0">Productos</h1>
        {esAdmin && <Link to="/admin/productos/nuevo" className="btn btn-primary">Nuevo producto</Link>}
      </div>

      <Form.Control type="search" placeholder="Buscar por código, nombre o plataforma"
        className="mb-3 admin-search" value={filtro} onChange={(e) => setFiltro(e.target.value)} />

      <div className="table-panel">
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Plataforma</th><th>Precio</th><th>Stock</th><th>Estado</th>{esAdmin && <th />}</tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.plataforma.toUpperCase()}</td>
                <td><PriceTag precio={p.precio} /></td>
                <td>{p.stock}</td>
                <td><StockBadge producto={p} /></td>
                {esAdmin && (
                  <td className="text-nowrap">
                    <Link to={`/admin/productos/${p.id}`} className="btn btn-sm btn-outline-info me-2">Editar</Link>
                    <Button size="sm" variant="outline-danger" onClick={() => setPorEliminar(p)}>Eliminar</Button>
                  </td>
                )}
              </tr>
            ))}
            {lista.length === 0 && <tr><td colSpan={7} className="text-center text-secondary py-4">Sin resultados.</td></tr>}
          </tbody>
        </Table>
      </div>

      <Modal show={!!porEliminar} onHide={() => setPorEliminar(null)} centered>
        <Modal.Header closeButton><Modal.Title>Eliminar producto</Modal.Title></Modal.Header>
        <Modal.Body>¿Seguro que quieres eliminar <strong>{porEliminar?.nombre}</strong>? Esta acción no se puede deshacer.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPorEliminar(null)}>Cancelar</Button>
          <Button variant="danger" onClick={() => { eliminar(porEliminar.id); setPorEliminar(null); }}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
