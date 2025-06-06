import { useEffect, useState } from "react";
import image from "../assets/images/registerImg.webp";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../app/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Cookies from "js-cookie";
export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ------------------------------------
  const { loading } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    const token =
      Cookies.get("accessToken") || localStorage.getItem("accessToken");
    if (user || token) {
      navigate("/redirect-user");
      toast.info("يرجي تسجيل الخروج اولاً ");
    }
  }, [navigate]);
  // ------------------------------------

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formValidation = () => {
    const { fullName, email, password } = formData;
    if (!fullName || !email || !password) {
      toast.error("يرجى ملئ جميع الحقول");
      return false;
    }
    return true;
  };
  // ---------------------------------
  const formDataValidation = () => {
    const { fullName, email, password, phoneNumber } = formData;
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passwordRegex = /^(?=.*[^a-zA-Z0-9])(?=.*\d)(?=.*[A-Z]).{6,}$/;
    const phoneNumberRegex = /^01[0125][0-9]{8}$/;
    if (fullName.length < 3) {
      toast.error("يجب أن يكون الاسم كامل أكثر من 3 أحرف");
      return false;
    }
    if (!phoneNumberRegex.test(phoneNumber)) {
      toast.error("يجب أن يكون رقم الهاتف صالح ");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("يرجى إدخال بريد إلكتروني صالح");
      return false;
    }

    if (password.length < 6) {
      toast.error("يجب أن تكون كلمة المرور مكونة من 6 أحرف او اكثر");
      return false;
    }
    if (!passwordRegex.test(password)) {
      toast.error(
        "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير وارقام ورموز"
      );
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("كلمتي المرور غير متطابقتين");
      return false;
    }
    return true;
  };
  // ---------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValidation()) {
      return;
    }
    if (!formDataValidation()) {
      return;
    }
    try {
      const res = await dispatch(registerUser(formData)).unwrap();
      console.log(res);
      if (res.status === "Successful") {
        toast.success("تم تسجيل حسابك بنجاح");
        navigate("/confirm-account");
      }
      if (res.title == "UserAlreadyExistsException") {
        toast.error(
          "البريد الإلكتروني مستخدم بالفعل. يمكنك إعادة تعيين كلمة المرور."
        );
      }
      if (res.title == "EmailAlreadyExistsException") {
        toast.error(
          "البريد الإلكتروني مستخدم بالفعل. يمكنك إعادة تعيين كلمة المرور."
        );
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  {
    /* ---------------Show Password ----------------- */
  }
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // ---------------------------------

  return (
    <div className="w-full md:w-[85%] mx-auto">
      <div className="min-h-[90dvh] px-10 flex justify-center items-center">
        <div className="flex items-center gap-10">
          <div className="hidden lg:block">
            <img src={image} alt="Register Image" width={550} height={550} />
          </div>
          <div>
            <div className="min-w-xs md:min-w-sm p-2">
              <div className="flex flex-col gap-1 mb-5">
                <h2 className="text-3xl font-bold">أنشاء حساب</h2>
                <p className="text-md text-gray-700">مرحبا بك 👋</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5 ">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="fullName"
                        className="text-lg font-semibold"
                      >
                        الأسم كامل
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        className="bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        onChange={handleChange}
                        placeholder="أحمد محمد"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="phoneNumber"
                        className="text-lg font-semibold"
                      >
                        رقم الهاتف
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        className="bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        onChange={handleChange}
                        placeholder="01234567890"
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-col sm:flex-row gap-5">
                    <div className="flex w-full flex-col gap-1">
                      <label htmlFor="email" className="text-lg font-semibold">
                        البريد الالكتروني
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        onChange={handleChange}
                        placeholder="email@email.com"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex flex-col gap-1">
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
                          className="bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                          onChange={handleChange}
                          placeholder="********"
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
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="confirmPassword"
                        className="text-lg font-semibold"
                      >
                        تاكيد كلمة المرور
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          id="confirmPassword"
                          className="bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="********"
                        />
                        {/* ---------------Show Confirm Password ----------------- */}
                        {confirmPassword && (
                          <div className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-700">
                            <button
                              type="button"
                              onClick={handleToggleConfirmPassword}
                            >
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        )}
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
                      {loading ? "جاري انشاء حساب" : "انشاء حساب"}
                    </button>
                  </div>
                </div>
              </form>

              <div>
                <p className="text-sm text-center mt-5">
                  لديك حساب بالفعل؟{"  "}
                  <Link to="/login" className="text-[var(--color-primary)]">
                    تسجيل دخول
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
