import { ethers } from "ethers";
const faucetAbi = require("../contracts/TokenFaucet.sol/TokenFaucet.json").abi;

const faucetContract = (provider) => {
  return new ethers.Contract(
    "0x330466c23b7022e625Bf781A74647742de75501A",
    faucetAbi,
    provider
  );
};

export default faucetContract;
