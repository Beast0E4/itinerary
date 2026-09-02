package main.java.com.itinerary.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "activities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id")
    private Destination destination;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_item_id")
    private ItineraryItem itineraryItem;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 80)
    private String category;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    private BigDecimal price;

    @Column(length = 10)
    @Builder.Default
    private String currency = "USD";

    private BigDecimal rating;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean booked = false;
}