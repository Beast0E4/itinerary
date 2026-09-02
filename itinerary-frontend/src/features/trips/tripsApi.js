import axiosClient from '../../api/axiosClient';

export const fetchTripsRequest = () => axiosClient.get('/trips').then((res) => res.data);

export const fetchTripRequest = (tripId) =>
  axiosClient.get(`/trips/${tripId}`).then((res) => res.data);

export const createTripRequest = (payload) =>
  axiosClient.post('/trips', payload).then((res) => res.data);

export const updateTripRequest = (tripId, payload) =>
  axiosClient.patch(`/trips/${tripId}`, payload).then((res) => res.data);

export const deleteTripRequest = (tripId) =>
  axiosClient.delete(`/trips/${tripId}`).then((res) => res.data);