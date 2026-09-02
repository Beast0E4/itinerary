package com.itinerary.repository;

import com.itinerary.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByTripIdOrderByCreatedAtDesc(Long tripId);
}