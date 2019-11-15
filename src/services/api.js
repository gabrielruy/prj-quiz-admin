import axios from 'axios';

import environmentVariables from '../config/env';
import { getToken } from './auth';

const api = axios.create({
  baseURL: environmentVariables.api,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
