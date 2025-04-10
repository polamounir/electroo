import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="h-[60dvh] lg:h-[90dvh] bg-gray-300 landing-section">
      <div className="w-full h-full bg-black/50">
        <div className="p-5 md:p-15 py-15 flex flex-col gap-5 lg:gap-30">
          <div className="self-center">
            <div className="w-xs sm:w-sm md:w-md relative">
              <input
                type="text"
                placeholder="بحث ..."
                className="bg-[var(--color-light-gray)] px-5 pe-20 py-2 rounded-full border border-gray-300  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] w-full"
              />
              <Link to="/" className="absolute top-0 bottom-0 end-0 w-15 text-3xl flex justify-center items-center text-gray-400">
                <IoSearch />
              </Link>
            </div>
          </div>
          <div className="w-full h-full flex justify-center flex-col gap-10 lg:gap-20 md:max-w-lg lg:ps-20 mt-5 lg:mt-10">
            <div className="text-center md:text-start">
              <h1 className="ar-font-s text-2xl md:text-6xl text-white">
                مرحباً بكم في متجرنا
              </h1>
              <p className="text-white text-lg font-semibold mt-5">
                نحن مستعدون لتقديم لكم افضل المنتجات الالكترونية بأرخص الاسعار
                مع توفير قطع غيار موثوقة و مضمونة وخدمة الشحن المجاني
              </p>
            </div>
            <div className="flex gap-5 justify-center md:justify-start">
              <Link
                to=""
                className="bg-black px-10 py-3 rounded-lg md:text-2xl  text-white font-semibold"
              >
                ابدأ التسوق
              </Link>
              <Link
                to="/login"
                className="bg-white px-10 py-3 rounded-lg md:text-2xl text-[var(--color-primary)] font-semibold"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
