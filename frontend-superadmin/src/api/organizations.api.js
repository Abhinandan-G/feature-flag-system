import createApiClient from '../shared/api/apiClient';

const api = createApiClient(import.meta.env.VITE_API_URL);

export const loginSuperAdmin = (data) =>
  api.post('/auth/superadmin/login', data);

export const getOrganizations = () =>
  api.get('/organizations');

export const createOrganization = (org_name) =>
  api.post('/organizations', { org_name });

export const deleteOrganization = (id) =>
  api.delete(`/organizations/${id}`);