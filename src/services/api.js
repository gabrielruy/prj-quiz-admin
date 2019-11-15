import axios from 'axios';

import environmentVariables from '../config/env';

const api = axios.create({
  baseURL: environmentVariables.api,
});

export default api;
