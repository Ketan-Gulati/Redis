import express from "express";
import Redis from "ioredis";

const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.use(express.json());

const BANNER_KEY = "app:banner"; //this is the standard in redis to give banner key name

//to post value to key
app.post("/banner", async (req, res) => {
  await redis.set(BANNER_KEY, req.body.message || "Welcome to redis");
  res.json({ success: true });
});

//to get value from key
app.get("/banner", async (req, res) => {
  const message = await redis.get(BANNER_KEY);
  res.json({ message });
});

//to delete the key
app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);
  res.json({ success: true });
});

//to validate the key
app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);
  res.json({ exists: Boolean(exists) });
});

app.listen(3000, () => {
  console.log("Server is listening at port: 3000");
});
