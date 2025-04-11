import { useEffect, useState } from "react";
import image from "../../assets/images/supplierBusiness.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setSupplierBusinessData,
  updatesupplierRegisterationProgress,
} from "../../app/slices/supplierSLice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export default function BusinessData() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updatesupplierRegisterationProgress(30));
  }, []);

  const supplierdata = useSelector(
    (state) => state.supplier.supplierRegisterationData
  );

  const {
    fullName,
    email,
    phoneNumber,
    businessName,
    storeName,
    taxNumber,
    nationalId,
    password,
  } = supplierdata;

  useEffect(() => {
    if (!fullName || !email || !phoneNumber || !password) {
      toast.error("رجاء إكمال بيانات المورد");
      navigate("/supplier-register/base");
      return;
    }
  }, []);

  // console.log(supplierdata);
  const [formData, setFormData] = useState({
    businessName: businessName || "",
    storeName: storeName || "",
    taxNumber: taxNumber || "",
    nationalId: nationalId || "",
  });
  const validateForm = () => {
    if (formData.businessName.trim() === "") {
      toast.error("يرجى إدخال اسم النشاط التجاري");
      return false;
    }
    if (formData.storeName.trim() === "") {
      toast.error("يرجى إدخال اسم المتجر");
      return false;
    }

    if (formData.taxNumber.trim() === "") {
      toast.error("يرجى إدخال رقم الضريبي");
      return false;
    }
    if (!/^\d{10,15}$/.test(formData.taxNumber)) {
      toast.error("الرقم الضريبي يجب أن يتكون من 10 إلى 15 رقمًا");
      return false;
    }
    if (formData.nationalId.trim() === "") {
      toast.error("يرجى إدخال رقم الهوية ");
      return false;
    }
    if (!/^\d{14}$/.test(formData.nationalId)) {
      toast.error("الرقم القومي يجب أن يتكون من 14 رقمًا");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    dispatch(setSupplierBusinessData(formData));
  };
  const handleNext = () => {
    if (!validateForm()) {
      return;
    }
    handleSubmit();
    navigate("/supplier-register/nidf");
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
                    value={formData.businessName}
                    onChange={handleChange}
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
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="اسم المتجر "
                    className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 md:flex-row justify-between md:gap-5">
                <div className="w-full">
                  <label htmlFor="taxNumber"> الرقم الضريبي</label>
                  <input
                    type="text"
                    name="taxNumber"
                    id="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    placeholder="xxxxxxxxxxxx"
                    className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="nationalId"> الرقم القومي</label>
                  <input
                    type="text"
                    name="nationalId"
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={handleChange}
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
