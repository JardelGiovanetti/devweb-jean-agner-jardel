import React, { useState, useEffect } from 'react';
import { Button, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Modal, TextField } from '@mui/material';
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
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        idCliente: '',
        idFuncionario: '',
        dataPedido: '',
        dataRemessa: ''
    });

    useEffect(() => {
        carregarPedidos();
    }, []);

    function carregarPedidos() {
        axios.get('/pedido')
            .then(response => {
                setPedidos(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar pedidos:', error);
            });
    }

    function adicionarPedido() {
        if (!validarCampos()) {
            return;
        }

        const pedido = {
            id_cliente: idCliente,
            id_funcionario: idFuncionario,
            data_pedido: dataPedido,
            data_remessa: dataRemessa
        };

        axios.post('/pedido/add', pedido)
            .then(() => {
                carregarPedidos();
                setShowModal(false);
            })
            .catch(error => {
                console.error('Erro ao adicionar pedido:', error);
            });
    }

    function editarPedido(pedido) {
        setIsEditing(true);
        setSelectedPedido(pedido);
        setIdCliente(pedido.id_cliente);
        setIdFuncionario(pedido.id_funcionario);
        setDataPedido(pedido.data_pedido);
        setDataRemessa(pedido.data_remessa);
        setShowModal(true);
    }

    function atualizarPedido() {
        setIsEditing(false);

        const pedidoAtualizado = {
            ...selectedPedido,
            id_cliente: idCliente,
            id_funcionario: idFuncionario,
            data_pedido: dataPedido,
            data_remessa: dataRemessa,
        };

        axios.put(`/pedido/update/${selectedPedido.id_pedido}`, pedidoAtualizado)
            .then(() => {
                carregarPedidos();
                setShowModal(false);
            })
            .catch(error => {
                console.error('Erro ao atualizar pedido:', error);
            });
    }

    function excluirPedido(id_pedido) {
        if (window.confirm('Deseja realmente excluir o pedido?')) {
            axios.delete(`/pedido/delete/${id_pedido}`)
                .then(() => {
                    carregarPedidos();
                })
                .catch(error => {
                    console.error('Erro ao excluir pedido:', error);
                });
        }
    }

    function validarCampos() {
        let isValid = true;
        const errors = {
            idCliente: '',
            idFuncionario: '',
            dataPedido: '',
            dataRemessa: ''
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

        setErrorMessages(errors);
        return isValid;
    }

    function isValidDate(dateString) {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        return regex.test(dateString);
    }

    return (
        <div className={styles.container}>
            <Button style={{ marginBottom: '0.5%', width: '210px', fontSize: '12px', paddingLeft: '0.5%', paddingRight: '0.5%' }} variant="contained" onClick={() => setShowModal(true)} disabled={pedidos.length >= 5}>Adicionar Pedido</Button>
            {errorMessages.idCliente && <p>{errorMessages.idCliente}</p>}
            {errorMessages.idFuncionario && <p>{errorMessages.idFuncionario}</p>}
            {errorMessages.dataPedido && <p>{errorMessages.dataPedido}</p>}
            {errorMessages.dataRemessa && <p>{errorMessages.dataRemessa}</p>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Pedido</TableCell>
                            <TableCell>ID Cliente</TableCell>
                            <TableCell>ID Funcionário</TableCell>
                            <TableCell>Data do Pedido</TableCell>
                            <TableCell>Data de Remessa</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pedidos.slice(0, 5).map(pedido => (
                            <TableRow key={pedido.id_pedido}>
                                <TableCell>{pedido.id_pedido}</TableCell>
                                <TableCell>{pedido.id_cliente}</TableCell>
                                <TableCell>{pedido.id_funcionario}</TableCell>
                                <TableCell>{pedido.data_pedido}</TableCell>
                                <TableCell>{pedido.data_remessa}</TableCell>
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
                    setIdCliente('');
                    setIdFuncionario('');
                    setDataPedido('');
                    setDataRemessa('');
                    setErrorMessages({
                        idCliente: '',
                        idFuncionario: '',
                        dataPedido: '',
                        dataRemessa: ''
                    });
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
                    <Button style={{ marginTop: '2%', width: '100px' }} variant="contained" onClick={isEditing ? atualizarPedido : adicionarPedido}>{isEditing ? 'Atualizar' : 'Adicionar'}</Button>
                </div>
            </Modal>
        </div>
    );
}

export default PedidoComponent;
