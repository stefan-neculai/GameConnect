interface IAuthor {
    userId: string;
    username: string;
    profilePic?: string;  // Marked as optional
}

export interface IComment {
    _id: string;
    content: string;
    author: IAuthor;
    createdAt: string;
    likedBy: string[];
  }