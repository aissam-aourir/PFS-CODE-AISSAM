package com.ordex.entities;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ordex.security.entities.Utilisateur;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")

public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double total;
    private String status;
    private String phone;
    private LocalDateTime createdAt;
    private String paymentMethod;
    @ManyToOne
    @JsonManagedReference
    private Utilisateur client;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderProduct> orderProducts;
}

