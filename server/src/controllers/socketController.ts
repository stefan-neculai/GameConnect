import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message'; // Import your Message model

const socketHandler = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.headers.cookie?.split('=')[1];
    if (token) {
      jwt.verify(token, 'your_jwt_secret', (err : any, decoded : any) => {
        if (err) return next(new Error('Authentication error'));
        (socket as any).user = decoded;
        socket.join(decoded.id); // Join the room with the user ID
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.join(`room_${(socket as any).user.id}`); // Join the room with the user ID
    socket.on('message', async (data) => {
      console.log(data);

      const user = (socket as any).user;
      const message = new Message({
        receiver: data.receiver,
        content: data.content,
        sender: user.id,
        createdAt: new Date(),
      });

      try {
        const newMessage = await message.save();
        io.to(data.receiver).emit('message', newMessage); // Emit to the receiver's room
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

export default socketHandler;
