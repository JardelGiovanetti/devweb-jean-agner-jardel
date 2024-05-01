package trabalho1.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import trabalho1.demo.entity.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

}
