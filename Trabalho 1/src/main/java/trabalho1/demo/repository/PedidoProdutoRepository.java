package trabalho1.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import trabalho1.demo.entity.PedidoProduto;

public interface PedidoProdutoRepository extends JpaRepository<PedidoProduto, Long> {

}
