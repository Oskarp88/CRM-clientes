import { gql, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';

const MEJORES_VENDEDORES = gql`
    query mejoresVendedores{
        mejoresVendedores{
        vendedor {
            nombre
            email
        }
        total
        }
    }

`;


const MejoresVendedores = () => {

    const {data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_VENDEDORES);
    
    useEffect(()=>{
       startPolling(1000);
       return () => {
        stopPolling();
       }
    }, [startPolling, stopPolling]);

    if(loading) return 'cargando...';

    const { mejoresVendedores } = data;

    const graficaVendedor = [];

    mejoresVendedores.map((vendedor, index) => {
        graficaVendedor[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total
        }
    });

    return ( 
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Mejores Vendedores</h1>
            <ResponsiveContainer width="100%" height={550}>
                <BarChart
                className='mt-10'
                width={600}
                height={500}
                data={graficaVendedor}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3182ce" />
                
                </BarChart>
            </ResponsiveContainer>
        </Layout>
     );
}
 
export default MejoresVendedores;