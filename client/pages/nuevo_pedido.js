import React, { useContext } from 'react'
import Layout from '../components/Layout';
import AsingnarCliente from '../components/pedidos/AsignarCliente';
import AsignarProducto from '../components/pedidos/AsignarProducto';

//context de pedidos
import PedidoContext from '../context/pedidos/PedidoContext';

const NuevoPedido = () => {
    //utiliazar context y extraer sus valores
    const pedidoContext = useContext(PedidoContext);
    
    return (  
        <Layout>
           <h1 className='text-2xl text-gray-800 font-light'>Crear Nuevo Pedido</h1>
           <AsingnarCliente />
           <AsignarProducto />
        </Layout>
    );
}
 
export default NuevoPedido;