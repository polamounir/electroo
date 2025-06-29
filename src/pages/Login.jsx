import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import image from "../assets/images/login.webp";
import { loginUser } from "../app/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleAuth from "../components/ui/GoogleAuth";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user || token) {
      toast.error("تم تسجيل الدخول بالفعل");
      navigate("/redirect-user");
    }
  }, [user, token, navigate]);

  if (user || token) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formValidation = () => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("يرجى ملئ جميع الحقول");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValidation()) {
      return;
    }

    try {
      const res = await dispatch(loginUser(formData)).unwrap();
      console.log(res);

      if (res === "Successful") {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/redirect-user");
      } else if (res.detail === "Wrong email or password") {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
      } else if (res.title === "EmailNotConfirmedException") {
        localStorage.setItem("userId", res.UserId);
        navigate("/confirm-account");
      } else {
        toast.error(" برجاء المحاولة في وقت لاحق");
      }
    } catch (error) {
      toast.error(" برجاء المحاولة في وقت لاحق");
      console.log(error);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="w-full md:w-[85%] mx-auto pt-20">
      <div className="min-h-[70dvh] px-10 flex justify-center items-center">
        <div className="flex items-center gap-10 ">
          <div className="hidden lg:block">
            <img src={image} alt="Register Image" width={550} height={550} />
          </div>
          <div className=" flex justify-center">
            <div className="min-w-xs md:min-w-sm">
              <div className="flex flex-col gap-2 mb-10">
                <h2 className="text-3xl font-bold">تسجيل دخول مستخدم</h2>
                <p className="text-md text-gray-700">مرحب برجوعك لينا 👋</p>
                <div className="-mt-2">
                  {/* <Link
                    to="/login-supplier"
                    className="text-sm text-teal-600 hover:text-teal-500 hover:underline italic "
                  >
                    {" "}
                    تسجيل دخول كتاجر من هنا
                  </Link> */}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                  <div className="flex gap-5">
                    <div className="w-full flex flex-col gap-1 ">
                      <label htmlFor="email" className="text-lg font-semibold">
                        البريد الالكتروني
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        onChange={handleChange}
                        placeholder="email@email.com"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="w-full flex flex-col gap-1">
                      <label
                        htmlFor="password"
                        className="text-lg font-semibold"
                      >
                        كلمةالمرور
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                          onChange={handleChange}
                          placeholder="********"
                          autoComplete="off"
                        />
                        {/* ---------------Show Password ----------------- */}
                        {formData.password && (
                          <div className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-700">
                            <button
                              type="button"
                              onClick={handleTogglePassword}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        <Link to="/reset-password">نسيت كلمة المرور؟</Link>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      className={`mt-2 w-full  justify-center px-3 py-2 rounded-md text-white font-semibold ${
                        loading ? "bg-gray-400" : "bg-[var(--color-primary)]"
                      }`}
                      disabled={loading}
                    >
                      {loading ? "جاري الدخول" : "تسجيل دخول"}
                    </button>
                  </div>
                </div>
              </form>
              <div>
                <p className="text-sm text-gray-600 mt-2">
                  ليس لديك حساب؟{" "}
                  <span className="text-[var(--color-primary)]">
                    <Link to="/pre-register">انشاء حساب جديد</Link>
                  </span>
                </p>
              </div>

              <div className="text-center text-gray-500 py-1 relative">او</div>
              <GoogleAuth />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
