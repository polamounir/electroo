import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  IoSpeedometerOutline,
  IoBagOutline,
  IoChatbubbleOutline,
} from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { TfiPackage } from "react-icons/tfi";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsGear } from "react-icons/bs";
import { AiOutlineDollar } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { IoIosClose } from "react-icons/io";
import { setSupplierSideMenu } from "../../app/slices/dashboardSlice";
export default function AdminSideMenu() {
  const links = [
    {
      id: 1,
      name: "لوحة التحكم",
      title: "admin",
      link: "/admin",
      icon: <IoSpeedometerOutline />,
    },
    {
      id: 2,
      name: "الطلبات",
      title: "orders",
      link: "/admin/orders",
      icon: <IoBagOutline />,
    },
    {
      id: 3,
      name: "المنتجات",
      title: "products",
      link: "/admin/products",
      icon: <TfiPackage />,
    },
    {
      id: 4,
      name: "المستخدمين",
      title: "users",
      link: "/admin/users",
      icon: <FaRegCircleUser />,
    },
    {
      id: 5,
      name: " الفئات",
      title: "categories",
      link: "/admin/categories",
      icon: <BiCategoryAlt />,
    },
    {
      id: 6,
      name: "التجار",
      title: "suppliers",
      link: "/admin/suppliers",
      icon: <AiOutlineDollar />,
    },
    {
      id: 7,
      name: "أكواد الخصم",
      title: "promos",
      link: "/admin/promos",
      icon: <AiOutlineDollar />,
    },
    {
      id: 8,
      name: "تسجيل خروج",
      title: "settings",
      link: "/logout",
      icon: <CiLogout />,
    },
    // {
    //   id: 7,
    //   name: "المحادثات",
    //   title: "chats",
    //   link: "/admin/chats",
    //   icon: <IoChatbubbleOutline />,
    // },
  ];
  const [activeLink, setActiveLink] = useState("admin");
  const handleActiveLink = (link) => {
    setActiveLink(link);
  };

  const activeLinkStyles = {
    backgroundColor: "var(--color-primary)",
    color: "white",
  };

  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const section = pathParts[2];
  // console.log(section);
  useEffect(() => {
    handleActiveLink(section);
  }, []);
    const dispatch = useDispatch();
    const { supplierSideMenu } = useSelector((state) => state.dashboard);
  
    const toggleSideMenu = () => {
      dispatch(setSupplierSideMenu(!supplierSideMenu));
    };
  return (
     <div
        className={`fixed  bg-white z-100 md:block top-0 bottom-0 duration-300 ${
          supplierSideMenu ? "start-0" : "start-[-60rem]"
        } lg:start-0  duration-300 shadow-sm `}
      >
        <div className="flex justify-end lg:hidden ">
          <button
            onClick={toggleSideMenu}
            className="lg:hidden text-4xl  hover:bg-gray-100 rounded duration-300"
          >
            <IoIosClose />
          </button>
        </div>
        <div className="h-full w-60 bg-[var(--main-color)]  pt-20">
          <div className="flex flex-col gap-10">
            <Link to="/" className="title text-4xl font-bold ps-5">
              الكـــــــتروو
            </Link>
            {!status === "Verified" ? (
              <div className=" pe-10 flex flex-col gap-5">
                {tempLinks.map((link) => (
                  <Link
                    key={link.id}
                    to={link.link}
                    className="py-3 rounded-bl-full rounded-tl-full text-lg font-semibold ps-5 duration-400 flex items-center gap-5"
                    style={
                      activeLink === link.title ||
                      (!activeLink && link.title == "supplier")
                        ? activeLinkStyles
                        : null
                    }
                    onClick={() => handleActiveLink(link.title)}
                  >
                    <span
                      className={`text-2xl ${
                        activeLink === link.title
                          ? "text-white"
                          : "text-[var(--secondary-color)]"
                      }`}
                    >
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className=" pe-10 flex flex-col gap-5">
                {links.map((link) => (
                  <Link
                    key={link.id}
                    to={link.link}
                    className="py-3 rounded-bl-full rounded-tl-full text-lg font-semibold ps-5 duration-400 flex items-center gap-5"
                    style={
                      activeLink === link.title ||
                      (!activeLink && link.title == "supplier")
                        ? activeLinkStyles
                        : null
                    }
                    onClick={() => handleActiveLink(link.title)}
                  >
                    <span
                      className={`text-2xl ${
                        activeLink === link.title
                          ? "text-white"
                          : "text-[var(--secondary-color)]"
                      }`}
                    >
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
