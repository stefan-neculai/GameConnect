import mongoose, { Document, Schema } from 'mongoose';
import authorSchema, { IAuthor } from './Author';

// Define the main interface for the Post document
interface IPost extends Document {
  author: IAuthor;
  title: string;
  content: string;
  photo?: string;
  community: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
  likedBy: mongoose.Types.ObjectId[]; // Array of user IDs who have liked the post
  comments: mongoose.Types.ObjectId[]; // Array of comment IDs
}

// Create the schema using the defined interfaces
const postSchema = new Schema<IPost>({
  author: {type : authorSchema, required: true},
  title: { type: String, required: true},
  photo: { type: String },
  community: { type: Schema.Types.ObjectId, required: true, ref: 'Community' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], // References to users who have liked the post
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }] // References to comments on the post
});

// Create the model from the schema
const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
