import React, { useState } from 'react';

const playerStyle = {
  width: '100%',
  outline: 0,
};

function PlayerComponent({ song }) {
  const api = 'http://localhost:5000';

  if (!song) {
    return <div style={{ margin: 'auto' }}>Select a song to play from the "Music list" tab</div>;
  } else {
    return (
      <div style={playerStyle}>
        <h3 style={{ marginLeft: '2rem' }}>
          {song.title} ({song.author})
        </h3>
        <audio
          style={playerStyle}
          autoPlay
          controls
          controlsList="nodownload"
          src={`${process.env.REACT_APP_API}/songs/play/${song.bucket}/${song._id}`}
        ></audio>
      </div>
    );
  }
}

export default PlayerComponent;
