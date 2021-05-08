import { post, get } from './Api';

export const createPlaylist = (name) => post('/playlists/create', { name });
export const getPlaylists = () => get('/playlists/me');
export const getPlaylistById = (id) => get('/playlists/' + id);
export const addTrackToPlaylist = (trackId, playlistId) =>
  post('/playlists/add/track', { trackId, playlistId });
export const removeTrackFromPlaylist = (trackId, playlistId) =>
  post('/playlists/remove/track', { trackId, playlistId });
