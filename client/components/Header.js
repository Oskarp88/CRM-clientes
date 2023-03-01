import { useQuery, gql } from '@apollo/client';
import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';

const OBTENER_USUARIO = gql`
    query obtenerUsuario{
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }
`;


const Header = () => {
    const router = useRouter();
    const { data, loading, error } = useQuery(OBTENER_USUARIO);
    
    if(loading) return "cargando...";

    const { nombre, apellido } = data.obtenerUsuario;

    if(!data.obtenerUsuario) return router.push("/login");

    const cerrarSesion = () => {
        
        localStorage.removeItem('token');
        router.push('/login');
       
    }

    return (  
        <div className="sm:flex sm:justify-between mb-3">
           <p className="mr-2 mb-3 lg:mb-0">Hola: {nombre} {apellido}</p>
           <button 
              type="button"
              className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md'
              onClick={() => cerrarSesion()}
           >
              Cerrar Sesión
           </button>
        </div>
    );
}
 
export default Header;