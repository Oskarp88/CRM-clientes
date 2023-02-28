import { gql, useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_CLIENTE_USUARIO = gql` 
    query obtenerClientesVendedor{
      obtenerClientesVendedor {
        id
        nombre
        apellido
        empresa
        email
      }
}
`;

const AsingnarCliente = () => {
    const [cliente, setCliente] = useState([]);
    const pedidoContext = useContext(PedidoContext);
    const { agregarCliente } = pedidoContext;
    
    const { data, loading, error } = useQuery(OBTENER_CLIENTE_USUARIO);

    useEffect(()=>{
       agregarCliente(cliente)
    }, [cliente]);

    const seleccionarCliente  = cliente => {
        setCliente(cliente);
    }

    if(loading) return null;
    const { obtenerClientesVendedor } = data;

    return ( 
      <>
         <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>Asigna un Cliente al Pedido</p>
         <Select
          className='mt-3'
          options={ obtenerClientesVendedor }
          isMulti={true}
          onChange={ opcion => seleccionarCliente(opcion)}
          getOptionValue={ opciones => opciones.id}
          getOptionLabel={ opciones => opciones.nombre}
          placeholder='Seleccione Cliente'
          noOptionsMessage={() => "No hay resultados"}
       />
      </>

       
     );
}
 
export default AsingnarCliente;