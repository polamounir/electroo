import { useState, useRef, useEffect } from "react";
import {
  onMessageReceived,
  sendMessage,
  startConnection,
  stopConnection,
} from "../../services/signalr";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import { closeChat } from "../../app/slices/chatSlice";

export default function ChatPopup() {
  const dispatch = useDispatch();
  const { supplierId, productId, productName , supplierName } = useSelector((state) => state.chat);
  console.log(supplierId,"sss", productId, productName);
  const [messages, setMessages] = useState([
    { text: "مرحبًا ! ما هو استفسارك بخصوص المنتج " + productName + "؟  ", fromMe: false },
  ]);
  const [message, setMessage] = useState("");
  
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      console.log("init CONVERSATION");
      await startConnection();
      onMessageReceived((id, message) => {
        console.log(id, message);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, fromMe: false },
        ]);
      });
    };

    init();
    return () => {
      stopConnection();
    };
  }, []);

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

      console.log("senddd",res);
      setMessages([...messages, { text: message, fromMe: true }]);
      setMessage("");
    }
  };

  const handleClose = () => {
    dispatch(closeChat());
    console.log("close");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-content">
          <IoChatbubbleEllipsesOutline className="chat-icon" />
          <h3 className="ar-font-s">{supplierName}</h3>
        </div>
        <button className="close-button" onClick={handleClose}>
          ×
        </button>
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
