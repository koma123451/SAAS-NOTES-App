import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import {connectDB}  from "../config/db.js"

let mongo!: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await connectDB(mongo.getUri()); // 关键：把 uri 传进去
  process.env.JWT_SECRET = "test_secret";
});

beforeEach(async () => {
    const db = mongoose.connection.db;
    if(!db) return;
  const collections = await db.collections();
  for (const c of collections) await c.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});