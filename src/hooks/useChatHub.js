// hooks/useChatHub.js
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

export const useChatHub = () => {
  const hubConnection = useRef(null);
  const [messages, setMessages] = useState([]);
  const token = Cookies.get("accessToken");
  
  const getTimeNow = () => {
    const date = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      // second: "2-digit",
      hour12: true,
    };
    console.log("now", date.toLocaleTimeString("ar-EG", options));
    const now = date.toLocaleTimeString("ar-EG", options);
    return now;
  };

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://ecommerce.markomedhat.com/hubs/chat", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveMessage", (model) => {
      console.log("Received message model:", model.payload.text);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "you", text: model.payload.text },
      ]);
    });

    connection
      .start()
      .catch((err) => console.error("Error starting connection:", err));

    hubConnection.current = connection;

    return () => {
      connection.stop();
    };
  }, [token]);

  const sendMessage = (conversationId, message) => {
    if (!hubConnection.current) return;

    hubConnection.current
      .invoke("SendMessage", {
        conversationId,
        message,
      })
      .catch((err) => console.error("Error sending message:", err));

    setMessages((prev) => [...prev, { sender: "me", text: message  , time: getTimeNow()}]);
  };

  return {
    messages,
    sendMessage,
  };
};
