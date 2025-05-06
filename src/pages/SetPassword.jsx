import React, { useState } from "react";
import image from "../assets/images/setPassword.svg";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { api } from "../api/axiosInstance";

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const resetToken = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[^a-zA-Z0-9])(?=.*\d)(?=.*[A-Z]).{6,}$/;
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
      toast.error("كلمات المرور غير متطابقة!");
      return;
    }

    try {
      const { data } = await api.post("/auth/reset-password", {
        userId,
        resetToken,
        newPassword: password,
      });
      console.log(data);
      toast.success("تم");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full md:w-[85%] mx-auto">
      <div className="min-h-[72dvh] px-10 flex justify-center items-center">
        <div className="flex items-center gap-10">
          <div className="hidden lg:block p-10">
            <img src={image} alt="Set Password" width={300} height={300} />
          </div>
          <div className="flex justify-center">
            <div className="min-w-xs md:min-w-sm">
              <div className="flex flex-col gap-2 mb-10">
                <h2 className="text-3xl font-bold">تعيين كلمة مرور جديدة</h2>
                <p className="text-md text-gray-700">
                  من فضلك أدخل كلمة مرور جديدة 👇
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Password Field */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="text-lg font-semibold">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3 top-0 h-full text-xl text-gray-600"
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-1 ">
                  <label
                    htmlFor="confirmPassword"
                    className="text-lg font-semibold"
                  >
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="********"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute end-3 top-0 h-full  text-xl text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <AiFillEyeInvisible />
                      ) : (
                        <AiFillEye />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full justify-center px-3 py-2 rounded-md text-white font-semibold bg-[var(--color-primary)] hover:bg-opacity-90 transition duration-200"
                >
                  تأكيد تعيين كلمة المرور
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
