import React, { useState, useEffect } from 'react';
import { Button, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Modal, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import styles from './PedidoProdutoComponent.module.css';

function PedidoProdutoComponent() {
    const [pedidoProdutos, setPedidoProdutos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPedidoProduto, setSelectedPedidoProduto] = useState(null);
    const [id_produto, setId_produto] = useState('');
    const [id_pedido, setId_pedido] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [preco_unitario, setPreco_unitario] = useState('');
    const [desconto, setDesconto] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        id_produto: '',
        id_pedido: '',
        quantidade: '',
        preco_unitario: '',
        desconto: ''
    });

    useEffect(() => {
        carregarPedidoProdutos();
        carregarProdutos();
        carregarPedidos();
    }, []);

    function carregarPedidoProdutos() {
        axios.get('https://devweb.jeanhenrique.site/pedido_produto')
            .then(response => {
                setPedidoProdutos(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar pedidos de produtos:', error);
            });
    }

    function carregarProdutos() {
        axios.get('https://devweb.jeanhenrique.site/produto')
            .then(response => {
                setProdutos(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar produtos:', error);
            });
    }

    function carregarPedidos() {
        axios.get('https://devweb.jeanhenrique.site/pedido')
            .then(response => {
                setPedidos(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar pedidos:', error);
            });
    }

    function adicionarPedidoProduto() {
        if (!validarCampos()) {
            return;
        }

        const pedidoProduto = {
            id_produto: id_produto,
            id_pedido: id_pedido,
            quantidade: parseInt(quantidade),
            preco_unitario: parseFloat(preco_unitario),
            desconto: parseFloat(desconto)
        };


        axios.post('https://devweb.jeanhenrique.site/pedido_produto/add', pedidoProduto)
            .then(() => {
                carregarPedidoProdutos(); // Recarrega os dados da tabela após adicionar o pedido de produto
                setShowModal(false);
                window.location.reload(); // Recarrega a página após atualizar o pedido

            })
            .catch(error => {
                console.error('Erro ao adicionar pedido de produto:', error);
            });
    }


    function editarPedidoProduto(pedidoProduto) {
        setIsEditing(true);
        setSelectedPedidoProduto(pedidoProduto);
        setId_produto(pedidoProduto.id_produto);
        setId_pedido(pedidoProduto.id_pedido);
        setQuantidade(pedidoProduto.quantidade.toString());
        setPreco_unitario(pedidoProduto.preco_unitario.toString());
        setDesconto(pedidoProduto.desconto.toString());
        setShowModal(true);
    }

    function atualizarPedidoProduto() {
        setIsEditing(false);

        if (!validarCampos()) {
            return;
        }

        const pedidoProdutoAtualizado = {
            id_produto: parseInt(id_produto),
            id_pedido: parseInt(id_pedido),
            quantidade: parseInt(quantidade),
            preco_unitario: parseFloat(preco_unitario),
            desconto: parseFloat(desconto)
        };

        axios.put(`https://devweb.jeanhenrique.site/pedido_produto/update/${selectedPedidoProduto.id_pedido_produto}`, pedidoProdutoAtualizado)
            .then(() => {
                carregarPedidoProdutos(); // Recarrega os dados da tabela após atualizar o pedido de produto
                setShowModal(false);
                window.location.reload(); // Recarrega a página após atualizar o pedido

            })
            .catch(error => {
                console.error('Erro ao atualizar pedido de produto:', error);
            });
    }

    function excluirPedidoProduto(id_pedido_produto) {
        if (window.confirm('Deseja realmente excluir o pedido de produto?')) {
            axios.delete(`https://devweb.jeanhenrique.site/pedido_produto/delete/${id_pedido_produto}`)
                .then(() => {
                    carregarPedidoProdutos(); // Recarrega os dados da tabela após excluir o pedido de produto
                    window.location.reload(); // Recarrega a página após atualizar o pedido

                })
                .catch(error => {
                    console.error('Erro ao excluir pedido de produto:', error);
                });
        }
    }

    function validarCampos() {
        let isValid = true;
        const errors = {
            id_produto: '',
            id_pedido: '',
            quantidade: '',
            preco_unitario: '',
            desconto: ''
        };

        if (!id_produto) {
            errors.id_produto = 'O campo ID Produto é obrigatório.';
            isValid = false;
        }

        if (!id_pedido) {
            errors.id_pedido = 'O campo ID Pedido é obrigatório.';
            isValid = false;
        }

        if (isNaN(quantidade)) {
            errors.quantidade = 'O campo Quantidade deve conter apenas números.';
            isValid = false;
        }

        if (isNaN(preco_unitario)) {
            errors.preco_unitario = 'O campo Preço Unitário deve conter apenas números.';
            isValid = false;
        }

        if (isNaN(desconto)) {
            errors.desconto = 'O campo Desconto deve conter apenas números.';
            isValid = false;
        }

        setErrorMessages(errors);
        return isValid;
    }

    return (
        <div className={styles.container}>
            <Button style={{ marginBottom: '0.5%', width: '210px', fontSize: '12px', paddingLeft: '0.5%', paddingRight: '0.5%' }} variant="contained" onClick={() => setShowModal(true)} disabled={pedidoProdutos.length >= 5}>Adicionar produtos aos pedidos</Button>
            {errorMessages.id_produto && <p>{errorMessages.id_produto}</p>}
            {errorMessages.id_pedido && <p>{errorMessages.id_pedido}</p>}
            {errorMessages.quantidade && <p>{errorMessages.quantidade}</p>}
            {errorMessages.preco_unitario && <p>{errorMessages.preco_unitario}</p>}
            {errorMessages.desconto && <p>{errorMessages.desconto}</p>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Relação Pedido Produto</TableCell>
                            <TableCell>ID Produto</TableCell>
                            <TableCell>ID Pedido</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Preço Unitário</TableCell>
                            <TableCell>Desconto</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(pedidoProdutos) && pedidoProdutos.slice(0, 5).map(pedidoProduto => (
                            <TableRow key={pedidoProduto.id_pedido_produto}>
                                <TableCell>{pedidoProduto.id_pedido_produto}</TableCell>
                                <TableCell>{pedidoProduto.id_produto}</TableCell>
                                <TableCell>{pedidoProduto.id_pedido}</TableCell>
                                <TableCell>{pedidoProduto.quantidade}</TableCell>
                                <TableCell>{pedidoProduto.preco_unitario}</TableCell>
                                <TableCell>{pedidoProduto.desconto}</TableCell>
                                <TableCell>
                                    <Button onClick={() => editarPedidoProduto(pedidoProduto)}>Editar</Button>
                                    <Button onClick={() => excluirPedidoProduto(pedidoProduto.id_pedido_produto)}>Excluir</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

            <Modal open={showModal} onClose={() => {
                setShowModal(false);
                setIsEditing(false);
                setSelectedPedidoProduto(null);
                setId_produto('');
                setId_pedido('');
                setQuantidade('');
                setPreco_unitario('');
                setDesconto('');
                setErrorMessages({
                    id_produto: '',
                    id_pedido: '',
                    quantidade: '',
                    preco_unitario: '',
                    desconto: ''
                });
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    boxShadow: 24,
                    p: 4,
                    padding: '1%',
                    width: '90%',
                    maxWidth: '800px', // Define uma largura máxima para o modal
                }}>
                    <h2>{isEditing ? 'Editar Pedido de Produto' : 'Adicionar Pedido de Produto'}</h2>
                    <FormControl fullWidth>
                        <InputLabel>ID Produto</InputLabel>
                        <Select
                            value={id_produto}
                            onChange={(e) => setId_produto(e.target.value)}
                        >
                            {produtos && produtos.map((produto) => (
                                <MenuItem key={produto.id_produto} value={produto.id_produto}>{produto.id_produto}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {errorMessages.id_produto && <p>{errorMessages.id_produto}</p>}
                    <FormControl fullWidth>
                        <InputLabel>ID Pedido</InputLabel>
                        <Select
                            value={id_pedido}
                            onChange={(e) => setId_pedido(e.target.value)}
                        >
                            {pedidos.map((pedido) => (
                                <MenuItem key={pedido.id_pedido} value={pedido.id_pedido}>{pedido.id_pedido}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {errorMessages.id_pedido && <p>{errorMessages.id_pedido}</p>}
                    <TextField label="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)} fullWidth />
                    {errorMessages.quantidade && <p>{errorMessages.quantidade}</p>}
                    <TextField label="Preço Unitário" value={preco_unitario} onChange={e => setPreco_unitario(e.target.value)} fullWidth />
                    {errorMessages.preco_unitario && <p>{errorMessages.preco_unitario}</p>}
                    <TextField label="Desconto" value={desconto} onChange={e => setDesconto(e.target.value)} fullWidth />
                    {errorMessages.desconto && <p>{errorMessages.desconto}</p>}
                    <Button style={{ marginTop: '2%', width: '100px' }} variant="contained" onClick={isEditing ? atualizarPedidoProduto : adicionarPedidoProduto}>{isEditing ? 'Atualizar' : 'Adicionar'}</Button>
                </div>
            </Modal>
        </div>
    );
}

export default PedidoProdutoComponent;