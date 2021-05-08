import { Route, Switch, Redirect } from 'react-router-dom';
import AuthPage from './AuthPage';

const AuthRouter = ({ user, setSession }) => {
  return (
    <Switch>
      <Route
        exact
        path='/auth'
        render={(props) => <AuthPage {...props} user={user} setSession={setSession} />}
      />
      <Route
        exact
        path='/invite/:key'
        render={({ match }) => (
          <Redirect
            from='/invite/:key'
            to={{
              pathname: '/auth',
              state: {
                fragment: 'confirmInvitation',
                key: match.params.key,
                invitation: true,
              },
            }}
          />
        )}
      />
      <Redirect
        to={{
          pathname: '/auth',
          state: { useFragment: 'access' },
        }}
      />
    </Switch>
  );
};

export default AuthRouter;
