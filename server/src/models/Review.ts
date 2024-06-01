import mongoose, { Document, Schema } from 'mongoose';
import Game from './Game';

// Define interfaces for each sub-document to improve type checking
interface IAuthor {
  userId: mongoose.Types.ObjectId;
  username: string;
  profilePic?: string;  // Marked as optional
}

interface IReview extends Document {
  game: mongoose.Types.ObjectId;
  author: IAuthor;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;  // Marked as optional
}

// Create the schema using the defined interfaces
const reviewSchema = new Schema<IReview>({
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  author: {
    userId: { type: Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
    profilePic: { type: String } // Optional
  },
  rating: { type: Number, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

reviewSchema.post('save', async function() {
  // 'this' points to the current review that was saved
  const gameId = this.game;
  const game = await Game.findById(gameId);
  
  if(game === null) {
    return;
  }
  
  const reviews = await Review.find({ game: gameId });
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  game.averageRating = averageRating;
  await game.save();
});

// Mongoose middleware for handling actions after a review is deleted
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const gameId = doc.game;
    const game = await Game.findById(gameId);
  
    const reviews = await Review.find({ game: gameId });
    const averageRating = reviews.length
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

    if(game !== null) {
      game.averageRating = averageRating;
      await game.save();
    }
  }
});

// Create the model from the schema
const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
