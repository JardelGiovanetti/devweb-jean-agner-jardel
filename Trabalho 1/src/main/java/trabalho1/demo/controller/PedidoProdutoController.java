package trabalho1.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import trabalho1.demo.entity.PedidoProduto;
import trabalho1.demo.service.PedidoProdutoService;

@RestController
@RequestMapping("/pedido_produto")
public class PedidoProdutoController {

    @Autowired
    private PedidoProdutoService pedidoProdutoService;

    @PostMapping("/add")
    public ResponseEntity<Void> addPedidoProduto(@RequestBody PedidoProduto pedidoProduto) {
        pedidoProdutoService.addPedidoProduto(pedidoProduto);
        return ResponseEntity.noContent().build();
    }

    @GetMapping()
    public List<PedidoProduto> getPedidoProdutos() {
        return pedidoProdutoService.getPedidoProdutos();
    }

    @GetMapping("/get")
    public PedidoProduto getPedidoProduto(@RequestParam Long id_pedido_produto) {
        return pedidoProdutoService.getPedidoProduto(id_pedido_produto);
    }

    @PutMapping("/update/{id_pedido_produto}")
    public ResponseEntity<Void> updatePedidoProduto(@PathVariable Long id_pedido_produto,
            @RequestBody PedidoProduto pedidoProduto) {
        pedidoProdutoService.updatePedidoProduto(id_pedido_produto, pedidoProduto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete/{id_pedido_produto}")
    public ResponseEntity<Void> deletePedidoProduto(@PathVariable Long id_pedido_produto) {
        pedidoProdutoService.deletePedidoProduto(id_pedido_produto);
        return ResponseEntity.noContent().build();
    }

}
