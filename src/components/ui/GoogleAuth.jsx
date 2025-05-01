import { useDispatch } from "react-redux";
import { loginUserWithGoogle } from "../../app/slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleAuth() {
  const dispatch = useDispatch();
  const handleLogin = (credentialResponse) => {
    const { credential } = credentialResponse;
    dispatch(loginUserWithGoogle(credential));
  };
  const handleLoginWithGoogleError = (error) => {
    console.error("Login Failed:", error);
  };

  return (
    <div className="flex justify-center items-center">
  
      <GoogleLogin
        onSuccess={handleLogin}
        onError={handleLoginWithGoogleError}
        locale="ar"
        shape="rectangular"
        size="large"
        width="300"
        theme="filled"
        text="تسجيل الدخول باستخدام جوجل"
        logo_alignment="left"
        logo_width="20"
        logo_height="20"
        logo_padding="0"
        logo_margin="0"
        logo_background_color="transparent"
        logo_border_radius="0"
       

      />
    </div>
  );
}
