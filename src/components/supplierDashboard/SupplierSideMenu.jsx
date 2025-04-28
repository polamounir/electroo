import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { IoSpeedometerOutline, IoBagOutline, IoChatbubbleOutline } from "react-icons/io5";
import { TfiPackage } from "react-icons/tfi";

import { FaRegCircleUser } from "react-icons/fa6";
import { BsGear } from "react-icons/bs";
import { AiOutlineDollar } from "react-icons/ai";
export default function SupplierSideMenu() {
  const links = [
    {
      id: 1,
      name: "لوحة التحكم",
      title: "supplier",
      link: "/supplier",
      icon: <IoSpeedometerOutline />,
    },
    {
      id: 2,
      name: "الطلبات",
      title: "orders",
      link: "/supplier/orders",
      icon: <IoBagOutline />,
    },
    {
      id: 3,
      name: "المنتجات",
      title: "products",
      link: "/supplier/products",
      icon: <TfiPackage />,
    },
    // {
    //   id: 4,
    //   name: "المستخدمين",
    //   title: "users",
    //   link: "/supplier/users",
    //   icon: <FaRegCircleUser />,
    // },
    {
      id: 5,
      name: "المبيعات",
      title: "sales",
      link: "/supplier/sales",
      icon: <AiOutlineDollar />,
    },
    {
      id: 6,
      name: "الاعدادت",
      title: "settings",
      link: "/supplier/settings",
      icon: <BsGear />,
    },
    {
      id: 7,
      name: "المحادثات",
      title: "chats",
      link: "/supplier/chats",
      icon: <IoChatbubbleOutline />,
    },
  ];
  const [activeLink, setActiveLink] = useState("supplier");
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
  return (
    <div className="hidden md:block fixed start-0 top-0 bottom-0">
      <div className="h-full w-60 bg-[var(--main-color)]  pt-20">
        <div className="flex flex-col gap-10">
          <Link to="/" className="title text-4xl font-bold ps-5">
            الكـــــــتروو
          </Link>
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
          

          
        </div>
      </div>
    </div>
  );
}
