
import { FaCheck, FaCar, FaBox } from "react-icons/fa";

export default function CheckoutSuccess() {
  return (
    <div className="flex justify-center items-center bg-white py-25 px-10 min-h-[75svh]">
      <div className="p-5 rounded-lg text-center w-full max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">شكرًا لطلبك</h2>

        <div className="flex justify-center items-center mb-10 gap-10">
          <div className="flex flex-col items-center">
            <div className="bg-green-400 aspect-square flex justify-center items-center p-3 rounded-full">
              <FaCheck size={25} color="#fff" />
            </div>
            <p className="mt-1 text-sm font-semibold text-green-600">
              تم تأكيد الطلب
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-400 aspect-square flex justify-center items-center p-3 rounded-full">
              <FaCar size={25} color="#fff" />
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-600">
              جارٍ الشحن
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-400 aspect-square flex justify-center items-center p-3 rounded-full">
              <FaBox size={25} color="#fff" />
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-600">
              تم التوصيل
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-700">
          يتم الآن تجهيز طلبك. ستتلقى رسالة بريد إلكتروني أخرى بمجرد شحن الطلب.
        </p>
      </div>
    </div>
  );
}
