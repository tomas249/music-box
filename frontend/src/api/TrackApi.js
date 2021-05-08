import { post, get } from './Api';

export const getTrackList = (query) => get('/tracks/search/' + query);
export const downloadTrack = (ytId) => get('/tracks/download/' + ytId);
export const likeTrack = (trackId) => get('/tracks/like/' + trackId);
export const getMyTracks = () => get('/tracks/me');
