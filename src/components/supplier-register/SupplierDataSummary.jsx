import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerNewSupplier } from "../../api/user";
import { updatesupplierRegisterationProgress } from "../../app/slices/supplierSLice";

export default function SupplierDataSummary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const supplierdata = useSelector(
    (state) => state.supplier.supplierRegisterationData
  );
  //   const { isLoading, isError, isSuccess } = useSelector(
  //     (state) => state.supplier
  //   );

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
    taxCard,
  } = supplierdata;

  // State to hold the generated image URLs
  const [imageUrls, setImageUrls] = useState({
    nationalIdFrontUrl: null,
    nationalIdBackUrl: null,
    taxCardUrl: null,
  });

  useEffect(() => {
    // Check if all required documents are uploaded
    if (!fullName || !email || !phoneNumber || !password) {
      toast.error("3رجاء إكمال بيانات المورد");
      navigate("/supplier-register/base");
      return;
    } else if (!businessName || !storeName || !taxNumber || !nationalId) {
      toast.error("2 رجال إكمال بيانات المورد");
      navigate("/supplier-register/business");
      return;
    } else if (!nationalIdFront || !nationalIdBack || !taxCard) {
      toast.error("1رجاء إكمال بيانات المورد");
      navigate("/supplier-register/nidf");
      return;
    }
  } ,[]);
  useEffect(() => {
    if (nationalIdFront) {
      setImageUrls((prev) => ({
        ...prev,
        nationalIdFrontUrl: URL.createObjectURL(nationalIdFront),
      }));
    }

    if (nationalIdBack) {
      setImageUrls((prev) => ({
        ...prev,
        nationalIdBackUrl: URL.createObjectURL(nationalIdBack),
      }));
    }

    if (taxCard) {
      setImageUrls((prev) => ({
        ...prev,
        taxCardUrl: URL.createObjectURL(taxCard),
      }));
    }

    return () => {
      if (imageUrls.nationalIdFrontUrl) {
        URL.revokeObjectURL(imageUrls.nationalIdFrontUrl);
      }
      if (imageUrls.nationalIdBackUrl) {
        URL.revokeObjectURL(imageUrls.nationalIdBackUrl);
      }
      if (imageUrls.taxCardUrl) {
        URL.revokeObjectURL(imageUrls.taxCardUrl);
      }
    };
  }, [nationalIdFront, nationalIdBack, taxCard]);

  const handleConfirm = async () => {
    dispatch(registerNewSupplier(supplierdata));
  };
  const handleEdit = () => {
    navigate("/supplier-register/base");
  };

  useEffect(() => {
    dispatch(updatesupplierRegisterationProgress(90));
  }, [dispatch]);
  return (
    <div className=" mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg border border-gray-200">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-teal-600 mb-2">{fullName}</h1>
        <div className="flex flex-col md:flex-row justify-center gap-4 text-gray-700">
          <p className="flex items-center">
            <svg
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {email}
          </p>
          <p className="flex items-center">
            <svg
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {phoneNumber}
          </p>
        </div>
      </div>

      {/* Business Info Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-semibold text-teal-600 mb-4 pb-2 border-b border-gray-200">
          البيانات التجارية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">
              اسم النشاط التجاري
            </p>
            <p className="text-lg font-semibold">{businessName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">اسم المتجر</p>
            <p className="text-lg font-semibold">{storeName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">الرقم الضريبي</p>
            <p className="text-lg font-semibold">{taxNumber}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">الرقم القومي</p>
            <p className="text-lg font-semibold">{nationalId}</p>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-teal-600 mb-4 pb-2 border-b border-gray-200">
          المستندات
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageUrls.nationalIdFrontUrl && (
            <DocumentCard
              title="الهوية ( الامام )"
              imageUrl={imageUrls.nationalIdFrontUrl}
              altText="National ID Front"
            />
          )}

          {imageUrls.nationalIdBackUrl && (
            <DocumentCard
              title="الهوية ( الخلف )"
              imageUrl={imageUrls.nationalIdBackUrl}
              altText="National ID Back"
            />
          )}

          {imageUrls.taxCardUrl && (
            <DocumentCard
              title="البطاقة الضريبية"
              imageUrl={imageUrls.taxCardUrl}
              altText="Tax Card"
            />
          )}
        </div>
      </div>

      {/*  confirm all data */}
      <div className="text-center mt-8 flex justify-between">
        <button
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300"
          onClick={handleConfirm}
        >
          تأكيد البيانات
        </button>
        <button
          className="bg-white text-black px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300"
          onClick={handleEdit}
        >
          تعديل البيانات
        </button>
      </div>
    </div>
  );
}

const DocumentCard = ({ title, imageUrl, altText }) => (
  <div className="group">
    <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  </div>
);
