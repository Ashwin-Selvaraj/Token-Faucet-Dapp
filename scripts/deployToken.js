const { ethers, run } = require("hardhat");
require("dotenv").config;

// const {}
async function main() {
  const private_key = process.env.PRIVATE_KEY;

  // Provider for Sepolia Testnet
  // const provider = new ethers.JsonRpcProvider(
  //   "https://sepolia.infura.io/v3/0fba3fdf4179467ba9832ac74d77445c"
  // );

  // provoider for Matic testnet
  const provider = new ethers.JsonRpcProvider(
    "https://autumn-falling-firefly.matic-testnet.quiknode.pro/c8e3ff914ff86361fd66c6de0e7aed3c878963fb/"
  );

  // provoider for Scroll sepolia testnet
  // const provider = new ethers.JsonRpcProvider('https://silent-thrilling-frost.scroll-testnet.quiknode.pro/028364d65d7818e04d58c37105ccc9e342e48c54/')

  const deployer = new ethers.Wallet(private_key, provider);
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  const balance = await provider.getBalance(deployer);
  // const balanceInEther = ethers.utils.formatEther(balance);
  console.log(balance);
  const TOKEN = await ethers.getContractFactory("AshToken");
  const token = await TOKEN.connect(deployer).deploy(100000000);
  await token.waitForDeployment();
  console.log(`AshToken contract address: ${token.target}`);
}

main();
