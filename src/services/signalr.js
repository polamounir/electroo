import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

const token = Cookies.get("accessToken");

let connection = null;
let connectionPromise = null;

export const startConnection = () => {
  console.log("startConnection");

  // If already connected, return the existing connection
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    console.log("connection already connected");
    return Promise.resolve(connection);
  }

  // If connection is in progress, return the existing promise
  if (connectionPromise) {
    console.log("connection already in progress");
    return connectionPromise;
  }

  // Create a new connection
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://zerobyte.localto.net/hubs/chat", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  console.log("Creating new SignalR connection");

  // Store the connection promise
  connectionPromise = connection
    .start()
    .then(() => {
      console.log("SignalR Connected");
      return connection;
    })
    .catch((err) => {
      console.error("SignalR Connection Error:", err);
      connectionPromise = null; // Reset the promise so we can try again
      throw err;
    });

  return connectionPromise;
};
// ---------------------------------------
export const onMessageReceived = (callback) => {
  if (!connection) {
    console.warn("SignalR not connected yet");
    return;
  }

  console.log("onMessageReceived");
  connection.on("ReceiveMessage", callback);
};
// ---------------------------------
export const sendMessage = async (message, RId) => {
  console.log("Attempting to send message:", message, RId);

  // Ensure connection is established before sending
  try {
    // If not connected, try to connect first
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.log("Connection not ready, attempting to connect first");
      await startConnection();
    }

    // Now we should be connected, send the message
    console.log("Sending message with connection state:", connection.state);
    return await connection.invoke("SendMessage", RId, message);
  } catch (err) {
    console.error("SendMessage Error:", err);
    throw err; // Re-throw to allow caller to handle the error
  }
};
// ---------------------------------
export const stopConnection = () => {
  if (connection) {
    connection
      .stop()
      .then(() => {
        console.log("SignalR Disconnected");
        connectionPromise = null; // Reset the promise
      })
      .catch((err) => {
        console.error("Error stopping SignalR:", err);
      });
  }
};

// Helper function to check connection state
export const getConnectionState = () => {
  if (!connection) return "Not initialized";
  return connection.state;
};
