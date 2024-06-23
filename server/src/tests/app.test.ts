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

    // Create another user for follow tests
    const res2 = await request(app)
      .post("/api/signup")
      .send({
        username: "otheruser",
        email: "otheruser@test.com",
        password: "testpass",
      });

    otherUserId = res2.body.userId;
  });

  it("login", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "testuser@test.com", password: "testpass" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("invalid credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "testuser@test.com", password: "wrongpass" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("invalid username", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "adasda", password: "wrongpass" });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "User not found");
  });

  it("signup", async () => {
    const res = await request(app)
      .post("/api/signup")
      .send({
        username: "newuser",
        email: "newuser@test.com",
        password: "newpass",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Sign up successful");
  });

  it("signup error", async () => {
    const res = await request(app)
      .post("/api/signup")
      .send({
        username: "testuser",
        email: "testuser@test.com",
        password: "testpass",
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty("message", "User already exists with the given email");
  });

  it("get user by id", async () => {
    const res = await request(app)
      .get(`/api/user/${userId}`)
      .set('Cookie',  `token=${token};`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("email", "testuser@test.com");
  });

  it("update user", async () => {
    const res = await request(app)
      .put(`/api/user/update/${userId}`)
      .set('Cookie',  `token=${token};`)
      .send({ username: "updateduser", bio: "Updated bio" });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('User updated successfully');
  });

  it("add game to favorites", async () => {
    const gameId = "667838c9cba2e5a6f53f6cc8"
    const res = await request(app)
      .put(`/api/user/favorite/${userId}`)
      .set('Cookie',  `token=${token};`)
      .send({ gameId });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Game added to favorites');
  });

  it("follow user", async () => {
    const res = await request(app)
      .put(`/api/user/follow/${otherUserId}`)
      .set('Cookie',  `token=${token};`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('User followed successfully');
  });

  it("get followers", async () => {
    const res = await request(app)
      .get(`/api/user/followers/${otherUserId}`)
      .set('Cookie',  `token=${token};`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.any(Array));
  });

  it("get following", async () => {
    const res = await request(app)
      .get(`/api/user/following/${userId}`)
      .set('Cookie',  `token=${token};`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.any(Array));
  });

  it("get contacts", async () => {
    const res = await request(app)
      .get(`/api/user/contacts`)
      .set('Cookie',  `token=${token};`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.any(Array));
  });

  afterAll(async () => {
    // Clean up: delete the users created for the tests
    await User.deleteMany({ email: { $in: ["testuser@test.com", "otheruser@test.com", "newuser@test.com"] } });
    await mongoose.connection.close();
    server.close()
  });
});
