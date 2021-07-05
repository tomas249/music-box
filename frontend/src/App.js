import { Suspense, lazy, useContext } from "react";
import { Redirect } from "react-router-dom";

import { UserContext } from "./contexts/UserContext";

const App = () => {
  const AuthRouter = lazy(() => import("./pages/auth/AuthRouter"));
  const MainPage = lazy(() => import("./pages/main/MainPage"));
  const { user } = useContext(UserContext);

  if (user?.access.allow) {
    return (
      <Suspense fallback={null}>
        <MainPage />
      </Suspense>
    );
  } else {
    return (
      <Suspense fallback={null}>
        {/* Redirect to change password if required */}
        {user.access.reason === "setup_account" && (
          <Redirect
            to={{ pathname: "/auth", state: { initFragment: "changePwd" } }}
          />
        )}
        <AuthRouter />
      </Suspense>
    );
  }
};

export default App;
