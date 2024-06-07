import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser'
import connectDB from './config/mongo';
import userRoutes from './routes/userRoutes';
import gameRoutes from './routes/gameRoutes';
import reviewRoutes from './routes/reviewRoutes';
import communityRoutes from './routes/communityRoutes';


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

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, '../images')));

// SSL options
const options = {
  key: fs.readFileSync(path.join(__dirname, '../cert/private.key')),
  cert: fs.readFileSync(path.join(__dirname, '../cert/certificate.crt'))
};


https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
