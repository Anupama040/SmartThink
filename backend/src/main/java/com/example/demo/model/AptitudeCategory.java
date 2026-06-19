package com.example.demo.model;

import com.example.demo.model.enums.CategoryType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "aptitude_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class AptitudeCategory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private CategoryType name;

    @Column(columnDefinition = "TEXT")
    private String description;
}
