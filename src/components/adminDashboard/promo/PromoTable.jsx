import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";
import { TbReload, TbDiscountOff } from "react-icons/tb";

export default function PromoTable() {
  const navigate = useNavigate();

  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [displayedPromos, setDisplayedPromos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPromos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/coupons?Page=1&Limit=10`);
      // console.log(response.data.data);
      setPromos(response.data.data);
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      console.error("Error fetching Promos:", error);
      setIsError(true);
      setIsLoading(false);
      toast.error("Failed to load Promos");
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);
  useEffect(() => {
    setDisplayedPromos(promos.items);
  }, [promos]);

  const handleAddNavigation = () => {
    navigate("/admin/promos/add");
  };

  const handleEditNavigation = (codeId) => {
    navigate(`/admin/promos/edit/${codeId}`);
  };

  const confirmDelete = (codeId) => {
    setDeleteConfirm(codeId);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const changeUserStatus = (codeId, state) => {
    const codes = promos.items;
    const userIndex = codes.findIndex((user) => user.id === codeId);
    if (userIndex !== -1) {
      const updatedUsers = [...displayedPromos];
      updatedUsers[userIndex].isActive = state;
      setDisplayedPromos(updatedUsers);
    }
  };
  const handleDelete = async (codeId) => {
    try {
      const response = await api.put(`/coupons/${codeId}/deactivate`);

      if (response.data.status === "Successful") {
        toast.success(response.data.message || "Promo Deactivated");
        changeUserStatus(codeId, false);
      } else {
        toast.error("Failed to delete Promo");
      }
    } catch (error) {
      console.error("Error deleting", error);
      if (error.response) {
        toast.error(error.response.data.detail || "err deleting");
      } else {
        toast.error("حدث خطأ ما, حاول مرة اخرى");
      }
    } finally {
      setDeleteConfirm(null);
    }
  };

  const fetchSearchPromo = async () => {
    // e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.get(
        `/coupons?Page=1&Limit=10&SearchQuery=${searchQuery}`
      );
      // console.log(response.data.data);
      setPromos(response.data.data);
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      console.error("Error fetching Promos:", error);
      setIsError(true);
      setIsLoading(false);
      toast.error("Failed to load Promos");
    }
  };
  const handleReactivate = async (codeId) => {
    try {
      const response = await api.put(`/coupons/${codeId}/reactivate`);

      if (response.data.status === "Successful") {
        toast.success(response.data.message || "Promo reactivated");
        changeUserStatus(codeId, true);
      } else {
        toast.error("Failed to reactivate Promo");
      }
    } catch (error) {
      console.error("Error reactivating", error);
      if (error.response) {
        toast.error(error.response.data.detail || "err reactivating");
      } else {
        toast.error("حدث خطأ ما, حاول مرة اخرى");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">جاري التحميل ...</div>
      </div>
    );
  }

  if (isError && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-xl text-red-600 mb-4">حدث خطا غير متوقع</div>
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded-lg"
          onClick={fetchPromos}
        >
          إعادة تحميل
        </button>
      </div>
    );
  }
  // console.log(displayedPromos);
  return (
    <div className="w-full">
      <div className="flex gap-5 text-lg font-semibold items-center mt-5 relative overflow-hidden rounded-lg border border-gray-300 mb-5">
        <input
          type="text"
          placeholder="بحث  ..."
          name="orderId"
          className="px-4 py-2 w-full pe-20"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.code === "Enter" || e.which === 13) {
              fetchSearchPromo();
            }
          }}
        />
        <button
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 absolute end-0 top-0 bottom-0 text-white duration-300"
          onClick={fetchSearchPromo}
        >
          بحث
        </button>
      </div>

      <div className="w-full flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">اكواد الخصم</h2>
        </div>
        <button
          className="bg-black px-5 py-2 text-white rounded-lg"
          onClick={handleAddNavigation}
        >
          أضافة كود
        </button>
      </div>

      {displayedPromos && displayedPromos?.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-500">لا يوجد أكواد خصم</p>
          <button
            className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg"
            onClick={handleAddNavigation}
          >
            أضافة كود جديد
          </button>
        </div>
      ) : (
        <div className="flex flex-col mt-4 overflow-x-auto">
          <div className="grid grid-cols-12 py-3 bg-gray-100 rounded-t-lg px-4 font-medium">
            <div className="col-span-4">الكود</div>
            <div className="col-span-2">الخصم</div>
            <div className="col-span-2 text-center">الصلاحية</div>
            <div className="col-span-2 text-center">الحالة</div>
            <div className="col-span-2 text-center">العماليات</div>
          </div>

          <div className=" rounded-b-lg">
            {displayedPromos &&
              displayedPromos.length > 0 &&
              displayedPromos.map((code) => {
                // console.log(code);
                return (
                  <div
                    key={code.id}
                    className="grid grid-cols-12 border-t border-gray-200 py-4 px-4 items-center hover:bg-gray-50"
                  >
                    <div className="col-span-4 truncate">
                      {code.code || "—"}
                    </div>
                    <div className="col-span-2 truncate">
                      {code.discountPercentage || "—"} %
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span
                        className={`${
                          code.isValid ? "bg-teal-600 px-4" : "bg-red-400 "
                        } px-2 py-1 rounded-lg text-full text-white `}
                      >
                        {code.isValid ? "صالح" : "غير صالح"}
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span
                        className={`${
                          code.isActive ? "bg-teal-600 px-4" : "bg-red-400 "
                        } px-2 py-1 rounded-lg text-full text-white `}
                      >
                        {code.isActive ? "نشط" : "موقوف"}
                      </span>
                    </div>

                    <div className="col-span-2 flex justify-center gap-3 ">
                      <button
                        className="text-teal-600 text-xl hover:text-teal-800"
                        onClick={() => handleEditNavigation(code.id)}
                        title="Edit code"
                      >
                        <FaRegEdit />
                      </button>
                      {!code.isActive ? (
                        <button
                          className="text-green-600 text-xl hover:text-green-800"
                          onClick={() => handleReactivate(code.id)}
                          title="Reactivate code"
                        >
                          <TbReload />
                        </button>
                      ) : (
                        <div>
                          {deleteConfirm === code.id ? (
                            <div
                              className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 flex items-center justify-center"
                              onClick={cancelDelete}
                            >
                              <div
                                className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 z-50 text-right"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                                  تأكيد إلغاء الكود
                                </h3>

                                <p className="text-gray-600 mb-6">
                                  هل أنت متأكد من إلغاء هذا الكود؟{" "}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3">
                                  <button
                                    onClick={() => handleDelete(code.id)}
                                    className="flex-1 font-medium py-3 px-6 rounded-lg shadow-sm bg-red-500 hover:bg-red-600 active:bg-red-700 text-white"
                                  >
                                    تأكيد الإلغاء
                                  </button>
                                  <button
                                    onClick={cancelDelete}
                                    className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition font-medium py-3 px-6 rounded-lg shadow-sm"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="text-red-600 text-xl hover:text-red-800"
                              onClick={() => confirmDelete(code.id)}
                              title="Activation code"
                            >
                              <TbDiscountOff />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
