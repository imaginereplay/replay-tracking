const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const provider = deployer.provider;

  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const ReplayTrackingContract = await ethers.getContractFactory(
    "ReplayTrackingContract"
  );
  const contract = await ReplayTrackingContract.deploy();

  await contract.getAddress();

  console.log("Contract deployed to address:", contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
