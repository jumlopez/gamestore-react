import { Routes, Route } from 'react-router-dom';
import StoreLayout from './components/templates/StoreLayout.jsx';
import AdminLayout from './components/templates/AdminLayout.jsx';
import ProtectedRoute from './components/templates/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Carrito from './pages/Carrito.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Contacto from './pages/Contacto.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Blogs from './pages/Blogs.jsx';
import BlogDetalle from './pages/BlogDetalle.jsx';
import NotFound from './pages/NotFound.jsx';

import Dashboard from './pages/admin/Dashboard.jsx';
import AdminProductos from './pages/admin/AdminProductos.jsx';
import ProductoForm from './pages/admin/ProductoForm.jsx';
import AdminUsuarios from './pages/admin/AdminUsuarios.jsx';
import UsuarioForm from './pages/admin/UsuarioForm.jsx';

export default function App() {
  return (
    <Routes>
      {/* Tienda pública */}
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="producto/:id" element={<DetalleProducto />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<BlogDetalle />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Panel admin: administrador y vendedor entran; el vendedor solo ve */}
      <Route path="admin" element={<ProtectedRoute roles={['administrador', 'vendedor']} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<AdminProductos />} />
          {/* Crear/editar/usuarios: solo administrador */}
          <Route element={<ProtectedRoute roles={['administrador']} />}>
            <Route path="productos/nuevo" element={<ProductoForm />} />
            <Route path="productos/:id" element={<ProductoForm />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="usuarios/nuevo" element={<UsuarioForm />} />
            <Route path="usuarios/editar" element={<UsuarioForm />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
