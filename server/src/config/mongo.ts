import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';

configDotenv();

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  console.log('mongoUri:', mongoUri);
  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not defined');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

export default connectDB;
