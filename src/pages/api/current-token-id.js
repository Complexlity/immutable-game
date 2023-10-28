import fs from "fs";
import path from "path";

export default (req, res) => {
  console.log("I am here")
  const filePath = path.join(process.cwd(), "current-token-id.txt");
  const oldTokenId = Number(fs.readFileSync(filePath, "utf-8"));
  // ...
  const tokenId = oldTokenId + 1;
  fs.writeFileSync(filePath, tokenId.toString());
  // ...
  // ...
  res.status(200).json({ tokenId });
};
