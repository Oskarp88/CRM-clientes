import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput){
        actualizarPedido(id: $id, input: $input){
            estado
        }
    }
`;

const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!){
      eliminarPedido(id: $id)
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

const Pedido = ({pedido}) => {
    const { id, total, cliente: { nombre, apellido, telefono, email },cliente, estado } = pedido;
    const [ actualizarPedido ] = useMutation(ACTUALIZAR_PEDIDO);
    const [ eliminarPedido ] = useMutation(ELIMINAR_PEDIDO,{
        update(cache){
            const { obtenerPedidosVendedor } = cache.readQuery({query: OBTENER_PEDIDOS});
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter(pedidoCurrent => pedidoCurrent.id !== id)
                }
            })
        }
    });
    const [ estadoPedido, setEstadoPedido] = useState(estado);
    const [ clase, setClase ] = useState('');

    useEffect(() => {
        if(estadoPedido){
            setEstadoPedido(estadoPedido);
        }
        clasePedido();
    },[estadoPedido]);

    //modificando el color de acuerdo el estado
    const clasePedido = () => {
       if(estadoPedido === 'PENDIENTE'){
           setClase('border-yellow-500');
       }else if(estadoPedido === 'COMPLETADO'){
           setClase('border-green-500');
       }else{
           setClase('border-red-500');
       }
    }

    const cambiarEstadoPedido = async (newState) => {
        try {
           const { data } = await actualizarPedido({
            variables:{
                id,
                input: {
                    estado: newState,
                    cliente: cliente.id
                }
            }
           });
           setEstadoPedido(data.actualizarPedido.estado);
        } catch (error) {
            console.log(Error)
        }
    }

    const deletePedido = () => {
        Swal.fire({
            title: '¿Deseas Eliminar a este Pedido?',
            text: "Esta accion no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!', 
            cancelButtonText: 'No, Cancelar'
           }).then( async(result) => {
              if(result.isConfirmed){
                try {
                    const { data } = await eliminarPedido({
                        variables: {
                            id
                        }
                    });
                    Swal.fire(
                        'Eliminado!',
                        `${data.eliminarPedido} correctamente`,
                        'success'
                    )
                } catch (error) {
                    console.log(error);
                }
              }
           })
    }

    return (  
        <div className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
              <p className='font-bold text-gray-800'>Cliente: {nombre} {apellido}</p>
              {email && (
                <p className='flex items-center my-2'>
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ariaHidden="true" className='w-5 h-5 mr-2'>
                      <path clipRule="evenodd" fillRule="evenodd" d="M2.106 6.447A2 2 0 001 8.237V16a2 2 0 002 2h14a2 2 0 002-2V8.236a2 2 0 00-1.106-1.789l-7-3.5a2 2 0 00-1.788 0l-7 3.5zm1.48 4.007a.75.75 0 00-.671 1.342l5.855 2.928a2.75 2.75 0 002.46 0l5.852-2.926a.75.75 0 10-.67-1.342l-5.853 2.926a1.25 1.25 0 01-1.118 0l-5.856-2.928z"></path>
                    </svg>
                   {email} 
                </p>
              )}
              {telefono && (
                <p className='flex items-center my-2'>
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className='w-5 h-5 mr-2'>
                      <path clip-rule="evenodd" fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"></path>
                    </svg>
                    {telefono}
                </p>
              )
              }
              <h2 className='text-gray-800 font-bold mt-10'>Estado Pedido: {estadoPedido}</h2>
              <select
                 className='mt-2 appearance-none bg-blue-600 border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold'
                 value={estadoPedido}
                 onChange={e=> cambiarEstadoPedido(e.target.value)}
              >
                  <option value="COMPLETADO">COMPLETADO</option>
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="CANCELADO">CANCELADO</option>
              </select>
           </div>
            <div>
               <h2 className='text-gray-800 font-bold mt-2'>Resumen del Pedido</h2>
                {pedido.pedido.map( articulo => (
                    <div>
                        <p className='text-sm text-gray-600'>Producto: {articulo.nombre}</p>
                        <p className='text-sm text-gray-600'>Cantidad: {articulo.cantidad}</p>
                    </div>
                ))}
                <p className='text-gray-800 mt-3 font-bold'> Total a pagar:
                   <span className='font-ligth'> $ {total}</span>
                </p>
                <button 
                   className='uppercase text-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight'
                   onClick={()=>deletePedido()}
                >
                   Eliminar Pedido
                   <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ariaHidden="true" className='w-5 h-5 ml-2'>
                        <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z"></path>
                        <path clipRule="evenodd" fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zm5.22 1.72a.75.75 0 011.06 0L10 10.94l1.72-1.72a.75.75 0 111.06 1.06L11.06 12l1.72 1.72a.75.75 0 11-1.06 1.06L10 13.06l-1.72 1.72a.75.75 0 01-1.06-1.06L8.94 12l-1.72-1.72a.75.75 0 010-1.06z"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}
 
export default Pedido;