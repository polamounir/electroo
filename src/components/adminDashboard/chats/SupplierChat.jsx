import { useState, useRef, useEffect } from "react";
import {
  onMessageReceived,
  sendMessage,
  startConnection,
  stopConnection,
} from "../../../services/signalr";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import "../../ui/Chat.css";
import { useDispatch, useSelector } from "react-redux";
import { closeChat } from "../../../app/slices/chatSlice";
import { api } from "../../../api/axiosInstance";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SupplierChat() {
  const { id } = useParams();
  console.log(id, "id");

  const [chatData, setChatData] = useState([]);

  const getChat = async () => {
    // const options = {
    //   method: "GET",
    //   url: "https://ecommerce.zerobytetools.com/api/conversations/65b47cc1-3cc3-4852-8883-08dd83f5f933/messages?page=1&limit=10",
    //   headers: {
    //     Authorization:
    //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIyMzhjZmIyMC1iNzI2LTRiNGYtMjY1MS0wOGRkODMwYWZkZDUiLCJGdWxsTmFtZSI6Itio2YjZhNinINmF2YbZitixIiwiZW1haWwiOiJuYWthbTU0MTc3QGY1dXJsLmNvbSIsIlVzZXJUeXBlIjoiU3VwcGxpZXIiLCJTdXBwbGllcklkIjoiN2VlMmJmZTYtNDdjOS00OWQ5LTlmYTYtNDI2MWIwMDhhOWNjIiwiVmVyaWZpZWRTdXBwbGllciI6IlRydWUiLCJuYmYiOjE3NDU1ODY2NDMsImV4cCI6MTc0NTU4Njk0MywiaWF0IjoxNzQ1NTg2NjQzfQ.ALgCm5ecr2qT7rHoYmCkv4T4gOtQss6GsWV4T3MSdOs",
    //   },
    // };



    try {
      const { data } = await api.get(
        "/conversations/65b47cc1-3cc3-4852-8883-08dd83f5f933/messages?page=1&limit=10"
      );
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChat();
  }, []);
  const dispatch = useDispatch();
  const { supplierId, productId, productName, supplierName } = useSelector(
    (state) => state.chat
  );
  console.log(supplierId, "sss", productId, productName);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  //   useEffect(() => {
  //     const getChats = async () => {
  //       const res = await api.get()
  //     };
  //     getChats();
  //   }, []);
  //   useEffect(() => {
  //     const init = async () => {
  //       await startConnection();
  //       onMessageReceived((id, message) => {
  //         console.log(id, message);
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           { text: message, fromMe: false },
  //         ]);
  //       });
  //     };

  //     init();
  //     return () => {
  //       stopConnection();
  //     };
  //   }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (message.trim()) {
      const res = await sendMessage(
        message,
        "65b47cc1-3cc3-4852-8883-08dd83f5f933"
      );

      console.log("senddd", res);
      setMessages([...messages, { text: message, fromMe: true }]);
      setMessage("");
    }
  };

  const handleClose = () => {
    dispatch(closeChat());
    console.log("close");
  };

  return (
    <div className="">
      <div className="chat-header">
        <div className="chat-header-content">
          <IoChatbubbleEllipsesOutline className="chat-icon" />
          <h3 className="ar-font-s">{supplierName}</h3>
        </div>
        {/* <button className="close-button" onClick={handleClose}>
          ×
        </button> */}
      </div>

      <div ref={chatContainerRef} className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.fromMe ? "user" : "bot"}`}>
            {msg.text}
          </div>
        ))}
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
  );
}
