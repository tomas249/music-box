import { useEffect, useState, useContext } from 'react';
import Form from '../components/Form';
import Input from '../components/Input';
import styled from 'styled-components';
import { getInvitation, confirmInvitation } from '../../../api/AuthApi';
import { UserContext } from '../../../contexts/UserContext';

const ConfirmInvitation = ({ setLoading: setGlobalLoading, changeFragment, data, changeData }) => {
  const [invitation, setInvitation] = useState();
  const [fullname, setFullname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setAccessToken } = useContext(UserContext);

  useEffect(() => {
    getInvitation(data.key)
      .then((invitation) => {
        setGlobalLoading(false);
        setInvitation(invitation);
      })
      .catch((error) => {
        changeData({ error: error.message });
        changeFragment('keyAccess');
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullnameTrimed = fullname.trim();
    setFullname(fullnameTrimed);
    if (!fullnameTrimed) return setError('Please introduce your full name');

    setLoading(true);
    confirmInvitation(invitation._id, fullnameTrimed)
      .then(({ user, accessToken }) => {
        setUser(user);
        setAccessToken(accessToken);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setFullname(e.target.value);
  };

  const handleGoingBack = () => {
    changeData({ invitation: false, key: '' });
    changeFragment('keyAccess');
  };

  if (!invitation) {
    return null;
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
          <Form
            handleSubmit={handleSubmit}
            goBack={handleGoingBack}
            backValue='auth'
            submitValue='Confirm invitation'
          >
            <ConfirmContainer>
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
              <Input
                placeholder='Example: John SM'
                handleChange={handleChange}
                disabled={loading}
                value={fullname}
                error={error}
              />
            </ConfirmContainer>
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
    font-size: 3em;
    padding: 1em 0;
  }
`;

const Invitation = styled.div`
  min-width: 300px;
  padding-bottom: 1em;
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
    font-size: 1.5em;
    margin-bottom: 1em;
  }
`;

const ConfirmContainer = styled.div`
  min-width: 400px;
  display: flex;
  flex-direction: column;
  padding: 1em;
  align-items: center;
  justify-content: center;
  > h3 {
    font-size: 2em;
    margin: 0 auto 1em;
  }
  > p {
    font-size: 1.5em;
    margin: 0 auto 2em;
    text-align: center;
  }
`;
