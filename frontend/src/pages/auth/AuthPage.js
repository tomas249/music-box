import { useState } from 'react';
import styled from 'styled-components';

import Access from './Access';
import Login from './Login';
import ConfirmInvitation from './ConfirmInvitation';
import SetupAccount from './SetupAccount';

const authFragments = Object.freeze({
  access: Access,
  login: Login,
  confirmInvitation: ConfirmInvitation,
  setupAccount: SetupAccount,
});

const AuthPage = ({ location, setSession, token }) => {
  const { useFragment = 'access', ...extraData } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(window.innerWidth >= 615);
  const [fragment, setFragment] = useState(useFragment);
  const [data, setData] = useState({ ...extraData });

  const Fragment = authFragments[fragment];

  const setLoadingState = (isLoading) => setLoading(isLoading);
  const changeFragment = (newFragment) => setFragment(newFragment);
  const changeData = (newData) => setData({ ...data, ...newData });

  return (
    <Container>
      <Title onClick={() => setExpanded(!expanded)}>
        <Music style={{ fontStyle: expanded ? 'italic' : 'normal' }}>M{expanded && 'usic'}</Music>
        <Box>BOX</Box>
      </Title>
      <Content>
        {loading && <div>Loading</div>}
        <Fragment
          setLoading={setLoadingState}
          changeFragment={changeFragment}
          data={data}
          changeData={changeData}
          setSession={setSession}
          token={token}
        />
      </Content>
    </Container>
  );
};

export default AuthPage;

const Container = styled.div`
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  @media (min-height: 650px) {
  }
`;

const Title = styled.div`
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

const Music = styled.span`
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

const Box = styled.span`
  letter-spacing: -8px;
  background: linear-gradient(to right, rgb(60, 60, 60) 15%, #e23b4a 65%, grey 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-right: 10px;
`;

const Content = styled.div`
  flex: 1;
  // overflow: scroll;
`;
