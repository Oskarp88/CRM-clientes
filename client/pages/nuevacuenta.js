import React, { useState } from 'react'
import Layout from '../components/Layout';

import * as Yup from 'yup';
import { useFormik } from 'formik';

import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const NUEVA_CUENTA = gql`
   mutation nuevoUsuario($input: UsuarioInput) {
   nuevoUsuario(input: $input){
      id
      nombre
      apellido
      email
   }
}
`;


const NuevaCuenta = () => {

   //state para el mensaje
   const [mensaje, guardarMensaje] = useState(null);

   //Mutation para crear nuevos usuarios
   const [ nuevoUsuario ] = useMutation(NUEVA_CUENTA);

   //Routing
   const router = useRouter();

   //validacion del formulario
   const formik = useFormik({
      initialValues: {
         nombre: '',
         apellido: '',
         email: '',
         password: '',
      },
      validationSchema: Yup.object({
         nombre: Yup.string().required("El nombre es obligatorio"),
         apellido: Yup.string().required("El apellido es obligatorio"),
         email: Yup.string().email("El email no es correcto").required("El email es requerido"),
         password: Yup.string().min(6,'minimo 6 caracteres').required("La contraseña es obligatoria")
      }),
      onSubmit: async valores => {
         // console.log('enviado');
         // console.log(valores);

         const { nombre, apellido, email, password } = valores;

         try {
            const { data} = await nuevoUsuario({
               variables: {
                  input: {
                     nombre,
                     apellido,
                     email,
                     password
                  }
               }
            });
            // console.log(data);
            //usuario creado
            // const { nombre, apellido } = data.nuevoUsuario;
            guardarMensaje(`El Usuario ${data.nuevoUsuario.nombre} ${data.nuevoUsuario.apellido} ha sido registrado correctamente.`);
           
            setTimeout(()=>{
               guardarMensaje(null);
               router.push('/login');
            }, 3000);
            //redirigir para iniciar sesion
         } catch (error) {
            // console.log(error.message);
            guardarMensaje(error.message);
            setTimeout(()=>{
               guardarMensaje(null);
            }, 3000);
         }
      }
   });

   const mostrarMensaje = () => {
      return(
         <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
            {mensaje}
         </div>
      )
   }
   
    return ( 
       <>
         <Layout>
            {mensaje && mostrarMensaje()}
           <h1 className='text-center text-2xl text-white font-light'>Crear Nueva Cuenta</h1>
            <div className='flex justify-center mt-5'>
                <form 
                   className='bg-white rouded shadow-md px-8 pt-6 pb-8 mb-4'
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
                       placeholder='Nombre Usuario'
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
                       placeholder='Apellido Usuario'
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
                    <label className='blok text-gray text-sm font-bold mb-2' htmlForm="email">
                       Email
                    </label>

                    <input 
                       className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                       id='email'
                       type='email'
                       placeholder='Email Usuario'
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
                    <label className='blok text-gray text-sm font-bold mb-2' htmlForm="password">
                       Password
                    </label>

                    <input 
                       className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                       id='password'
                       type='password'
                       placeholder='Password Usuario'
                       value={formik.values.password}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.password && formik.errors.password ? (
                     <div>
                        <p className='text-red-700 mb-2 text-xs'>{formik.errors.password}</p>
                     </div>
                  ): null}
                  <input 
                     type='submit'
                     className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                     value='Crear Cuenta'
                  />
                </form>
            </div>
         </Layout>
       </>
     );
}
 
export default NuevaCuenta;