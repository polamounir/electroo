import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
import { api } from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import { GoTrash } from "react-icons/go";

export default function OrdersOverview() {
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const navigateToProduct = () => {
    
    navigate(`/admin/orders/${orderId.trim()}`);
  };
  const editProduct = (id) => {
    navigate(`/admin/orders/${id}`);
  };
  const getAllOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/admin/orders?Page=1&Limit=10");
      console.log(res);
      setOrders(res.data.data.items);
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  if (isLoading) {
    return (
      <div>
        <span className=" text-2xl font-semibold text-center flex justify-center items-center gap-2">
          جاري جلب البيانات ...
        </span>
      </div>
    );
  }
  if (isError) {
    return (
      <div>
        <span className=" text-2xl font-semibold text-center flex justify-center items-center gap-2">
          خطأء في جلب البيانات
        </span>
        <div className="flex justify-center items-center gap-2 mt-5">
          <TbReload className="text-2xl" />
          <span>لا يمكنك تحميل البيانات</span>
        </div>

        <button
          onClick={getAllOrders}
          className="bg-teal-500 text-white px-4 py-2 rounded-md mt-5"
        >
          حاول مرة اخرى
        </button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <h2>ادخل رقم الطلب</h2>
          <div className="flex gap-5 text-lg font-semibold items-center mt-5 relative overflow-hidden rounded-lg border border-gray-300">
            <input
              type="text"
              placeholder="رقم الطلب"
              name="orderId"
              className="px-4 py-4 w-full pe-20"
              onChange={(e) => {
                console.log(e.target.value);
                setOrderId(e.target.value);
              }}
            />
            <button
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 absolute end-0 top-0 bottom-0 text-white duration-300"
              onClick={navigateToProduct}
            >
              بحث
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mt-10">الطلبات</h2>
            <div className="overflow-x-auto mt-5">
              <table className="w-full border border-gray-300 rounded-lg shadow-lg scrolling">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-start">رقم الطلب</th>
                    <th className="px-4 py-2 text-start">اسم المستخدم</th>
                    <th className="px-4 py-2 text-start">تاريخ الطلب</th>
                    <th className="px-4 py-2 text-start">حالة الطلب</th>
                    <th className="px-4 py-2 text-start">الاجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="border-b border-gray-200"
                    >
                      <td className="px-4 py-2">{order.orderId}</td>
                      <td className="px-4 py-2">{order.buyerEmail}</td>
                      <td className="px-4 py-2">{order.orderDate}</td>
                      <td className="px-4 py-2">{order.status}</td>
                      <td className="px-4 py-2 flex gap-3">
                        <button
                          className="text-teal-500 hover:text-teal-600"
                          onClick={() => {
                            editProduct(order.orderId);
                          }}
                        >
                          <FaRegEdit size={20} />
                        </button>
                        <button className="text-red-500 hover:text-red-600">
                          <GoTrash size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <div>NO ORDERS</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
