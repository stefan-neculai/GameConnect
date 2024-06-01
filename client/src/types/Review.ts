interface Author {
  userId: string;  // Mongoose Types.ObjectId translated to TypeScript type
  username: string;
  profilePic?: string;  // Optional profile picture
}

interface Review {
  _id?: string;  // Optional because it might not be present when creating a new review
  game: string;  // Reference to the game, assumes you have the game's ID
  author: Author;  // Embedded author document
  rating: number;   // Numeric rating
  content: string;  // Text content of the review
  createdAt: Date;  // Date the review was created
  updatedAt?: Date; // Optional, date the review was last updated
}

export type { Author, Review };