import { useEffect, useRef, useState } from "react";
import { useChatHub } from "../hooks/useChatHub";
import { useParams } from "react-router-dom";
import { api } from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { closeChat } from "../app/slices/chatSlice";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import "../components/ui/Chat.css";
import { useQuery } from "@tanstack/react-query";

export default function LiveChat() {
  const dispatch = useDispatch();
  const { supplierId, productId, productName, supplierName } = useSelector(
    (state) => state.chat
  );
  // console.log(supplierId, "sss", productId, productName);
  // const [messages, setMessages] = useState([
  //   // { text: "مرحبًا ! ما هو استفسارك بخصوص المنتج " + productName + "؟  ", fromMe: false },
  // ]);

  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const { id } = useParams();

  const [message, setMessage] = useState("");
  // const [chatDetails, setChatDetails] = useState({});
  const { messages, sendMessage } = useChatHub();

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(id, message);
    setMessage("");
  };

  const getChat = async () => {
    try {
      const { data } = await api.get(
        `/conversations/${id}/messages?Page=1&Limit=10`
      );
      // console.log(data.data.items);
      // setChatDetails(data.data);
     

      return data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { data: chatDetails = {} } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => getChat(),
  });
  console.log(chatDetails);

  useEffect(() => {
    getChat();
  }, [id]);

  const handleClose = () => {
    dispatch(closeChat());
    console.log("close");
  };

  return (
    <div className="py-20 flex flex-col gap-10 items-center">
      {/* <div>
        <div className="chatBox flex flex-col gap-2 max-h-96 overflow-auto">
          {messages.map((message) => (
            <div
              key={message.text}
              className="rounded-md bg-gray-200 px-5 py-2 text-sm"
            >
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="px-5 py-2 border border-gray-200 rounded-md"
            placeholder="Enter message"
          />
          <button
            className="px-10 py-2 bg-gray-400 rounded-md hover:bg-gray-500"
            onClick={handleSend}
          >
            SEND
          </button>
        </div>
      </div> */}
      {/* --------------------------------------------- */}
      <div className=" w-full">
        <div className="chat-header">
          <div className="chat-header-content">
            <IoChatbubbleEllipsesOutline className="chat-icon" />
            <h3 className="ar-font-s">{supplierName}</h3>
          </div>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <div ref={chatContainerRef} className="chat-messages h-[50svh] ">
          {messages.map((msg, idx) => {
            // console.log(msg, "msg");
            return (
              <div
                key={idx}
                className={`message ${msg.sender === "me" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="ar-font-m"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="ar-font-s"
          >
            إرسال
          </button>
        </div>

        {/* <div className="p-4 border-t border-gray-200">
        <input
          type="text"
          value={rId}
          onChange={(e) => setRId(e.target.value)}
          placeholder="Enter Receiver ID..."
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div> */}
      </div>
    </div>
  );
}
