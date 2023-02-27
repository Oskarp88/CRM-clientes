import { useFormik } from 'formik';
import React, { useState } from 'react'
import Layout from "../components/Layout";
import * as Yup from 'yup';
import mostrarMensaje from '../config/mensaje';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput){
        nuevoCliente(input: $input){
            id
            nombre
            apellido
            empresa
            email
            telefono
        }
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





const nuevo_cliente = () => {

    const router = useRouter();
    const [mensaje, setMensaje] = useState(null);
    const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE,{
        update(cache, { data: { nuevoCliente }}){
            // Obtener el objeto de cache que deseamos actualizar
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTE_USUARIO})
            // Reescribimos el cache ( el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_CLIENTE_USUARIO,
                data:{
                    obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono:'',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required("Debes ingresar un nombre"),
            apellido: Yup.string().required("Debes ingresar un Apellido"),
            empresa: Yup.string().required("La empresa es requerida"),
            email: Yup.string().email("email no válido").required("El email es requerido")
        }),
        onSubmit: async valores => {
            const { nombre, apellido , empresa, email, telefono } = valores;

            try {
                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
                });
                // console.log(data);
                setMensaje(`El cliente ${data.nuevoCliente.nombre} ${data.nuevoCliente.apellido} ha sido registrado exitosamente.`);

                setTimeout(()=>{
                    setMensaje(null)
                    router.push("/")
                },3000);
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
                       placeholder='Nombre Cliente'
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
                    <label className='blok text-gray text-sm font-bold mb-2' htmlForm="apellido">
                       Apellido
                    </label>

                    <input 
                       className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                       id='apellido'
                       type='text'
                       placeholder='Apellido Cliente'
                       value={formik.values.apellido}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.apellido && formik.errors.apellido ? (
                     <div>
                        <p className='text-red-700 mb-2 text-xs'>{formik.errors.apellido}</p>
                     </div>
                  ): null}
                  <div className='mb-4'>
                    <label className='blok text-gray text-sm font-bold mb-2' htmlForm="empresa">
                       Empresa
                    </label>

                    <input 
                       className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                       id='empresa'
                       type='text'
                       placeholder='Empresa Cliente'
                       value={formik.values.empresa}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.empresa && formik.errors.empresa ? (
                     <div>
                        <p className='text-red-700 mb-2 text-xs'>{formik.errors.empresa}</p>
                     </div>
                  ): null}
                   <div className='mb-4'>
                    <label className='blok text-gray text-sm font-bold mb-2' htmlForm="email">
                       Email
                    </label>

                    <input 
                       className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                       id='email'
                       type='email'
                       placeholder='Email Cliente'
                       value={formik.values.email}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email ? (
                     <div>
                        <p className='text-red-700 mb-2 text-xs'>{formik.errors.email}</p>
                     </div>
                  ): null}
                  <div className='mb-4'>
                    <label className='blok text-gray text-sm font-bold mb-2' htmlForm="telefono">
                       Teléfono
                    </label>

                    <input 
                       className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                       id='telefono'
                       type='tel'
                       placeholder='Telefono Cliente'
                       value={formik.values.telefono}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       
                    />
                  </div>
                  <input 
                     type="submit"
                     className='bg-gray-800 w-full mt-5 p-2 text-white uppecarse font-bold hover:bg-gray-900'
                     value='REGISTRAR CLIENTE'
                  />
                </form>
            </div>
          </div>
       </Layout>
     );
}
 
export default nuevo_cliente;