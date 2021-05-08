import { useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import usePlaylist from '../../hooks/PlaylistHook';
import { MediaProvider, MediaContext } from '../../contexts/MediaContext';
import Player from './player/Player';
import Navbar from './navbar/Navbar';
import MainRouter from './MainRouter';

const MainPage = () => {
  const location = useLocation();
  const { media, dispatchMedia } = useContext(MediaContext);
  const [playlists, setPlaylists] = usePlaylist();

  return (
    <ContainerStyled>
      <Navbar location={location} playlists={playlists} />
      <MainRouter />
      <Player />
    </ContainerStyled>
  );
};

export default MediaProvider(MainPage);

const ContainerStyled = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: min-content 5fr;
  grid-template-rows: auto min-content;
  @media (max-width: 800px) {
    height: 100%;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto min-content min-content;
  }
`;
