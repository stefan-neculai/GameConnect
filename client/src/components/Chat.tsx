import React, { useState, useEffect, useRef, act } from "react";
import IMessage from "../types/Message";
import { useAuth } from "../context/AuthContext";
import { User } from "../types/User";
import { io, Socket } from "socket.io-client";
import "./Chat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface ChatProps {
  receiver: User;
}

const ENDPOINT = "https://localhost:4000";

const Chat: React.FC<ChatProps> = ({ receiver }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null); // Add this line
  const [input, setInput] = useState<string>("");
  const [contacts, setContacts] = useState<User[]>([]); // Add this line
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
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
    if (socketRef.current && input.trim() !== "" && activeUser !== null && user !== null) {
      const messageData = {
        sender: user?.id,
        receiver: activeUser?._id,
        content: input,
        createdAt: new Date(),
      };

      socketRef.current.emit('message', messageData); // Emit message to the server

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
    setInput(e.target.value);
  };

  return (
    <div className="chat-container">
      <div className="chat-contacts">
        <h2>Contacts</h2>
        {contacts.map((contact, index) => (
          <div key={index} className="chat-contact" onClick={() => setActiveUser(contact)}>
            <img src={`https://localhost:4000/${contact.profilePicture}`} alt="profile" />
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
          <div ref={messagesEndRef} />
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
      </div>
      
    </div>
  );
};

export default Chat;
