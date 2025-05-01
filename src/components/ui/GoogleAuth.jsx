import { useDispatch } from "react-redux";
import { loginUserWithGoogle } from "../../app/slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleAuth() {
  const dispatch = useDispatch();
  const handleLogin = async (credentialResponse) => {
    const { credential } = credentialResponse;
    dispatch(loginUserWithGoogle(credential));
  };
  const handleLoginWithGoogleError = (error) => {
    console.error("Login Failed:", error);
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleLogin}
        onError={handleLoginWithGoogleError}
        width="300px"
        theme="filled"
        size="large"
        shape="rectangular"
        text="continue_with"
        locale="ar_EG"
        logo_alignment="left"
        style={{
          width: "100%",
          height: "50px",
          borderRadius: "8px",
          backgroundColor: "#4285F4 !important",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      />
    </div>
  );
}
