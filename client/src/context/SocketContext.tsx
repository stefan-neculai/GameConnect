import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import IMessage from '../types/Message';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  messages: IMessage[];
  onlineUsers: string[];
  typingUsers: string[];
  notifications: string[];
  unseenMessages: { [userId: string]: IMessage[] };
  setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  markMessagesAsSeen: (userId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const endpoint = "https://localhost:4000";
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [unseenMessages, setUnseenMessages] = useState<{ [userId: string]: IMessage[] }>({});
  const { user } = useAuth();

  useEffect(() => {
    const socket = io(endpoint, {
      withCredentials: true,
    });
    setSocket(socket);

    // Listen for messages from the server
    socket.on("message", (newMessage: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Update unseen messages
      setUnseenMessages((prevUnseen) => {
        const userId = newMessage.sender; 
        if (!prevUnseen[userId]) {
          prevUnseen[userId] = [];
        }
        return { ...prevUnseen, [userId]: [...prevUnseen[userId], newMessage] };
      });

      // Add to notifications
      setNotifications((prevNotifications) => [...prevNotifications, `New message from ${newMessage.sender}`]);
    });

    socket.on("userOnline", (data: { onlineUsers: string[] }) => {
      console.log("Users online: ", data.onlineUsers);
      setOnlineUsers((prevUsers) => data.onlineUsers);
    });

    socket.on("userOffline", (data: { userId: string }) => {
      console.log("User offline: ", data.userId);
      setOnlineUsers((prevUsers) => prevUsers.filter((id) => id !== data.userId));
    });

    socket.on("typing", (data: { receiver: string; sender: string }) => {
      setTypingUsers((prevUsers) => [...prevUsers, data.sender]);
      console.log("Typing: ", data);
    });

    socket.on("stopTyping", (data: { receiver: string; sender: string }) => {
      setTypingUsers((prevUsers) => prevUsers.filter((id) => id !== data.sender));
      console.log("Stop typing: ", data);
    });

    // Clean up the connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markMessagesAsSeen = (userId: string) => {
    setUnseenMessages((prevUnseen) => {
      const updatedUnseen = { ...prevUnseen };
      delete updatedUnseen[userId];
      return updatedUnseen;
    });
  };

  return (
    <SocketContext.Provider value={{ socket, messages, onlineUsers, typingUsers, notifications, unseenMessages, setOnlineUsers, setMessages, markMessagesAsSeen }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within an SocketProvider');
  }
  return context;
};
