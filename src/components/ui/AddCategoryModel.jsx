import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCategoryModel } from "../../app/slices/addCategoryModel";
import axios from "axios";
import { toast } from "sonner";

const AddCategoryModel = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.categoryModel.isOpen);
  
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName || !image) {
      alert("يرجى ملء جميع الحقول.");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("image", image);

    const options = {
      method: "POST",
      url: "https://ecommerce.markomedhat.com/api/categories",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNmFmMWUyNy02MTJhLTQ3NzMtOWQzOS0wOGRkNmQwOWY2Y2MiLCJGdWxsTmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBncmFkZWNvbS5jb20iLCJVc2VyVHlwZSI6IkFkbWluIiwibmJmIjoxNzQ1MjM5NDY3LCJleHAiOjE3NDUyMzk2NDcsImlhdCI6MTc0NTIzOTQ2N30.JLhCdFI6TMX63-5AJVpcl0720_3EuUZTqb_iGYXgW1k",
      },
      data: formData,
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);
      if (data.data.isSuccess) {
        toast.success("تم إضافة الفئة");
        dispatch(closeCategoryModel());
        setCategoryName("");
        setImage(null);
      } else {
        toast.error("فشل إضافة الفئة");
      }
    } catch (error) {
      console.error(error);
      toast.error("فشل إضافة الفئة");
    }
  };

  const handleCloseModel = (e) => {
    e.preventDefault();

    dispatch(closeCategoryModel());
  };

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/20 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10 relative">
        <button className="absolute top-5 start-5" onClick={handleCloseModel}>
          إغلاق
        </button>
        <h2 className="text-2xl font-bold text-teal-500 mb-4 text-center">
          إنشاء فئة
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10 relative"
        >
          <div className="mb-4">
            <label className="block text-teal-500 font-semibold mb-1">
              اسم الفئة
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="أدخل اسم الفئة"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-teal-500 font-semibold mb-1">
              تحميل صورة
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
              required
            />
            {preview && (
              <img
                src={preview}
                alt="معاينة"
                className="mt-3 rounded-lg border border-teal-100"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition duration-200"
          >
            اضفافة
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModel;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNmFmMWUyNy02MTJhLTQ3NzMtOWQzOS0wOGRkNmQwOWY2Y2MiLCJGdWxsTmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBncmFkZWNvbS5jb20iLCJVc2VyVHlwZSI6IkFkbWluIiwibmJmIjoxNzQ1NTI4MDQ4LCJleHAiOjE3NDU1MjgyMjgsImlhdCI6MTc0NTUyODA0OH0.psSR5Mwt98e_QfOPik0XyrkKIqKH4RU-l1xm_BykUgM
