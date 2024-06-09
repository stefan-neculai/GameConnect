import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Message document
interface IMessage extends Document {
  sender: mongoose.Types.ObjectId; // Reference to the User who sends the message
  receiver: mongoose.Types.ObjectId; // Reference to the User who receives the message
  content: string; // Content of the message
  createdAt: Date; // Timestamp when the message was created
}

// Create the schema using the defined interface
const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the model from the schema
const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
