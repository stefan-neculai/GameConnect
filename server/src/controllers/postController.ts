import { Request, Response } from 'express';
import Post from '../models/Post';

// Get posts by page and filtered by communityIds
export const getPosts = async (req: Request, res: Response) => {
  // get the page and limit query parameters
  const page: number = parseInt(req.query.page as string) || 1;
  const limit: number = parseInt(req.query.limit as string) || 10;
  const skip: number = (page - 1) * limit;
  const communityIds: string[] = (req.query.communityIds as string).split(',');
 
  try {
    // Create a search query object for community
    const searchQuery: any = {};

    if (communityIds.length > 0) {
      searchQuery.community = { $in: communityIds };
    }

    // Get the total count of posts that match the search query
    const totalPosts = await Post.countDocuments(searchQuery);

    // Fetch the posts that match the search query with pagination
    const posts = await Post.find(searchQuery).skip(skip).limit(limit);

    // Return the results along with pagination info
    res.status(200).json({
      total: totalPosts,
      page,
      limit,
      posts
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


export const createPost = async (req: Request, res: Response) => {
  const newPost = new Post({
    title : req.body.title,
    content : req.body.content,
    author : {
      userId : req.body.userId,
      username : req.body.username,
      profilePic : req.body.profilePic
    },
    likedBy : [req.body.userId],
    members : [req.body.userId],
    moderators : [req.body.userId],
    community : req.body.community,
    createdAt : new Date(),
    updatedAt : new Date(),
    photo : req.file ? req.file.path : undefined
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
    res.json(post);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPost);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted post' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const likePost = async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      post.likedBy.push((req as any).user.id);
      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (err : any) {
      res.status(500).json({ message: err.message });
    }
  };
  
export const unlikePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = (req as any).user;
    console.log(user)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.likedBy = post.likedBy.filter((userId) => {
      console.log(userId != user.id);
      return userId != user.id
    });
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err : any) {
    res.status(500).json({ message: err.message });
  }
};