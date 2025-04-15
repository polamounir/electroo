// import { addAddress } from "@/api/user";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { closeAddressModel } from "../../app/slices/addAddressModelSlice";
import { addAddress } from "../../api/user";


export default function AddAddressModel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    governorate: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    console.log(formData);
  };
const validateForm = () => {
  const errors = {};

  if (!formData.firstName.trim()) {
    errors.firstName = "الاسم الأول مطلوب";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "الاسم الأخير مطلوب";
  }

  if (!formData.street.trim()) {
    errors.street = "اسم الشارع مطلوب";
  }

  if (!formData.city.trim()) {
    errors.city = "اسم المدينة مطلوب";
  }

  if (!formData.phoneNumber.trim()) {
    errors.phoneNumber = "رقم الهاتف مطلوب";
  } else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phoneNumber)) {
    errors.phoneNumber = "رقم الهاتف غير صالح";
  }

  if (!formData.governorate) {
    errors.governorate = "يجب اختيار المحافظة";
  }

  return errors;
};
const handleSubmit = async (e) => {
  e.preventDefault();

  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    // Show first error (or loop through all to show all)
    const firstError = Object.values(errors)[0];
    toast.error(firstError);
    return;
  }

  setLoading(true);
  try {
    const res = await addAddress(formData);
    console.log(res);

    if (res?.status === 401) {
      toast.error("يجب عليك تسجيل الدخول");
      navigate("/login");
      dispatch(closeAddressModel());
    } else if (res?.status === 200) {
      toast.success("تم إضافة العنوان بنجاح");
      dispatch(closeAddressModel());
      window.location.reload();
    } else {
      toast.error("تحقق من البيانات المدخلة");
    }
  } catch (error) {
    console.log(error);
    toast.error("حدث خطأ أثناء إضافة العنوان");
  } finally {
    setLoading(false);
  }
};



  const governorates = [
    { name: "Alexandria", title: "الإسكندرية" },
    { name: "Aswan", title: "أسوان" },
    { name: "Asyut", title: "أسيوط" },
    { name: "Beheira", title: "البحيرة" },
    { name: "BeniSuef", title: "بني سويف" },
    { name: "Cairo", title: "القاهرة" },
    { name: "Dakahlia", title: "الدقهلية" },
    { name: "Damietta", title: "دمياط" },
    { name: "Fayoum", title: "الفيوم" },
    { name: "Gharbia", title: "الغربية" },
    { name: "Giza", title: "الجيزة" },
    { name: "Ismailia", title: "الإسماعيلية" },
    { name: "KafrElSheikh", title: "كفر الشيخ" },
    { name: "Luxor", title: "الأقصر" },
    { name: "Matrouh", title: "مطروح" },
    { name: "Minya", title: "المنيا" },
    { name: "Monufia", title: "المنوفية" },
    { name: "NewValley", title: "الوادي الجديد" },
    { name: "NorthSinai", title: "شمال سيناء" },
    { name: "PortSaid", title: "بورسعيد" },
    { name: "Qalyubia", title: "القليوبية" },
    { name: "Qena", title: "قنا" },
    { name: "RedSea", title: "البحر الأحمر" },
    { name: "Sharqia", title: "الشرقية" },
    { name: "Sohag", title: "سوهاج" },
    { name: "SouthSinai", title: "جنوب سيناء" },
    { name: "Suez", title: "السويس" },
  ];

  return (
    <div className="fixed top-0 left-0 bottom-0 w-full bg-black/50 text-white z-50 overflow-scroll flex justify-center items-center">
      <div className="flex justify-center items-center p-2">
        <div className="w-full min-w-sm max-w-3xl bg-white text-black gap-10 px-5 py-10 rounded-md shadow-2xl shadow-teal-300/50 relative">
          <button
            className="bg-gray-100 hover:bg-gray-200 font-extrabold p-5 absolute right-5 top-5 h-10 w-10 flex justify-center items-center rounded-lg"
            onClick={() => {
              dispatch(closeAddressModel());
            }}
          >
            X
          </button>

          <div className="w-full pt-5">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1 mt-3">
                <label htmlFor="firstName">الاسم الاول</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div className="flex flex-col gap-1 mt-3">
                <label htmlFor="lastName">الاسم الاخير</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div className="flex flex-col gap-1 mt-3">
                <label htmlFor="street">الشارع</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div className="flex flex-col gap-1 mt-3">
                <label htmlFor="city">المدينة</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div className="flex flex-col gap-1 mt-3">
                <label htmlFor="city">رقم الهاتف</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div className="flex flex-col gap-1 mt-3">
                <div className="w-full">
                  <label htmlFor="email">المحافظة</label>
                  <select
                    name="governorate"
                    id="governorate"
                    value={formData.governorate}
                    className="w-full bg-[var(--color-light-gray)] px-3 py-2 rounded-md border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] outline-none "
                    onChange={handleChange}
                  >
                    <option value="" className="text-grey-300">
                      أختر المحافظة
                    </option>

                    {governorates.map((gov) => (
                      <option key={gov.name} value={gov.name}>
                        {gov.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <hr className="border-gray-300 my-3" />

              <div className="flex flex-col gap-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-gray-300 bg-teal-500 text-white p-2 rounded-lg disabled:opacity-60 flex justify-center items-center"
                >
                  {loading ? "جاري الاضافة ..." : "إضافة العنوان"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
