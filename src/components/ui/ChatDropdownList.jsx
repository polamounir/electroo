// import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getChatThunk, openChatingPopup } from "../../app/slices/chatSlice";
import { toast } from "sonner";
import { api } from "../../api/axiosInstance";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatPopup from "./ChatPopup";
import { openDropdownChatPopup } from "../../app/slices/userChatsSlicce";

export default function ChatDropdownList({isPopupOpen}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/conversations?page=1&limit=20");
      return data.data.items;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("يجب عليك تسجيل الدخول");
        navigate("/login");
      }
      throw error;
    }
  };

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userChatas"],
    queryFn: fetchChats,
    enabled: isPopupOpen,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const openChatPopup = (chat) => {
    dispatch(openChatingPopup(chat));
    dispatch(getChatThunk(chat.id));
    dispatch(openDropdownChatPopup());
  };

  const bgColors = [
    { bg: "bg-red-500", text: "text-white" }, // Red
    { bg: "bg-sky-400", text: "text-white" }, // Light Blue
    { bg: "bg-indigo-600", text: "text-white" }, // Deep Purple
    { bg: "bg-teal-500", text: "text-white" },
  ];

  const formatDate = (dateString) => {
    const date =
      dateString.endsWith("Z") || dateString.includes("+")
        ? new Date(dateString)
        : new Date(dateString + "Z");

    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) {
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="scrolling p-6 max-h-[50svh] overflow-y-auto w-sm absolute top-[90%] end-0 bg-white rounded-lg shadow-md border border-gray-300 chat-dropdown-menu">
    
      <h1 className="text-2xl font-bold mb-6">المحادثات</h1>
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">جاري تحميل المحادثات...</p>
        </div>
      )}
      {isError && (
        <div>
          <p className="text-red-500">خطأ في تحميل المحادثات</p>
        </div>
      )}
      {items.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">لا يوجد محادثات حاليا</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {items.map((chat) => {
          const randomColor =
            bgColors[Math.floor(Math.random() * bgColors.length)];
          return (
            <div
              key={chat.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-5 px-5 cursor-pointer"
              onClick={() => openChatPopup(chat)}
            >
              <div className="flex items-start gap-5">
                <div>
                  <span
                    className={`text-gray-500 bg-gray-200 rounded-full w-15 h-15 flex items-center justify-center text-2xl font-bold ${randomColor.bg} ${randomColor.text}`}
                  >
                    {chat.fullName[0] + chat.fullName[1]}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between gap-3">
                  <div className="flex-1 flex items-center justify-between">
                    <p className="font-semibold text-lg">{chat.fullName}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(chat.lastMessageTime)}
                    </p>
                  </div>
                  <p className="text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
