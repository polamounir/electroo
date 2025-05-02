import { useEffect } from "react";
import { getUserData } from "../../app/slices/authSlice";
import { useDispatch } from "react-redux";
import { cartInit } from "../../app/slices/cartSlice";
import { generateNewSessionId } from "../../app/slices/chatbotSlice";
import Cookies from "js-cookie";

export default function AppInit() {
  const token = Cookies.get("accessToken");
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(getUserData());
    }
    dispatch(cartInit());
    dispatch(generateNewSessionId());
  }, [dispatch, token]);

  return null;
}
