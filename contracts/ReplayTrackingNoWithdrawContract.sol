pragma solidity ^0.8.0;

contract ReplayTrackingContract {
    // Mapping of wallet addresses to their current balance of tokens
    mapping(address => uint256) public wallets;

    // Treasurer address: the wallet holding the tokens to be transferred
    address public treasurerAddress;

    // Owner address: the owner of the contract
    address public owner;

    // Mapping of admin addresses
    mapping(address => bool) public admins;

    // Address of the admin who can add tokens to user wallets
    address public tokenAdmin;

    // Contract paused state
    bool public paused = false;

    // Mapping of movie IDs to new IDs
    mapping(uint256 => uint256) public movieIDMapping;

    // Event emitted when an admin is added
    event AdminAdded(address admin);

    // Event emitted when an admin is removed
    event AdminRemoved(address admin);

    // Event emitted when the token admin is set
    event TokenAdminSet(address tokenAdmin);

    // Event emitted when a record is incremented
    event RecordIncremented(
        address user,
        uint256 movieID,
        uint256 month,
        uint256 year,
        uint256 timeWatched,
        uint256 amountEarned
    );

    // Event emitted when a transaction is added
    event TransactionAdded(
        address user,
        uint256 movieID,
        uint256 month,
        uint256 year,
        uint256 txnId,
        address walletAddress,
        uint256 amount,
        string type_
    );

    // Event emitted when the contract is paused
    event ContractPaused();

    // Event emitted when a movie ID is updated
    event MovieIDUpdated(uint256 oldMovieID, uint256 newMovieID);

    // Mapping to store records grouped by user, movie, month, and year
    mapping(bytes32 => Record) public consolidatedByMonthAndMovie;

    // Mapping to store records grouped by user and month/year
    mapping(bytes32 => Record) public consolidatedByMonth;

    // Mapping to store records grouped by user and year
    mapping(bytes32 => Record) public consolidatedByYear;

    // Struct to represent a record
    struct Record {
        uint256 timeWatched;
        uint256 amountEarned;
    }

    // Mapping to store transactions grouped by user, movie, month, and year
    mapping(bytes32 => Transaction[])
        public consolidatedByMonthAndMovieTransactions;

    // Mapping to store Transactions grouped by user and month/year
    mapping(bytes32 => Transaction[]) public consolidatedByMonthTransactions;

    // Mapping to store Transactions grouped by user and year
    mapping(bytes32 => Transaction[]) public consolidatedByYearTransactions;

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

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin can call this function");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // Function to add tokens to a user's balance
    function addTokens(
        address user,
        uint256 amount
    ) public onlyAdmin whenNotPaused {
        require(user != address(0), "Invalid user address");
        wallets[user] += amount;
    }

    // Function to set the treasurer address
    function setTreasurerAddress(address newTreasurerAddress) public onlyOwner {
        require(newTreasurerAddress != address(0), "Invalid treasurer address");
        treasurerAddress = newTreasurerAddress;
    }

    // Function to add an admin
    function addAdmin(address newAdmin) public onlyOwner {
        require(newAdmin != address(0), "Invalid admin address");
        admins[newAdmin] = true;
        emit AdminAdded(newAdmin);
    }

    // Function to remove an admin
    function removeAdmin(address adminToRemove) public onlyOwner {
        require(admins[adminToRemove], "Only existing admin can be removed");
        admins[adminToRemove] = false;
        emit AdminRemoved(adminToRemove);
    }

    // Function to set the token admin
    function setTokenAdmin(address newTokenAdmin) public onlyOwner {
        require(newTokenAdmin != address(0), "Invalid token admin address");
        tokenAdmin = newTokenAdmin;
        emit TokenAdminSet(newTokenAdmin);
    }

    // Function to pause the contract
    function pause() public onlyAdmin {
        paused = true;
        emit ContractPaused();
    }

    // Function to update the movie ID
    function updateMovieID(
        uint256 oldMovieID,
        uint256 newMovieID
    ) public onlyAdmin whenNotPaused {
        movieIDMapping[oldMovieID] = newMovieID;
        emit MovieIDUpdated(oldMovieID, newMovieID);
    }

    // Unified function to increment the time watched and amount earned for a user
    function incrementRecord(
        address userID,
        uint256 movieID,
        uint256 month,
        uint256 year,
        uint256 timeWatched,
        uint256 amountEarned
    ) public onlyAdmin whenNotPaused {
        bytes32 keyMonthAndMovie = keccak256(
            abi.encodePacked(userID, movieID, month, year)
        );
        bytes32 keyMonth = keccak256(abi.encodePacked(userID, month, year));
        bytes32 keyYear = keccak256(abi.encodePacked(userID, year));

        // Increment by movie/month/year
        consolidatedByMonthAndMovie[keyMonthAndMovie]
            .timeWatched += timeWatched;
        consolidatedByMonthAndMovie[keyMonthAndMovie]
            .amountEarned += amountEarned;
        emit RecordIncremented(
            userID,
            movieID,
            month,
            year,
            timeWatched,
            amountEarned
        );

        // Increment by month/year
        consolidatedByMonth[keyMonth].timeWatched += timeWatched;
        consolidatedByMonth[keyMonth].amountEarned += amountEarned;

        // Increment by year
        consolidatedByYear[keyYear].timeWatched += timeWatched;
        consolidatedByYear[keyYear].amountEarned += amountEarned;
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
    ) public onlyAdmin whenNotPaused {
        bytes32 keyMonthAndMovie = keccak256(
            abi.encodePacked(userID, movieID, month, year)
        );
        bytes32 keyMonth = keccak256(abi.encodePacked(userID, month, year));
        bytes32 keyYear = keccak256(abi.encodePacked(userID, year));

        // Add transaction by movie/month/year
        consolidatedByMonthAndMovieTransactions[keyMonthAndMovie].push(
            Transaction(txnId, walletAddress, amount, type_)
        );
        emit TransactionAdded(
            userID,
            movieID,
            month,
            year,
            txnId,
            walletAddress,
            amount,
            type_
        );

        // Add transaction by month/year
        consolidatedByMonthTransactions[keyMonth].push(
            Transaction(txnId, walletAddress, amount, type_)
        );

        // Add transaction by year
        consolidatedByYearTransactions[keyYear].push(
            Transaction(txnId, walletAddress, amount, type_)
        );
    }
}
