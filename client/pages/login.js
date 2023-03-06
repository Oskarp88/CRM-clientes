import React, { useState } from 'react'
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import mostrarMensaje from '../config/mensaje';
import { useRouter } from 'next/router';

const AUTENTICAR_USUARIO = gql`
   mutation  autenticarUsuario($input: AutenticarInput){
     autenticarUsuario(input: $input){
       token
     }
}
`;



const Login = () => {

   const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);
   const [mensaje, guardarMensaje] = useState(null);

   const router = useRouter();

   

   const formik = useFormik({
      initialValues: {
         email: '',
         password: '',
      },
      validationSchema: Yup.object({
         email: Yup.string().email("Email no valido").required("El email es requerido"),
         password: Yup.string().required("Password es requerido")
      }),
      onSubmit:  async valores => {
         console.log(valores)
         const { email , password } = valores;

         try {
           const { data } = await autenticarUsuario({
            variables: {
               input: {
                  email,
                  password
               }
            },
            
           });
          
           guardarMensaje(`Autenticacion exitosa`);

           setTimeout(() => {
            const { token } = data.autenticarUsuario;
            localStorage.setItem('token', token);
           }, 2000);

           setTimeout(()=>{
              guardarMensaje(null);
              router.push('/');
           },1500);
         } catch (error) {
            console.log(error)
            guardarMensaje(error.message);
            setTimeout(()=>{
               guardarMensaje(null)
            },3000)
         }
      }
   });
   
   

    return ( 
       <>
         <Layout>
           {mensaje && mostrarMensaje(mensaje)}
           <h1 className='text-center text-2xl text-white font-light'>login</h1>
            <div className='flex justify-center mt-5'>
                <form className='bg-white rouded shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={formik.handleSubmit}>
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
                     value='Iniciar Sesión'
                  />                  
                </form>
            </div>
         </Layout>
       </>
     );
}
 
export default Login;