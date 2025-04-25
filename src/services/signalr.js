import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

const token = Cookies.get("accessToken");


let connection = null;
let connectionPromise = null;

export const startConnection = () => {
  console.log("startConnection");
  console.log("token", token);
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    console.log("connection already connected");
    return Promise.resolve(connection);
  }

  if (connectionPromise) {
    console.log("connection already in progress");
    return connectionPromise;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://ecommerce.markomedhat.com/hubs/chat", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  console.log("Creating new SignalR connection");

  connectionPromise = connection
    .start()
    .then(() => {
      console.log("SignalR Connected");
      return connection;
    })
    .catch((err) => {
      console.error("SignalR Connection Error:", err);
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
};

export const onMessageReceived = (callback) => {
  if (!connection) {
    console.warn("SignalR not connected yet");
    return;
  }

  console.log("onMessageReceived");
  connection.on("ReceiveMessage", callback);
};

export const sendMessage = async (message, conversationId) => {
  console.log("Attempting to send message:", message, conversationId);

  try {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.log("Connection not ready, attempting to connect first");
      await startConnection();
    }

    console.log("Sending message with connection state:", connection.state);
    return await connection.invoke({
      conversationId: conversationId,
      message: message,
    });
  } catch (err) {
    console.error("SendMessage Error:", err);
    throw err;
  }
};

export const stopConnection = () => {
  if (connection) {
    connection
      .stop()
      .then(() => {
        console.log("SignalR Disconnected");
        connectionPromise = null;
      })
      .catch((err) => {
        console.error("Error stopping SignalR:", err);
      });
  }
};

export const getConnectionState = () => {
  if (!connection) return "Not initialized";
  return connection.state;
};
