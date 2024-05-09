package trabalho1.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import trabalho1.demo.entity.Pedido;
import trabalho1.demo.service.PedidoService;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping("/add")
    public ResponseEntity<Void> addPedido(@RequestBody Pedido pedido) {
        pedidoService.addPedido(pedido);
        return ResponseEntity.noContent().build();
    }

    @GetMapping()
    public List<Pedido> getPedidos() {
        return pedidoService.getPedidos();
    }

    @GetMapping("/get")
    public Pedido getPedido(@RequestParam Long id_pedido) {
        return pedidoService.getPedido(id_pedido);
    }

    @PutMapping("/update/{id_pedido}")
    public ResponseEntity<Void> updatePedido(@PathVariable Long id_pedido, @RequestBody Pedido pedido) {
        pedidoService.updatePedido(id_pedido, pedido);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete/{id_pedido}")
    public ResponseEntity<Void> deletePedido(@PathVariable Long id_pedido) {
        pedidoService.deletePedido(id_pedido);
        return ResponseEntity.noContent().build();
    }

}
