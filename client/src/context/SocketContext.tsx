import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import IMessage from '../types/Message';
import { useAuth } from './AuthContext';
import  notificationSound  from '../assets/level-up-191997.mp3';
import useSound from 'use-sound';
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
  const endpoint = process.env.REACT_APP_SOCKET_ENDPOINT || 'http://localhost:4000';
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [unseenMessages, setUnseenMessages] = useState<{ [userId: string]: IMessage[] }>({});
  const [isChatOpen, setChatOpen] = useState(false);
  const { user } = useAuth();
  const [playSound] = useSound(notificationSound);
  useEffect(() => {
    const socket = io(endpoint, {
      withCredentials: true,
    });
    setSocket(socket);

    // Listen for messages from the server
    socket.on("message", (newMessage: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if(!isChatOpen)
        playSound();
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
      setOnlineUsers((prevUsers) => data.onlineUsers);
    });

    socket.on("userOffline", (data: { userId: string }) => {
      setOnlineUsers((prevUsers) => prevUsers.filter((id) => id !== data.userId));
    });

    socket.on("typing", (data: { receiver: string; sender: string }) => {
      setTypingUsers((prevUsers) => [...prevUsers, data.sender]);
    });

    socket.on("stopTyping", (data: { receiver: string; sender: string }) => {
      setTypingUsers((prevUsers) => prevUsers.filter((id) => id !== data.sender));
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
