package trabalho1.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class PedidoProduto {

    @Id
    @GeneratedValue
    private Long id_pedido_produto;

    private Long id_produto;

    private Long id_pedido;

    private int quantidade;

    private double preco_unitario;

    private double desconto;

    // getters and setters

    public Long getId_pedido_produto() {
        return id_pedido_produto;
    }

    public void setId_pedido_produto(Long id_pedido_produto) {
        this.id_pedido_produto = id_pedido_produto;
    }

    public Long getId_produto() {
        return this.id_produto;
    }

    public void setId_produto(Long id_produto) {
        this.id_produto = id_produto;
    }

    public Long getId_pedido() {
        return this.id_pedido;
    }

    public void setId_pedido(Long id_pedido) {
        this.id_pedido = id_pedido;
    }

    public int getQuantidade() {
        return this.quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public double getPreco_unitario() {
        return this.preco_unitario;
    }

    public void setPreco_unitario(double preco_unitario) {
        this.preco_unitario = preco_unitario;
    }

    public double getDesconto() {
        return this.desconto;
    }

    public void setDesconto(double desconto) {
        this.desconto = desconto;
    }

}
