package com.itinerary.controller;

import com.itinerary.entity.Document;
import com.itinerary.security.AuthenticatedUser;
import com.itinerary.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final AuthenticatedUser authenticatedUser;

    @GetMapping
    public ResponseEntity<List<Document>> getDocuments(@PathVariable Long tripId) {
        return ResponseEntity.ok(documentService.getDocuments(authenticatedUser.getId(), tripId));
    }

    @PostMapping
    public ResponseEntity<Document> addDocument(@PathVariable Long tripId, @RequestBody Map<String, String> body) {
        Document doc = documentService.addDocument(
                authenticatedUser.getId(), tripId,
                body.get("name"), body.get("docType"), body.get("fileUrl"));
        return ResponseEntity.status(HttpStatus.CREATED).body(doc);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long tripId, @PathVariable Long documentId) {
        documentService.deleteDocument(authenticatedUser.getId(), tripId, documentId);
        return ResponseEntity.noContent().build();
    }
}