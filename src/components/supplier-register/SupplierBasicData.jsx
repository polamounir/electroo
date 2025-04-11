import { useEffect, useState } from "react";
import image from "../../assets/images/supplier1.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setSupplierBasicData,
  updatesupplierRegisterationProgress,
} from "../../app/slices/supplierSLice";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export default function BasicData() {
  const dispatch = useDispatch();
  const supplierdata = useSelector(
    (state) => state.supplier.supplierRegisterationData
  );
  console.log(supplierdata);
  useEffect(() => {
    dispatch(updatesupplierRegisterationProgress(5));
  }, []);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: supplierdata.fullName || "",
    phoneNumber: supplierdata.phoneNumber || "",
    email: supplierdata.email || "",
    password:  "",
  });
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { fullName, phoneNumber, email, password } = formData;
    if (!fullName || !phoneNumber || !email || !password) {
      toast.error("يرجى ملئ جميع الحقول");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      toast.error("الاسم يجب ان يكون حروف فقط");
      return false;
    }
    if (!/^\d{11}$/.test(phoneNumber)) {
      toast.error("الرقم يجب ان يكون 11 ارقام");
      return false;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      toast.error("الرجاء ادخال بريد الكتروني صالح");
      return false;
    }
    if (password.length < 6) {
      toast.error("كلمة المرور يجب ان تكون اكثر من 6 حروف");
      return false;
    }
    if (!password.match(/^(?=.*[^a-zA-Z0-9])(?=.*\d)(?=.*[A-Z]).{6,}$/)) {
      toast.error("كلمة المرور يجب ان تحتوي علي حرف كبير و حرف صغير و رقم");
      return false;
    }
    return true;
  };
  const handleSubmit = () => {
    dispatch(setSupplierBasicData(formData));
    // console.log(formData);
  };
  const handleNext = () => {
    if (!validateForm()) {
      return;
    } else {
      handleSubmit();
      navigate("/supplier-register/business");
    }
  };
  return (
    <div className="">
      <div className="flex flex-col-reverse items-center lg:flex-row justify-center gap-10 lg:gap-20 p-3 lg:p-5">
        <div>
          <img
            src={image}
            alt="supplier"
            width={400}
            className="scale-in-out"
          />
        </div>
        <div>
          <div>
            <div className="min-w-xs lg:w-md p-3 flex flex-col gap-3">
              <div>
                <h2>البيانات الاساسية</h2>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 md:flex-row justify-between md:gap-5">
                  <div className="grow">
                    <label htmlFor="fullName">الاسم كامل</label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      placeholder="الاسم كامل"
                      className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grow">
                    <label htmlFor="phoneNumber">رقم الهاتف</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      placeholder="رقم الهاتف "
                      className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 md:flex-row justify-between md:gap-5">
                  <div className="w-full">
                    <label htmlFor="email">البريد الالكتروني</label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      value={formData.email}
                      placeholder="mail@mail.com"
                      className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="password">كلمة المرور</label>
                    <input
                      type="text"
                      name="password"
                      id="password"
                      value={formData.password}
                      placeholder="************"
                      className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-3 flex justify-between mt-5">
              <button
                className="bg-black text-white  px-10 py-2 rounded-lg"
                onClick={handleNext}
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
