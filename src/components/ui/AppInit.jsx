import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

import { getUserData } from "../../app/slices/authSlice";
import { cartInit } from "../../app/slices/cartSlice";
import { generateNewSessionId } from "../../app/slices/chatbotSlice";

export default function AppInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      dispatch(getUserData());
    }

    dispatch(cartInit());
    dispatch(generateNewSessionId());
  }, [dispatch]);

  return null;
}
