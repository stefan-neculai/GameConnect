import { Request, Response } from 'express';
import Post from '../models/Post';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.json(posts);
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
      post.likedBy.push(req.body.userId);
      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (err : any) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export const unlikePost = async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      post.likedBy = post.likedBy.filter((userId) => userId !== req.body.userId);
      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (err : any) {
      res.status(500).json({ message: err.message });
    }
  };