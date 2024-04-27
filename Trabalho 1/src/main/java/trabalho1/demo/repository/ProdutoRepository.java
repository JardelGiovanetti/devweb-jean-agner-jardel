package trabalho1.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import trabalho1.demo.entity.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

}
