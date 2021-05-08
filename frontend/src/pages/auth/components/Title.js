import { useState } from 'react';
import styled from 'styled-components';

const Title = () => {
  const [expanded, setExpanded] = useState(window.innerWidth >= 615);

  return (
    <TitleStyled onClick={() => setExpanded(!expanded)}>
      <MusicStyled style={{ fontStyle: expanded ? 'italic' : 'normal' }}>
        M{expanded && 'usic'}
      </MusicStyled>
      <BoxStyled>BOX</BoxStyled>
    </TitleStyled>
  );
};

export default Title;

const TitleStyled = styled.div`
  display: flex;
  justify-content: center;
  user-select: none;
  font-family: 'Raleway', sans-serif;
  font-weight: 800;
  padding: 0 12px;
  font-size: 120px;
  cursor: pointer;
  @media (max-width: 410px) {
    font-size: 100px;
  }
  @media (min-height: 650px) {
    margin-top: 15vmax;
  }
`;

const MusicStyled = styled.span`
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: hidden;
  background-image: url(${process.env.PUBLIC_URL + '/giphy.webp'});
  background-size: cover;
  color: transparent;
  -moz-background-clip: text;
  -webkit-background-clip: text;
`;

const BoxStyled = styled.span`
  letter-spacing: -8px;
  background: linear-gradient(to right, rgb(60, 60, 60) 15%, #e23b4a 65%, grey 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-right: 10px;
`;
