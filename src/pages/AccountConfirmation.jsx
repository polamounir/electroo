import React, { useState } from "react";
import { confirmAccount } from "../api/user";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AccountConfirmation() {
  const navigate = useNavigate();
  const [confirmCode, setConfirmCode] = useState("");

  const handleConfirm = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const data = {
      userId: userId,
      code: confirmCode,
    };
    try {
      const response = await confirmAccount(data);
      if (response.isSuccess) {
        toast.success("تم تأكيد الحساب بنجاح");
        navigate("/login");
        console.log(response.data.data);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.detail === "User email is already confirmed") {
        toast.info("تم تأكيد الحساب بالفعل. يمكنك تسجيل الدخول");
        navigate("/login");
        return;
      } else {
        toast.error("تاكد من الكود");
      }
    }
  };
  return (
    <div>
      <div className="min-h-[75dvh] flex justify-center items-center px-2">
        <div className="bg-white rounded-xl shadow-lg p-7 md:p-10 max-w-md w-full text-center">
          <div className="text-teal-500 text-6xl mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <form onSubmit={handleConfirm}>
            <h1 className="text-primary text-2xl font-bold mb-4">
              تم إنشاء حسابك بنجاح!
            </h1>

            <p className="mb-6 leading-relaxed">
              يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.
            </p>

            <div className="flex flex-col">
              <input
                type="text"
                placeholder="كود التحقق"
                className="bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                onChange={(e) => setConfirmCode(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                className="mt-6 bg-[var(--color-primary)] text-white font-bold py-2 px-4 rounded-md hover:bg-teal-500 focus:outline-none focus:ring focus:border-teal-300"
                type="submit"
              >
                تأكيد الحساب
              </button>
            </div>
            {/* <div className="flex flex-col justify-center">
              <p className="mt-6 text-sm text-mediumGray">
                إذا لم تستلم رسالة التأكيد، يرجى.
              </p>
              <button className=" justify-center hover:underline">
                إعادة إرسالها
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}
