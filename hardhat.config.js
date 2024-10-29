require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    hardhat: {
      // Default network configuration
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};

// TO VERIFY CONTRACT

// require("@nomiclabs/hardhat-etherscan");

// const config = {
//   solidity: "0.8.24",
//   networks: {
//     "camp-network-testnet": {
//       url: "https://rpc.camp-network-testnet.gelato.digital", // RPC URL for Camp Network testnet
//       chainId: 325000,
//     },
//   },
//   etherscan: {
//     apiKey: {
//       "camp-network-testnet": "empty",
//     },
//     customChains: [
//       {
//         network: "camp-network-testnet",
//         chainId: 325000,
//         urls: {
//           apiURL: "https://camp-network-testnet.blockscout.com/api",
//           browserURL: "https://camp-network-testnet.blockscout.com",
//         },
//       },
//     ],
//   },
// };

// module.exports = config;
