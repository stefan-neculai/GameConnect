import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import mongoose from 'mongoose';
import Review from '../models/Review';

const jwtSecret = process.env.JWT_SECRET ?? 'jwtsecret'; // Use a more secure secret in production

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).send({message : 'User already exists with the given email'}); // 409 Conflict
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture : "images/default.jpg",
      bio : ""
    });
    await newUser.save();
    res.status(201).send({message : 'Sign up successful', userId : newUser._id});
  } catch (err: any) {
    res.status(500).send({message: 'Error signing up: ' + err.message});
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  console.log(email, password);
  console.log(await User.find());
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({message: 'User not found'}); // Use 404 if no user found
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).send({message : 'Invalid credentials'}); // Use a more general message
      return;
    }

    const token = jwt.sign({ id: user._id, email: user.email, username : user.username, profilePicture : user.profilePicture }, jwtSecret, { expiresIn: '7d' });
    res.status(200).json({ token });
  } catch (err: any) {
    res.status(500).send('Error logging in: ' + err.message);
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id : id });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    res.status(200).json(user);
  }
  catch (err: any) {
    res.status(500).send('Error getting user: ' + err.message);
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { username, email, password, profilePicture, bio } = req.body;
  
  try { 
    const user = await User.findOne({ _id : id });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    if(username)
      user.username = username;
    if(email)
      user.email = email;
    if(password)
      user.password = password;
    if(bio)
      user.bio = bio;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.profilePicture) {
        user.profilePicture = files.profilePicture[0].path;
        // need to update the profile picture in every review and comment
        const reviews = await Review.find({ 'author.userId' : id });
        for (let review of reviews) {
          review.author.profilePic = files.profilePicture[0].path;
          await review.save();
        }
      }
      if (files.banner) {
        user.banner = files.banner[0].path;
      }
    }
    await user.save();
    res.status(200).send('User updated successfully');
  }
  catch (err: any) {
    res.status(500).send('Error updating user: ' + err.message);
  }
}

export const addGameToFavorites = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { gameId } = req.body;
  try {
    const user = await User.findOne({ _id : id });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    user.favoriteGames.push(gameId);
    await user.save();
    res.status(200).send('Game added to favorites');
  }
  catch (err: any) {
    res.status(500).send('Error adding game to favorites: ' + err.message);
  }
}

export const removeGameFromFavorites = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { gameId } = req.body;
  try {
    const user = await User.findOne({ _id : id });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    user.favoriteGames = user.favoriteGames.filter((game : any) => !game.equals(gameId));
    await user.save();
    res.status(200).send('Game removed from favorites');
  }

  catch (err: any) {
    res.status(500).send('Error removing game from favorites: ' + err.message);
  }
}

// the id of the user to be followed is in the url, and the user initiating the request is in the jwt token
export const followUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const requestingId = (req as any).user.id;
  try {
    const user = await User.findOne({ _id : id });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    // add the requesting user to the follows list of the user to be followed
    user.followers.push(new mongoose.Types.ObjectId(requestingId));
    await user.save();

    // add the user to be followed to the follows list of the requesting user
    const requesting = await User.findOne({ _id : requestingId });
    if (!requesting) {
      res.status(404).send('Requesting user not found');
      return;
    }
    requesting.follows.push(new mongoose.Types.ObjectId(id));
    await requesting.save();

    res.status(200).send('User followed successfully');
  }
  catch (err: any) {
    res.status(500).send('Error following user: ' + err.message);
  }
}

export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const requestingId = (req as any).user.id;
  try {
    const user = await User.findOne({ _id : id });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    // remove the requesting user from the follows list of the user to be unfollowed
    user.followers = user.followers.filter((follower : any) => !follower.equals(requestingId));
    await user.save();

    // remove the user to be unfollowed from the follows list of the requesting user
    const requesting = await User.findOne({ _id : requestingId });
    if (!requesting) {
      res.status(404).send('Requesting user not found');
      return;
    }
    requesting.follows = requesting.follows.filter((follow : any) => !follow.equals(id));
    await requesting.save();

    res.status(200).send('User unfollowed successfully');
  }
  catch (err: any) {
    res.status(500).send('Error unfollowing user: ' + err.message);
  }
}

export const getFollowers = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    // get the user with id
    const user = await User.findOne({ _id : id });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    // get the followers of the user
    const followers = await User.find({ _id : { $in : user.followers } });
    res.status(200).json(followers);
  }
  catch (err: any) {
    res.status(500).send('Error getting followers: ' + err.message);
  }
}

export const getFollowing = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    // get the user with id
    const user = await User.findOne({ _id : id }); 
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    // get the users the user follows
    const following = await User.find({ _id : { $in : user.follows } });
    res.status(200).json(following);
  }
  catch (err: any) {
    res.status(500).send('Error getting following: ' + err.message);
  }
}

// gets the users who follow and are followed by the user
export const getContacts = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;

  try {
    // populate the followers and follows fields of the user
    const user = await User.findOne({ _id : userId }).populate('followers').populate('follows');
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    // make a contacts array containing the users who are in both followers and follows
    const contacts = user.followers.filter((follower: any) => user.follows.filter((follow : any) => follow.equals(follower)).length > 0);

    res.status(200).json(contacts);
  }
  catch (err: any) {
    res.status(500).send('Error getting contacts: ' + err.message);
  }
};