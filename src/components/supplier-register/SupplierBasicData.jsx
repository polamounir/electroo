import { useEffect } from "react";
import image from "../../assets/images/supplier1.svg";
import { useDispatch } from "react-redux";
import { updatesupplierRegisterationProgress } from "../../app/slices/supplierSLice";

import { Link, useNavigate } from "react-router-dom";
export default function BasicData() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updatesupplierRegisterationProgress(5));
  }, []);
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/supplier-register/business");
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
              <div className="flex flex-col gap-3 md:flex-row justify-between md:gap-5">
                <div>
                  <label htmlFor="fullName">الاسم كامل</label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    placeholder="الاسم كامل"
                    className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber">رقم الهاتف</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="رقم الهاتف "
                    className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 md:flex-row justify-between md:gap-5">
                <div>
                  <label htmlFor="email">البريد الالكتروني</label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="mail@mail.com"
                    className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label htmlFor="password">كلمة المرور</label>
                  <input
                    type="text"
                    name="password"
                    id="password"
                    placeholder="************"
                    className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
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
