
import { getUserData } from "../../app/slices/authSlice";
import { useDispatch } from "react-redux";
import { cartInit } from "../../app/slices/cartSlice";

export default function AppInit() {
  const dispatch = useDispatch();
  console.log("AppInit");
  dispatch(getUserData());
  dispatch(cartInit())
  return;
}
