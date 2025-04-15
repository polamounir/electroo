import { useState, useRef, useEffect } from "react";

export default function Contactus() {
  const [messages, setMessages] = useState([
    { text: "مرحبًا! كيف يمكنني مساعدتك اليوم؟", fromMe: false },
  ]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, fromMe: true }]);
      setMessage("");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className=" w-full flex items-center justify-center">
      <div className="w-full min-h-[75dvh] h-full bg-white shadow-lg rounded-lg flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        {/* <div className="flex items-center p-4 border-b border-gray-400 bg-teal-500 text-white">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4017/4017991.png"
            alt="Agent"
            className="rounded-full w-10 h-10 ml-3"
          />
          <div>
            <div className="font-semibold">خدمة العملاء</div>
            <div className="text-sm text-white/80">متصل الآن</div>
          </div>
        </div> */}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 text-right">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  msg.fromMe
                    ? "bg-teal-500 text-white rounded-bl-none"
                    : "bg-gray-200 text-gray-800 rounded-br-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-400 bg-white flex gap-2 items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="flex-1 px-4 py-2 border border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 text-right"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-teal-500 text-white px-5 py-2 rounded-full hover:bg-teal-600 transition"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
