// MinhaRota.js

import React from 'react';
import Layout from './Layout';
import Pedido from './Pedido/PedidoComponent'
import Produto from './Produto/ProdutoComponent'
import PedidoProduto from './PedidoProduto/PedidoProdutoComponent'

// ...importar outros componentes necessários

const MinhaRota = () => {
    return (
        <Layout>
            <Produto />
            <Pedido />
            <PedidoProduto />
        </Layout>
    );
};

export default MinhaRota;
