import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Community from '../models/Community';

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
    try {
        const community = await Community.findOne({ _id : id });
        if (!community) {
            res.status(404).send('Community not found');
            return;
        }
        res.json(community);
    } catch (err: any) {
        res.status(500).send('Error retrieving community: ' + err.message);
    }
}

export const createCommunity = async (req: Request, res: Response): Promise<void> => {
    try {
        const community = new Community({
            name: req.body.name,
            description: req.body.description,
            members: [req.body.userId],
            posts: [],
            admins: [req.body.userId],
            createdAt: new Date(),
            relatedGame: req.body.relatedGame,
        });

        const savedCommunity = await community.save();

        res.json(savedCommunity);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

