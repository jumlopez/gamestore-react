import { Container } from 'react-bootstrap';

export default function Nosotros() {
  return (
    <Container className="py-5 prose">
      <h1>Sobre GameStore</h1>
      <p>En GameStore compartimos una misma pasión: el mundo de los videojuegos y la cultura geek.</p>
      <p>Nacimos con el objetivo de ofrecer a jugadores, coleccionistas y aficionados un espacio donde encontrar productos de calidad, novedades y artículos exclusivos que les permitan vivir al máximo sus hobbies favoritos.</p>
      <p>Nos especializamos en la venta de videojuegos, seleccionando cuidadosamente cada producto para satisfacer tanto a quienes buscan las últimas novedades del mercado como a los coleccionistas más exigentes.</p>
      <p>Creemos que los videojuegos son mucho más que entretenimiento: son experiencias, historias y comunidades que conectan a personas de todo el mundo.</p>
      <p>Por eso, en GameStore trabajamos cada día para brindar una atención cercana, asesoramiento especializado y una experiencia de compra confiable y satisfactoria.</p>
      <p>Nuestro compromiso es seguir creciendo junto a nuestra comunidad, ofreciendo productos auténticos, un servicio de excelencia y un catálogo que refleje la pasión que compartimos con nuestros clientes.</p>

      <h2 className="mt-5">Nuestra Ubicación</h2>
      <p>
        Si prefieres visitarnos en persona o retirar tus compras, nos encontramos en las instalaciones de{' '}
        <strong>Duoc UC Sede Plaza Norte</strong>.
      </p>
      <p><strong>Dirección:</strong> Av. Américo Vespucio 1501, Huechuraba, Región Metropolitana.</p>

      <div className="map-frame">
        <iframe
          title="Mapa Duoc UC Sede Plaza Norte"
          src="https://maps.google.com/maps?q=Duoc%20UC%20Sede%20Plaza%20Norte,%20Huechuraba&t=&z=16&ie=UTF8&iwloc=&output=embed"
          width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy"
        />
      </div>
      <p className="small mt-2">
        <a href="https://www.google.com/maps/search/?api=1&query=Duoc+UC+Sede+Plaza+Norte" target="_blank" rel="noopener noreferrer">
          Abrir mapa directamente en Google Maps ↗
        </a>
      </p>
    </Container>
  );
}
