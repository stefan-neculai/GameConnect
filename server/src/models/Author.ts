import mongoose, { Document, Schema } from 'mongoose';

// Define interfaces for each sub-document to improve type checking
export interface IAuthor {
  userId: mongoose.Types.ObjectId;
  username: string;
  profilePic?: string;  // Marked as optional
}

// Create the schema for the author sub-document
const authorSchema = new Schema<IAuthor>({
  userId: { type: Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  profilePic: { type: String } // Optional
});

export default authorSchema;