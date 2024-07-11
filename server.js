require("dotenv").config();
const Fastify = require("fastify");
const { ethers } = require("ethers");

// Initialize Fastify
const fastify = Fastify({ logger: true });

// Initialize Ethers.js
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
const wallet = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider
);

// Contract ABI and Address
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "day",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "movieId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timeWatched",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountEarned",
        type: "uint256",
      },
    ],
    name: "RecordIncremented",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenAdmin",
        type: "address",
      },
    ],
    name: "TokenAdminSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "day",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "txnId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "type_",
        type: "string",
      },
    ],
    name: "TransactionAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "addAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "addTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userID",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "day",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "txnId",
        type: "string",
      },
      {
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "type_",
        type: "string",
      },
    ],
    name: "addTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "userID",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "month",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "year",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "day",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "movieId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timeWatched",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountEarned",
            type: "uint256",
          },
        ],
        internalType: "struct ReplayTrackingContractV2.BatchIncrementData[]",
        name: "data",
        type: "tuple[]",
      },
    ],
    name: "batchIncrementRecords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "consolidatedByMonth",
    outputs: [
      {
        internalType: "uint256",
        name: "timeWatched",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountEarned",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "consolidatedByMonthTransactions",
    outputs: [
      {
        internalType: "string",
        name: "txnId",
        type: "string",
      },
      {
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "type_",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "consolidatedByMovie",
    outputs: [
      {
        internalType: "uint256",
        name: "timeWatched",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountEarned",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "consolidatedByYear",
    outputs: [
      {
        internalType: "uint256",
        name: "timeWatched",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountEarned",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "consolidatedByYearTransactions",
    outputs: [
      {
        internalType: "string",
        name: "txnId",
        type: "string",
      },
      {
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "type_",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "dailyTransactions",
    outputs: [
      {
        internalType: "uint256",
        name: "day",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "txnId",
        type: "string",
      },
      {
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "type_",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
    ],
    name: "emitTopEarners",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
    ],
    name: "emitTotalEarnedByAllUsers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userID",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
    ],
    name: "getConsolidatedByMonth",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "timeWatched",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountEarned",
            type: "uint256",
          },
        ],
        internalType: "struct ReplayTrackingContractV2.Record",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userID",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "day",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "movieId",
        type: "uint256",
      },
    ],
    name: "getConsolidatedByMovie",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "timeWatched",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountEarned",
            type: "uint256",
          },
        ],
        internalType: "struct ReplayTrackingContractV2.Record",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userID",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
    ],
    name: "getConsolidatedByYear",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "timeWatched",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountEarned",
            type: "uint256",
          },
        ],
        internalType: "struct ReplayTrackingContractV2.Record",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userID",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "day",
        type: "uint256",
      },
    ],
    name: "getDailyTransactions",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "day",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "month",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "year",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "txnId",
            type: "string",
          },
          {
            internalType: "address",
            name: "walletAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "type_",
            type: "string",
          },
        ],
        internalType: "struct ReplayTrackingContractV2.DailyTransaction[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
    ],
    name: "getMonthlyYearlyReport",
    outputs: [
      {
        internalType: "address[]",
        name: "users",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "monthlyWatched",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "monthlyEarned",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "yearlyWatched",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "yearlyEarned",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userID",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
    ],
    name: "getTotalTransactionsByUser",
    outputs: [
      {
        internalType: "uint256",
        name: "totalTransactions",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userID",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
    ],
    name: "getTransactionsByMonth",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "txnId",
            type: "string",
          },
          {
            internalType: "address",
            name: "walletAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "type_",
            type: "string",
          },
        ],
        internalType: "struct ReplayTrackingContractV2.Transaction[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userID",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
    ],
    name: "getTransactionsByYear",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "txnId",
            type: "string",
          },
          {
            internalType: "address",
            name: "walletAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "type_",
            type: "string",
          },
        ],
        internalType: "struct ReplayTrackingContractV2.Transaction[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userID",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "topYear",
        type: "uint256",
      },
    ],
    name: "getUserDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalWatched",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalEarned",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userID",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
    ],
    name: "getUserSummary",
    outputs: [
      {
        internalType: "uint256",
        name: "totalWatched",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalEarned",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userID",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "day",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "movieId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeWatched",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountEarned",
        type: "uint256",
      },
    ],
    name: "incrementRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "adminToRemove",
        type: "address",
      },
    ],
    name: "removeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newTokenAdmin",
        type: "address",
      },
    ],
    name: "setTokenAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "updateBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "wallets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Routes
fastify.get("/balance/:address", async (request, reply) => {
  const { address } = request.params;
  try {
    const balance = await contract.wallets(address);
    reply.send({ address, balance: balance.toString() });
  } catch (err) {
    reply.status(500).send(err);
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
