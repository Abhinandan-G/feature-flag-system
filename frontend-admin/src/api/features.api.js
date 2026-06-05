import createApiClient from '../shared/api/apiClient';

const api = createApiClient(import.meta.env.VITE_API_URL);

export const loginAdmin = (data) =>
  api.post('/auth/admin/login', data);

export const signupAdmin = (data) =>
  api.post('/auth/admin/signup', data);

export const getFeatureFlags = () =>
  api.get('/features');

export const createFeatureFlag = (data) =>
  api.post('/features', data);

export const updateFeatureFlag = (id, data) =>
  api.put(`/features/${id}`, data);

export const deleteFeatureFlag = (id) =>
  api.delete(`/features/${id}`);