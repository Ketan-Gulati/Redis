import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

//redis client

//6379 is coming from docker compose >> redis will get connected to docker
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

//test api to ping redis
app.get("/redis", async (req, res) => {
  const reply = await redis.ping();
  res.json({ redis: reply });
});

//mongoose test api
app.get("/mongo", async (req, res) => {
  const url = process.env.MONGO_URL || "mongodb://localhost:27017/ketan_redis";

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(url);
  }

  res.json({ mongo: "connected", dbName: mongoose.connection.name });
});

app.listen(3000, () => {
  console.log("Server is running at port: 3000");
});
