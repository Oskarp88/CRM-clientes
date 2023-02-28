import React, { useEffect, useState } from 'react';

const Pedido = ({pedido}) => {
    const { id, total, cliente, estado } = pedido;
    console.log(pedido)
    const [ estadoPedido, setEstadoPedido] = useState(estado);

    useEffect(() => {
        if(estadoPedido){
            setEstadoPedido(estadoPedido);
        }
    },[estadoPedido]);
    return (  
        <div className='mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg'>
            <div>
              <p className='font-bold text-gray-800'>Cliente: {cliente}</p>
              <h2 className='text-gray-800 font-bold mt-10'>Estado Pedido: {estadoPedido}</h2>
              <select
                 className='mt-2 appearance-none bg-blue-600 border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold'
                 value={estadoPedido}
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