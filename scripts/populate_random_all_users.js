const { ethers } = require("hardhat");
const { v4: uuidv4 } = require("uuid"); // Import the uuid package

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress = "0x18b7CBdfFA52d1e7BB992fd50f394c5b59E20B72"; // Replace with your deployed contract address
  const ReplayTrackingContract = await ethers.getContractFactory(
    "ReplayTrackingContractV2"
  );
  const contract = ReplayTrackingContract.attach(contractAddress);

  console.log("Populating contract with mock data...");

  const users = [
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "0x590c6083980ad9cDF050533d2064c11906B6c892",
    "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
  ].map(ethers.getAddress); // Correct checksummed addresses

  const movies = [
    { id: "Movie1", timeWatched: 120 },
    { id: "Movie2", timeWatched: 90 },
    { id: "Movie3", timeWatched: 150 },
  ];

  const years = [2022, 2023];
  const months = [1, 2, 3, 4, 5, 6];
  const days = [1, 2, 3, 4, 5, 6, 7];

  // Add tokens and update balance for each user
  for (const user of users) {
    await contract.addTokens(user, 1000);
    console.log(`Added 1000 tokens to ${user}`);

    await contract.updateBalance(user, 2000);
    console.log(`Updated balance of ${user} to 2000 tokens`);
  }

  // Increment records for each user, movie, month, day, and year
  for (const user of users) {
    for (const year of years) {
      for (const month of months) {
        for (const day of days) {
          for (const movie of movies) {
            try {
              console.log(
                `Incrementing records for ${user} for ${movie.id} on day ${day}, month ${month}, and year ${year}`
              );
              await contract.incrementRecord(
                user,
                month,
                year,
                day,
                movie.id,
                movie.timeWatched,
                movie.timeWatched / 10
              );
              console.log(
                `Incremented records for ${user} for ${movie.id} on day ${day}, month ${month}, and year ${year}`
              );

              await contract.addTransaction(
                user,
                month,
                year,
                day,
                uuidv4(), // Use UUID for transaction ID
                user,
                movie.timeWatched / 10,
                "content_type"
              );
              console.log(
                `Added transaction for ${user} for ${movie.id} on day ${day}, month ${month}, and year ${year}`
              );
            } catch (error) {
              console.error(
                `Error incrementing records for ${user} for ${movie.id} on day ${day}, month ${month}, and year ${year}:`,
                error
              );
            }
          }
        }
      }
    }
  }

  // Display consolidated records and transactions for each user
  for (const userAddress of users) {
    for (const year of years) {
      for (const month of months) {
        for (const day of days) {
          for (const movie of movies) {
            try {
              const movieRecord = await contract.getConsolidatedByMovie(
                userAddress,
                month,
                year,
                day,
                movie.id
              );
              if (movieRecord.timeWatched.toNumber() !== 0) {
                console.log(
                  `Consolidated record for ${userAddress} for movie ${movie.id} on day ${day}, month ${month}, and year ${year}:`
                );
                console.table([
                  {
                    timeWatched: movieRecord.timeWatched.toString(),
                    amountEarned: movieRecord.amountEarned.toString(),
                    day,
                    month,
                    year,
                    movieId: movie.id,
                  },
                ]);
              } else {
                console.log(
                  `No consolidated record found for ${userAddress} for movie ${movie.id} on day ${day}, month ${month}, and year ${year}`
                );
              }
            } catch (error) {
              console.error(
                `Error fetching consolidated records for ${userAddress} for movie ${movie.id} on day ${day}, month ${month}, and year ${year}:`,
                error
              );
            }

            try {
              const dayTransactions = await contract.getDailyTransactions(
                userAddress,
                month,
                year,
                day
              );
              if (dayTransactions.length > 0) {
                console.log(
                  `Transactions for ${userAddress} on day ${day}, month ${month}, and year ${year}:`
                );
                console.table(
                  dayTransactions.map((tx) => ({
                    txnId: tx.txnId, // UUID is already a string
                    walletAddress: tx.walletAddress,
                    amount: tx.amount.toString(),
                    type: tx.type_,
                    day,
                    month,
                    year,
                  }))
                );
              } else {
                console.log(
                  `No transactions found for ${userAddress} on day ${day}, month ${month}, and year ${year}`
                );
              }
            } catch (error) {
              console.error(
                `Error fetching daily transactions for ${userAddress} on day ${day}, month ${month}, and year ${year}:`,
                error
              );
            }
          }

          try {
            const monthRecord = await contract.getConsolidatedByMonth(
              userAddress,
              month,
              year
            );
            console.log(
              `Consolidated record for ${userAddress} for month ${month} and year ${year}:`
            );
            console.table([
              {
                timeWatched: monthRecord.timeWatched.toString(),
                amountEarned: monthRecord.amountEarned.toString(),
                month,
                year,
              },
            ]);

            const monthTransactions = await contract.getTransactionsByMonth(
              userAddress,
              month,
              year
            );
            console.log(
              `Transactions for ${userAddress} for month ${month} and year ${year}:`
            );
            console.table(
              monthTransactions.map((tx) => ({
                txnId: tx.txnId, // UUID is already a string
                walletAddress: tx.walletAddress,
                amount: tx.amount.toString(),
                type: tx.type_,
                month,
                year,
              }))
            );
          } catch (error) {
            console.error(
              `Error fetching consolidated records and transactions for ${userAddress} for month ${month} and year ${year}:`,
              error
            );
          }
        }

        try {
          const yearRecord = await contract.getConsolidatedByYear(
            userAddress,
            year
          );
          console.log(
            `Consolidated record for ${userAddress} for year ${year}:`
          );
          console.table([
            {
              timeWatched: yearRecord.timeWatched.toString(),
              amountEarned: yearRecord.amountEarned.toString(),
              year,
            },
          ]);

          const yearTransactions = await contract.getTransactionsByYear(
            userAddress,
            year
          );
          console.log(`Transactions for ${userAddress} for year ${year}:`);
          console.table(
            yearTransactions.map((tx) => ({
              txnId: tx.txnId, // UUID is already a string
              walletAddress: tx.walletAddress,
              amount: tx.amount.toString(),
              type: tx.type_,
              year,
            }))
          );
        } catch (error) {
          console.error(
            `Error fetching consolidated records and transactions for ${userAddress} for year ${year}:`,
            error
          );
        }
      }

      try {
        // Get user summary
        const userSummary = await contract.getUserSummary(userAddress, 6, 2023);
        console.log(`User summary for ${userAddress} for June 2023:`);
        console.table([
          {
            totalWatched: userSummary.totalWatched.toString(),
            totalEarned: userSummary.totalEarned.toString(),
            month: 6,
            year: 2023,
          },
        ]);

        // Get total transactions by user for month and year
        const totalTransactions = await contract.getTotalTransactionsByUser(
          userAddress,
          6,
          2023
        );
        console.log(
          `Total transactions for ${userAddress} for June 2023:`,
          totalTransactions.toString()
        );

        // Get detailed user information
        const userDetails = await contract.getUserDetails(userAddress, 2023);
        console.log(`Detailed user information for ${userAddress}:`);
        console.table([
          {
            balance: userDetails.balance.toString(),
            nonce: userDetails.nonce.toString(),
            totalWatched: userDetails.totalWatched.toString(),
            totalEarned: userDetails.totalEarned.toString(),
            year: 2023,
          },
        ]);
      } catch (error) {
        console.error(
          `Error fetching user summary and details for ${userAddress}:`,
          error
        );
      }
    }

    try {
      // Get monthly and yearly report
      const report = await contract.getMonthlyYearlyReport(6, 2023);
      console.log("Monthly and yearly report for June 2023:");
      console.table(
        report.users.map((user, index) => ({
          user,
          monthlyWatched: report.monthlyWatched[index].toString(),
          monthlyEarned: report.monthlyEarned[index].toString(),
          yearlyWatched: report.yearlyWatched[index].toString(),
          yearlyEarned: report.yearlyEarned[index].toString(),
        }))
      );
    } catch (error) {
      console.error("Error fetching monthly and yearly report:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
