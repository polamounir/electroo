import { useEffect, useState } from "react";
import { api } from "../api/axiosInstance";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export default function LiveChats() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const fetchChats = async () => {
    try {
      const { data } = await api.get("/conversations?page=1&limit=10");
      console.log(data);
      setItems(data.data.items);
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        toast.error("يجب عليك تسجيل الدخول");
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="p-6 min-h-[75svh]">
      <h1 className="text-2xl font-bold mb-6">المحادثات</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((chat) => (
          <Link
            to={`/live-chat/${chat.id}`}
            key={chat.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer p-5 px-10"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-lg">{chat.fullName}</p>
              {/* <span className="text-sm text-gray-500">ID: {chat.id}</span> */}
            </div>
            <p className="text-gray-600 truncate">{chat.lastMessage}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
