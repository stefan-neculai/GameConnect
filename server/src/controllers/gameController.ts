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
    const genres: string[] = req.query.genres ? (req.query.genres as string).split(',').filter(g => g.trim() !== '') : [];
    const platforms: string[] = req.query.platforms ? (req.query.platforms as string).split(',').filter(p => p.trim() !== '') : [];
    const modes: string[] = req.query.modes ? (req.query.modes as string).split(',').filter(m => m.trim() !== '') : [];
    
    
    try {
        // Create a search query object for genre, platform, multiplayer options
        const searchQuery: any = {};

        if (search) {
            searchQuery.name = { $regex: search, $options: 'i' };
        }

        console.log(genres);

        if (genres.length !== 0) {
            searchQuery["genres.name"] = {
                $all: genres
            }

        }
        if (platforms.length !== 0) {
            searchQuery["platforms.name"] = {
                $all: platforms
            }
        }
        if (modes.length !== 0) {
            searchQuery["game_modes.name"] = {
                $all: modes
            }
        }

        // Get the total count of games that match the search query
        const totalGames = await Game.countDocuments(searchQuery);
        
        // Fetch the games that match the search query with pagination and that have the best average rating
        const games = await Game.find(searchQuery).sort({ 'averageRating': -1 }).skip(skip).limit(limit);
    
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

export const getSimilarGames = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const game = await Game.findOne({ _id : id });
        if (!game) {
            res.status(404).send('Game not found');
            return;
        }
        // this should fetch the data of the similar games based on the names found in games.similar_games
        const names = game.similar_games.map((game) => game.name);
        const similarGames = await Game.find({ name : { $in : names } });
        
        // Return the results
        res.status(200).json(similarGames);
    }
    catch (err: any) {
        res.status(500).send('Error getting similar games: ' + err.message);
    }
}

export const getAllGenres = async (req: Request, res: Response): Promise<void> => {
    try {
        const genres = await Game.distinct('genres.name');
        res.status(200).json(genres);
    }
    catch (err: any) {
        res.status(500).send('Error getting genres: ' + err.message);
    }
}

export const getAllPlatforms = async (req: Request, res: Response): Promise<void> => {
    try {
        const platforms = await Game.distinct('platforms.name');
        res.status(200).json(platforms);
    }
    catch (err: any) {
        res.status(500).send('Error getting platforms: ' + err.message);
    }
}

export const getAllGameModes = async (req: Request, res: Response): Promise<void> => {
    try {
        const gameModes = await Game.distinct('game_modes.name');
        res.status(200).json(gameModes);
    }
    catch (err: any) {
        res.status(500).send('Error getting game modes: ' + err.message);
    }
}


