import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { TbReload } from "react-icons/tb";

export default function OrdersOverview() {
  const [orderId, setOrderId] = useState("");
  const [sortByStatus, setSortByStatus] = useState("Pending");
  const navigate = useNavigate();

  const navigateToProduct = () => {
    navigate(`/admin/orders/${orderId.trim()}`);
  };

  const editProduct = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["orders", sortByStatus],
    queryFn: async () => {
      const res = await api.get(
        `/admin/orders?Page=1&Limit=50&Status=${sortByStatus}`
      );
      return res.data.data.items;
    },
  });

  const orders = data || [];

  if (isError) {
    return (
      <div>
        <span className="text-2xl font-semibold text-center flex justify-center items-center gap-2">
          خطأء في جلب البيانات
        </span>
        <div className="flex justify-center items-center gap-2 mt-5">
          <TbReload className="text-2xl" />
          <span>لا يمكنك تحميل البيانات</span>
        </div>
        <button
          onClick={refetch}
          className="bg-teal-500 text-white px-4 py-2 rounded-md mt-5"
        >
          حاول مرة اخرى
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>ادخل رقم الطلب</h2>
      <div className="flex gap-5 text-lg font-semibold items-center mt-5 relative overflow-hidden rounded-lg border border-gray-300">
        <input
          type="text"
          placeholder="رقم الطلب"
          name="orderId"
          className="px-4 py-4 w-full pe-20"
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 absolute end-0 top-0 bottom-0 text-white duration-300"
          onClick={navigateToProduct}
        >
          بحث
        </button>
      </div>

      <h2 className="text-2xl font-semibold mt-10">الطلبات</h2>
      <div className="flex items-center gap-3 mt-2">
        {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              className={`px-5 py-1 rounded-lg border border-gray-300 ${
                sortByStatus === status ? "bg-black text-white" : ""
              }`}
              onClick={() => setSortByStatus(status)}
            >
              {status}
            </button>
          )
        )}
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="w-full border border-gray-300 rounded-lg shadow-lg">
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
              <tr key={order.orderId} className="border-b border-gray-200">
                <td className="px-4 py-2">{order.orderId}</td>
                <td className="px-4 py-2">{order.buyerEmail}</td>
                <td className="px-4 py-2">
                  {new Date(order.orderDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2 flex gap-3">
                  <button
                    className="text-teal-500 hover:text-teal-600"
                    onClick={() => editProduct(order.orderId)}
                  >
                    Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && (
          <div>
            <span className="text-2xl pt-10 font-semibold text-center flex justify-center items-center gap-2 text-teal-500">
              جاري جلب البيانات ...
            </span>
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="text-teal-500 text-center text-xl font-semibold pt-10">
            <span>لا يوجد طلبات</span>
          </div>
        )}
      </div>
    </div>
  );
}
