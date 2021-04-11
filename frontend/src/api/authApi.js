import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;
const api = baseURL + '/auth';

export const getInvitation = (key) => {
  return axios
    .get(`${api}/invitation/${key}`)
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};

export const confirmInvitation = (keyId, fullname) => {
  return axios
    .post(`${api}/invitation/confirm`, { keyId, fullname }, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};

export const login = (key, password) => {
  return axios
    .post(`${api}/login`, { key, password }, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};

export const identify = () => {
  return axios
    .get(`${api}/identify`, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};

export const changePassword = (newPassword, token) => {
  return axios
    .post(
      `${api}/changePassword`,
      { newPassword },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};
