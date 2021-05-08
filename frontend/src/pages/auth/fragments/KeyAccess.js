import { useEffect, useState } from 'react';

import Form from '../components/Form';
import Input from '../components/Input';

const KeyAccess = ({ setLoading, changeFragment, data, changeData }) => {
  const keyType = data.invitation ? 'Invitation' : 'Access';
  const [key, setKey] = useState(data.key || '');
  const [error, setError] = useState(data.error || '');

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!key) return setError(`Please introduce your ${keyType} Key`);

    changeData({ key });
    if (data.invitation) {
      changeFragment('confirmInvitation');
    } else {
      changeFragment('pwdAccess');
    }
  };

  const handleChange = (e) => {
    setKey(e.target.value.trim().toUpperCase());
  };

  const handleGoingBack = () => {
    setKey('');
    setError('');
    changeData({ invitation: false, key: '' });
  };

  return (
    <Form
      handleSubmit={handleSubmit}
      goBack={data.invitation ? handleGoingBack : null}
      backValue='auth'
      submitValue={data.invitation ? 'Confirm invitation' : 'Login'}
    >
      <div
        style={{
          textAlign: 'center',
          margin: 'auto 0',
        }}
      >
        <Input
          placeholder={`${keyType} Key`}
          handleChange={handleChange}
          value={key}
          error={error}
        />
      </div>
    </Form>
  );
};

export default KeyAccess;
