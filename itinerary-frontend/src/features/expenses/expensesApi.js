import axiosClient from '../../api/axiosClient';

export const fetchExpensesRequest = (tripId) =>
  axiosClient.get(`/trips/${tripId}/expenses`).then((res) => res.data);

export const addExpenseRequest = (tripId, payload) =>
  axiosClient.post(`/trips/${tripId}/expenses`, payload).then((res) => res.data);

export const updateExpenseRequest = (tripId, expenseId, payload) =>
  axiosClient.put(`/trips/${tripId}/expenses/${expenseId}`, payload).then((res) => res.data);

export const deleteExpenseRequest = (tripId, expenseId) =>
  axiosClient.delete(`/trips/${tripId}/expenses/${expenseId}`).then((res) => res.data);