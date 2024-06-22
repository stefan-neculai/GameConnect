import React, { useState, useEffect, useRef } from "react";
import IMessage from "../types/Message";
import { useAuth } from "../context/AuthContext";
import { User } from "../types/User";
import { io, Socket } from "socket.io-client";

interface ChatProps {
  receiver: User;
}

const ENDPOINT = "https://localhost:4000";

const Chat: React.FC<ChatProps> = ({ receiver }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const getUserData = (id: string) => {
    if (id == user?.id) return user;
    return receiver;
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(
        `https://localhost:4000/api/messages?sender=${user?.id}&receiver=${receiver._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    };

    fetchMessages();

    const socket = io(ENDPOINT, {
      withCredentials: true,
    });
    socketRef.current = socket;

    // Listen for messages from the server
    socket.on("message", (newMessage: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });


    // Clean up the connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [receiver]);

  const handleSendMessage = async () => {
    if (socketRef.current && input.trim() !== "" && user) {
      const messageData = {
        sender: user?.id,
        receiver: receiver._id,
        content: input,
        createdAt: new Date(),
      };

      socketRef.current.emit('message', messageData); // Emit message to the server

      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInput("");
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
    setInput(e.target.value);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{getUserData(msg.sender).username}:</strong> {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
