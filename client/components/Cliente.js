import { gql, useMutation } from '@apollo/client';
import  Router  from 'next/router';
import React from 'react';
import Swal from 'sweetalert2';

const ELIMINAR_CLIENTE = gql`
    mutation elimicarCliente($id: ID!){
      eliminarCliente(id: $id)
   }
`;

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

const Cliente = ({cliente}) => {

    const [ eliminarCliente ] = useMutation(ELIMINAR_CLIENTE,{
        update(cache ){
            const { obtenerClientesVendedor } = cache.readQuery({query: OBTENER_CLIENTE_USUARIO});

            cache.writeQuery({
                query: OBTENER_CLIENTE_USUARIO,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter(clientActual => clientActual.id !==  cliente.id)
                }
            })
        }
    });
    const { id, nombre, apellido, empresa, email } = cliente;

    const eliminarClienteID = () => {
        Swal.fire({
            title: '¿Deseas Eliminar a este cliente?',
            text: "Esta accion no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!', 
            cancelButtonText: 'No, Cancelar'
          }).then(async(result) => {
            if (result.isConfirmed) {

              try {
                //elimanar por id
                const { data } = await eliminarCliente({
                    variables: {
                        id: id
                    }
                });
                Swal.fire(
                    'Eliminado!',
                    `${data.eliminarCliente} correctamente`,
                    'success'
                  )
              } catch (error) {
                console.log(error)
              }
            }
          })
    }
    
    const editarCliente = () => {
      Router.push({
        pathname: "/editarcliente/[id]",
        query: { id }
      })
    }
    return ( 
        <tr >
            <td className='border px-4 py-2'>{nombre} {apellido}</td>
            <td className='border px-4 py-2'>{empresa}</td>
            <td className='border px-4 py-2'>{email}</td>
            <td className='border px-4 py-2'>
                <button
                   type="button"
                   className='flex justify-center items-center bg-red-800 py-2 px4 w-full text-white rounded text-xs uppercase font-bold'
                   onClick={()=> eliminarClienteID()}
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
                    onClick={()=> editarCliente()}
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
 
export default Cliente;