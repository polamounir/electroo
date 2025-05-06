import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../app/slices/authSlice";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logOut());
    navigate("/");
  }, [dispatch, navigate]);

  return (
    <div className="min-h-[75svh] flex justify-center items-center text-center text-2xl font-bold text-teal-600 pb-50">
      <h2>مع السلامة ... نراك قريبا</h2>
    </div>
  );
}
