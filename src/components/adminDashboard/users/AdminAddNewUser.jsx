import { useState } from "react";
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function AdminAddNewUser() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setIsLoading(true);

    try {
      const { data } = await api.post("/users", formData);
      console.log(data);
      if (data.status === "Successful") {
        toast.success(data.message);
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast("حدث خطأ ما, حاول مرة اخرى");
      }
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">اضافة مستخدم جديد</h2>
          <Link
            to="/admin/users"
            className="bg-black text-white text-sm px-7 py-2 rounded-lg"
          >
            الرجوع
          </Link>
        </div>
        <form onSubmit={handleSubmit} action="post">
          <div className="flex flex-col gap-5 mt-10">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-lg font-semibold">
                الاسم
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="border border-gray-300 rounded-lg p-2"
                onChange={handleChange}
                value={formData.fullName}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-lg font-semibold">
                البريد الالكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 rounded-lg p-2"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phoneNumber" className="text-lg font-semibold">
                رقم الهاتف
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="border border-gray-300 rounded-lg p-2"
                onChange={handleChange}
                value={formData.phoneNumber}
              />
            </div>
            {/* <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-lg font-semibold">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div> */}
            <button
              className={`${
                isLoading ? "bg-gray-500" : "bg-black"
              } text-white text-md px-5 py-2 rounded-lg mt-5"`}
              type="submit"
              disabled={isLoading}
            >
              اضافة مستخدم جديد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
