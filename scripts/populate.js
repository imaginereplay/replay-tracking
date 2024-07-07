const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Replace with your deployed contract address
  const ReplayTrackingContract = await ethers.getContractFactory(
    "ReplayTrackingContract"
  );
  const contract = ReplayTrackingContract.attach(contractAddress);

  console.log("Populating contract with mock data...");

  // Example user address
  const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with a valid address

  // Add tokens to a user
  await contract.addTokens(userAddress, 1000);
  console.log(`Added 1000 tokens to ${userAddress}`);

  // Update balance
  await contract.updateBalance(userAddress, 2000);
  console.log(`Updated balance of ${userAddress} to 2000 tokens`);

  // Increment records
  await contract.incrementRecord(userAddress, 6, 2023, 500, 100);
  console.log(`Incremented records for ${userAddress} for June 2023`);

  // Add a transaction
  await contract.addTransaction(
    userAddress,
    6,
    2023,
    1,
    userAddress,
    100,
    "contentOwner"
  );
  console.log(`Added a transaction for ${userAddress} for June 2023`);

  // Ensure batchIncrementRecords is not causing reentrancy issues by breaking it out into individual transactions
  const batchData = [
    {
      userID: userAddress,
      month: 7,
      year: 2023,
      timeWatched: 300,
      amountEarned: 50,
    },
    {
      userID: userAddress,
      month: 8,
      year: 2023,
      timeWatched: 400,
      amountEarned: 70,
    },
  ];

  for (const data of batchData) {
    await contract.incrementRecord(
      data.userID,
      data.month,
      data.year,
      data.timeWatched,
      data.amountEarned
    );
    console.log(
      `Batch incremented records for ${data.userID} for month ${data.month} and year ${data.year}`
    );
  }

  // Get consolidated records by month
  const monthRecord = await contract.getConsolidatedByMonth(
    userAddress,
    6,
    2023
  );
  console.log("Consolidated record for June 2023:");
  console.table([monthRecord]);

  // Get consolidated records by year
  const yearRecord = await contract.getConsolidatedByYear(userAddress, 2023);
  console.log("Consolidated record for 2023:");
  console.table([yearRecord]);

  // Get transactions by month
  const monthTransactions = await contract.getTransactionsByMonth(
    userAddress,
    6,
    2023
  );
  console.log("Transactions for June 2023:");
  console.table(monthTransactions);

  // Get transactions by year
  const yearTransactions = await contract.getTransactionsByYear(
    userAddress,
    2023
  );
  console.log("Transactions for 2023:");
  console.table(yearTransactions);

  // Get user summary
  const userSummary = await contract.getUserSummary(userAddress, 6, 2023);
  console.log("User summary for June 2023:");
  console.table([userSummary]);

  // Get total transactions by user for month and year
  const totalTransactions = await contract.getTotalTransactionsByUser(
    userAddress,
    6,
    2023
  );
  console.log(
    `Total transactions for ${userAddress} for June 2023:`,
    totalTransactions
  );

  // Get detailed user information
  const userDetails = await contract.getUserDetails(userAddress, 2023);
  console.log("Detailed user information:");
  console.table([userDetails]);

  // Get monthly and yearly report
  const report = await contract.getMonthlyYearlyReport(6, 2023);
  console.log("Monthly and yearly report for June 2023:");
  console.table(
    report.users.map((user, index) => ({
      user,
      monthlyWatched: report.monthlyWatched[index],
      monthlyEarned: report.monthlyEarned[index],
      yearlyWatched: report.yearlyWatched[index],
      yearlyEarned: report.yearlyEarned[index],
    }))
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
