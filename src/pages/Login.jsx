import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import image from "../assets/images/loginImg.webp";
import { loginUser } from "../app/slices/authSlice";
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formValidation = () => {
    const { username, password } = formData;
    if (!username || !password) {
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
        toast.success("تم تسجيل حسابك بنجاح");
        navigate("/");
      } else if (res.detail === "Wrong username or password") {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
      } else {
        toast.error(" برجاء المحاولة في وقت لاحق");
      }
    } catch (error) {
      toast.error(" برجاء المحاولة في وقت لاحق");
      console.log(error);
    }
  };
  return (
    <div>
      <div className="min-h-[70dvh] px-10 flex justify-center items-center">
        <div className="flex items-center gap-10 ">
          <div className="hidden lg:block">
            <img src={image} alt="Register Image" width={500} height={650} />
          </div>
          <div className=" flex justify-center">
            <div className="min-w-xs md:min-w-sm">
              <div className="flex flex-col gap-2 mb-10">
                <h2 className="text-3xl font-bold">تسجيل دخول</h2>
                <p className="text-md text-gray-700">مرحب برجوعك لينا 👋</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                  <div className="flex gap-5">
                    <div className="w-full flex flex-col gap-1 ">
                      <label
                        htmlFor="username"
                        className="text-lg font-semibold"
                      >
                        البريد الالكتروني
                      </label>
                      <input
                        type="email"
                        name="username"
                        id="username"
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
                      <input
                        type="password"
                        name="password"
                        id="password"
                        className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        onChange={handleChange}
                        placeholder="********"
                        autoComplete="off"
                      />
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
                    <Link to="/register">انشاء حساب جديد</Link>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
