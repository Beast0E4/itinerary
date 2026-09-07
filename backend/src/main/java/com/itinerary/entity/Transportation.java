package com.itinerary.entity;

import com.itinerary.entity.enums.TransportMode;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transportation")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Transportation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TransportMode mode;

    @Column(length = 150)
    private String provider;

    @Column(name = "departure_location", length = 200)
    private String departureLocation;

    @Column(name = "arrival_location", length = 200)
    private String arrivalLocation;

    @Column(name = "departure_datetime")
    private LocalDateTime departureDatetime;

    @Column(name = "arrival_datetime")
    private LocalDateTime arrivalDatetime;

    @Column(name = "confirmation_number", length = 100)
    private String confirmationNumber;

    private BigDecimal cost;

    @Column(length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(columnDefinition = "TEXT")
    private String notes;
}