import { post, get } from './Api';

export const getArtist = (id) => get('/artists/' + id);
export const getUserArtists = () => get('/artists/me');
export const followArtist = (id) => get('/artists/follow/' + id);
