import axiosClient from '../../api/axiosClient';

export const requestAiPlanRequest = (tripId, payload) =>
  axiosClient.post(`/trips/${tripId}/ai/plan`, payload).then((res) => res.data);

export const applyAiPlanRequest = (tripId, plan) =>
  axiosClient.post(`/trips/${tripId}/ai/plan/apply`, plan).then((res) => res.data);