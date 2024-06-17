# Replay Tracking Contract
**pragma solidity ^0.8.0;**

## Contract Overview
This contract enables users to withdraw tokens, maintains records of user activity, and manages wallet addresses, balances, and token transfers.

## State Variables
### Wallets
```solidity
mapping (address => uint256) public wallets;
```
A mapping of wallet addresses to their current balance of tokens.

### Treasurer Address
```solidity
address public treasurerAddress;
```
The wallet address holding the tokens to be transferred.

### Owner Address
```solidity
address public owner;
```
The owner of the contract.

### Admins
```solidity
mapping (address => bool) public admins;
```
A mapping of admin addresses.

### Token Admin
```solidity
address public tokenAdmin;
```
The address of the admin who can add tokens to user wallets.

### Records
```solidity
mapping(string => Record) public consolidatedByMonthAndMovie;
mapping(string => Record) public consolidatedByMonth;
mapping(string => Record) public consolidatedByYear;
```
Mappings to store records grouped by user, movie, month, and year, as well as by user and month/year, and by user and year.

### Transactions
```solidity
mapping(string => Transaction[]) public consolidatedByMonthAndMovieTransactions;
mapping(string => Transaction[]) public consolidatedByMonthTransactions;
mapping(string => Transaction[]) public consolidatedByYearTransactions;
```
Mappings to store transactions grouped by user, movie, month, and year, as well as by user and month/year, and by user and year.

### Events
```solidity
event TokenWithdrawal(address user, uint256 amount);
event AdminAdded(address admin);
event AdminRemoved(address admin);
event TokenAdminSet(address tokenAdmin);
```
Events emitted when a user withdraws tokens, an admin is added or removed, and the token admin is set.

### Structs
```solidity
struct Record {
    uint256 timeWatched;
    uint256 amountEarned;
}

struct Transaction {
    uint256 txnId;
    address walletAddress;
    uint256 amount;
    string type_; // contentOwner, user, or protocol fees
}
```
Structs to represent a record and a transaction.

## Constructor
```solidity
constructor(address _owner, address _treasurerAddress) public {
    owner = _owner;
    treasurerAddress = _treasurerAddress;
    admins[owner] = true;
}
```
The constructor sets the owner and treasurer addresses, and adds the owner as an admin.

## Functions
### withdrawTokens
```solidity
function withdrawTokens(uint256 amount) public {
    require(wallets[msg.sender] >= amount, "Insufficient balance");
    wallets[msg.sender] -= amount;
    payable(msg.sender).transfer(amount);
    emit TokenWithdrawal(msg.sender, amount);
}
```
Allows users to withdraw tokens, subtracting the requested amount from their balance and transferring it to their wallet.

### addTokens
```solidity
function addTokens(address user, uint256 amount) public {
    require(msg.sender == tokenAdmin, "Only token admin can add tokens");
    wallets[user] += amount;
}
```
Allows the token admin to add tokens to a user's balance.

### setTreasurerAddress
```solidity
function setTreasurerAddress(address newTreasurerAddress) public {
    require(msg.sender == owner, "Only owner can set treasurer address");
    treasurerAddress = newTreasurerAddress;
}
```
Allows the owner to set the treasurer address.

### addAdmin
```solidity
function addAdmin(address newAdmin) public {
    require(msg.sender == owner, "Only owner can add admins");
    admins[newAdmin] = true;
    emit AdminAdded(newAdmin);
}
```
Allows the owner to add an admin.

### removeAdmin
```solidity
function removeAdmin(address adminToRemove) public {
    require(msg.sender == owner, "Only owner can remove admins");
    require(admins[adminToRemove], "Only existing admin can be removed");
    admins[adminToRemove] = false;
    emit AdminRemoved(adminToRemove);
}
```
Allows the owner to remove an admin.

### setTokenAdmin
```solidity
function setTokenAdmin(address newTokenAdmin) public {
    require(msg.sender == owner, "Only owner can set token admin");
    tokenAdmin = newTokenAdmin;
    emit TokenAdminSet(newTokenAdmin);
}
```
Allows the owner to set the token admin.

### incrementRecord
```solidity
function incrementRecord(
    address userID,
    uint256 movieID,
    uint256 month,
    uint256 year,
    uint256 timeWatched,
    uint256 amountEarned
) public {
    string memory key = string(abi.encodePacked(userID, "_", movieID, "_", month, "_", year));
    consolidatedByMonthAndMovie[key].timeWatched += timeWatched;
    consolidatedByMonthAndMovie[key].amountEarned += amountEarned;
}

function incrementRecord(
    address userID,
    uint256 month,
    uint256 year,
    uint256 timeWatched,
    uint256 amountEarned
) public {
    string memory key = string(abi.encodePacked(userID, "_", month, "_", year));
    consolidatedByMonth[key].timeWatched += timeWatched;
    consolidatedByMonth[key].amountEarned += amountEarned;
}

function incrementRecord(
    address userID,
    uint256 year,
    uint256 timeWatched,
    uint256 amountEarned
) public {
    string memory key = string(abi.encodePacked(userID, "_", year));
    consolidatedByYear[key].timeWatched += timeWatched;
    consolidatedByYear[key].amountEarned += amountEarned;
}
```
Increments the time watched and amount earned for each user, movie, month, and year, as well as by user and month/year, and by user and year.

### addTransaction
```solidity
function addTransaction(
    address userID,
    uint256 movieID,
    uint256 month,
    uint256 year,
    uint256 txnId,
    address walletAddress,
    uint256 amount,
    string memory type_
) public {
    string memory key = string(abi.encodePacked(userID, "_", movieID, "_", month, "_", year));
    consolidatedByMonthAndMovieTransactions[key].push(Transaction(txnId, walletAddress, amount, type_));
)

function addTransaction(
    address userID,
    uint256 month,
    uint256 year,
    uint256 txnId,
    address walletAddress,
    uint256 amount,
    string memory type_
) public {
    string memory key = string(abi.encodePacked(userID, "_", month, "_", year));
    consolidatedByMonthTransactions[key].push(Transaction(txnId, walletAddress, amount, type_));
}

function addTransaction(
    address userID,
    uint256 year,
    uint256 txnId,
    address walletAddress,
    uint256 amount,
    string memory type_
) public {
    string memory key = string(abi.encodePacked(userID, "_", year));
    consolidatedByYearTransactions[key].push(Transaction(txnId, walletAddress, amount, type_));
}
```
Adds a transaction to the corresponding mapping.
