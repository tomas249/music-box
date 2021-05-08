import { useState } from 'react';
import Form from './components/Form';
import Input from './components/Input';
import { login } from '../../api/AuthApi';

const Login = ({ changeFragment, data, changeData, setSession }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    login(data.key, password)
      .then(setSession)
      .catch((error) => {
        changeData({ error: error.message });
        handleGoingBack();
      });
  };

  const handleChange = (e) => {
    setPassword(e.target.value.trim());
  };

  const handleGoingBack = () => {
    changeFragment('access');
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
          error={error}
        />
        {/* <p className="primary">If you are using an invitation key, feel free to skip this step</p> */}
        <p className='primary'>If you do not have a password yet, feel free to skip this step</p>
      </div>
    </Form>
  );
};

export default Login;
