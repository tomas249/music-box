import { useEffect, useState } from 'react';
import * as authApi from '../../api/authApi';
import styled from 'styled-components';

const ConfirmInvitation = ({ changeFragment, data, changeData }) => {
  const [invitation, setInvitation] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    authApi
      .getInvitation(data.key)
      .then((res) => {
        console.log(res);
        setInvitation(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullname = e.target.fullname.value.trim();
    if (!fullname) return setError({ message: 'Please introduce your full name' });
    authApi
      .confirmInvitation(invitation._id, fullname)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        setError(err);
      });
  };

  if (!invitation) {
    return <div>Loading</div>;
  } else {
    return (
      <Container>
        <span>
          You were invited by <b>{invitation.invitedBy}</b>
        </span>

        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
          <Invitation>
            <h3>Invitation Details</h3>
            <span>
              Key: <b>{invitation.key}</b>
            </span>
            <span>
              Remaining activations: <b>{invitation.remainingActivations}</b>
            </span>
            <span>
              Valid until: <b>{invitation.validUntil}</b>
            </span>
          </Invitation>
          <Form onSubmit={handleSubmit}>
            <h3>Confirmation</h3>
            <p>
              Please introduce your full name in order to identify you. Follow this format:
              <br />
              <br />
              NAME + SURNAME_INITIALS
              <br />
              or
              <br />
              FIRST_NAME + SECOND_NAME + SURNAME_INITIALS
            </p>
            <Input type="text" name="fullname" spellcheck="off" placeholder="Example: John SM" />
            {error && <Error>Error: {error.message}</Error>}
            <SubmitButton style={{ textAlign: 'center' }} type="submit">
              Confirm
            </SubmitButton>
          </Form>
        </div>
      </Container>
    );
  }
};

export default ConfirmInvitation;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: grey;
  > span {
    font-size: 1em;
    margin: 1em 0;
  }
`;

const Invitation = styled.div`
  min-width: 400px;
  margin-bottom: 1em;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1em;
  border-right: 2px solid rgb(102, 102, 102);
  > h3 {
    font-size: 2em;
    margin: 0 auto 1em;
  }
  > span {
    font-size: 2em;
    margin-bottom: 1em;
  }
`;

const Form = styled.form`
  min-width: 400px;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1em;
  > h3 {
    font-size: 2em;
    margin: 0 auto 1em;
  }
  > p {
    font-size: 1.5em;
    margin: 0 auto 1em;
    text-align: center;
  }
`;

const Input = styled.input`
  margin-top: auto;
  width: 100%;
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

const Error = styled.div`
  text-align: center;
  color: darkred;
  padding: 1em;
`;
