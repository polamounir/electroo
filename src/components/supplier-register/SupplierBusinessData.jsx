import { useEffect } from "react";
import image from "../../assets/images/supplierBusiness.svg";
import { useDispatch } from "react-redux";
import { updatesupplierRegisterationProgress } from "../../app/slices/supplierSLice";
import { useNavigate } from "react-router-dom";
export default function BusinessData() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updatesupplierRegisterationProgress(30));
  }, []);

  const handleNext = () => {
    navigate("/supplier-register/national-data");
  };
  const handleBack = () => {
    navigate("/supplier-register/base");
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
                <h2>البيانات التجارية</h2>
              </div>
              <div className="flex flex-col gap-3 md:flex-row justify-between md:gap-5">
                <div>
                  <label htmlFor="businessName">أسم النشاط التجاري</label>
                  <input
                    type="text"
                    name="businessName"
                    id="businessName"
                    placeholder="اسم النشاط التجاري "
                    className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label htmlFor="storeName">اسم المتجر</label>
                  <input
                    type="text"
                    name="storeName"
                    id="storeName"
                    placeholder="اسم المتجر "
                    className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 md:flex-row justify-between md:gap-5">
                <div className="w-full">
                  <label htmlFor="texNumber"> الرقم الضريبي</label>
                  <input
                    type="text"
                    name="texNumber"
                    id="texNumber"
                    placeholder="xxxxxxxxxxxx"
                    className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
            </div>
            <div className="px-3 flex justify-between items-center mt-5">
              <button
                className="bg-black text-white  px-10 py-2 rounded-lg"
                onClick={handleNext}
              >
                التالي
              </button>
              <button
                className="bg-white text-black  px-10 py-2 rounded-lg border border-black"
                onClick={handleBack}
              >
                الرجوع
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
