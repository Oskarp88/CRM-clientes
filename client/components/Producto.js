import { gql, useMutation } from '@apollo/client';
import React from 'react'
import Swal from 'sweetalert2';
import Router from 'next/router';

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!){
       eliminarProducto(id: $id)
    }
`;

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

const Producto = ({product}) => {

    const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO,{
        update(cache){
            const { obtenerProductos } = cache.readQuery({query: OBTENER_PRODUCTOS});
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter(productCurrent => productCurrent.id !== product.id)
                }
            })
        }
    });
    const {nombre, precio, existencia, id } = product;

    const eliminarProductoID = () => {
       Swal.fire({
        title: '¿Deseas Eliminar a este Producto?',
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
                const { data } = await eliminarProducto({
                    variables: {
                        id
                    }
                });
                Swal.fire(
                    'Eliminado!',
                    `${data.eliminarProducto} correctamente`,
                    'success'
                )
            } catch (error) {
                console.log(error);
            }
          }
       })
    }

    const editarProducto = () => {
        Router.push({
            pathname: "/editarproducto/[id]",
            query: { id }
        })
    }

    return ( 
        <tr >
            <td className='border px-4 py-2'>{nombre}</td>
            <td className='border px-4 py-2'>{new Intl.NumberFormat().format(precio)} $</td>
            <td className='border px-4 py-2'>{existencia}</td>
            <td className='border px-4 py-2'>
                <button
                type="button"
                className='flex justify-center items-center bg-red-800 py-2 px4 w-full text-white rounded text-xs uppercase font-bold'
                onClick={()=> eliminarProductoID()}
                >
                    Eliminar
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className='w-5 h-5 ml-2' xmlns="http://www.w3.org/2000/svg" ariaHidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                </button>
            </td>
            <td className='border px-4 py-2'>              
                <button
                    type="button"
                    className='flex justify-center items-center bg-green-900 py-2 px4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={()=> editarProducto()}
                >
                    Editar 
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ariaHidden="true" className='w-5 h-5 ml-2'>
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"></path>
                    </svg>
                </button>
            </td>
        </tr> 
    );
}
 
export default Producto;