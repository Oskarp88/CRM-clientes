import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import AsingnarCliente from '../components/pedidos/AsignarCliente';
import AsignarProducto from '../components/pedidos/AsignarProducto';
import ResumenPedido from '../components/pedidos/ResumenPedido';
import TotalPagar from '../components/pedidos/TotalPagar';
import mostrarMensaje from '../config/mensaje';

//context de pedidos
import PedidoContext from '../context/pedidos/PedidoContext';

const NUEVO_PEDIDO = gql`
   mutation nuevoPedido($input: PedidoInput){
    nuevoPedido(input: $input) {
        id
    }
  }
`;

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor{
    obtenerPedidosVendedor{
      id
      pedido {
        id
        cantidad
        nombre
      }
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      total
      estado
    }
  }
`;

const NuevoPedido = () => {
    //utiliazar context y extraer sus valores
   const pedidoDeContext = useContext(PedidoContext);
   const { cliente, productos, total } = pedidoDeContext;
   
   
   const router = useRouter();
   const [mensaje, setMensaje] = useState(null);
   const [ nuevoPedido ] = useMutation(NUEVO_PEDIDO,  
    {
    update(cache, { data: { nuevoPedido } }){
        const { obtenerPedidosVendedor} = cache.readQuery({ query: OBTENER_PEDIDOS })
        
        cache.writeQuery({
            query: OBTENER_PEDIDOS,
            data: {
                obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
            }
        })
    }
});

    const validarPedido = () => {
        return !productos.every(product => product.cantidad > 0) || total === 0 || cliente.length === 0 ? " opacity-50 cursor-not-allowed " : "";
    }

    const crearNuevoPedido = async() => {
        //remover lo no deseado en productos
        const pedido = productos.map(({__typename, existencia, precio, creado, ...producto}) => producto)
        const { id } = cliente[0];
        try {
            const { data } = await nuevoPedido({
               variables:{
                input:{
                    cliente: id,
                    total,
                    pedido
                }
               }
            });
            Swal.fire(
              'Pedido creado',
              'El pedido ha sido enviado...',
              'success'
            );
            router.push("/pedidos");
        } catch (error) {
             console.log(error)
            setMensaje(error.message);
            setTimeout(()=>{
                setMensaje(null)
            }, 3000);
        }
    }
    
    return (  
        <Layout>
           <h1 className='text-2xl text-gray-800 font-light'>Crear Nuevo Pedido</h1>
           {mensaje && mostrarMensaje(mensaje)}
           <div className='flex justify-center mt-5'>
             <div className='w-full max-w-lg'>
                <AsingnarCliente />
                <AsignarProducto />
                <ResumenPedido />
                <TotalPagar />

                <button
                  type='button'
                  className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
                  onClick={()=> crearNuevoPedido()}
                >
                    REGISTRAR PEDIDO
                </button>
             </div>
           </div>
        </Layout>
    );
}
 
export default NuevoPedido;