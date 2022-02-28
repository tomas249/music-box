import { createContext, FC, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { identify } from "../api/AuthApi";

type User = {
  key: string;
  fullName: string;
};

export const useUserQuery = () => useQuery<User>(["user"], identify);

const UserContext = createContext<User | undefined>(undefined);

export const UserProvider: FC = ({ children }) => {
  const userQuery = useUserQuery();

  useEffect(() => {}, []);

  if (userQuery.error) {
    return <div>Who tf are you??</div>;
  }

  if (userQuery.isLoading) {
    return <></>;
  }

  if (userQuery.data) {
    return (
      <UserContext.Provider value={userQuery.data}>
        {children}
      </UserContext.Provider>
    );
  }

  return <>Something went wrong!</>;
};

export const useUser = () => useContext(UserContext);
