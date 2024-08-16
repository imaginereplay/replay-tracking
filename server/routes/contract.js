const { configDotenv } = require("dotenv");
const { ethers } = require("ethers");
configDotenv();

const provider = new ethers.JsonRpcProvider(
  "https://base-sepolia-rpc.publicnode.com"
);
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

const contractABI =
  require("../../contracts/ReplayTrackingContractV2.json").abi;

const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

const serializeBigInts = (obj) => {
  const serializedObj = {};
  for (const key in obj) {
    if (typeof obj[key] === "bigint") {
      serializedObj[key] = obj[key].toString();
    } else if (typeof obj[key] === "object") {
      serializedObj[key] = serializeBigInts(obj[key]);
    } else {
      serializedObj[key] = obj[key];
    }
  }
  return serializedObj;
};

const deserializeTuple = (tuple, keys) => {
  const result = {};
  keys.forEach((key, index) => {
    result[key] =
      typeof tuple[index] === "bigint" ? tuple[index].toString() : tuple[index];
  });
  return result;
};

const contractRoutes = async (app) => {
  app.get("/balance/:address", async (request, reply) => {
    const { address } = request.params;
    try {
      if (!ethers.isAddress(address)) {
        return reply.status(400).send({ error: "Invalid address format" });
      }
      const balance = await contract.wallets(address);
      reply.send({ address, balance: balance.toString() });
    } catch (err) {
      console.error("Error fetching balance:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.post("/addTokens", async (request, reply) => {
    const { address, amount } = request.body;
    try {
      const tx = await contract.addTokens(
        address,
        ethers.parseUnits(amount, 18)
      );
      await tx.wait();
      reply.send({ success: true });
    } catch (err) {
      console.error("Error adding tokens:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.post("/updateBalance", async (request, reply) => {
    const { address, amount } = request.body;
    try {
      const tx = await contract.updateBalance(
        address,
        ethers.parseUnits(amount, 18)
      );
      await tx.wait();
      reply.send({ success: true });
    } catch (err) {
      console.error("Error updating balance:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.post("/recordAndAddTransaction", async (request, reply) => {
    const {
      userID,
      month,
      year,
      day,
      movieId,
      timeWatched,
      amountEarned,
      txnId,
      walletAddress,
      amount,
      type_,
    } = request.body;

    if (!request.body) {
      reply.status(400).send({ error: "Request body is empty" });
    }

    try {
      const result = await contract.updateRecordAndAddTransaction(request.body);

      reply.send({ success: true, result });
    } catch (error) {
      console.error("Error recording and adding transaction:", error);
      reply.status(500).send({ error: error.message });
    }
  });

  app.post("/batchIncrementRecords", async (request, reply) => {
    const { data } = request.body;
    try {
      const tx = await contract.batchIncrementRecords(data);
      await tx.wait();
      reply.send({ success: true });
    } catch (err) {
      console.error("Error in batch increment records:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.post("/emitTotalEarnedByAllUsers", async (request, reply) => {
    const { month, year } = request.body;
    try {
      const tx = await contract.emitTotalEarnedByAllUsers(month, year);
      await tx.wait();
      reply.send({ success: true });
    } catch (err) {
      console.error("Error emitting total earned by all users:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.post("/emitTopEarners", async (request, reply) => {
    const { month, year } = request.body;
    try {
      const tx = await contract.emitTopEarners(month, year);
      await tx.wait();
      reply.send({ success: true });
    } catch (err) {
      console.error("Error emitting top earners:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.get("/getConsolidatedByMovie", async (request, reply) => {
    const { userID, month, year, day, movieId } = request.query;
    try {
      const record = await contract.getConsolidatedByMovie(
        userID,
        BigInt(month),
        BigInt(year),
        BigInt(day),
        movieId
      );
      const serializedRecord = serializeBigInts({
        timeWatched: record[0],
        amountEarned: record[1],
      });
      reply.send(serializedRecord);
    } catch (err) {
      console.error("Error getting consolidated by movie:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.get("/getConsolidatedByMonth", async (request, reply) => {
    const { userID, month, year } = request.query;
    try {
      const record = await contract.getConsolidatedByMonth(
        userID,
        BigInt(month),
        BigInt(year)
      );
      const serializedRecord = serializeBigInts({
        timeWatched: record[0],
        amountEarned: record[1],
      });
      reply.send(serializedRecord);
    } catch (err) {
      console.error("Error getting consolidated by month:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.get("/getConsolidatedByYear", async (request, reply) => {
    const { userID, year } = request.query;
    try {
      const record = await contract.getConsolidatedByYear(userID, BigInt(year));
      const serializedRecord = serializeBigInts({
        timeWatched: record[0],
        amountEarned: record[1],
      });
      reply.send(serializedRecord);
    } catch (err) {
      console.error("Error getting consolidated by year:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.get("/getTransactionsByMonth", async (request, reply) => {
    const { userID, month, year } = request.query;
    try {
      const transactions = await contract.getTransactionsByMonth(
        userID,
        BigInt(month),
        BigInt(year)
      );
      const serializedTransactions = transactions.map((tx) =>
        serializeBigInts(
          deserializeTuple(tx, ["txnId", "walletAddress", "amount", "type_"])
        )
      );
      reply.send(serializedTransactions);
    } catch (err) {
      console.error("Error getting transactions by month:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.get("/getTransactionsByYear", async (request, reply) => {
    const { userID, year } = request.query;
    try {
      const transactions = await contract.getTransactionsByYear(
        userID,
        BigInt(year)
      );
      const serializedTransactions = transactions.map((tx) =>
        serializeBigInts(
          deserializeTuple(tx, ["txnId", "walletAddress", "amount", "type_"])
        )
      );
      reply.send(serializedTransactions);
    } catch (err) {
      console.error("Error getting transactions by year:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.get("/getDailyTransactions", async (request, reply) => {
    const { userID, month, year, day } = request.query;
    try {
      const transactions = await contract.getDailyTransactions(
        userID,
        BigInt(month),
        BigInt(year),
        BigInt(day)
      );
      const serializedTransactions = transactions.map((tx) =>
        serializeBigInts(
          deserializeTuple(tx, [
            "day",
            "month",
            "year",
            "txnId",
            "walletAddress",
            "amount",
            "type_",
          ])
        )
      );
      reply.send(serializedTransactions);
    } catch (err) {
      console.error("Error getting daily transactions:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.get("/getUserSummary", async (request, reply) => {
    const { userID, month, year } = request.query;
    try {
      if (month < 1 || month > 12) {
        return reply
          .status(400)
          .send({ error: "Month must be between 1 and 12" });
      }

      const summary = await contract.getUserSummary(
        userID,
        BigInt(month),
        BigInt(year)
      );
      const serializedSummary = serializeBigInts({
        totalWatched: summary[0],
        totalEarned: summary[1],
      });
      reply.send(serializedSummary);
    } catch (err) {
      console.error("Error getting user summary:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.get("/getTotalTransactionsByUser", async (request, reply) => {
    const { userID, month, year } = request.query;
    try {
      const totalTransactions = await contract.getTotalTransactionsByUser(
        userID,
        BigInt(month),
        BigInt(year)
      );
      reply.send({ totalTransactions: totalTransactions.toString() });
    } catch (err) {
      console.error("Error getting total transactions by user:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.get("/getUserDetails", async (request, reply) => {
    const { userID, topYear } = request.query;
    try {
      const userDetails = await contract.getUserDetails(
        userID,
        BigInt(topYear)
      );
      const serializedDetails = serializeBigInts({
        balance: userDetails[0],
        nonce: userDetails[1],
        totalWatched: userDetails[2],
        totalEarned: userDetails[3],
      });
      reply.send(serializedDetails);
    } catch (err) {
      console.error("Error getting user details:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.get("/getMonthlyYearlyReport", async (request, reply) => {
    const { month, year } = request.query;
    try {
      const report = await contract.getMonthlyYearlyReport(
        BigInt(month),
        BigInt(year)
      );
      const [
        users,
        monthlyWatched,
        monthlyEarned,
        yearlyWatched,
        yearlyEarned,
      ] = report;
      const serializedReport = users.map((user, index) => ({
        user,
        monthly: {
          watched: monthlyWatched[index].toString(),
          earned: monthlyEarned[index].toString(),
        },
        yearly: {
          watched: yearlyWatched[index].toString(),
          earned: yearlyEarned[index].toString(),
        },
      }));
      reply.send(serializedReport);
    } catch (err) {
      console.error("Error getting monthly yearly report:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.post("/addAdmin", async (request, reply) => {
    const { newAdmin } = request.body;
    try {
      console.log("Adding admin:", newAdmin);
      const tx = await contract.addAdmin(newAdmin);
      await tx.wait();
      reply.send({ success: true });
    } catch (err) {
      console.error("Error adding admin:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.post("/removeAdmin", async (request, reply) => {
    const { adminToRemove } = request.body;
    try {
      console.log("Removing admin:", adminToRemove);
      const tx = await contract.removeAdmin(adminToRemove);
      await tx.wait();
      reply.send({ success: true });
    } catch (err) {
      console.error("Error removing admin:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.post("/setTokenAdmin", async (request, reply) => {
    const { newTokenAdmin } = request.body;
    try {
      console.log("Setting token admin:", newTokenAdmin);
      const tx = await contract.setTokenAdmin(newTokenAdmin);
      await tx.wait();
      reply.send({ success: true });
    } catch (err) {
      console.error("Error setting token admin:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.post("/pause", async (request, reply) => {
    try {
      console.log("Pausing contract");
      const tx = await contract.pause();
      await tx.wait();
      reply.send({ success: true });
    } catch (err) {
      console.error("Error pausing contract:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  app.post("/unpause", async (request, reply) => {
    try {
      console.log("Unpausing contract");
      const tx = await contract.unpause();
      await tx.wait();
      reply.send({ success: true });
    } catch (err) {
      console.error("Error unpausing contract:", err);
      reply.status(500).send({ error: err.message });
    }
  });
};

module.exports = contractRoutes;
