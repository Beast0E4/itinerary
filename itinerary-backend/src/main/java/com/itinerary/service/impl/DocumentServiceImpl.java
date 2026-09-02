package com.itinerary.service.impl;

import com.itinerary.entity.Document;
import com.itinerary.entity.Trip;
import com.itinerary.entity.User;
import com.itinerary.exception.ResourceNotFoundException;
import com.itinerary.repository.DocumentRepository;
import com.itinerary.repository.TripRepository;
import com.itinerary.repository.UserRepository;
import com.itinerary.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Override
    public List<Document> getDocuments(Long userId, Long tripId) {
        assertAccessible(tripId, userId);
        return documentRepository.findByTripIdOrderByUploadedAtDesc(tripId);
    }

    @Override
    @Transactional
    public Document addDocument(Long userId, Long tripId, String name, String docType, String fileUrl) {
        assertEditable(tripId, userId);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        User uploader = userRepository.findById(userId).orElse(null);

        Document document = Document.builder()
                .trip(trip)
                .uploadedBy(uploader)
                .name(name)
                .docType(docType)
                .fileUrl(fileUrl)
                .build();

        return documentRepository.save(document);
    }

    @Override
    @Transactional
    public void deleteDocument(Long userId, Long tripId, Long documentId) {
        assertEditable(tripId, userId);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (!document.getTrip().getId().equals(tripId)) {
            throw new AccessDeniedException("Document does not belong to this trip");
        }
        documentRepository.delete(document);
    }

    private void assertAccessible(Long tripId, Long userId) {
        if (!tripRepository.isAccessibleByUser(tripId, userId)) {
            throw new AccessDeniedException("You do not have access to this trip");
        }
    }

    private void assertEditable(Long tripId, Long userId) {
        if (!tripRepository.isEditableByUser(tripId, userId)) {
            throw new AccessDeniedException("You do not have edit permission for this trip");
        }
    }
}