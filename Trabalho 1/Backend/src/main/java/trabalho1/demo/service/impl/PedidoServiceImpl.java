package trabalho1.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import trabalho1.demo.entity.Pedido;
import trabalho1.demo.repository.PedidoRepository;
import trabalho1.demo.service.PedidoService;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Override
    public void addPedido(Pedido pedido) {
        pedidoRepository.save(pedido);
    }

    @Override
    public List<Pedido> getPedidos() {
        return pedidoRepository.findAll();
    }

    @Override
    public Pedido getPedido(Long id_pedido) {
        Pedido pedido = pedidoRepository.findById(id_pedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado!"));
        return pedido;
    }

    @Override
    public void updatePedido(Long id_pedido, Pedido pedido) {
        pedidoRepository.findById(id_pedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado!"));
        pedido.setId_pedido(id_pedido);
        pedidoRepository.save(pedido);
    }

    @Override
    public void deletePedido(Long id_pedido) {
        Pedido pedido = pedidoRepository.findById(id_pedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado!"));
        pedidoRepository.delete(pedido);
    }

}
