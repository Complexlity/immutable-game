import fs from "fs";
import path from "path";

export default (req, res) => {

  const filePath = path.join(process.cwd(), "/tmp/current-token-id.txt");
  const oldTokenId = Number(fs.readFileSync(filePath, "utf-8"));
  // ...
  const tokenId = oldTokenId + 1;
  fs.writeFileSync(filePath, tokenId.toString());
  // ...
  // ...
  res.status(200).json({ tokenId });
};
