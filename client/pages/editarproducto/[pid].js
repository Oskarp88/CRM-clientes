import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik';
import React, { useState } from 'react'
import Layout from '../../components/Layout';
import mostrarMensaje from '../../config/mensaje';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const OBTENER_PRODUCTO_ID = gql`
   query obtenerProductoId($id: ID!){       
    obtenerProductoId(id: $id){
        id
        nombre
        precio
        existencia
    }
  }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput){
        actualizarProducto(id: $id, input: $input){
            id
            nombre
            existencia
            precio
        }
    }
`;

const EditarProducto = () => {

    const router = useRouter();

    const {query: {pid}} = router;

    const { data, loading, error } = useQuery(OBTENER_PRODUCTO_ID,{
        variables: {
            id: pid
        }
    });

    const [mensaje, setMensaje] = useState(null);
    const [ actualizarProducto ] = useMutation(ACTUALIZAR_PRODUCTO)

    const schemaValidation = Yup.object({
        nombre: Yup.string().required("Debes ingresar un nombre"),
        precio: Yup.number().required("Debes ingresar un precio"),
        existencia: Yup.number().required("Ingresa la Cantidad de producto existente"),
    });
 
    if(loading) return 'Cargando...'
    console.log(data)
    const { obtenerProductoId } = data;

    const updateProdcut = async (valores) => {
        const { nombre, precio, existencia } = valores;

        try {
            const { data } = await actualizarProducto({
                variables: {
                    id: pid,
                    input: {
                        nombre,
                        precio,
                        existencia,
                    }
                }
            });
            Swal.fire(
                'Actualizado',
                `El producto ${data.actualizarProducto.nombre} ha sido actualizado`,
                'success'
            );
            router.push("/productos");
        } catch (error) {
            setMensaje(error.mensaje);
            setTimeout(()=>{
                setMensaje(null)
            }, 3000);
        }
    }

    return ( 
        <Layout>
          {mensaje && mostrarMensaje(mensaje)}
          <h1 className='text-2xl text-gray-800 font-light'>Editar Cliente</h1>
          <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg">
               <Formik
                  validationSchema={ schemaValidation }
                  enableReinitialize
                  initialValues={obtenerProductoId}
                  onSubmit={(valores)=>updateProdcut(valores) }
               >
                  {props=> {
                     // console.log(props);
                     return(
                        <form
                   className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                   onSubmit={props.handleSubmit}
                >
                   <div className='mb-4'>
                    <label className='blok text-gray text-sm font-bold mb-2' htmlForm="nombre">
                       Nombre
                    </label>

                    <input 
                       className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                       id='nombre'
                       type='text'
                       placeholder='Nombre Producto'
                       value={props.values.nombre}
                       onChange={props.handleChange}
                       onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.nombre && props.errors.nombre ? (
                     <div>
                        <p className='text-red-700 mb-2 text-xs'>{props.errors.nombre}</p>
                     </div>
                  ): null}
                  <div className='mb-4'>
                    <label className='blok text-gray text-sm font-bold mb-2' htmlForm="precio">
                       Precio
                    </label>

                    <input 
                       className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                       id='precio'
                       type='number'
                       placeholder='Precio del Producto'
                       value={props.values.precio}
                       onChange={props.handleChange}
                       onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.precio && props.errors.precio ? (
                     <div>
                        <p className='text-red-700 mb-2 text-xs'>{props.errors.precio}</p>
                     </div>
                  ): null}
                  <div className='mb-4'>
                    <label className='blok text-gray text-sm font-bold mb-2' htmlForm="existencia">
                       Existencia
                    </label>

                    <input 
                       className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                       id='existencia'
                       type='number'
                       placeholder='Cantidad de existencia'
                       value={props.values.existencia}
                       onChange={props.handleChange}
                       onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.existencia && props.errors.existencia ? (
                     <div>
                        <p className='text-red-700 mb-2 text-xs'>{props.errors.existencia}</p>
                     </div>
                  ): null}
                 
                  <input 
                     type="submit"
                     className='bg-gray-800 w-full mt-5 p-2 text-white uppecarse font-bold hover:bg-gray-900'
                     value='EDITAR PRODUCTO'
                  />
                </form>
                     )
                  }}
                
               </Formik>
            </div>
          </div>
       </Layout>
     );
}
 
export default EditarProducto;