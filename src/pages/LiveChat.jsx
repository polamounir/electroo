import { useEffect, useState } from "react";
import { useChatHub } from "../hooks/useChatHub";
import { useParams } from "react-router-dom";
import { api } from "../api/axiosInstance";

export default function LiveChat() {
  const { id } = useParams();

  const [message, setMessage] = useState("");
  const { messages, sendMessage } = useChatHub();

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(id, message);
    setMessage("");
  };

  const getChat = async () => {
    try {
      const { data } = await api.get(
        `/conversations/${id}/messages?page=1&limit=10`
      );
      console.log(data.data.items);
      return data.data.items;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChat();
  }, [id]);

  return (
    <div className="py-20 flex flex-col gap-10 items-center">
      <div className="chatBox flex flex-col gap-2 max-h-96 overflow-auto">
        {messages.map((message) => (
          <div
            key={message.text}
            className="rounded-md bg-gray-200 px-5 py-2 text-sm"
          >
            <strong>{message.sender}:</strong> {message.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="px-5 py-2 border border-gray-200 rounded-md"
          placeholder="Enter message"
        />
        <button
          className="px-10 py-2 bg-gray-400 rounded-md hover:bg-gray-500"
          onClick={handleSend}
        >
          SEND
        </button>
      </div>
    </div>
  );
}
