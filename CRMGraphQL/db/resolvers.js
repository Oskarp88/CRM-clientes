const { buscarProductos, allProducts, productById, newProduct, updateProduct, deleteProduct } = require('../controllers/Productos.js');
const {  AllClients, AllClientsSeller, lookupClient, bestCustomers, newClient, updateClient, deleteClient } = require('../controllers/Clientes.js');
const { allOrders, allOrdersSeller, orderById, allOrderState, newOrder, updateOrder, deleteOrder } = require('../controllers/Pedidos.js');
const { bestSeller } = require('../controllers/Vendedor.js');
const { newUser, allUsers, authenticateUser } = require('../controllers/Usuario.js');
require('dotenv').config({ path: 'variable.env'});



//resolvers
const resolvers = {
   Query: {
      obtenerUsuario: allUsers,
      obtenerProductos: allProducts,
      obtenerProductoId: productById,
      obtenerClientes: AllClients,
      obtenerClientesVendedor: AllClientsSeller,
      buscarCliente: lookupClient,
      obtenerPedidos: allOrders,
      obtenerPedidosVendedor: allOrdersSeller,
      obtenerPedidoId: orderById,
      obtenerPedidosEstado: allOrderState,
      mejoresClientes: bestCustomers,
      mejoresVendedores: bestSeller,
      buscarProducto: buscarProductos
   },
   Mutation: {
      nuevoUsuario: newUser,
      autenticarUsuario: authenticateUser,
      nuevoProducto: newProduct,
      actualizarProducto: updateProduct,
      eliminarProducto: deleteProduct,
      nuevoCliente: newClient,
      actualizarCliente: updateClient,
      eliminarCliente: deleteClient,
      nuevoPedido: newOrder,
      actualizarPedido: updateOrder,
      eliminarPedido: deleteOrder
   }
}

module.exports = resolvers;