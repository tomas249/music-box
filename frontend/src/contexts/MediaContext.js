import { useState, useReducer, createContext } from 'react';

const MediaContext = createContext();

const TrackReducer = (state, action) => {
  switch (action.type) {
    case 'PLAY':
      return { info: action.payload, playing: true };
    case 'RESUME':
      return { ...state, playing: true };
    case 'PAUSE':
      return { ...state, playing: false };
    default:
      return state;
  }
};

const QueueReducer = (state, action) => {
  switch (action.type) {
    case 'NEXT':
      return;
    case 'PREVIOUS':
      return;
    case 'SHUFFLE':
      return;
    case 'REPEAT':
      return;
    default:
      return state;
  }
};

const MediaReducer = (state, action) => {
  switch (action.type) {
    case 'PLAY':
      return { info: action.payload, playing: true };
    case 'RESUME':
      return { ...state, playing: true };
    case 'PAUSE':
      return { ...state, playing: false };
    case 'NEXT':
      return;
    case 'PREVIOUS':
      return;
    case 'SHUFFLE':
      return;
    case 'REPEAT':
      return;
    default:
      return state;
  }
};

const MediaProvider = (Component) =>
  function () {
    const initTrack = {
      info: null,
      playing: false,
    };
    const initQueue = {
      selectedIdx: 0,
      list: [],
      shuffle: false,
      repeat: 0,
    };
    const initMedia = {
      track: {
        info: null,
        playing: false,
      },
      queue: {
        selectedIdx: 0,
        list: [],
        shuffle: false,
        repeat: 0,
      },
    };
    // const [track, setTrack] = useReducer(TrackReducer, initTrack);
    // const [queue, setQueue] = useReducer(QueueReducer, initQueue);
    const [media, dispatchMedia] = useReducer(MediaReducer, initMedia);

    return (
      <MediaContext.Provider value={{ media, dispatchMedia }}>
        <Component />
      </MediaContext.Provider>
    );
  };

export { MediaProvider, MediaContext };
