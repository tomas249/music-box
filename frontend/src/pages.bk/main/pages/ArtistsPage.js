import { useEffect, useState } from 'react';
import ArtistComponent from '../components/ArtistComponent';
import styled from 'styled-components';
import { getUserArtists } from '../../../api/ArtistApi';

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    getUserArtists().then((artists) => setArtists(artists.items));
  }, []);

  return (
    <ContainerStyled>
      {artists.map((artist) => (
        <ArtistComponent
          key={artist._id}
          to={'/artist/' + artist._id}
          title={artist.name}
          subtitle='Artist'
        />
      ))}
    </ContainerStyled>
  );
};

export default ArtistsPage;

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
