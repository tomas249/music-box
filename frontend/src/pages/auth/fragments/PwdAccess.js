import { useState, useContext } from 'react';
import Form from '../components/Form';
import Input from '../components/Input';
import { login } from '../../../api/AuthApi';
import { UserContext } from '../../../contexts/UserContext';

const PwdAccess = ({ changeFragment, data, changeData }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setAccessToken } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    login(data.key, password)
      .then(({ user, accessToken }) => {
        setUser(user);
        setAccessToken(accessToken);
      })
      .catch((error) => {
        changeData({ error: error.message });
        handleGoingBack();
      });
  };

  const handleChange = (e) => {
    setPassword(e.target.value.trim());
  };

  const handleGoingBack = () => {
    changeFragment('keyAccess');
  };

  return (
    <Form handleSubmit={handleSubmit} goBack={handleGoingBack} submitValue='login'>
      <div
        style={{
          margin: 'auto 0',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '2em' }}>
          <h2 className='primary'>Access Key: {data.key}</h2>
        </div>
        <Input
          type='password'
          placeholder='Password'
          handleChange={handleChange}
          disabled={loading}
          value={password}
        />
        {/* <p className="primary">If you are using an invitation key, feel free to skip this step</p> */}
        <p className='primary'>If you do not have a password yet, feel free to skip this step</p>
      </div>
    </Form>
  );
};

export default PwdAccess;
