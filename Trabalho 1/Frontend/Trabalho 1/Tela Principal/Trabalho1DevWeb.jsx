// MinhaRota.js

import React from 'react';
import Layout from './Layout';
import Pedido from './Pedido/PedidoComponent'
import Produto from './Produto/ProdutoComponent'

// ...importar outros componentes necessários

const MinhaRota = () => {
    return (
        <Layout>
            <Produto />
            <Pedido />

        </Layout>
    );
};

export default MinhaRota;
