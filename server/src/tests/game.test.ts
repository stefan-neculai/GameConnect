import request from 'supertest';
import { app, server } from '../index'; // Import your express app and server
import mongoose from 'mongoose';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const jwtSecret = 'your_jwt_secret';

describe('Game API Tests', () => {
  let token: string, userId: any, gameId = '667838c9cba2e5a6f53f6cc8';

  beforeAll(async () => {
    // Create a user for login and token
    const res = await request(app)
      .post('/api/signup')
      .send({
        username: 'testuser',
        email: 'testuser@test.com',
        password: 'testpass',
      });

    userId = res.body.userId; // assuming userId is returned on signup
    token = jwt.sign({ id: userId, email: 'testuser@test.com' }, jwtSecret, { expiresIn: '7d' });

    // Add the existing game to the user's favorite list
    await User.updateOne({ _id: userId }, { $push: { favoriteGames: gameId } });
  });

  afterAll(async () => {
    // Clean up: delete the users created for the tests
    await User.deleteMany({ email: { $in: ['testuser@test.com'] } });
    await mongoose.connection.close();
    server.close(); // Close the server
  });

  it('should get a list of games', async () => {
    const res = await request(app)
      .get('/api/games')
      .set('Cookie', `token=${token};`)
      .query({ page: 1, limit: 10 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('games');
  });

  it('should get a game by id', async () => {
    const res = await request(app)
      .get(`/api/game/${gameId}`)
      .set('Cookie', `token=${token};`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name'); // Adjust this based on the actual game data
  });

  it('should get favorite games of a user', async () => {
    const res = await request(app)
      .get(`/api/games/favorite/${userId}`)
      .set('Cookie', `token=${token};`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ _id: gameId })]));
  });

  it('should get similar games', async () => {
    const res = await request(app)
      .get(`/api/games/similar/${gameId}`)
      .set('Cookie', `token=${token};`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ category: 0 })])); // Adjust this based on actual similar games data
  });

  it('should get all genres', async () => {
    const res = await request(app)
      .get('/api/games/genres');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining(['Adventure', "Arcade", "Fighting"])); // Adjust this based on actual genres
  });

  it('should get all platforms', async () => {
    const res = await request(app)
      .get('/api/games/platforms');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining(['Nintendo Switch', 'Linux', 'Android'])); // Adjust this based on actual platforms
  });

  it('should get all game modes', async () => {
    const res = await request(app)
      .get('/api/games/modes');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining(['Single player', 'Multiplayer', 'Co-operative'])); // Adjust this based on actual game modes
  });
});
