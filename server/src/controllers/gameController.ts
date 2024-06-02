import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Game from '../models/Game';

export const getGames = async (req: Request, res: Response): Promise<void> => {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip: number = (page - 1) * limit;
    const search: string = (req.query.search as string) || '';


    try {
        // Create a search query object
        const searchQuery = search ? { name: { $regex: search, $options: 'i' } } : {};
    
        // Get the total count of games that match the search query
        const totalGames = await Game.countDocuments(searchQuery);
    
        // Fetch the games that match the search query with pagination
        const games = await Game.find(searchQuery).skip(skip).limit(limit);
    
        // Return the results along with pagination info
        res.status(200).json({
          total: totalGames,
          page,
          limit,
          games
        });
    } catch (err: any) {
      res.status(500).send('Error retrieving games: ' + err.message);
    }
  }

export const getGameById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const game = await Game.findOne({ _id : id });
        if (!game) {
            res.status(404).send('Game not found');
            return;
        }
        res.status(200).json(game);
    }
    catch (err: any) {
        res.status(500).send('Error retrieving game: ' + err.message);
    }
}

export const getFavoriteGames = async (req: Request, res: Response): Promise<void> => { 
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id : id });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        // this should fetch the cover art and name of the favorite games
        const favoriteGames = await Game.find({ _id : { $in : user.favoriteGames } });
        // Return the results
        res.status(200).json(favoriteGames);
    }
    catch (err: any) {
        res.status(500).send('Error getting favorite games: ' + err.message);
    }
}

