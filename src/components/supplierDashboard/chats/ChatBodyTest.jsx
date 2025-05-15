import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { useChatHub } from "../../../hooks/useChatHub";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import { setConversationId, updateLastMessage } from "../../../app/slices/chatSlice";

const groupMessagesByDate = (messages = []) => {
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.sentOn) - new Date(b.sentOn)
  );

  return sortedMessages.reduce((acc, msg) => {
    const messageDate = new Date(msg.sentOn);
    const today = new Date();
    
    let dateKey;
    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      dateKey = "اليوم";
    } else {
      dateKey = messageDate.toLocaleDateString("ar-EG", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});
};

const isRTL = (text) => /[\u0600-\u06FF]/.test(text);

const ChatMessage = memo(({ msg, formatDate }) => {
  if (msg.messageType === "Product") {
    return (
      <div className={`message ${msg.isIncoming ? "bot" : "user"} product-message`}>
        <Link to={`/product/${msg.payload.productId}`}>
          <img
            src={msg?.payload?.productImage || "https://fakeimg.pl/200x200"}
            alt={msg.payload.productTitel}
            className="w-20 h-20"
          />
          <h3>{msg.payload.productTitel}</h3>
        </Link>
      </div>
    );
  }

  return (
    <div className={`message ${msg.isIncoming ? "bot" : "user"}`} dir={isRTL(msg.payload.text) ? "rtl" : "ltr"}>
      <p>{msg.payload.text}</p>
      <div className="message-time">{formatDate(msg.sentOn)}</div>
    </div>
  );
});

const NewChatMessage = memo(({ msg }) => (
  <div className={`message ${msg.sender === "me" ? "user" : "bot"}`} dir={isRTL(msg.text) ? "rtl" : "ltr"}>
    <p>{msg.text}</p>
    <div className="message-time">{msg.time}</div>
  </div>
));

const ChatInput = memo(({ onSend }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = useCallback((e) => setInputValue(e.target.value), []);
  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    onSend(inputValue);
    setInputValue("");
  }, [inputValue, onSend]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") handleSend();
  }, [handleSend]);

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
      <button onClick={handleSend} disabled={!inputValue.trim()}>
        إرسال
      </button>
    </div>
  );
});

export default function ChatBody() {
  const dispatch = useDispatch();
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const initialScrollDone = useRef(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [newMessages, setNewMessages] = useState([]);
  const [latestMessage, setLatestMessage] = useState(null);

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
      const newMessage = {
        text: messageText,
        sender: "me",
        time: new Date().toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setNewMessages(prev => [...prev, newMessage]);
    },
    [conversationId, dispatch, sendMessage]
  );

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const fetchMessages = async ({ pageParam = 1 }) => {
    console.log(`Fetching messages page ${pageParam}`);
    try {
      const { data } = await api.get(
        `/conversations/${conversationId}/messages?Page=${pageParam}&Limit=20&OrderBy=sentOn`
      );
      
      const { page, limit, totalItems, items } = data.data;
      
      if (items.length === 0 && page > 1) {
        return {
          items: [],
          nextPage: undefined,
          totalItems,
          currentPage: page,
          hasMore: false
        };
      }

      if (page === 1 && items.length > 0) {
        const sortedItems = [...items].sort((a, b) => new Date(b.sentOn) - new Date(a.sentOn));
        setLatestMessage(sortedItems[0]);
      }

      const hasNextPage = items.length > 0 && page * limit < totalItems;
      console.log(`Fetched ${items.length} messages for page ${page}. Has next page: ${hasNextPage}`);

      return {
        items,
        nextPage: hasNextPage ? page + 1 : undefined,
        totalItems,
        currentPage: page,
        hasMore: hasNextPage
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["chat", conversationId],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!conversationId,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
  });

  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container || isFetchingNextPage || !hasNextPage || isFetching) return;

    const scrollThreshold = 100;
    const { scrollTop } = container;
    
    if (scrollTop <= scrollThreshold && hasNextPage) {
      console.log('Loading more messages...');
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetching]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [newMessages]);

  useEffect(() => {
    if (
      chatEndRef.current && 
      data?.pages?.length == 1 && 
      !isFetching && 
      !initialScrollDone.current
    ) {
      setTimeout(() => {
        chatEndRef.current.scrollIntoView();
        initialScrollDone.current = true;
      }, 100);
    }
  }, [data?.pages, isFetching]);

  if (!conversationId) {
    return (
      <div className="col-span-8 p-5">
        <div className="flex flex-col items-center justify-center h-[65svh] text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3588/3588294.png"
            alt="Start Chat"
            className="w-24 h-24 mb-4"
          />
          <p className="text-gray-600 text-lg mb-2">ابدأ المحادثة مع المورد</p>
          <button
            onClick={() => dispatch(setConversationId("d7c2e69a-8f36-48a7-a731-b07fa39c2ae6"))}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            ابدأ الآن
          </button>
        </div>
      </div>
    );
  }
  console.log(latestMessage);

  const allMessages = data?.pages
    .flatMap(page => page.items)
    .sort((a, b) => new Date(a.sentOn) - new Date(b.sentOn)) || [];
  
  const groupedMessages = groupMessagesByDate(allMessages);

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="col-span-8 p-5">
      <div className="whatsapp-container">
        <div className="border-b border-gray-300 py-2">
          <div className="flex items-center gap-5">
            <img
              src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              alt="chat"
              className="rounded-2xl h-15"
            />
            <h2 className="text-2xl font-bold">
              {activeConversation?.fullName || "Name"}
            </h2>
          </div>
        </div>

        <div className="chat-messages" ref={chatContainerRef}>
          {isFetchingNextPage && <LoadingIndicator />}

          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="date-separator">
                <span>{date}</span>
              </div>
              {msgs.map((msg, i) => (
                <ChatMessage key={`${date}-${i}`} msg={msg} formatDate={formatDate} />
              ))}
            </div>
          ))}

          {messages.length > 0 && (
            <div>
{(() => {
  const sentDate = new Date(latestMessage.sentOn);
  const today = new Date();

  const isSameDate =
    sentDate.getFullYear() === today.getFullYear() &&
    sentDate.getMonth() === today.getMonth() &&
    sentDate.getDate() === today.getDate();

    console.log(isSameDate , latestMessage.sentOn , today);
  return !isSameDate && (
    <div className="date-separator">
      <span>اليوم</span>
    </div>
  ) 
})()}
              {messages.map((msg, idx) => (
                <NewChatMessage key={`new-${idx}`} msg={msg} />
              ))}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
