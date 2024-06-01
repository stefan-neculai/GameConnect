import { Request, Response } from 'express';
import Review from '../models/Review'; // Assuming you have a Review model

export const getReviewsByGameId = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ game: req.params.id });
    res.json(reviews);
  } catch (err : any) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviewsByUserId = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ 'author.userId': req.params.id });
    res.json(reviews);
  } catch (err : any) {
    res.status(500).json({ message: err.message });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const review = new Review(req.body);
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (err : any) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReview);
  } catch (err : any) {
    res.status(500).json({ message: err.message });
  }
};