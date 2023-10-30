const { config: immutableConfig, blockchainData } = require("@imtbl/sdk");

export async function getNft(tokenId) {
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // The address of the deployed collection contract
const TOKEN_ID = tokenId; // The ID of the minted token
const config = {
  baseConfig: new immutableConfig.ImmutableConfiguration({
    environment: immutableConfig.Environment.SANDBOX,
  }),
};



const client = new blockchainData.BlockchainData(config);

try {
  const response = await client.getNFT({
    chainName: "imtbl-zkevm-testnet",
    contractAddress: CONTRACT_ADDRESS,
    tokenId: TOKEN_ID,
  });

  console.log(response.result);
  return response.result;
} catch (error) {
    console.log(error)
  }
}

