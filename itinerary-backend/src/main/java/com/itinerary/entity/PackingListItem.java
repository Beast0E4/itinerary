package main.java.com.itinerary.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "packing_list_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PackingListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false, length = 80)
    @Builder.Default
    private String category = "General";

    @Column(name = "item_name", nullable = false, length = 200)
    private String itemName;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "is_packed", nullable = false)
    @Builder.Default
    private Boolean isPacked = false;
}