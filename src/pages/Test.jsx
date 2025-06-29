import React from "react";
import { api } from "../api/axiosInstance";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { loginUserWithGoogle } from "../app/slices/authSlice";
import CartDropdownMenu from "../components/ui/CartDropdownMenu";
import TestSearch from "../components/test/EnhancedFilterComponent";

export default function Test() {
  // const dispatch = useDispatch();
  // const handleLogin = (credentialResponse) => {
  //   console.log(credentialResponse);
  //   const { credential } = credentialResponse;
  //   dispatch(loginUserWithGoogle(credential));
  // };
  // const handleLoginWithGoogleError = (error) => {
  //   console.error("Login Failed:", error);
  // };

  return (
    <div className="min-h-[50svh] flex justify-center items-center w-full">
      {/* <GoogleLogin
        onSuccess={handleLogin}
        onError={handleLoginWithGoogleError}
      /> */}

      {/* <div className="relative">
        <CartDropdownMenu />
      </div> */}
      <div className="w-full">
        <TestSearch />
      </div>
    </div>
  );
}
