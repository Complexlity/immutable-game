import { createRedisInstance } from "@/utils/redis";

export default async function handler(
  req,
  res
) {
  const redis = createRedisInstance();
  const tokenId = await redis.get("token-id");
  let x = Number(tokenId) || 1;
  const y = x + 1
  await redis.set("token-id", y);
  res.status(200).json({ tokenId: x });
}
