import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import React from "react";
import { FaChevronRight } from "react-icons/fa6";

import { auth } from "../Config/firebase.config";
const AuthButton = ({ Icon, label, provider }) => {
  
  const googleAuthProvider = new GoogleAuthProvider();
  const gitHubAuthProvider = new GithubAuthProvider();

  const handleClick = async () => {
    switch (provider) {
      case "GoogleAuthProvider":
        await signInWithRedirect(auth, googleAuthProvider)
          .then((result) => {
            console.log(result);
          })
          .catch((e) => console.log(e.message));
        break;

      case "GithubAuthProvider":
        await signInWithRedirect(auth, gitHubAuthProvider)
          .then((result) => {
            console.log(result);
          })
          .catch((e) => console.log(e.message));
        break;

      default:
        await signInWithRedirect(auth, googleAuthProvider)
          .then((result) => {
            console.log(result);
          })
          .catch((e) => console.log(e.message));
        break;
    }
  };
  return (
    <div
      onClick={handleClick}
      className="wf px-4 py-3 rounded-md border-2 flex border-blue-700 items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md"
    >
      <Icon className="text-txtPrimary text-xl group-hover:text-white "></Icon>
      <p className="text-txtPrimary text-lg group-hover:text-white">{label}</p>
      <FaChevronRight className="text-txtPrimary text-base group-hover:text-white "></FaChevronRight>
    </div>
  );
};

export default AuthButton;
