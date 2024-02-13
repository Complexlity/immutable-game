import { createRedisInstance } from "@/utils/redis";
import { isAddress } from "web3-validator";
import Cors from "cors";

const KEY_PREFIX = process.env.SCORE_KEY_PREFIX;
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
  origin: [
    "http://localhost:5500",
    "https://stackup-invaders.vercel.app",
    "https://stackup-invaders.netlify.app",
  ],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const redis = createRedisInstance();
  let currentHighestScoreObject = await redis.hgetall(KEY_PREFIX);
  const currentHighestScore = Number(currentHighestScoreObject.score) || 0;

  if (req.method === "POST") {
    const body = req.body;
    const scoreIsNumber = (value) => typeof value == "number" && !isNaN(value);

    if (
      !scoreIsNumber(body.score) ||
      !body.userAddress ||
      !isAddress(body.userAddress)
    ) {
      redis.disconnect();

      return res.status(500).json({
        status: 500,
        message: "Some credential values missing or invalid",
      });
    }
    if (body.score > currentHighestScore) {
      const hashed = { score: body.score, userAddress: body.userAddress };
      try {
        await redis.hset(KEY_PREFIX, hashed);
        return res.status(200).json({ status: 200, message: hashed });
      } catch (error) {
        console.log(error);
        redis.disconnect();

        return res
          .status(500)
          .json({ status: 500, message: "Something went wrong" });
      }
    } else {
      redis.disconnect();

      return res
        .status(200)
        .json({
          status: 200,
          success: false,
          message: `Sorry ${body.address} you didn't beat the highest score yet`,
        });
    }
  } else {
    redis.disconnect();
    return res.status(200).json({
      status: 200,
      message: currentHighestScoreObject,
    });
  }
}
