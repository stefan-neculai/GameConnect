interface IAuthor {
    userId: string;
    username: string;
    profilePic?: string;  // Marked as optional
}

// Define the main interface for the Post document
interface IPost extends Document {
  _id: string;
  author: IAuthor;
  title: string;
  content: string;
  photo?: string;
  community: string;
  createdAt: Date;
  updatedAt?: Date;
  likedBy: string[]; // Array of user IDs who have liked the post
}

export default IPost;