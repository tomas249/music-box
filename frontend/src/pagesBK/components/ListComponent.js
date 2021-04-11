import '../App.css';
import React, { useState, useEffect } from 'react';

function ListComponent({ currentSong, onSelectSong }) {
  const [songsList, setSongsList] = useState(null);

  const api = process.env.REACT_APP_API;

  useEffect(() => {
    fetch(api + '/songs')
      .then((res) => res.json())
      .then(({ songs }) => {
        setSongsList(songs);
      })
      .catch(console.error);
  }, []);

  const handleDownload = (songId, songName) =>
    window.open(`${api}/download-media/${songId}/${songName}`, '_blank');

  if (songsList?.length) {
    return songsList.map((song) => (
      <div key={song._id}>
        <div className="song-info">
          <span>{song.title}</span>
          <span>Artist: {song.artist.name}</span>
        </div>
        <button onClick={() => onSelectSong(song)}>Play</button>
        <button onClick={() => handleDownload(song._id, song.title)}>Download</button>
        {currentSong?._id === song._id && <span>~ Currently playing</span>}
      </div>
    ));
  } else if (!songsList?.length) {
    return <div>No songs yet!</div>;
  } else {
    return <div>Loading...</div>;
  }
}

export default ListComponent;
