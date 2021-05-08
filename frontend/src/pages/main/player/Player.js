import styled from 'styled-components';

const Player = () => {
  return <PlayerStyled>PLAYER</PlayerStyled>;
};

export default Player;

const PlayerStyled = styled.div`
  position: relative;
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  background-color: rgb(24, 24, 24);
  border-top: 1px solid #282828;
  min-height: 90px;
  @media (max-width: 800px) {
    min-height: 0;
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 3;
  }
`;
