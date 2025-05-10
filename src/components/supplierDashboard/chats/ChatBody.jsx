import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { useChatHub } from "../../../hooks/useChatHub";
import { useDispatch, useSelector } from "react-redux";
import "./supplierChat.css";
import { updateLastMessage } from "../../../app/slices/chatSlice";

const ChatMessage = memo(({ msg, formatDate }) => {
  if (msg.messageType === "Product") {
    return (
      <div
        className={`message ${msg.isIncoming ? "bot" : "user"} product-message`}
      >
        <Link
          to={`/product/${msg.payload.productId}`}
          className="flex flex-col items-center gap-2"
        >
          <img
            src={msg?.payload?.productImage || "https://fakeimg.pl/200x200"}
            alt={msg.payload.productTitel}
            className="w-20 h-20 rounded-full"
          />
          <h3 className="text-xs">{msg.payload.productTitel}</h3>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-1 relative min-w-20">
      <p className="ps-14">{msg.payload.text}</p>
      <span className="absolute -bottom-1 start-0 text-[12px] text-gray-300">
        <span>{formatDate(msg.sentOn)}</span>
      </span>
    </div>
  );
});

const NewChatMessage = memo(({ msg }) => (
  <div
    className={`message chating ${
      msg.sender === "me" ? "user" : "bot"
    } relative min-w-20 pb-1`}
  >
    <p className="ps-14">{msg.text}</p>
    <p className="absolute bottom-1 start-2 text-[12px] text-gray-300">
      <span>{msg.time}</span>
    </p>
  </div>
));

const ChatInput = memo(({ onSend }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    onSend(inputValue);
    setInputValue("");
  }, [inputValue, onSend]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="chat-input">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="اكتب رسالتك..."
        className="ar-font-m"
      />
      <button
        onClick={handleSend}
        disabled={!inputValue.trim()}
        className="text-sm"
      >
        إرسال
      </button>
    </div>
  );
});

export default function ChatBody() {
  const dispatch = useDispatch();
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  const {
    supplierId,
    productId,
    productName,
    supplierName,
    conversationId,
    activeConversation,
  } = useSelector((state) => state.chat);

  const { messages, sendMessage } = useChatHub();

  const handleSend = useCallback(
    (messageText) => {
      dispatch(updateLastMessage(messageText));
      sendMessage(conversationId, messageText);
    },
    [conversationId, dispatch, sendMessage]
  );

  // Format date function
  const formatDate = useCallback((dateString) => {
    const date =
      dateString.endsWith("Z") || dateString.includes("+")
        ? new Date(dateString)
        : new Date(dateString + "Z");

    return date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Get chat data
  const getChat = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/conversations/${conversationId}/messages?Page=1&Limit=100`
      );
      return data.data;
    } catch (error) {
      console.error(error);
      return { items: [] };
    }
  }, [conversationId]);

  const { data: chatDetails = { items: [] } } = useQuery({
    queryKey: ["chat", conversationId],
    queryFn: getChat,
    enabled: !!conversationId,
  });

  // Scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatDetails?.items?.length]);

  if (!conversationId) {
    return (
      <div className="col-span-8 p-5 ">
        <div className="flex flex-col items-center justify-center h-[65svh] ">
          <p className="text-gray-500">اختار المحادثة للبدء</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-8 p-5">
      <div className="h-[65svh]">
        <div className="border-b border-gray-300 py-2">
          <div className="flex items-center gap-5">
            <div>
              <img
                src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                alt="chat_image"
                className="rounded-2xl h-15"
              />
            </div>
            <h2 className="text-3xl font-bold">
              {activeConversation.fullName || "Name"}
            </h2>
          </div>
        </div>

        <div className="h-[55svh]">
          <div className="w-full">
            <div
              ref={chatContainerRef}
              className="chat-messages h-[50svh] scrolling"
            >
              {/* Historical Messages */}
              {chatDetails?.items?.map((msg, idx) => (
                <div
                  key={`hist-${idx}`}
                  className={`message ${msg.isIncoming ? "bot" : "user"}`}
                >
                  <ChatMessage msg={msg} formatDate={formatDate} />
                </div>
              ))}

              {/* New Messages */}
              {messages.map((msg, idx) => (
                <NewChatMessage key={`new-${idx}`} msg={msg} />
              ))}

              <div ref={chatEndRef} />
            </div>

            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}
