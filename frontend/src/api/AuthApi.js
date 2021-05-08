import { post, get } from './Api';

export const identify = () => get('/auth/identify');

export const login = (key, password) => post('/auth/login', { key, password });

export const confirmInvitation = (keyId, fullname) =>
  post('/auth/invitation/confirm', { keyId, fullname });

export const getInvitation = (key) => get('/auth/invitation/' + key);

export const changePassword = (newPassword) => post('/auth/changePassword', { newPassword });
