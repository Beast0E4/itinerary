package com.itinerary.repository;

import com.itinerary.entity.PackingListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PackingListItemRepository extends JpaRepository<PackingListItem, Long> {
    List<PackingListItem> findByTripIdOrderByCategoryAsc(Long tripId);
    long countByTripIdAndIsPacked(Long tripId, Boolean isPacked);
}