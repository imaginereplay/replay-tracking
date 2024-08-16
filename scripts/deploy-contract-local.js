const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const deployerPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(deployerPrivateKey, provider);

const ReplayTokenABI = require('../artifacts/contracts/ReplayTrackingContractV2.sol/ReplayTrackingContractV2.json').abi;
const ReplayTokenBytecode = require('../artifacts/contracts/ReplayTrackingContractV2.sol/ReplayTrackingContractV2.json').bytecode;

async function deployContract(contractABI, contractBytecode, constructorArgs = []) {
  const factory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);
  const contract = await factory.deploy(...constructorArgs);
  await contract.waitForDeployment()
  await contract.getAddress()
  console.log('Contract deployed to:', contract.target);
  return contract;
}

async function main() {
  const replayToken = await deployContract(ReplayTokenABI, ReplayTokenBytecode, []);
  console.log(replayToken.target)
}

main().catch(console.error);