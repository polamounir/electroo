import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../api/axiosInstance";

// Constants
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;"'/?><,.\[\]\\]).{8,}$/;
const STEPS = {
  EMAIL: "email",
  CODE: "code",
};

export default function ResetUserPassword() {
  const [form, setForm] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [userId, setUserId] = useState("");
  const [step, setStep] = useState(STEPS.EMAIL);
  const [visibility, setVisibility] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  const updateForm = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleVisibility = useCallback(field => {
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleSendCode = async () => {
    try {
      const res = await api.post("/auth/reset-password-token", { email: form.email });
      if (res.status === 200) {
        toast.success("تم إرسال رمز التحقق إلى البريد الإلكتروني");
        setUserId(res.data.data.userId);
        setStep(STEPS.CODE);
      } else {
        toast.error("حدث خطأ أثناء إرسال رمز التحقق");
      }
    } catch (error) {
      if (error.response?.data?.status === 404) {
        toast.error("البريد الإلكتروني غير موجود");
      } else {
        toast.error("حدث خطأ أثناء إرسال رمز التحقق");
      }
    }
  };

  const handleResetPassword = async () => {
    const { code, newPassword, confirmPassword } = form;

    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      toast.error("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم ورمز خاص.");
      return;
    }

    try {
      const res = await api.post("/auth/reset-password", {
        userId,
        resetToken: code,
        newPassword,
      });

      if (res.status === 200) {
        toast.success("تمت إعادة تعيين كلمة المرور بنجاح");
        navigate("/login");
      } else {
        toast.error("فشل إعادة تعيين كلمة المرور. يرجى التحقق من الرمز.");
      }
    } catch (error) {
      toast.error(
        `فشل إعادة تعيين كلمة المرور: ${error.response?.data?.message || "حدث خطأ"}`
      );
    }
  };

  const handleNext = () => {
    if (step === STEPS.EMAIL) handleSendCode();
    else handleResetPassword();
  };

  const handlePrev = () => {
    setStep(STEPS.EMAIL);
    setForm(prev => ({
      ...prev,
      code: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  return (
    <div className="min-h-[70svh] flex items-center justify-center px-4">
      <div className="shadow-lg rounded-lg bg-white w-full max-w-md border border-gray-300">
        <h1 className="text-2xl font-semibold border-b p-4 text-center">
          إعادة تعيين كلمة المرور
        </h1>

        <div className="p-4 space-y-5">
          {step === STEPS.EMAIL && (
            <InputField
              id="email"
              label="البريد الإلكتروني"
              type="email"
              value={form.email}
              onChange={e => updateForm("email", e.target.value)}
            />
          )}

          {step === STEPS.CODE && (
            <>
              <InputField
                id="code"
                label="رمز التحقق"
                type="text"
                value={form.code}
                onChange={e => updateForm("code", e.target.value)}
              />
              <PasswordField
                id="newPassword"
                label="كلمة المرور الجديدة"
                visible={visibility.newPassword}
                toggle={() => toggleVisibility("newPassword")}
                value={form.newPassword}
                onChange={e => updateForm("newPassword", e.target.value)}
              />
              <PasswordField
                id="confirmPassword"
                label="تأكيد كلمة المرور الجديدة"
                visible={visibility.confirmPassword}
                toggle={() => toggleVisibility("confirmPassword")}
                value={form.confirmPassword}
                onChange={e => updateForm("confirmPassword", e.target.value)}
              />
            </>
          )}

          <div className="flex justify-between gap-2">
            {step === STEPS.CODE && (
              <button
                onClick={handlePrev}
                className="w-1/2 px-5 py-2 bg-red-100 hover:bg-red-400 hover:text-white text-red-800 border text-lg rounded-lg border-red-800"
              >
                رجوع
              </button>
            )}
            <button
              onClick={handleNext}
              className={`px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-lg rounded-lg ${
                step === STEPS.EMAIL ? "w-full" : "w-1/2"
              }`}
            >
              {step === STEPS.EMAIL ? "التالي" : "تحقق وإعادة تعيين"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🧩 Reusable Input Component
const InputField = ({ id, label, type, value, onChange }) => (
  <div>
    <label htmlFor={id} className="text-lg font-semibold">
      {label}
    </label>
    <input
      id={id}
      type={type}
      className="border border-gray-300 rounded-lg p-2 w-full mt-1"
      value={value}
      onChange={onChange}
    />
  </div>
);

// 🧩 Reusable Password Field Component
const PasswordField = ({ id, label, visible, toggle, value, onChange }) => (
  <div>
    <label htmlFor={id} className="text-lg font-semibold">
      {label}
    </label>
    <input
      id={id}
      type={visible ? "text" : "password"}
      className="border border-gray-300 rounded-lg p-2 w-full mt-1"
      value={value}
      onChange={onChange}
    />
    <button
      type="button"
      onClick={toggle}
      className="text-sm text-teal-600 hover:underline mt-1"
    >
      {visible ? "إخفاء" : "عرض"} كلمة المرور
    </button>
  </div>
);
