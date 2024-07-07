const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Replace with your deployed contract address
  const ReplayTrackingContract = await ethers.getContractFactory(
    "ReplayTrackingContract"
  );
  const contract = ReplayTrackingContract.attach(contractAddress);

  console.log("Populating contract with mock data...");

  // Example of adding tokens to a user
  const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with a valid address
  await contract.addTokens(userAddress, 1000);
  console.log(`Added 1000 tokens to ${userAddress}`);

  // Example of updating balance
  await contract.updateBalance(userAddress, 2000);
  console.log(`Updated balance of ${userAddress} to 2000 tokens`);

  // Example of incrementing records
  await contract.incrementRecord(userAddress, 6, 2023, 500, 100);
  console.log(`Incremented records for ${userAddress} for June 2023`);

  console.log("Mock data population completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
