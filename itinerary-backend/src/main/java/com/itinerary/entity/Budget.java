package main.java.com.itinerary.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "budgets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false, unique = true)
    private Trip trip;

    @Column(name = "total_budget", nullable = false)
    @Builder.Default
    private BigDecimal totalBudget = BigDecimal.ZERO;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "accommodation_limit")
    @Builder.Default
    private BigDecimal accommodationLimit = BigDecimal.ZERO;

    @Column(name = "transport_limit")
    @Builder.Default
    private BigDecimal transportLimit = BigDecimal.ZERO;

    @Column(name = "food_limit")
    @Builder.Default
    private BigDecimal foodLimit = BigDecimal.ZERO;

    @Column(name = "activities_limit")
    @Builder.Default
    private BigDecimal activitiesLimit = BigDecimal.ZERO;

    @Column(name = "misc_limit")
    @Builder.Default
    private BigDecimal miscLimit = BigDecimal.ZERO;
}