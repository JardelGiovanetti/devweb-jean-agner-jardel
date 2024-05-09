import React, { useState, useEffect } from 'react';
import { Button, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Modal, TextField } from '@mui/material';
import axios from 'axios';
import styles from './ProdutoComponent.module.css';

function ProdutoComponent() {
    const [produtos, setProdutos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduto, setSelectedProduto] = useState(null);
    const [id_produto, setId_produto] = useState('');
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valorCusto, setValorCusto] = useState('');
    const [valorVenda, setValorVenda] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        codigo: '',
        descricao: '',
        valorCusto: '',
        valorVenda: ''
    });

    useEffect(() => {
        carregarProdutos();
    }, []);

    function carregarProdutos() {
        axios.get('https://devweb.jeanhenrique.site/produto')
            .then(response => {
                setProdutos(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar produtos:', error);
            });
    }

    function adicionarProduto() {
        if (!validarCampos()) {
            return;
        }

        const produto = {
            codigo: codigo,
            descricao: descricao,
            valor_custo: parseFloat(valorCusto),
            valor_venda: parseFloat(valorVenda)
        };

        axios.post('https://devweb.jeanhenrique.site/produto/add', produto)
            .then(() => {
                carregarProdutos();
                setShowModal(false);
                window.location.reload(); // Recarrega a página após adicionar o produto
            })
            .catch(error => {
                console.error('Erro ao adicionar produto:', error);
            });
    }

    function editarProduto(produto) {
        setIsEditing(true);
        setSelectedProduto(produto);
        setId_produto(produto.id_produto);
        setCodigo(produto.codigo);
        setDescricao(produto.descricao);
        setValorCusto(produto.valor_custo.toString());
        setValorVenda(produto.valor_venda.toString());
        setShowModal(true);
    }

    function atualizarProduto() {
        setIsEditing(false);

        if (!validarCampos()) {
            return;
        }

        const produtoAtualizado = {
            ...selectedProduto,
            codigo: codigo,
            descricao: descricao,
            valor_custo: parseFloat(valorCusto),
            valor_venda: parseFloat(valorVenda)
        };

        axios.put(`https://devweb.jeanhenrique.site/produto/update/${selectedProduto.id_produto}`, produtoAtualizado)
            .then(() => {
                carregarProdutos();
                setShowModal(false);
                window.location.reload(); // Recarrega a página após atualizar o produto
            })
            .catch(error => {
                console.error('Erro ao atualizar produto:', error);
            });
    }

    function excluirProduto(id_produto) {
        if (window.confirm('Deseja realmente excluir o produto?')) {
            axios.delete(`https://devweb.jeanhenrique.site/produto/delete/${id_produto}`)
                .then(() => {
                    carregarProdutos();
                    window.location.reload(); // Recarrega a página após excluir o produto
                })
                .catch(error => {
                    console.error('Erro ao excluir produto:', error);
                });
        }
    }

    function validarCampos() {
        let isValid = true;
        const errors = {
            codigo: '',
            descricao: '',
            valorCusto: '',
            valorVenda: ''
        };

        if (!codigo) {
            errors.codigo = 'O campo Código é obrigatório.';
            isValid = false;
        }

        if (!descricao) {
            errors.descricao = 'O campo Descrição é obrigatório.';
            isValid = false;
        }

        if (isNaN(valorCusto)) {
            errors.valorCusto = 'O campo Valor de Custo deve conter apenas números.';
            isValid = false;
        }

        if (isNaN(valorVenda)) {
            errors.valorVenda = 'O campo Valor de Venda deve conter apenas números.';
            isValid = false;
        }

        setErrorMessages(errors);
        return isValid;
    }

    return (
        <div className={styles.container}>
            <h1>Seja Bem-Vindo ao Nosso Sistema de Vendas!</h1>
            <h2>Abaixo estão nossas tabelas de produtos e pedidos! Cadastre os produtos para realizar as vendas (pedidos)</h2>
            <h2>No máximo, 5 elementos são permitidos por tabela.</h2>
            <Button style={{ marginBottom: '0.5%', width: '210px', fontSize: '12px', paddingLeft: '0.5%', paddingRight: '0.5%' }} variant="contained" onClick={() => setShowModal(true)} disabled={produtos.length >= 5}>Adicionar Produto</Button>
            {errorMessages.codigo && <p>{errorMessages.codigo}</p>}
            {errorMessages.descricao && <p>{errorMessages.descricao}</p>}
            {errorMessages.valorCusto && <p>{errorMessages.valorCusto}</p>}
            {errorMessages.valorVenda && <p>{errorMessages.valorVenda}</p>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Produto</TableCell>
                            <TableCell>Código</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Valor de Custo</TableCell>
                            <TableCell>Valor de Venda</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(produtos) && produtos.slice(0, 5).map(produto => (
                            <TableRow key={produto.id_produto}>
                                <TableCell>{produto.id_produto}</TableCell>
                                <TableCell>{produto.codigo}</TableCell>
                                <TableCell>{produto.descricao}</TableCell>
                                <TableCell>{produto.valor_custo}</TableCell>
                                <TableCell>{produto.valor_venda}</TableCell>
                                <TableCell>
                                    <Button onClick={() => editarProduto(produto)}>Editar</Button>
                                    <Button onClick={() => excluirProduto(produto.id_produto)}>Excluir</Button>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={showModal} onClose={() => {
                setShowModal(false);
                setIsEditing(false);
                setSelectedProduto(null);
                setCodigo('');
                setDescricao('');
                setValorCusto('');
                setValorVenda('');
                setErrorMessages({
                    codigo: '',
                    descricao: '',
                    valorCusto: '',
                    valorVenda: ''
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
                    <h2>{isEditing ? 'Editar Produto' : 'Adicionar Produto'}</h2>
                    <TextField label="Código" value={codigo} onChange={e => setCodigo(e.target.value)} fullWidth />
                    {errorMessages.codigo && <p>{errorMessages.codigo}</p>}
                    <TextField label="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} fullWidth />
                    {errorMessages.descricao && <p>{errorMessages.descricao}</p>}
                    <TextField label="Valor de Custo" value={valorCusto} onChange={e => setValorCusto(e.target.value)} fullWidth />
                    {errorMessages.valorCusto && <p>{errorMessages.valorCusto}</p>}
                    <TextField label="Valor de Venda" value={valorVenda} onChange={e => setValorVenda(e.target.value)} fullWidth />
                    {errorMessages.valorVenda && <p>{errorMessages.valorVenda}</p>}
                    <Button style={{ marginTop: '2%', width: '100px' }} variant="contained" onClick={isEditing ? atualizarProduto : adicionarProduto}>{isEditing ? 'Atualizar' : 'Adicionar'}</Button>
                </div>
            </Modal>
        </div>
    );
}

export default ProdutoComponent;
