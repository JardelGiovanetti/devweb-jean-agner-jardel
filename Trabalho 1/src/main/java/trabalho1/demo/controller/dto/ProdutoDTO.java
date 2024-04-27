package trabalho1.demo.controller.dto;

import lombok.Data;

@Data
public class ProdutoDTO {
    private String codigo;
    private String descricao;
    private double valor_custo;
    private double valor_venda;
}
