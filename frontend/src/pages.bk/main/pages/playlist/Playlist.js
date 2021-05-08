import styled from 'styled-components';

const ListContainer = styled.div`
  padding: 0 16px;
  overflow: scroll;
  grid-gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`;

const AlbumContainer = styled.div`
  background-color: #181818;
  padding: 16px;
  border-radius: 4px;
  flex: 1;
  align-self: flex-start;
  cursor: pointer;
  &:hover {
    background-color: #232323;
  }
  > .image {
    margin-bottom: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    line-height: 0;
    border-radius: 50%;
    & img {
      border-radius: 50%;
      height: 50%;
      width: 100%;
      padding: 0;
      margin: 0;
    }
  }
  > .text {
    display: flex;
    flex-direction: column;
    & span:first-child {
      color: white;
      font-weigth: bold;
      line-heigth: 24px;
    }
    & span:last-child {
      color: #828282;
      font-weigth: 14px;
      line-heigth: 16px;
    }
  }
`;

const Playlist = () => {
  return (
    <ListContainer>
      <AlbumContainer>
        <div className='image'>
          <img src='https://i.scdn.co/image/ab67706c0000da847b347fba62cc7b417054c8ed' alt='' />
        </div>
        <div className='text'>
          <span>Aurora</span>
          <span>By Tomas</span>
        </div>
      </AlbumContainer>
      <AlbumContainer>
        <div className='image'>
          <img
            style={{
              borderRadius: '2px',
              height: '100%',
              width: '100%',
              padding: '0',
              margin: '0',
            }}
            src='https://i.scdn.co/image/ab67706c0000da847b347fba62cc7b417054c8ed'
            alt=''
          />
        </div>
        <div className='text'>
          <span style={{ color: 'white', fontWeight: 'bold', lineHeight: '24px' }}>Aurora</span>
          <span style={{ color: '#828282', fontSize: '14px', lineHeight: '16px' }}>By Tomas</span>
        </div>
      </AlbumContainer>
      <AlbumContainer>
        <div className='image'>
          <img
            style={{
              borderRadius: '2px',
              height: '100%',
              width: '100%',
              padding: '0',
              margin: '0',
            }}
            src='https://i.scdn.co/image/ab67706c0000da847b347fba62cc7b417054c8ed'
            alt=''
          />
        </div>
        <div className='text'>
          <span style={{ color: 'white', fontWeight: 'bold', lineHeight: '24px' }}>Aurora</span>
          <span style={{ color: '#828282', fontSize: '14px', lineHeight: '16px' }}>By Tomas</span>
        </div>
      </AlbumContainer>
      <AlbumContainer>
        <div className='image'>
          <img
            style={{
              borderRadius: '2px',
              height: '100%',
              width: '100%',
              padding: '0',
              margin: '0',
            }}
            src='https://i.scdn.co/image/ab67706c0000da847b347fba62cc7b417054c8ed'
            alt=''
          />
        </div>
        <div className='text'>
          <span style={{ color: 'white', fontWeight: 'bold', lineHeight: '24px' }}>Aurora</span>
          <span style={{ color: '#828282', fontSize: '14px', lineHeight: '16px' }}>By Tomas</span>
        </div>
      </AlbumContainer>
      <AlbumContainer>
        <div className='image'>
          <img
            style={{
              borderRadius: '2px',
              height: '100%',
              width: '100%',
              padding: '0',
              margin: '0',
            }}
            src='https://i.scdn.co/image/ab67706c0000da847b347fba62cc7b417054c8ed'
            alt=''
          />
        </div>
        <div className='text'>
          <span style={{ color: 'white', fontWeight: 'bold', lineHeight: '24px' }}>Aurora</span>
          <span style={{ color: '#828282', fontSize: '14px', lineHeight: '16px' }}>By Tomas</span>
        </div>
      </AlbumContainer>
    </ListContainer>
  );
};

export default Playlist;
