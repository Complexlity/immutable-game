const fs = require("fs");
const path = require("path");

const cids = [
  "QmRz9cx8aWd1hJRhuHNpJV5L2dgvzEv1eiEjj3Z9sKeVXk",
  "QmVGMcAwwvYdxNVoymgBssKmcQHgnxuJQs66EGGXdadwLi",
  "QmRCJuaGXd1YbgxWHMZFGRyGMgjiSSrDhZYmEt2Ukvz1RD",
  "QmThUbV2EkLdh1LX1tkyaNJSRFFfRSF6MEn29McCXchugo",
  "QmYgY1ijbbPFLGFT6RS7vWmp2wT4uCP2AHyMwpt89EjcCU",
  "QmVDNzNbxYyguxoBjJXEd3P7zvBaCnXadSBJQPPmQ42Vj8",
  "QmXPTZh4ojzFwbbRgSAwQ9wERUuJyiMjhJ1vpUHoUQrjZu",
  "QmTqN4k7WnESCgqiqH7QfwapMJ52AkxFMTZtf1EiufR6fg",
  "QmQKuwrNb1ZktFafFiwBNHu9zxPZUDGZ2j4oHc8W8M5Q4A",
  "QmPzy1pj8swAVBfVmfJZWnsmbWB6kp7R2DdivTMJdSxx6U",
];

function generateRandomCID() {
  const randomIndex = Math.floor(Math.random() * cids.length);
  return cids[randomIndex];
}

function generateNFTMetadata() {
  const nftFolder = "nft-metadata";
  if (!fs.existsSync(nftFolder)) {
    fs.mkdirSync(nftFolder);
  }

  for (let tokenId = 1; tokenId <= 100; tokenId++) {
    const cid = generateRandomCID();
    const template = `{
      "id": ${tokenId},
      "image": "https://aquamarine-private-asp-292.mypinata.cloud/ipfs/${cid}",
      "token_id": ${tokenId},
      "background_color": null,
      "animation_url": null,
      "youtube_url": null,
      "name": "Memory Game NFT",
      "description": "This is the nft for the winner of the memory game",
      "external_url": null,
      "attributes": [
        {
          "trait_type": "Rarity",
          "value": "Unique"
        }
      ]
    }`;

    const filename = path.join(nftFolder, tokenId.toString());
    fs.writeFileSync(filename, template);
  }
}

generateNFTMetadata();
