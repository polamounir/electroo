import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "../api/user";
import { useEffect } from "react";
import { toast } from "sonner";
import { logOut } from "../app/slices/authSlice";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (!user) {
      toast.error("يجب عليك تسجيل الدخول");
      navigate("/login");
    }
  }, [navigate, user]);

  const name = user?.fullName?.split(" ");
  const firstName = name?.[0] || "م";
  const lastName = name?.[1] || "ج";

  const handleLogout = () => {
    dispatch(logOut());
  };

  // console.log("user", user);
  return (
    <div className="page">
      <div className="">
        <div className="flex flex-col gap-10 px-2 md:px-10 lg:px-20 pt-10 pb-20">
          <div className="ps-5">
            <h2 className="title text-3xl">حسابي</h2>
          </div>
          <div className="border border-gray-400 py-5 px-10 md:py-14 md:px-16 rounded-lg flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row md:gap-10 lg:items-center lg:justify-between">
              <div className="flex items-center gap-10">
                <span className="text-4xl font-bold bg-gray-200 w-32 h-32 rounded-full flex items-center justify-center gap-2">
                  {firstName[0]} {lastName[0]}
                </span>
                <div className="flex flex-col gap-2"></div>
              </div>
              <div className="self-end">
                <Link to="/edit-profile">
                  <button className="btn px-5 py-1 rounded-lg bg-teal-600 text-white font-semibold">
                    Edit
                  </button>
                </Link>
              </div>
            </div>

            <div>
              <h2 className="title">البيانات الشخصية</h2>
              <p className="title-info"></p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">الاسم</h2>
                <h2 className="text-2xl font-semibold">{user?.fullName}</h2>
              </div>

              <div className="flex flex-col">
                <h2 className="text-xl font-bold">البريد الالكتروني</h2>
                <h3 className="text-lg font-medium ps-2">{user?.email}</h3>
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">رقم الهاتف</h2>
                <h3 className="text-lg font-medium ps-2">
                  {user?.phoneNumber}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <button
              className="btn bg-black text-white border border-sky-950 font-semibold w-52 px-10 py-3 text-center rounded-3xl justify-center"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
