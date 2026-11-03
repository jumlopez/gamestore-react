# GameStore — versión React (DSY1104)

Migración del proyecto HTML/CSS/JS a **React + React-Bootstrap + React Router**,
con pruebas **Jasmine** y reporte de cobertura. Reutiliza los datos, imágenes,
reglas de validación y claves de `localStorage` de la versión HTML.

## Cómo correrlo

Requiere Node 18 o superior.

```bash
npm install
npm start          # servidor de desarrollo  -> http://localhost:3000
npm run build      # genera /build
npm test           # pruebas Jasmine (38 specs)
npm run test:coverage   # pruebas + informe de cobertura (también en /coverage/index.html)
```

Admin de prueba: `admin@duoc.cl` / `admin123`.

## Estructura (Atomic Design, como en la guía 2.2)

```
src/
├── components/
│   ├── atoms/       FormField, PriceTag, PlatformBadge, StockBadge
│   ├── molecules/   ProductCard, BlogCard
│   ├── organisms/   AppNavbar, AppFooter, HeroCarousel, ProductGrid, UserForm, ToastHost
│   └── templates/   StoreLayout, AdminLayout, ProtectedRoute
├── pages/           Home, Productos, DetalleProducto, Carrito, Login, Registro,
│                    Contacto, Nosotros, Blogs, BlogDetalle, NotFound
│   └── admin/       Dashboard, AdminProductos, ProductoForm, AdminUsuarios, UsuarioForm
├── context/         AuthContext, CartContext, ProductsContext   (estado compartido)
├── hooks/           useForm            (validación en tiempo real)
├── services/        productosService, carritoService, usuariosService, almacenamiento
├── utils/           validaciones       (funciones puras)
├── data/            productos, regiones, blogs
└── styles/theme.css (paleta GameStore sobre Bootstrap dark)
spec/                pruebas Jasmine
```

## Equivalencias con la versión HTML

| HTML/JS (antes) | React (ahora) |
|---|---|
| `js/productos-data.js` | `data/productos.js` + `services/productosService.js` |
| `js/carrito.js` | `services/carritoService.js` + `context/CartContext.jsx` |
| `js/sesion.js` (`protegerAdmin`) | `services/usuariosService.js` + `AuthContext` + `ProtectedRoute` |
| `js/validaciones.js` | `utils/validaciones.js` (mismas reglas) |
| `js/regiones.js` | `data/regiones.js` + select en cascada dentro de `UserForm` |
| `registro.html` y `admin/usuario-nuevo.html` | un solo `UserForm` (la pauta dice que son lo mismo) |
| `renderizarCarrito()` con `innerHTML` | componente `Carrito` (JSX) |
| `alert()` por falta de stock | `Toast` de react-bootstrap |
| `*.html` con nav/footer copiados | `StoreLayout` / `AdminLayout` (una sola vez) |

Las claves de localStorage son las mismas (`gamestore_productos`, `gamestore_usuarios`,
`gamestore_sesion`, `gamestore_carrito`), así que los datos ya guardados en el navegador siguen funcionando.

## Roles

- **Administrador:** todo el panel.
- **Vendedor:** ve Dashboard y listado de Productos, sin botones de crear/editar/eliminar;
  no ve "Usuarios" y si entra por URL lo redirige a `/admin`.
- **Cliente:** solo la tienda.

## Pruebas

- `spec/validaciones.spec.js`, `carritoService.spec.js`, `usuariosService.spec.js`,
  `productosService.spec.js`: lógica de negocio (RUN, correos, tope de stock, roles, CRUD).
- Cobertura actual de `src/utils` y `src/services`: ~99 % de sentencias.
- Las pruebas corren en Node con un `localStorage` simulado (`spec/helpers/localStorage.js`).

**Pruebas:** la guía usa Karma + ChromeHeadless. Aquí se ejecuta Jasmine directamente en Node,
que es lo más simple para lógica sin DOM. Si el docente exige Karma, los mismos `spec/*.js`
se pueden correr con `karma-jasmine` (hay que agregar un preprocesador ESM, por ejemplo
`karma-esbuild`, y un `karma.conf.js`). Las pruebas de componentes (`render`, `fireEvent`)
necesitan además `@testing-library/react` y un entorno de navegador; no están incluidas.

## Cambios y decisiones a tener en cuenta

1. **RUN de ejemplo:** `19011022K` (el de la pauta y el placeholder antiguo) **no es un RUN válido**
   (su dígito verificador correcto es `2`). El formulario ahora muestra `190110222`.
2. **Pagar** ahora es una compra *simulada*: exige sesión, descuenta el stock y vacía el carrito.
   En la versión HTML el botón no hacía nada.
3. **Imagen de producto:** el formulario admin permite subirla (máx. 300 KB, se guarda en localStorage).
4. **Dashboard:** las métricas son calculadas (productos, unidades, stock crítico, usuarios); no se
   portaron las tendencias inventadas (+18.4 %) ni la tabla de blogs de `admin.js`.
5. **Rutas con `HashRouter`** (`#/productos`): funciona abriendo el build desde cualquier carpeta o en GitHub Pages.
6. `BlogDetalle` usa `dangerouslySetInnerHTML` con el texto del propio equipo (`data/blogs.js`).
   No lo uses con contenido escrito por usuarios.
7. El proyecto usa **Create React App** para ajustarse a la herramienta de la guía; el código de los
   componentes React no depende del sistema de compilación.

## Subirlo a GitHub sin perder el repo actual

Lo más limpio es una rama nueva en el mismo repo:

```bash
git checkout -b react
# borra los .html/css/js antiguos (o muévelos a /legacy) y copia este proyecto
git add . && git commit -m "Migración a React + React-Bootstrap"
git push -u origin react
```
