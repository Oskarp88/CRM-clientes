import Link from 'next/link';
import React from 'react'
import Layout from '../components/Layout';

const Pedidos = () => {
    return ( 
        <div>
            <Layout>
              <h1 className='text-2xl text-gray-800 font-light'>Pedidos</h1>
              <Link href={'/nuevo_pedido'} className='bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold'>
                 Nuevo Pedido
              </Link>
            </Layout>
        </div>
     );
}
 
export default Pedidos;