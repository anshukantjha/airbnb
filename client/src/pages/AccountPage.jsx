import React, { useContext, useState } from "react";
import { UserContext } from "../user.context";
import { Navigate} from "react-router-dom";
import { Button } from "../components";
import axios from "axios";
import AccountNav from "./AccountNav";

const AccountPage = () => {
  const [redirect, setRedirect] = useState(false);
  const { user, ready, setUser } = useContext(UserContext);
  async function logout() {
    await axios.post("/logout");
    setRedirect(true);
    setUser(null);
  }
  // Pages to return
  if (!user) {
    return <div className="text-4xl text-red-600">Login Please</div>;
  } else if (!ready && user) {
    return <div className="text-4xl text-green-300">Loading...</div>;
  }
  if (ready && !user && !redirect) {
    // console.log("I am inside ready and not redirect");
    return <Navigate to="/login" />;
  }
  if (redirect) {
    // console.log("I am inside if redirect");
    return <Navigate to={"/"} />;
  }
  return (
    <div className="">
      <AccountNav/>
        <div className="flex flex-col gap-4 items-center ">
          <div className="mt-4">
            Logged in as <span className="font-bold">{user?.name}</span> (
            {user?.email})
          </div>
          <Button onClick={logout}>Logout</Button>
        </div>
    </div>
  );
};

export default AccountPage;
