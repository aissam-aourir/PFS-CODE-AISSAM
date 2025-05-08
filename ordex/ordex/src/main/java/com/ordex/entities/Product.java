package com.ordex.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ordex.security.entities.Utilisateur;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String imageURL;
    private LocalDateTime createdAt;
    private Boolean isValidByAdmin = false;

    @ManyToOne
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Utilisateur supplier;
}

