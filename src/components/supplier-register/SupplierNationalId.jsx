import { useEffect, useRef, useState } from "react";
import uploadImage from "../../assets/images/upload.svg";
import { useDispatch } from "react-redux";
import { updatesupplierRegisterationProgress } from "../../app/slices/supplierSLice";

export default function SupplierNationalId() {
  const imageInputRef = useRef();
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleDivClick = () => {
    imageInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));

      // Optional: sync with input ref
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      imageInputRef.current.files = dataTransfer.files;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setPreview(null);

    // Optional: clear input ref
    imageInputRef.current.value = "";
  };

    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(updatesupplierRegisterationProgress(50));
    }, []);
  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1>برجاء ارسال بطاقة الرقم القومي</h1>

        <div
          className={`h-50 w-full max-w-lg border border-dashed relative cursor-pointer rounded-lg overflow-hidden 
          ${dragActive ? "bg-blue-100 border-blue-400" : "bg-gray-100"}`}
          onClick={handleDivClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="absolute top-0 start-0 w-full h-full flex items-center justify-center p-1">
            {preview ? (
              <img
                src={preview}
                alt="Uploaded Preview"
                className="object-contain h-full w-full"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center justify-center">
                <img src={uploadImage} alt="upload Icon" className="h-20" />
                <p>اسحب الصورة هنا أو اضغط للرفع</p>
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        {preview && (
          <div>
            <button
              className="mt-2 px-5 py-2 bg-red-500 text-white font-semibold rounded-lg"
              onClick={handleRemove}
            >
              ازالة الصورة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
