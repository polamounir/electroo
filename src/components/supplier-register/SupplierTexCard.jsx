
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import uploadImage from "../../assets/images/upload.svg";
import cam from "../../assets/images/cam.svg";
import {
  setSupplierTexCard,
  updatesupplierRegisterationProgress,
} from "../../app/slices/supplierSLice";

export default function SupplierTexCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    nationalIdFront,
    nationalIdBack,
    password,
  } = supplierdata;
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    if (!fullName || !email || !phoneNumber || !password) {
      toast.error("رجاء إكمال بيانات التاجر");
      navigate("/supplier-register/base");
      return;
    } else if (!businessName || !storeName || !taxNumber || !nationalId) {
      toast.error("رجال إكمال بيانات التاجر");
      navigate("/supplier-register/business");
      return;
    } else if (!nationalIdFront || !nationalIdBack) {
      toast.error("رجاء إكمال بيانات التاجر");
      navigate("/supplier-register/nidf");
      return;
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const image = acceptedFiles[0];
      if (!image || !image.type.startsWith("image/")) {
        alert("الرجاء اختيار صورة فقط");
        return;
      }
      setImageFile(image);
      const previewUrl = URL.createObjectURL(image);
      setImagePreview(previewUrl);

      dispatch(setSupplierTexCard(image));
    },
    [dispatch]
  );

  const handleDelete = () => {
    setImageFile(null);
    setImagePreview(null);
    dispatch(setSupplierTexCard(null));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleNext = () => {
    if (!imageFile) {
      toast.error(" يجب تحميل صورة لبطاقة الشخصية من الامام");
      return;
    }
    navigate("/supplier-register/supplier-summary");
  };

  const handleBack = () => {
    navigate("/supplier-register/nidb");
  };

  useEffect(() => {
    setImageFile(null);
    setImagePreview(null);
    dispatch(updatesupplierRegisterationProgress(75));
  }, [dispatch]);

  return (
    <div>
      <div className="flex flex-col-reverse items-center lg:flex-row-reverse justify-center gap-10 lg:gap-20 p-3 lg:p-5">
        <div className="w-full">
          <img
            src={cam}
            alt="supplier"
            width={400}
            className="scale-in-out hidden lg:block"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <h1>برجاء ارسال صورة البطاقة الضريبية</h1>

          <div
            {...getRootProps()}
            className={`min-h-[200px] w-full max-w-lg border border-dashed relative cursor-pointer rounded-lg overflow-hidden
              ${isDragActive ? "bg-blue-100 border-blue-400" : "bg-gray-100"}`}
          >
            <input {...getInputProps()} />

            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 p-4">
              {imagePreview ? (
                <div className="relative h-36">
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="object-cover w-full h-full rounded"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-600 hover:text-red-800"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center justify-center">
                  <img src={uploadImage} alt="upload Icon" className="h-20" />
                  <p>اسحب صورة هنا أو اضغط للرفع</p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full max-w-lg flex justify-between items-center mt-5">
            <button
              className="bg-black text-white px-10 py-2 rounded-lg"
              onClick={handleNext}
            >
              التالي
            </button>
            <button
              className="bg-white text-black px-10 py-2 rounded-lg border border-black"
              onClick={handleBack}
            >
              الرجوع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
