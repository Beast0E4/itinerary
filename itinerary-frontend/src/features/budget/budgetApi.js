import axiosClient from '../../api/axiosClient';

export const fetchBudgetRequest = (tripId) =>
  axiosClient.get(`/trips/${tripId}/budget`).then((res) => res.data);

export const updateBudgetRequest = (tripId, payload) =>
  axiosClient.put(`/trips/${tripId}/budget`, payload).then((res) => res.data);