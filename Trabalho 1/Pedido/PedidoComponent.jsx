import React, { useState, useEffect } from 'react';
import { Button, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Modal, TextField } from '@mui/material';
import axios from 'axios';
import styles from './PedidoComponent.module.css';

function PedidoComponent() {
    const [pedidos, setPedidos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [id_pedido, setId_pedido] = useState('');
    const [id_funcionario, setId_funcionario] = useState('');
    const [id_cliente, setId_cliente] = useState('');
    const [data_pedido, setData_pedido] = useState('');
    const [data_remessa, setData_remessa] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        id_funcionario: '',
        id_cliente: '',
        data_pedido: '',
        data_remessa: ''
    });

    useEffect(() => {
        carregarPedidos();
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

    function adicionarPedido() {
        if (!validarCampos()) {
            return;
        }

        const pedido = {
            id_funcionario: id_funcionario,
            id_cliente: id_cliente,
            data_pedido: data_pedido,
            data_remessa: data_remessa
        };

        axios.post('https://devweb.jeanhenrique.site/pedido/add', pedido)
            .then(() => {
                carregarPedidos();
                setShowModal(false);
                window.location.reload(); // Recarrega a página após adicionar o pedido
            })
            .catch(error => {
                console.error('Erro ao adicionar pedido:', error);
            });
    }


    function editarPedido(pedido) {
        setIsEditing(true);
        setSelectedPedido(pedido);
        setId_pedido(pedido.id_pedido);
        setId_funcionario(pedido.id_funcionario);
        setId_cliente(pedido.id_cliente);
        setData_pedido(pedido.data_pedido);
        setData_remessa(pedido.data_remessa);
        setShowModal(true);
    }

    function atualizarPedido() {
        setIsEditing(false);

        if (!validarCampos()) {
            return;
        }

        const pedidoAtualizado = {
            ...selectedPedido,
            id_funcionario: id_funcionario,
            id_cliente: id_cliente,
            data_pedido: data_pedido,
            data_remessa: data_remessa
        };

        axios.put(`https://devweb.jeanhenrique.site/pedido/update/${selectedPedido.id_pedido}`, pedidoAtualizado)
            .then(() => {
                carregarPedidos();
                setShowModal(false);
                window.location.reload(); // Recarrega a página após atualizar o pedido
            })
            .catch(error => {
                console.error('Erro ao atualizar pedido:', error);
            });
    }

    function excluirPedido(id_pedido) {
        if (window.confirm('Deseja realmente excluir o pedido?')) {
            axios.delete(`https://devweb.jeanhenrique.site/pedido/delete/${id_pedido}`)
                .then(() => {
                    carregarPedidos();
                    window.location.reload(); // Recarrega a página após excluir o pedido
                })
                .catch(error => {
                    console.error('Erro ao excluir pedido:', error);
                });
        }
    }

    function validarCampos() {
        let isValid = true;
        const errors = {
            id_funcionario: '',
            id_cliente: '',
            data_pedido: '',
            data_remessa: ''
        };

        if (!id_funcionario) {
            errors.id_funcionario = 'O campo ID Funcionário é obrigatório.';
            isValid = false;
        }

        if (!id_cliente) {
            errors.id_cliente = 'O campo ID Cliente é obrigatório.';
            isValid = false;
        }

        if (!data_pedido) {
            errors.data_pedido = 'O campo Data Pedido é obrigatório.';
            isValid = false;
        }

        if (!data_remessa) {
            errors.data_remessa = 'O campo Data Remessa é obrigatório.';
            isValid = false;
        }

        setErrorMessages(errors);
        return isValid;
    }

    return (
        <div className={styles.container}>

            <Button style={{ marginBottom: '0.5%', width: '210px', fontSize: '12px', paddingLeft: '0.5%', paddingRight: '0.5%' }} variant="contained" onClick={() => setShowModal(true)} disabled={pedidos.length >= 5}>Adicionar Pedido</Button>
            {errorMessages.id_funcionario && <p>{errorMessages.id_funcionario}</p>}
            {errorMessages.id_cliente && <p>{errorMessages.id_cliente}</p>}
            {errorMessages.data_pedido && <p>{errorMessages.data_pedido}</p>}
            {errorMessages.data_remessa && <p>{errorMessages.data_remessa}</p>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Pedido</TableCell>
                            <TableCell>ID Funcionário</TableCell>
                            <TableCell>ID Cliente</TableCell>
                            <TableCell>Data Pedido</TableCell>
                            <TableCell>Data Remessa</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(pedidos) && pedidos.slice(0, 5).map(pedido => (
                            <TableRow key={pedido.id_pedido}>
                                <TableCell>{pedido.id_pedido}</TableCell>
                                <TableCell>{pedido.id_funcionario}</TableCell>
                                <TableCell>{pedido.id_cliente}</TableCell>
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

            <Modal open={showModal} onClose={() => {
                setShowModal(false);
                setIsEditing(false);
                setSelectedPedido(null);
                setId_pedido('');
                setId_funcionario('');
                setId_cliente('');
                setData_pedido('');
                setData_remessa('');
                setErrorMessages({
                    id_funcionario: '',
                    id_cliente: '',
                    data_pedido: '',
                    data_remessa: ''
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
                    <h2>{isEditing ? 'Editar Pedido' : 'Adicionar Pedido'}</h2>
                    <TextField label="ID Funcionário" value={id_funcionario} onChange={e => setId_funcionario(e.target.value)} fullWidth />
                    {errorMessages.id_funcionario && <p>{errorMessages.id_funcionario}</p>}
                    <TextField label="ID Cliente" value={id_cliente} onChange={e => setId_cliente(e.target.value)} fullWidth />
                    {errorMessages.id_cliente && <p>{errorMessages.id_cliente}</p>}
                    <TextField label="Data Pedido" value={data_pedido} onChange={e => setData_pedido(e.target.value)} fullWidth />
                    {errorMessages.data_pedido && <p>{errorMessages.data_pedido}</p>}
                    <TextField label="Data Remessa" value={data_remessa} onChange={e => setData_remessa(e.target.value)} fullWidth />
                    {errorMessages.data_remessa && <p>{errorMessages.data_remessa}</p>}
                    <Button style={{ marginTop: '2%', width: '100px' }} variant="contained" onClick={isEditing ? atualizarPedido : adicionarPedido}>{isEditing ? 'Atualizar' : 'Adicionar'}</Button>
                </div>
            </Modal>
        </div>
    );
}

export default PedidoComponent;
