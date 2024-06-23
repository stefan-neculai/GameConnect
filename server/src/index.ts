import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import connectDB from './config/mongo';
import userRoutes from './routes/userRoutes';
import gameRoutes from './routes/gameRoutes';
import reviewRoutes from './routes/reviewRoutes';
import communityRoutes from './routes/communityRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import messageRoutes from './routes/messageRoutes';
import socketHandler from './controllers/socketController';

const app = express();
const port = 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser()); 
app.use(express.json());

connectDB();

app.use('/api', userRoutes);
app.use('/api', gameRoutes);
app.use('/api', reviewRoutes);
app.use('/api', communityRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', messageRoutes);

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, '../images')));

// SSL options
const options = {
  key: fs.readFileSync(path.join(__dirname, '../cert/private.key')),
  cert: fs.readFileSync(path.join(__dirname, '../cert/certificate.crt'))
};

// Create HTTPS server
const server = https.createServer(options, app);

// Create a Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Use the socket handler
socketHandler(io);

server.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});

export { app, server };
