import { client } from './blockchainDataConfig'

export async function getNftByAddress(accountAddress) {
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // The address of the deployed collection contract
  console.log(CONTRACT_ADDRESS)

  try {
    const response = await client.listNFTsByAccountAddress({
      chainName: "imtbl-zkevm-testnet",
      contractAddress: CONTRACT_ADDRESS,
      accountAddress,


    });
    console.log(response.result)
    return response.result;
  } catch (error) {
    console.log(error)
  }
}