import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Redirecting() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      const { role } = user;
      switch (role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Supplier":
          navigate("/supplier");
          break;

        default:
          navigate("/");
          break;
      }
    }
  }, [navigate, user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-700">
          Redirecting you to the appropriate dashboard...
        </p>
      </div>
    </div>
  );
}
