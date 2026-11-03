import { Badge } from 'react-bootstrap';
import { estadoStock } from '../../services/productosService.js';

const CONFIG = {
  agotado: { bg: 'danger', texto: 'Agotado' },
  critico: { bg: 'warning', texto: 'Stock crítico' },
  disponible: { bg: 'success', texto: 'Disponible' },
};

export default function StockBadge({ producto }) {
  const c = CONFIG[estadoStock(producto)];
  return <Badge bg={c.bg} text={c.bg === 'warning' ? 'dark' : undefined}>{c.texto}</Badge>;
}
