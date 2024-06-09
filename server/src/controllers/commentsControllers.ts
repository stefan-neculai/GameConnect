import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Comment from '../models/Comment';

export const getComments = async (req: Request, res: Response): Promise<void> => {
    // get post id
    const postId = req.query.postId as string;
    try {
        // find comments by post id
        const comments = await Comment.find({ postId });
        res.status(200).json(comments);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

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
        // create new comment with data from request body
        console.log(req.body)
        const newComment = new Comment({
            content: req.body.content,
            post: req.body.postId,
            author: {
                userId: req.body.author.userId,
                username: req.body.author.username,
                profilePic: req.body.author.profilePic
            },
            createdAt: new Date(),
            likedBy: [req.body.author.userId],
        });
        // save new comment to database
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    }
    catch (err: any) {
        console.log(err)
        res.status(400).json({ message: err.message });
    }
}

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
        // find comment by id
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
           res.status(404).json({ message: 'Comment not found' });
           return
        }
        // add user id to likedBy array
        comment.likedBy.push(req.body.userId);
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
        // find comment by id
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        // filter out user id from likedBy array
        comment.likedBy = comment.likedBy.filter((userId) => userId !== req.body.userId);
        // save updated comment
        const updatedComment = await comment.save();
        res.json(updatedComment);
    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

