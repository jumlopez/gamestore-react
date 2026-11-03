import { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { obtenerUsuarios, eliminarUsuario, ADMIN_POR_DEFECTO } from '../../services/usuariosService.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminUsuarios() {
  const { sesion } = useAuth();
  const [usuarios, setUsuarios] = useState(() => obtenerUsuarios());
  const [porEliminar, setPorEliminar] = useState(null);

  const eliminar = () => {
    eliminarUsuario(porEliminar.correo);
    setUsuarios(obtenerUsuarios());
    setPorEliminar(null);
  };

  // No se puede borrar el admin de fábrica ni la cuenta con la que se está conectado
  const protegido = (u) => u.correo === ADMIN_POR_DEFECTO.correo || u.correo === sesion.correo;

  return (
    <>
      <div className="admin-head">
        <h1 className="admin-title mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">Nuevo usuario</Link>
      </div>

      <div className="table-panel">
        <Table responsive hover className="mb-0 align-middle">
          <thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Rol</th><th /></tr></thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.correo}>
                <td>{u.run}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td><span className="role-badge">{u.tipoUsuario}</span></td>
                <td className="text-nowrap">
                  <Link to={`/admin/usuarios/editar?correo=${encodeURIComponent(u.correo)}`} className="btn btn-sm btn-outline-info me-2">Editar</Link>
                  <Button size="sm" variant="outline-danger" disabled={protegido(u)} onClick={() => setPorEliminar(u)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={!!porEliminar} onHide={() => setPorEliminar(null)} centered>
        <Modal.Header closeButton><Modal.Title>Eliminar usuario</Modal.Title></Modal.Header>
        <Modal.Body>¿Eliminar a <strong>{porEliminar?.nombre} {porEliminar?.apellidos}</strong> ({porEliminar?.correo})?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPorEliminar(null)}>Cancelar</Button>
          <Button variant="danger" onClick={eliminar}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
