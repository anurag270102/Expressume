import React, { useEffect } from "react";
import { Logo } from "../assets";
import { Footer } from "../Containers";
import { AuthButton, MainSpinner } from "../Components";
import UseUser from "../Hooks/UseUser";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
const Authentation = () => {
  const { data, isLoading, isError } = UseUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && data) {
      navigate("/", {
        replace: true
      });
    }
  }, [isLoading, data]);
  
  if(isLoading){
    return <MainSpinner></MainSpinner>
  }
  return (
    <div className="auth-section">
      <img src={Logo} className=" w-12  h-auto object-contain" alt=""></img>
      <div className=" w-full flex flex-1 flex-col items-center justify-center gap-6 ">
        <h1 className="text-3xl lg:text-4xl text-blue-700 ">
          Welcome To Expressume
        </h1>
        <p className=" text-base  text-gray-600 ">
          express way to create resume
        </p>
        <h2 className="text-2xl text-gray-600">Authtation</h2>
        <div className=" w-full lg:w-96 rounded-md   p-2 flex flex-col justify-start gap-6 ">
          <AuthButton
            Icon={FaGoogle}
            label={"Signin with Google"}
            provider={"GoogleAuthProvider"}
          ></AuthButton>
          <AuthButton
            Icon={FaGithub}
            label={"Signin with GitHub"}
            provider={"GithubAuthProvider"}
          ></AuthButton>
        </div>
      </div>
      {/* //footer */}
      <Footer></Footer>
    </div>
  );
};

export default Authentation;
