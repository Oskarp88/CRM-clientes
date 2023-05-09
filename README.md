## CRM Clientes

CRM Clientes es una aplicación web de gestión de pedidos y clientes. La aplicación está basada en una arquitectura de servidor-cliente, 
donde la API está construida con tecnologías como MongoDB, GraphQL, Apollo Server, JWT y Bcrypt-js, mientras que el cliente está construido 
con Apollo Client, Next.js, Formik, React, Yup y GraphQL.

### Características

- Panel de administración con acceso a todas las funcionalidades de la aplicación.
- Panel de vendedores con acceso a las funcionalidades de gestión de pedidos y clientes.
- Panel de clientes con acceso a la gestión de sus pedidos.
- Registro de vendedores y clientes.
- Sección de estadísticas de los mejores vendedores.

### Instalación y uso

1. Clona el repositorio: `git clone https://github.com/Oskarp88/CRM-clientes.git`
2. Instala las dependencias de la API: `cd crm-clientes/api && npm install`
3. Instala las dependencias del cliente: `cd ../cliente && npm install`
4. Crea un archivo `.env` en la carpeta `api` con las siguientes variables de entorno:


DB_MONGO=<URL de conexión a MongoDB>
SECRETA=<clave secreta para JWT>


5. Inicia el servidor de la API: `cd api && npm run dev`
6. Inicia el cliente: `cd ../client && npm run dev`
7. Abre la aplicación en tu navegador: `http://localhost:3000`

### Autor

- Oscar William Burgos Serpa <oskyburgos81@gmail.com>
