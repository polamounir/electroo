import { useState } from "react";
import { api } from "../api/axiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ResetUserPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [step, setStep] = useState("email");
  const isEmailInSession = sessionStorage.getItem("email");
  const navigate = useNavigate();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleSendCode = async () => {
    try {
      const res = await api.post("/auth/reset-password-token", { email });
      console.log(res);
      if (res.status === 200) {
        toast.success("تم إرسال رمز التحقق إلى البريد الإلكتروني");
        setUserId(res.data.data.userId);
        setStep("code");
      } else {
        toast.error("حدث خطأ أثناء إرسال رمز التحقق");
        console.log(res);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.status === 404) {
        toast.error("البريد الإلكتروني غير موجود");
      } else {
        toast.error("حدث خطأ أثناء إرسال رمز التحقق");
      }
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
        toast.error("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
        return;
    }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;"'/?><,.\[\]\\]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        toast.error("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم ورمز خاص.");
        return;
    }

    try {
        console.log(
            "Attempting to reset password for email:",
            email,
            "with code:",
            code,
            "and new password:",
            newPassword
        );
        const data = {
          userId: userId,
          resetToken: code,
          newPassword: newPassword  
        }
        const res = await api.post("/auth/reset-password", data);
        console.log(res);
        if (res.status === 200) {
            toast.success("تمت إعادة تعيين كلمة المرور بنجاح");
            navigate("/login");
        } else {
            toast.error("فشل إعادة تعيين كلمة المرور. يرجى التحقق من الرمز.");
             console.log(res);
        }
    } catch (error) {
        console.log(error);
        if (error.response?.data?.message) {
             toast.error(`فشل إعادة تعيين كلمة المرور: ${error.response.data.message}`);
        } else {
             toast.error("حدث خطأ أثناء إعادة تعيين كلمة المرور");
        }
    }
  };

  const handleNext = () => {
    if (step === "email") {
      handleSendCode();
    } else if (step === "code") {
      handleResetPassword();
    }
  };

  const handlePrev = () => {
    if (step === "code") {
      setStep("email");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="">
      <div className="min-h-[70svh] flex gap-5 items-center justify-center">
        <div className="shadow-lg rounded-lg bg-white w-full max-w-md flex flex-col gap-5 border border-gray-300 pb-5">
          <h1 className="text-2xl font-semibold border-b border-gray-200 p-4 text-center">
            إعادة تعيين كلمة المرور
          </h1>
          <div className="flex flex-col gap-5 p-4 ">
            {step === "email" && (
              <div>
                <label htmlFor="email" className="text-lg font-semibold">
                  البريد الالكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="border border-gray-300 rounded-lg p-2 w-full mt-1 "
                  onChange={(e) => setEmail(e.target.value)}  
                  value={email}
                />
              </div>
            )}

            {step === "code" && (
              <div className="flex flex-col gap-5">
                <div>
                  <label htmlFor="code" className="text-lg font-semibold">
                    رمز التحقق
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    className="border border-gray-300 rounded-lg p-2 w-full mt-1 "
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="text-lg font-semibold">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    className="border border-gray-300 rounded-lg p-2 w-full mt-1 "
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-sm text-teal-600 hover:underline mt-1"
                  >
                    {showNewPassword ? "إخفاء" : "عرض"} كلمة المرور
                  </button>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-lg font-semibold">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="border border-gray-300 rounded-lg p-2 w-full mt-1 "
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                  />
                   <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-sm text-teal-600 hover:underline mt-1"
                  >
                    {showConfirmPassword ? "إخفاء" : "عرض"} كلمة المرور
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between gap-2 ">
              {step !== "email" && (
                <button
                  className="w-1/2 px-5 py-2 bg-red-100 hover:bg-red-400 hover:text-white text-red-800 border text-lg rounded-lg border-red-800"
                  onClick={handlePrev}>
                  رجوع
                </button>
              )}

              <button
                className={`px-5 py-2 bg-teal-500 hove:bg-teal-600 text-white border text-lg rounded-lg ${
                  step === "email" ? "w-full" : "w-1/2"
                }`}
                onClick={handleNext}>
                {step === "email"
                  ? "التالي"
                  : "تحقق وإعادة تعيين"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
