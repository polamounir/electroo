import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  closeChat,
  startConversationThunk,
  getChatThunk,
} from "../../app/slices/chatSlice";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import "./Chat.css";
import { useChatHub } from "../../hooks/useChatHub";
import { closeDropdownChatPopup } from "../../app/slices/userChatsSlicce";

export default function ChatPopup() {
  const dispatch = useDispatch();
  const {
    supplierName,
    activeChat,
    isMenuOpen,
    conversationId,
    loading,
    error: chatError,
    chat: chatDetails,
  } = useSelector((state) => state.chat);

  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const { messages, sendMessage } = useChatHub();

  const handleClose = () => {
    dispatch(closeChat());
    dispatch(closeDropdownChatPopup());
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isMenuOpen, chatDetails]);

  const handleSend = () => {
    if (!message.trim() || !conversationId) return;
    sendMessage(conversationId, message);
    setMessage("");
  };

  // Initialize conversation if needed
  useEffect(() => {
    if (!conversationId) {
      dispatch(startConversationThunk());
    }
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (conversationId) {
      dispatch(getChatThunk(conversationId));
    }
  }, []);

  const formatDate = (dateString) => {
    const date =
      dateString.endsWith("Z") || dateString.includes("+")
        ? new Date(dateString)
        : new Date(dateString + "Z");

    const now = new Date();
    const diffTime = now - date;
    // const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // if (diffDays >= 1) {
    //   return date.toLocaleDateString("ar-EG", {
    //     year: "numeric",
    //     month: "short",
    //     day: "numeric",
    //   });
    // } else {
    //   return date.toLocaleTimeString("ar-EG", {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //   });
    // }
  };

  if (chatError) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500">
        Error: {chatError.detail || "Failed to load chat"}
      </div>
    );
  }

  return (
    <div
      className={`${
        activeChat === "popup" || isMenuOpen ? "flex" : "hidden"
      } flex flex-col gap-10 items-center fixed border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg shadow-teal-500 bottom-5 right-5 z-[110] max-w-sm min-w-sm bg-white`}
    >
      <div className="w-full">
        <div className="chat-header">
          <div className="chat-header-content">
            <IoChatbubbleEllipsesOutline className="chat-icon" />
            <h3 className="ar-font-s">{supplierName}</h3>
          </div>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <div
          ref={chatContainerRef}
          className="chat-messages h-[50svh] scrolling"
        >
          {loading ? (
            <div className="flex items-center justify-center p-4">
              Loading...
            </div>
          ) : (
            <>
              {/* Old Messages */}
              {chatDetails?.items?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.isIncoming ? "bot" : "user"} ${
                    msg.messageType === "Product" ? "product-message" : ""
                  }`}
                >
                  {msg.messageType === "Product" ? (
                    <div>
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
                    <div className="pb-1 relative min-w-20">
                      <p className="ps-14">{msg.payload.text}</p>
                      <span className="absolute -bottom-1 start-0 text-[12px] text-gray-300">
                        <span>{formatDate(msg.sentOn)}</span>
                        {/* <span>{msg.readOn}</span> */}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* New Messages */}
              {messages.map((msg, idx) => {
                console.log("msg", msg);
                return (
                  <div
                    key={idx}
                    className={`message chating ${
                      msg.sender === "me" ? "user" : "bot"
                    } relative min-w-20 pb-1`}
                  >
                    <p className="ps-14">{msg.text}</p>
                    <p className="absolute bottom-1 start-2 text-[12px] text-gray-300">
                      <span>{msg.time}</span>
                      {/* <span>{msg.readOn}</span> */}
                    </p>
                  </div>
                );
              })}
            </>
          )}
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
            disabled={!message.trim() || !conversationId || loading}
            className="text-sm"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
