import { useEffect, useState } from "react";
import {
  onMessageReceived,
  sendMessage,
  startConnection,
  stopConnection,
} from "../services/signalr";

export default function LiveChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [rId, setRId] = useState("");

  useEffect(() => {
    const init = async () => {
      await startConnection();
      onMessageReceived((id, message) => {
        console.log(id, message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    };

    init();
    return () => {
      stopConnection();
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const res = await sendMessage(input, rId);
    console.log(res);
    setInput("");
  };

  return (
    <div className="py-20 flex flex-col gap-10 items-center">
      <div className="chatBox flex flex-col gap-2 max-h-96 overflow-auto">
        {messages.map((message, i) => (
          <div key={i} className="rounded-md bg-gray-200 px-5 py-2 text-sm">
            {message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-5 py-2 border border-gray-200 rounded-md"
        />
        <button
          className="px-10 py-2 bg-gray-400 rounded-md hover:bg-gray-500"
          onClick={handleSend}
        >
          SEND
        </button>
      </div>

      <div>
        <input
          type="text"
          className="border"
          onChange={(e) => {
            setRId(e.target.value);
            console.log(rId);
          }}
        />
      </div>
    </div>
  );
}
