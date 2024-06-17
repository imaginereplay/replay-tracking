pragma solidity ^0.8.0;

contract ReplayTrackingContract {
    // Mapping of wallet addresses to their current balance of tokens
    mapping (address => uint256) public wallets;

    // Treasurer address: the wallet holding the tokens to be transferred
    address public treasurerAddress;

    // Owner address: the owner of the contract
    address public owner;

    // Mapping of admin addresses
    mapping (address => bool) public admins;

    // Address of the admin who can add tokens to user wallets
    address public tokenAdmin;

    // Event emitted when a user withdraws tokens
    event TokenWithdrawal(address user, uint256 amount);

    // Event emitted when an admin is added
    event AdminAdded(address admin);

    // Event emitted when an admin is removed
    event AdminRemoved(address admin);

    // Event emitted when the token admin is set
    event TokenAdminSet(address tokenAdmin);

    // Mapping to store records grouped by user, movie, month, and year
    mapping(string => Record) public consolidatedByMonthAndMovie;

    // Mapping to store records grouped by user and month/year
    mapping(string => Record) public consolidatedByMonth;

    // Mapping to store records grouped by user and year
    mapping(string => Record) public consolidatedByYear;

    // Struct to represent a record
    struct Record {
        uint256 timeWatched;
        uint256 amountEarned;
    }

    // Mapping to store transactions grouped by user, movie, month, and year
    mapping(string => Transaction[]) public consolidatedByMonthAndMovieTransactions;

    // Mapping to store Transactions grouped by user and month/year
    mapping(string => Transaction[]) public consolidatedByMonthTransactions;

    // Mapping to store Transactions grouped by user and year
    mapping(string => Transaction[]) public consolidatedByYearTransactions;

    // Struct to represent a transaction
    struct Transaction {
        uint256 txnId;
        address walletAddress;
        uint256 amount;
        string type_; // contentOwner, user, or protocol fees
    }

    // Constructor function
    constructor(address _owner, address _treasurerAddress) public {
        owner = _owner;
        treasurerAddress = _treasurerAddress;
        admins[owner] = true;
    }

    // Function to allow users to withdraw their tokens
    // TODO: add security measures
    function withdrawTokens(uint256 amount) public {
        require(wallets[msg.sender] >= amount, "Insufficient balance");
        wallets[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit TokenWithdrawal(msg.sender, amount);
    }

    // Function to add tokens to a user's balance
    function addTokens(address user, uint256 amount) public {
        require(msg.sender == tokenAdmin, "Only token admin can add tokens");
        wallets[user] += amount;
    }

    // Function to set the treasurer address
    function setTreasurerAddress(address newTreasurerAddress) public {
        require(msg.sender == owner, "Only owner can set treasurer address");
        treasurerAddress = newTreasurerAddress;
    }

    // Function to add an admin
    function addAdmin(address newAdmin) public {
        require(msg.sender == owner, "Only owner can add admins");
        admins[newAdmin] = true;
        emit AdminAdded(newAdmin);
    }

    // Function to remove an admin
    function removeAdmin(address adminToRemove) public {
        require(msg.sender == owner, "Only owner can remove admins");
        require(admins[adminToRemove], "Only existing admin can be removed");
        admins[adminToRemove] = false;
        emit AdminRemoved(adminToRemove);
    }

    // Function to set the token admin
    function setTokenAdmin(address newTokenAdmin) public {
        require(msg.sender == owner, "Only owner can set token admin");
        tokenAdmin = newTokenAdmin;
        emit TokenAdminSet(newTokenAdmin);
    }

    // Function to increment the time watched and amount earned for a user, movie, month, and year
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

    // Function to increment the time watched and amount earned for a user and month/year
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

    // Function to increment the time watched and amount earned for a user and year
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

    // Function to add a transaction
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
    }

    // Function to add a transaction
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

    // Function to add a transaction
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
}
