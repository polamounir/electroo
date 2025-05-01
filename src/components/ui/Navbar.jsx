import { IoCartOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuMessageCircleMore } from "react-icons/lu";
import ChatDropdownList from "./ChatDropdownList";
import {
  closeUserChatsMenu,
  openUserChatsMenu,
} from "../../app/slices/userChatsSlicce";
import { logOut } from "../../app/slices/authSlice";
import { useLocation } from "react-router-dom";
export default function Navbar() {
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

const location = useLocation();
const isHomePage = location.pathname === "/";



  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const user = useSelector((state) => state.auth.user);


  const links = [
    {
      name: "الفئات",
      link: "/categories",
    },
    {
      name: "المحفوظات",
      link: "/",
    },
    // {
    //   name: "الموردين",
    //   link: "/info-supplier",
    // },
    {
      name: "تواصل معنا",
      link: "/contact",
    },
  ];

  const { isChatMenuOpen } = useSelector((state) => state.userChatsMenu);

  const openChatDropdown = () => {
    dispatch(openUserChatsMenu());
  };
  const closeChatDropdown = () => {
    setTimeout(() => {
      dispatch(closeUserChatsMenu());
    }, 500);
  };

  
  return (
    <div
      className={`border-b ${
        isHomePage
          ? "bg-black text-white border-gray-700"
          : "bg-white text-black border-gray-100"
      } sticky top-0 left-0 right-0 z-[999] shadow-md ${
        isScrolled ? "bg-black" : ""
      }`}
    >
      <div className="p-5 w-full md:w-[85%] mx-auto">
        <div className="flex justify-between gap-10">
          <div className="flex items-center gap-5">
            <h1 className="ar-font-s text-4xl">
              <Link to="/">إلكـــــــتروو</Link>
            </h1>
            <ul className="hidden lg:flex gap-5 text-lg font-semibold ">
              {links.map((link, index) => (
                <li key={index} className="navlink">
                  <Link to={link.link}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="hidden lg:flex items-center gap-5">
              <div className="">
                <Link to="/cart" className="text-3xl">
                  <IoCartOutline />
                </Link>
              </div>
              <div
                className="relative cursor-pointer"
                onClick={openChatDropdown}
                onMouseLeave={closeChatDropdown}
              >
                {/* <Link to="/live-chat" className=" md:hidden">
                  <LuMessageCircleMore />
                </Link> */}

                <div className=" text-3xl">
                  <LuMessageCircleMore />
                </div>

                {isChatMenuOpen && <ChatDropdownList isPopupOpen={true} />}
              </div>
              <div>
                {user ? (
                  <Link to="/profile">
                    <div className="flex items-center gap-3 bg-teal-500 text-white px-4 py-2 rounded-full">
                      <FaRegUser />
                      {user.fullName}
                    </div>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-3 bg-teal-500 text-white px-4 py-2 rounded-full"
                  >
                    <FaRegUser />
                    تسجيل دخول
                  </Link>
                )}
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
          className={`absolute z-[988] duration-1000 min-h-[100svh] ${
            isSidebarOpen ? "" : "translate-x-[100%]"
          } start-0 top-0 bottom-0 bg-gray-100 min-w-[21rem]`}
        >
          <div className="p-5">
            <div className="flex justify-between items-center">
              <h1 className="ar-font-s text-4xl">إلكـــــــتروو</h1>
              <button className="text-3xl" onClick={toggleSidebar}>
                <IoClose />
              </button>
            </div>
            <div className="mt-10">
              <ul className="flex flex-col gap-5 text-lg font-semibold">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link to={link.link}>{link.name}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/cart">السلة</Link>
                </li>

                {user ? (
                  <>
                    <li>
                      <Link to="/live-chat">المحادثات</Link>
                    </li>
                    <li>
                      <Link to="/profile">الملف الشخصي</Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/login">تسجيل دخول</Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      dispatch(logOut());
                    }}
                  >
                    تسجيل الخروج
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
