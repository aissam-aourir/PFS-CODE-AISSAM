package com.ordex.helpers;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDTO {
    private Long id;
    private Double total;
    private String status;
    private String phone;
    private String paymentMethod;
    private LocalDateTime createdAt;

    private ClientDTO client;
    private List<OrderProductDTO> orderProducts;

    @Data
    public static class ClientDTO {
        private Long id;
        private String username;
        private String email;
    }

    @Data
    public static class OrderProductDTO {
        private Long quantity;
        private Double priceAtPurchases;
        private ProductDTO product;

        @Data
        public static class ProductDTO {
            private Long id;
            private String name;
        }
    }
}
