import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (error.response.status === 401 && error.response.data.code !== 'TokenExpiredError') {
      // window.location.href = '/auth';
      return Promise.reject(error);
    }

    if (error.response.status === 401 && error.response.data.code === 'TokenExpiredError') {
      return axios.get('/auth/identify').then((res) => {
        axios.defaults.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
        return axios(originalRequest);
      });
    } else {
      return Promise.reject(error);
    }
  }
);

export const setBearerToken = (token) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const responseHandler = (response) => response.data;

const errorHandler = (error) => {
  if (error.status >= 500) console.error(error);
  else {
    // console.error(error.response);
    throw new Error(error.response?.data.message || 'API Error');
  }
};

export const post = (path, payload, opt = {}) =>
  axios.post(path, payload).then(responseHandler).catch(errorHandler);

export const get = (path, opt = {}) => axios.get(path).then(responseHandler).catch(errorHandler);
