import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { RiRobot2Line } from "react-icons/ri";
import "./Chat.css";
import { useSelector, useDispatch } from "react-redux";
import { closeChat } from "../../app/slices/chatSlice";

const ChatBot = () => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAIMessage, setCurrentAIMessage] = useState("");
  const [isMessageComplete, setIsMessageComplete] = useState(false);
  const connection = useRef(null);
  const messagesEndRef = useRef(null);
  const messageTimeoutRef = useRef(null);
  const sessionId = useSelector((state) => state.chatbot.sessionId);

  useEffect(() => {
    console.log("elId:", sessionId);
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentAIMessage]);

  useEffect(() => {

    connection.current = new HubConnectionBuilder()
      .withUrl("https://ecommerce.markomedhat.com/hubs/aibot")
      .withAutomaticReconnect()
      .build();

  
    connection.current
      .start()
      .then(() => {
        console.log("SignalR Connected");
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));


    connection.current.on("ReceiveAIMessageStream", (st, message) => {
      setCurrentAIMessage((prev) => prev + message);

     
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }

      messageTimeoutRef.current = setTimeout(() => {
        setIsMessageComplete(true);
        setIsLoading(false);
      }, 1000);
    });

   
    return () => {
      if (connection.current) {
        connection.current.stop();
      }
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setCurrentAIMessage("");
    setIsMessageComplete(false);

    try {
      // Send message to AI through SignalR
      await connection.current.invoke(
        "SendMessageToAI",
        sessionId,
        inputMessage
      );
    } catch (err) {
      console.error("Error sending message: ", err);
      setMessages((prev) => [
        ...prev,
        {
          text: "عذراً، حدث خطأ في إرسال رسالتك.",
          sender: "system",
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsLoading(false);
      setIsMessageComplete(true);
    }
  };

 
  useEffect(() => {
    if (currentAIMessage && isMessageComplete) {
      setMessages((prev) => [
        ...prev,
        {
          text: currentAIMessage,
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
      setCurrentAIMessage("");
    }
  }, [currentAIMessage, isMessageComplete]);

  const handleClose = () => {
    dispatch(closeChat());
  };

  
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-content">
          <RiRobot2Line className="chat-icon" />
          <h3 className="ar-font-s">المساعد الذكي</h3>
        </div>
        <button className="close-button" onClick={handleClose}>
          ×
        </button>
      </div>
      <div className="chat-messages scrolling">
        {messages.length === 0 && !isLoading && (
          <div className="welcome-message">
            <h3 className="flex flex-row-reverse items-center gap-2 mb-1 text-xs">
              <RiRobot2Line className="" />
              المساعد الذكي
            </h3>
            <p className="">مرحباً! كيف يمكنني مساعدتك اليوم؟</p>
          </div>
        )}
        {messages.map((message, index) =>
          message.sender === "bot" ? (
            <div className="welcome-message">
              <h3 className="flex flex-row-reverse items-center gap-2 mb-1 text-xs">
                <RiRobot2Line className="" />
                المساعد الذكي
              </h3>
              <p className="">{message.text}</p>
            </div>
          ) : (
            <div
              key={index}
              className={`message user`}
            >
              {message.text}
            </div>
          )
        )}
        {isLoading && currentAIMessage && (
          <div className="message bot">
            {currentAIMessage}
            <span className="typing-indicator">...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="اكتب رسالتك هنا..."
          disabled={isLoading}
          className="ar-font-m"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="text-sm "
        >
          إرسال
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
