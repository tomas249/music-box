import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ConfirmInvitation from './ConfirmInvitation';
import * as authApi from '../../api/authApi';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  max-width: 400px;
  border: none;
  border-bottom: 1px solid rgb(102, 102, 102);
  padding: 0.2em 0;
  letter-spacing: 1px;
  font-size: 2em;
  text-align: center;
  background: transparent;
  outline: 0;
  color: white;
  &::placeholder {
    color: rgb(102, 102, 102);
  }
  &:focus::placeholder {
    color: white;
  }
`;

const SubmitButton = styled.button`
  text-transform: uppercase;
  border: none;
  padding: 0.5em 1em;
  font-size: 2em;
  letter-spacing: 1px;
  background: transparent;
  color: rgb(102, 102, 102);
  cursor: pointer;
  outline: 0;
  &:hover {
    background-color: rgb(102, 102, 102);
    color: white;
  }
`;

const AccessFragment = ({ changeFragment, data, changeData }) => {
  const [key, setKey] = useState(data.key || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    changeData({ ...data, key });
    changeFragment('login');
  };

  const handleChange = (e) => {
    setKey(e.target.value.toUpperCase());
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div style={{ margin: 'auto 0', display: 'flex', justifyContent: 'center' }}>
        <Input
          type="text"
          spellcheck="off"
          placeholder="Access Key"
          onChange={handleChange}
          value={key}
        />
        {/* <Input
          type="text"
          spellcheck="false"
          placeholder="Introduce Access Key"
          onChange={handleChange}
          value={key}
        /> */}
      </div>
      <div style={{ display: 'flex' }}>
        {/* <SubmitButton
          style={{ flex: '0', textAlign: 'right', borderRight: '1px solid rgb(102, 102, 102)' }}
          type="submit"
        >
          Back
        </SubmitButton> */}
        <SubmitButton style={{ flex: '3', textAlign: 'center' }} type="submit">
          Login
        </SubmitButton>
      </div>
    </Form>
  );
};

const LoginFragment = ({ data }) => {
  const handleLogin = () => {
    authApi.login(data.key, null).then(console.log).catch(console.error);
  };

  return (
    <div>
      <h3>Introduce your password</h3>
      <Input
        type="text"
        name="password"
        spellcheck="off"
        autocomplete="off"
        placeholder="Password"
      />
      <button onClick={handleLogin}>LOGIN</button>
    </div>
  );
};

const authFragments = Object.freeze({
  access: AccessFragment,
  login: LoginFragment,
  confirmInvitation: ConfirmInvitation,
  // setupAccount: SetupAccountFragment,
});

export default function AuthPage({ location }) {
  const { useFragment, ...extraData } = location.state;

  const [fragment, setFragment] = useState(useFragment || 'access');
  const [data, setData] = useState({ ...extraData });

  const Fragment = authFragments[fragment];
  const [expanded, setExpanded] = useState(window.innerWidth >= 615);

  useEffect(() => {
    authApi
      .identify()
      .then((res) => {
        document.cookie = 'useToken=true';
      })
      .catch(console.error);
  }, []);

  return (
    <Container>
      <Title onClick={() => setExpanded(!expanded)}>
        <Music style={{ fontStyle: expanded ? 'italic' : 'normal' }}>M{expanded && 'usic'}</Music>
        <Box>BOX</Box>
      </Title>
      <Content>
        <Fragment changeFragment={setFragment} data={data} changeData={setData} />
      </Content>
    </Container>
  );
}

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
