import { useEffect, useState, useCallback, useMemo } from "react";
import { api } from "../api/axiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getChatThunk, openChatingPopup } from "../app/slices/chatSlice";
import ChatPopup from "../components/ui/ChatPopup";
import React from "react";

const bgColors = [
  { bg: "bg-red-500", text: "text-white" },
  { bg: "bg-sky-400", text: "text-white" },
  { bg: "bg-indigo-600", text: "text-white" },
  { bg: "bg-teal-500", text: "text-white" },
];

const useColorMap = (items) => {
  return useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
      const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
      map.set(item.id, randomColor);
    });
    return map;
  }, [items]);
};

const ChatItem = React.memo(({ chat, onOpen, color }) => (
  <div
    onClick={() => onOpen(chat)}
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-5 px-5 cursor-pointer"
  >
    <div className="flex items-start gap-5">
      <div>
        <span
          className={`text-gray-500 bg-gray-200 rounded-full w-15 h-15 flex items-center justify-center text-2xl font-bold ${color.bg} ${color.text}`}
        >
          {chat.fullName.slice(0, 2)}
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
));

function formatDate(dateString) {
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
}

export default function LiveChats() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/conversations?page=1&limit=20");
      setItems(data.data.items);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error("يجب عليك تسجيل الدخول");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const openChatPopup = useCallback(
    (chat) => {
      dispatch(openChatingPopup(chat));
      dispatch(getChatThunk(chat.id));
    },
    [dispatch]
  );

  const colorMap = useColorMap(items);

  return (
    <div className="p-6 min-h-[70svh]">
      <ChatPopup />
      <h1 className="text-2xl font-bold mb-6">المحادثات</h1>
      {items.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">لا يوجد محادثات حاليا</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              onOpen={openChatPopup}
              color={colorMap.get(chat.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
