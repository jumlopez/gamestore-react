const NOMBRES = { pc: 'PC', ps5: 'PS5', xbox: 'Xbox', switch: 'Switch' };

export default function PlatformBadge({ plataforma }) {
  return <span className="platform-tag">{NOMBRES[plataforma] || plataforma}</span>;
}
