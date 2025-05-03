import { useState } from "react";

export default function ResetUserPassword() {
  const [email, setEmail] = useState("");
  const isEmailInSession = sessionStorage.getItem("email");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  return (
    <div className="">
      <div className="min-h-[70svh] flex gap-5 items-center justify-center">
        <div className="shadow-lg rounded-lg bg-white w-full max-w-md flex flex-col gap-5 border border-gray-300 pb-5">
          <h1 className="text-2xl font-semibold border-b border-gray-200 p-4 text-center">
            إعادة تعيين كلمة المرور
          </h1>
          <div className="flex flex-col gap-5 p-4 ">
            <div>
              <label htmlFor="email" className="text-lg font-semibold">
                البريد الالكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 rounded-lg p-2 w-full mt-1 "
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end ">
              <button className="w-full px-5 py-2 bg-teal-500 hove:bg-teal-600 text-white border  text-lg rounded-lg">
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
