import { formatearPrecio } from '../../utils/validaciones.js';

export default function PriceTag({ precio, className = '' }) {
  const gratis = Number(precio) === 0;
  return <span className={`price-tag ${gratis ? 'price-free' : ''} ${className}`}>{formatearPrecio(precio)}</span>;
}
