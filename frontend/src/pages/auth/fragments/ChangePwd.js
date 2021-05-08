import { useEffect, useState, useContext } from 'react';
import Form from '../components/Form';
import Input from '../components/Input';
import { changePassword } from '../../../api/AuthApi';
import { UserContext } from '../../../contexts/UserContext';

const ChangePwd = ({ setLoading: setGlobalLoading, data }) => {
  const [password, setPassword] = useState('');
  const [repPassword, setRepPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, setUser, setAccessToken } = useContext(UserContext);

  useEffect(() => {
    setGlobalLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 4) return setError('Password must be at least 4 characters');
    if (password !== repPassword) return setError('Passwords must match');

    setLoading(true);
    changePassword(password)
      .then(({ user, accessToken }) => {
        setUser(user);
        setAccessToken(accessToken);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handlePwdChange = (e) => {
    setPassword(e.target.value.trim());
  };

  const handleRepPwdChange = (e) => {
    setRepPassword(e.target.value.trim());
  };

  return (
    <Form handleSubmit={handleSubmit} submitValue='save new password'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: 'auto 0',
        }}
      >
        <h1 className='primary' style={{ marginBottom: '3em' }}>
          {user.name}, your account is almost ready!
        </h1>
        <Input
          type='password'
          placeholder='New Password'
          handleChange={handlePwdChange}
          disabled={loading}
          value={password}
        />
        <Input
          type='password'
          placeholder='Repeat Password'
          autofocus={false}
          handleChange={handleRepPwdChange}
          disabled={loading}
          value={repPassword}
          error={error}
        />
      </div>
    </Form>
  );
};

export default ChangePwd;
