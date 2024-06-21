import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Comment from '../models/Comment';
import mongoose from 'mongoose';
import Post from '../models/Post';

export const getComments = async (req: Request, res: Response): Promise<void> => {
    // Get post ID from request parameters
    const { postId } = req.params;

    try {
        // Validate the post ID
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(400).json({ message: 'Invalid post ID' });
            return;
        }

        // Find comments by post ID
        const comments = await Comment.find({ post: postId });

        // Log the comments for debugging
        console.log(comments);

        // Return the comments in the response
        res.status(200).json(comments);
    } catch (err: any) {
        // Handle any errors that occur during the process
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

export const getComment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const comment = await Comment.findOne({ _id: id });
        if (!comment) {
            res.status(404).json({ message: 'Cannot find comment' });
            return;
        }
        res.json(comment);
    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract data from request body
        const { content, post, author } = req.body;

        // Validate the presence of required fields
        if (!content || !post || !author || !author.userId || !author.username || !author.profilePic) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        // Validate ObjectId for post and author.userId
        if (!mongoose.Types.ObjectId.isValid(post) || !mongoose.Types.ObjectId.isValid(author.userId)) {
            res.status(400).json({ message: 'Invalid post ID or author user ID' });
            return;
        }

        // Create new comment with data from request body
        const newComment = new Comment({
            content,
            post: post,
            author: {
                userId: author.userId,
                username: author.username,
                profilePic: author.profilePic,
            },
            createdAt: new Date(),
            likedBy: [author.userId],
        });

        // Save new comment to database
        const savedComment : any = await newComment.save();

        // Add the comment to the post
        const postDoc = await Post.findById(post);
        if (!postDoc) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        postDoc.comments.push(savedComment._id);
        await postDoc.save();

        res.status(201).json(savedComment);
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};


export const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        // find comment by id and update with data from request body
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedComment);
    }
    catch (err: any) {
        res.status(400).json({ message: err.message });
    }
}

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        // find comment by id and delete
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted comment' });
    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const likeComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        // find comment by id
        const comment = await Comment.findById(req.params.id);
     
        if (!comment) {
           res.status(404).json({ message: 'Comment not found' });
           return
        }
        // add user id to likedBy array
        comment.likedBy.push(user.id);
        // save updated comment
        const updatedComment = await comment.save();
        res.json(updatedComment);
    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const unlikeComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        // find comment by id
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        // filter out user id from likedBy array
        comment.likedBy = comment.likedBy.filter((userId) => userId != user.id);
        // save updated comment
        const updatedComment = await comment.save();
        res.json(updatedComment);
    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

