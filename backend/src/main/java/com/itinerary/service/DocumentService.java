package com.itinerary.service;

import com.itinerary.entity.Document;

import java.util.List;

public interface DocumentService {
    List<Document> getDocuments(Long userId, Long tripId);
    Document addDocument(Long userId, Long tripId, String name, String docType, String fileUrl);
    void deleteDocument(Long userId, Long tripId, Long documentId);
}