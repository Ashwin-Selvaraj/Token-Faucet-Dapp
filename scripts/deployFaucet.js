const { ethers } = require("hardhat");
require("dotenv").config();
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

  const deployer = new ethers.Wallet(private_key, provider);
  console.log(`Contract deploying with the address ${deployer.address}`);
  // getting balance of the deployer
  const balance = await provider.getBalance(deployer);
  console.log(balance);

  //   contract factory is a template for deploying smart contracts
  const FAUCET = await ethers.getContractFactory("TokenFaucet");
  const faucet = await FAUCET.connect(deployer).deploy(
    "0x1e08A11FB5681485e05975Cc7b14F0Beda969afa",
    100
  );
  await faucet.waitForDeployment();
  console.log(`Faucet contract address: ${faucet.target}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
