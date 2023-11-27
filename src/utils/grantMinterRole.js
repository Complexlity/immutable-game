const { getDefaultProvider, Wallet } = require("ethers"); // ethers v5
const { ERC721Client } = require("@imtbl/contracts");


// const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
// const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!(PRIVATE_KEY && CONTRACT_ADDRESS)) {
  throw new Error('Private Key or Contract Address missing');
}

const provider = getDefaultProvider("https://rpc.testnet.immutable.com");

const grantMinterRole = async (provider) => {
  // Bound contract instance
  const contract = new ERC721Client(CONTRACT_ADDRESS);
  // The wallet of the intended signer of the mint request
  const wallet = new Wallet(PRIVATE_KEY, provider);

  // Give the wallet minter role access
  const populatedTransaction = await contract.populateGrantMinterRole(
    wallet.address,
    {
      maxPriorityFeePerGas: 101e9,
      maxFeePerGas: 102e9,
    }
  );
  const result = await wallet.sendTransaction(populatedTransaction);
  return result;
};

grantMinterRole(provider);
