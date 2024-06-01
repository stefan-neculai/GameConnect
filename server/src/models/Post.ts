import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the author's reference
interface IAuthor {
    userId: mongoose.Types.ObjectId;
    username: string;
    profilePic?: string;  // Marked as optional
}

// Define the main interface for the Post document
interface IPost extends Document {
  author: IAuthor;
  content: string;
  relatedGame?: mongoose.Types.ObjectId; // Optional reference to a game
  createdAt: Date;
  updatedAt?: Date;
}

// Create the schema using the defined interfaces
const postSchema = new Schema<IPost>({
  author: {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    username: { type: String, required: true }
  },
  content: { type: String, required: true },
  relatedGame: { type: Schema.Types.ObjectId, ref: 'Game' }, // Optional reference to a game
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// Create the model from the schema
const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
