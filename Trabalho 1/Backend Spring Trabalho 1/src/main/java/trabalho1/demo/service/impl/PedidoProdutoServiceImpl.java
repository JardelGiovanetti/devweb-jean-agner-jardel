package trabalho1.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import trabalho1.demo.entity.PedidoProduto;
import trabalho1.demo.repository.PedidoProdutoRepository;
import trabalho1.demo.service.PedidoProdutoService;

@Service
public class PedidoProdutoServiceImpl implements PedidoProdutoService {

    @Autowired
    private PedidoProdutoRepository pedidoProdutoRepository;

    @Override
    public void addPedidoProduto(PedidoProduto pedidoProduto) {
        pedidoProdutoRepository.save(pedidoProduto);
    }

    @Override
    public List<PedidoProduto> getPedidoProdutos() {
        return pedidoProdutoRepository.findAll();
    }

    @Override
    public PedidoProduto getPedidoProduto(Long id_pedido_produto) {
        return pedidoProdutoRepository.findById(id_pedido_produto)
                .orElseThrow(() -> new IllegalArgumentException("PedidoProduto não encontrado!"));
    }

    @Override
    public void updatePedidoProduto(Long id_pedido_produto, PedidoProduto pedidoProduto) {
        pedidoProdutoRepository.findById(id_pedido_produto)
                .orElseThrow(() -> new IllegalArgumentException("PedidoProduto não encontrado!"));
        pedidoProduto.setId_pedido_produto(id_pedido_produto);
        pedidoProdutoRepository.save(pedidoProduto);
    }

    @Override
    public void deletePedidoProduto(Long id_pedido_produto) {
        PedidoProduto pedidoProduto = pedidoProdutoRepository.findById(id_pedido_produto)
                .orElseThrow(() -> new IllegalArgumentException("PedidoProduto não encontrado!"));
        pedidoProdutoRepository.delete(pedidoProduto);
    }

}
