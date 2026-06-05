import createApiClient from '../shared/api/apiClient';

const api = createApiClient(import.meta.env.VITE_API_URL);

export const loginUser = (data) =>
  api.post('/auth/user/login', data);

export const signupUser = (data) =>
  api.post('/auth/user/signup', data);

export const getOrgFlags = () =>
  api.get('/features/my-org');

export const checkFeatureFlags = (feature_ids) =>
  api.post('/features/check', { feature_ids });