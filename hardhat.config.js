require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    matic: {
      url: `https://autumn-falling-firefly.matic-testnet.quiknode.pro/c8e3ff914ff86361fd66c6de0e7aed3c878963fb/`,
      accounts: [process.env.PRIVATE_KEY], // Ensure process.env.PRIVATE_KEY is defined
    },
    // scrollSepolia:
    // {
    //   url:"https://silent-thrilling-frost.scroll-testnet.quiknode.pro/028364d65d7818e04d58c37105ccc9e342e48c54/",
    //   accounts: [process.env.PRIVATE_KEY],
    // }
    // etherscan: {
    //   apiKey: process.env.ETHERSCAN_API_KEY,
    // },
  },
};
