import { useState } from 'react';
import styled from 'styled-components';

import LoadingComponent from '../../components/LoadingComponent';
import Title from './components/Title';

import KeyAccess from './fragments/KeyAccess';
import PwdAccess from './fragments/PwdAccess';
import ConfirmInvitation from './fragments/ConfirmInvitation';
import ChangePwd from './fragments/ChangePwd';

const authFragments = Object.freeze({
  keyAccess: KeyAccess,
  pwdAccess: PwdAccess,
  confirmInvitation: ConfirmInvitation,
  changePwd: ChangePwd,
});

const AuthPage = ({ location }) => {
  const { initFragment = 'keyAccess', ...extraData } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [fragment, setFragment] = useState(initFragment);
  const [data, setData] = useState(extraData);

  const Fragment = authFragments[fragment];

  const setLoadingState = (isLoading) => setLoading(isLoading);
  const changeFragment = (newFragment) => setFragment(newFragment);
  const changeData = (newData) => setData({ ...data, ...newData });

  return (
    <ContainerStyled>
      <Title />
      <ContentStyled>
        {loading && <LoadingComponent loading={true} />}
        <Fragment
          setLoading={setLoadingState}
          changeFragment={changeFragment}
          data={data}
          changeData={changeData}
        />
      </ContentStyled>
    </ContainerStyled>
  );
};

export default AuthPage;

const ContainerStyled = styled.div`
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  @media (min-height: 650px) {
  }
`;

const ContentStyled = styled.div`
  flex: 1;
  // overflow: scroll;
`;
