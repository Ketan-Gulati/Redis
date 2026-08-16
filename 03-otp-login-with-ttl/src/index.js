import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpKey(phone) {
  return `otp:${phone}`;
}

//api to post phone number and generate otp and store in redis
app.post("/otp", async (req, res) => {
  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(otpKey(phone), otp, "EX", 300); //TTL set for 300 seconds

  res.json({ message: "OTP sent", otp }); //In real applications, OTP is sent via SMS
});

//api to verify the key
app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  const savedOTP = await redis.get(otpKey(phone));

  if (!savedOTP) {
    return res.status(400).json({ message: "OTP expired or not found" }); //TTL expitred
  }

  if (otp != savedOTP) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  //in this line -> validate the user before deleting key

  await redis.del(otpKey(phone));
  return res.status(200).json({ message: "Verification successful" });
});

//api to get the ttl of an otp
app.get("/otp/:phone/ttl", async (req, res) => {
  const ttl = await redis.ttl(otpKey(req.params.phone));
  res.json({ ttl });
});

app.listen(3000, () => {
  console.log("Server listening at port: 3000");
});
