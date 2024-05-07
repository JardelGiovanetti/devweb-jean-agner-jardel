import React, { useState, useEffect } from 'react';
import { Button, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Modal, TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import styles from './PedidoComponent.module.css';

function PedidoComponent() {
    const [pedidos, setPedidos] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [idCliente, setIdCliente] = useState('');
    const [idFuncionario, setIdFuncionario] = useState('');
    const [dataPedido, setDataPedido] = useState('');
    const [dataRemessa, setDataRemessa] = useState('');
    const [selectedProduto, setSelectedProduto] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [precoUnitario, setPrecoUnitario] = useState('');
    const [desconto, setDesconto] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPedidoProdutos, setSelectedPedidoProdutos] = useState([]);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
    const [showAddProdutoModal, setShowAddProdutoModal] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        idCliente: '',
        idFuncionario: '',
        dataPedido: '',
        dataRemessa: '',
        quantidade: '',
        precoUnitario: '',
        desconto: ''
    });

    useEffect(() => {
        carregarPedidos();
        carregarProdutosDisponiveis();
    }, []);

    function carregarPedidos() {
        axios.get('https://devweb.jeanhenrique.site/pedido')
            .then(response => {
                setPedidos(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar pedidos:', error);
            });
    }

    function carregarProdutosDisponiveis() {
        axios.get('https://devweb.jeanhenrique.site/produto')
            .then(response => {
                setProdutosDisponiveis(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar produtos disponíveis:', error);
            });
    }





    function removerProduto(index) {
        const novosProdutos = [...selectedPedidoProdutos];
        novosProdutos.splice(index, 1);
        setSelectedPedidoProdutos(novosProdutos);
    }

    function editarPedido(pedido) {
        setSelectedPedido(pedido);
        setIdCliente(pedido.id_cliente);
        setIdFuncionario(pedido.id_funcionario);
        setDataPedido(pedido.data_pedido);
        setDataRemessa(pedido.data_remessa);
        setSelectedPedidoProdutos([]);
        setShowModal(true);
        setIsEditing(true);
    }

    function excluirPedido(id_pedido) {
        axios.delete(`https://devweb.jeanhenrique.site/pedido/delete/${id_pedido}`)
            .then(() => {
                setPedidos(pedidos.filter(pedido => pedido.id_pedido !== id_pedido));
            })
            .catch(error => {
                console.error('Erro ao excluir pedido:', error);
            });
    }

    function adicionarProduto() {
        if (!selectedProduto || !quantidade || !precoUnitario || !desconto) {
            // Lógica para lidar com campos em branco
            return;
        }

        const novoProduto = {
            id_pedido: pedidoSelecionado.id_pedido,
            id_produto: selectedProduto,
            quantidade: quantidade,
            preco_unitario: precoUnitario,
            desconto: desconto
        };

        axios.post('https://devweb.jeanhenrique.site/pedido_produto/add', novoProduto)
            .then(() => {
                setSelectedPedidoProdutos([...selectedPedidoProdutos, novoProduto]);
                setShowAddProdutoModal(false);
                setSelectedProduto('');
                setQuantidade('');
                setPrecoUnitario('');
                setDesconto('');
            })
            .catch(error => {
                console.error('Erro ao adicionar produto ao pedido:', error);
            });
    }

    function finalizarPedido() {
        if (!validarCampos()) {
            return;
        }

        const pedido = {
            id_cliente: idCliente,
            id_funcionario: idFuncionario,
            data_pedido: dataPedido,
            data_remessa: dataRemessa
        };

        axios.post('https://devweb.jeanhenrique.site/pedido/add', pedido)
            .then(response => {
                const pedidoId = response.data.id_pedido;

                selectedPedidoProdutos.forEach(produto => {
                    const pedidoProduto = {
                        id_pedido: pedidoId,
                        id_produto: produto.id_produto,
                        quantidade: produto.quantidade,
                        preco_unitario: produto.preco_unitario,
                        desconto: produto.desconto
                    };


                    axios.post('https://devweb.jeanhenrique.site/pedido_produto/add', pedidoProduto)
                        .catch(error => {
                            console.error('Erro ao adicionar produto ao pedido:', error);
                        });
                });

                setPedidos([...pedidos, pedido]);
                setShowModal(false);
                resetForm();
            })
            .catch(error => {
                console.error('Erro ao adicionar pedido:', error);
            });
    }

    function validarCampos() {
        let isValid = true;
        const errors = {
            idCliente: '',
            idFuncionario: '',
            dataPedido: '',
            dataRemessa: '',
            quantidade: '',
            precoUnitario: '',
            desconto: ''
        };

        if (isNaN(idCliente)) {
            errors.idCliente = 'O ID Cliente deve conter apenas números.';
            isValid = false;
        }

        if (isNaN(idFuncionario)) {
            errors.idFuncionario = 'O ID Funcionário deve conter apenas números.';
            isValid = false;
        }

        if (!isValidDate(dataPedido)) {
            errors.dataPedido = 'A Data do Pedido deve estar no formato dd/mm/aaaa.';
            isValid = false;
        }

        if (!isValidDate(dataRemessa)) {
            errors.dataRemessa = 'A Data de Remessa deve estar no formato dd/mm/aaaa.';
            isValid = false;
        }

        if (isNaN(quantidade)) {
            errors.quantidade = 'A Quantidade deve conter apenas números.';
            isValid = false;
        }

        if (isNaN(precoUnitario)) {
            errors.precoUnitario = 'O Preço Unitário deve conter apenas números.';
            isValid = false;
        }

        if (isNaN(desconto)) {
            errors.desconto = 'O Desconto deve conter apenas números.';
            isValid = false;
        }

        setErrorMessages(errors);
        return isValid;
    }

    function resetForm() {
        setIdCliente('');
        setIdFuncionario('');
        setDataPedido('');
        setDataRemessa('');
        setSelectedProduto('');
        setQuantidade('');
        setPrecoUnitario('');
        setDesconto('');
        setSelectedPedidoProdutos([]);
        setErrorMessages({
            idCliente: '',
            idFuncionario: '',
            dataPedido: '',
            dataRemessa: '',
            quantidade: '',
            precoUnitario: '',
            desconto: ''
        });
    }

    function isValidDate(dateString) {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        return regex.test(dateString);
    }

    function handleOpenAddProdutoModal(pedido) {
        setPedidoSelecionado(pedido);
        axios.get(`https://devweb.jeanhenrique.site/produto`)
            .then(response => {
                setProdutosDisponiveis(response.data);
                setShowAddProdutoModal(true);
            })
            .catch(error => {
                console.error('Erro ao carregar produtos disponíveis:', error);
            });
    }

    return (
        <div className={styles.container}>
            <Button style={{ marginBottom: '0.5%', width: '210px', fontSize: '12px', paddingLeft: '0.5%', paddingRight: '0.5%' }} variant="contained" onClick={() => setShowModal(true)} disabled={pedidos.length >= 5}>Adicionar Pedido</Button>
            {errorMessages.idCliente && <p>{errorMessages.idCliente}</p>}
            {errorMessages.idFuncionario && <p>{errorMessages.idFuncionario}</p>}
            {errorMessages.dataPedido && <p>{errorMessages.dataPedido}</p>}
            {errorMessages.dataRemessa && <p>{errorMessages.dataRemessa}</p>}
            {errorMessages.quantidade && <p>{errorMessages.quantidade}</p>}
            {errorMessages.precoUnitario && <p>{errorMessages.precoUnitario}</p>}
            {errorMessages.desconto && <p>{errorMessages.desconto}</p>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Pedido</TableCell>
                            <TableCell>ID Cliente</TableCell>
                            <TableCell>ID Funcionário</TableCell>
                            <TableCell>Data do Pedido</TableCell>
                            <TableCell>Data de Remessa</TableCell>
                            <TableCell>Produtos</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(pedidos) && pedidos.slice(0, 5).map(pedido => (
                            <TableRow key={pedido.id_pedido}>
                                <TableCell>{pedido.id_pedido}</TableCell>
                                <TableCell>{pedido.id_cliente}</TableCell>
                                <TableCell>{pedido.id_funcionario}</TableCell>
                                <TableCell>{pedido.data_pedido}</TableCell>
                                <TableCell>{pedido.data_remessa}</TableCell>
                                <TableCell>
                                    <Button onClick={() => setSelectedPedido(pedido)}>Ver Produtos</Button>
                                    {selectedPedido && selectedPedido.id_pedido === pedido.id_pedido && (
                                        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>ID Produto</TableCell>
                                                        <TableCell>Quantidade</TableCell>
                                                        <TableCell>Preço Unitário</TableCell>
                                                        <TableCell>Desconto</TableCell>
                                                        <TableCell>Ações</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Array.isArray(selectedPedidoProdutos) && selectedPedidoProdutos
                                                        .filter(produto => produto.id_pedido === pedido.id_pedido) // Filtra os produtos pelo ID do pedido
                                                        .map((produto, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{produto.id_produto}</TableCell>
                                                                <TableCell>{produto.quantidade}</TableCell>
                                                                <TableCell>{produto.preco_unitario}</TableCell>
                                                                <TableCell>{produto.desconto}</TableCell>
                                                                <TableCell>
                                                                    <Button onClick={() => removerProduto(index)}>Remover</Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                    <Button onClick={() => handleOpenAddProdutoModal(pedido)}>Adicionar Produto</Button>


                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => editarPedido(pedido)}>Editar</Button>
                                    <Button onClick={() => excluirPedido(pedido.id_pedido)}>Excluir</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setSelectedPedido(null);
                    resetForm();
                }}
            >
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
                    maxWidth: '800px' // Define uma largura máxima para o modal
                }}>
                    <h2>{isEditing ? 'Editar Pedido' : 'Adicionar Pedido'}</h2>
                    <TextField label="ID Cliente" value={idCliente} onChange={e => setIdCliente(e.target.value)} fullWidth />
                    {errorMessages.idCliente && <p>{errorMessages.idCliente}</p>}
                    <TextField label="ID Funcionário" value={idFuncionario} onChange={e => setIdFuncionario(e.target.value)} fullWidth />
                    {errorMessages.idFuncionario && <p>{errorMessages.idFuncionario}</p>}
                    <TextField label="Data do Pedido" value={dataPedido} onChange={e => setDataPedido(e.target.value)} fullWidth />
                    {errorMessages.dataPedido && <p>{errorMessages.dataPedido}</p>}
                    <TextField label="Data de Remessa" value={dataRemessa} onChange={e => setDataRemessa(e.target.value)} fullWidth />
                    {errorMessages.dataRemessa && <p>{errorMessages.dataRemessa}</p>}
                    <Button style={{ marginTop: '2%', width: '100px' }} variant="contained" onClick={finalizarPedido}>{isEditing ? 'Editar Pedido' : 'Finalizar Pedido'}</Button>
                </div>
            </Modal>

            <Modal
                open={showAddProdutoModal}
                onClose={() => setShowAddProdutoModal(false)}
            >
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
                    maxWidth: '800px' // Define uma largura máxima para o modal
                }}>
                    <h2>Adicionar Produto ao Pedido</h2>

                    <TextField select label="ID Produto" value={selectedProduto} onChange={e => setSelectedProduto(e.target.value)} fullWidth>
                        {produtosDisponiveis.map(produto => (
                            <MenuItem key={produto.id_produto} value={produto.id_produto}>
                                {produto.id_produto}
                            </MenuItem>
                        ))}
                    </TextField>                    <TextField label="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)} fullWidth />
                    <TextField label="Preço Unitário" value={precoUnitario} onChange={e => setPrecoUnitario(e.target.value)} fullWidth />
                    <TextField label="Desconto" value={desconto} onChange={e => setDesconto(e.target.value)} fullWidth />
                    <Button style={{ marginTop: '2%', width: '100px' }} variant="contained" onClick={adicionarProduto}>Adicionar Produto</Button>
                </div>
            </Modal>

        </div>
    );
}

export default PedidoComponent;
