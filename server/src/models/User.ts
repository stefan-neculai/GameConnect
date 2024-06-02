import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, 'Please fill a valid email address'] },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    favoriteGames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  }, { timestamps: true });
  

const User = mongoose.model('User', userSchema);

export default User;
