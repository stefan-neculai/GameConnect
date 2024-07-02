import React, { useState, useEffect, useRef, act } from "react";
import IMessage from "../types/Message";
import { useAuth } from "../context/AuthContext";
import { User } from "../types/User";
import { io, Socket } from "socket.io-client";
import "./Chat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "../context/SocketContext";

interface ChatProps {
  receiver: User;
}

const ENDPOINT = "https://localhost:4000";

const Chat: React.FC<ChatProps> = ({ receiver }) => {
  const [activeUser, setActiveUser] = useState<User | null>(null); // Add this line
  const [input, setInput] = useState<string>("");
  const [contacts, setContacts] = useState<User[]>([]); // Add this line
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { user } = useAuth();
  const { messages, onlineUsers, typingUsers, socket, setOnlineUsers, setMessages,  } = useSocket();

  const getUserData = (id: string) => {
    if (id == user?.id) return user;
    return receiver;
  };

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch(`https://localhost:4000/api/user/contacts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("contacts: ", data)
        setActiveUser(data.find((contact : any) => contact._id == receiver._id) || null);
        setContacts(data);
      }
    }

    fetchContacts();
  }
  , []);

  useEffect(() => {
    fetchMessages(receiver._id);
  }, [receiver]);

  useEffect(() => {
    if(activeUser !== null) 
      fetchMessages(activeUser?._id);
  }, [activeUser]);

  const fetchMessages = async (receiverId : string) => {
    const response = await fetch(
      `https://localhost:4000/api/messages?sender=${user?.id}&receiver=${receiverId}`,
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

  const handleSendMessage = async () => {
    if (socket && input.trim() !== "" && activeUser !== null && user !== null) {
      const messageData = {
        sender: user?.id,
        receiver: activeUser?._id,
        content: input,
        createdAt: new Date(),
      };

      socket.emit('message', messageData); // Emit message to the server
      socket?.emit('stopTyping', { sender: user?.id, receiver: activeUser?._id });
      setIsTyping(false);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInput("");
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSendMessage();

    }
  }

  const handleKeyPress = (e: any) => {
    if(e.target.value.length > 0 && !isTyping) {
      socket?.emit('typing', { sender: user?.id, receiver: activeUser?._id });
      setIsTyping(true);
    }
    else if(e.target.value.length === 0 && isTyping) {
      socket?.emit('stopTyping', { sender: user?.id, receiver: activeUser?._id });
      setIsTyping(false);
    }
    setInput(e.target.value);
  };

  if(activeUser === null) return null;

  return (
    <div className="chat-container">
      <div className="chat-contacts">
        <h2>Contacts</h2>
        {contacts.map((contact, index) => (
          <div key={index} className="chat-contact" onClick={() => setActiveUser(contact)}>
            <div className="chatAvatarWrapper">
              <img src={`https://localhost:4000/${contact.profilePicture}`} alt="profile" />
              <div className={`statusIndicator ${onlineUsers.includes(contact?._id) ? 'online': 'offline'}`}/>
            </div>

            <p>{contact.username}</p>
          </div>
        ))}
      </div>
      <div className="chat-wrapper">
        <div className="chat-header">
          <h2>{activeUser?.username}</h2>
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <strong>{getUserData(msg.sender).username}:</strong> {msg.content}
            </div>
          ))}
          <div />
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={handleKeyPress}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}> <FontAwesomeIcon icon={faArrowRight}/> </button>
        </div>
        {typingUsers.includes(activeUser._id) && <p> {activeUser.username} is typing... </p>}
      </div>
      
    </div>
  );
};

export default Chat;
