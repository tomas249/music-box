import { useEffect, useState, useRef } from 'react';
import SectionHeaderComponent from '../components/SectionHeaderComponent';
import LoadingComponent from '../../../components/LoadingComponent';
import TrackListComponent from '../components/TrackListComponent';
import CoverComponent from '../components/CoverComponent';
import { getArtist, followArtist } from '../../../api/ArtistApi';
import styled from 'styled-components';
import ScrollContainer from 'react-indiana-drag-scroll';

import { Redirect } from 'react-router-dom';

const ArtistPage = ({ location, history, match, track, isPlaying, controls, openModal }) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [title, setTitle] = useState('');
  const [displayAlbums, setDisplayAlbums] = useState(true);
  const [id, setId] = useState('');
  const scrollRef = useHorizontalScroll();

  const newControls = {
    ...controls,
    play: (idx) => controls.play(idx, list),
  };

  useEffect(() => {
    console.log('loading artist');
    getArtist(match.params.id)
      .then((r) => {
        setTitle(r.name);
        setList(r.tracks);
        setId(r._id);
        console.log(location.pathname.split('/')[3]);
        if (history.action === 'POP' && location.pathname.split('/')[3] === 'edit') {
          openModal([{ label: 'Name', value: title }]);
        }
      })
      .finally(() => setLoading(false));
  }, [history]);

  const handlePlay = () => newControls.play(Math.floor(Math.random() * list.length));

  const handleFollow = () => followArtist(id);

  const handleOpt = () => {
    openModal([{ label: 'Name', value: title }]);
    history.push(match.url + '/edit');
  };

  return (
    <>
      <SectionHeaderComponent
        type='artist'
        title={title}
        handlePlay={handlePlay}
        handleFollow={handleFollow}
        handleOpt={handleOpt}
      />
      <HeaderStyled onClick={() => setDisplayAlbums(!displayAlbums)}>
        {displayAlbums ? 'Click to hide albums' : 'Click to display albums'}
      </HeaderStyled>
      <div style={{ display: displayAlbums ? 'block' : 'none' }}>
        <AlbumsList innerRef={scrollRef}>
          <CoverComponent to='/' title='Dama mia' />
          <CoverComponent to='/' title='Dama mia' />
          <CoverComponent to='/' title='Dama mia' />
          <CoverComponent to='/' title='Dama mia' />
          <CoverComponent to='/' title='Dama mia' />
          <CoverComponent to='/' title='Dama mia' />
          <CoverComponent to='/' title='Dama mia' />
        </AlbumsList>
      </div>
      <LoadingComponent loading={loading}>
        <TrackListComponent
          list={list}
          currentTrack={track}
          isPlaying={isPlaying}
          controls={newControls}
        />
      </LoadingComponent>
    </>
  );
};

export default ArtistPage;

const useHorizontalScroll = () => {
  const elRef = useRef();
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY == 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);
  return elRef;
};

const AlbumsList = styled(ScrollContainer)`
  padding: 12px 16px;
  overflow-x: scroll;
  display: flex;
  & > a {
    min-width: 120px;
    width: 120px;
    &:not(:last-child) {
      margin-right: 18px;
    }
  }
`;

const HeaderStyled = styled.div`
  padding: 0 32px;
  height: 36px;
  min-height: 36px;
  background-color: #181818;
  border-top: 1px solid #303030;
  border-bottom: 1px solid #303030;
  color: #b3b3b3;
  font-size: 14px;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
