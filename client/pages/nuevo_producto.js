import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import mostrarMensaje from '../config/mensaje';
import { useRouter } from 'next/router';

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput){
        nuevoProducto(input: $input){
            id
            nombre
            existencia
            precio
            creado
        }
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

const nuevoProducto = () => {
    const router = useRouter();
    const [ mensaje, setMensaje] = useState(null);
    const [ nuevoProducto ] = useMutation(NUEVO_PRODUCTO, 
        {
        update(cache, { data: { nuevoProducto } }){
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS })
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: 0,
            existencia: 0,
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required("Debes ingresar un nombre"),
            precio: Yup.number().required("Debes ingresar un precio"),
            existencia: Yup.number().required("Ingresa la Cantidad de producto existente"),
        }),
        onSubmit: async valores => {
            const { nombre, precio , existencia } = valores;

            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            precio,
                            existencia
                        }
                    }
                });
                // console.log(data);
                Swal.fire(
                    'Producto Creado!',
                    `$El producto  "${data.nuevoProducto.nombre}" ha sido Creado`,
                    'success'
                  )
                setTimeout(()=>{
                    router.push("/productos")
                },1000);
            } catch (error) {
                setMensaje(error.message)
                setTimeout(()=>{
                    setMensaje(null);
                },3000);
            }
        }
    })

    return ( 
        <Layout>
            {mensaje && mostrarMensaje(mensaje)}
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Cliente</h1>
            
          <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg">
                <form
                   className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                   onSubmit={formik.handleSubmit}
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
                       value={formik.values.nombre}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.nombre && formik.errors.nombre ? (
                     <div>
                        <p className='text-red-700 mb-2 text-xs'>{formik.errors.nombre}</p>
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
                       value={formik.values.precio}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.precio && formik.errors.precio ? (
                     <div>
                        <p className='text-red-700 mb-2 text-xs'>{formik.errors.precio}</p>
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
                       value={formik.values.existencia}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.existencia && formik.errors.existencia ? (
                     <div>
                        <p className='text-red-700 mb-2 text-xs'>{formik.errors.existencia}</p>
                     </div>
                  ): null}
                 
                  <input 
                     type="submit"
                     className='bg-gray-800 w-full mt-5 p-2 text-white uppecarse font-bold hover:bg-gray-900'
                     value='CREAR PRODUCTO'
                  />
                </form>
            </div>
          </div>
        </Layout>
     );
}
 
export default nuevoProducto;