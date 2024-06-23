import request from 'supertest';
import { app, server } from '../index'; // Import your express app and server
import mongoose from 'mongoose';
import User from '../models/User';
import Review from '../models/Review';
import jwt from 'jsonwebtoken';

const jwtSecret = 'your_jwt_secret';

describe('Review API Tests', () => {
  let token: string, userId: any, gameId = '667838c9cba2e5a6f53f6cc8', reviewId: unknown;

  beforeAll(async () => {
    // Generate a token for the user
    const res = await request(app)
    .post('/api/signup')
    .send({
      username: 'testuser',
      email: 'testuser@test.com',
      password: 'testpass',
    });
    userId = res.body.userId; // assuming userId is returned on signup
    console.log(res.body)
    token = jwt.sign({ id: userId, email: 'testuser@test.com' }, jwtSecret, { expiresIn: '7d' });

    // Create a review for testing
    const review = new Review({
      game: gameId,
      author: { userId, username: 'testuser' },
      content: 'This is a test review',
      rating: 4
    });
    const savedReview = await review.save();
    reviewId = savedReview._id;
  });

  afterAll(async () => {
    // Clean up: delete the reviews created for the tests
    await Review.deleteMany({ game: gameId, 'author.userId': userId });
    await User.deleteMany({ email: { $in: ['testuser@test.com'] }});
    await mongoose.connection.close();
    server.close(); // Close the server
  });

  it('should create a review', async () => {
    const res = await request(app)
      .post('/api/review/create')
      .set('Cookie', `token=${token};`)
      .send({
        game: gameId,
        author: { userId, username: 'testuser' },
        content: 'This is another test review',
        rating: 5
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('content', 'This is another test review');
  });

  it('should get reviews by game id', async () => {
    const res = await request(app)
      .get(`/api/reviews/game/${gameId}`)
      .set('Cookie', `token=${token};`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ game: gameId })]));
  });

  it('should get reviews by user id', async () => {
    const res = await request(app)
      .get(`/api/reviews/user/${userId}`)
      .set('Cookie', `token=${token};`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ 'author': expect.objectContaining({ userId })})]));
  });

  it('should update a review', async () => {
    const res = await request(app)
      .put(`/api/review/update/${reviewId}`)
      .set('Cookie', `token=${token};`)
      .send({ content: 'This is an updated test review', rating: 4 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('content', 'This is an updated test review');
  });
});