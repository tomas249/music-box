import { useEffect, useState } from 'react';
import CoverComponent from '../components/CoverComponent';
import styled from 'styled-components';

import { getPlaylists } from '../../../api/PlaylistApi';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getPlaylists().then((playlist) => setPlaylists(playlist.items));
  }, []);

  return (
    <ContainerStyled>
      <CoverComponent to='/collection/tracks' title='Liked Songs' />
      {playlists.map((playlist) => (
        <CoverComponent key={playlist._id} to={'/playlist/' + playlist._id} title={playlist.name} />
      ))}
    </ContainerStyled>
  );
};

export default PlaylistsPage;

const ContainerStyled = styled.div`
  padding: 16px;
  overflow-y: scroll;
  grid-gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  @media (max-width: 800px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;
