library ReplayLibrary {
    struct Record {
        uint256 timeWatched;
        uint256 amountEarned;
    }

    struct Transaction {
        string txnId;
        address walletAddress;
        uint256 amount;
        string type_; // contentOwner, user, or protocol fees
    }

    struct DailyTransaction {
        uint256 day;
        uint256 month;
        uint256 year;
        string txnId;
        address walletAddress;
        uint256 amount;
        string type_;
    }

    struct BatchIncrementData {
        address userID;
        uint256 month;
        uint256 year;
        uint256 day;
        string movieId;
        uint256 timeWatched;
        uint256 amountEarned;
    }

    function encodeKey(
        address userID,
        uint256 month,
        uint256 year,
        uint256 day,
        string memory movieId
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(userID, month, year, day, movieId));
    }

    function encodeMonthKey(
        address userID,
        uint256 month,
        uint256 year
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(userID, month, year));
    }

    function encodeYearKey(
        address userID,
        uint256 year
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(userID, year));
    }
}
