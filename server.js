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

//Routes
fastify.get("/balance/:address", async (request, reply) => {
  const { address } = request.params;
  try {
    // Validate the address format
    if (!ethers.isAddress(address)) {
      return reply.status(400).send({ error: "Invalid address format" });
    }

    // Fetch the balance from the contract's wallets mapping
    const balance = await contract.wallets(address);

    // Convert balance to string to ensure proper format in response
    reply.send({ address, balance: balance.toString() });
  } catch (err) {
    // Log the error details for debugging
    console.error("Error fetching balance:", err);

    // Send the error message in the response
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
    reply.status(500).send(err);
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
    reply.status(500).send(err);
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
    reply.status(500).send(err);
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
    reply.status(500).send(err);
  }
});

fastify.post("/batchIncrementRecords", async (request, reply) => {
  const { data } = request.body;
  try {
    const tx = await contract.batchIncrementRecords(data);
    await tx.wait();
    reply.send({ success: true });
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.post("/emitTotalEarnedByAllUsers", async (request, reply) => {
  const { month, year } = request.body;
  try {
    const tx = await contract.emitTotalEarnedByAllUsers(month, year);
    await tx.wait();
    reply.send({ success: true });
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.post("/emitTopEarners", async (request, reply) => {
  const { month, year } = request.body;
  try {
    const tx = await contract.emitTopEarners(month, year);
    await tx.wait();
    reply.send({ success: true });
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.get("/getConsolidatedByMovie", async (request, reply) => {
  const { userID, month, year, day, movieId } = request.query;
  try {
    const record = await contract.getConsolidatedByMovie(userID, month, year, day, movieId);
    reply.send(record);
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.get("/getConsolidatedByMonth", async (request, reply) => {
  const { userID, month, year } = request.query;
  try {
    const record = await contract.getConsolidatedByMonth(userID, month, year);
    reply.send(record);
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.get("/getConsolidatedByYear", async (request, reply) => {
  const { userID, year } = request.query;
  try {
    const record = await contract.getConsolidatedByYear(userID, year);
    reply.send(record);
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.get("/getTransactionsByMonth", async (request, reply) => {
  const { userID, month, year } = request.query;
  try {
    const transactions = await contract.getTransactionsByMonth(userID, month, year);
    reply.send(transactions);
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.get("/getTransactionsByYear", async (request, reply) => {
  const { userID, year } = request.query;
  try {
    const transactions = await contract.getTransactionsByYear(userID, year);
    reply.send(transactions);
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.get("/getDailyTransactions", async (request, reply) => {
  const { userID, month, year, day } = request.query;
  try {
    const transactions = await contract.getDailyTransactions(userID, month, year, day);
    reply.send(transactions);
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.get("/getUserSummary", async (request, reply) => {
  const { userID, month, year } = request.query;
  try {
    const summary = await contract.getUserSummary(userID, month, year);
    reply.send(summary);
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.get("/getTotalTransactionsByUser", async (request, reply) => {
  const { userID, month, year } = request.query;
  try {
    const totalTransactions = await contract.getTotalTransactionsByUser(userID, month, year);
    reply.send(totalTransactions);
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.get("/getUserDetails", async (request, reply) => {
  const { userID, topYear } = request.query;
  try {
    const userDetails = await contract.getUserDetails(userID, topYear);
    reply.send(userDetails);
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.get("/getMonthlyYearlyReport", async (request, reply) => {
  const { month, year } = request.query;
  try {
    const report = await contract.getMonthlyYearlyReport(month, year);
    reply.send(report);
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.post("/addAdmin", async (request, reply) => {
  const { newAdmin } = request.body;
  try {
    const tx = await contract.addAdmin(newAdmin);
    await tx.wait();
    reply.send({ success: true });
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.post("/removeAdmin", async (request, reply) => {
  const { adminToRemove } = request.body;
  try {
    const tx = await contract.removeAdmin(adminToRemove);
    await tx.wait();
    reply.send({ success: true });
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.post("/setTokenAdmin", async (request, reply) => {
  const { newTokenAdmin } = request.body;
  try {
    const tx = await contract.setTokenAdmin(newTokenAdmin);
    await tx.wait();
    reply.send({ success: true });
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.post("/pause", async (request, reply) => {
  try {
    const tx = await contract.pause();
    await tx.wait();
    reply.send({ success: true });
  } catch (err) {
    reply.status(500).send(err);
  }
});

fastify.post("/unpause", async (request, reply) => {
  try {
    const tx = await contract.unpause();
    await tx.wait();
    reply.send({ success: true });
  } catch (err) {
    reply.status(500).send(err);
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
    process.exit(1);
  }
};

start();
