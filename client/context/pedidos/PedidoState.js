import React, { useReducer} from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';

import { 
    SELECCIONAR_CLIENTE, 
    SELECCIONAR_PRODUCTO, 
    CANTIDAD_PRODUCTOS,
    ACTUALIZAR_TOTAL
} from '../../types';

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
        let newState;
        if(state.productos.length > 0 ){
            //tomar del segundo arreglo, una copia para asignarlo al primero
            newState = producto.map(product => {
                const newObject = state.productos.find(productState => productState.id === product.id);
                return {...product, ...newObject}
            })
        }else{
            newState = producto;
        }

        dispacth({
            type: SELECCIONAR_PRODUCTO,
            payload: newState
        })
    }

    //Modifica las cantidades de los productos
    const cantidadProducto = (newProduct) => {
        dispacth({
            type: CANTIDAD_PRODUCTOS,
            payload: newProduct
        })
    }

    const actualizarTotal = () => {
       dispacth({
         type: ACTUALIZAR_TOTAL
       })
    }

    return (
       <PedidoContext.Provider
          value={{
            cliente: state.cliente,
            productos: state.productos,
            total: state.total,
            agregarCliente, 
            agregarProducto, 
            cantidadProducto,
            actualizarTotal
        }}
       >
          {children}
       </PedidoContext.Provider>
    )
}

export default PedidoState;