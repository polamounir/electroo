import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { api } from "../../../api/axiosInstance";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import {
  setAllChats,
  setConversationId,
  setFilterdChats,
} from "../../../app/slices/chatSlice";

import { useQuery } from "@tanstack/react-query";
import { useChatHub } from "../../../hooks/useChatHub";

export default function ChatsMenu() {
  const dispatch = useDispatch();
  const { messages } = useChatHub();

  const { allChats, conversationId, filterdChats } = useSelector(
    (state) => state.chat
  );

  // Fetch chat conversations
  const fetchChats = async () => {
    try {
      const { data } = await api.get("/conversations?page=1&limit=20");
      console.log(data.data.items);

      dispatch(setAllChats(data.data.items));
      dispatch(setFilterdChats(data.data.items));
      return data.data.items;
    } catch (error) {
      console.log(error);
    }
  };

  // React Query hook
  // const {
  //   data: items = [],
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["userChats"],
  //   queryFn: fetchChats,
  //   staleTime: 1000 * 60 * 10,
  //   cacheTime: 1000 * 60 * 30,
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  //   refetchInterval: false,
  // });
  useEffect(() => {
    fetchChats();
  }, [messages]);

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

  const handelSearch = (name) => {
    if (name) {
      const filtered = allChats.filter((chat) =>
        chat.fullName.toLowerCase().includes(name.toLowerCase())
      );
      dispatch(setFilterdChats(filtered));
    } else {
      dispatch(setFilterdChats(allChats));
    }
    console.log(filterdChats);
  };

  return (
    <div className="col-span-4 bg-white lg:min-h-[55svh]">
      <div>
        <div className="p-5">
          <div className="rounded-full h-12 relative overflow-hidden">
            <input
              type="text"
              placeholder="أبحث..."
              onChange={(e) => handelSearch(e.target.value)}
              className="bg-gray-100 w-full h-full px-5 pe-15 text-lg focus:bg-gray-50 border border-gray-200 rounded-full"
            />
            <span className="absolute top-0 bottom-0 end-0 flex justify-center items-center px-5 text-2xl">
              <IoSearchOutline />
            </span>
          </div>
        </div>
        <div className="hidden overflow-auto overflow-y-auto scrolling  md:h-[60svh] p-5 lg:flex flex-col gap-2">
          {[...Array(1)].map((_, i) => (
            <React.Fragment key={i}>
              {filterdChats?.map((chat) => (
                <div
                  key={`${chat.id}-${i}`}
                  className={` rounded-lg p-2 hover:bg-black/10 duration-300 ${
                    conversationId === chat.id
                      ? "bg-teal-100 shadow-lg"
                      : "bg-gray-50"
                  }`}
                >
                  <div
                    className="w-full duration-200 cursor-pointer flex-col items-center"
                    onClick={() => {
                      console.log(chat.id);
                      dispatch(setConversationId(chat.id));
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-lg">{chat.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(chat.lastMessageTime)}
                      </p>
                    </div>
                    <p className="text-gray-600 truncate  text-start ">
                      {chat.lastMessage || "''جديد''"}
                    </p>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="lg:hidden overflow-auto overflow-y-auto scrolling  h-[20svh] p-5 flex flex-col gap-2 mb-5">
          {[...Array(1)].map((_, i) => (
            <React.Fragment key={i}>
              {filterdChats?.map((chat) => (
                <div
                  key={`${chat.id}-${i}`}
                  className={` rounded-lg p-2 hover:bg-black/10 duration-300 ${
                    conversationId === chat.id
                      ? "bg-teal-100 shadow-lg"
                      : "bg-gray-50"
                  }`}
                >
                  <div
                    className="w-full duration-200 cursor-pointer flex-col items-center"
                    onClick={() => {
                      console.log(chat.id);
                      dispatch(setConversationId(chat.id));
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-lg">{chat.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(chat.lastMessageTime)}
                      </p>
                    </div>
                    <p className="text-gray-600 truncate  text-start ">
                      {chat.lastMessage || "''جديد''"}
                    </p>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
