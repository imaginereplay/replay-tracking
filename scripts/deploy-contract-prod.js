const { configDotenv } = require("dotenv");
const { ethers } = require("ethers");

const ReplayTokenABI =
  require("../artifacts/contracts/ReplayTrackingContractV2.sol/ReplayTrackingContractV3.json").abi;
const ReplayTokenBytecode =
  require("../artifacts/contracts/ReplayTrackingContractV2.sol/ReplayTrackingContractV3.json").bytecode;

configDotenv();

const provider = new ethers.JsonRpcProvider(
  "https://rpc-campnetwork.xyz"
);
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;

async function deployContract(constructorArgs = []) {
  const wallet = new ethers.Wallet(deployerPrivateKey, provider);
  const factory = new ethers.ContractFactory(
    ReplayTokenABI,
    ReplayTokenBytecode,
    wallet
  );

  const feeData = await provider.getFeeData();

  const gasPrice = feeData.gasPrice;

  const contract = await factory.deploy(...constructorArgs, {
    gasPrice,
  });

  await contract.waitForDeployment();
  console.log("Contract deployed to:", contract);
  return contract;
}

async function checkBalance(wallet) {
  const balance = await wallet.provider.getBalance(wallet.address);
  console.log(`Wallet balance: ${ethers.utils.formatEther(balance)} ETH`);
}

async function main() {
  const replayToken = await deployContract();
  console.log(replayToken.address);
}

main().catch(console.error);
