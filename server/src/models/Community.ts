import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Community document
interface ICommunity extends Document {
  name: string;
  description: string;
  type: string; // e.g., 'game', 'genre', 'topic'
  createdAt: Date;
  members: mongoose.Types.ObjectId[]; // Array of user IDs
  relatedGame?: mongoose.Types.ObjectId; // Optional reference to a game if type is 'game'
}

// Create the schema using the defined interface
const communitySchema = new Schema<ICommunity>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  relatedGame: { type: Schema.Types.ObjectId, ref: 'Game' }
});

// Create the model from the schema
const Community = mongoose.model<ICommunity>('Community', communitySchema);

export default Community;
