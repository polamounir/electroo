import { Link, Outlet } from "react-router-dom";
import supplierImage from "../assets/images/supplier.svg";

export default function Suppliers() {
  return (
    <div className="min-h-[70dvh] flex justify-center items-center pt-20">
      <div className="w-full lg:w-[85%] m-auto">
        <div className=" p-2 py-10">
          <div className="flex flex-col md:flex-row gap-10 justify-around items-center">
            <div className="flex flex-col justify-center gap-5 min-w-xs">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold">
                  كن تاجراً لنا
                </h1>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">من هو التاجر:</h2>
                <p className="text-lg max-w-xs ">
                  نحن نقدم خدماتنا لعرض المنتجات الخاصة بالتجار باستخدام نظام
                  متكامل من التسجيل و التفعيل و التعديل و الحذف و الاضافة
                  للمنتاجات
                </p>
              </div>
              <div className="w-full flex">
                <Link
                  to="/supplier-register"
                  className="flex-1 text-center bg-teal-500 hover:bg-teal-600 duration-500 text-white font-bold py-2 px-4 rounded-full"
                >
                  انضم الينا
                </Link>
              </div>
            </div>
            <div>
              <img
                src={supplierImage}
                alt="supllier-Image"
                width={300}
                height={300}
              />
            </div>
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
