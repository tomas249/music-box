import { useState, useEffect, createContext } from 'react';
import { identify } from '../api/AuthApi';
import { setBearerToken } from '../api/Api';
import LoadingComponent from '../components/LoadingComponent';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    identify().then(({ user, accessToken }) => {
      if (user) {
        setUser(user);
        setBearerToken(accessToken);
      } else {
        setUser({ access: { allow: false } });
      }
    });
  }, []);

  const setAcessToken = (accessToken) => {
    setBearerToken(accessToken);
  };

  return (
    <LoadingComponent loading={!user}>
      <UserContext.Provider value={{ user, setUser, setAcessToken }}>
        {children}
      </UserContext.Provider>
    </LoadingComponent>
  );
};

export { UserContext, UserProvider };
