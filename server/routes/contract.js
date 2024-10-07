const { configDotenv } = require("dotenv");
const { ethers } = require("ethers");
configDotenv();

const provider = new ethers.JsonRpcProvider(
  "https://curtis.rpc.caldera.xyz/http"
);
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

const contractABI = require("../abi.json").abi;

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

  app.get("/getUserHistories/:userId", async (request, reply) => {
    const { userId } = request.params;
    try {
      const userHistories = await contract.getUserHistories(userId);

      if (!userHistories || userHistories.length === 0) {
        return reply.status(404).send({ error: "Nenhum histórico encontrado para este usuário." });
      }

      const serializedHistories = userHistories.map((history) => ({
        totalDuration: history.totalDuration.toString(),
        totalRewardsConsumer: history.totalRewardsConsumer.toString(),
        totalRewardsContentOwner: history.totalRewardsContentOwner.toString(),
      }));

      reply.send(serializedHistories);
    } catch (err) {
      console.error("Erro ao buscar o histórico do usuário:", err);
      reply.status(500).send({ error: "Erro ao buscar o histórico do usuário" });
    }
  });

  app.get("/getTransactions", async (request, reply) => {
    const { userID, assetID, day, month, year } = request.query;

    try {
      let transactions;

      if (userID && day && month && year && assetID) {
        // Get transactions by userId, assetId, and createdAt
        transactions = await contract.getTransactionsByDay(
          userID,
          BigInt(day),
          BigInt(month),
          BigInt(year),
          assetID
        );
      } else if (userID && assetID) {
        // Get transactions by userId and assetId
        transactions = await contract.getTransactionsByUserIdAndAssetId(
          userID,
          assetID
        );
      } else if (userID && day && month && year) {
        // Get transactions by userId and createdAt
        transactions = await contract.getTransactionsByUserAndDate(
          userID,
          BigInt(day),
          BigInt(month),
          BigInt(year)
        );
      } else if (userID) {
        // Get transactions by userId only
        transactions = await contract.getTransactionsByUserId(userID);
      } else {
        return reply.status(400).send({ error: "Invalid query parameters" });
      }

      console.log("Transactions before:", transactions);

      if (transactions.length === 0) {
        reply.status(404).send({ error: "No transactions found" });
      } else {
        const serializedTransactions = transactions.map((txn) => ({
          userId: txn[0],
          day: txn[1].toString(),
          month: txn[2].toString(),
          year: txn[3].toString(),
          totalDuration: txn[4].toString(),
          totalRewardsConsumer: txn[5].toString(),
          totalRewardsContentOwner: txn[6].toString(),
          assetId: txn[7],
        }));

        console.log("Transactions after:", serializedTransactions);

        reply.send(serializedTransactions);
      }
    } catch (err) {
      console.error("Error getting transactions:", err);
      reply.status(500).send({ error: err.message });
    }
  });

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
