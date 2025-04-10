import { IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { useState } from "react";
export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div>
      <div className="p-5 w-full md:w-[85%] mx-auto">
        <div className="flex justify-between gap-10">
          <div className="flex items-end gap-5">
            <h1 className="ar-font-s text-4xl">إلكـــــــتروو</h1>
            <ul className="hidden lg:flex gap-2 text-lg font-semibold ">
              <li>
                <Link to="#">الرئيسية</Link>
              </li>
              <li>
                <Link to="#">الفئات</Link>
              </li>
              <li>
                <Link to="#">المنتجات</Link>
              </li>
              <li>
                <Link to="#">المحفوظات</Link>
              </li>
              <li>
                <Link to="#">تواصل معنا</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="hidden lg:flex items-center gap-5">
              <div className="">
                <button className="text-3xl">
                  <IoCartOutline />
                </button>
              </div>
              <div>
                <button className=" gap-3 bg-teal-500 text-white px-4 py-2 rounded-full">
                  <FaRegUser />
                  تسجيل دخول
                </button>
              </div>
            </div>
            <div className="lg:hidden flex justify-end">
              <button className="text-3xl" onClick={toggleSidebar}>
                <IoIosMenu />
              </button>
            </div>
          </div>
        </div>
        <div
          className={`absolute duration-1000 ${
            isSidebarOpen ? "" : "translate-x-[100%]"
          } start-0 top-0 bottom-0 bg-gray-100 min-w-[21rem]`}
        ></div>
      </div>
    </div>
  );
}
