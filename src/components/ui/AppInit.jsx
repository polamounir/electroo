import { getUserData } from "../../app/slices/authSlice";
import { useDispatch } from "react-redux";
import { cartInit } from "../../app/slices/cartSlice";
import { generateNewSessionId } from "../../app/slices/chatbotSlice";

export default function AppInit() {
  const dispatch = useDispatch();
  console.log("AppInit");
  dispatch(getUserData());
  dispatch(cartInit());
  dispatch(generateNewSessionId());

  return null;
}
