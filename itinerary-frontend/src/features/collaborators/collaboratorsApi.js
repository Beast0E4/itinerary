import axiosClient from '../../api/axiosClient';

export const fetchCollaboratorsRequest = (tripId) =>
  axiosClient.get(`/trips/${tripId}/collaborators`).then((res) => res.data);

export const inviteCollaboratorRequest = (tripId, payload) =>
  axiosClient.post(`/trips/${tripId}/collaborators/invite`, payload).then((res) => res.data);

export const removeCollaboratorRequest = (tripId, collaboratorUserId) =>
  axiosClient.delete(`/trips/${tripId}/collaborators/${collaboratorUserId}`).then((res) => res.data);

export const acceptInviteRequest = (tripId) =>
  axiosClient.post(`/trips/${tripId}/collaborators/accept`).then((res) => res.data);