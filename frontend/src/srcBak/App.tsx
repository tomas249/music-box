import React from "react";
import { useUser } from "./contexts/UserContext";

function App() {
  const user = useUser();
  console.log(user);
  return <div>Name: {user?.fullName}</div>;
}

export default App;
