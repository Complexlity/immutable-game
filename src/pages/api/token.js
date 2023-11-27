import { createRedisInstance } from "@/utils/redis";

const KEY_PREFIX = "TOKEN_ID2"

export default async function handler(
  req,
  res
) {
  const redis = createRedisInstance();
  const tokenId = await redis.get(KEY_PREFIX);
  let currentTokenId = Number(tokenId) || 1;
  const incrementedTokenId = currentTokenId + 1
  await redis.set(KEY_PREFIX, incrementedTokenId);
  res.status(200).json({ tokenId: currentTokenId });
}
