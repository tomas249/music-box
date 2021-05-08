import { useEffect, useState } from 'react';
import { getPlaylists } from '../api/PlaylistApi';

const usePlaylist = () => {
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    getPlaylists().then((collection) => {
      setPlaylists(collection.items);
    });
  }, []);

  return [playlists, setPlaylists];
};

export default usePlaylist;
