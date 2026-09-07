package com.itinerary.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * The shape your Python AI agent service must return from its /plan
 * endpoint. Spring does not generate any of this content — it only
 * relays the request and, once the person approves the preview,
 * persists this structure into the existing Trip/Destination/
 * ItineraryDay/ItineraryItem/Budget tables via AiPlannerService.applyPlan().
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiTripPlanResponse {

    /** One or two sentences summarizing the proposed trip, shown in the preview UI. */
    private String summary;

    /**
     * The actual destination(s) this plan is built around. Required even
     * when the request's "destinations" wishlist was empty — in that case
     * this is the AI's own choice of where to send the person, and it's
     * what gets persisted as the trip's real Destination rows.
     */
    private List<ProposedDestination> destinations;

    private List<ProposedDay> days;
    private BudgetSuggestion budgetSuggestion;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProposedDestination {
        private String name;
        private String country;
        private String city;
        private Double latitude;
        private Double longitude;
        private LocalDate arrivalDate;
        private LocalDate departureDate;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProposedDay {
        private Integer dayNumber;
        private LocalDate date;
        private String title;
        private List<ProposedItem> items;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProposedItem {
        /** Must match one of the ItemType enum values: FLIGHT, ACTIVITY, MEAL, etc. */
        private String itemType;
        private String title;
        private String description;
        private String locationName;
        private Double latitude;
        private Double longitude;
        private LocalTime startTime;
        private LocalTime endTime;
        private BigDecimal estimatedCost;
        private String currency;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BudgetSuggestion {
        private BigDecimal totalBudget;
        private BigDecimal accommodationLimit;
        private BigDecimal transportLimit;
        private BigDecimal foodLimit;
        private BigDecimal activitiesLimit;
        private BigDecimal miscLimit;
    }
}