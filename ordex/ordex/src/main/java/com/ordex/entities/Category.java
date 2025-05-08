package com.ordex.entities;

import jakarta.persistence.*;
import lombok.*;
import com.ordex.security.entities.Favoris;
import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity

@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    //je veux meme qu'il y a un champ pour les favoris , car une categorie peut etre apparetenat a plusieurs ligne sde tables favoris , on doit mettre un champ pour les favoris
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Favoris> favoris;

}
