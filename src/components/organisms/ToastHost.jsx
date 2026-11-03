import { Toast, ToastContainer } from 'react-bootstrap';
import { useCarrito } from '../../context/CartContext.jsx';

/** Muestra los avisos del carrito (éxito o "no hay stock") */
export default function ToastHost() {
  const { aviso, cerrarAviso } = useCarrito();
  return (
    <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 2000 }}>
      <Toast show={!!aviso} onClose={cerrarAviso} delay={3500} autohide bg={aviso?.variante}>
        <Toast.Body className={aviso?.variante === 'danger' ? 'text-white' : 'text-white'}>
          {aviso?.texto}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
