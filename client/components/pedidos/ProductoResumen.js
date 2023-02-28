import React, { useContext, useEffect, useState } from 'react'
import PedidoContext from '../../context/pedidos/PedidoContext';

const ProductoResumen = ({producto}) => {
    
    const pedido = useContext(PedidoContext);
    const { cantidadProducto, actualizarTotal } = pedido;

    const [cantidad, setCantidad] = useState(0);

    useEffect(()=>{
       actualizarCantidad();
       actualizarTotal();
    },[cantidad]);

    const actualizarCantidad = () => {
        const newProduct = {...producto, cantidad: Number(cantidad)}
        cantidadProducto(newProduct);
    }

    return ( 
       <div className='md:flex md:justify-between md:items-center mt-5'>
          <div className='md:w-2/4 mb-2 md:mb-0'>
             <p className='text-sm'>{producto.nombre}</p>
             <p>$ {producto.precio}</p>
          </div>
          <input 
             type='number'
             placeholder='Cantidad'
             className='shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4'
             onChange={(e)=> setCantidad(e.target.value)}
             value={cantidad}
          />
       </div>
     );
}
 
export default ProductoResumen;