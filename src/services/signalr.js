import * as signalR from "@microsoft/signalr";

const token = localStorage.getItem("token");

let connection = null;
localStorage;
export const startConnection = () => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return Promise.resolve(connection);
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://zerobyte.localto.net/hubs/chat", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  return connection
    .start()
    .then(() => {
      console.log("SignalR Connected");
      return connection;
    })
    .catch((err) => {
      console.error("SignalR Connection Error:", err);
    });
};

export const onMessageReceived = (callback) => {
  if (!connection) {
    console.warn("SignalR not connected yet");
    return;
  }

  console.log("onMessageReceived");
  connection.on("ReceiveMessage", callback);
};

export const sendMessage = (message, RId) => {
  console.log(message, RId);
  if (!connection) {
    console.warn("Cannot send message. SignalR not connected.");
    return;
  }

  return connection.invoke("SendMessage", RId, message).catch((err) => {
    console.error("SendMessage Error:", err);
  });
};

export const stopConnection = () => {
  if (connection) {
    connection
      .stop()
      .then(() => {
        console.log("SignalR Disconnected");
      })
      .catch((err) => {
        console.error("Error stopping SignalR:", err);
      });
  }
};
