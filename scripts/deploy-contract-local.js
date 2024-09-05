const { configDotenv } = require("dotenv");
const { ethers } = require("ethers");
configDotenv();

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
const wallet = new ethers.Wallet(deployerPrivateKey, provider);

const ReplayTokenABI =
  require("../artifacts/contracts/ReplayTrackingContractV2.sol/ReplayTrackingContractV3.json").abi;
const ReplayTokenBytecode =
  require("../artifacts/contracts/ReplayTrackingContractV2.sol/ReplayTrackingContractV3.json").bytecode;

async function deployContract(
  contractABI,
  contractBytecode,
  constructorArgs = []
) {
  const factory = new ethers.ContractFactory(
    contractABI,
    contractBytecode,
    wallet
  );
  const contract = await factory.deploy(...constructorArgs);
  await contract.waitForDeployment();
  await contract.getAddress();
  console.log("Contract deployed to:", contract.target);
  return contract;
}

async function main() {
  const replayToken = await deployContract(
    ReplayTokenABI,
    ReplayTokenBytecode,
    []
  );
  console.log(replayToken.target);
}

main().catch(console.error);
