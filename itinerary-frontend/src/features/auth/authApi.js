import axiosClient from '../../api/axiosClient';

export const registerRequest = (payload) =>
  axiosClient.post('/auth/register', payload).then((res) => res.data);

export const loginRequest = (payload) =>
  axiosClient.post('/auth/login', payload).then((res) => res.data);