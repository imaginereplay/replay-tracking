require("dotenv").config();
const Fastify = require("fastify");
const { ethers } = require("ethers");

const contractJson = require("./artifacts/contracts/ReplayTrackingContractV2.sol/ReplayTrackingContractV2.json");

// Initialize Fastify
const fastify = Fastify({ logger: true });

// Initialize Ethers.js
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
const wallet = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider
);

// Contract ABI and Address
const contractABI = contractJson.abi;
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

const serializeBigInts = (obj) => {
  const serializedObj = {};
  for (const key in obj) {
    if (typeof obj[key] === 'bigint') {
      serializedObj[key] = obj[key].toString();
    } else if (typeof obj[key] === 'object') {
      serializedObj[key] = serializeBigInts(obj[key]);
    } else {
      serializedObj[key] = obj[key];
    }
  }
  return serializedObj;
};

// Function to deserialize tuple
const deserializeTuple = (tuple, keys) => {
  const result = {};
  keys.forEach((key, index) => {
    result[key] = typeof tuple[index] === 'bigint' ? tuple[index].toString() : tuple[index];
  });
  return result;
};

//Routes
fastify.get("/balance/:address", async (request, reply) => {
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

fastify.post("/addTokens", async (request, reply) => {
  const { address, amount } = request.body;
  try {
    const tx = await contract.addTokens(address, ethers.parseUnits(amount, 18));
    await tx.wait();
    reply.send({ success: true });
  } catch (err) {
    console.error("Error adding tokens:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.post("/updateBalance", async (request, reply) => {
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

fastify.post("/incrementRecord", async (request, reply) => {
  const { userID, month, year, day, movieId, timeWatched, amountEarned } =
    request.body;
  try {
    const tx = await contract.incrementRecord(
      userID,
      month,
      year,
      day,
      movieId,
      timeWatched,
      amountEarned
    );
    await tx.wait();
    reply.send({ success: true });
  } catch (err) {
    console.error("Error incrementing record:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.post("/addTransaction", async (request, reply) => {
  const { userID, month, year, day, txnId, walletAddress, amount, type_ } =
    request.body;
  try {
    const tx = await contract.addTransaction(
      userID,
      month,
      year,
      day,
      txnId,
      walletAddress,
      ethers.parseUnits(amount, 18),
      type_
    );
    await tx.wait();
    reply.send({ success: true });
  } catch (err) {
    console.error("Error adding transaction:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.post("/batchIncrementRecords", async (request, reply) => {
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

fastify.post("/emitTotalEarnedByAllUsers", async (request, reply) => {
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

fastify.post("/emitTopEarners", async (request, reply) => {
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

fastify.get("/getConsolidatedByMovie", async (request, reply) => {
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
      amountEarned: record[1]
    });
    reply.send(serializedRecord);
  } catch (err) {
    console.error("Error getting consolidated by movie:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.get("/getConsolidatedByMonth", async (request, reply) => {
  const { userID, month, year } = request.query;
  try {
    const record = await contract.getConsolidatedByMonth(userID, BigInt(month),
      BigInt(year));
    const serializedRecord = serializeBigInts({
      timeWatched: record[0],
      amountEarned: record[1]
    });
    reply.send(serializedRecord);
  } catch (err) {
    console.error("Error getting consolidated by month:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.get("/getConsolidatedByYear", async (request, reply) => {
  const { userID, year } = request.query;
  try {
    const record = await contract.getConsolidatedByYear(userID, BigInt(year));
    const serializedRecord = serializeBigInts({
      timeWatched: record[0],
      amountEarned: record[1]
    });
    reply.send(serializedRecord);
  } catch (err) {
    console.error("Error getting consolidated by year:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.get("/getTransactionsByMonth", async (request, reply) => {
  const { userID, month, year } = request.query;
  try {
    const transactions = await contract.getTransactionsByMonth(
      userID,
      BigInt(month),
      BigInt(year)
    );
    const serializedTransactions = transactions.map(tx => serializeBigInts(deserializeTuple(tx, ['txnId', 'walletAddress', 'amount', 'type_'])));
    reply.send(serializedTransactions);
  } catch (err) {
    console.error("Error getting transactions by month:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.get("/getTransactionsByYear", async (request, reply) => {
  const { userID, year } = request.query;
  try {
    const transactions = await contract.getTransactionsByYear(userID, BigInt(year));
    const serializedTransactions = transactions.map(tx => serializeBigInts(deserializeTuple(tx, ['txnId', 'walletAddress', 'amount', 'type_'])));
    reply.send(serializedTransactions);
  } catch (err) {
    console.error("Error getting transactions by year:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.get("/getDailyTransactions", async (request, reply) => {
  const { userID, month, year, day } = request.query;
  try {
    const transactions = await contract.getDailyTransactions(userID, BigInt(month), BigInt(year), BigInt(day));
    const serializedTransactions = transactions.map(tx => serializeBigInts(deserializeTuple(tx, ['day', 'month', 'year', 'txnId', 'walletAddress', 'amount', 'type_'])));
    reply.send(serializedTransactions);
  } catch (err) {
    console.error("Error getting daily transactions:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.get("/getUserSummary", async (request, reply) => {
  const { userID, month, year } = request.query;
  try {
    if (month < 1 || month > 12) {
      return reply.status(400).send({ error: "Month must be between 1 and 12" });
    }
    
    const summary = await contract.getUserSummary(userID, BigInt(month), BigInt(year));
    const serializedSummary = serializeBigInts({
      totalWatched: summary[0],
      totalEarned: summary[1]
    });
    reply.send(serializedSummary);
  } catch (err) {
    console.error("Error getting user summary:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.get("/getTotalTransactionsByUser", async (request, reply) => {
  const { userID, month, year } = request.query;
  try {
    const totalTransactions = await contract.getTotalTransactionsByUser(userID, BigInt(month), BigInt(year));
    reply.send({ totalTransactions: totalTransactions.toString() });
  } catch (err) {
    console.error("Error getting total transactions by user:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.get("/getUserDetails", async (request, reply) => {
  const { userID, topYear } = request.query;
  try {
    const userDetails = await contract.getUserDetails(userID, BigInt(topYear));
    const serializedDetails = serializeBigInts({
      balance: userDetails[0],
      nonce: userDetails[1],
      totalWatched: userDetails[2],
      totalEarned: userDetails[3]
    });
    reply.send(serializedDetails);
  } catch (err) {
    console.error("Error getting user details:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.get("/getMonthlyYearlyReport", async (request, reply) => {
  const { month, year } = request.query;
  try {
    const report = await contract.getMonthlyYearlyReport(BigInt(month), BigInt(year));
    const [users, monthlyWatched, monthlyEarned, yearlyWatched, yearlyEarned] = report;
    const serializedReport = users.map((user, index) => ({
      user,
      monthly: {
        watched: monthlyWatched[index].toString(),
        earned: monthlyEarned[index].toString()
      },
      yearly: {
        watched: yearlyWatched[index].toString(),
        earned: yearlyEarned[index].toString()
      }
    }));
    reply.send(serializedReport);
  } catch (err) {
    console.error("Error getting monthly yearly report:", err);
    reply.status(500).send({ error: err.message });
  }
});

fastify.post("/addAdmin", async (request, reply) => {
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

fastify.post("/removeAdmin", async (request, reply) => {
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

fastify.post("/setTokenAdmin", async (request, reply) => {
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

fastify.post("/pause", async (request, reply) => {
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

fastify.post("/unpause", async (request, reply) => {
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

// Start the server
const start = async () => {
  try {
    await fastify.listen({
      port: 3000,
      host: "0.0.0.0",
    });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
  }
};

start();
