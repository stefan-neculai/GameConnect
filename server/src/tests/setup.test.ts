import request from 'supertest';
import mongoose from 'mongoose';
import {app, server } from '../index'; // Ensure this path is correct
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

beforeAll(async () => {
  // Connect to the test database
  const url = "mongodb://localhost:27017/mydatabase";
  await mongoose.connect(url);
});

afterAll(async () => {
  // Disconnect and clean up the database
  //await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

const jwtSecret = 'your_jwt_secret';

describe("user tests", () => {
  let token: string, userId: any, otherUserId: any;

  beforeAll(async () => {
    // Create a user for login and token
    const res = await request(app)
      .post("/api/signup")
      .send({
        username: "testuser",
        email: "testuser@test.com",
        password: "testpass",
      });

    userId = res.body.userId; // assuming userId is returned on signup
    token = jwt.sign({ id: userId, email: "testuser@test.com" }, jwtSecret, { expiresIn: '7d' });
    
  });

  

  afterAll(async () => {

    await mongoose.connection.close();
    server.close()
  });
});
