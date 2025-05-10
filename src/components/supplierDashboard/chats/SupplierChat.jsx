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
  const dispatch = useDispatch();
  console.log(id, "id");

  const [chatData, setChatData] = useState([]);

  const getChat = async () => {
    try {
      const { data } = await api.get(
        "/conversations/65b47cc1-3cc3-4852-8883-08dd83f5f933/messages?page=1&limit=100"
      );
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChat();
  }, []);
  const { supplierId, productId, productName, supplierName } = useSelector(
    (state) => state.chat
  );
  console.log(supplierId, "sss", productId, productName);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);



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

      <div ref={chatContainerRef} className="chat-messages scrolling">
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
    </div>
  );
}
