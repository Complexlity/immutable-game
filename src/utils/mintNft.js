const { getDefaultProvider, Wallet } = require("ethers"); // ethers v5
const { ERC721MintByIDClient } = require("@imtbl/zkevm-contracts");


export async function mintNft(userAddress, tokenId) {
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;

// Specify who we want to receive the minted token
const RECIPIENT_ADDRESS = userAddress

if (!(PRIVATE_KEY && CONTRACT_ADDRESS && RECIPIENT_ADDRESS)) {
  throw new Error("Private Key, Contract Address, or Recipient Address missing");
  }

  console.log({CONTRACT_ADDRESS, PRIVATE_KEY, RECIPIENT_ADDRESS})

// Choose an ID for the new token
  const TOKEN_ID = tokenId

const provider = getDefaultProvider("https://rpc.testnet.immutable.com");


  // Bound contract instance
  const contract = new ERC721MintByIDClient(CONTRACT_ADDRESS);
  // The wallet of the intended signer of the mint request
  const wallet = new Wallet(PRIVATE_KEY, provider);
  // We can use the read function hasRole to check if the intended signer
  // has sufficient permissions to mint before we send the transaction


  const minterRole = await contract.MINTER_ROLE(provider);


  const hasMinterRole = await contract.hasRole(provider, minterRole, wallet.address);

  if (!hasMinterRole) {
    // Handle scenario without permissions...
    console.log("Account doesn't have permissions to mint.");
    return Promise.reject(new Error("Account doesn't have permissions to mint."));
  }

  // Rather than be executed directly, contract write functions on the SDK client are returned
  // as populated transactions so that users can implement their own transaction signing logic.

  const populatedTransaction = await contract.populateMint(RECIPIENT_ADDRESS, TOKEN_ID);

  const result = await wallet.sendTransaction(populatedTransaction);
  console.log(result); // To get the TransactionResponse value
  return result
};
