
import React, { useState } from 'react'
import Layout from "../../components/Layout";
import * as Yup from 'yup';
import mostrarMensaje from '../../config/mensaje';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { Formik } from 'formik'
import Swal from 'sweetalert2';

const BUSCAR_CLIENTE = gql`
    query buscarCliente($id: ID!){
        buscarCliente(id: $id) {
            id
            nombre
            email
            apellido
            empresa
            email
            telefono
        }
    }
`;


const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput){
        actualizarCliente(id: $id, input: $input){
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;

const EditarCliente = () => {

    const router = useRouter();

    const { query: {pid} } = router;
   //  console.log(pid, 'id router')
    const { data, loading, error} = useQuery(BUSCAR_CLIENTE, {
        variables: {
            id: pid
        }
    });
   //  console.log(loading)
   //  console.log(data);
   //  console.log(error)
    const [mensaje, setMensaje] = useState(null);
    const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLIENTE);

    const schemaValidation = Yup.object({
               nombre: Yup.string().required("Debes ingresar un nombre"),
               apellido: Yup.string().required("Debes ingresar un Apellido"),
               empresa: Yup.string().required("La empresa es requerida"),
               email: Yup.string().email("email no válido").required("El email es requerido")
           })
    
    if(loading) return "cargando..."
    const { buscarCliente} = data;

    //actualizar cliente
    const updateClient = async (valores) => {
       const { nombre, apellido, empresa, email, telefono } = valores;

       try {
         const { data } = await actualizarCliente({
            variables: {
               id: pid,
               input: {
                  nombre,
                  apellido,
                  empresa,
                  email,
                  telefono
               }
            }
         });
          //console.log(data);
                Swal.fire(
                  'Actualizado!',
                  `El cliente ${data.actualizarCliente.nombre} ${data.actualizarCliente.apellido} ha sido actualizado exitosamente.`,
                  'success'
                )
                    router.push("/")
       } catch (error) {
         setMensaje(error.message)
            setTimeout(()=>{
               setMensaje(null);
            },3000);
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
                  initialValues={buscarCliente}
                  onSubmit={(valores)=>updateClient(valores) }
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
                                 placeholder='Nombre Cliente'
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
                              <label className='blok text-gray text-sm font-bold mb-2' htmlForm="apellido">
                                 Apellido
                              </label>

                              <input 
                                 className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                 id='apellido'
                                 type='text'
                                 placeholder='Apellido Cliente'
                                 value={props.values.apellido}
                                 onChange={props.handleChange}
                                 onBlur={props.handleBlur}
                              />
                           </div>
                           {props.touched.apellido && props.errors.apellido ? (
                              <div>
                                 <p className='text-red-700 mb-2 text-xs'>{props.errors.apellido}</p>
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
                                 value={props.values.empresa}
                                 onChange={props.handleChange}
                                 onBlur={props.handleBlur}
                              />
                           </div>
                           {props.touched.empresa && props.errors.empresa ? (
                              <div>
                                 <p className='text-red-700 mb-2 text-xs'>{props.errors.empresa}</p>
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
                                 value={props.values.email}
                                 onChange={props.handleChange}
                                 onBlur={props.handleBlur}
                              />
                           </div>
                           {props.touched.email && props.errors.email ? (
                              <div>
                                 <p className='text-red-700 mb-2 text-xs'>{props.errors.email}</p>
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
                                 value={props.values.telefono}
                                 onChange={props.handleChange}
                                 onBlur={props.handleBlur}
                              
                              />
                           </div>
                           <input 
                              type="submit"
                              className='bg-gray-800 w-full mt-5 p-2 text-white uppecarse font-bold hover:bg-gray-900'
                              value='EDITAR CLIENTE'
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
 
export default EditarCliente;