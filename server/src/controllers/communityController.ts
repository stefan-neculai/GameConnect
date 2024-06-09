import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Community from '../models/Community';
import Game from '../models/Game';

export const getCommunities = async (req: Request, res: Response): Promise<void> => {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip: number = (page - 1) * limit;
    const search: string = (req.query.search as string) || '';

    try {
        const searchQuery: any = {};

        if (search) {
            searchQuery.name = { $regex: search, $options: 'i' };
        }

        const totalCommunities = await Community.countDocuments(searchQuery);

        const communities = await Community.find(searchQuery).skip(skip).limit(limit);

        res.status(200).json({
            total: totalCommunities,
            page,
            limit,
            communities
        });
    } catch (err: any) {
        res.status(500).send('Error retrieving communities: ' + err.message);
    }
}

export const getCommunityById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log(id)
    try {
        const community = await Community.findOne({ _id : id });
        if (!community) {
            res.status(404).send('Community not found');
            return;
        }
        console.log(community)
        res.status(200).json(community);
    } catch (err: any) {
        res.status(500).send('Error retrieving community: ' + err.message);
    }
}

export const createCommunity = async (req: Request, res: Response): Promise<void> => {
    try {
        let file_path = req.file?.path? `https://localhost:4000/${req.file?.path}` : '';
        console.log(file_path)
        if(file_path == '') {
            // get image from related game
            const game = await Game.findOne({ _id: req.body.relatedGame });
            if(game && game.cover) {
                file_path = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/')[7]}`;
            }
        }
        console.log(`file path = ${file_path}`)
        const community = new Community({
            name: req.body.name,
            description: req.body.description,
            members: [req.body.userId],
            posts: [],
            admins: [req.body.userId],
            createdAt: new Date(),
            relatedGame: req.body.relatedGame,
            communityIcon: file_path
        });

        const savedCommunity = await community.save();

        res.json(savedCommunity);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const joinCommunity = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    // get user id from jwt
    const user = (req as any).user;
    console.log(user);
    try {
        console.log("join community")
        const community = await Community.findById({ _id: id });
        if (!community) {
            res.status(404).json({ message: 'Community not found' });
            return;
        }

        if (community.members.includes(user.id)) {
            res.status(400).json({ message: 'User already in community' });
            return;
        }

        community.members.push(user.id);
        const updatedCommunity = await community.save();
        res.json(updatedCommunity);
    } catch (err: any) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }
}

