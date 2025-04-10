
import { getUserData } from "../../app/slices/authSlice";
import { useDispatch } from "react-redux";

export default function AppInit() {
  const dispatch = useDispatch();
  dispatch(getUserData());
  return;
}
