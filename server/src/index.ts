import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ConnectOptions } from 'mongoose';
import authenticateToken from './middleware/auth'; // Import the middleware

const app = express();
const port = 4000;
const jwtSecret = 'your_jwt_secret'; // Replace with a secure secret in production

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // or your client's origin
  credentials: true
}));

app.use(express.json()); // Built-in middleware to parse JSON bodies


mongoose.connect('mongodb://localhost:27017/mydatabase').then(() => {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body)
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send('Sign up successful');
  } catch (err: any) {
    res.status(500).send('Error signing up: ' + err.message);
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: '7d' });
    res.status(200).json({ token });
  } catch (err : any) {
    res.status(500).send('Error logging in: ' + err.message);
  }
});

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).send('Error retrieving users: ' + err.message);
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
