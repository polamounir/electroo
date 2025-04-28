import { useEffect, useRef, useState } from "react";
// import { useChatHub } from "../hooks/useChatHub";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { closeChat } from "../../app/slices/chatSlice";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import "./Chat.css";
import { useQuery } from "@tanstack/react-query";
import { useChatHub } from "../../hooks/useChatHub";
import axios from "axios";
import TokenStorageService from "../../services/TokenStorageService";
const token = TokenStorageService.getAccessToken();

export default function ChatPopup() {
  const dispatch = useDispatch();

  const {
    supplierId,
    productId,
    productName,
    supplierName,
    activeChat,
    isMenuOpen,
  } = useSelector((state) => state.chat);
  console.log(supplierId, "sss", productId, productName);
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
    let id = "65b47cc1-3cc3-4852-8883-08dd83f5f933";
    const options = {
      method: "GET",
      url: `https://ecommerce.markomedhat.com/api/conversations/${id}/messages?page=1&limit=20`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);
      return data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { data: chatDetails } = useQuery({
    queryKey: ["chat", productId],
    queryFn: () => getChat(),
  });
  console.log(chatDetails);

  useEffect(() => {
    getChat();
  }, [productId]);

  const handleClose = () => {
    dispatch(closeChat());
    console.log("close");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isMenuOpen]);

  return (
    <div
      className={`${
        activeChat === "popup" || isMenuOpen ? "flex" : "hidden"
      } flex flex-col gap-10 items-center fixed border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg shadow-teal-500 bottom-5 right-5 z-[110] `}
    >
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
          {/* ---------------Old Messages ----------------- */}
          {chatDetails &&
            chatDetails.items &&
            chatDetails.items.map((msg, idx) => {
              console.log(msg, "msg");
              return (
                <div
                  key={idx}
                  className={`message ${msg.isIncoming ? "user" : "bot"} ${
                    msg.messageType === "Product" ? "product-message" : ""
                  }`}
                >
                  {msg.messageType === "Product" ? (
                    <div className="">
                      <Link
                        to={`/product/${msg.payload.productId}`}
                        className="flex flex-col items-center gap-2"
                      >
                        <img
                          src={
                            msg?.payload?.productImage ||
                            "https://fakeimg.pl/200x200"
                          }
                          alt={msg.payload.productTitel}
                          className="w-20 h-20 rounded-full"
                        />
                        <h3 className="text-xs">{msg.payload.productTitel}</h3>
                      </Link>
                    </div>
                  ) : (
                    msg.payload.text
                  )}
                </div>
              );
            })}

          {/* ---------------New Messages ----------------- */}
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
            className="text-sm"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
