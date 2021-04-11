import { useEffect, useState, Suspense, lazy } from 'react';
import { Redirect } from 'react-router-dom';
import * as authApi from './api/authApi';

const App = (props) => {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState();
  const [user, setUser] = useState();

  const AuthRouter = lazy(() => import('./pages/auth/AuthRouter'));
  const MainRouter = lazy(() => import('./pages/main/MainRouter'));

  const setSession = (session) => {
    setAccessToken(session.accessToken);
    setUser(session.user);
  };

  useEffect(() => {
    authApi
      .identify()
      .then((res) => {
        setAccessToken(res.accessToken);
        setUser(res.user);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return null;
  } else {
    if (!user || !user.access.allow) {
      return (
        <Suspense fallback={null}>
          {user?.access.reason === 'setup_account' && (
            <Redirect
              to={{
                pathname: '/auth',
                state: { useFragment: 'setupAccount', user },
              }}
            />
          )}
          <AuthRouter setSession={setSession} token={accessToken} />
        </Suspense>
      );
    } else {
      return (
        <Suspense fallback={null}>
          <MainRouter user={user} />
        </Suspense>
      );
    }
  }
};

export default App;
