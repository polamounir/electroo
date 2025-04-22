import { getUserData } from "../../app/slices/authSlice";
import { useDispatch } from "react-redux";
import { cartInit } from "../../app/slices/cartSlice";
import { generateNewSessionId } from "../../app/slices/chatbotSlice";
import Cookies from "js-cookie";
export default function AppInit() {
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  // console.log("AppInit");
  if (token) {
    dispatch(getUserData());
  }
  dispatch(cartInit());
  dispatch(generateNewSessionId());

  return null;
}
