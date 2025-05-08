package com.ordex.security.entities;

import com.ordex.entities.Category;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="favoris")
public class Favoris {
    //c'est une table de jointure entre la table de users et la table de categories, c'est un user ,qui est un clinet , peut avoir plusieurs categoeis qui sont favoris et uen categorie peut etre favoris par plusieurs cleints
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Utilisateur user;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;



}
