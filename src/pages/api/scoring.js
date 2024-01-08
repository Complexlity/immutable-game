
import { createRedisInstance } from "@/utils/redis";
import { isAddress } from 'web3-validator';
import Cors from "cors";

const KEY_PREFIX = process.env.SCORE_KEY_PREFIX
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  origin: '*'
})

function runMiddleware(
  req,
  res,
  fn
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req,
  res
) {

await runMiddleware(req, res, cors)


  const redis = createRedisInstance();
  let currentHighestScore = await redis.get(KEY_PREFIX);
  currentHighestScore = Number(currentHighestScore) || 0;

  if (req.method === 'POST') {
    const body = req.body
    const scoreIsNumber = typeof body.score == 'number' && !isNaN(body.score)
    if (!body.email || !body.address || !scoreIsNumber || !isAddress(body.address)) {
      return res.status(500).json({ status: 500, message: "Some credential values missing or invalid" })
    }
    if (body.score > currentHighestScore) {
      await redis.set(KEY_PREFIX, body.score);
      return res.status(200).json({ status: 200, success: true, message: "Congratulations. Your Got The Highest Score" })
    }
    else {
      return res.status(200).json({ status: 200, success: false, message: `Sorry ${body.email} you didn't beat the highest score yet` })
    }
  }
  return res.status(200).json({ highestScore: currentHighestScore })
}
