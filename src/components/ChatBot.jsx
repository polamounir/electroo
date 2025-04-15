import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { RiRobot2Line } from 'react-icons/ri';
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentAIMessage, setCurrentAIMessage] = useState('');
    const [isMessageComplete, setIsMessageComplete] = useState(false);
    const connection = useRef(null);
    const messagesEndRef = useRef(null);
    const messageTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, currentAIMessage]);

    useEffect(() => {
        // Initialize SignalR connection
        connection.current = new HubConnectionBuilder()
            .withUrl('https://ecommerce.zerobytetools.com/hubs/aibot')
            .withAutomaticReconnect()
            .build();

        // Start the connection
        connection.current.start()
            .then(() => {
                console.log('SignalR Connected');
            })
            .catch(err => console.error('SignalR Connection Error: ', err));

        // Handle incoming AI messages
        connection.current.on('ReceiveAIMessageStream', (st, message) => {
            setCurrentAIMessage(prev => prev + message);

            // Reset the timeout on each message
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }

            // Set a timeout to detect when the message is complete
            // If no new characters arrive for 1 second, consider the message complete
            messageTimeoutRef.current = setTimeout(() => {
                setIsMessageComplete(true);
                setIsLoading(false);
            }, 1000);
        });

        // Cleanup on component unmount
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
            sender: 'user',
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setCurrentAIMessage('');
        setIsMessageComplete(false);

        try {
            // Send message to AI through SignalR
            await connection.current.invoke('SendMessageToAI', 'user1', inputMessage);
        } catch (err) {
            console.error('Error sending message: ', err);
            setMessages(prev => [...prev, {
                text: 'عذراً، حدث خطأ في إرسال رسالتك.',
                sender: 'system',
                timestamp: new Date().toISOString()
            }]);
            setIsLoading(false);
            setIsMessageComplete(true);
        }
    };

    // When currentAIMessage changes and is complete, add it to messages
    useEffect(() => {
        if (currentAIMessage && isMessageComplete) {
            setMessages(prev => [...prev, {
                text: currentAIMessage,
                sender: 'bot',
                timestamp: new Date().toISOString()
            }]);
            setCurrentAIMessage('');
        }
    }, [currentAIMessage, isMessageComplete]);

    const toggleChat = () => {
        if (!isOpen) {
            // When opening the chat, reset the loading state if there's no active message
            if (!currentAIMessage) {
                setIsLoading(false);
                setIsMessageComplete(true);
            }
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="chat-bot-container">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-header-content">
                            <RiRobot2Line className="ai-icon" />
                            <h3 className="ar-font-s">المساعد الذكي</h3>
                        </div>
                        <button className="close-button" onClick={toggleChat}>×</button>
                    </div>
                    <div className="chat-messages">
                        {messages.length === 0 && !isLoading && (
                            <div className="message bot welcome-message">
                                مرحباً! كيف يمكنني مساعدتك اليوم؟
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
                            >
                                {message.text}
                            </div>
                        ))}
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
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="اكتب رسالتك هنا..."
                            disabled={isLoading}
                            className="ar-font-m"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputMessage.trim()}
                            className="ar-font-s"
                        >
                            إرسال
                        </button>
                    </div>
                </div>
            )}
            <button className="chat-bot-button" onClick={toggleChat}>
                <RiRobot2Line className="ai-icon" />
            </button>
        </div>
    );
};

export default ChatBot; 