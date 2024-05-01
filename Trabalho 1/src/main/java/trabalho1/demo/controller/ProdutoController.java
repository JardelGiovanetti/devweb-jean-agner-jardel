package trabalho1.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import trabalho1.demo.entity.Produto;
import trabalho1.demo.service.ProdutoService;

@RestController
@RequestMapping("/produto")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping("/add")
    public ResponseEntity<Void> addProduto(@RequestBody Produto produto) {
        produtoService.addProduto(produto);
        return ResponseEntity.noContent().build();
    }

    @GetMapping()
    public List<Produto> getProdutos() {
        return produtoService.getProdutos();
    }

    @GetMapping("/get")
    public Produto getProduto(@RequestParam Long id_produto) {
        return produtoService.getProduto(id_produto);
    }

    @PutMapping("/update/{id_produto}")
    public ResponseEntity<Void> updateProduto(@PathVariable Long id_produto, @RequestBody Produto produto) {
        produtoService.updateProduto(id_produto, produto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete/{id_produto}")
    public ResponseEntity<Void> deleteProduto(@PathVariable Long id_produto) {
        produtoService.deleteProduto(id_produto);
        return ResponseEntity.noContent().build();
    }

}