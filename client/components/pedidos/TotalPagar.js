import React, { useContext } from 'react'
import PedidoContext from '../../context/pedidos/PedidoContext';

const TotalPagar = () => {
    const pedido = useContext(PedidoContext);
    const { total } = pedido;
    return ( 
        <div className='flex items-center mt-5 justify-between bg-white p-3 border-solid border-2 border-gray-200'>
           <h2 className='text-gray-800 text-lg'>Total a pagar</h2>
           <p className='text-gray-800 mt-0'>$ {new Intl.NumberFormat().format(total)}</p>
        </div>
     );
}
 
export default TotalPagar;