import React, { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { TbReload } from "react-icons/tb";
import StatusBadge from "../../ui/StatusBadge";

export default function OrdersOverview() {
  const [orderId, setOrderId] = useState("");
  const [sortByStatus, setSortByStatus] = useState("Pending");
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const navigateToOrder = () => {
    navigate(`/admin/orders/${orderId.trim()}`);
  };

  const navigateToOrderPage = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["orders", sortByStatus],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(
        `/admin/orders?Page=${pageParam}&Limit=20&Status=${sortByStatus}`
      );
      console.log(res.data);
      return {
        items: res.data.data.items,
        nextPage:
          res.data.data.page < res.data.data.totalItems / res.data.data.limit
            ? pageParam + 1
            : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnWindowFocus: false,
  });
  const orders = data?.pages.flatMap((page) => page.items) || [];
  useEffect(() => {
    if (!bottomRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1 }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [bottomRef, hasNextPage, isFetchingNextPage]);

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
          className="px-4 py-2 w-full pe-20"
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 absolute end-0 top-0 bottom-0 text-white duration-300"
          onClick={navigateToOrder}
        >
          بحث
        </button>
      </div>

      <h2 className="text-2xl font-semibold mt-10">الطلبات</h2>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        
        {[
          "Pending",
          // "Confirmed",
          // "Shipped",
          // "Delivered",
          "Cancelled",
          "Completed",
        ].map((value) => (
          <button
            key={value}
            className={`px-5 py-1 rounded-lg border border-gray-300 ${
              sortByStatus === value ? "bg-black text-white" : ""
            }`}
            onClick={() => setSortByStatus(value)}
          >
            {
              {
                Pending: "قيد الانتظار",
                Confirmed: "تم التأكيد",
                Shipped: "تم الشحن",
                Delivered: "تم التسليم",
                Cancelled: "تم الإلغاء",
                Completed: "تم ",
              }[value]
            }
          </button>
        ))}
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-11 gap-4 bg-gray-200 px-4 py-2 font-semibold border border-gray-300 rounded-t-lg">
          <div className="col-span-5">رقم الطلب</div>
          <div className="col-span-2 text-center">اسم المستخدم</div>
          <div className="col-span-2 text-center">تاريخ الطلب</div>
          <div className="col-span-2 text-center">حالة الطلب</div>
        </div>

        {isLoading && (
          <div className="text-teal-500 text-center text-2xl font-semibold pt-10">
            جاري جلب البيانات ...
          </div>
        )}

        {!isLoading &&
          orders.map((order, index) => (
            <div
              key={`${order.orderId}_${index}`}
              className={`cursor-pointer grid grid-cols-11 gap-4 px-4 py-3 border-b border-gray-200 items-center ${
                index % 2 === 0 ? "" : "bg-gray-100"
              } hover:bg-black/20 duration-300`}
              onClick={() => navigateToOrderPage(order.orderId)}
            >
              <div className="col-span-5">{order.orderId}</div>
              <div className="col-span-2 text-center">{order.buyerEmail}</div>
              <div className="col-span-2 text-center">
                {new Date(order.orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="col-span-2 text-center">
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        {!isLoading && orders.length === 0 && (
          <div className="text-center py-5 text-gray-500 font-semibold text-xl">
            لا يوجد طلبات
          </div>
        )}

        {isFetchingNextPage && (
          <div className="text-center py-5 text-gray-500 font-semibold">
            جاري تحميل المزيد...
          </div>
        )}

        <div ref={bottomRef} className="h-10" />
      </div>
    </div>
  );
}
