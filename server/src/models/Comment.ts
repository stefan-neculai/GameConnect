import mongoose, { Document, Schema } from 'mongoose';
import authorSchema, { IAuthor } from './Author';

// Define an interface for the Comment document
interface IComment extends Document {
  content: string;
  author: IAuthor; // Reference to the User who made the comment
  post: mongoose.Types.ObjectId; // Reference to the Post the comment belongs to
  commentParent: mongoose.Types.ObjectId; // Reference to the
  createdAt: Date;
  likedBy: mongoose.Types.ObjectId[]; // Array of user IDs who have liked the comment
}

// Create the schema using the defined interface
const commentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  author: { type: authorSchema, required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  commentParent: { type: Schema.Types.ObjectId, ref: 'Comment' }, // Reference to the parent comment
  createdAt: { type: Date, default: Date.now },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }] // References to users who have liked the comment
});

// Create the model from the schema
const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
