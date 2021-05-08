import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const Player = ({
  track,
  isPlaying,
  isShuffle,
  isRepeat,
  isQueueDiplaying,
  controls,
  displayQueue,
}) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [barValue, setBarValue] = useState(0);
  const [isDragging, setDragging] = useState(false);

  useEffect(() => {
    if (!track || !('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.name,
      artist: track.artists[0].name,
      // album: 'Album Title',
      artwork: [
        {
          src: '/logo512.png',
        },
      ],
    });
    navigator.mediaSession.setActionHandler('play', onPlay);
    navigator.mediaSession.setActionHandler('pause', onPause);
    // navigator.mediaSession.setActionHandler('seekto', seekTo);
    navigator.mediaSession.setActionHandler('previoustrack', () => controls.previous());
    navigator.mediaSession.setActionHandler('nexttrack', () => controls.next());
  }, [track]);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  function updatePositionState(total, pos) {
    navigator.mediaSession.setPositionState({
      duration: total,
      playbackRate: 1,
      position: pos,
    });
  }

  const play = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const onPlay = () => {
    audioRef.current.play();
    controls.resume();
  };

  const onPause = () => {
    audioRef.current.pause();
    controls.pause();
  };

  const seekTo = (e) => {
    setCurrentTime(e.seekTime);
    setBarValue(e.seekTime);
    console.log(e.seekTime);
  };

  const check = (e) => {
    setCurrentTime(e.target.currentTime);
    !isDragging && setBarValue(e.target.currentTime);
    // updatePositionState(audioRef.current.duration, e.target.currentTime);
    // navigator.mediaSession.currentTime = e.target.currentTime;
  };

  const timeFormat = (duration) => {
    const min = Math.floor(duration / 60);
    const sec = Math.round(duration % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (track) {
    return (
      <ContainerStyled>
        <TD1>
          <span>{track.name}</span>
          <span>{track.artists.map((a) => a.name).join(', ')}</span>
        </TD1>
        <TD2>
          <div>
            <button className={isShuffle ? 'selected' : ''} onClick={() => controls.shuffle()}>
              <ShuffleIcon />
            </button>
            <button
              onClick={() => {
                if (currentTime > audioRef.current.duration * 0.1) {
                  audioRef.current.currentTime = 0;
                } else {
                  controls.previous();
                }
              }}
            >
              <PreviousIcon />
            </button>
            <button
              onClick={play}
              style={{ backgroundColor: 'white', borderRadius: '32px', color: 'black' }}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={() => controls.next()}>
              <NextIcon />
            </button>
            <button className={isRepeat ? 'selected' : ''} onClick={() => controls.repeat()}>
              {isRepeat === 2 ? <Repeat1Icon /> : <RepeatIcon />}
            </button>
          </div>
          <div>
            <div>{timeFormat(isDragging ? barValue : currentTime)}</div>
            <input
              type='range'
              onMouseDown={() => {
                setDragging(true);
              }}
              onTouchStart={(e) => {
                setDragging(true);
              }}
              onMouseUp={(e) => {
                const time = e.target.value;
                setDragging(false);
                setCurrentTime(time);
                audioRef.current.currentTime = time;
              }}
              onTouchEnd={(e) => {
                const time = e.target.value;
                setDragging(false);
                setCurrentTime(time);
                audioRef.current.currentTime = time;
              }}
              value={barValue}
              onChange={(e) => {
                const time = e.target.value;
                setBarValue(time);
              }}
              max={audioRef.current?.duration || 0}
              width='200px'
            />
            <div>{timeFormat(audioRef.current?.duration || 0)}</div>
          </div>
        </TD2>
        <TD3>
          <button className={isQueueDiplaying ? 'selected' : ''} onClick={() => displayQueue()}>
            <QueueIcon />
          </button>
          <button>
            <VolumeIcon />
          </button>
        </TD3>
        <audio
          style={{ display: 'none' }}
          onTimeUpdate={check}
          onLoadedData={() => {
            isPlaying ? audioRef.current.play() : audioRef.current.pause();
          }}
          loop={isRepeat === 2}
          onEnded={() => {
            isRepeat !== 2 && controls.next();
          }}
          ref={audioRef}
          src={`${process.env.REACT_APP_API_URL}/tracks/play/${track.file}`}
        ></audio>
      </ContainerStyled>
    );
  } else {
    return <h3 style={{ textAlign: 'center' }}>Select a song to play!</h3>;
  }
};

export default Player;

const ContainerStyled = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  @media (max-width: 800px) {
    flex-wrap: wrap;
  }
`;

const TD1 = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  & > span:first-child {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: normal;
    line-height: 24px;
    text-transform: none;
    color: white;
  }
  & > span:last-child {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: normal;
    line-height: 16px;
    text-transform: none;
  }
  @media (max-width: 800px) {
    width: 100%;
    margin-bottom: 12px;
  }
`;

const TD2 = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > div:first-child {
    justify-content: space-between;
    margin-bottom: 12px;
    width: 224px;
    display: flex;
    & > button {
      position: relative;
      display: flex;
      align-items: center;
      background: transparent;
      border: none;
      justify-content: center;
      color: #b3b3b3;
      width: 32px;
      height: 32px;
      & > svg {
        fill: currentcolor;
        // color: #b3b3b3;
      }
    }
    & > button:hover:not(.selected) {
      color: white;
    }
    & > .selected {
      color: #1db954;
    }
    & > .selected::after {
      background-color: currentColor;
      border-radius: 50%;
      bottom: 0;
      content: '';
      display: block;
      height: 4px;
      left: 50%;
      position: absolute;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      width: 4px;
    }
  }
  & > div:last-child {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > div {
      color: rgb(179, 179, 179);
      width: 40px;
      text-align: center;
      font-size: 11px;
    }
    & > input {
      width: 100%;
      height: 12px;
    }
  }
  @media (max-width: 800px) {
    width: 100%;
    margin-bottom: 12px;
  }
`;

const TD3 = styled.div`
  width: 30%;
  display: flex;
  justify-content: flex-end;
  & > button {
    position: relative;

    margin-right: 12px;
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    justify-content: center;
    color: #b3b3b3;
    width: 32px;
    height: 32px;
    & > svg {
      fill: currentcolor;
      // color: #b3b3b3;
    }
  }
  & > button:hover:not(.selected) {
    color: white;
  }
  & > .selected {
    color: #1db954;
  }
  & > .selected::after {
    background-color: currentColor;
    border-radius: 50%;
    bottom: 0;
    content: '';
    display: block;
    height: 4px;
    left: 50%;
    position: absolute;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    width: 4px;
  }
  @media (max-width: 800px) {
    display: none;
  }
`;

const ShuffleIcon = () => (
  <svg role='img' height='16px' width='16px' viewBox='0 0 16 16'>
    <path d='M4.5 6.8l.7-.8C4.1 4.7 2.5 4 .9 4v1c1.3 0 2.6.6 3.5 1.6l.1.2zm7.5 4.7c-1.2 0-2.3-.5-3.2-1.3l-.6.8c1 1 2.4 1.5 3.8 1.5V14l3.5-2-3.5-2v1.5zm0-6V7l3.5-2L12 3v1.5c-1.6 0-3.2.7-4.2 2l-3.4 3.9c-.9 1-2.2 1.6-3.5 1.6v1c1.6 0 3.2-.7 4.2-2l3.4-3.9c.9-1 2.2-1.6 3.5-1.6z'></path>
  </svg>
);

const PreviousIcon = () => (
  <svg role='img' height='16px' width='16px' viewBox='0 0 16 16'>
    <path d='M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z'></path>
  </svg>
);

const NextIcon = () => (
  <svg role='img' height='16px' width='16px' viewBox='0 0 16 16'>
    <path d='M11 3v4.119L3 2.5v11l8-4.619V13h2V3z'></path>
  </svg>
);

const Repeat1Icon = () => (
  <svg role='img' height='16px' width='16px' viewBox='0 0 16 16'>
    <path fill='none' d='M0 0h16v16H0z'></path>
    <path d='M5 5v-.5V4c-2.2.3-4 2.2-4 4.5 0 .6.1 1.2.4 1.8l.9-.5C2.1 9.4 2 9 2 8.5 2 6.7 3.3 5.3 5 5zM10.5 12H6v-1.5l-3.5 2 3.5 2V13h4.5c1.9 0 3.5-1.2 4.2-2.8-.5.3-1 .5-1.5.6-.7.7-1.6 1.2-2.7 1.2zM11.5 0C9 0 7 2 7 4.5S9 9 11.5 9 16 7 16 4.5 14 0 11.5 0zm.9 7h-1.3V3.6H10v-1h.1c.2 0 .3 0 .4-.1.1 0 .3-.1.4-.2.1-.1.2-.2.2-.3.1-.1.1-.2.1-.3v-.1h1.1V7z'></path>
  </svg>
);

const RepeatIcon = () => (
  <svg role='img' height='16px' width='16px' viewBox='0 0 16 16'>
    <path d='M5.5 5H10v1.5l3.5-2-3.5-2V4H5.5C3 4 1 6 1 8.5c0 .6.1 1.2.4 1.8l.9-.5C2.1 9.4 2 9 2 8.5 2 6.6 3.6 5 5.5 5zm9.1 1.7l-.9.5c.2.4.3.8.3 1.3 0 1.9-1.6 3.5-3.5 3.5H6v-1.5l-3.5 2 3.5 2V13h4.5C13 13 15 11 15 8.5c0-.6-.1-1.2-.4-1.8z'></path>
  </svg>
);

const PauseIcon = () => (
  <svg role='img' height='16px' width='16px' viewBox='0 0 16 16'>
    <path fill='none' d='M0 0h16v16H0z'></path>
    <path d='M3 2h3v12H3zM10 2h3v12h-3z'></path>
  </svg>
);

const PlayIcon = () => (
  <svg role='img' height='16px' width='16px' viewBox='0 0 16 16'>
    <path d='M4.018 14L14.41 8 4.018 2z'></path>
  </svg>
);

const VolumeIcon = () => (
  <svg height='32px' width='32px' viewBox='0 0 16 16'>
    <path d='M12.945 1.379l-.652.763c1.577 1.462 2.57 3.544 2.57 5.858s-.994 4.396-2.57 5.858l.651.763a8.966 8.966 0 00.001-13.242zm-2.272 2.66l-.651.763a4.484 4.484 0 01-.001 6.397l.651.763c1.04-1 1.691-2.404 1.691-3.961s-.65-2.962-1.69-3.962zM0 5v6h2.804L8 14V2L2.804 5H0zm7-1.268v8.536L3.072 10H1V6h2.072L7 3.732z'></path>
  </svg>
);

const QueueIcon = () => (
  <svg width='32px' height='32px' fill='currentColor' viewBox='0 0 16 16'>
    <path
      fillRule='evenodd'
      d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z'
    />
  </svg>
);
