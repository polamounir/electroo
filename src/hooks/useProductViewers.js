// hooks/useChatHub.js
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

export const useProductViewers = (productId) => {
  const hubConnection = useRef(null);
  const [viewers, setViewers] = useState([]);
  const token = Cookies.get("accessToken") || null;

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://ecommerce.markomedhat.com/hubs/product-view", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("UpdateProductViewCount", (productId, usernames) => {
      setViewers((prevUsers) => {
        const filtered = prevUsers.filter((v) => v.productId !== productId);
        return [...filtered, { productId, users: usernames }];
      });
    });

    connection
      .start()
      .then(() => {
        console.log(productId, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        connection.invoke("ViewProduct", productId);
      })
      .catch((err) => console.error("SignalR Connection Error:", err));

    hubConnection.current = connection;

    return () => {
      connection.stop();
    };
  }, [token]);

  return {
    viewers,
  };
};
