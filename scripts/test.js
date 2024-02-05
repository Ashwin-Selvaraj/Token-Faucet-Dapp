const { ethers } = require("hardhat");
require("dotenv").config();
const abi =
  require("../artifacts/contracts/TokenFaucet.sol/TokenFaucet.json").abi;
async function main() {
  try {
    const provider = new ethers.JsonRpcProvider(
      "https://autumn-falling-firefly.matic-testnet.quiknode.pro/c8e3ff914ff86361fd66c6de0e7aed3c878963fb/"
    );
    const privateKey = process.env.PRIVATE_KEY;

    const wallet = new ethers.Wallet(privateKey, provider);

    const balance = await provider.getBalance(wallet.address);
    console.log(balance);
    const contract = new ethers.Contract(
      process.env.FAUCET_CONTRACT_ADDRESS,
      abi,
      wallet
    );
    const tx = await contract.drip();
    await tx.wait();
    console.log(tx.hash);
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
