import axiosClient from '../../api/axiosClient';

export const fetchItineraryRequest = (tripId) =>
  axiosClient.get(`/trips/${tripId}/itinerary`).then((res) => res.data);

export const addItemRequest = (tripId, payload) =>
  axiosClient.post(`/trips/${tripId}/itinerary/items`, payload).then((res) => res.data);

export const updateItemRequest = (tripId, itemId, payload) =>
  axiosClient.put(`/trips/${tripId}/itinerary/items/${itemId}`, payload).then((res) => res.data);

export const deleteItemRequest = (tripId, itemId) =>
  axiosClient.delete(`/trips/${tripId}/itinerary/items/${itemId}`).then((res) => res.data);

export const reorderItemsRequest = (tripId, dayId, orderedItemIds) =>
  axiosClient
    .patch(`/trips/${tripId}/itinerary/days/${dayId}/reorder`, { orderedItemIds })
    .then((res) => res.data);