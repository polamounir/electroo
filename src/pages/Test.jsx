import React from "react";
import { api } from "../api/axiosInstance";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { loginUserWithGoogle } from "../app/slices/authSlice";

export default function Test() {
  //   const handleLoginWithGoogle = async (credentialResponse) => {
  //     const { credential } = credentialResponse;

  //     try {
  //       const res = await api.post("/auth/google-login", {
  //         credentials: credential,
  //       });
  //       console.log("res", res.data);
  //     } catch (error) {
  //       console.error("Login:", error);
  //     }
  //   };

  const dispatch = useDispatch();
  const handleLogin = (credentialResponse) => {
    const { credential } = credentialResponse;
    dispatch(loginUserWithGoogle(credential));
  };
  const handleLoginWithGoogleError = (error) => {
    console.error("Login Failed:", error);
  };

  return (
    <div className="min-h-[50svh] flex justify-center items-center">
      <GoogleLogin
        onSuccess={handleLogin}
        onError={handleLoginWithGoogleError}
      />
    </div>
  );
}
