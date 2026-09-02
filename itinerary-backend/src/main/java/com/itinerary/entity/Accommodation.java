package main.java.com.itinerary.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "accommodations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Accommodation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id")
    private Destination destination;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 300)
    private String address;

    @Column(name = "check_in_date")
    private LocalDate checkInDate;

    @Column(name = "check_out_date")
    private LocalDate checkOutDate;

    @Column(name = "confirmation_number", length = 100)
    private String confirmationNumber;

    @Column(name = "cost_per_night")
    private BigDecimal costPerNight;

    @Column(length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(columnDefinition = "TEXT")
    private String notes;
}