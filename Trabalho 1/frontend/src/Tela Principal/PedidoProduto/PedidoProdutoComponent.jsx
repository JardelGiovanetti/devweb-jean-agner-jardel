import React, { useState, useEffect } from 'react';
import { Button, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Modal, TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import styles from './PedidoProdutoComponent.module.css';

function PedidoProdutoComponent() {
    const [pedidoProdutos, setPedidoProdutos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPedidoProduto, setSelectedPedidoProduto] = useState(null);
    const [idPedido, setIdPedido] = useState('');
    const [idProduto, setIdProduto] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [precoUnitario, setPrecoUnitario] = useState('');
    const [desconto, setDesconto] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        idPedido: '',
        idProduto: '',
        quantidade: '',
        precoUnitario: '',
        desconto: ''
    });
    const [pedidos, setPedidos] = useState([]);
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        carregarPedidoProdutos();
        carregarPedidos();
        carregarProdutos();
    }, []);

    function carregarPedidoProdutos() {
        axios.get('/pedido_produto')
            .then(response => {
                setPedidoProdutos(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar pedidos de produtos:', error);
            });
    }

    function carregarPedidos() {
        axios.get('/pedido')
            .then(response => {
                setPedidos(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar pedidos:', error);
            });
    }

    function carregarProdutos() {
        axios.get('/produto')
            .then(response => {
                setProdutos(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar produtos:', error);
            });
    }

    function adicionarPedidoProduto() {
        if (!validarCampos()) {
            return;
        }

        const pedidoProduto = {
            id_pedido: idPedido,
            id_produto: idProduto,
            quantidade: quantidade,
            preco_unitario: precoUnitario,
            desconto: desconto
        };

        axios.post('/pedido_produto/add', pedidoProduto)
            .then(() => {
                carregarPedidoProdutos();
                setShowModal(false);
            })
            .catch(error => {
                console.error('Erro ao adicionar pedido de produto:', error);
            });
    }

    function editarPedidoProduto(pedidoProduto) {
        setIsEditing(true);
        setSelectedPedidoProduto(pedidoProduto);
        setIdPedido(pedidoProduto.id_pedido);
        setIdProduto(pedidoProduto.id_produto);
        setQuantidade(pedidoProduto.quantidade);
        setPrecoUnitario(pedidoProduto.preco_unitario);
        setDesconto(pedidoProduto.desconto);
        setShowModal(true);
    }

    function atualizarPedidoProduto() {
        setIsEditing(false);

        const pedidoProdutoAtualizado = {
            ...selectedPedidoProduto,
            id_pedido: idPedido,
            id_produto: idProduto,
            quantidade: quantidade,
            preco_unitario: precoUnitario,
            desconto: desconto
        };

        axios.put(`/pedido_produto/update/${selectedPedidoProduto.id_pedido_produto}`, pedidoProdutoAtualizado)
            .then(() => {
                carregarPedidoProdutos();
                setShowModal(false);
            })
            .catch(error => {
                console.error('Erro ao atualizar pedido de produto:', error);
            });
    }

    function excluirPedidoProduto(id_pedido_produto) {
        if (window.confirm('Deseja realmente excluir o pedido de produto?')) {
            axios.delete(`/pedido_produto/delete/${id_pedido_produto}`)
                .then(() => {
                    carregarPedidoProdutos();
                })
                .catch(error => {
                    console.error('Erro ao excluir pedido de produto:', error);
                });
        }
    }

    function validarCampos() {
        let isValid = true;
        const errors = {
            idPedido: '',
            idProduto: '',
            quantidade: '',
            precoUnitario: '',
            desconto: ''
        };

        if (isNaN(idPedido)) {
            errors.idPedido = 'O ID Pedido deve conter apenas números.';
            isValid = false;
        }

        if (isNaN(idProduto)) {
            errors.idProduto = 'O ID Produto deve conter apenas números.';
            isValid = false;
        }

        if (isNaN(quantidade)) {
            errors.quantidade = 'A quantidade deve conter apenas números.';
            isValid = false;
        }

        if (isNaN(precoUnitario)) {
            errors.precoUnitario = 'O preço unitário deve conter apenas números.';
            isValid = false;
        }

        if (isNaN(desconto)) {
            errors.desconto = 'O desconto deve conter apenas números.';
            isValid = false;
        }

        setErrorMessages(errors);
        return isValid;
    }

    return (
        <div className={styles.container}>
            <Button style={{ marginBottom: '0.5%', width: '210px', fontSize: '12px', paddingLeft: '0.5%', paddingRight: '0.5%' }} variant="contained" onClick={() => setShowModal(true)} disabled={pedidoProdutos.length >= 5}>Adicionar Pedido_Produto</Button>
            {errorMessages.idPedido && <p>{errorMessages.idPedido}</p>}
            {errorMessages.idProduto && <p>{errorMessages.idProduto}</p>}
            {errorMessages.quantidade && <p>{errorMessages.quantidade}</p>}
            {errorMessages.precoUnitario && <p>{errorMessages.precoUnitario}</p>}
            {errorMessages.desconto && <p>{errorMessages.desconto}</p>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Pedido</TableCell>
                            <TableCell>ID Produto</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Preço Unitário</TableCell>
                            <TableCell>Desconto</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pedidoProdutos.slice(0, 5).map(pedidoProduto => (
                            <TableRow key={pedidoProduto.id_pedido_produto}>
                                <TableCell>{pedidoProduto.id_pedido}</TableCell>
                                <TableCell>{pedidoProduto.id_produto}</TableCell>
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
                setIdPedido('');
                setIdProduto('');
                setQuantidade('');
                setPrecoUnitario('');
                setDesconto('');
                setErrorMessages({
                    idPedido: '',
                    idProduto: '',
                    quantidade: '',
                    precoUnitario: '',
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
                    <TextField
                        select
                        label="ID Pedido"
                        value={idPedido}
                        onChange={e => setIdPedido(e.target.value)}
                        fullWidth
                    >
                        {pedidos.map(pedido => (
                            <MenuItem key={pedido.id_pedido} value={pedido.id_pedido}>
                                {pedido.id_pedido}
                            </MenuItem>
                        ))}
                    </TextField>
                    {errorMessages.idPedido && <p>{errorMessages.idPedido}</p>}
                    <TextField
                        select
                        label="ID Produto"
                        value={idProduto}
                        onChange={e => setIdProduto(e.target.value)}
                        fullWidth
                    >
                        {produtos.map(produto => (
                            <MenuItem key={produto.id_produto} value={produto.id_produto}>
                                {produto.id_produto}
                            </MenuItem>
                        ))}
                    </TextField>
                    {errorMessages.idProduto && <p>{errorMessages.idProduto}</p>}
                    <TextField label="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)} fullWidth />
                    {errorMessages.quantidade && <p>{errorMessages.quantidade}</p>}
                    <TextField label="Preço Unitário" value={precoUnitario} onChange={e => setPrecoUnitario(e.target.value)} fullWidth />
                    {errorMessages.precoUnitario && <p>{errorMessages.precoUnitario}</p>}
                    <TextField label="Desconto" value={desconto} onChange={e => setDesconto(e.target.value)} fullWidth />
                    {errorMessages.desconto && <p>{errorMessages.desconto}</p>}
                    <Button style={{ marginTop: '2%', width: '100px' }} variant="contained" onClick={isEditing ? atualizarPedidoProduto : adicionarPedidoProduto}>{isEditing ? 'Atualizar' : 'Adicionar'}</Button>
                </div>
            </Modal>
        </div>
    );
}

export default PedidoProdutoComponent;
