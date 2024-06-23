import request from "supertest";
import { app, server } from "../index"; // Import your express app and server
import mongoose from "mongoose";
import User from "../models/User";
import Post from "../models/Post";
import jwt from "jsonwebtoken";
import Community from "../models/Community";

const jwtSecret = "your_jwt_secret";

describe("Post API Tests", () => {
  let token: string, userId: string, communityId: any, postId: unknown;

  beforeAll(async () => {
    // Generate a token for the user
    token = jwt.sign({ id: userId, email: "testuser@test.com" }, jwtSecret, {
      expiresIn: "7d",
    });

    // Optionally, you could create a user and community if not already present
    // await User.create({ _id: userId, email: 'testuser@test.com', password: 'hashedPassword' });
    // await Community.create({ _id: communityId, name: 'Test Community' });

    const res = await request(app).post("/api/signup").send({
      username: "testuser",
      email: "testuser@test.com",
      password: "testpass",
    });
    userId = res.body.userId; // assuming userId is returned on signup
    console.log(res.body);
    token = jwt.sign({ id: userId, email: "testuser@test.com" }, jwtSecret, {
      expiresIn: "7d",
    });

    // Create a community for testing
    const community = new Community({
      name: "Test Community",
      description: "This is a test community",
      members: [userId],
      moderators: [userId],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedCommunity = await community.save();
    communityId = savedCommunity?._id;

    // Create a post for testing
    const post = new Post({
      title: "Test Post",
      content: "This is a test post",
      author: {
        userId,
        username: "testuser",
        profilePic: "testpic.jpg",
      },
      likedBy: [userId],
      members: [userId],
      moderators: [userId],
      community: communityId,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    });
    const savedPost = await post.save();
    postId = savedPost._id;
  });

  afterAll(async () => {
    // Clean up: delete the posts created for the tests
    await Post.deleteMany({ community: communityId, "author.userId": userId });
    // delete user
    await User.deleteMany({ email: { $in: ["testuser@test.com"] } });
    // delete community
    await Community.deleteMany({ name: "Test Community" });
    await mongoose.connection.close();
    server.close(); // Close the server
  });

  it("should get a list of posts", async () => {
    const res = await request(app)
      .get("/api/posts")
      .set("Cookie", `token=${token};`)
      .query({ page: 1, limit: 10, communityIds: `${communityId}`, order: "new" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("posts");
  });

  it("should get a post by id", async () => {
    const res = await request(app)
      .get(`/api/posts/${postId}`)
      .set("Cookie", `token=${token};`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("title", "Test Post");
  });

  it("should create a post", async () => {
    const res = await request(app)
      .post("/api/posts/create")
      .set("Cookie", `token=${token};`)
      .send({
        title: "Another Test Post",
        content: "This is another test post",
        userId,
        username: "testuser",
        profilePic: "testpic.jpg",
        community: communityId,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("title", "Another Test Post");
  });

  it("should update a post", async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}/update`)
      .set("Cookie", `token=${token};`)
      .send({ content: "This is an updated test post" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("content", "This is an updated test post");
  });

  it("should like a post", async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}/like`)
      .set("Cookie", `token=${token};`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.likedBy).toContain(userId);
  });

  it("should unlike a post", async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}/unlike`)
      .set("Cookie", `token=${token};`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.likedBy).not.toContain(userId);
  });

  
  it("should delete a post", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}/delete`)
      .set("Cookie", `token=${token};`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Deleted post");
  });
});
