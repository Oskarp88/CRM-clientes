import React, { useReducer} from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';

import { 
    SELECCIONAR_CLIENTE, 
    SELECCIONAR_PRODUCTO, 
    CANTIDAD_PRODUCTOS } from '../../types';

const PedidoState = ({children}) => {

    //state de Pedidos
    const initialState = {
        cliente: [],
        productos: [],
        total: 0
    }
  
    const [state, dispacth ] = useReducer(PedidoReducer, initialState);
    // Modifica el cliente
    const agregarCliente = (cliente) => {
    //    console.log(cliente)
       dispacth({
          type: SELECCIONAR_CLIENTE,
          payload: cliente
       })
    }

    // Modifica los producto
    const agregarProducto = producto => {
        dispacth({
            type: SELECCIONAR_PRODUCTO,
            payload: producto
        })
    }

    return (
       <PedidoContext.Provider
          value={{agregarCliente, agregarProducto}}
       >
          {children}
       </PedidoContext.Provider>
    )
}

export default PedidoState;