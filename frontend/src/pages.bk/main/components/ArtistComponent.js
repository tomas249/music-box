import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const ArtistComponent = ({ to, title, subtitle, img, alt }) => {
  return (
    <AlbumContainer to={to}>
      <div className='image'>
        {img ? (
          <img
            style={{
              borderRadius: '2px',
              height: '100%',
              width: '100%',
              padding: '0',
              margin: '0',
            }}
            src={img}
            alt={alt}
          />
        ) : (
          <MusicBlock />
        )}
      </div>
      <div className='text'>
        <span style={{ color: 'white', fontWeight: 'bold', lineHeight: '24px' }}>{title}</span>
        <span style={{ color: '#828282', fontSize: '14px', lineHeight: '16px' }}>{subtitle}</span>
      </div>
    </AlbumContainer>
  );
};

export default ArtistComponent;

const MusicBlock = () => (
  <MusicBlockStyled height='16' role='img' width='16' viewBox='-20 -25 100 100'>
    <path
      d='M16 7.494v28.362A8.986 8.986 0 0 0 9 32.5c-4.962 0-9 4.038-9 9s4.038 9 9 9 9-4.038 9-9V9.113l30-6.378v27.031a8.983 8.983 0 0 0-7-3.356c-4.962 0-9 4.038-9 9 0 4.963 4.038 9 9 9s9-4.037 9-9V.266L16 7.494zM9 48.5c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7c0 3.859-3.141 7-7 7zm32-6.09c-3.86 0-7-3.14-7-7 0-3.859 3.14-7 7-7s7 3.141 7 7c0 3.861-3.141 7-7 7z'
      fill='currentColor'
      fillRule='evenodd'
    ></path>
  </MusicBlockStyled>
);

const MusicBlockStyled = styled.svg`
  stroke: #b3b3b3;
  color: #b3b3b3;
  border-radius: 50%;
  background-color: #333333;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  font-size: 40px;
`;

const AlbumContainer = styled(NavLink)`
  text-decoration: none;
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
