import express from 'express';
import cors from 'cors';
import https, { Server as HTTPSServer } from 'https';
import http, { Server as HTTPServer } from 'http';
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

if(!process.env.CORS_ORIGIN_URL) {
  throw new Error('CORS_ORIGIN_URL environment variable is not defined');
}
app.use(cors({
  origin:  process.env.CORS_ORIGIN_URL,
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

// add simle html response for /home
app.get('/home', (req, res) => {
  // can i send a html file? like index.html
  res.sendFile(path.join(__dirname, '../index.html'));

});

let options, server : HTTPServer | HTTPSServer;
if(process.env.NODE_ENV === 'production') {
  options = {
    key: fs.readFileSync('/etc/letsencrypt/live/stefanneculai.dev/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/stefanneculai.dev/fullchain.pem')
  };
  server = https.createServer(options, app);
}
else {
  options = {
    key: fs.readFileSync(path.join(__dirname, '../cert/local/private.key')),
    cert: fs.readFileSync(path.join(__dirname, '../cert/local/certificate.crt'))
  };
  server = http.createServer(app);
}


// Create a Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN_URL,
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
