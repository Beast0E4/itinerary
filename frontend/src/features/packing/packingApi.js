import axiosClient from '../../api/axiosClient';

export const fetchPackingRequest = (tripId) =>
  axiosClient.get(`/trips/${tripId}/packing-list`).then((res) => res.data);

export const addPackingItemRequest = (tripId, payload) =>
  axiosClient.post(`/trips/${tripId}/packing-list`, payload).then((res) => res.data);

export const updatePackingItemRequest = (tripId, itemId, payload) =>
  axiosClient.patch(`/trips/${tripId}/packing-list/${itemId}`, payload).then((res) => res.data);

export const deletePackingItemRequest = (tripId, itemId) =>
  axiosClient.delete(`/trips/${tripId}/packing-list/${itemId}`).then((res) => res.data);