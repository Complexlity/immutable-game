const { config: immutableConfig, blockchainData } = require("@imtbl/sdk");


const config = {
  baseConfig: new immutableConfig.ImmutableConfiguration({
    environment: immutableConfig.Environment.SANDBOX,
  }),
};
const client = new blockchainData.BlockchainData(config);

export {client}