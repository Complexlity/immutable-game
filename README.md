# Immutable Game


## Technologies Used

- [Immutable Passport]('https://docs.immutable.com/docs/zkevm/products/passport/')
- [Nextjs](https://nextjs.org)

## Rules/Features of the Game

### Features

- User Authetication using immutable passport
- NFT minting
- Get all NFTs minted to your address

### Rules

- You should try to click on each card only once
- For each time you click, the cards shuffles so it gets harder to know what was clicked
- If you click twice, it resets your counter to zero and saves your score
- As there are twelve(12) cards, the maximum score you can get is 12
- If you attain this score and you are authenticated using immutable passport, you will have a free nft minted for you.
- You can view all nfts minted to you as well



## Steps Taken

Here are the steps I took to build the application

1. Uploading NFT images to pinata.

The first step is taking 11 nfts images and putting them on [pinata]('https://www.pinata.cloud/') and retrieving their CIDs.

Pinata is a decentralize storage platform which facilitates data sharing on web3.

10 nfts are the actual nft images and 1 more represents the image for the collection.

2. Creating **nft-metadata** folder and **contract.json** file.

These are the two files need to create the contract.

An nft-metadata file contains information about the nft including the name, image url, description, id, etc.

<details>
<summary>nft metadate file example</summary>
<pre>
{
      "id": 1,
      "image": "https://aquamarine-private-asp-292.mypinata.cloud/ipfs/QmThUbV2EkLdh1LX1tkyaNJSRFFfRSF6MEn29McCXchugo",
      "token_id": 1,
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
    }
</pre>
</details>

For this contract, I needed to mint 100 different NFTs.

This is because, the ERC721 specification by immutable forbids creating more that one NFT using the same token id (in layman terms: I can only use a metadata file once).
So I need to create as much as possible.

Get in [generateMetadata.js](src/utils/generateMetadata.js) function ( found in `src/utils/generateMetadata.js`).

I made this function which takes all 10 image CIDs gotten from Pinata and also takes the metadata template file and creates 100 different NFTs at random.

It then puts them in a folder called `nft-metadata`. This ensure less repetition when user's mint

**Point To Note**: A metadata file has only numerical names with no file extension. i.e 1, 2, 3 not 1.json, 2.json, ...

The *contract.json* file will contain the CID of the nft collection image and some other information about the collection

<details>
<summary> contract.json file example
<pre>
{
  "name": "My NFT Collection",
  "description": "NFT Collection on Immutable zkEVM",
  "image": "https://aquamarine-private-asp-292.mypinata.cloud/ipfs/QmUQHH944BeXaM5DN9mJnEcRuPg6xgCW4sACCRWeWXp6aP",
  "external_link": "https://some-url"
}
</pre>
</details>

3. After creating (or generating :) ) these files, I uploaded them back to `pinata`. The nft-metadata folder is uploaded as `folder` while the `contract.json` as a file and obtained their CID values after successful upload.

4. I then created need an ethereum testnet account to deploy this contract. Here are steps to do so.

- [Download Metamask Chrome Extension](https://metamask.io/download/) and Create an account.
- Copy our wallet address and get some testnet tokens from [Sepolia faucet](https://sepoliafaucet.com/).
- On success, Copy our metamask private key.([How to](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key#:~:text=On%20the%20'Account%20details'%20page,private%20key%20to%20your%20clipboard.)).

5. Next, I used [zkEVM boilerplate repository](https://github.com/immutable/zkevm-boilerplate) provided by the immutable team to quickly deploy the smart contract. Here's a summary in steps to do the same

 - Clone the repository on you local machine and install all dependencies.

  ```bash
  git clone https://github.com/immutable/zkevm-boilerplate.git
  npm install
  ```
- Rename `.env.example` to `env` and put your metamask private key in the `PRIVATE_KEY` variable
- Head to `scripts/deploy.ts` and ensure to replace the values with that of your new NFT collection. See the code snippet for reference

```
const contract: MyERC721 = await factory.connect(deployer).deploy(
    deployer.address, // owner
    "<your nft name>", // name
    "MG", // symbol
    "<your-pinata-gateway>.mypinata.cloud/ipfs/<your-nft-metadata-CID>/", // baseURI
    "<your-pinata-gateway>.mypinata.cloud/ipfs/<your-contract.json-uri>", // contractURI
    operatorAllowlist, // operator allowlist
    deployer.address, // royalty recipient
    ethers.BigNumber.from("2000") // fee numerator
  );
  ```

- Compile and Deploy

```npm
npx hardhat compile
npx hardhat run --network immutableZkevmTestnet scripts/deploy.ts
```

6. After deploying the contract, copy the contract's hash (shown on the console) as we would need it to be able to mint and get the NFTs on the client.

7. Next, we make our testnet address a minter.
Using the [grantMinterRole](src/utils/grantMinterRole.js) function and supplying the **private key** obtained from metamask and the just deployed **contract address**. I am able to give my address the ability to generate new assets.

8. I then created some utility functions needed in the client application. Here, there's three of them.

- Mint Nft - Used to create a new NFT items. Found in [src/utils/mintNft.js](src/utils/mintNft.js).
- Get Nft - Used to retrieve information about the NFT by tokenId. This is used to quickly return the newly minted NFT on the client once minted. Found in [src/utils/getNft.js](src/utils/getNft.js).

**Bug?**: I noticed that, if I mint a new item using `mintNft()` function and immediatly after, try to retrieve the newly  minted NFT using `getNft()` it returns not found (while it shouldn't be so as this item was just minted). My guess is the way the rpc works, it takes sometime to get updated transactions.
**Work Around**: Instead of fetching the recently minted NFT, I fetch the previously minted one (to avoid errors). But when the user goes to their collections, they would see the correct NFT there

- Get User's Nfts. Found in [src/utils/getNftByAddress.js](src/utils/getNftByAddress.js).  It is used to retrieve all NFTs minted to the logged in user's address. This is used to fetch the collection owned by a particular user.

9. The client side of the project was bootstrapped using [Nextjs]('https://nextjs.org').

In summary, there are 12 static images used to make 12 cards. Each card have a unique id which I used to track the `clicked` state of each.

This an example psuedocode of what happens:

```pseudocode
card clicked
if card was not clicked before
increment the score
else (card was clicked before)
reset the whole system. While doing so, check if the current score is higher than the user's max score and update best score accordingly
If you have obtained the max score (in this case 12)
reset the whole systems and save the highest score
```

10.  I then added authentication using Immutable Passport as required. Here's a detailed guide I wrote about doing so - [Detailed Guide](https://github.com/Complexlity/immutable-planner-app).

11. After doing this, I was ready to add the utility functions to the application. I took the Modal Element(https://nextui.org/docs/components/modal) from [NextUI]('https://nextui.org').I then made this component to render whenever an authenticated user reached the `end of game` (i.e complete the challenge clicking each card once).

Using React's [useEffect Hook](https://react.dev/reference/react/useEffect),
I made this component to trigger the minting and fetching whenever it renders. It calls the `mintNft()` function and then the `getNft()` function both of which are built on the immutable's sdk. This also takes some time so I have removed all possibities of closing midway to avoid causing unwanted behaviours

12. When the items is fully minted and fetched, the user would see two buttons:

- `View Nfts`: For the user to see all the items they have collected so far.
- `Close`: To close the modal now that we have completed all functions.

13. The view NFT page which then uses the `getNftsByAddress` function to show all the NFTs by the user.

### The Unique Token Id Problem

Since immutable does not allow creating multiple NFTs with the same token Id, I have to be able to track the minted NFTs i.e if I create an item with say `tokenId = 1` and try to create another with the same tokenId of 1, it fails. So I have to find a way to always increment this value each time any user mints a new item.
I created an [api route](src/pages/api/token.js) which just statically fetches the id and updates it each time. This was done using [Redis](https://redis.io/) for [speed](https://levelup.gitconnected.com/redis-vs-other-databases-an-in-depth-comparison-of-sql-and-nosql-solutions-7c4a9ca9183).

## Conclusion

I learnt quite a lot of things carrying out this bounty. I can also affirm the ease of adding authentication and interacting with the blockchain using immutable passport especially from a web2 background. And I would definitely build with it in future projects.


## Resources

- [Immutable Passport Documentation](https://docs.immutable.com/docs/zkEVM/products/passport).
- [Immutable Campaign Quest 4](https://app.stackup.dev/quest_page/quest-4---mint-your-first-nft-on-immutable-zkevm).