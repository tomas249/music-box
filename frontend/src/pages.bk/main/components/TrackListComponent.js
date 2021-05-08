import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const TooltipComponet = ({ display, out, pos, menu }) => {
  const [displayM, setDisplayM] = useState(false);
  const [posM, setPosM] = useState([0, 0]);
  const [submenu, setsubmenu] = useState([]);

  useEffect(() => {
    setDisplayM(false);
  }, [display]);

  const openMenu = (e, submenu) => {
    setDisplayM(false);
    e.stopPropagation();
    setsubmenu(submenu);
    const bc = e.target.getBoundingClientRect();
    setPosM([bc.left - bc.width, bc.top]);
    setDisplayM(true);
  };

  const Menu = ({ title, submenu, action }) => {
    return (
      <div
        onClick={(e) => (submenu ? openMenu(e, submenu) : action())}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onMouseEnter={(e) => openMenu(e, submenu)}
      >
        {title}
        {submenu?.length > 0 && (
          <span style={{ transform: 'rotate(90deg)', fill: 'currentcolor' }}>
            <ExpandIcon />
          </span>
        )}
      </div>
    );
  };

  if (display) {
    return (
      <TooltipBackground onClick={out}>
        <Tooltip style={{ left: pos[0] - 200 + 'px', top: pos[1] + 'px' }}>
          {menu.map((item, i) => (
            <Menu
              key={i}
              title={item.title}
              action={item.action}
              submenu={item.submenu?.map((e) => ({ ...e, action: item.action }))}
            />
          ))}
        </Tooltip>
        {displayM && submenu?.length > 0 && (
          <Tooltip
            onMouseLeave={(e) => setDisplayM(false)}
            style={{ left: posM[0] + 'px', top: posM[1] + 'px' }}
          >
            {submenu.map((item, i) => (
              <div key={i} onClick={() => item.action(item._id)}>
                {item.name}
              </div>
            ))}
          </Tooltip>
        )}
      </TooltipBackground>
    );
  } else {
    return <></>;
  }
};

const TooltipBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Tooltip = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 99;
  background-color: #282828;
  border: 1px solid #282828;
  border-radius: 4px;
  width: 200px;
  padding: 2px;
  margin: 0;
  box-shadow: 0 16px 24px rgb(0 0 0 / 30%), 0 6px 8px rgb(0 0 0 / 20%);
  & > div {
    padding: 12px 16px;
    border-radius: 2px;
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    cursor: default;
    &:hover {
      background-color: #ffffff1a;
    }
  }
`;

const TrackListComponent = ({
  list: initialList,
  currentTrack,
  maxValues = 5,
  isPlaying,
  controls,
  playlistId,
  handleAddToPlaylist,
  handleRemoveFromPlaylist,
}) => {
  const [list, setList] = useState(initialList);
  const [displayOpt, setDisplayOpt] = useState(false);
  const [pos, setPos] = useState([0, 0]);
  const [trackId, setTrackId] = useState('');

  const handleTrackClick = (track, idx) => {
    if (track._id === currentTrack?._id) {
      isPlaying ? controls.pause() : controls.resume();
    } else {
      controls.play(idx);
    }
  };

  const onOpenOpt = (e, trackId) => {
    e.stopPropagation();
    const bc = e.target.getBoundingClientRect();
    setPos([bc.left, bc.bottom]);
    setTrackId(trackId);
    setDisplayOpt(true);
  };

  const onCloseOpt = (e) => {
    e.stopPropagation();
    setDisplayOpt(false);
  };

  const addToPlaylist = (playlist) => {
    handleAddToPlaylist(trackId, playlist);
  };

  const removeFromPlaylist = () => {
    handleRemoveFromPlaylist(trackId, playlistId);
    setList(list.filter((item) => item._id !== trackId));
  };

  if (!list || list?.length === 0) {
    return <div>List is empty</div>;
  } else {
    return (
      <>
        <HeaderStyled>
          <div>
            <div className='center index'>#</div>
            <div className='start title'>TITLE</div>
            <div className='start'>ALBUM</div>
            <div className='start'>
              <span style={{ wordBreak: 'keep-all' }}>DATE ADDED</span>
            </div>
            <div className='start duration'>DURATION</div>
          </div>
        </HeaderStyled>
        <ContentStyled className='no-scroll-bars'>
          {list.map((track, idx) => (
            <RowStyled
              key={track._id}
              onClick={() => handleTrackClick(track, idx)}
              style={track._id === currentTrack?._id ? { backgroundColor: '#5c5c5c' } : {}} // 5a5a5a
            >
              <div className='center index'>
                {track._id === currentTrack?._id && isPlaying ? (
                  <>
                    <img
                      className='idx-number'
                      width='16px'
                      height='16px'
                      src='/equaliser.gif'
                      alt=''
                    />
                    <PauseIcon />
                  </>
                ) : (
                  <>
                    <span className='idx-number'>{idx + 1}</span>
                    <PlayIcon />
                  </>
                )}
              </div>
              <div className='start title'>
                <TD2>
                  <span>{track.name}</span>
                  {track.artists[0]._id && (
                    <div>
                      {track.artists.map((artist, idx) => (
                        <div key={artist._id}>
                          <Artist onClick={(e) => e.stopPropagation()} to={`/artist/${artist._id}`}>
                            {artist.name}
                          </Artist>
                          {idx < track.artists.length - 1 && ', '}
                        </div>
                      ))}
                    </div>
                  )}
                </TD2>
              </div>
              <div className='start'>-</div>
              <div className='start'>{track.createdAt?.split('T')[0]}</div>
              <div className='end duration'>
                <div style={{ width: '4ch', marginRight: '16px' }}>{track.duration?.timestamp}</div>
                <BttnStyled onClick={(e) => onOpenOpt(e, track._id)}>
                  <DotsIcon />
                </BttnStyled>
              </div>
            </RowStyled>
          ))}
        </ContentStyled>
        <TooltipComponet
          display={displayOpt}
          out={onCloseOpt}
          pos={pos}
          menu={[
            { title: 'Remove from this playlist', action: removeFromPlaylist },
            {
              title: 'Add to playlist',
              submenu: JSON.parse(localStorage.getItem('playlists')),
              action: addToPlaylist,
            },
          ]}
        />
      </>
    );
  }
};

export default TrackListComponent;

const Artist = styled(NavLink)`
  color: #b3b3b3;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: var(--green);
  }
`;

const BttnStyled = styled.button`
  background: transparent;
  border: 0;
  color: hsla(0, 0%, 100%, 0.6);
  padding: 0;
  cursor: pointer;
  position: relative;
`;

const HeaderStyled = styled.div`
  padding: 0 32px;
  height: 36px;
  min-height: 36px;
  background-color: #181818;
  border-bottom: 1px solid #303030;
  color: #b3b3b3;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  & > div {
    grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px, 1fr);
    grid-gap: 16px;
    display: grid;
    padding: 0 16px;
    & > div {
      display: flex;
      align-items: center;
    }
    & > .start {
      justify-self: start;
    }
    & > .center {
      justify-self: center;
    }
    & > .end {
      justify-self: end;
    }
  }
  @media (max-width: 1300px) {
    & > div {
      width: 100%;
      grid-template-columns: [index] 16px [first] 1fr [last] 120px;
    }
    & > div > *:not(.index):not(.title):not(.duration) {
      display: none;
    }
  }
`;

const ContentStyled = styled.div`
  padding: 0 32px;
  color: #b3b3b3;
  font-size: 16px;
  line-height: 24px;
  overflow-y: scroll;
  @media (max-width: 800px) {
    padding: 0;
  }
`;

const RowStyled = styled.div`
  grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px, 1fr);
  border-radius: 4px;
  min-height: 56px;
  grid-gap: 16px;
  display: grid;
  padding: 0 16px;
  border-bottom: 2px solid transparent;
  user-select: none;
  & svg {
    display: none;
  }
  &:hover {
    & svg {
      display: block;
    }
    & .idx-number {
      display: none;
    }
    // background-color: #5a5a5a;
    background-color: hsla(0, 0%, 100%, 0.1);
  }
  & > div {
    display: flex;
    align-items: center;
  }
  & > .start {
    justify-self: start;
  }
  & > .center {
    justify-self: center;
  }
  & > .end {
    justify-self: end;
  }
  & > .title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  @media (max-width: 1300px) {
    grid-template-columns: [index] 16px [first] 1fr [last] 120px;
    & > *:not(.index):not(.title):not(.duration) {
      display: none;
    }
  }
`;

const TD2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
  & > span {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: normal;
    line-height: 24px;
    text-transform: none;
    color: white;
  }
`;

const PlayIcon = () => (
  <svg height='16px' role='img' width='16px' viewBox='0 0 24 24' style={{ color: 'white' }}>
    <polygon points='21.57 12 5.98 3 5.98 21 21.57 12' fill='currentColor'></polygon>
  </svg>
);

const PauseIcon = () => (
  <svg height='16px' role='img' width='16px' viewBox='0 0 24 24' style={{ color: 'white' }}>
    <rect x='5' y='3' width='4' height='18' fill='currentColor'></rect>
    <rect x='15' y='3' width='4' height='18' fill='currentColor'></rect>
  </svg>
);

const DotsIcon = () => (
  <svg
    role='img'
    height='16px'
    width='16px'
    viewBox='0 0 16 16'
    style={{ color: 'white', fill: 'currentcolor', display: 'block' }}
  >
    <path d='M2 6.5a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 002 6.5zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 0014 6.5z'></path>
  </svg>
);

const ExpandIcon = () => (
  <svg role='img' height='16px' width='16px' viewBox='0 0 16 16'>
    <path d='M13 10L8 4.206 3 10z'></path>
  </svg>
);
