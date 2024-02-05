const { ethers } = require("hardhat");
require("dotenv").config();
const abi = require("../artifacts/contracts/AshToken.sol/AshToken.json").abi;
async function main() {
  const provider = new ethers.JsonRpcProvider(
    "https://autumn-falling-firefly.matic-testnet.quiknode.pro/c8e3ff914ff86361fd66c6de0e7aed3c878963fb/"
  );
  const privateKey = process.env.PRIVATE_KEY;

  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(
    process.env.TOKEN_CONTRACT_ADDRESS,
    abi,
    wallet
  );
  const tx = await contract.balanceOf(process.env.FAUCET_CONTRACT_ADDRESS);
  //   await tx.wait();
  console.log(tx);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
