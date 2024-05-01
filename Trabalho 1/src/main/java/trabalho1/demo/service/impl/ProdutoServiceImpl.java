package trabalho1.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import trabalho1.demo.entity.Produto;
import trabalho1.demo.repository.ProdutoRepository;
import trabalho1.demo.service.ProdutoService;

@Service
public class ProdutoServiceImpl implements ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Override
    public void addProduto(Produto produto) {
        produtoRepository.save(produto);
    }

    @Override
    public List<Produto> getProdutos() {
        return produtoRepository.findAll();
    }

    @Override
    public Produto getProduto(Long id_produto) {
        Produto produto = produtoRepository.findById(id_produto)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado!"));
        return produto;
    }

    @Override
    public void updateProduto(Long id_produto, Produto produto) {
        produtoRepository.findById(id_produto)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado!"));
        produto.setId_produto(id_produto);
        produtoRepository.save(produto);

    }

    @Override
    public void deleteProduto(Long id_produto) {
        Produto produto = produtoRepository.findById(id_produto)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado!"));
        produtoRepository.delete(produto);

    }

}