import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

// import { getUserData } from "../../app/slices/authSlice";
import { cartInit } from "../../app/slices/cartSlice";
import { generateNewSessionId } from "../../app/slices/chatbotSlice";
import { api } from "../../api/axiosInstance";
import { setUserInitData } from "../../app/slices/authSlice";
import { toast } from "sonner";

export default function AppInit() {
  const dispatch = useDispatch();
  const getUserData = async () => {
    try {
      const { data } = await api.get("/auth/me");
      // console.log(data.data);
      const user = data.data;
      dispatch(setUserInitData(user));
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ غير معروف");
    }
  };

  useEffect(() => {
    const token = Cookies.get("accessToken") || localStorage.getItem("accessToken");

    if (token) {
      // dispatch(getUserData());
      alert("تم تسجيل الدخول بنجاح");
      getUserData();
    }

    dispatch(cartInit());
    dispatch(generateNewSessionId());
  }, [dispatch]);

  return null;
}
