import axios from 'axios';

const createApiClient = (baseURL) => {
  const client = axios.create({ baseURL });
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        error.response?.data?.message || 'Something went wrong';
      return Promise.reject({ message, status: error.response?.status });
    }
  );

  return client;
};

export default createApiClient;