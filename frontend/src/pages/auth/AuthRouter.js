import { Route, Switch, Redirect } from 'react-router-dom';
import AuthPage from './AuthPage';

const AuthRouter = () => {
  return (
    <Switch>
      <Route exact path='/auth' component={AuthPage} />
      <Route
        exact
        path='/invite/:key'
        render={({ match }) => (
          <Redirect
            to={{
              pathname: '/auth',
              state: {
                initFragment: 'confirmInvitation',
                key: match.params.key,
                invitation: true,
              },
            }}
          />
        )}
      />
      <Redirect to={{ pathname: '/auth', state: { initFragment: 'keyAccess' } }} />
    </Switch>
  );
};

export default AuthRouter;
