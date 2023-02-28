import { gql, useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos{
      obtenerProductos {
        id
        nombre
        precio
        existencia
        creado
      }
    }
`;

const AsignarProducto = () => {

    const [ productos, setProducto ] = useState([]);
    const pedidoContex = useContext(PedidoContext);
    const { agregarProducto } = pedidoContex;

    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);
    
    useEffect(()=>{
       // funcion para pasar a pedidoState
       agregarProducto(productos);
    },[productos])

    const seleccionarProducto = producto => {
         setProducto(producto)
    }
    
    if(loading) return null;
    const { obtenerProductos } = data
    
    return ( 
        <>
         <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>2.-Seleccion o busca los producto</p>
         <Select
          className='mt-3'
          options={ obtenerProductos }
          isMulti={true}
          onChange={ opcion => seleccionarProducto(opcion)}
          getOptionValue={ opciones => opciones.id}
          getOptionLabel={ opciones => `${opciones.nombre} - ${opciones.existencia} Disponibles`}
          placeholder='Seleccione Producto'
          noOptionsMessage={() => "No hay resultados"}
       />
      </>
     );
}
 
export default AsignarProducto;