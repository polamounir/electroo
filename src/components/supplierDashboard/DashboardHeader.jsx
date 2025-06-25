import { IoIosMenu, IoIosNotificationsOutline } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { setSupplierSideMenu } from "../../app/slices/dashboardSlice";
import { useEffect, useState } from "react";
import {HiInformationCircle, HiMail} from 'react-icons/hi';

import { api } from "../../api/axiosInstance";
import { Link } from "react-router-dom";
export default function DashboardHeader() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { supplierSideMenu } = useSelector((state) => state.dashboard);
  const toggleSideMenu = () => {
    dispatch(setSupplierSideMenu(!supplierSideMenu));
  };

  const [adminNotes, setAdminNotes] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
  
    useEffect(() => {
      const fetchAdminNotes = async () => {
        try {
          setIsLoading(true);
          const { data } = await api.get("/notifications");
          console.log(data);
          setAdminNotes(data.data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAdminNotes();
    }, []);
  return (
    <div className="w-full bg-slate-50  fixed z-10 top-0 end-0 flex justify-center items-center py-5 px-5 md:px-10 lg:px-15">
      <div className="flex items-center justify-between gap-5 w-full ">
        <div className="">
          <div className="lg:hidden">
            <button onClick={toggleSideMenu}>
              <IoIosMenu className="text-3xl" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div>
              <button
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Notifications"
              >
                <IoIosNotificationsOutline className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute z-[200] top-7 end-0 mt-1 w-64 md:w-xs bg-white shadow-lg rounded-md overflow-hidden hidden group-hover:block scrolling">
              <div className="p-2 border-b border-gray-200 bg-teal-700">
                <h3 className="font-semibold text-white">الاشعارات</h3>
              </div>
              <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                {isLoading ? (
                  <li className="p-3 text-center text-sm text-gray-500">
                    جارٍ التحميل...
                  </li>
                ) : isError ? (
                  <li className="p-3 text-center text-sm text-red-500">
                    حدث خطأ أثناء جلب البيانات
                  </li>
                ) : adminNotes?.length > 0 ? (
                  adminNotes.map((note, index) => {
                    const { notificationType, payload, date } = note;

                    // Set icon, background color, and link based on notification type
                    let icon, iconBg, link, title, description;

                    switch (notificationType) {
                      case "Order":
                        icon = (
                          <HiInformationCircle className="h-5 w-5 text-amber-600" />
                        );
                        iconBg = "bg-amber-100";
                        link = "/supplier/orders";
                        title = `طلب جديد من ${payload.buyerName}`;
                        description = `عدد المنتجات المطلوبة: ${payload.itemsCount}`;
                        break;

                      case "Message":
                        icon = <HiMail className="h-5 w-5 text-teal-600" />;
                        iconBg = "bg-blue-100";
                        link = "/messages";
                        title = "رسالة جديدة";
                        description =
                          payload.messagePreview || "لديك رسالة جديدة";
                        break;

                      case "Payment": 
                        icon = (
                          <HiCurrencyDollar className="h-5 w-5 text-green-600" />
                        );
                        iconBg = "bg-green-100";
                        link = "/payments";
                        title = "دفعة جديدة";
                        description = `تم استلام دفعة بقيمة ${payload.amount}`;
                        break;

                      default:
                        icon = <HiBell className="h-5 w-5 text-gray-600" />;
                        iconBg = "bg-gray-100";
                        link = "#";
                        title = "إشعار جديد";
                        description = "لديك إشعار جديد";
                    }

                    return (
                      <li
                        key={index}
                        className="p-3 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <Link to={link}>
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 pt-0.5">
                              <div
                                className={`h-8 w-8 rounded-full ${iconBg} flex items-center justify-center`}
                              >
                                {icon}
                              </div>
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                  {title}
                                </p>
                                <span className="text-xs text-gray-400">
                                  {new Date(date).toLocaleString("ar-EG", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "short",
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <li className="p-3 text-center text-sm text-gray-500">
                    لا توجد إشعارات
                  </li>
                )}
              </ul>
              {/* <div className="p-2 bg-gray-50 text-center">
                <button className="text-sm text-teal-600 hover:text-teal-800">
                  عرض كل الاشعارات
                </button>
              </div> */}
            </div>
          </div>
          <div>{user ? <h2>{user.fullName}</h2> : <h2>اسم المستخدم</h2>}</div>
        </div>
      </div>
    </div>
  );
}
