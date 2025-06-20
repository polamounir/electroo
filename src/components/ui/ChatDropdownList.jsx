import { useQuery } from "@tanstack/react-query";
import { getChatThunk, openChatingPopup } from "../../app/slices/chatSlice";
import { toast } from "sonner";
import { api } from "../../api/axiosInstance";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { openDropdownChatPopup } from "../../app/slices/userChatsSlicce";

export default function ChatDropdownList({ isPopupOpen }) {
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
    queryKey: ["userChats"],
    queryFn: fetchChats,
    enabled: isPopupOpen,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const bgColors = [
    { bg: "bg-teal-500", text: "text-white" },
  ];

  const colorMap = useMemo(() => {
    const map = new Map();
    items.forEach((chat) => {
      if (!map.has(chat.id)) {
        const color = bgColors[Math.floor(Math.random() * bgColors.length)];
        map.set(chat.id, color);
      }
    });
    return map;
  }, [items]);

  const openChatPopup = useCallback(
    (chat) => {
      dispatch(openChatingPopup(chat));
      dispatch(getChatThunk(chat.id));
      dispatch(openDropdownChatPopup());
    },
    [dispatch]
  );

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
    <div className="absolute end-0 top-full w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">المحادثات</h3>
        <span className="text-sm text-gray-500">
          {items?.length} {items.length === 1 ? "محادثة" : "محادثات"}
        </span>
      </div>

      {isLoading && (
        <div className="text-center py-5 text-gray-500">
          جاري تحميل المحادثات...
        </div>
      )}

      {isError && (
        <div className="text-center py-5 text-red-500">
          حصل خطأ أثناء تحميل المحادثات
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="text-center py-5 text-gray-500">
          لا يوجد محادثات حاليًا
        </div>
      )}

      {items.length > 0 && (
        <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
          {items.map((chat) => {
            const color = colorMap.get(chat.id);
            const initials =
              chat.fullName
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2) ?? "؟";

            return (
              <div
                key={chat.id}
                onClick={() => openChatPopup(chat)}
                className="flex items-start py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${color.bg} ${color.text} font-bold me-2`}
                >
                  {initials}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {chat.fullName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(chat.lastMessageTime)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage || "لا توجد رسائل بعد"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
